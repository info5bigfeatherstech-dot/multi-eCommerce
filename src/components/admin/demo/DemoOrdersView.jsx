import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  advanceOrderWorkflow,
  simulateIncomingOrder,
} from "@/store/slices/adminDemoSlice";
import {
  Truck,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Printer,
  FileText,
  X,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  User,
  MapPin,
  CreditCard,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STAGES = [
  "Order Placed",
  "Verified",
  "Courier Assigned",
  "Packing",
  "In Transit",
  "Delivered",
];

export default function DemoOrdersView() {
  const dispatch = useAppDispatch();
  const sampleOrders = useAppSelector((state) => state.adminDemo?.sampleOrders || []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");
  const [selectedChannel, setSelectedChannel] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);

  const channels = ["All", "Retail (Prepaid)", "Retail (COD)", "B2B Wholesale", "Dropshipping", "Physical Franchise"];

  const filteredOrders = sampleOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingCity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === "All" || order.stage === selectedStage;
    const matchesChannel = selectedChannel === "All" || order.channel.includes(selectedChannel.replace("All", ""));

    return matchesSearch && matchesStage && matchesChannel;
  });

  const handleAdvanceStage = (order, e) => {
    if (e) e.stopPropagation();
    if (order.stageIndex >= STAGES.length - 1) {
      toast.info(`Order ${order.id} is already marked as Delivered.`);
      return;
    }

    dispatch(advanceOrderWorkflow({ orderId: order.id }));
    const nextStage = STAGES[order.stageIndex + 1];
    toast.success(`Order ${order.id} progressed to: "${nextStage}"`);

    // If order drawer is open, keep it in sync
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder({
        ...selectedOrder,
        stage: nextStage,
        stageIndex: order.stageIndex + 1,
      });
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Channel",
      "Total Amount (INR)",
      "Payment Method",
      "Payment Status",
      "City",
      "Courier",
      "AWB Number",
      "Current Stage",
      "Risk Score",
      "Date",
    ];
    const rows = filteredOrders.map((o) => [
      o.id,
      `"${o.customer.replace(/"/g, '""')}"`,
      o.channel,
      o.totalAmount,
      o.paymentMethod,
      o.paymentStatus,
      `"${o.shippingCity}"`,
      o.courier,
      o.awbNumber,
      o.stage,
      `"${o.riskScore}"`,
      o.orderDate,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `demo_orders_workflow_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Demo orders queue exported.");
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-poppins font-black text-slate-900 tracking-tight">
                  Sample Orders & Workflow Simulator
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Interactive Lifecycle
                </span>
              </div>
              <p className="text-xs text-slate-500 font-inter mt-0.5">
                Simulate end-to-end fulfillment: Fraud check → Courier allocation → Warehouse packing → Transit milestones → POD delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              dispatch(simulateIncomingOrder());
              toast.success("New simulated demo order injected into queue!");
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent text-white text-xs font-poppins font-bold shadow-xs hover:bg-accent/90 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Generate Test Order</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-poppins font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Workflow Stepper Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-poppins font-bold text-slate-700 uppercase tracking-wider">
            6-Stage Omnichannel Order Fulfillment Pipeline
          </span>
          <span className="text-[11px] text-slate-400 font-inter">
            Click "Advance Stage" on any order below to trigger live state progression
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {STAGES.map((stg, idx) => (
            <div
              key={stg}
              onClick={() => setSelectedStage(stg === selectedStage ? "All" : stg)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all cursor-pointer",
                selectedStage === stg
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-slate-50/70 border-slate-100 hover:bg-slate-100/70 text-slate-700"
              )}
            >
              <div className="flex items-center justify-between text-[11px] font-bold font-mono">
                <span>0{idx + 1}</span>
                {idx < 5 && <ChevronRight className="w-3 h-3 opacity-40" />}
              </div>
              <p className="text-xs font-poppins font-bold mt-1 tracking-tight truncate">
                {stg}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders by customer name, order ID, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-poppins font-bold text-slate-500 whitespace-nowrap">Channel:</span>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-inter bg-white focus:outline-none focus:border-accent"
          >
            {channels.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer & City</th>
                <th className="py-3.5 px-4">Sales Channel</th>
                <th className="py-3.5 px-4">Amount & Payment</th>
                <th className="py-3.5 px-4">Courier & AWB</th>
                <th className="py-3.5 px-4">Fulfillment Stage</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Interactive Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-inter">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    {/* Order ID */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-poppins font-bold text-slate-900">
                        {order.id}
                      </div>
                      <div className="text-[11px] text-slate-400 font-inter">
                        {order.orderDate}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">
                        {order.customer}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {order.shippingCity}
                      </div>
                    </td>

                    {/* Channel */}
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {order.channel}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4">
                      <div className="font-poppins font-bold text-slate-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {order.paymentMethod}
                      </div>
                    </td>

                    {/* Courier & AWB */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">
                        {order.courier}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {order.awbNumber}
                      </div>
                    </td>

                    {/* Stage Badge & Step Indicator */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold inline-block",
                            order.stage === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : order.stage === "In Transit"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : order.stage === "Courier Assigned"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          )}
                        >
                          {order.stage}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {STAGES.map((s, idx) => (
                            <div
                              key={s}
                              className={cn(
                                "h-1 rounded-full flex-1",
                                idx <= order.stageIndex ? "bg-accent" : "bg-slate-200"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {order.stageIndex < STAGES.length - 1 && (
                          <button
                            onClick={(e) => handleAdvanceStage(order, e)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-accent text-white text-[11px] font-poppins font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Advance to next fulfillment stage"
                          >
                            <span>Advance Stage</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setInvoiceModalOrder(order)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Print Sample Invoice"
                        >
                          <FileText className="w-4 h-4" />
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

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-poppins font-bold text-slate-900">
                    Order {selectedOrder.id}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {selectedOrder.channel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-inter mt-0.5">
                  Placed on {selectedOrder.orderDate} • Risk Score: {selectedOrder.riskScore}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage Progress Bar inside Modal */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-poppins font-bold text-slate-700">
                  Current Workflow Stage: {selectedOrder.stage}
                </span>
                {selectedOrder.stageIndex < STAGES.length - 1 && (
                  <button
                    onClick={() => handleAdvanceStage(selectedOrder)}
                    className="text-xs font-poppins font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Advance to {STAGES[selectedOrder.stageIndex + 1]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {STAGES.map((s, idx) => (
                  <div key={s} className="text-center">
                    <div
                      className={cn(
                        "h-1.5 rounded-full mb-1",
                        idx <= selectedOrder.stageIndex ? "bg-accent" : "bg-slate-200"
                      )}
                    />
                    <span className={cn(
                      "text-[9px] font-inter block truncate",
                      idx <= selectedOrder.stageIndex ? "text-slate-900 font-bold" : "text-slate-400"
                    )}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase tracking-wider block">
                  Customer Information
                </span>
                <p className="font-poppins font-bold text-slate-900">{selectedOrder.customer}</p>
                <p className="text-slate-500 font-inter">{selectedOrder.email}</p>
                <p className="text-slate-500 font-inter">{selectedOrder.phone}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase tracking-wider block">
                  Shipping & Courier
                </span>
                <p className="font-poppins font-bold text-slate-900">{selectedOrder.shippingCity}</p>
                <p className="text-slate-500 font-inter">PIN Code: {selectedOrder.pincode}</p>
                <p className="text-slate-700 font-inter font-medium">
                  {selectedOrder.courier} (AWB: {selectedOrder.awbNumber})
                </p>
              </div>
            </div>

            {/* Order Items Table */}
            <div>
              <span className="text-xs font-poppins font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Order Items ({selectedOrder.itemsCount})
              </span>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">SKU: {item.sku} • Qty: {item.qty}</p>
                    </div>
                    <span className="font-poppins font-bold text-slate-900">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Tracking Log */}
            <div>
              <span className="text-xs font-poppins font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Audit Timeline Log
              </span>
              <div className="space-y-2 text-xs">
                {selectedOrder.history.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-accent mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-mono text-[11px] text-slate-400 mr-2">{h.time}</span>
                      <span className="font-inter">{h.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => setInvoiceModalOrder(selectedOrder)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-poppins font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View Sample Invoice</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-poppins font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-8 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-poppins font-black text-slate-900">
                  TAX INVOICE
                </h3>
                <p className="text-xs text-slate-500 font-mono">Invoice #: INV-{invoiceModalOrder.id.replace("ORD-DEMO-", "2026-")}</p>
              </div>
              <button
                onClick={() => setInvoiceModalOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Billed To:
                </span>
                <p className="font-poppins font-bold text-slate-900">{invoiceModalOrder.customer}</p>
                <p className="text-slate-500">{invoiceModalOrder.shippingCity}</p>
                <p className="text-slate-500">PIN: {invoiceModalOrder.pincode}</p>
                <p className="text-slate-500">{invoiceModalOrder.phone}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Shipper / Seller:
                </span>
                <p className="font-poppins font-bold text-slate-900">Multi-eCommerce Direct Ltd</p>
                <p className="text-slate-500">GSTIN: 27AABCU9603R1ZM</p>
                <p className="text-slate-500">State: Maharashtra (Code 27)</p>
                <p className="text-slate-500">AWB: {invoiceModalOrder.awbNumber}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
              <div className="p-3 bg-slate-50 font-poppins font-bold text-slate-700 flex justify-between">
                <span>Description</span>
                <span>Amount</span>
              </div>
              {invoiceModalOrder.items.map((item, i) => (
                <div key={i} className="p-3 flex justify-between">
                  <span>{item.name} (x{item.qty})</span>
                  <span className="font-semibold">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="p-3 bg-slate-50/70 flex justify-between font-poppins font-black text-slate-900">
                <span>Grand Total (Incl. Taxes)</span>
                <span>₹{invoiceModalOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  toast.success("Print command sent to thermal/A4 printer!");
                  setInvoiceModalOrder(null);
                }}
                className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-poppins font-bold hover:bg-accent/90 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
