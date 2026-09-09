import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
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
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function AllOrdersView() {
  const orders = useAppSelector((state) => state.adminOrders.items);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    // Status tab
    if (activeTab !== "All" && order.orderStatus !== activeTab) return false;
    // Payment filter
    if (paymentFilter !== "All" && !order.paymentMethod.toLowerCase().includes(paymentFilter.toLowerCase())) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCust = order.customer.name.toLowerCase().includes(q);
      const matchBiz = order.customer.businessName.toLowerCase().includes(q);
      const matchCity = order.customer.city.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.includes(q);
      if (!matchId && !matchCust && !matchBiz && !matchCity && !matchPhone) {
        return false;
      }
    }
    return true;
  });

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== "Cancelled" ? sum + o.totalAmount : sum), 0);
  const pendingCount = orders.filter((o) => o.orderStatus === "Pending").length;
  const confirmedCount = orders.filter((o) => o.orderStatus === "Confirmed").length;
  const dispatchedCount = orders.filter((o) => o.orderStatus === "Dispatched").length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "Delivered").length;
  const cancelledCount = orders.filter((o) => o.orderStatus === "Cancelled").length;

  const handleExportCSV = () => {
    const headers = ["Order ID", "Date", "Customer", "Business", "Phone", "City", "Total Amount", "Payment Method", "Status", "Verification"];
    const rows = filteredOrders.map((o) => [
      o.id,
      `"${o.date}"`,
      `"${o.customer.name}"`,
      `"${o.customer.businessName}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.city}"`,
      o.totalAmount,
      `"${o.paymentMethod}"`,
      `"${o.orderStatus}"`,
      `"${o.verificationStatus}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apexmart_all_orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("All Orders CSV downloaded successfully!");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Dispatched":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getVerificationBadge = (vStatus) => {
    switch (vStatus) {
      case "Verified":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pending Verification":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Flagged":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-inter">
            <span>Orders</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">All Orders</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 mt-1">
            All Orders Overview
          </h1>
          <p className="text-xs text-slate-500 font-inter">
            Complete real-time ledger of all B2B wholesale orders, payments & dispatch statuses
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-poppins font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider">Total Orders</p>
          <p className="text-2xl font-poppins font-black text-slate-900 mt-1">{orders.length}</p>
          <p className="text-[10px] text-slate-400 font-inter mt-0.5">Across all channels</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider">Gross Revenue</p>
          <p className="text-xl font-poppins font-black text-emerald-600 mt-1">{formatCurrency(totalRevenue)}</p>
          <p className="text-[10px] text-slate-400 font-inter mt-0.5">Excluding cancelled</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-poppins font-bold text-amber-600 uppercase tracking-wider">Pending Orders</p>
          <p className="text-2xl font-poppins font-black text-amber-700 mt-1">{pendingCount}</p>
          <p className="text-[10px] text-amber-600/70 font-inter mt-0.5">Needs verification</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-poppins font-bold text-blue-600 uppercase tracking-wider">Confirmed</p>
          <p className="text-2xl font-poppins font-black text-blue-700 mt-1">{confirmedCount}</p>
          <p className="text-[10px] text-blue-600/70 font-inter mt-0.5">Ready for packing</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-poppins font-bold text-purple-600 uppercase tracking-wider">In Transit</p>
          <p className="text-2xl font-poppins font-black text-purple-700 mt-1">{dispatchedCount}</p>
          <p className="text-[10px] text-purple-600/70 font-inter mt-0.5">Dispatched out</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-poppins font-bold text-emerald-600 uppercase tracking-wider">Delivered</p>
          <p className="text-2xl font-poppins font-black text-emerald-700 mt-1">{deliveredCount}</p>
          <p className="text-[10px] text-emerald-600/70 font-inter mt-0.5">{cancelledCount} cancelled</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Status Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100">
          {[
            { label: "All Orders", key: "All", count: orders.length },
            { label: "Pending", key: "Pending", count: pendingCount },
            { label: "Confirmed", key: "Confirmed", count: confirmedCount },
            { label: "Dispatched", key: "Dispatched", count: dispatchedCount },
            { label: "Delivered", key: "Delivered", count: deliveredCount },
            { label: "Cancelled", key: "Cancelled", count: cancelledCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-poppins font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer",
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow-xs"
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

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Business, City, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent font-inter transition-colors"
            />
          </div>

          <div className="w-48">
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Payment Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Payment Types</SelectItem>
                <SelectItem value="UPI">Prepaid UPI</SelectItem>
                <SelectItem value="NEFT">Bank NEFT</SelectItem>
                <SelectItem value="Delivery">Cash on Delivery (COD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-poppins font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer & Business</th>
                <th className="py-3.5 px-4">Items / Qty</th>
                <th className="py-3.5 px-4">Amount & Payment</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-inter">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-poppins font-bold text-sm text-slate-600">No matching orders found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const totalUnits = order.items.reduce((s, i) => s + i.qty, 0);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-poppins font-bold text-slate-900 block">{order.id}</span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{order.date}</span>
                        {order.priority === "Urgent" && (
                          <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider">
                            Urgent
                          </span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <span className="font-poppins font-bold text-slate-800 block">{order.customer.name}</span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[150px]">{order.customer.businessName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {order.customer.city}, {order.customer.state}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <span className="font-poppins font-bold text-slate-800 block">
                          {totalUnits} Units <span className="text-slate-400 font-normal">({order.items.length} items)</span>
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block max-w-[180px] mt-0.5" title={order.items[0]?.name}>
                          {order.items[0]?.name}
                        </span>
                      </td>

                      {/* Amount & Payment */}
                      <td className="py-3.5 px-4">
                        <span className="font-poppins font-bold text-slate-900 block">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {order.paymentMethod}
                        </span>
                        <span
                          className={cn(
                            "inline-block px-1.5 py-0.2 rounded text-[9px] font-bold mt-0.5",
                            order.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          )}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Order Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[11px] font-poppins font-bold border inline-block",
                            getStatusBadge(order.orderStatus)
                          )}
                        >
                          {order.orderStatus}
                        </span>
                        {order.trackingNumber && (
                          <span className="text-[10px] text-purple-700 font-semibold block mt-1">
                            {order.courierPartner}
                          </span>
                        )}
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-poppins font-semibold border inline-flex items-center gap-1",
                            getVerificationBadge(order.verificationStatus)
                          )}
                        >
                          {order.verificationStatus === "Verified" && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                          {order.verificationStatus === "Pending Verification" && <Clock className="w-3 h-3 text-amber-600" />}
                          {order.verificationStatus === "Flagged" && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                          <span>{order.verificationStatus}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-poppins font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-poppins font-black text-white">{selectedOrder.id}</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold", getStatusBadge(selectedOrder.orderStatus))}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-inter mt-0.5">Placed on {selectedOrder.date}</p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Customer & Shipping Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-poppins font-bold text-slate-900">
                    <Building2 className="w-4 h-4 text-accent" />
                    <span>Customer & Business Details</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedOrder.customer.name}</p>
                  <p className="text-xs text-slate-600 font-medium">{selectedOrder.customer.businessName}</p>
                  <p className="text-xs text-slate-500 font-mono">GSTIN: {selectedOrder.customer.gstNumber}</p>
                  <p className="text-xs text-slate-500">Phone: {selectedOrder.customer.phone}</p>
                  <p className="text-xs text-slate-500">Email: {selectedOrder.customer.email}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-poppins font-bold text-slate-900">
                    <Truck className="w-4 h-4 text-accent" />
                    <span>Delivery & Logistics Info</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedOrder.customer.address}</p>
                  <p className="text-xs text-slate-600 font-bold">
                    {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                  </p>
                  <div className="pt-2 border-t border-slate-200/80 text-xs">
                    <span className="text-slate-500">Courier Partner: </span>
                    <span className="font-bold text-slate-800">{selectedOrder.courierPartner || "Not Assigned Yet"}</span>
                    {selectedOrder.trackingNumber && (
                      <p className="text-xs font-mono text-purple-700 font-bold mt-1">
                        AWB / Tracking: {selectedOrder.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-xs font-poppins font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Ordered Wholesale Products
                </h4>
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-poppins font-bold">
                      <tr>
                        <th className="py-2.5 px-4">Item Name</th>
                        <th className="py-2.5 px-4 text-center">Unit Price</th>
                        <th className="py-2.5 px-4 text-center">Quantity</th>
                        <th className="py-2.5 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-4 font-medium text-slate-800">{item.name}</td>
                          <td className="py-2.5 px-4 text-center font-mono">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-2.5 px-4 text-center font-bold">{item.qty} units</td>
                          <td className="py-2.5 px-4 text-right font-bold text-slate-900">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-poppins font-bold border-t border-slate-200">
                      <tr>
                        <td colSpan={3} className="py-3 px-4 text-right text-slate-700">Total Order Value (GST Incl.):</td>
                        <td className="py-3 px-4 text-right text-base text-slate-900">{formatCurrency(selectedOrder.totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Verification & Dispatch Notes */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                <span className="font-poppins font-bold text-amber-900 block">Dispatch Verification Notes:</span>
                <p className="text-amber-800 font-inter">{selectedOrder.verificationNotes}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Payment: <strong className="text-slate-800">{selectedOrder.paymentMethod}</strong></span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white font-poppins font-bold text-xs rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
