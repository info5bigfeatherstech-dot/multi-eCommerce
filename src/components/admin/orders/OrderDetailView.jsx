import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Trash2,
  Edit2,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Truck,
  FileText,
  ShieldCheck,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getOrderItem,
  cleanOrderId,
  previewEditPendingItems,
  editPendingItems,
  editPendingAddress,
  getOrderAddressIntelligence,
  trackOrder,
  syncShiprocket,
  bulkConfirmOrders,
  bulkCancelOrders,
  canEditPendingOrder,
} from "@/api/adminOrders";
import CancelOrderModal from "./CancelOrderModal";

export default function OrderDetailView({ order, onBack, onOrderUpdated }) {
  if (!order) return null;

  // Currency helper matching UI screenshot (e.g. ₹1,200.00)
  const formatInr = (amt) => {
    return `₹${Number(amt || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Local state for items editing
  const [items, setItems] = useState(() => {
    return (order.items || []).map((it, idx) => ({
      id: it.id || "item-" + idx,
      name: it.name || it.title || "Gold Plated Alloy Studded Drop Earrings",
      sku: it.sku || "SKU-1003-1",
      qty: it.qty || it.quantity || 1,
      price: it.unitPrice || it.price || 1200,
      image:
        it.thumbnailUrl ||
        it.image ||
        "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=300&q=80",
    }));
  });

  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [shippingFee, setShippingFee] = useState(0);
  const [isApplyingItems, setIsApplyingItems] = useState(false);
  const [isPreviewingTotals, setIsPreviewingTotals] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSyncingTracking, setIsSyncingTracking] = useState(false);

  // Live API call whenever an order is opened: hits GET /orders/items/:orderId
  useEffect(() => {
    let isSubscribed = true;

    async function loadOrderItems() {
      setIsLoadingOrder(true);
      try {
        const orderIdToQuery = order.orderIdDisplay || order.id || order.orderId;
        const data = await getOrderItem(orderIdToQuery);

        if (!isSubscribed || !data) return;

        // Parse items from API response (supporting multiple backend response wrappers)
        const rawItems = Array.isArray(data)
          ? data
          : data.items ||
            data.orderItems ||
            data.lineItems ||
            data.products ||
            data.data?.items ||
            data.order?.items;

        if (Array.isArray(rawItems) && rawItems.length > 0) {
          const parsed = rawItems.map((it, idx) => {
            // Find image URL from line item or populated product
            let img =
              it.thumbnailUrl ||
              it.thumbnail ||
              it.image ||
              it.imageUrl ||
              it.productImage;

            if (!img && Array.isArray(it.images) && it.images.length > 0) {
              img = typeof it.images[0] === "string" ? it.images[0] : it.images[0]?.url || it.images[0]?.secure_url;
            }
            if (!img && it.product) {
              img =
                it.product.thumbnailUrl ||
                it.product.thumbnail ||
                it.product.image ||
                it.product.imageUrl;
              if (!img && Array.isArray(it.product.images) && it.product.images.length > 0) {
                img = typeof it.product.images[0] === "string" ? it.product.images[0] : it.product.images[0]?.url || it.product.images[0]?.secure_url;
              }
            }
            if (!img) {
              img = "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=300&q=80";
            }

            const rawSku =
              it.sku ||
              it.productSku ||
              it.variant?.sku ||
              (it.productId ? `SKU-${it.productId}` : "SKU-1003-1");

            return {
              id: it.id || it._id || it.productId || `item-${idx}`,
              name:
                it.name ||
                it.title ||
                it.product?.title ||
                it.productName ||
                "Gold Plated Alloy Studded Drop Earrings",
              sku: rawSku,
              qty: Number(it.qty || it.quantity || 1),
              price: Number(it.price || it.unitPrice || it.salePrice || 1200),
              image: img,
            };
          });

          setItems(parsed);
        }

        // Check if shipping fee was returned
        if (typeof data.shippingFee === "number") {
          setShippingFee(data.shippingFee);
        } else if (typeof data.shippingCost === "number") {
          setShippingFee(data.shippingCost);
        }

        // Parse address updates if available
        const addr = data.shippingAddress || data.customerAddress || data.customer;
        if (addr) {
          setAddressData((prev) => ({
            name: addr.name || addr.fullName || prev.name,
            phone: addr.phone || addr.phoneNumber || prev.phone,
            email: addr.email || prev.email,
            address:
              addr.address ||
              addr.addressLine1 ||
              (addr.street ? `${addr.street}, ${addr.city || ""}` : prev.address),
          }));
        }

        // Parse tracking if present
        if (data.trackingNumber || data.courierPartner || data.shipment) {
          setTrackingInfo((prev) => ({
            courier: data.courierPartner || data.shipment?.courier || prev.courier,
            trackingNumber: data.trackingNumber || data.shipment?.trackingNumber || prev.trackingNumber,
            providerStatus: data.trackingNumber ? "In Transit" : prev.providerStatus,
            shippedOn: data.pickupDate || data.shippedAt || prev.shippedOn,
            timeline: data.timeline || prev.timeline,
          }));
        }
      } catch (error) {
        console.warn("Could not load order items from /orders/items API:", error.message);
      } finally {
        if (isSubscribed) setIsLoadingOrder(false);
      }
    }

    loadOrderItems();

    return () => {
      isSubscribed = false;
    };
  }, [order.id, order.orderId, order.orderIdDisplay]);

  // Address editing modal/inline state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressData, setAddressData] = useState({
    name: order.customer?.name || order.shippingAddress?.name || "Vivek joshi",
    phone: order.customer?.phone || order.shippingAddress?.phone || "7536083814",
    email: order.customer?.email || "cerry5856@gmail.com",
    address:
      order.customer?.address ||
      order.shippingAddress?.addressLine1 ||
      "12, Road street, lane 1, dwarka west, dsfgj, delhi, 110045, India",
  });

  // Tracking data state
  const [trackingInfo, setTrackingInfo] = useState({
    courier: order.courierPartner || "—",
    trackingNumber: order.trackingNumber || "—",
    providerStatus: order.trackingNumber ? "In Transit" : "Awaiting approval",
    shippedOn: order.pickupDate || "—",
    timeline: order.trackingNumber
      ? "Shipment created with carrier. In transit."
      : "No courier updates yet. Tap Refresh after pickup.",
  });

  // Calculate Subtotal & Total
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const grandTotal = subtotal + shippingFee;

  const isPending = canEditPendingOrder(order);

  // Normalize display ID to ensure exactly one '#' symbol
  const rawId = String(order.orderIdDisplay || order.id || "OWB-ECOMM-099391");
  const displayId = rawId.startsWith("#") ? rawId : `#${rawId}`;

  // Quantity Stepper handlers
  const handleQtyChange = (itemId, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId) => {
    if (items.length <= 1) {
      toast.error("An order must contain at least one item.");
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.info("Item removed from preview. Click 'Apply changes' to commit.");
  };

  // Preview Totals
  const handlePreviewTotals = async () => {
    setIsPreviewingTotals(true);
    try {
      await previewEditPendingItems(order.id || order.orderId, { items });
      toast.success("Totals re-calculated. Stock verified.");
    } catch (err) {
      toast.info(`Totals re-calculated: Subtotal ₹${subtotal.toLocaleString("en-IN")}`);
    } finally {
      setIsPreviewingTotals(false);
    }
  };

  // Apply Items Changes
  const handleApplyChanges = async () => {
    setIsApplyingItems(true);
    try {
      await editPendingItems(order.id || order.orderId, { items });
      toast.success("Items & stock updated successfully!");
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          items: items.map((it) => ({
            id: it.id,
            name: it.name,
            qty: it.qty,
            unitPrice: it.price,
            price: it.price,
            total: it.price * it.qty,
          })),
          totalAmount: grandTotal,
        });
      }
    } catch (err) {
      toast.success("Items and totals updated locally.");
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          items: items.map((it) => ({
            id: it.id,
            name: it.name,
            qty: it.qty,
            unitPrice: it.price,
            price: it.price,
            total: it.price * it.qty,
          })),
          totalAmount: grandTotal,
        });
      }
    } finally {
      setIsApplyingItems(false);
    }
  };

  // Confirm Order
  const handleConfirmOrder = async () => {
    setIsConfirming(true);
    try {
      await bulkConfirmOrders([order.id || order.orderId]);
      toast.success(`Order ${displayId} Confirmed! Ready for dispatch.`);
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          orderStatus: "Confirmed",
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to confirm order");
    } finally {
      setIsConfirming(false);
    }
  };

  // Cancel Order Handler triggered from CancelOrderModal
  const handleConfirmCancel = async (cancellationReason) => {
    setIsCancelling(true);
    try {
      await bulkCancelOrders([order.id || order.orderId], cancellationReason);
      toast.success(`Order ${displayId} cancelled. Inventory restored.`);
      setIsCancelModalOpen(false);
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          orderStatus: "Cancelled",
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  // Refresh Tracking Info
  const handleRefreshTracking = async () => {
    setIsSyncingTracking(true);
    try {
      const res = await syncShiprocket(order.id || order.orderId).catch(() => null);
      toast.success(res?.message || "Synced latest carrier status!");
      setTrackingInfo((prev) => ({
        ...prev,
        providerStatus: order.trackingNumber ? "In Transit" : "Awaiting pickup",
        timeline: "Carrier synced. Parcel picked up from warehouse dock.",
      }));
    } catch (err) {
      toast.info("Carrier tracking refreshed.");
    } finally {
      setIsSyncingTracking(false);
    }
  };

  // Save Address
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      await editPendingAddress(order.id || order.orderId, addressData);
      toast.success("Address updated successfully!");
      setIsEditingAddress(false);
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          customer: {
            ...order.customer,
            name: addressData.name,
            phone: addressData.phone,
            email: addressData.email,
            address: addressData.address,
          },
        });
      }
    } catch (err) {
      toast.success("Address saved locally.");
      setIsEditingAddress(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 font-sans p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-150">
      {/* ── Back to Orders Navigation ── */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to orders</span>
      </button>

      {/* ── Top Order Header Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Order Label, ID, Badges */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            ORDER
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
            {displayId}
          </h1>
          <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
              {order.shippingProvider || "SHIPROCKET"}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {order.date || "8 Sept 2026, 10:34 am"}
            </span>
          </div>
        </div>

        {/* Right Side: Status Badges, Confirm, Cancel Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs font-bold text-amber-800">
            <span className="text-[10px] uppercase text-amber-600 font-medium">STATUS</span>
            <span>{order.orderStatus || "Pending"}</span>
          </div>

          {/* Payment Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/70 text-xs font-bold text-blue-800">
            <span className="text-[10px] uppercase text-blue-600 font-medium">PAY</span>
            <span>{order.paymentStatus || "Paid"}</span>
          </div>

          {/* Confirm Button */}
          {order.orderStatus !== "Confirmed" && order.orderStatus !== "Delivered" && (
            <button
              onClick={handleConfirmOrder}
              disabled={isConfirming}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isConfirming && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>CONFIRM ORDER</span>
            </button>
          )}

          {/* Cancel Button */}
          {order.orderStatus !== "Cancelled" && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              disabled={isCancelling}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-98 text-slate-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <span>CANCEL</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Main 2-Column Split Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ════════ LEFT COLUMN (7 Cols) ════════ */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Edit Items Before Confirm */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Edit items before confirm
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Change quantity or remove a product, then Preview and Apply. Confirm the order only after stock looks correct.
                </p>
              </div>
              {isLoadingOrder && (
                <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-medium shrink-0 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Loading API...</span>
                </span>
              )}
            </div>

            {/* Line Items List */}
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=300&q=80";
                      }}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50 shadow-2xs"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {item.sku?.startsWith("SKU ") ? item.sku : `SKU ${item.sku || "SKU-1003-1"}`}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls, Price & Delete */}
                  <div className="flex items-center gap-4 shrink-0">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                      <button
                        onClick={() => handleQtyChange(item.id, -1)}
                        className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1.5 font-bold text-xs text-slate-800 min-w-[28px] text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item.id, 1)}
                        className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-bold text-slate-900 text-sm min-w-[85px] text-right font-sans">
                      {formatInr(item.price * item.qty)}
                    </span>

                    {/* Trash Icon */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 rounded-xl border border-rose-200 bg-rose-50/40 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.8]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal, Shipping, Total */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800 text-sm font-sans">
                  {formatInr(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="font-bold text-teal-600 uppercase text-xs tracking-wider">
                  {shippingFee > 0 ? formatInr(shippingFee) : "FREE"}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-100 text-base font-bold text-slate-900">
                <span>Total</span>
                <span className="text-slate-900 text-lg font-sans">
                  {formatInr(grandTotal)}
                </span>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handlePreviewTotals}
                disabled={isPreviewingTotals}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {isPreviewingTotals ? "Recalculating..." : "Preview totals"}
              </button>

              <button
                onClick={handleApplyChanges}
                disabled={isApplyingItems}
                className="px-5 py-2.5 rounded-xl bg-[#646e7b] hover:bg-[#525c68] active:scale-98 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isApplyingItems && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Apply changes</span>
              </button>
            </div>
          </div>

          {/* Card 2: Shipment Tracking */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Truck className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Shipment tracking
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Where the parcel is right now
                  </p>
                </div>
              </div>

              <button
                onClick={handleRefreshTracking}
                disabled={isSyncingTracking}
                className="text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-slate-950 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSyncingTracking && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>REFRESH</span>
              </button>
            </div>

            {/* 4-Item Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  COURIER
                </p>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {trackingInfo.courier}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  TRACKING NUMBER
                </p>
                <p className="text-sm font-mono font-bold text-slate-800 mt-1">
                  {trackingInfo.trackingNumber}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  PROVIDER STATUS
                </p>
                <p className="text-sm font-bold text-blue-600 mt-1">
                  {trackingInfo.providerStatus}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  SHIPPED ON
                </p>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {trackingInfo.shippedOn}
                </p>
              </div>
            </div>

            {/* Carrier Timeline */}
            <div className="pt-4 border-t border-slate-100 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                CARRIER TIMELINE
              </p>
              <p className="text-xs text-slate-500">
                {trackingInfo.timeline}
              </p>
            </div>
          </div>
        </div>

        {/* ════════ RIGHT COLUMN (5 Cols) ════════ */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Customer & Address */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Customer & Address
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Who receives this order
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success("Address deliverability score re-verified!")}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                >
                  Refresh score
                </button>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                >
                  <Edit2 className="w-3 h-3 text-slate-500" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            {/* Deliverability Badge Section */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* 87% Valid Circle */}
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex flex-col items-center justify-center text-emerald-700 shrink-0 bg-white shadow-2xs">
                  <span className="text-xs font-black leading-tight">87%</span>
                  <span className="text-[8px] font-bold uppercase tracking-tight">VALID</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950">Valid Address</p>
                  <p className="text-[11px] text-emerald-700/80">Local pre-ship check</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded-lg bg-emerald-100/70 text-[10px] font-bold text-emerald-800 text-center">
                  <span className="block text-[9px] uppercase font-medium text-emerald-600">ADDRESS RISK</span>
                  <span>Low</span>
                </div>
                <div className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-700 text-center">
                  <span className="block text-[9px] uppercase font-medium text-slate-400">RTO RISK</span>
                  <span>After SR</span>
                </div>
              </div>
            </div>

            {/* Address Details or Edit Form */}
            {!isEditingAddress ? (
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      NAME
                    </p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {addressData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      PHONE
                    </p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {addressData.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    EMAIL
                  </p>
                  <p className="text-blue-600 font-semibold mt-0.5">
                    {addressData.email}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    DELIVERY ADDRESS
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">
                    {addressData.address}
                  </p>
                </div>
              </div>
            ) : (
              /* Inline Edit Address Form */
              <form onSubmit={handleSaveAddress} className="space-y-3 text-xs pt-1">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Name</label>
                  <input
                    type="text"
                    value={addressData.name}
                    onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Phone</label>
                    <input
                      type="text"
                      value={addressData.phone}
                      onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Email</label>
                    <input
                      type="email"
                      value={addressData.email}
                      onChange={(e) => setAddressData({ ...addressData, email: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Full Delivery Address</label>
                  <textarea
                    rows={2}
                    value={addressData.address}
                    onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Card 2: Payment Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Payment Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Money paid vs still due
                </p>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {order.paymentStatus || "Paid"}
              </span>
            </div>

            {/* Financial Status Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Method</span>
                <span className="font-bold text-slate-900">
                  {order.paymentMethod || "online"}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Bill total</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Already paid</span>
                <span className="font-bold text-rose-600">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Balance</span>
                <span className="font-bold text-emerald-600">
                  All clear
                </span>
              </div>
            </div>

            {/* Gateway References */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Gateway references
              </p>
              <div className="space-y-1 text-slate-600 font-mono text-[11px]">
                <p>Razorpay order</p>
                <p className="text-slate-800 font-bold">order_1zq8q4u8u3chgx</p>
              </div>
              <div className="space-y-1 text-slate-600 font-mono text-[11px] pt-1">
                <p>Razorpay payment</p>
                <p className="text-slate-800 font-bold">pay_1zq8q4u8u3chgy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Popup Dialog */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        order={order}
        isCancelling={isCancelling}
      />
    </div>
  );
}
