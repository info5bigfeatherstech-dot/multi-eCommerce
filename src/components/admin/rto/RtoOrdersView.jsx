import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilterStatus, setSearchQuery } from "@/store/slices/adminRtoSlice";
import {
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Truck,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Building2,
  MapPin,
  FileText,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  PackageCheck,
  X,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function RtoOrdersView() {
  const dispatch = useAppDispatch();
  const rtoItems = useAppSelector((state) => state.adminRto.items);
  const filterStatus = useAppSelector((state) => state.adminRto.filterStatus);
  const searchQuery = useAppSelector((state) => state.adminRto.searchQuery);

  const [selectedRto, setSelectedRto] = useState(null);

  // Status Tabs
  const statusTabs = [
    { label: "All Records", value: "All" },
    { label: "Delivery Failed / NDR", value: "Delivery Failed" },
    { label: "In-Transit to Origin", value: "In-Transit to Origin" },
    { label: "Warehouse Received", value: "Warehouse Received" },
    { label: "Re-attempted", value: "Re-attempted" },
    { label: "Closed", value: "Closed" },
  ];

  // Filtered RTO items
  const filteredItems = useMemo(() => {
    return rtoItems.filter((item) => {
      const matchesStatus =
        filterStatus === "All" ? true : item.rtoStatus === filterStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.id.toLowerCase().includes(q) ||
        item.orderId.toLowerCase().includes(q) ||
        item.buyer.name.toLowerCase().includes(q) ||
        item.buyer.businessName.toLowerCase().includes(q) ||
        item.buyer.phone.includes(q) ||
        item.buyer.city.toLowerCase().includes(q) ||
        item.forwardAwb.toLowerCase().includes(q) ||
        (item.reverseAwb && item.reverseAwb.toLowerCase().includes(q)) ||
        item.rtoReason.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [rtoItems, filterStatus, searchQuery]);

  // Summary KPIs
  const totalRtoCount = rtoItems.length;
  const totalValueAtRisk = rtoItems.reduce((acc, curr) => acc + curr.orderValue, 0);
  const ndrOpenCount = rtoItems.filter((i) => i.rtoStatus === "Delivery Failed").length;
  const inTransitCount = rtoItems.filter((i) => i.rtoStatus === "In-Transit to Origin").length;
  const warehouseReceivedCount = rtoItems.filter((i) => i.rtoStatus === "Warehouse Received").length;
  const totalFreightLoss = rtoItems.reduce(
    (acc, curr) => acc + curr.forwardFreight + (curr.reverseFreight || 0),
    0
  );

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "RTO ID",
      "Order ID",
      "Buyer Name",
      "Business",
      "City",
      "State",
      "Order Value",
      "Payment Mode",
      "Forward Courier",
      "Forward AWB",
      "Reverse Courier",
      "Reverse AWB",
      "RTO Status",
      "RTO Reason",
      "Courier Remark",
      "Verification Status",
      "Freight Loss (₹)",
    ];

    const rows = filteredItems.map((r) => [
      r.id,
      r.orderId,
      `"${r.buyer.name}"`,
      `"${r.buyer.businessName}"`,
      r.buyer.city,
      r.buyer.state,
      r.orderValue,
      r.paymentMode,
      r.forwardCourier,
      r.forwardAwb,
      r.reverseCourier || "N/A",
      r.reverseAwb || "N/A",
      r.rtoStatus,
      `"${r.rtoReason}"`,
      `"${r.courierRemark}"`,
      r.verification.status,
      r.forwardFreight + (r.reverseFreight || 0),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apexmart_rto_records_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported RTO records to CSV");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivery Failed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "In-Transit to Origin":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Warehouse Received":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Re-attempted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Closed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-poppins font-black uppercase tracking-wider">
              Undelivered Shipments
            </span>
            <span className="text-xs text-slate-400 font-inter">NDR & Reverse Logistics</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            RTO Orders Record
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Complete database of all undelivered shipments, failed attempts, and reverse transit to warehouse origin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-poppins font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Total RTO Cases
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-accent flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">{totalRtoCount}</p>
          <span className="text-[10px] text-slate-400 font-inter">Cumulative orders</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Value at Risk
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-rose-600">
            ₹{totalValueAtRisk.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Wholesale inventory</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              NDR Action Required
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-amber-600">{ndrOpenCount}</p>
          <span className="text-[10px] text-amber-600 font-medium font-inter">Requires buyer outreach</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              RTS In-Transit
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-blue-600">{inTransitCount}</p>
          <span className="text-[10px] text-slate-400 font-inter">Returning to warehouse</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Total Freight Loss
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-purple-700">
            ₹{totalFreightLoss.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Forward + Reverse shipping</span>
        </div>
      </div>

      {/* ── Filters & Search Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
          {statusTabs.map((tab) => {
            const count =
              tab.value === "All"
                ? rtoItems.length
                : rtoItems.filter((i) => i.rtoStatus === tab.value).length;
            const isActive = filterStatus === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => dispatch(setFilterStatus(tab.value))}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-poppins font-semibold whitespace-nowrap transition-all cursor-pointer",
                  isActive
                    ? "bg-accent text-white shadow-xs font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px]",
                    isActive ? "bg-white/20 text-white font-bold" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by RTO ID, Order ID, Buyer name, Business, Phone, AWB tracking, or Reason..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-inter text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-accent bg-slate-50/50 focus:bg-white transition-colors"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(""))}
              className="px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── RTO Data Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">RTO / Order ID</th>
                <th className="py-3.5 px-4">Consignee & Business</th>
                <th className="py-3.5 px-4">Order Value & Mode</th>
                <th className="py-3.5 px-4">Courier & AWB</th>
                <th className="py-3.5 px-4">RTO Reason & Remarks</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-inter">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RotateCcw className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-poppins font-bold text-slate-700">No RTO records found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* RTO / Order ID */}
                    <td className="py-4 px-4 font-poppins">
                      <p className="font-bold text-slate-900 text-xs">{item.id}</p>
                      <p className="text-[11px] text-accent font-semibold">{item.orderId}</p>
                      <span className="text-[10px] text-slate-400">RTO: {item.rtoDate}</span>
                    </td>

                    {/* Consignee */}
                    <td className="py-4 px-4">
                      <p className="font-poppins font-bold text-slate-900 text-xs leading-tight">
                        {item.buyer.name}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[150px]">{item.buyer.businessName}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>
                          {item.buyer.city}, {item.buyer.state}
                        </span>
                      </p>
                    </td>

                    {/* Order Value & Mode */}
                    <td className="py-4 px-4 font-poppins">
                      <p className="font-bold text-slate-900">₹{item.orderValue.toLocaleString("en-IN")}</p>
                      <span
                        className={cn(
                          "inline-block px-1.5 py-0.2 rounded text-[9px] font-bold mt-0.5",
                          item.paymentMode === "Prepaid UPI"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        )}
                      >
                        {item.paymentMode}
                      </span>
                    </td>

                    {/* Courier & AWB */}
                    <td className="py-4 px-4 font-inter">
                      <p className="font-semibold text-slate-800 text-[11px]">{item.forwardCourier}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.forwardAwb}</p>
                      {item.reverseAwb && (
                        <span className="text-[10px] text-amber-700 font-mono font-medium block mt-0.5">
                          Rev: {item.reverseAwb}
                        </span>
                      )}
                    </td>

                    {/* RTO Reason */}
                    <td className="py-4 px-4 max-w-[220px]">
                      <p className="font-poppins font-semibold text-slate-800 text-[11px]">
                        {item.rtoReason}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 italic mt-0.5">
                        "{item.courierRemark}"
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-poppins font-bold border",
                          getStatusBadge(item.rtoStatus)
                        )}
                      >
                        {item.rtoStatus}
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td className="py-4 px-4 font-poppins">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold block w-fit",
                          item.verification.status === "Fake Attempt Confirmed"
                            ? "bg-rose-100 text-rose-800"
                            : item.verification.status === "Genuine Rejection"
                            ? "bg-slate-100 text-slate-700"
                            : item.verification.status === "Dispute Raised"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {item.verification.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedRto(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-poppins font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── RTO Detailed Record Modal ── */}
      {selectedRto && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-poppins font-bold uppercase">
                    {selectedRto.id}
                  </span>
                  <span className="text-xs text-slate-400 font-inter">Order #{selectedRto.orderId}</span>
                </div>
                <h2 className="text-lg font-poppins font-black text-slate-900 mt-1">
                  RTO Record & Delivery Attempt Audit
                </h2>
              </div>
              <button
                onClick={() => setSelectedRto(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs font-inter">
              {/* Buyer & Shipment Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-500">
                    Consignee Information
                  </p>
                  <p className="font-poppins font-bold text-slate-900 text-sm">{selectedRto.buyer.name}</p>
                  <p className="text-slate-600">{selectedRto.buyer.businessName}</p>
                  <p className="text-slate-500">{selectedRto.buyer.address}</p>
                  <p className="text-slate-500">
                    {selectedRto.buyer.city}, {selectedRto.buyer.state} - {selectedRto.buyer.pincode}
                  </p>
                  <p className="text-slate-700 font-semibold pt-1">Phone: {selectedRto.buyer.phone}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-500">
                    Logistics & Cost Breakdown
                  </p>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Forward Courier:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedRto.forwardCourier} ({selectedRto.forwardAwb})
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Reverse Courier:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedRto.reverseCourier || "Pending Dispatch"} ({selectedRto.reverseAwb || "N/A"})
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Forward Freight:</span>
                    <span className="font-semibold text-slate-800">₹{selectedRto.forwardFreight}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Reverse Freight:</span>
                    <span className="font-semibold text-slate-800">₹{selectedRto.reverseFreight || 0}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-poppins font-bold text-rose-600">
                    <span>Total Freight Loss:</span>
                    <span>₹{selectedRto.forwardFreight + (selectedRto.reverseFreight || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Attempt History Logs */}
              <div className="space-y-3">
                <p className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-500">
                  Courier Delivery Attempts Log ({selectedRto.deliveryAttempts.length} Attempts)
                </p>
                <div className="space-y-2">
                  {selectedRto.deliveryAttempts.map((attempt) => (
                    <div
                      key={attempt.attemptNumber}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          #{attempt.attemptNumber}
                        </div>
                        <div>
                          <p className="font-poppins font-bold text-slate-800">
                            {attempt.status} — {attempt.reason}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Attempted by: <span className="text-slate-600 font-medium">{attempt.agentName}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap">
                        {attempt.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Audit & Internal Notes */}
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200/60 space-y-2">
                <p className="text-[11px] font-poppins font-bold uppercase tracking-wider text-accent">
                  Verification & NDR Investigation
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Verification Outcome:</span>
                  <span className="px-2 py-0.5 rounded bg-white text-slate-800 font-bold border border-orange-200">
                    {selectedRto.verification.status}
                  </span>
                </div>
                {selectedRto.verification.customerFeedback && (
                  <p className="text-slate-600 italic">
                    Buyer Statement: "{selectedRto.verification.customerFeedback}"
                  </p>
                )}
                {selectedRto.verification.disputeTicketId && (
                  <p className="text-purple-700 font-bold">
                    Courier Dispute Ticket: #{selectedRto.verification.disputeTicketId} (Filed on {selectedRto.verification.disputeRaisedDate})
                  </p>
                )}
                <p className="text-slate-500 text-[11px]">
                  Internal Log: {selectedRto.verification.internalNotes}
                </p>
              </div>

              {/* Returned Items */}
              <div className="space-y-2">
                <p className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-500">
                  Shipment Items ({selectedRto.items.length})
                </p>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <tr>
                        <th className="p-2.5">Product</th>
                        <th className="p-2.5">SKU</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRto.items.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2.5 font-medium text-slate-800">{item.name}</td>
                          <td className="p-2.5 font-mono text-slate-500">{item.sku}</td>
                          <td className="p-2.5 text-center font-bold text-slate-800">{item.quantity}</td>
                          <td className="p-2.5 text-right">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">
                            ₹{item.total.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedRto(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-poppins font-bold text-slate-700 transition-colors shadow-2xs"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
