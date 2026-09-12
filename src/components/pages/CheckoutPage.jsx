"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { formatCurrency, cn } from "@/lib/utils";
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ShoppingBag,
  Tag,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  AlertCircle,
  Percent,
  Check,
  X,
  Loader2,
  FileText,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAddressesQuery, useCreateAddressMutation } from "@/hooks/useAddressesQuery";
import {
  useCheckoutSettingsQuery,
  useCheckDeliveryMutation,
  useAvailableCouponsQuery,
  useValidateCouponMutation,
  useCreateQuoteMutation,
  useConfirmQuoteMutation,
} from "@/hooks/useCheckoutQuery";
import {
  useCreateStorefrontOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useInitiatePendingPaymentMutation,
  usePayOrderBalanceMutation,
} from "@/hooks/useOrdersQuery";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { downloadOrderInvoice } from "@/api/storefrontOrders";
import { toast } from "sonner";

export function CheckoutPage({ onBack: propOnBack }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleBack = propOnBack || (() => navigate("/"));

  const { items: cartItems, totalAmount, totalCount } = useAppSelector(
    (state) => state.cart
  );

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    hasGstin: false,
    companyName: "",
    gstin: "",
    notes: "",
  });

  // 1. Checkout Settings Query (Admin policy for COD & partial payments)
  const { data: checkoutSettings, isLoading: isSettingsLoading } = useCheckoutSettingsQuery();

  // 2. Addresses Query
  const { data: addressData, isLoading: isAddressesLoading } = useAddressesQuery();
  const createAddressMutation = useCreateAddressMutation();
  const defaultAddress = addressData?.defaultAddress || null;
  const savedAddresses = useMemo(() => {
    const list = addressData?.addresses || [];
    return defaultAddress ? [defaultAddress, ...list] : list;
  }, [addressData, defaultAddress]);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useCustomAddress, setUseCustomAddress] = useState(false);

  // 3. Delivery Check Mutation
  const checkDeliveryMutation = useCheckDeliveryMutation();

  // 4. Coupons
  const { data: availableCoupons = [] } = useAvailableCouponsQuery();
  const validateCouponMutation = useValidateCouponMutation();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // 5. Quote & Order State
  const createQuoteMutation = useCreateQuoteMutation();
  const confirmQuoteMutation = useConfirmQuoteMutation();
  const createStorefrontOrderMutation = useCreateStorefrontOrderMutation();
  const verifyPaymentMutation = useVerifyRazorpayPaymentMutation();
  const initiatePendingPaymentMutation = useInitiatePendingPaymentMutation();
  const payOrderBalanceMutation = usePayOrderBalanceMutation();

  const [activeQuote, setActiveQuote] = useState(null);
  const [isProcessingPostPayment, setIsProcessingPostPayment] = useState(false);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);

  // 6. Payment Plan selection: "online_full" | "advance_cod" | "full_cod"
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("online_full");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  // Merged policy (from server quote or store settings)
  const checkoutPolicy = useMemo(() => {
    return (
      activeQuote?.checkoutPolicy ||
      checkoutSettings || {
        storefront: "ecomm",
        codEnabled: true,
        partialPaymentEnabled: true,
        partialPaymentPercent: 25,
      }
    );
  }, [activeQuote, checkoutSettings]);

  // Pre-fill with default address when loaded
  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId && !useCustomAddress) {
      const initialAddr = defaultAddress || savedAddresses[0];
      if (initialAddr) {
        const id = initialAddr._id || initialAddr.id;
        setSelectedAddressId(id);
        const fullStreet = [
          initialAddr.houseNumber,
          initialAddr.building,
          initialAddr.floor ? `Floor ${initialAddr.floor}` : null,
          initialAddr.addressLine1,
          initialAddr.addressLine2,
          initialAddr.area,
          initialAddr.landmark ? `Near ${initialAddr.landmark}` : null,
        ]
          .filter(Boolean)
          .join(", ");

        setFormData((prev) => ({
          ...prev,
          fullName: initialAddr.fullName || prev.fullName,
          phone: initialAddr.phone || prev.phone,
          address: fullStreet || prev.address,
          city: initialAddr.city || prev.city,
          state: initialAddr.state || prev.state,
          pincode: initialAddr.postalCode || prev.pincode,
        }));

        if (initialAddr.postalCode) {
          checkDeliveryMutation.mutate({ pincode: initialAddr.postalCode });
        }
      }
    }
  }, [savedAddresses, defaultAddress, selectedAddressId, useCustomAddress]);

  // Handle saved address selection
  const handleSelectSavedAddress = (addr) => {
    const id = addr._id || addr.id;
    setSelectedAddressId(id);
    setUseCustomAddress(false);
    const fullStreet = [
      addr.houseNumber,
      addr.building,
      addr.floor ? `Floor ${addr.floor}` : null,
      addr.addressLine1,
      addr.addressLine2,
      addr.area,
      addr.landmark ? `Near ${addr.landmark}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    setFormData((prev) => ({
      ...prev,
      fullName: addr.fullName || prev.fullName,
      phone: addr.phone || prev.phone,
      address: fullStreet,
      city: addr.city || prev.city,
      state: addr.state || prev.state,
      pincode: addr.postalCode || prev.pincode,
    }));

    if (addr.postalCode) {
      checkDeliveryMutation.mutate({ pincode: addr.postalCode });
    }
  };

  // Re-quote whenever selectedAddressId or appliedCoupon changes
  useEffect(() => {
    if (selectedAddressId) {
      createQuoteMutation.mutate(
        {
          addressId: selectedAddressId,
          couponCode: appliedCoupon?.code,
        },
        {
          onSuccess: (quote) => {
            setActiveQuote(quote);
          },
          onError: (err) => {
            console.warn("Quote calculation notice:", err.message);
          },
        }
      );
    }
  }, [selectedAddressId, appliedCoupon?.code]);

  // Auto-fill city/state based on 6-digit Indian pincode & trigger delivery check
  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: val }));

    if (val.length === 6) {
      checkDeliveryMutation.mutate({ pincode: val });

      if (val.startsWith("40")) {
        setFormData((prev) => ({ ...prev, city: "Mumbai", state: "Maharashtra" }));
      } else if (val.startsWith("11")) {
        setFormData((prev) => ({ ...prev, city: "New Delhi", state: "Delhi" }));
      } else if (val.startsWith("56")) {
        setFormData((prev) => ({ ...prev, city: "Bengaluru", state: "Karnataka" }));
      } else if (val.startsWith("60")) {
        setFormData((prev) => ({ ...prev, city: "Chennai", state: "Tamil Nadu" }));
      } else if (val.startsWith("70")) {
        setFormData((prev) => ({ ...prev, city: "Kolkata", state: "West Bengal" }));
      }
    }
  };

  // Validate & Apply Coupon
  const handleApplyCoupon = async (e, directCode) => {
    if (e) e.preventDefault();
    const clean = (directCode || couponCode).trim().toUpperCase();
    if (!clean) return;

    try {
      const res = await validateCouponMutation.mutateAsync({
        couponCode: clean,
        useServercart: true,
        subtotal: totalAmount,
      });

      if (res?.valid || res?.success) {
        setAppliedCoupon({
          code: clean,
          discountAmount: res.discountAmount || res.discount || 0,
          ...res,
        });
        setCouponCode(clean);

        // Immediate quote refresh with coupon code
        if (selectedAddressId) {
          createQuoteMutation.mutate(
            {
              addressId: selectedAddressId,
              couponCode: clean,
            },
            {
              onSuccess: (quote) => setActiveQuote(quote),
            }
          );
        }
      }
    } catch (err) {
      toast.error(err.message || "Invalid coupon code.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    if (selectedAddressId) {
      createQuoteMutation.mutate(
        {
          addressId: selectedAddressId,
          couponCode: undefined,
        },
        {
          onSuccess: (quote) => setActiveQuote(quote),
        }
      );
    }
  };

  // Order Totals Calculation (From Quote with fallback)
  const itemsSubtotal = activeQuote ? activeQuote.itemsSubtotal : totalAmount;
  const promotionDiscount = activeQuote
    ? activeQuote.promotionDiscount
    : appliedCoupon?.discountAmount || 0;
  const deliveryCharges = activeQuote ? activeQuote.deliveryCharges : (totalAmount >= 599 ? 0 : 49);
  const taxes = activeQuote ? activeQuote.taxes : 0;
  const amountPayable = activeQuote
    ? activeQuote.amountPayable
    : Math.max(0, itemsSubtotal + deliveryCharges + taxes - promotionDiscount);

  // Advance Payment Breakdown
  const advancePercent = checkoutPolicy.partialPaymentPercent || 25;
  const advancePayable = Math.round(amountPayable * (advancePercent / 100));
  const balancePayable = amountPayable - advancePayable;

  // Policy & Quote Rules for Payment Radios
  const isFullCodAllowed = Boolean(
    checkoutPolicy.codEnabled &&
      (activeQuote ? (activeQuote.codAvailable && activeQuote.fullCodAvailable) : true)
  );

  const isPartialAdvanceAllowed = Boolean(
    checkoutPolicy.partialPaymentEnabled &&
      (activeQuote ? activeQuote.partialBalanceCodAvailable !== false : true)
  );

  // Place Order Handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      toast.error("Please fill in your delivery name, phone number, and street address.");
      return;
    }

    setIsSubmitting(true);
    try {
      let currentAddressId = selectedAddressId;

      // If user typed a custom address, persist it first to get an addressId
      if (!currentAddressId || useCustomAddress) {
        try {
          const res = await createAddressMutation.mutateAsync({
            fullName: formData.fullName,
            phone: formData.phone,
            houseNumber: formData.address.split(",")[0]?.trim() || "Unit 1",
            addressLine1:
              formData.address.length >= 10
                ? formData.address
                : `${formData.address}, ${formData.city || "Area"}`,
            city: formData.city || "City",
            state: formData.state || "State",
            postalCode: formData.pincode,
            addressType: "home",
            isDefault: false,
          });
          const createdId = res?._id || res?.data?._id || res?.address?._id;
          if (createdId) {
            currentAddressId = createdId;
            setSelectedAddressId(createdId);
          }
        } catch (addrErr) {
          console.warn("Could not create address document, using existing if any", addrErr);
        }
      }

      if (!currentAddressId) {
        toast.error("Please select a valid delivery address.");
        setIsSubmitting(false);
        return;
      }

      // Ensure active quote is fresh
      let currentQuote = activeQuote;
      const isExpired =
        currentQuote?.quoteExpiresAt && new Date(currentQuote.quoteExpiresAt) <= new Date();

      if (!currentQuote?.quoteId || isExpired) {
        currentQuote = await createQuoteMutation.mutateAsync({
          addressId: currentAddressId,
          couponCode: appliedCoupon?.code,
        });
        setActiveQuote(currentQuote);
      }

      if (!currentQuote?.quoteId) {
        throw new Error("Unable to establish checkout quote with the warehouse.");
      }

      // Formulate Payment Parameters
      let planConfig = {
        paymentMethod: "online",
        paymentPlan: "full",
        balanceCollection: "online",
      };

      if (selectedPaymentMode === "full_cod") {
        planConfig = {
          paymentMethod: "cod",
          paymentPlan: "full",
          balanceCollection: "cod",
        };
      } else if (selectedPaymentMode === "advance_cod") {
        planConfig = {
          paymentMethod: "online",
          paymentPlan: "advance",
          balanceCollection: "cod",
        };
      }

      // Step 4: Confirm Quote (Lock payment choice)
      const confirmRes = await confirmQuoteMutation.mutateAsync({
        quoteId: currentQuote.quoteId,
        paymentMethod: planConfig.paymentMethod,
        paymentPlan: planConfig.paymentPlan,
        balanceCollection: planConfig.balanceCollection,
      });

      // Step 5: Post to /api/orders/items with next.payload & Idempotency-Key
      const orderPayload = {
        addressId: currentAddressId,
        paymentMethod: planConfig.paymentMethod,
        onlinePaymentMode: planConfig.paymentPlan === "advance" ? "advance" : "full",
        ...(planConfig.paymentPlan === "advance"
          ? { paymentAdvancePercent: Number(advancePercent) || 25 }
          : {}),
        balanceCollection: planConfig.balanceCollection,
        quoteId: currentQuote.quoteId,
        ...(appliedCoupon?.code ? { couponCode: appliedCoupon.code } : {}),
        ...(confirmRes?.next?.payload || {}),
      };

      const orderRes = await createStorefrontOrderMutation.mutateAsync({
        payload: orderPayload,
      });

      const orderObj = orderRes?.order || {};
      const finalOrderId =
        orderObj.orderId ||
        orderRes?.orderId ||
        orderRes?._id ||
        `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      const baseOrderInfo = {
        orderId: finalOrderId,
        rawOrder: orderObj,
        addressId: currentAddressId,
        shippingAddress: formData.address,
        recipient: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        total: orderObj.totalAmount ?? currentQuote.amountPayable,
        subtotal: orderObj.subtotal ?? currentQuote.subtotal,
        tax: orderObj.tax ?? currentQuote.tax,
        discount: orderObj.discount ?? currentQuote.discount,
        itemsCount: currentQuote.itemCount || totalCount,
        paymentMethod:
          selectedPaymentMode === "full_cod"
            ? "Cash on Delivery (100% on Arrival)"
            : selectedPaymentMode === "advance_cod"
            ? `Partial Advance (${advancePercent}% Paid Now + ${100 - advancePercent}% on Delivery)`
            : "Instant Online Payment (100% Secured)",
        paymentPlan: selectedPaymentMode,
        onlinePaymentMode:
          orderObj.onlinePaymentMode ||
          (selectedPaymentMode === "advance_cod" ? "advance" : "full"),
        advanceAmount: selectedPaymentMode === "advance_cod" ? advancePayable : null,
        balanceAmount: selectedPaymentMode === "advance_cod" ? balancePayable : null,
        balanceDueInr:
          orderObj.balanceDueInr ??
          (selectedPaymentMode === "advance_cod" ? balancePayable : 0),
        balanceCollection: planConfig.balanceCollection,
        deliveryEstimate: currentQuote.deliveryEstimate || "3-5 Business Days",
        courierName: currentQuote.courierName,
        orderStatus: orderObj.orderStatus || "pending",
        paymentStatus: orderObj.paymentStatus || "pending",
        idempotentReplay: Boolean(orderRes?.idempotentReplay),
      };

      // Step 6: If Razorpay order is returned (Online Checkout), open Razorpay Checkout modal
      if (orderRes?.razorpayOrder) {
        dispatch(clearCart());
        setOrderPlaced(baseOrderInfo);
        window.scrollTo({ top: 0, behavior: "smooth" });

        await openRazorpayCheckout({
          razorpayOrder: orderRes.razorpayOrder,
          orderId: finalOrderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          onPaymentSuccess: async (rzpResp) => {
            try {
              const verifyRes = await verifyPaymentMutation.mutateAsync({
                orderId: finalOrderId,
                razorpay_order_id: rzpResp.razorpay_order_id,
                razorpay_payment_id: rzpResp.razorpay_payment_id,
                razorpay_signature: rzpResp.razorpay_signature,
              });

              setOrderPlaced((prev) => ({
                ...prev,
                orderStatus: verifyRes?.order?.orderStatus || "confirmed",
                paymentStatus: verifyRes?.order?.paymentStatus || "paid",
                balanceDueInr:
                  verifyRes?.order?.balanceDueInr ??
                  (selectedPaymentMode === "advance_cod" ? balancePayable : 0),
              }));
              toast.success("Payment verified! Your order is confirmed.");
            } catch (verErr) {
              console.error("Payment verification error:", verErr);
              toast.warning("Payment processed. Server verification is syncing.");
              setOrderPlaced((prev) => ({
                ...prev,
                orderStatus: "confirmed",
                paymentStatus: "paid",
              }));
            }
          },
          onPaymentDismiss: () => {
            toast.info(
              "Payment window was closed. You can complete payment anytime from My Orders or below."
            );
            setOrderPlaced((prev) => ({
              ...prev,
              orderStatus: "pending",
              paymentStatus: "pending",
            }));
          },
          onError: (rzpErr) => {
            toast.error(rzpErr.message || "Payment attempt failed.");
            setOrderPlaced((prev) => ({
              ...prev,
              orderStatus: "pending",
              paymentStatus: "pending",
            }));
          },
        });
      } else {
        // Full COD or no Razorpay order
        setOrderPlaced({
          ...baseOrderInfo,
          orderStatus:
            orderObj.orderStatus || (selectedPaymentMode === "full_cod" ? "confirmed" : "pending"),
          paymentStatus:
            orderObj.paymentStatus || (selectedPaymentMode === "full_cod" ? "cod_pending" : "pending"),
        });
        dispatch(clearCart());
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast.success(orderRes?.message || "Order placed successfully!");
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      toast.error(err.message || "Failed to finalize checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recovery: Retry Pending Payment
  const handleRetryPendingPayment = async () => {
    if (!orderPlaced?.orderId) return;
    setIsProcessingPostPayment(true);
    try {
      const res = await initiatePendingPaymentMutation.mutateAsync(orderPlaced.orderId);
      if (res?.razorpayOrder) {
        await openRazorpayCheckout({
          razorpayOrder: res.razorpayOrder,
          orderId: orderPlaced.orderId,
          prefill: {
            name: orderPlaced.recipient,
            email: orderPlaced.email,
            contact: orderPlaced.phone,
          },
          onPaymentSuccess: async (rzpResp) => {
            const verifyRes = await verifyPaymentMutation.mutateAsync({
              orderId: orderPlaced.orderId,
              razorpay_order_id: rzpResp.razorpay_order_id,
              razorpay_payment_id: rzpResp.razorpay_payment_id,
              razorpay_signature: rzpResp.razorpay_signature,
            });
            setOrderPlaced((prev) => ({
              ...prev,
              orderStatus: verifyRes?.order?.orderStatus || "confirmed",
              paymentStatus: verifyRes?.order?.paymentStatus || "paid",
              balanceDueInr: verifyRes?.order?.balanceDueInr ?? prev.balanceDueInr,
            }));
            toast.success("Payment verified! Order is confirmed.");
          },
          onPaymentDismiss: () => toast.info("Payment window dismissed."),
          onError: (err) => toast.error(err.message || "Payment attempt failed."),
        });
      } else {
        toast.error(res?.message || "Could not retrieve payment session.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to initialize payment.");
    } finally {
      setIsProcessingPostPayment(false);
    }
  };

  // Recovery: Pay Remaining Balance Online
  const handlePayBalanceOnline = async () => {
    if (!orderPlaced?.orderId) return;
    setIsProcessingPostPayment(true);
    try {
      const res = await payOrderBalanceMutation.mutateAsync(orderPlaced.orderId);
      if (res?.razorpayOrder) {
        await openRazorpayCheckout({
          razorpayOrder: res.razorpayOrder,
          orderId: orderPlaced.orderId,
          prefill: {
            name: orderPlaced.recipient,
            email: orderPlaced.email,
            contact: orderPlaced.phone,
          },
          onPaymentSuccess: async (rzpResp) => {
            const verifyRes = await verifyPaymentMutation.mutateAsync({
              orderId: orderPlaced.orderId,
              razorpay_order_id: rzpResp.razorpay_order_id,
              razorpay_payment_id: rzpResp.razorpay_payment_id,
              razorpay_signature: rzpResp.razorpay_signature,
            });
            setOrderPlaced((prev) => ({
              ...prev,
              balanceDueInr: verifyRes?.order?.balanceDueInr ?? 0,
            }));
            toast.success("Remaining balance paid & verified successfully!");
          },
          onPaymentDismiss: () => toast.info("Balance payment window dismissed."),
          onError: (err) => toast.error(err.message || "Balance payment failed."),
        });
      }
    } catch (err) {
      if (err.code === "BALANCE_COD_AT_DELIVERY") {
        toast.info(err.message || "Balance will be collected via COD at delivery.");
      } else {
        toast.error(err.message || "Could not initiate balance payment.");
      }
    } finally {
      setIsProcessingPostPayment(false);
    }
  };

  // Action: Download Tax Invoice
  const handleDownloadInvoice = async () => {
    if (!orderPlaced?.orderId) return;
    setIsDownloadingInvoice(true);
    try {
      toast.info("Preparing invoice download...");
      await downloadOrderInvoice(orderPlaced.orderId);
      toast.success("Invoice downloaded.");
    } catch (err) {
      toast.error(err.message || "Failed to download tax invoice.");
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  // 1. Order Placed State
  if (orderPlaced) {
    const isPaymentPending =
      String(orderPlaced.paymentStatus).toLowerCase() === "pending" &&
      orderPlaced.paymentPlan !== "full_cod";
    const isOrderConfirmed =
      String(orderPlaced.orderStatus).toLowerCase() === "confirmed" ||
      String(orderPlaced.paymentStatus).toLowerCase() === "paid";
    const hasBalanceDue = (orderPlaced.balanceDueInr || 0) > 0;
    const isBalanceOnline = orderPlaced.balanceCollection === "online";

    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn font-albert-sans">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xl text-center space-y-6">
          <div
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner",
              isPaymentPending
                ? "bg-amber-100 text-amber-600"
                : "bg-emerald-100 text-emerald-600"
            )}
          >
            {isPaymentPending ? (
              <Clock className="w-12 h-12" />
            ) : (
              <CheckCircle2 className="w-12 h-12" />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span
                className={cn(
                  "text-xs font-poppins font-black uppercase tracking-wider px-3 py-1 rounded-full border",
                  isPaymentPending
                    ? "text-amber-700 bg-amber-50 border-amber-200"
                    : "text-emerald-600 bg-emerald-50 border-emerald-200"
                )}
              >
                {isPaymentPending ? "Payment Pending" : "Order Confirmed"}
              </span>
              {orderPlaced.idempotentReplay && (
                <span className="text-xs font-poppins font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Safely Replayed
                </span>
              )}
            </div>

            <h1 className="text-3xl font-poppins font-black text-slate-900 tracking-tight">
              {isPaymentPending
                ? "Order Registered — Complete Payment"
                : "Thank You for Your Order!"}
            </h1>
            <p className="text-slate-500 text-sm font-inter max-w-md mx-auto">
              {isPaymentPending
                ? "Your order reference is created. Complete payment below to lock your stock and confirm immediate dispatch."
                : "Your order has been placed successfully and queued in our warehouse for direct dispatch."}
            </p>
          </div>

          {/* Payment Recovery Notice (if pending) */}
          {isPaymentPending && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-poppins font-bold text-xs uppercase tracking-wide text-amber-900 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                  Online Payment Unfinished
                </span>
                <p className="text-xs text-amber-700 font-inter">
                  Click below to open the secured Razorpay window and complete your order.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRetryPendingPayment}
                disabled={isProcessingPostPayment}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-poppins font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {isProcessingPostPayment ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CreditCard className="w-3.5 h-3.5" />
                )}
                <span>Complete Payment</span>
              </button>
            </div>
          )}

          {/* Balance Due Notice (if advance paid) */}
          {!isPaymentPending && hasBalanceDue && (
            <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-poppins font-bold text-xs uppercase tracking-wide text-blue-900 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-700" />
                  Remaining Balance: {formatCurrency(orderPlaced.balanceDueInr)}
                </span>
                <p className="text-xs text-blue-700 font-inter">
                  {isBalanceOnline
                    ? "You can settle this balance online prior to dispatch or upon delivery."
                    : "This balance will be collected in cash upon physical delivery (COD)."}
                </p>
              </div>
              {isBalanceOnline && (
                <button
                  type="button"
                  onClick={handlePayBalanceOnline}
                  disabled={isProcessingPostPayment}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-poppins font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {isProcessingPostPayment ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CreditCard className="w-3.5 h-3.5" />
                  )}
                  <span>Pay Balance Online</span>
                </button>
              )}
            </div>
          )}

          {/* Summary Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 text-left space-y-3 text-xs font-inter">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Order Reference</span>
              <span className="font-poppins font-black text-slate-900 text-sm">
                #{orderPlaced.orderId}
              </span>
            </div>

            {orderPlaced.shippingAddress && (
              <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                <span className="text-slate-500">Delivery Address</span>
                <span className="font-semibold text-slate-800 text-right max-w-[240px]">
                  {orderPlaced.shippingAddress}
                  {orderPlaced.recipient && (
                    <span className="block text-[10px] text-slate-500">
                      Recipient: {orderPlaced.recipient} ({orderPlaced.phone})
                    </span>
                  )}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Total Order Value</span>
              <span className="font-poppins font-black text-accent text-base">
                {formatCurrency(orderPlaced.total)}
              </span>
            </div>

            {orderPlaced.advanceAmount !== null && (
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
                <div className="flex justify-between text-amber-900 font-semibold">
                  <span>Advance Amount:</span>
                  <span>{formatCurrency(orderPlaced.advanceAmount)}</span>
                </div>
                <div className="flex justify-between text-amber-900 font-semibold">
                  <span>
                    Balance Due ({orderPlaced.balanceCollection === "cod" ? "COD on Arrival" : "Online"}):
                  </span>
                  <span>{formatCurrency(orderPlaced.balanceAmount)}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Payment Plan</span>
              <span className="font-bold text-slate-800 uppercase">
                {orderPlaced.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Estimated Delivery</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                {orderPlaced.deliveryEstimate}
                {orderPlaced.courierName && (
                  <span className="text-slate-400 font-normal">via {orderPlaced.courierName}</span>
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons: Invoice, Orders, WhatsApp, Continue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              disabled={isDownloadingInvoice}
              className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-poppins font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isDownloadingInvoice ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 text-slate-500" />
              )}
              <span>Download Tax Invoice</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile/orders")}
              className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-poppins font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-accent" />
              <span>View in My Orders</span>
            </button>

            <a
              href={`https://wa.me/919999999999?text=Hi%2C%20I%20just%20placed%20order%20%23${orderPlaced.orderId}%20on%20ApexMart.%20Please%20send%20live%20dispatch%20tracking.`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Track on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-poppins font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6 font-albert-sans animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 shadow-md flex items-center justify-center mx-auto text-slate-300">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-900">
            Your Cart is Empty
          </h2>
          <p className="text-slate-500 text-sm font-inter max-w-sm mx-auto">
            You don't have any items in your cart yet. Explore our catalog or flash deals to get started!
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Catalog</span>
        </button>
      </div>
    );
  }

  // 3. Main Checkout Layout
  return (
    <div className="py-6 font-albert-sans space-y-8 animate-fadeIn max-w-[1400px] mx-auto px-4">
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-poppins font-bold text-slate-600 hover:text-accent group transition-colors self-start cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 group-hover:border-accent flex items-center justify-center transition-all shadow-xs">
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-accent" />
          </div>
          <span>Back to Shopping</span>
        </button>

        {/* Security Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-poppins font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            256-Bit SSL Encrypted
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-poppins font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            GST Tax Invoice Included
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer & Delivery Address */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-poppins font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="font-poppins font-black text-slate-900 text-base sm:text-lg">
                  Delivery Address & Contact
                </h3>
                <p className="text-xs text-slate-500 font-inter">
                  Where should we dispatch your order?
                </p>
              </div>
            </div>

            {/* Saved Address Quick Selector if available */}
            {savedAddresses.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-poppins font-bold text-slate-700">
                    Saved Delivery Addresses ({savedAddresses.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomAddress(!useCustomAddress);
                      if (!useCustomAddress) {
                        setSelectedAddressId(null);
                        setFormData((prev) => ({
                          ...prev,
                          fullName: "",
                          phone: "",
                          address: "",
                          city: "",
                          state: "",
                          pincode: "",
                        }));
                      }
                    }}
                    className="text-xs font-poppins font-bold text-accent hover:underline cursor-pointer"
                  >
                    {useCustomAddress ? "Use Saved Address" : "+ Enter New Address"}
                  </button>
                </div>

                {!useCustomAddress && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => {
                      const id = addr._id || addr.id;
                      const isSelected = selectedAddressId === id;
                      const fullStreet = [
                        addr.houseNumber,
                        addr.building,
                        addr.floor ? `Floor ${addr.floor}` : null,
                        addr.addressLine1,
                        addr.addressLine2,
                        addr.area,
                        addr.landmark ? `Near ${addr.landmark}` : null,
                      ]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <div
                          key={id}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={cn(
                            "p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between text-left",
                            isSelected
                              ? "border-accent bg-orange-50/30 ring-2 ring-accent/20 shadow-xs"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-poppins font-bold text-slate-900 flex items-center gap-1.5">
                                <MapPin
                                  size={13}
                                  className={isSelected ? "text-accent" : "text-slate-400"}
                                />
                                {addr.fullName}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[9px] font-poppins font-bold uppercase tracking-wider bg-accent text-white px-2 py-0.5 rounded-md">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-inter line-clamp-2 leading-relaxed">
                              {fullStreet}
                            </p>
                            <p className="text-[11px] font-semibold text-slate-700 font-inter mt-1">
                              {addr.city}, {addr.state} - {addr.postalCode}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[10px] text-slate-500 font-inter">
                            <span>Phone: +91 {addr.phone}</span>
                            <span
                              className={cn(
                                "font-poppins font-bold",
                                isSelected ? "text-accent" : "text-slate-400"
                              )}
                            >
                              {isSelected ? "Selected ✓" : "Select"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Address Input Fields (Visible if no saved addresses or if custom address toggled) */}
            {(savedAddresses.length === 0 || useCustomAddress) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    Full Name / Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    WhatsApp / Phone Number *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    Email Address (for order invoice)
                  </label>
                  <input
                    type="email"
                    placeholder="ramesh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Street Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    Street Address / Flat / Floor / Building *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Flat 302, Green Heights, Opp Metro Station..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* PIN Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    Postal PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 400053"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono"
                  />
                </div>

                {/* City & State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    City & State *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Verification Notice / Pill */}
            {checkDeliveryMutation.data && (
              <div
                className={cn(
                  "p-3 rounded-2xl flex items-center justify-between text-xs font-inter transition-all",
                  checkDeliveryMutation.data.isDeliverable
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                )}
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {checkDeliveryMutation.data.isDeliverable ? (
                      <>
                        <strong>Deliverable</strong> to PIN{" "}
                        <span className="font-mono">{formData.pincode}</span>
                        {checkDeliveryMutation.data.courierName
                          ? ` via ${checkDeliveryMutation.data.courierName}`
                          : ""}
                      </>
                    ) : (
                      <>
                        Delivery is currently not serviceable to{" "}
                        <span className="font-mono">{formData.pincode}</span>
                      </>
                    )}
                  </span>
                </div>
                {checkDeliveryMutation.data.estimatedDays && (
                  <span className="font-poppins font-bold text-[11px] bg-white px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                    Est: {checkDeliveryMutation.data.estimatedDays} Days
                  </span>
                )}
              </div>
            )}

            {/* Optional B2B GSTIN */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.hasGstin}
                  onChange={(e) => setFormData({ ...formData, hasGstin: e.target.checked })}
                  className="w-4 h-4 rounded text-accent focus:ring-accent"
                />
                <span className="text-xs font-poppins font-bold text-slate-800">
                  Claim GST Input Credit (B2B Tax Invoice)
                </span>
              </label>

              {formData.hasGstin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Company Legal Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Enterprises Pvt Ltd"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-inter"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      GSTIN Number (15 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="27ABCDE1234F1Z5"
                      value={formData.gstin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gstin: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-inter uppercase font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Payment Policy & Modes */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-poppins font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="font-poppins font-black text-slate-900 text-base sm:text-lg">
                  Payment Method & Plan
                </h3>
                <p className="text-xs text-slate-500 font-inter">
                  Choose between Instant Online, Partial Advance, or Full COD
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Option A: Instant Full Online */}
              <div
                onClick={() => setSelectedPaymentMode("online_full")}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5",
                  selectedPaymentMode === "online_full"
                    ? "border-accent bg-accent/5 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    selectedPaymentMode === "online_full"
                      ? "border-accent bg-accent"
                      : "border-slate-300 bg-white"
                  )}
                >
                  {selectedPaymentMode === "online_full" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                <div className="p-2 rounded-xl bg-slate-100 text-slate-700 flex-shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-poppins font-bold text-xs text-slate-900">
                      Instant Online Payment (UPI, Cards, NetBanking)
                    </span>
                    <span className="text-[10px] font-poppins font-bold bg-accent text-white px-2 py-0.5 rounded-full">
                      Fastest
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-inter truncate">
                    Pay 100% ({formatCurrency(amountPayable)}) securely now with 0% extra convenience fee
                  </p>
                </div>
              </div>

              {/* Option B: Partial Payment (Advance Online + COD Balance) */}
              {isPartialAdvanceAllowed && (
                <div
                  onClick={() => setSelectedPaymentMode("advance_cod")}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5",
                    selectedPaymentMode === "advance_cod"
                      ? "border-accent bg-accent/5 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                      selectedPaymentMode === "advance_cod"
                        ? "border-accent bg-accent"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {selectedPaymentMode === "advance_cod" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>

                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700 flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-poppins font-bold text-xs text-slate-900">
                        Pay {advancePercent}% Advance ({formatCurrency(advancePayable)})
                      </span>
                      <span className="text-[10px] font-poppins font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                        Partial Plan
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-inter">
                      Pay {advancePercent}% advance now; remaining {100 - advancePercent}% (
                      {formatCurrency(balancePayable)}) collected upon delivery via Cash / UPI.
                    </p>
                  </div>
                </div>
              )}

              {/* Option C: Full Cash on Delivery (COD) */}
              <div
                onClick={() => {
                  if (isFullCodAllowed) {
                    setSelectedPaymentMode("full_cod");
                  }
                }}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5",
                  !isFullCodAllowed
                    ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-200"
                    : selectedPaymentMode === "full_cod"
                    ? "border-accent bg-accent/5 shadow-xs cursor-pointer"
                    : "border-slate-200 hover:border-slate-300 bg-white cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    selectedPaymentMode === "full_cod"
                      ? "border-accent bg-accent"
                      : "border-slate-300 bg-white"
                  )}
                >
                  {selectedPaymentMode === "full_cod" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                <div className="p-2 rounded-xl bg-slate-100 text-slate-700 flex-shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-poppins font-bold text-xs text-slate-900">
                      Cash on Delivery (Pay 100% on Arrival)
                    </span>
                    {!isFullCodAllowed && (
                      <span className="text-[10px] font-poppins font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-inter truncate">
                    {isFullCodAllowed
                      ? `Pay full ${formatCurrency(amountPayable)} to the delivery courier executive`
                      : "COD is not serviceable for this delivery location or cart value."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Action (5 Cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-lg space-y-6">
            <h3 className="font-poppins font-black text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-bold text-slate-500 font-inter">
                {totalCount} {totalCount === 1 ? "Item" : "Items"}
              </span>
            </h3>

            {/* Items Mini List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-white font-bold text-[9px] flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="font-poppins font-bold text-xs text-slate-800 truncate">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-inter">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-poppins font-bold text-xs text-slate-900 flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Input & Available Coupons */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Coupon: SAVE100"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-inter uppercase focus:outline-none focus:border-accent"
                  />
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-poppins font-bold text-xs transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleApplyCoupon(e)}
                    disabled={validateCouponMutation.isPending}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-poppins font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {validateCouponMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </button>
                )}
              </div>

              {/* Available Coupons Pills */}
              {availableCoupons.length > 0 && !appliedCoupon && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Available:</span>
                  {availableCoupons.slice(0, 3).map((cp) => (
                    <button
                      key={cp.code || cp}
                      type="button"
                      onClick={() => handleApplyCoupon(null, cp.code || cp)}
                      className="text-[10px] font-mono font-bold bg-slate-100 hover:bg-accent/10 hover:text-accent text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 transition-colors cursor-pointer"
                    >
                      {cp.code || cp}
                    </button>
                  ))}
                </div>
              )}

              {appliedCoupon && (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-inter flex items-center justify-between">
                  <span className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Coupon {appliedCoupon.code} applied!
                  </span>
                  {promotionDiscount > 0 && (
                    <span className="font-bold font-poppins">
                      -{formatCurrency(promotionDiscount)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Price Calculations from Quote */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-inter text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-poppins font-bold text-slate-900">
                  {formatCurrency(itemsSubtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-bold text-emerald-600">
                  {deliveryCharges === 0 ? "FREE" : formatCurrency(deliveryCharges)}
                </span>
              </div>

              {promotionDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promotion Discount</span>
                  <span>-{formatCurrency(promotionDiscount)}</span>
                </div>
              )}

              {taxes > 0 && (
                <div className="flex justify-between">
                  <span>Taxes & GST</span>
                  <span className="font-bold text-slate-900">+{formatCurrency(taxes)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-poppins font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-accent text-xl">{formatCurrency(amountPayable)}</span>
              </div>

              {/* Partial Payment Breakdown if Selected */}
              {selectedPaymentMode === "advance_cod" && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-amber-900">
                    <span>Pay Online Now ({advancePercent}% Advance):</span>
                    <span>{formatCurrency(advancePayable)}</span>
                  </div>
                  <div className="flex justify-between text-amber-800">
                    <span>Due on Delivery (Balance):</span>
                    <span>{formatCurrency(balancePayable)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quote Delivery Estimate Info */}
            {activeQuote?.deliveryEstimate && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-accent" />
                <span>{activeQuote.deliveryEstimate}</span>
              </div>
            )}

            {/* Place Order CTA Button */}
            <Button
              type="submit"
              variant="coral"
              size="lg"
              disabled={isSubmitting || createQuoteMutation.isPending}
              className="w-full py-4 rounded-2xl shadow-xl font-poppins font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-98 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Securing Order & Locking Quote...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {selectedPaymentMode === "advance_cod"
                      ? `Pay Advance (${formatCurrency(advancePayable)})`
                      : `Place Order (${formatCurrency(amountPayable)})`}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </>
              )}
            </Button>

            {/* Guarantee Badges */}
            <div className="grid grid-cols-2 gap-2 text-center pt-2 text-[10px] text-slate-500 font-inter">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>GST Bill Included</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-500" />
                <span>Fast Transit Across India</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
