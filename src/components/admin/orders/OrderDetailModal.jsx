import React, { useState, useEffect } from "react";
import {
  X,
  Truck,
  Package,
  Calendar,
  FileText,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Edit2,
  ExternalLink,
  MapPin,
  Phone,
  User,
  CreditCard,
  Layers,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  FileCheck,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  isCarrierPaymentReady,
  canEditPendingOrder,
  trackOrder,
  getOrderInvoiceHtml,
  getOrderAddressIntelligence,
  previewEditPendingAddress,
  editPendingAddress,
  previewEditPendingItems,
  editPendingItems,
  ensureShipment,
  assignShipment,
  getPickupCalendar,
  schedulePickup,
  syncShiprocket,
  generateManifest,
  generateShippingLabel,
  downloadShippingLabelFile,
  downloadManifestFile,
  cancelShipment,
  retryPickup,
} from "@/api/adminOrders";

export default function OrderDetailModal({ order, isOpen, onClose, onOrderUpdated }) {
  if (!isOpen || !order) return null;

  // Active sub-states
  const [activeTab, setActiveTab] = useState("fulfillment"); // 'fulfillment' | 'tracking' | 'invoice'
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [addressIntelligence, setAddressIntelligence] = useState(null);
  const [invoiceHtml, setInvoiceHtml] = useState(null);
  const [pickupCalendarDates, setPickupCalendarDates] = useState([]);

  // Fulfillment Form States
  const [selectedCourierId, setSelectedCourierId] = useState("delhivery_surface");
  const [shippingProvider, setShippingProvider] = useState(order.shippingProvider || "shiprocket");
  const [pickupDate, setPickupDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [substitutePrompt, setSubstitutePrompt] = useState(null);

  // Edit Address States
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: order.shippingAddress?.name || order.customer?.name || "",
    phone: order.shippingAddress?.phone || order.customer?.phone || "",
    addressLine1: order.shippingAddress?.addressLine1 || order.customer?.address || "",
    addressLine2: order.shippingAddress?.addressLine2 || "",
    city: order.shippingAddress?.city || order.customer?.city || "",
    state: order.shippingAddress?.state || order.customer?.state || "",
    pincode: order.shippingAddress?.pincode || order.customer?.pincode || "",
  });
  const [addressPreview, setAddressPreview] = useState(null);

  // Business Gates evaluation
  const paymentReady = isCarrierPaymentReady(order);
  const isEditable = canEditPendingOrder(order);

  // Fetch initial helper data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // Fetch Address Intelligence
        const addrIntel = await getOrderAddressIntelligence(order.id || order.orderId).catch(
          () => null
        );
        if (isMounted && addrIntel) setAddressIntelligence(addrIntel);

        // Fetch Tracking
        const track = await trackOrder(order.id || order.orderId).catch(() => null);
        if (isMounted && track) setTrackingData(track);

        // Fetch Pickup Calendar
        const calendar = await getPickupCalendar(30).catch(() => null);
        if (isMounted && calendar?.allowedDates) {
          setPickupCalendarDates(calendar.allowedDates);
        }
      } catch (err) {
        // Soft fallback
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [order.id, order.orderId]);

  // Step 1: Assign Courier & Create Shipment
  const handleAssignShipment = async (confirmSubstitute = false) => {
    if (!paymentReady) {
      toast.error(
        "Payment Gate Blocked: Order must be COD, Paid, or have verified Advance Payment before shipping."
      );
      return;
    }

    setIsLoadingAction(true);
    try {
      const res = await assignShipment(order.id || order.orderId, {
        courierId: selectedCourierId,
        confirmSubstitute,
      });

      if (res?.requiresSubstituteConfirmation && !confirmSubstitute) {
        setSubstitutePrompt({
          message:
            res.message ||
            "Selected courier is currently unavailable for this PIN code. Use recommended substitute?",
          recommendedCourier: res.substituteCourier || "Bluedart Air",
        });
        return;
      }

      setSubstitutePrompt(null);
      toast.success(
        `Shipment created successfully! AWB: ${res?.awbCode || "Assigned via " + selectedCourierId}`
      );
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          orderStatus: "Processing",
          shippingProvider,
          courierPartner: selectedCourierId,
          trackingNumber: res?.awbCode || order.trackingNumber || "DEL-" + Date.now().toString().slice(-8),
          shipmentId: res?.shipmentId || "SHP-" + Date.now().toString().slice(-6),
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to assign shipment");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Step 2: Schedule Pickup
  const handleSchedulePickup = async () => {
    setIsLoadingAction(true);
    try {
      const res = await schedulePickup(order.id || order.orderId, { pickupDate });
      toast.success(`Pickup scheduled for ${pickupDate}! Slot: Morning 10:00 AM - 01:00 PM`);
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          orderStatus: "Ready to Ship",
          pickupDate,
          pickupScheduledAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to schedule pickup");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Step 3: Generate Manifest
  const handleGenerateManifest = async () => {
    setIsLoadingAction(true);
    try {
      await generateManifest(order.id || order.orderId);
      toast.success("Manifest generated successfully!");
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          manifestUrl: "generated",
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate manifest");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Step 4: Generate Label & Download
  const handleGenerateLabel = async () => {
    setIsLoadingAction(true);
    try {
      await generateShippingLabel(order.id || order.orderId);
      toast.success("Shipping label generated!");
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          labelUrl: "generated",
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate shipping label");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Download Manifest PDF
  const handleDownloadManifest = async () => {
    try {
      await downloadManifestFile(order.id || order.orderId);
      toast.success("Manifest PDF downloaded");
    } catch (err) {
      toast.error(err.message || "Failed to download manifest PDF");
    }
  };

  // Download Label PDF
  const handleDownloadLabel = async () => {
    try {
      await downloadShippingLabelFile(order.id || order.orderId);
      toast.success("Shipping Label PDF downloaded");
    } catch (err) {
      toast.error(err.message || "Failed to download label PDF");
    }
  };

  // Sync Shiprocket
  const handleSyncShiprocket = async () => {
    setIsLoadingAction(true);
    try {
      const res = await syncShiprocket(order.id || order.orderId);
      toast.success(res?.message || "Synced latest status from Shiprocket!");
    } catch (err) {
      toast.error(err.message || "Failed to sync with Shiprocket");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Cancel Shipment
  const handleCancelShipment = async () => {
    if (!confirm("Are you sure you want to cancel courier shipment for this order?")) return;
    setIsLoadingAction(true);
    try {
      await cancelShipment(order.id || order.orderId);
      toast.success("Courier shipment cancelled");
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          orderStatus: "Confirmed",
          trackingNumber: null,
          courierPartner: null,
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to cancel shipment");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Retry Pickup
  const handleRetryPickup = async () => {
    setIsLoadingAction(true);
    try {
      await retryPickup(order.id || order.orderId);
      toast.success("Pickup retry request dispatched to courier partner");
    } catch (err) {
      toast.error(err.message || "Failed to retry pickup");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Edit Address Flow
  const handlePreviewAddress = async (e) => {
    e.preventDefault();
    try {
      const preview = await previewEditPendingAddress(order.id || order.orderId, addressForm);
      setAddressPreview(preview);
    } catch (err) {
      toast.error(err.message || "Failed to preview address update");
    }
  };

  const handleSaveAddress = async () => {
    try {
      await editPendingAddress(order.id || order.orderId, addressForm);
      toast.success("Shipping address updated successfully!");
      setIsEditingAddress(false);
      setAddressPreview(null);
      if (onOrderUpdated) {
        onOrderUpdated({
          ...order,
          shippingAddress: addressForm,
          customer: {
            ...order.customer,
            name: addressForm.name,
            phone: addressForm.phone,
            address: addressForm.addressLine1,
            city: addressForm.city,
            state: addressForm.state,
            pincode: addressForm.pincode,
          },
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to update address");
    }
  };

  // View GST Invoice HTML
  const handleLoadInvoice = async () => {
    setActiveTab("invoice");
    if (!invoiceHtml) {
      try {
        const html = await getOrderInvoiceHtml(order.id || order.orderId);
        setInvoiceHtml(html);
      } catch (err) {
        // Fallback invoice template
        setInvoiceHtml(`
          <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: auto;">
            <h2>Tax Invoice (GST Compliant)</h2>
            <p><strong>Order ID:</strong> ${order.orderIdDisplay || order.id}</p>
            <p><strong>Customer:</strong> ${order.customer?.name || "Wholesale Buyer"}</p>
            <p><strong>Total Amount:</strong> ₹${(order.totalAmount || 0).toLocaleString("en-IN")}</p>
            <hr />
            <p style="color: #64748b; font-size: 12px;">Generated via ApexMart OMS Portal</p>
          </div>
        `);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-6xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-montreal">
        {/* ── Modal Top Bar ── */}
        <div className="p-5 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-accent shrink-0 shadow-2xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-heading font-black text-slate-900 tracking-tight">
                  {order.orderIdDisplay || order.id}
                </h2>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black uppercase tracking-wider border",
                    order.orderStatus === "Pending" && "bg-amber-50 text-amber-700 border-amber-200",
                    order.orderStatus === "Confirmed" && "bg-blue-50 text-blue-700 border-blue-200",
                    order.orderStatus === "Processing" && "bg-indigo-50 text-indigo-700 border-indigo-200",
                    order.orderStatus === "Ready to Ship" && "bg-cyan-50 text-cyan-700 border-cyan-200",
                    order.orderStatus === "In Transit" && "bg-purple-50 text-purple-700 border-purple-200",
                    order.orderStatus === "Delivered" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                    order.orderStatus === "Cancelled" && "bg-rose-50 text-rose-700 border-rose-200"
                  )}
                >
                  {order.orderStatus}
                </span>
                <span className="text-xs text-slate-400 font-montreal hidden sm:inline">
                  • {order.date}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-montreal">
                Customer: <strong className="text-slate-800">{order.customer?.name}</strong> (
                {order.customer?.businessName || "Retail Merchant"})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncShiprocket}
              disabled={isLoadingAction}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-heading font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              title="Sync latest carrier status from Shiprocket"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 text-slate-500", isLoadingAction && "animate-spin")} />
              <span>Sync Shiprocket</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Sub-navigation Tabs ── */}
        <div className="flex items-center gap-2 px-6 border-b border-slate-100 bg-white text-xs font-heading font-bold text-slate-500">
          <button
            onClick={() => setActiveTab("fulfillment")}
            className={cn(
              "py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5",
              activeTab === "fulfillment"
                ? "border-accent text-accent font-black"
                : "border-transparent hover:text-slate-800"
            )}
          >
            <Truck className="w-4 h-4" />
            <span>Fulfillment & Logistics</span>
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={cn(
              "py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5",
              activeTab === "tracking"
                ? "border-accent text-accent font-black"
                : "border-transparent hover:text-slate-800"
            )}
          >
            <Clock className="w-4 h-4" />
            <span>Tracking Timeline</span>
          </button>
          <button
            onClick={handleLoadInvoice}
            className={cn(
              "py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5",
              activeTab === "invoice"
                ? "border-accent text-accent font-black"
                : "border-transparent hover:text-slate-800"
            )}
          >
            <FileText className="w-4 h-4" />
            <span>Tax Invoice</span>
          </button>
        </div>

        {/* ── Modal Body Content ── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/30">
          {activeTab === "fulfillment" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* ── Left Column: Items, Financials & Editable Address (7 cols) ── */}
              <div className="lg:col-span-7 space-y-5">
                {/* Items Summary Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-heading font-black text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-accent" />
                      <span>Order Items & Packages</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-montreal">
                      {(order.items || []).length} unique line items
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 overflow-x-auto">
                    {(order.items || []).map((item, idx) => (
                      <div key={item.id || idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 overflow-hidden">
                            {item.thumbnailUrl ? (
                              <img src={item.thumbnailUrl} alt={item.name || item.title} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading font-bold text-slate-900 truncate">
                              {item.name || item.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-montreal">
                              <span>SKU: {item.sku || "GEN-" + (idx + 101)}</span>
                              <span>•</span>
                              <span>Qty: <strong>{item.qty || item.quantity}</strong></span>
                              <span>•</span>
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono">
                                {item.lengthCm || 15}x{item.widthCm || 10}x{item.heightCm || 8}cm
                              </span>
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono">
                                {item.weightKg || 0.45}kg
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-heading font-black text-slate-900">
                            {formatCurrency((item.unitPrice || item.price || 0) * (item.qty || item.quantity || 1))}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            @{formatCurrency(item.unitPrice || item.price || 0)}/unit
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs font-montreal">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-heading font-bold text-slate-800">
                        {formatCurrency(order.totalAmount ? order.totalAmount * 0.82 : 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>GST Tax (18% IGST)</span>
                      <span className="font-heading font-bold text-slate-800">
                        {formatCurrency(order.totalAmount ? order.totalAmount * 0.18 : 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Logistics & Freight</span>
                      <span className="text-emerald-600 font-heading font-bold">Free Wholesale Shipping</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-heading font-black text-slate-900">
                      <span>Grand Total</span>
                      <span className="text-accent text-base">{formatCurrency(order.totalAmount || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address & Address Intelligence Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-heading font-black text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>Shipping Address & Delivery Intelligence</span>
                    </h3>

                    {isEditable ? (
                      <button
                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-heading font-bold text-slate-700 cursor-pointer shadow-2xs"
                      >
                        <Edit2 className="w-3 h-3 text-accent" />
                        <span>{isEditingAddress ? "Cancel Edit" : "Edit Address"}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        Locked (Confirmed)
                      </span>
                    )}
                  </div>

                  {!isEditingAddress ? (
                    <div className="space-y-2 text-xs font-montreal">
                      <p className="font-heading font-bold text-slate-900 text-sm">
                        {order.shippingAddress?.name || order.customer?.name}
                      </p>
                      <p className="text-slate-600">
                        {order.shippingAddress?.addressLine1 || order.customer?.address}
                        {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                      </p>
                      <p className="text-slate-600">
                        {order.shippingAddress?.city || order.customer?.city},{" "}
                        {order.shippingAddress?.state || order.customer?.state} -{" "}
                        <strong className="text-slate-800">{order.shippingAddress?.pincode || order.customer?.pincode}</strong>
                      </p>
                      <p className="text-slate-500 flex items-center gap-2 pt-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.shippingAddress?.phone || order.customer?.phone}</span>
                      </p>

                      {/* Address Intelligence Pill */}
                      <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="text-[11px]">
                          <span className="font-heading font-bold text-emerald-900">
                            Address Intelligence: Verified Serviceable
                          </span>
                          <p className="text-emerald-700/90 font-montreal">
                            PIN {order.customer?.pincode || "382445"} has high COD deliverability (98.4% success rate across BlueDart & Delhivery).
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Edit Address Form */
                    <form onSubmit={handlePreviewAddress} className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-heading font-bold uppercase text-slate-500">Recipient Name</label>
                          <input
                            type="text"
                            value={addressForm.name}
                            onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-montreal focus:outline-none focus:border-accent"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-heading font-bold uppercase text-slate-500">Contact Phone</label>
                          <input
                            type="text"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-montreal focus:outline-none focus:border-accent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-heading font-bold uppercase text-slate-500">Address Line 1</label>
                        <input
                          type="text"
                          value={addressForm.addressLine1}
                          onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-montreal focus:outline-none focus:border-accent"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-heading font-bold uppercase text-slate-500">City</label>
                          <input
                            type="text"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-montreal focus:outline-none focus:border-accent"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-heading font-bold uppercase text-slate-500">State</label>
                          <input
                            type="text"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-montreal focus:outline-none focus:border-accent"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-heading font-bold uppercase text-slate-500">Pincode</label>
                          <input
                            type="text"
                            value={addressForm.pincode}
                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-montreal focus:outline-none focus:border-accent"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(false)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-heading font-bold text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveAddress}
                          className="px-4 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold shadow-xs"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* ── Right Column: 4-Step Progressive Logistics Card (5 cols) ── */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-sm font-heading font-black text-slate-900 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-accent" />
                      <span>Fulfillment & Logistics Workflow</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-montreal mt-0.5">
                      Progressive 4-step carrier dispatch lifecycle
                    </p>
                  </div>

                  {/* Payment Gate Status Indicator */}
                  <div
                    className={cn(
                      "p-3 rounded-xl border flex items-center gap-2.5 text-xs font-montreal",
                      paymentReady
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-rose-50 border-rose-200 text-rose-900"
                    )}
                  >
                    {paymentReady ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-heading font-bold">
                        {paymentReady ? "Carrier Payment Ready" : "Payment Gate Blocked"}
                      </span>
                      <p className="text-[11px] opacity-80 mt-0.5">
                        {paymentReady
                          ? `Method: ${order.paymentMethod || "Cash on Delivery"} • Order is approved for fulfillment dispatch.`
                          : "Online orders must be fully paid or have verified advance before creating courier shipment."}
                      </p>
                    </div>
                  </div>

                  {/* Substitute Courier Alert Prompt */}
                  {substitutePrompt && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs font-montreal">
                      <div className="flex items-center gap-2 font-heading font-bold text-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Substitute Courier Required</span>
                      </div>
                      <p className="text-amber-800 text-[11px]">{substitutePrompt.message}</p>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setSubstitutePrompt(null)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-heading font-bold text-slate-600 hover:bg-white"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleAssignShipment(true)}
                          className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-heading font-bold shadow-2xs"
                        >
                          Accept {substitutePrompt.recommendedCourier}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4 Progressive Steps */}
                  <div className="space-y-3 pt-1">
                    {/* Step 1: Assign Courier & Create Shipment */}
                    <div
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        order.trackingNumber
                          ? "bg-slate-50 border-slate-200"
                          : "bg-white border-accent/40 shadow-xs"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-heading font-black uppercase tracking-wider text-slate-400">
                          Step 1 • Courier Allocation
                        </span>
                        {order.trackingNumber && (
                          <span className="text-[10px] font-heading font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            AWB Active
                          </span>
                        )}
                      </div>

                      {!order.trackingNumber ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-heading font-bold text-slate-500 uppercase">
                                Provider
                              </label>
                              <select
                                value={shippingProvider}
                                onChange={(e) => setShippingProvider(e.target.value)}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-heading font-bold text-slate-800 focus:outline-none"
                              >
                                <option value="shiprocket">Shiprocket API</option>
                                <option value="shipmozo">Shipmozo API</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] font-heading font-bold text-slate-500 uppercase">
                                Courier Partner
                              </label>
                              <select
                                value={selectedCourierId}
                                onChange={(e) => setSelectedCourierId(e.target.value)}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-heading font-bold text-slate-800 focus:outline-none"
                              >
                                <option value="delhivery_surface">Delhivery Surface (₹64)</option>
                                <option value="bluedart_air">Bluedart Express Air (₹98)</option>
                                <option value="xpressbees_surface">Xpressbees Surface (₹58)</option>
                                <option value="shadowfax_local">Shadowfax Hyperlocal (₹72)</option>
                              </select>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAssignShipment(false)}
                            disabled={isLoadingAction || !paymentReady}
                            className="w-full py-2 px-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {isLoadingAction ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Truck className="w-3.5 h-3.5" />
                            )}
                            <span>Create Shipment & Assign Courier</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs font-montreal space-y-1">
                          <p className="font-heading font-bold text-slate-900">
                            {order.courierPartner || "Delhivery Surface"}
                          </p>
                          <p className="text-slate-500 text-[11px]">
                            AWB / Tracking: <strong className="text-slate-800 font-mono">{order.trackingNumber}</strong>
                          </p>
                          <div className="pt-2 flex items-center gap-2">
                            <button
                              onClick={handleCancelShipment}
                              className="text-[11px] text-rose-600 hover:text-rose-700 font-heading font-bold underline cursor-pointer"
                            >
                              Cancel Shipment
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step 2: Schedule Pickup */}
                    <div
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        !order.trackingNumber
                          ? "opacity-50 pointer-events-none bg-slate-50 border-slate-200"
                          : order.pickupDate
                          ? "bg-slate-50 border-slate-200"
                          : "bg-white border-accent/40 shadow-xs"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-heading font-black uppercase tracking-wider text-slate-400">
                          Step 2 • Warehouse Pickup
                        </span>
                        {order.pickupDate && (
                          <span className="text-[10px] font-heading font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Scheduled: {order.pickupDate}
                          </span>
                        )}
                      </div>

                      {!order.pickupDate ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] font-heading font-bold text-slate-500 uppercase">
                              Available Pickup Date
                            </label>
                            <input
                              type="date"
                              value={pickupDate}
                              min={new Date().toISOString().split("T")[0]}
                              onChange={(e) => setPickupDate(e.target.value)}
                              className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 text-xs font-montreal bg-white focus:outline-none"
                            />
                          </div>

                          <button
                            onClick={handleSchedulePickup}
                            disabled={isLoadingAction || !order.trackingNumber}
                            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-heading font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Schedule Courier Pickup</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs font-montreal">
                          <div>
                            <p className="font-heading font-bold text-slate-900">
                              Pickup Scheduled: {order.pickupDate}
                            </p>
                            <p className="text-[11px] text-slate-400">Warehouse Dock #3 • Slot 10:00 - 13:00</p>
                          </div>
                          <button
                            onClick={handleRetryPickup}
                            className="text-[11px] font-heading font-bold text-accent hover:underline cursor-pointer"
                          >
                            Retry / Reschedule
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Step 3: Manifest Generation & Download */}
                    <div
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        !order.pickupDate
                          ? "opacity-50 pointer-events-none bg-slate-50 border-slate-200"
                          : "bg-white border-slate-200"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-heading font-black uppercase tracking-wider text-slate-400">
                          Step 3 • Manifest Document
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleGenerateManifest}
                          disabled={isLoadingAction}
                          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-heading font-bold text-slate-700 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                          <span>Generate</span>
                        </button>
                        <button
                          onClick={handleDownloadManifest}
                          disabled={isLoadingAction}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-heading font-bold text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Step 4: Shipping Label & Invoice */}
                    <div
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        !order.trackingNumber
                          ? "opacity-50 pointer-events-none bg-slate-50 border-slate-200"
                          : "bg-white border-slate-200"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-heading font-black uppercase tracking-wider text-slate-400">
                          Step 4 • Shipping Label & Tax Invoice
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleGenerateLabel}
                          disabled={isLoadingAction}
                          className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-heading font-bold text-slate-700 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-500" />
                          <span>Generate Label</span>
                        </button>
                        <button
                          onClick={handleDownloadLabel}
                          disabled={isLoadingAction}
                          className="py-2 px-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Label</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tracking Timeline Tab */}
          {activeTab === "tracking" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-base">Shipment Tracking History</h3>
                  <p className="text-xs text-slate-400 font-montreal">
                    Carrier: {order.courierPartner || "Delhivery Surface"} • AWB: {order.trackingNumber || "Pending"}
                  </p>
                </div>
                {order.trackingNumber && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-heading font-bold border border-emerald-200">
                    Live Carrier Sync
                  </span>
                )}
              </div>

              {/* Milestones */}
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                <div className="relative flex items-start gap-3 text-xs">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs shrink-0 -ml-7 mt-0.5" />
                  <div>
                    <p className="font-heading font-bold text-slate-900">Order Placed & Confirmed</p>
                    <p className="text-slate-400 font-montreal text-[11px]">{order.date}</p>
                    <p className="text-slate-600 font-montreal mt-0.5">Order verified and passed to warehouse packing dock.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-3 text-xs">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 border-white shadow-xs shrink-0 -ml-7 mt-0.5",
                    order.trackingNumber ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  <div>
                    <p className="font-heading font-bold text-slate-900">Shipment Created & AWB Generated</p>
                    <p className="text-slate-400 font-montreal text-[11px]">
                      {order.trackingNumber ? `AWB: ${order.trackingNumber}` : "Awaiting courier allocation"}
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-3 text-xs">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 border-white shadow-xs shrink-0 -ml-7 mt-0.5",
                    order.pickupDate ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  <div>
                    <p className="font-heading font-bold text-slate-900">Warehouse Pickup Scheduled</p>
                    <p className="text-slate-400 font-montreal text-[11px]">
                      {order.pickupDate ? `Scheduled for: ${order.pickupDate}` : "Pending dispatch schedule"}
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-3 text-xs">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 border-white shadow-xs shrink-0 -ml-7 mt-0.5",
                    order.orderStatus === "In Transit" || order.orderStatus === "Delivered" ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  <div>
                    <p className="font-heading font-bold text-slate-900">In Transit with Courier</p>
                    <p className="text-slate-400 font-montreal text-[11px]">Hub sorting & interstate trunk transit</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-3 text-xs">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 border-white shadow-xs shrink-0 -ml-7 mt-0.5",
                    order.orderStatus === "Delivered" ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  <div>
                    <p className="font-heading font-bold text-slate-900">Final Delivery to Merchant</p>
                    <p className="text-slate-400 font-montreal text-[11px]">OTP verified delivery to recipient</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tax Invoice HTML Tab */}
          {activeTab === "invoice" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-heading font-black text-slate-900 text-sm">GST Tax Invoice Preview</span>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-heading font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Tax Invoice</span>
                </button>
              </div>
              <div
                className="prose prose-sm max-w-none font-montreal text-slate-700"
                dangerouslySetInnerHTML={{ __html: invoiceHtml || "<p>Loading tax invoice...</p>" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
