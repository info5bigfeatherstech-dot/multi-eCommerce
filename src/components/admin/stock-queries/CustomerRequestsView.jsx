import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { notifyCustomer, updateQueryStatus } from "@/store/slices/adminStockQueriesSlice";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Tag,
  DollarSign,
  AlertCircle,
  FileText,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function CustomerRequestsView() {
  const dispatch = useAppDispatch();
  const queries = useAppSelector((state) => state.adminStockQueries?.queries || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [couponModalQuery, setCouponModalQuery] = useState(null);
  const [couponCode, setCouponCode] = useState("BACKINSTOCK10");

  const channels = useMemo(() => {
    const set = new Set(queries.map((q) => q.channel));
    return ["All", ...Array.from(set)];
  }, [queries]);

  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      const matchSearch =
        q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.productName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchChannel = selectedChannel === "All" || q.channel === selectedChannel;
      const matchStatus = selectedStatus === "All" || q.status === selectedStatus;
      return matchSearch && matchChannel && matchStatus;
    });
  }, [queries, searchTerm, selectedChannel, selectedStatus]);

  const handleNotify = (query) => {
    dispatch(notifyCustomer({ id: query.id }));
    toast.success(`Personal alert sent to ${query.customerName} via ${query.channel}.`);
  };

  const handleSendCoupon = (e) => {
    e.preventDefault();
    if (!couponModalQuery) return;
    dispatch(notifyCustomer({ id: couponModalQuery.id }));
    toast.success(`Exclusive promo code "${couponCode}" dispatched to ${couponModalQuery.customerName}!`);
    setCouponModalQuery(null);
  };

  const handleExportCSV = () => {
    const headers = ["Query ID", "Customer Name", "Email", "Phone", "Requested Product", "Qty", "Preferred Channel", "Status", "Notes", "Date"];
    const rows = filteredQueries.map((q) => [
      q.id,
      `"${q.customerName}"`,
      q.customerEmail,
      `"${q.customerPhone}"`,
      `"${q.productName.replace(/"/g, '""')}"`,
      q.requestedQuantity,
      q.channel,
      q.status,
      `"${(q.notes || "").replace(/"/g, '""')}"`,
      q.requestDate,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_stock_requests_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Customer requests exported.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              1-on-1 Customer Engagement
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Omnichannel Alerts</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Individual Customer Requests Manage
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Track individual buyer inquiries, deliver tailored restock alerts via WhatsApp, SMS, or Email, and attach exclusive apology discounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Customer Requests
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-inter text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-40">
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                <div className="flex items-center gap-1.5 truncate">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <SelectValue placeholder="Channel" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {channels.map((ch) => (
                  <SelectItem key={ch} value={ch}>
                    {ch === "All" ? "All Channels" : ch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-36">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Notified">Notified</SelectItem>
                <SelectItem value="Restocked">Restocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Customer Requests Cards/Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Customer Details</th>
                <th className="p-4">Requested Item</th>
                <th className="p-4">Notification Preference</th>
                <th className="p-4">Desired Qty & Value</th>
                <th className="p-4">Customer Notes</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No customer requests found</p>
                    <p className="text-xs text-slate-400 mt-1">Try relaxing filters</p>
                  </td>
                </tr>
              ) : (
                filteredQueries.map((query) => (
                  <tr key={query.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                          {query.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{query.customerName}</p>
                          <div className="text-xs text-slate-400 space-y-0.5">
                            <p className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {query.customerEmail}
                            </p>
                            <p className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {query.customerPhone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={query.productImage}
                          alt={query.productName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 text-xs line-clamp-1">{query.productName}</p>
                          <p className="text-[11px] font-mono text-slate-400">{query.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                        {query.channel}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Requested on {query.requestDate}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">₹{query.potentialRevenue.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{query.requestedQuantity} unit(s)</p>
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        {query.notes || "No special instructions provided."}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                          query.status === "Pending"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : query.status === "Notified"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {query.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setCouponModalQuery(query)}
                          title="Attach Restock Coupon Code"
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all"
                        >
                          <Tag className="w-4 h-4" />
                        </button>
                        {query.status === "Pending" && (
                          <button
                            onClick={() => handleNotify(query)}
                            title="Dispatch Instant Restock Notification"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Alert
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attach Coupon Modal */}
      {couponModalQuery && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSendCoupon}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Tag className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">
                    Send Restock Courtesy Coupon
                  </h3>
                  <p className="text-xs text-slate-400">{couponModalQuery.customerName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCouponModalQuery(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <p className="text-xs text-slate-500">
                Reward this customer for their patience with an exclusive discount code delivered directly to their{" "}
                <span className="font-semibold text-slate-800">{couponModalQuery.channel}</span>.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCouponModalQuery(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Coupon Alert
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
