import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  notifyCustomer,
  updateQueryStatus,
  deleteQuery,
} from "@/store/slices/adminStockQueriesSlice";
import {
  BellRing,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Mail,
  Phone,
  Send,
  Eye,
  Trash2,
  DollarSign,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function AllStockQueriesView() {
  const dispatch = useAppDispatch();
  const queries = useAppSelector((state) => state.adminStockQueries?.queries || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [detailModalQuery, setDetailModalQuery] = useState(null);

  const statuses = ["All", "Pending", "Notified", "Restocked", "Cancelled"];
  const priorities = ["All", "Urgent", "High", "Medium", "Low"];

  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      const matchSearch =
        q.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === "All" || q.status === selectedStatus;
      const matchPriority = selectedPriority === "All" || q.priority === selectedPriority;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [queries, searchTerm, selectedStatus, selectedPriority]);

  const pendingCount = useMemo(() => queries.filter((q) => q.status === "Pending").length, [queries]);
  const notifiedCount = useMemo(() => queries.filter((q) => q.status === "Notified").length, [queries]);
  const totalPotentialRevenue = useMemo(() => queries.reduce((acc, q) => acc + (q.potentialRevenue || 0), 0), [queries]);

  const handleNotify = (query) => {
    dispatch(notifyCustomer({ id: query.id }));
    toast.success(`Restock alert dispatched to ${query.customerName} via ${query.channel}.`);
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateQueryStatus({ id, status: newStatus }));
    toast.info(`Query marked as ${newStatus}.`);
  };

  const handleDelete = (id) => {
    dispatch(deleteQuery(id));
    toast.error("Stock query removed.");
  };

  const handleExportCSV = () => {
    const headers = ["Query ID", "Product Name", "SKU", "Customer Name", "Email", "Phone", "Channel", "Qty", "Request Date", "Status", "Potential Revenue (INR)", "Priority"];
    const rows = filteredQueries.map((q) => [
      q.id,
      `"${q.productName.replace(/"/g, '""')}"`,
      q.sku,
      `"${q.customerName}"`,
      q.customerEmail,
      `"${q.customerPhone}"`,
      q.channel,
      q.requestedQuantity,
      q.requestDate,
      q.status,
      q.potentialRevenue,
      q.priority,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stock_queries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Out of stock queries exported as CSV.");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-amber-600" />
              Stock Waitlist & Inquiries
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Live Demand Capture</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            All Stock-Related Customer Queries
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Complete dashboard of customer back-in-stock notifications, restock interest, and demand volume tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Queries CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Queries</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{queries.length}</p>
          <p className="text-xs text-slate-400 mt-1">Across all out-of-stock SKUs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Waitlist</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{pendingCount}</p>
          <p className="text-xs text-slate-400 mt-1">Awaiting restock alert broadcast</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dispatched Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{notifiedCount}</p>
          <p className="text-xs text-slate-400 mt-1">Customers notified upon arrival</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Potential Demand</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            ₹{totalPotentialRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Uncaptured revenue in waitlist</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU, customer name, email, or query ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-inter text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-36">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                <div className="flex items-center gap-1.5 truncate">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "All" ? "All Statuses" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-36">
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p === "All" ? "All Priorities" : `${p} Priority`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Queries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Product Details</th>
                <th className="p-4">Customer Info</th>
                <th className="p-4">Alert Channel</th>
                <th className="p-4">Qty & Revenue</th>
                <th className="p-4">Priority & Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <BellRing className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No stock queries found</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting search filters</p>
                  </td>
                </tr>
              ) : (
                filteredQueries.map((query) => {
                  const isPending = query.status === "Pending";
                  return (
                    <tr key={query.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={query.productImage}
                            alt={query.productName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">{query.productName}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                {query.sku}
                              </span>
                              <span>•</span>
                              <span>ID: {query.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-slate-900">{query.customerName}</p>
                          <div className="text-xs space-y-0.5 mt-0.5 text-slate-500">
                            <p className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {query.customerEmail}
                            </p>
                            <p className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {query.customerPhone}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                          {query.channel}
                        </span>
                      </td>

                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-900">₹{query.potentialRevenue.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">{query.requestedQuantity} unit(s) requested</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                              query.priority === "Urgent"
                                ? "bg-rose-100 text-rose-800"
                                : query.priority === "High"
                                ? "bg-amber-100 text-amber-800"
                                : query.priority === "Medium"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {query.priority} Priority
                          </span>
                          <p className="text-[11px] text-slate-400 mt-1">{query.requestDate}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="w-32">
                          <Select
                            value={query.status}
                            onValueChange={(val) => handleStatusChange(query.id, val)}
                          >
                            <SelectTrigger className="h-7 text-xs font-semibold bg-white border-slate-200">
                              <SelectValue placeholder={query.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Notified">Notified</SelectItem>
                              <SelectItem value="Restocked">Restocked</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <button
                              onClick={() => handleNotify(query)}
                              title="Send Restock Notification Now"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Notify
                            </button>
                          )}
                          <button
                            onClick={() => setDetailModalQuery(query)}
                            title="Inspect Query Details"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(query.id)}
                            title="Delete Query"
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Query Detail Modal */}
      {detailModalQuery && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <BellRing className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">
                    Stock Query Details
                  </h3>
                  <p className="text-xs text-slate-400">{detailModalQuery.id}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailModalQuery(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={detailModalQuery.productImage}
                  alt={detailModalQuery.productName}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                />
                <div>
                  <p className="font-bold text-slate-900">{detailModalQuery.productName}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">SKU: {detailModalQuery.sku}</p>
                  <p className="text-xs text-slate-600 mt-1">Requested: {detailModalQuery.requestedQuantity} unit(s) • Total: ₹{detailModalQuery.potentialRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Customer</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{detailModalQuery.customerName}</span>
                  <span className="text-slate-500 block text-[11px]">{detailModalQuery.customerPhone}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Alert Channel</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{detailModalQuery.channel}</span>
                  <span className="text-slate-500 block text-[11px]">{detailModalQuery.customerEmail}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Date Logged</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{detailModalQuery.requestDate}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Priority</span>
                  <span className="text-amber-700 font-bold mt-0.5 block">{detailModalQuery.priority}</span>
                </div>
              </div>

              {detailModalQuery.notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-slate-600 font-semibold block">Customer Notes / Special Request</span>
                  <p className="text-slate-700 mt-0.5">{detailModalQuery.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setDetailModalQuery(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              {detailModalQuery.status === "Pending" && (
                <button
                  onClick={() => {
                    handleNotify(detailModalQuery);
                    setDetailModalQuery(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Restock Alert
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
