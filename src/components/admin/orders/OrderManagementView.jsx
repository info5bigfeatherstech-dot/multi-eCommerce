import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateOrderStatus } from "@/store/slices/adminOrdersSlice";
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  FileCheck,
  Search,
  Filter,
  Send,
  Building2,
  X,
  ExternalLink,
  Receipt,
  Layers,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OrderManagementView() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.adminOrders.items);

  const [filterStage, setFilterStage] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
  const [courierPartner, setCourierPartner] = useState("Delhivery Surface");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (filterStage !== "All") {
      if (filterStage === "ActionRequired" && order.orderStatus !== "Pending" && order.orderStatus !== "Confirmed") {
        return false;
      }
      if (filterStage === "Dispatched" && order.orderStatus !== "Dispatched") {
        return false;
      }
      if (filterStage === "Delivered" && order.orderStatus !== "Delivered") {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.businessName.toLowerCase().includes(q) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, newStatus }));
    toast.success(`Order ${orderId} updated to "${newStatus}"!`);
  };

  const handleOpenDispatchModal = (order) => {
    setDispatchModalOrder(order);
    setCourierPartner(order.courierPartner || "Delhivery Surface");
    setTrackingNumber(order.trackingNumber || `AWB-${Math.floor(100000000 + Math.random() * 900000000)}`);
  };

  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;
    dispatch(
      updateOrderStatus({
        orderId: dispatchModalOrder.id,
        newStatus: "Dispatched",
        courierPartner,
        trackingNumber,
      })
    );
    toast.success(`Order ${dispatchModalOrder.id} dispatched via ${courierPartner}!`);
    setDispatchModalOrder(null);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-inter">
            <span>Orders</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Order Management</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 mt-1">
            Orders Manage & Process
          </h1>
          <p className="text-xs text-slate-500 font-inter">
            Process orders through warehouse fulfillment, assign couriers, and generate wholesale tax invoices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const pendingOrders = orders.filter((o) => o.orderStatus === "Pending");
              pendingOrders.forEach((o) => {
                dispatch(updateOrderStatus({ orderId: o.id, newStatus: "Confirmed" }));
              });
              toast.success(`Batch confirmed ${pendingOrders.length} pending orders!`);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-poppins font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Batch Confirm Pending
          </button>
        </div>
      </div>

      {/* Process Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div
          onClick={() => setFilterStage("ActionRequired")}
          className={cn(
            "p-4 rounded-2xl border transition-all cursor-pointer",
            filterStage === "ActionRequired"
              ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20"
              : "bg-white border-slate-200 hover:border-amber-200"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-amber-700">1. Needs Processing</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900 mt-2">
            {orders.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Confirmed").length}
          </p>
          <p className="text-[11px] text-slate-400 font-inter mt-1">Pending allocation & dispatch</p>
        </div>

        <div
          onClick={() => setFilterStage("Dispatched")}
          className={cn(
            "p-4 rounded-2xl border transition-all cursor-pointer",
            filterStage === "Dispatched"
              ? "bg-purple-50/80 border-purple-300 ring-2 ring-purple-400/20"
              : "bg-white border-slate-200 hover:border-purple-200"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-purple-700">2. In Transit</span>
            <Truck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900 mt-2">
            {orders.filter((o) => o.orderStatus === "Dispatched").length}
          </p>
          <p className="text-[11px] text-slate-400 font-inter mt-1">Handed over to courier</p>
        </div>

        <div
          onClick={() => setFilterStage("Delivered")}
          className={cn(
            "p-4 rounded-2xl border transition-all cursor-pointer",
            filterStage === "Delivered"
              ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20"
              : "bg-white border-slate-200 hover:border-emerald-200"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-emerald-700">3. Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900 mt-2">
            {orders.filter((o) => o.orderStatus === "Delivered").length}
          </p>
          <p className="text-[11px] text-slate-400 font-inter mt-1">Completed successfully</p>
        </div>

        <div
          onClick={() => setFilterStage("All")}
          className={cn(
            "p-4 rounded-2xl border transition-all cursor-pointer",
            filterStage === "All"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn("text-xs font-poppins font-bold", filterStage === "All" ? "text-accent" : "text-slate-600")}>
              View All Orders
            </span>
            <Layers className="w-4 h-4 opacity-70" />
          </div>
          <p className="text-2xl font-poppins font-black mt-2">{orders.length}</p>
          <p className={cn("text-[11px] font-inter mt-1", filterStage === "All" ? "text-slate-300" : "text-slate-400")}>
            Full fulfillment pipeline
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order to process by ID, customer name, business, or tracking AWB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-accent font-inter"
          />
        </div>
      </div>

      {/* Orders Processing Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => {
          const totalUnits = order.items.reduce((s, i) => s + i.qty, 0);

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Order Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-poppins font-black text-base text-slate-900">{order.id}</span>
                  <span className="text-xs text-slate-400 font-inter">{order.date}</span>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-poppins font-bold",
                      order.orderStatus === "Pending" && "bg-amber-100 text-amber-800",
                      order.orderStatus === "Confirmed" && "bg-blue-100 text-blue-800",
                      order.orderStatus === "Dispatched" && "bg-purple-100 text-purple-800",
                      order.orderStatus === "Delivered" && "bg-emerald-100 text-emerald-800",
                      order.orderStatus === "Cancelled" && "bg-rose-100 text-rose-800"
                    )}
                  >
                    {order.orderStatus}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {order.paymentMethod} ({order.paymentStatus})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInvoiceOrder(order)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-poppins font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Receipt className="w-3.5 h-3.5 text-accent" />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>

              {/* Order Middle Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs font-inter">
                {/* Customer Column */}
                <div className="space-y-1">
                  <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase tracking-wider block">
                    Buyer & Destination
                  </span>
                  <p className="font-bold text-slate-900">{order.customer.name}</p>
                  <p className="text-slate-600">{order.customer.businessName}</p>
                  <p className="text-slate-500">{order.customer.address}, {order.customer.city}, {order.customer.state} ({order.customer.pincode})</p>
                  <p className="text-slate-500 font-mono text-[11px]">GSTIN: {order.customer.gstNumber}</p>
                </div>

                {/* Items Summary */}
                <div className="space-y-1">
                  <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase tracking-wider block">
                    Wholesale Manifest ({totalUnits} units total)
                  </span>
                  <ul className="space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between text-slate-700">
                        <span className="truncate max-w-[200px]">{item.name}</span>
                        <span className="font-bold text-slate-900 ml-2">x{item.qty}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 font-poppins font-bold text-slate-900">
                    Total Order Value: {formatCurrency(order.totalAmount)}
                  </div>
                </div>

                {/* Logistics & Current Partner */}
                <div className="space-y-1">
                  <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase tracking-wider block">
                    Dispatch Logistics
                  </span>
                  {order.courierPartner ? (
                    <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-1">
                      <p className="font-bold text-purple-900 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-purple-700" />
                        <span>{order.courierPartner}</span>
                      </p>
                      <p className="font-mono text-[11px] text-purple-700">AWB: {order.trackingNumber}</p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 italic">
                      No courier assigned yet. Click "Assign & Dispatch" below.
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500 pt-1">
                    Verification: <strong className={order.verificationStatus === "Verified" ? "text-emerald-600" : "text-amber-600"}>{order.verificationStatus}</strong>
                  </p>
                </div>
              </div>

              {/* Action Pipeline Buttons Row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {order.orderStatus === "Pending" && (
                    <button
                      onClick={() => handleStatusChange(order.id, "Confirmed")}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-poppins font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Order</span>
                    </button>
                  )}

                  {(order.orderStatus === "Pending" || order.orderStatus === "Confirmed") && (
                    <button
                      onClick={() => handleOpenDispatchModal(order)}
                      className="px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch Order</span>
                    </button>
                  )}

                  {order.orderStatus === "Dispatched" && (
                    <button
                      onClick={() => handleStatusChange(order.id, "Delivered")}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Delivered</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to cancel order ${order.id}?`)) {
                          handleStatusChange(order.id, "Cancelled");
                        }
                      }}
                      className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-poppins font-semibold transition-colors cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispatch Assignment Modal */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-accent" />
                <span className="font-poppins font-bold text-sm">Assign Courier & Dispatch</span>
              </div>
              <button onClick={() => setDispatchModalOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-slate-800">Dispatching Order: {dispatchModalOrder.id}</p>
                <p className="text-slate-500 mt-0.5">Customer: {dispatchModalOrder.customer.name} ({dispatchModalOrder.customer.city})</p>
              </div>

              <div>
                <label className="block text-xs font-poppins font-semibold text-slate-700 mb-1.5">
                  Logistics & Courier Partner
                </label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-poppins font-semibold text-slate-800 focus:outline-none focus:border-accent"
                >
                  <option value="Delhivery Surface">Delhivery Surface Logistics</option>
                  <option value="BlueDart Express">BlueDart Air & Express</option>
                  <option value="Ekart Logistics">Ekart Logistics</option>
                  <option value="DTDC Heavy Cargo">DTDC Heavy Cargo</option>
                  <option value="Self Warehouse Pickup">Self Warehouse Pickup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-poppins font-semibold text-slate-700 mb-1.5">
                  Airway Bill (AWB) / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DEL-88912903"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-poppins font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <span className="font-poppins font-bold text-sm">Wholesale Tax Invoice Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="px-3 py-1 bg-accent hover:bg-accent-hover text-white text-xs font-poppins font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button onClick={() => setInvoiceOrder(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Tax Invoice Content */}
            <div className="p-8 overflow-y-auto font-inter text-xs text-slate-800 space-y-6">
              {/* Company Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-poppins font-black text-slate-900">ApexMart Wholesale</h2>
                  <p className="text-[11px] text-slate-500">B2B E-Commerce & Distribution Network</p>
                  <p className="text-[11px] text-slate-500 mt-1">GSTIN: 24AAACA0000A1Z5 | PAN: AAACA0000A</p>
                  <p className="text-[11px] text-slate-500">Ahmedabad, Gujarat, India - 380001</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-slate-100 rounded-lg font-poppins font-bold text-xs uppercase text-slate-800">
                    TAX INVOICE
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-2">Invoice: INV-{invoiceOrder.id.replace("ORD-", "")}</p>
                  <p className="text-slate-500 text-[11px]">Date: {invoiceOrder.date}</p>
                </div>
              </div>

              {/* Bill to */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase">Billed To (Customer):</span>
                  <p className="font-bold text-slate-900 mt-0.5">{invoiceOrder.customer.businessName}</p>
                  <p className="text-slate-600">{invoiceOrder.customer.name}</p>
                  <p className="text-slate-500">{invoiceOrder.customer.address}</p>
                  <p className="text-slate-500">{invoiceOrder.customer.city}, {invoiceOrder.customer.state} - {invoiceOrder.customer.pincode}</p>
                  <p className="font-mono text-slate-700 mt-1">GSTIN: {invoiceOrder.customer.gstNumber}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase">Payment & Shipping:</span>
                  <p className="text-slate-700 mt-0.5">Mode: <strong>{invoiceOrder.paymentMethod}</strong></p>
                  <p className="text-slate-700">Payment Status: <strong className="text-emerald-600">{invoiceOrder.paymentStatus}</strong></p>
                  <p className="text-slate-700">Courier: <strong>{invoiceOrder.courierPartner || "Surface Carrier"}</strong></p>
                  <p className="text-slate-700 font-mono text-[11px]">AWB: {invoiceOrder.trackingNumber || "N/A"}</p>
                </div>
              </div>

              {/* Invoice Table */}
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-poppins font-bold text-[11px]">
                    <th className="p-2 border border-slate-200">#</th>
                    <th className="p-2 border border-slate-200">Description</th>
                    <th className="p-2 border border-slate-200 text-center">Qty</th>
                    <th className="p-2 border border-slate-200 text-right">Rate</th>
                    <th className="p-2 border border-slate-200 text-right">Taxable</th>
                    <th className="p-2 border border-slate-200 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border border-slate-200 text-center">{idx + 1}</td>
                      <td className="p-2 border border-slate-200 font-medium">{it.name}</td>
                      <td className="p-2 border border-slate-200 text-center">{it.qty}</td>
                      <td className="p-2 border border-slate-200 text-right font-mono">{formatCurrency(it.unitPrice)}</td>
                      <td className="p-2 border border-slate-200 text-right font-mono">{formatCurrency(Math.round(it.total * 0.82))}</td>
                      <td className="p-2 border border-slate-200 text-right font-bold font-mono">{formatCurrency(it.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="font-poppins font-bold bg-slate-50">
                  <tr>
                    <td colSpan={5} className="p-2 border border-slate-200 text-right">Total Invoice Value (All Taxes Included):</td>
                    <td className="p-2 border border-slate-200 text-right text-sm">{formatCurrency(invoiceOrder.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>

              <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center">
                This is a computer-generated tax invoice verified under the Indian GST E-Invoicing system.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
