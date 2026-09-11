import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { restoreOrder, deleteOrderPermanently } from "@/store/slices/adminArchivedSlice";
import {
  Archive,
  Search,
  Filter,
  RotateCcw,
  Trash2,
  Calendar,
  Download,
  FileText,
  CreditCard,
  MapPin,
  CheckCircle2,
  DollarSign,
  Info,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function ArchivedOrdersView() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.adminArchived?.orders || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedReason, setSelectedReason] = useState("All");
  const [activeModalOrder, setActiveModalOrder] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const statuses = useMemo(() => {
    const set = new Set(orders.map((o) => o.fulfillmentStatus));
    return ["All", ...Array.from(set)];
  }, [orders]);

  const reasons = useMemo(() => {
    const set = new Set(orders.map((o) => o.archiveReason));
    return ["All", ...Array.from(set)];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.destinationCity.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === "All" || o.fulfillmentStatus === selectedStatus;
      const matchReason = selectedReason === "All" || o.archiveReason === selectedReason;
      return matchSearch && matchStatus && matchReason;
    });
  }, [orders, searchTerm, selectedStatus, selectedReason]);

  const totalValue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [orders]);

  const handleRestore = (order) => {
    dispatch(restoreOrder(order.id));
    toast.success(`Order ${order.orderNumber} restored to active orders list.`);
  };

  const handleDelete = (order) => {
    dispatch(deleteOrderPermanently(order.id));
    setDeleteTargetId(null);
    toast.error(`Order ${order.orderNumber} purged permanently.`);
  };

  const handleDownloadInvoice = (order) => {
    toast.success(`Invoice archive slip for ${order.orderNumber} downloaded.`);
  };

  const handleExportCSV = () => {
    const headers = ["Archive ID", "Order Number", "Customer Name", "Customer Email", "Order Date", "Archive Date", "Total Amount (INR)", "Payment Method", "Fulfillment Status", "Reason"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerEmail,
      o.orderDate,
      o.archiveDate,
      o.totalAmount,
      `"${o.paymentMethod}"`,
      `"${o.fulfillmentStatus}"`,
      `"${o.archiveReason}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `archived_orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Archived orders exported.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-slate-500" />
              Historical Ledger
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Immutable Records</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Archived Orders Record
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Historical database of fulfilled, settled, or retention-archived customer purchases with invoice retrieval.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Orders CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Archived Orders</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Archive className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{orders.length}</p>
          <p className="text-xs text-slate-400 mt-1">Stored in long-term archive</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Value In Vault</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            ₹{totalValue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Historical revenue settled</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Policy Archived (&gt;180d)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {orders.filter((o) => o.archiveReason.includes("180")).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Automatic lifecycle archive</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Audit Verified</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">100%</p>
          <p className="text-xs text-slate-400 mt-1">Tax & audit slips available</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order number, customer name, email, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-inter text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-1" />
            <span className="text-xs font-medium text-slate-500">Status:</span>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px] h-8 text-xs font-semibold text-slate-800 border-none bg-transparent shadow-none focus:ring-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <span className="text-xs font-medium text-slate-500 ml-1">Archive Reason:</span>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger className="w-[180px] h-8 text-xs font-semibold text-slate-800 border-none bg-transparent shadow-none focus:ring-0">
                <SelectValue placeholder="Archive Reason" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Order Information</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Order Total</th>
                <th className="p-4">Historical Status</th>
                <th className="p-4">Archived Reason</th>
                <th className="p-4">Archive Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Archive className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No archived orders match your search</p>
                    <p className="text-xs text-slate-400 mt-1">Check your keyword or reset filters</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div>
                        <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Ordered: {order.orderDate}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                          {order.itemsSummary}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-slate-900">{order.customerName}</p>
                        <p className="text-xs text-slate-400">{order.customerEmail}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {order.destinationCity}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-900">₹{order.totalAmount.toLocaleString()}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                          <CreditCard className="w-3 h-3" />
                          {order.paymentMethod}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        {order.fulfillmentStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {order.archiveReason}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-xs text-slate-600">
                        <p className="font-semibold text-slate-800">{order.archiveDate}</p>
                        <p className="text-[11px] text-slate-400">ID: {order.id}</p>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          title="Download Historical Invoice PDF"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveModalOrder(order)}
                          title="View Archive Dossier"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRestore(order)}
                          title="Restore Order to Active View"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restore
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(order.id)}
                          title="Purge Order Permanently"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteTargetId(null);
          }}
          className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-poppins font-bold text-slate-900">
              Permanently Purge Order Record?
            </h3>
            <p className="text-sm text-slate-500 font-inter mt-2">
              Are you sure? Once purged from cold storage, this order and its audit trail cannot be recovered.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const target = orders.find((o) => o.id === deleteTargetId);
                  if (target) handleDelete(target);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md cursor-pointer"
              >
                Purge Record
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Order Detail Modal */}
      {activeModalOrder && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalOrder(null);
          }}
          className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-poppins font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>Order Archive Snapshot</span>
                  <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {activeModalOrder.orderNumber}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeModalOrder.id}</p>
              </div>
              <button
                onClick={() => setActiveModalOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-slate-400 block font-medium">Customer</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{activeModalOrder.customerName}</span>
                  <span className="text-slate-500 block text-[11px]">{activeModalOrder.customerEmail}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-slate-400 block font-medium">Destination</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{activeModalOrder.destinationCity}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-slate-400 block font-medium">Original Order Date</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{activeModalOrder.orderDate}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-slate-400 block font-medium">Archive Timestamp</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{activeModalOrder.archiveDate}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs text-slate-400 font-medium block">Purchased Items</span>
                <p className="text-xs text-slate-800 font-medium mt-1">{activeModalOrder.itemsSummary}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">Payment: {activeModalOrder.paymentMethod}</span>
                  <span className="font-bold text-slate-900 text-sm">₹{activeModalOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <span className="text-amber-800 font-semibold block">Archive Justification</span>
                <p className="text-amber-700 mt-0.5">{activeModalOrder.archiveReason}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => handleDownloadInvoice(activeModalOrder)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                Download Slip
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModalOrder(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleRestore(activeModalOrder);
                    setActiveModalOrder(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore Order
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
