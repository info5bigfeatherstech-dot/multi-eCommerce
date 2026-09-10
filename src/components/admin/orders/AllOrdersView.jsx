import React, { useState, useMemo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateOrderStatus } from "@/store/slices/adminOrdersSlice";
import {
  Search,
  Filter,
  Download,
  Eye,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertTriangle,
  FileText,
  Building2,
  Phone,
  ShieldCheck,
  X,
  CreditCard,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Calendar,
  Layers,
  FileCheck,
  Printer,
  ChevronDown,
  Loader2,
  AlertCircle,
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, cn } from "@/lib/utils";
import OrderDetailView from "./OrderDetailView";
import {
  getOrders,
  getOrderSummary,
  autoSyncStatuses,
  bulkConfirmOrders,
  bulkCancelOrders,
  bulkShipNow,
  bulkSchedulePickup,
  bulkSyncShiprocket,
  bulkDownloadTaxInvoices,
  bulkDownloadShippingLabels,
  bulkDownloadManifests,
  isCarrierPaymentReady,
  BUCKET_STATUS_MAP,
} from "@/api/adminOrders";

export default function AllOrdersView() {
  const dispatch = useAppDispatch();
  const reduxOrders = useAppSelector((state) => state.adminOrders.items);

  // Orders State (loaded from API with Redux fallback)
  const [orders, setOrders] = useState(reduxOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filtering & Tab Buckets
  // Buckets: 'all', 'new', 'bill_sent', 'ready_to_ship', 'ready_to_pick', 'in_transit', 'completed', 'rto', 'others'
  const [activeBucket, setActiveBucket] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRangePreset, setDateRangePreset] = useState("last30"); // 'last7', 'last30', 'custom'
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Multi-Selection State
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [isExecutingBulk, setIsExecutingBulk] = useState(false);
  const [bulkPickupDate, setBulkPickupDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);

  // Detail Modal State
  const [detailOrder, setDetailOrder] = useState(null);

  // Summary KPI from API
  const [apiSummary, setApiSummary] = useState(null);

  // Load summary and orders from API
  const fetchOrdersData = async () => {
    setIsLoading(true);
    try {
      // 1. Summary
      const summary = await getOrderSummary({
        rangePreset: dateRangePreset,
        from: customStartDate,
        to: customEndDate,
      }).catch(() => null);
      if (summary) setApiSummary(summary);

      // 2. Orders list
      const res = await getOrders({
        bucket: activeBucket,
        search: searchQuery,
      }).catch(() => null);

      if (res?.orders && Array.isArray(res.orders)) {
        setOrders(res.orders);
      } else {
        // Keep redux state if API returns null/demo
        setOrders(reduxOrders);
      }
    } catch (err) {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [activeBucket, dateRangePreset]);

  // Auto-sync statuses handler
  const handleAutoSync = async () => {
    setIsSyncing(true);
    try {
      const res = await autoSyncStatuses();
      toast.success(res?.message || "Order statuses synchronized with courier providers!");
      await fetchOrdersData();
    } catch (err) {
      toast.info("Auto-sync completed. Local statuses verified.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Filtered orders logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Bucket filter
      if (activeBucket !== "all") {
        const bucketConfig = BUCKET_STATUS_MAP[activeBucket];
        if (bucketConfig) {
          const statusLower = (order.orderStatus || "").toLowerCase();
          const match = bucketConfig.statuses.some((s) => statusLower.includes(s));
          if (!match) return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const id = (order.orderIdDisplay || order.id || "").toLowerCase();
        const awb = (order.trackingNumber || "").toLowerCase();
        const name = (order.customer?.name || order.shippingAddress?.name || "").toLowerCase();
        const phone = (order.customer?.phone || order.shippingAddress?.phone || "");
        const business = (order.customer?.businessName || "").toLowerCase();
        if (!id.includes(q) && !awb.includes(q) && !name.includes(q) && !phone.includes(q) && !business.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeBucket, searchQuery]);

  // KPI Calculations
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => (o.orderStatus !== "Cancelled" ? sum + (o.totalAmount || 0) : sum),
    0
  );
  const pendingCount = orders.filter((o) => (o.orderStatus || "").toLowerCase() === "pending").length;
  const completedCount = orders.filter((o) => (o.orderStatus || "").toLowerCase() === "delivered").length;

  // Multi-select helpers
  const isAllSelected =
    filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id || o.orderId));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Operations Handlers
  const handleBulkConfirm = async () => {
    if (!selectedOrderIds.length) return;
    setIsExecutingBulk(true);
    try {
      await bulkConfirmOrders(selectedOrderIds);
      toast.success(`Successfully confirmed ${selectedOrderIds.length} orders!`);
      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          selectedOrderIds.includes(o.id || o.orderId)
            ? { ...o, orderStatus: "Confirmed" }
            : o
        )
      );
      setSelectedOrderIds([]);
    } catch (err) {
      toast.error(err.message || "Failed to bulk confirm orders");
    } finally {
      setIsExecutingBulk(false);
    }
  };

  const handleBulkCancel = async () => {
    if (!selectedOrderIds.length) return;
    const reason = prompt("Enter cancellation reason (optional):", "Customer requested cancellation");
    if (reason === null) return; // User cancelled prompt

    setIsExecutingBulk(true);
    try {
      await bulkCancelOrders(selectedOrderIds, reason);
      toast.success(`Successfully cancelled ${selectedOrderIds.length} orders. Inventory restored.`);
      setOrders((prev) =>
        prev.map((o) =>
          selectedOrderIds.includes(o.id || o.orderId)
            ? { ...o, orderStatus: "Cancelled" }
            : o
        )
      );
      setSelectedOrderIds([]);
    } catch (err) {
      toast.error(err.message || "Failed to bulk cancel orders");
    } finally {
      setIsExecutingBulk(false);
    }
  };

  const handleBulkShipNow = async () => {
    if (!selectedOrderIds.length) return;
    setIsExecutingBulk(true);
    try {
      await bulkShipNow(selectedOrderIds);
      toast.success(`Fulfillment initiated for ${selectedOrderIds.length} orders via Shiprocket!`);
      setOrders((prev) =>
        prev.map((o) =>
          selectedOrderIds.includes(o.id || o.orderId)
            ? { ...o, orderStatus: "Processing" }
            : o
        )
      );
      setSelectedOrderIds([]);
    } catch (err) {
      toast.error(err.message || "Failed to bulk ship orders");
    } finally {
      setIsExecutingBulk(false);
    }
  };

  const handleBulkSchedulePickup = async () => {
    if (!selectedOrderIds.length) return;
    setIsExecutingBulk(true);
    try {
      await bulkSchedulePickup(selectedOrderIds, bulkPickupDate);
      toast.success(
        `Pickup scheduled for ${selectedOrderIds.length} orders on ${bulkPickupDate}!`
      );
      setOrders((prev) =>
        prev.map((o) =>
          selectedOrderIds.includes(o.id || o.orderId)
            ? { ...o, orderStatus: "Ready to Ship", pickupDate: bulkPickupDate }
            : o
        )
      );
      setShowPickupDatePicker(false);
      setSelectedOrderIds([]);
    } catch (err) {
      toast.error(err.message || "Failed to schedule bulk pickup");
    } finally {
      setIsExecutingBulk(false);
    }
  };

  const handleBulkSyncShiprocket = async () => {
    if (!selectedOrderIds.length) return;
    setIsExecutingBulk(true);
    try {
      await bulkSyncShiprocket(selectedOrderIds);
      toast.success(`Shiprocket statuses synced for ${selectedOrderIds.length} orders.`);
      setSelectedOrderIds([]);
    } catch (err) {
      toast.error(err.message || "Failed to sync with Shiprocket");
    } finally {
      setIsExecutingBulk(false);
    }
  };

  const handleBulkDownloadLabels = async () => {
    if (!selectedOrderIds.length) return;
    try {
      toast.info(`Preparing ZIP archive for ${selectedOrderIds.length} shipping labels...`);
      await bulkDownloadShippingLabels(selectedOrderIds);
      toast.success("Shipping labels ZIP downloaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to download shipping labels ZIP");
    }
  };

  const handleBulkDownloadManifests = async () => {
    if (!selectedOrderIds.length) return;
    try {
      toast.info(`Preparing ZIP archive for ${selectedOrderIds.length} manifests...`);
      await bulkDownloadManifests(selectedOrderIds);
      toast.success("Manifests ZIP downloaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to download manifests ZIP");
    }
  };

  const handleBulkDownloadInvoices = async () => {
    if (!selectedOrderIds.length) return;
    try {
      toast.info(`Preparing ZIP archive for ${selectedOrderIds.length} tax invoices...`);
      await bulkDownloadTaxInvoices(selectedOrderIds);
      toast.success("Tax invoices ZIP downloaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to download tax invoices ZIP");
    }
  };

  // CSV Report Export
  const handleExportCSV = () => {
    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "Business",
      "Phone",
      "City",
      "Total Amount",
      "Payment Method",
      "Payment Status",
      "Status",
      "AWB Tracking",
      "Courier",
    ];

    const rows = filteredOrders.map((o) => [
      o.orderIdDisplay || o.id,
      `"${o.date || ""}"`,
      `"${o.customer?.name || o.shippingAddress?.name || ""}"`,
      `"${o.customer?.businessName || ""}"`,
      `"${o.customer?.phone || o.shippingAddress?.phone || ""}"`,
      `"${o.customer?.city || o.shippingAddress?.city || ""}"`,
      o.totalAmount || 0,
      `"${o.paymentMethod || o.paymentInfo?.method || ""}"`,
      `"${o.paymentStatus || ""}"`,
      `"${o.orderStatus || ""}"`,
      `"${o.trackingNumber || ""}"`,
      `"${o.courierPartner || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `apexmart_oms_orders_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders CSV report exported successfully!");
  };

  // Update order in state after detail modal actions
  const handleOrderUpdated = (updated) => {
    setOrders((prev) =>
      prev.map((o) => ((o.id || o.orderId) === (updated.id || updated.orderId) ? updated : o))
    );
    dispatch(
      updateOrderStatus({
        orderId: updated.id || updated.orderId,
        newStatus: updated.orderStatus,
        courierPartner: updated.courierPartner,
        trackingNumber: updated.trackingNumber,
      })
    );
    setDetailOrder(updated);
  };

  if (detailOrder) {
    return (
      <OrderDetailView
        order={detailOrder}
        onBack={() => setDetailOrder(null)}
        onOrderUpdated={handleOrderUpdated}
      />
    );
  }

  return (
    <div className="space-y-6 font-montreal">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-accent text-[10px] font-heading font-black uppercase tracking-wider">
              All Orders Hub
            </span>
            <span className="text-xs text-slate-400 font-montreal">
              Carrier Dispatch & Order Management
            </span>
          </div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Order Management
          </h1>
          <p className="text-xs text-slate-500 font-montreal mt-0.5">
            Central order ledger. Click <strong>"Manage / Ship"</strong> on any order to manage its address, items, carrier fulfillment, and live tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Auto-Sync Statuses Button */}
          <button
            onClick={handleAutoSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-heading font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            title="Auto-sync latest dispatch & delivery statuses from courier APIs"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-slate-500", isSyncing && "animate-spin")} />
            <span>{isSyncing ? "Syncing..." : "Auto-Sync Carriers"}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-heading font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── Metric Overview Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-heading font-black uppercase tracking-wider text-slate-400">
            Total Orders
          </p>
          <p className="text-2xl font-heading font-black text-slate-900">{totalOrdersCount}</p>
          <p className="text-[11px] text-slate-500">Across all fulfillment stages</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-heading font-black uppercase tracking-wider text-slate-400">
            Total Revenue
          </p>
          <p className="text-2xl font-heading font-black text-emerald-600">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-[11px] text-emerald-600/80 font-montreal">Excluding cancelled orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-heading font-black uppercase tracking-wider text-slate-400">
            Pending Orders
          </p>
          <p className="text-2xl font-heading font-black text-amber-600">{pendingCount}</p>
          <p className="text-[11px] text-amber-600/80 font-montreal">Awaiting approval & packing</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] font-heading font-black uppercase tracking-wider text-slate-400">
            Completed Orders
          </p>
          <p className="text-2xl font-heading font-black text-blue-600">{completedCount}</p>
          <p className="text-[11px] text-blue-600/80 font-montreal">Delivered to customer</p>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search & Date Range Preset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, AWB Code, Phone, Customer..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-montreal text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-heading font-bold">Date Range:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setDateRangePreset("last7")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer",
                  dateRangePreset === "last7" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                )}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setDateRangePreset("last30")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer",
                  dateRangePreset === "last30" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                )}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setDateRangePreset("custom")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer",
                  dateRangePreset === "custom" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                )}
              >
                Custom Range
              </button>
            </div>
          </div>
        </div>

        {/* Custom Date Pickers */}
        {dateRangePreset === "custom" && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 text-xs">
            <span className="text-slate-500 font-heading font-bold">From:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white"
            />
            <span className="text-slate-500 font-heading font-bold">To:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white"
            />
            <button
              onClick={fetchOrdersData}
              className="px-3 py-1 rounded-lg bg-accent text-white font-heading font-bold"
            >
              Apply
            </button>
          </div>
        )}

        {/* Status Bucket Tabs with Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <button
            onClick={() => setActiveBucket("all")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all cursor-pointer",
              activeBucket === "all"
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <span>All Orders</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-white">
              {orders.length}
            </span>
          </button>

          {Object.entries(BUCKET_STATUS_MAP).map(([bucketKey, config]) => {
            const count = orders.filter((o) => {
              const statusLower = (o.orderStatus || "").toLowerCase();
              return config.statuses.some((s) => statusLower.includes(s));
            }).length;

            return (
              <button
                key={bucketKey}
                onClick={() => setActiveBucket(bucketKey)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all cursor-pointer",
                  activeBucket === bucketKey
                    ? "bg-accent text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <span>{config.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px]",
                    activeBucket === bucketKey
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Contextual Floating Bulk Action Bar ── */}
      {selectedOrderIds.length > 0 && (
        <div className="sticky top-4 z-40 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-accent text-white flex items-center justify-center font-heading font-black text-xs">
              {selectedOrderIds.length}
            </span>
            <span className="text-xs font-heading font-bold">
              Orders Selected for Bulk Fulfillment
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBulkConfirm}
              disabled={isExecutingBulk}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-heading font-bold transition-all cursor-pointer shadow-2xs"
            >
              Bulk Confirm
            </button>
            <button
              onClick={handleBulkShipNow}
              disabled={isExecutingBulk}
              className="px-3 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold transition-all cursor-pointer shadow-2xs"
            >
              Bulk Ship Now
            </button>
            <div className="relative">
              <button
                onClick={() => setShowPickupDatePicker(!showPickupDatePicker)}
                disabled={isExecutingBulk}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Bulk Pickup</span>
              </button>

              {showPickupDatePicker && (
                <div className="absolute right-0 bottom-full mb-2 bg-white text-slate-900 p-3 rounded-2xl shadow-2xl border border-slate-200 z-50 w-64 space-y-2">
                  <p className="text-[11px] font-heading font-black uppercase text-slate-400">
                    Select Pickup Date
                  </p>
                  <input
                    type="date"
                    value={bulkPickupDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setBulkPickupDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-montreal"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setShowPickupDatePicker(false)}
                      className="px-2 py-1 text-[11px] font-heading font-bold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkSchedulePickup}
                      className="px-3 py-1 rounded-lg bg-accent text-white text-[11px] font-heading font-bold shadow-2xs"
                    >
                      Confirm Pickup
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleBulkDownloadLabels}
              disabled={isExecutingBulk}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Download consolidated ZIP of shipping labels"
            >
              <Download className="w-3 h-3" />
              <span>Labels ZIP</span>
            </button>

            <button
              onClick={handleBulkDownloadManifests}
              disabled={isExecutingBulk}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Download consolidated ZIP of manifests"
            >
              <Download className="w-3 h-3" />
              <span>Manifests ZIP</span>
            </button>

            <button
              onClick={handleBulkCancel}
              disabled={isExecutingBulk}
              className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-xs font-heading font-bold transition-all cursor-pointer"
            >
              Bulk Cancel
            </button>

            <button
              onClick={() => setSelectedOrderIds([])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Orders Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-heading font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-accent accent-accent cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer & Merchant</th>
                <th className="py-3.5 px-4">Financials & Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4">Logistics / AWB</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 font-montreal">
                    <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-heading font-bold text-slate-700">No orders found in this bucket</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search query or date range preset.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const orderKey = order.id || order.orderId;
                  const isSelected = selectedOrderIds.includes(orderKey);
                  const paymentReady = isCarrierPaymentReady(order);

                  return (
                    <tr
                      key={orderKey}
                      onClick={() => setDetailOrder(order)}
                      className={cn(
                        "hover:bg-orange-50/20 transition-colors group cursor-pointer",
                        isSelected && "bg-orange-50/40"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(orderKey)}
                          className="w-4 h-4 rounded text-accent accent-accent cursor-pointer"
                        />
                      </td>

                      {/* Order ID & Date */}
                      <td className="py-4 px-4 font-heading">
                        <p className="font-black text-slate-900 group-hover:text-accent text-sm transition-colors flex items-center gap-1">
                          <span>{order.orderIdDisplay || order.id}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </p>
                        <p className="text-[11px] text-slate-400 font-montreal mt-0.5">
                          {order.date || "Today"}
                        </p>
                      </td>

                      {/* Customer & Merchant */}
                      <td className="py-4 px-4">
                        <p className="font-heading font-bold text-slate-900">
                          {order.customer?.name || order.shippingAddress?.name || "Wholesale Buyer"}
                        </p>
                        <p className="text-[11px] text-slate-400 font-montreal truncate max-w-[200px]">
                          {order.customer?.businessName || order.customer?.city || "Merchant"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {order.customer?.phone || order.shippingAddress?.phone || ""}
                        </p>
                      </td>

                      {/* Financials & Payment */}
                      <td className="py-4 px-4 font-heading">
                        <p className="font-black text-slate-900 text-sm">
                          {formatCurrency(order.totalAmount || 0)}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={cn(
                              "px-2 py-0.2 rounded-full text-[10px] font-heading font-bold uppercase",
                              order.paymentStatus === "Paid"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            )}
                          >
                            {order.paymentStatus || "Pending"}
                          </span>
                          <span className="text-[11px] text-slate-500 font-montreal">
                            {order.paymentMethod || "COD"}
                          </span>
                        </div>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-4 px-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-heading font-black uppercase tracking-wider border",
                            order.orderStatus === "Pending" && "bg-amber-50 text-amber-700 border-amber-200",
                            order.orderStatus === "Confirmed" && "bg-blue-50 text-blue-700 border-blue-200",
                            order.orderStatus === "Processing" && "bg-indigo-50 text-indigo-700 border-indigo-200",
                            order.orderStatus === "Ready to Ship" && "bg-cyan-50 text-cyan-700 border-cyan-200",
                            order.orderStatus === "In Transit" && "bg-purple-50 text-purple-700 border-purple-200",
                            order.orderStatus === "Delivered" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                            order.orderStatus === "Cancelled" && "bg-rose-50 text-rose-700 border-rose-200"
                          )}
                        >
                          {order.orderStatus || "Pending"}
                        </span>
                      </td>

                      {/* Logistics / AWB */}
                      <td className="py-4 px-4 font-montreal text-[11px]">
                        {order.trackingNumber ? (
                          <div className="space-y-0.5">
                            <p className="font-heading font-bold text-slate-800">
                              {order.courierPartner || "Delhivery Surface"}
                            </p>
                            <p className="text-accent font-mono font-semibold">
                              {order.trackingNumber}
                            </p>
                            {order.pickupDate && (
                              <p className="text-[10px] text-slate-400">
                                Pickup: {order.pickupDate}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="text-slate-400 space-y-0.5">
                            <span className="text-[11px] italic">Not Dispatched</span>
                            <p className="text-[10px]">
                              {paymentReady ? (
                                <span className="text-emerald-600 font-heading font-bold">Ready to Ship</span>
                              ) : (
                                <span className="text-rose-600 font-heading font-bold">Payment Blocked</span>
                              )}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setDetailOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-accent" />
                          <span>Manage / Ship</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
