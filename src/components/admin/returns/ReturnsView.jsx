import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { approveReturnRequest, rejectReturnRequest } from "@/store/slices/adminReturnsSlice";
import {
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Eye,
  Building2,
  Phone,
  Package,
  AlertTriangle,
  FileText,
  X,
  Send,
  ExternalLink,
  Download,
  Image as ImageIcon,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ReturnsView() {
  const dispatch = useAppDispatch();
  const returnsList = useAppSelector((state) => state.adminReturns.items);

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [approveModalReturn, setApproveModalReturn] = useState(null);
  const [courierPartner, setCourierPartner] = useState("Delhivery Reverse Logistics");

  const filteredReturns = returnsList.filter((ret) => {
    if (activeTab !== "All" && ret.returnStatus !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ret.id.toLowerCase().includes(q) ||
        ret.orderId.toLowerCase().includes(q) ||
        ret.customer.name.toLowerCase().includes(q) ||
        ret.customer.businessName.toLowerCase().includes(q) ||
        ret.customer.phone.includes(q) ||
        ret.item.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = returnsList.filter((r) => r.returnStatus === "Requested").length;
  const pickupCount = returnsList.filter((r) => r.returnStatus === "Pickup Scheduled").length;
  const inTransitCount = returnsList.filter((r) => r.returnStatus === "Reverse In-Transit").length;
  const qcCount = returnsList.filter((r) => r.returnStatus.startsWith("QC")).length;
  const rejectedCount = returnsList.filter((r) => r.returnStatus === "Rejected").length;

  const handleConfirmApprove = (e) => {
    e.preventDefault();
    if (!approveModalReturn) return;
    dispatch(
      approveReturnRequest({
        returnId: approveModalReturn.id,
        courier: courierPartner,
        awb: `DEL-REV-${Math.floor(1000000 + Math.random() * 9000000)}`,
      })
    );
    toast.success(`Return ${approveModalReturn.id} approved! Reverse pickup scheduled via ${courierPartner}.`);
    setApproveModalReturn(null);
  };

  const handleReject = (returnId) => {
    const reason = prompt("Enter reason for rejecting wholesale return request:", "Product out of 7-day return policy / no defect observed");
    if (reason !== null) {
      dispatch(rejectReturnRequest({ returnId, reason }));
      toast.error(`Return ${returnId} has been rejected.`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Requested":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Pickup Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Reverse In-Transit":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "QC Pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "QC Passed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "QC Failed":
      case "Rejected":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-inter">
            <span>Returns & Refunds</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Customer Returns</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 mt-1">
            Customer Return Requests
          </h1>
          <p className="text-xs text-slate-500 font-inter">
            Manage incoming wholesale customer return claims, approve reverse pickups, and inspect proof attachments
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider">Total Claims</p>
          <p className="text-2xl font-poppins font-black text-slate-900 mt-1">{returnsList.length}</p>
          <p className="text-[10px] text-slate-400 font-inter mt-0.5">All customer return logs</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-poppins font-bold text-amber-600 uppercase tracking-wider">Pending Action</p>
          <p className="text-2xl font-poppins font-black text-amber-700 mt-1">{pendingCount}</p>
          <p className="text-[10px] text-amber-600/70 font-inter mt-0.5">Awaiting admin decision</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-poppins font-bold text-blue-600 uppercase tracking-wider">Pickup Scheduled</p>
          <p className="text-2xl font-poppins font-black text-blue-700 mt-1">{pickupCount}</p>
          <p className="text-[10px] text-blue-600/70 font-inter mt-0.5">Reverse logistics booked</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-poppins font-bold text-purple-600 uppercase tracking-wider">In Transit / QC</p>
          <p className="text-2xl font-poppins font-black text-purple-700 mt-1">{inTransitCount + qcCount}</p>
          <p className="text-[10px] text-purple-600/70 font-inter mt-0.5">Moving to warehouse dock</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-poppins font-bold text-rose-600 uppercase tracking-wider">Rejected Claims</p>
          <p className="text-2xl font-poppins font-black text-rose-700 mt-1">{rejectedCount}</p>
          <p className="text-[10px] text-rose-600/70 font-inter mt-0.5">Invalid claims dismissed</p>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100">
          {[
            { label: "All Returns", key: "All", count: returnsList.length },
            { label: "Requested (Pending)", key: "Requested", count: pendingCount },
            { label: "Pickup Scheduled", key: "Pickup Scheduled", count: pickupCount },
            { label: "In-Transit", key: "Reverse In-Transit", count: inTransitCount },
            { label: "QC Pending", key: "QC Pending", count: returnsList.filter((r) => r.returnStatus === "QC Pending").length },
            { label: "Rejected", key: "Rejected", count: rejectedCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-poppins font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer",
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px]",
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-700"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search return request by Return ID, Order ID, Customer name, Phone, or Product SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent font-inter transition-colors"
          />
        </div>
      </div>

      {/* Returns Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-inter">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-poppins font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Return & Order ID</th>
                <th className="py-3.5 px-4">Customer & City</th>
                <th className="py-3.5 px-4">Item & Units</th>
                <th className="py-3.5 px-4">Claimed Reason</th>
                <th className="py-3.5 px-4">Claim Value</th>
                <th className="py-3.5 px-4">Return Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <RotateCcw className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-poppins font-bold text-sm text-slate-600">No return requests found</p>
                    <p className="text-xs text-slate-400 mt-1">Try another filter tab or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredReturns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4">
                      <span className="font-poppins font-bold text-slate-900 block">{ret.id}</span>
                      <span className="text-[11px] text-accent font-mono font-semibold block">{ret.orderId}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{ret.requestDate}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <span className="font-poppins font-bold text-slate-800 block">{ret.customer.name}</span>
                      <span className="text-[11px] text-slate-500 truncate block max-w-[140px]">{ret.customer.businessName}</span>
                      <span className="text-[10px] text-slate-400 block">{ret.customer.city}, {ret.customer.state}</span>
                    </td>

                    {/* Item */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 line-clamp-1 max-w-[180px]" title={ret.item.name}>
                        {ret.item.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        <span>Qty: <strong className="text-slate-800">{ret.item.qty} pcs</strong></span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">{ret.item.sku}</span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-poppins font-bold text-[10px] inline-block mb-1">
                        {ret.reasonCategory}
                      </span>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{ret.reasonDetails}</p>
                    </td>

                    {/* Value */}
                    <td className="py-3.5 px-4">
                      <span className="font-poppins font-bold text-slate-900 block">
                        {formatCurrency(ret.refundAmount)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-inter">
                        Refund: <strong className={ret.refundStatus === "Refunded" ? "text-emerald-600" : "text-amber-600"}>{ret.refundStatus}</strong>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-poppins font-bold border inline-block", getStatusBadge(ret.returnStatus))}>
                        {ret.returnStatus}
                      </span>
                      {ret.reverseAwb && (
                        <span className="text-[10px] font-mono text-purple-700 block mt-1">
                          {ret.reverseAwb}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedReturn(ret)}
                        title="View Details & Proof Photo"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors inline-block cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {ret.returnStatus === "Requested" && (
                        <>
                          <button
                            onClick={() => setApproveModalReturn(ret)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(ret.id)}
                            className="px-2 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-poppins font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Details & Proof Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="font-poppins font-bold text-sm">Return Claim: {selectedReturn.id}</span>
                <p className="text-[11px] text-slate-400">Linked to Order #{selectedReturn.orderId}</p>
              </div>
              <button onClick={() => setSelectedReturn(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs font-inter">
              {/* Customer & Item Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase">Wholesale Buyer</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedReturn.customer.name}</p>
                  <p className="text-slate-600">{selectedReturn.customer.businessName}</p>
                  <p className="text-slate-500">{selectedReturn.customer.phone}</p>
                  <p className="text-slate-500">{selectedReturn.customer.address}, {selectedReturn.customer.city} - {selectedReturn.customer.pincode}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase">Product Returned</span>
                  <p className="font-bold text-slate-900">{selectedReturn.item.name}</p>
                  <p className="text-slate-600 font-mono">SKU: {selectedReturn.item.sku}</p>
                  <p className="text-slate-600">Quantity: <strong>{selectedReturn.item.qty} units</strong></p>
                  <p className="text-slate-900 font-bold font-poppins">Total Claim Value: {formatCurrency(selectedReturn.refundAmount)}</p>
                </div>
              </div>

              {/* Reason Details */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-poppins font-bold text-[10px]">
                    Category: {selectedReturn.reasonCategory}
                  </span>
                </div>
                <p className="text-xs text-amber-900 font-medium leading-relaxed pt-1">
                  "{selectedReturn.reasonDetails}"
                </p>
              </div>

              {/* Photo Proof Attachment */}
              <div>
                <span className="font-poppins font-bold text-slate-700 block mb-2">Customer Proof Attachment:</span>
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 max-h-56 relative group">
                  <img
                    src={selectedReturn.proofImage}
                    alt="Damage proof"
                    className="w-full h-56 object-cover object-center"
                  />
                  <a
                    href={selectedReturn.proofImage}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-poppins font-semibold flex items-center gap-1 hover:bg-black"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Full Image</span>
                  </a>
                </div>
              </div>

              {selectedReturn.qcNotes && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900">
                  <span className="font-bold block text-[10px] font-poppins uppercase">Warehouse QC Inspection Note:</span>
                  <p className="mt-0.5">{selectedReturn.qcNotes}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Status: <strong className="text-slate-800">{selectedReturn.returnStatus}</strong></span>
              <button
                onClick={() => setSelectedReturn(null)}
                className="px-4 py-2 bg-slate-900 text-white font-poppins font-bold text-xs rounded-xl hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Pickup Approval Modal */}
      {approveModalReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-poppins font-bold text-sm">Approve & Schedule Reverse Pickup</span>
              <button onClick={() => setApproveModalReturn(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmApprove} className="p-6 space-y-4 text-xs font-inter">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900">Approving Claim {approveModalReturn.id}</p>
                <p className="text-slate-500 mt-0.5">Pickup Address: {approveModalReturn.customer.city} ({approveModalReturn.customer.pincode})</p>
                <p className="text-slate-500 font-semibold mt-0.5">{approveModalReturn.item.qty} units × {approveModalReturn.item.name}</p>
              </div>

              <div>
                <label className="block text-xs font-poppins font-semibold text-slate-700 mb-1.5">
                  Reverse Logistics Partner
                </label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-poppins text-xs font-semibold text-slate-800 focus:outline-none focus:border-accent"
                >
                  <option value="Delhivery Reverse Logistics">Delhivery Reverse Logistics</option>
                  <option value="BlueDart Return Express">BlueDart Return Express</option>
                  <option value="Ekart Reverse Desk">Ekart Reverse Desk</option>
                  <option value="Direct Warehouse Drop-off">Direct Warehouse Drop-off</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApproveModalReturn(null)}
                  className="px-4 py-2 rounded-xl text-xs font-poppins font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Confirm & Book Pickup</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
