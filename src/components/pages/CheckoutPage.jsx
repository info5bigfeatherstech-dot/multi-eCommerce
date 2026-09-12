"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAddressesQuery } from "@/hooks/useAddressesQuery";
import { calculateCourierLengths } from "@/api/addresses";

const PAYMENT_METHODS = [
  {
    id: "upi",
    title: "Instant UPI (GPay, PhonePe, Paytm, BHIM)",
    desc: "Fastest checkout with 0% extra convenience fee",
    icon: QrCode,
    badge: "Recommended",
  },
  {
    id: "card",
    title: "Credit / Debit Cards & RuPay",
    desc: "100% RBI & PCI-DSS 256-Bit Encrypted",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    title: "Net Banking (SBI, HDFC, ICICI, Axis + 50 Banks)",
    desc: "Direct bank transfer with instant authorization",
    icon: Building2,
  },
  {
    id: "cod",
    title: "Cash on Delivery (Pay upon Dispatch)",
    desc: "Pay cash or UPI to the delivery executive",
    icon: Wallet,
  },
];

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

  // Address Query Integration
  const { data: addressData, isLoading: isAddressesLoading } = useAddressesQuery();
  const defaultAddress = addressData?.defaultAddress || null;
  const savedAddresses = React.useMemo(() => {
    const list = addressData?.addresses || [];
    return defaultAddress ? [defaultAddress, ...list] : list;
  }, [addressData, defaultAddress]);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useCustomAddress, setUseCustomAddress] = useState(false);

  // Pre-fill with default address when loaded
  React.useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId && !useCustomAddress) {
      const initialAddr = defaultAddress || savedAddresses[0];
      if (initialAddr) {
        setSelectedAddressId(initialAddr._id || initialAddr.id);
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
      }
    }
  }, [savedAddresses, defaultAddress, selectedAddressId, useCustomAddress]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id || addr.id);
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
  };

  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  // Auto-fill city/state based on 6-digit Indian pincode
  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: val }));

    if (val.length === 6) {
      // Mock PIN code lookup
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
      } else {
        setFormData((prev) => ({ ...prev, city: "City", state: "State" }));
      }
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === "WHOLESALE10") {
      setAppliedCoupon({ code: "WHOLESALE10", discountPercent: 10 });
    } else if (clean === "FIRST50") {
      setAppliedCoupon({ code: "FIRST50", flatDiscount: 50 });
    } else {
      alert("Invalid coupon code. Try WHOLESALE10 for 10% off!");
    }
  };

  // Calculations
  const shippingCharge = totalAmount >= 599 || deliveryMethod === "standard" ? 0 : 70;
  const expressFee = deliveryMethod === "express" ? 99 : 0;
  const couponDiscount = appliedCoupon
    ? appliedCoupon.discountPercent
      ? Math.round((totalAmount * appliedCoupon.discountPercent) / 100)
      : appliedCoupon.flatDiscount || 0
    : 0;

  const finalAmount = Math.max(0, totalAmount + shippingCharge + expressFee - couponDiscount);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      alert("Please fill in your delivery name, phone number, and address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedOrderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      setOrderPlaced({
        orderId: generatedOrderId,
        addressId: selectedAddressId || "ADDR-NEW",
        shippingAddress: formData.address,
        recipient: formData.fullName,
        phone: formData.phone,
        total: finalAmount,
        itemsCount: totalCount,
        deliveryMethod,
        paymentMethod,
      });
      dispatch(clearCart());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1500);
  };

  // 1. Order Placed State
  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn font-albert-sans">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-poppins font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed
            </span>
            <h1 className="text-3xl font-poppins font-black text-slate-900 tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-slate-500 text-sm font-inter">
              Your order has been placed successfully and sent to our warehouse for dispatch.
            </p>
          </div>

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
                <span className="font-semibold text-slate-800 text-right max-w-[220px]">
                  {orderPlaced.shippingAddress}
                  {orderPlaced.addressId && orderPlaced.addressId !== "ADDR-NEW" && (
                    <span className="block text-[10px] text-slate-400 font-mono">ID: {orderPlaced.addressId}</span>
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Total Amount Paid</span>
              <span className="font-poppins font-black text-accent text-base">
                {formatCurrency(orderPlaced.total)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Payment Method</span>
              <span className="font-bold text-slate-800 uppercase">
                {orderPlaced.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Estimated Delivery</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                2 - 3 Business Days
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`https://wa.me/919999999999?text=Hi%2C%20I%20just%20placed%20order%20%23${orderPlaced.orderId}%20on%20ApexMart.%20Please%20send%20live%20dispatch%20tracking.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Track on WhatsApp</span>
            </a>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-poppins font-bold text-xs uppercase tracking-wider transition-all"
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
            You don't have any wholesale products in your cart yet. Explore our flash deals or best sellers to get started!
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
        {/* Left Column: Shipping Details & Payment (7 Cols) */}
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
                  Where should we dispatch your wholesale order?
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
                                <MapPin size={13} className={isSelected ? "text-accent" : "text-slate-400"} />
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
                            <span className={cn("font-poppins font-bold", isSelected ? "text-accent" : "text-slate-400")}>
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

            {/* Address Input Fields (Always visible if no saved addresses or if custom address toggled) */}
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
                  <span className="absolute left-3 text-xs font-bold text-slate-400">
                    +91
                  </span>
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
                  Email Address (for GST invoice)
                </label>
                <input
                  type="email"
                  placeholder="ramesh@business.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Street Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-poppins font-bold text-slate-700">
                  Street Address / Shop No. / Flat No. *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Shop No. 12, Ground Floor, Near Central Market..."
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
                  placeholder="e.g. 400001"
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

            {/* Optional B2B GSTIN Checkbox */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.hasGstin}
                  onChange={(e) =>
                    setFormData({ ...formData, hasGstin: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-accent focus:ring-accent"
                />
                <span className="text-xs font-poppins font-bold text-slate-800">
                  Claim 18% GST Input Credit (B2B Tax Invoice)
                </span>
              </label>

              {formData.hasGstin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      Company Legal Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Traders Pvt Ltd"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
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

          {/* Section 2: Shipping Method */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-poppins font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="font-poppins font-black text-slate-900 text-base sm:text-lg">
                  Shipping Method
                </h3>
                <p className="text-xs text-slate-500 font-inter">
                  Direct warehouse dispatch with live tracking
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Standard */}
              <div
                onClick={() => setDeliveryMethod("standard")}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3",
                  deliveryMethod === "standard"
                    ? "border-accent bg-accent/5 shadow-xs"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-poppins font-bold text-xs text-slate-900">
                      Standard Surface
                    </span>
                    <span className="text-xs font-bold text-emerald-600">FREE</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-inter mt-0.5">
                    3 - 4 Days across India
                  </p>
                </div>
              </div>

              {/* Express */}
              <div
                onClick={() => setDeliveryMethod("express")}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3",
                  deliveryMethod === "express"
                    ? "border-accent bg-accent/5 shadow-xs"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-poppins font-bold text-xs text-slate-900">
                      Priority Air Express
                    </span>
                    <span className="text-xs font-bold text-slate-900">₹99</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-inter mt-0.5">
                    1 - 2 Days Metro Express
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-poppins font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="font-poppins font-black text-slate-900 text-base sm:text-lg">
                  Payment Method
                </h3>
                <p className="text-xs text-slate-500 font-inter">
                  Select your preferred secure payment mode
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {PAYMENT_METHODS.map((pm) => {
                const isSelected = paymentMethod === pm.id;
                const Icon = pm.icon;

                return (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5",
                      isSelected
                        ? "border-accent bg-accent/5 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                        isSelected
                          ? "border-accent bg-accent"
                          : "border-slate-300 bg-white"
                      )}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700 flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-poppins font-bold text-xs text-slate-900">
                          {pm.title}
                        </span>
                        {pm.badge && (
                          <span className="text-[10px] font-poppins font-bold bg-accent text-white px-2 py-0.5 rounded-full">
                            {pm.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-inter truncate">
                        {pm.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
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

            {/* Coupon Code Input */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Coupon: WHOLESALE10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-inter uppercase focus:outline-none focus:border-accent"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-poppins font-bold text-xs transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Coupon {appliedCoupon.code} applied successfully!
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-inter text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-poppins font-bold text-slate-900">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className="font-bold text-emerald-600">
                  {shippingCharge === 0 ? "FREE" : formatCurrency(shippingCharge)}
                </span>
              </div>
              {expressFee > 0 && (
                <div className="flex justify-between">
                  <span>Priority Air Handling</span>
                  <span className="font-bold text-slate-900">
                    +{formatCurrency(expressFee)}
                  </span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Wholesale Discount</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-700 text-[11px] pt-1">
                <span>GST Tax Breakdown</span>
                <span>18% Included in MRP</span>
              </div>
              <div className="flex justify-between text-base font-poppins font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-accent text-xl">{formatCurrency(finalAmount)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <Button
              type="submit"
              variant="coral"
              size="lg"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl shadow-xl font-poppins font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-98 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Securing Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>Place Order ({formatCurrency(finalAmount)})</span>
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
