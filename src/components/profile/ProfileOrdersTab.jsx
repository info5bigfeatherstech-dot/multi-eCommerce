"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, cn } from "@/lib/utils";
import {
  useUserOrdersQuery,
  useOrderTrackingQuery,
  useInitiatePendingPaymentMutation,
  usePayOrderBalanceMutation,
  useVerifyRazorpayPaymentMutation,
} from "@/hooks/useOrdersQuery";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { toast } from "sonner";
import {
  Package,
  Truck,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  ExternalLink,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
  Loader2,
  FileText,
  MapPin,
  Calendar,
  X,
} from "lucide-react";

export function ProfileOrdersTab() {
  const navigate = useNavigate();
  const { data: orders = [], isLoading, refetch, isFetching } = useUserOrdersQuery();

  const initiatePaymentMutation = useInitiatePendingPaymentMutation();
  const payBalanceMutation = usePayOrderBalanceMutation();
  const verifyPaymentMutation = useVerifyRazorpayPaymentMutation();

  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(null);
  const [processingOrderId, setProcessingOrderId] = useState(null);

  // Live tracking query for selected order
  const { data: trackingData, isLoading: isTrackingLoading } = useOrderTrackingQuery(
    activeTrackingOrderId,
    { enabled: Boolean(activeTrackingOrderId) }
  );

  // Handle Retry / Complete Pending Payment
  const handleRetryPayment = async (order) => {
    setProcessingOrderId(order.orderId);
    try {
      const res = await initiatePaymentMutation.mutateAsync(order.orderId);
      if (res?.razorpayOrder) {
        openRazorpayCheckout({
          razorpayOrder: res.razorpayOrder,
          orderId: order.orderId,
          onPaymentSuccess: async (rzpResp) => {
            await verifyPaymentMutation.mutateAsync({
              orderId: order.orderId,
              razorpay_order_id: rzpResp.razorpay_order_id,
              razorpay_payment_id: rzpResp.razorpay_payment_id,
              razorpay_signature: rzpResp.razorpay_signature,
            });
            refetch();
          },
          onPaymentDismiss: () => {
            toast.info("Payment window dismissed. Your order remains pending.");
          },
          onError: (err) => {
            toast.error(err.message || "Payment attempt failed.");
          },
        });
      } else {
        toast.error(res?.message || "Could not initialize payment.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to retry payment.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Handle Pay Balance Online
  const handlePayBalance = async (order) => {
    setProcessingOrderId(order.orderId);
    try {
      const res = await payBalanceMutation.mutateAsync(order.orderId);
      if (res?.razorpayOrder) {
        openRazorpayCheckout({
          razorpayOrder: res.razorpayOrder,
          orderId: order.orderId,
          onPaymentSuccess: async (rzpResp) => {
            await verifyPaymentMutation.mutateAsync({
              orderId: order.orderId,
              razorpay_order_id: rzpResp.razorpay_order_id,
              razorpay_payment_id: rzpResp.razorpay_payment_id,
              razorpay_signature: rzpResp.razorpay_signature,
            });
            refetch();
          },
          onPaymentDismiss: () => {
            toast.info("Balance payment window dismissed.");
          },
          onError: (err) => {
            toast.error(err.message || "Balance payment failed.");
          },
        });
      }
    } catch (err) {
      if (err.code === "BALANCE_COD_AT_DELIVERY") {
        toast.info(err.message);
      } else {
        toast.error(err.message || "Failed to initiate balance payment.");
      }
    } finally {
      setProcessingOrderId(null);
    }
  };

  const getStatusBadge = (orderStatus, paymentStatus) => {
    const s = String(orderStatus || "").toLowerCase();
    const p = String(paymentStatus || "").toLowerCase();

    if (s === "delivered") {
      return {
        label: "Delivered",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
      };
    }
    if (s === "dispatched" || s === "shipped") {
      return {
        label: "In Transit",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Truck,
      };
    }
    if (s === "confirmed") {
      return {
        label: "Confirmed",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
      };
    }
    if (s === "cancelled") {
      return {
        label: "Cancelled",
        color: "bg-rose-50 text-rose-700 border-rose-200",
        icon: AlertTriangle,
      };
    }
    if (p === "pending") {
      return {
        label: "Payment Pending",
        color: "bg-amber-50 text-amber-800 border-amber-200",
        icon: Clock,
      };
    }
    return {
      label: orderStatus || "Processing",
      color: "bg-slate-100 text-slate-700 border-slate-200",
      icon: Package,
    };
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-4 shadow-xs">
        <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-inter">Loading your order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="font-poppins font-black text-slate-900 text-lg">No Orders Yet</h3>
        <p className="text-xs text-slate-500 font-inter max-w-sm mx-auto">
          You haven't placed any wholesale orders yet. Discover our catalog with direct factory pricing!
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
        >
          <span>Start Shopping</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-albert-sans animate-fadeIn">
      {/* Header bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-poppins font-black text-slate-900 text-lg sm:text-xl">
            My Orders ({orders.length})
          </h2>
          <p className="text-xs text-slate-500 font-inter">
            Review order history, live transit status, invoices, and payments
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          title="Refresh orders"
        >
          <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin text-accent")} />
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const badge = getStatusBadge(order.orderStatus, order.paymentStatus);
          const BadgeIcon = badge.icon;
          const isPendingPayment =
            order.paymentStatus === "pending" || order.orderStatus === "pending";
          const hasBalanceDue = (order.balanceDueInr || 0) > 0;
          const isProcessing = processingOrderId === order.orderId;

          return (
            <div
              key={order.orderId || order._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Top Row: Reference, Date & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-poppins font-black text-slate-900 text-sm sm:text-base">
                      #{order.orderId}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-poppins font-bold px-2.5 py-0.5 rounded-full border",
                        badge.color
                      )}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-inter">
                    {order.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    <span>•</span>
                    <span className="uppercase font-semibold text-slate-600">
                      Payment: {order.paymentInfo?.method || order.paymentStatus || "Online"}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Total Amount
                  </span>
                  <span className="font-poppins font-black text-accent text-base sm:text-lg">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Financial & Balance Details */}
              {(hasBalanceDue || isPendingPayment) && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-inter text-amber-900">
                  <div className="space-y-0.5">
                    {isPendingPayment && (
                      <p className="font-bold flex items-center gap-1 text-amber-950">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        Payment is pending authorization.
                      </p>
                    )}
                    {hasBalanceDue && (
                      <p>
                        Remaining Balance Due:{" "}
                        <strong className="font-poppins font-bold text-sm">
                          {formatCurrency(order.balanceDueInr)}
                        </strong>{" "}
                        {order.paymentInfo?.balanceCollectionMethod === "cod"
                          ? "(Cash/UPI upon delivery)"
                          : "(Payable Online)"}
                      </p>
                    )}
                  </div>

                  {/* Payment Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isPendingPayment && (
                      <button
                        onClick={() => handleRetryPayment(order)}
                        disabled={isProcessing}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-poppins font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5" />
                        )}
                        <span>Complete Payment</span>
                      </button>
                    )}

                    {hasBalanceDue && order.paymentInfo?.balanceCollectionMethod !== "cod" && (
                      <button
                        onClick={() => handlePayBalance(order)}
                        disabled={isProcessing}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-poppins font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5" />
                        )}
                        <span>Pay Balance</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons: Live Tracking & Tax Invoice */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveTrackingOrderId(order.orderId)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-poppins font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Track Shipment</span>
                  </button>

                  <a
                    href={`/api/orders/items/${encodeURIComponent(order.orderId)}/invoice`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-poppins font-bold text-[11px] transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download Invoice</span>
                  </a>
                </div>

                <span className="text-[11px] text-slate-400 font-inter">
                  Direct warehouse fulfillment
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Tracking Modal */}
      {activeTrackingOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-accent" />
                <h3 className="font-poppins font-black text-slate-900 text-base">
                  Shipment Tracking: #{activeTrackingOrderId}
                </h3>
              </div>
              <button
                onClick={() => setActiveTrackingOrderId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isTrackingLoading ? (
              <div className="py-8 text-center space-y-3">
                <Loader2 className="w-7 h-7 text-accent animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-inter">Fetching live courier tracking...</p>
              </div>
            ) : trackingData ? (
              <div className="space-y-4 text-xs font-inter">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Courier Partner:</span>
                    <span className="font-bold text-slate-800">
                      {trackingData.courierName || trackingData.courier || "Shiprocket Express"}
                    </span>
                  </div>
                  {trackingData.awb && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">AWB Tracking No:</span>
                      <span className="font-mono font-bold text-slate-900">{trackingData.awb}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Status:</span>
                    <span className="font-bold text-emerald-700 capitalize">
                      {trackingData.currentStatus || trackingData.status || "In Transit"}
                    </span>
                  </div>
                  {trackingData.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimated Delivery:</span>
                      <span className="font-bold text-slate-900">
                        {trackingData.estimatedDelivery}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tracking Milestones */}
                {Array.isArray(trackingData.activities) && trackingData.activities.length > 0 && (
                  <div className="space-y-3 pt-2 max-h-56 overflow-y-auto pr-1">
                    {trackingData.activities.map((act, i) => (
                      <div key={i} className="flex items-start gap-3 text-[11px]">
                        <div className="w-2 h-2 rounded-full bg-accent mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{act.activity || act.status}</p>
                          <p className="text-slate-400 text-[10px]">
                            {act.date || act.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                Tracking details will appear as soon as the package is scanned by our dispatch hub.
              </div>
            )}

            <button
              onClick={() => setActiveTrackingOrderId(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-poppins font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileOrdersTab;
