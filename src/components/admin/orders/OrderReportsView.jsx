import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  Package,
  ArrowUpRight,
  PieChart,
  BarChart3,
  MapPin,
  FileSpreadsheet,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OrderReportsView() {
  const orders = useAppSelector((state) => state.adminOrders.items);
  const [timeRange, setTimeRange] = useState("Month");

  // Metrics
  const activeOrders = orders.filter((o) => o.orderStatus !== "Cancelled");
  const totalGrossRevenue = activeOrders.reduce((s, o) => s + o.totalAmount, 0);
  const avgOrderValue = activeOrders.length ? Math.round(totalGrossRevenue / activeOrders.length) : 0;
  const totalUnitsShipped = activeOrders.reduce((sum, o) => sum + o.items.reduce((sub, i) => sub + i.qty, 0), 0);

  // Status breakdown
  const statusCounts = {
    Delivered: orders.filter((o) => o.orderStatus === "Delivered").length,
    Dispatched: orders.filter((o) => o.orderStatus === "Dispatched").length,
    Confirmed: orders.filter((o) => o.orderStatus === "Confirmed").length,
    Pending: orders.filter((o) => o.orderStatus === "Pending").length,
    Cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length,
  };

  // Payment Breakdown
  const prepaidTotal = orders
    .filter((o) => !o.paymentMethod.includes("Cash") && o.orderStatus !== "Cancelled")
    .reduce((s, o) => s + o.totalAmount, 0);

  const codTotal = orders
    .filter((o) => o.paymentMethod.includes("Cash") && o.orderStatus !== "Cancelled")
    .reduce((s, o) => s + o.totalAmount, 0);

  const prepaidPercent = totalGrossRevenue > 0 ? Math.round((prepaidTotal / totalGrossRevenue) * 100) : 0;
  const codPercent = 100 - prepaidPercent;

  // State-wise distribution
  const stateMap = {};
  activeOrders.forEach((o) => {
    const st = o.customer.state || "Other";
    stateMap[st] = (stateMap[st] || 0) + o.totalAmount;
  });

  const stateEntries = Object.entries(stateMap).sort((a, b) => b[1] - a[1]);

  const handleExportFullReport = () => {
    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "Business Name",
      "GSTIN",
      "City",
      "State",
      "Total Amount (INR)",
      "Payment Mode",
      "Payment Status",
      "Order Status",
      "Verification Status",
      "Courier Partner",
      "AWB Number",
    ];

    const rows = orders.map((o) => [
      o.id,
      `"${o.date}"`,
      `"${o.customer.name}"`,
      `"${o.customer.businessName}"`,
      `"${o.customer.gstNumber}"`,
      `"${o.customer.city}"`,
      `"${o.customer.state}"`,
      o.totalAmount,
      `"${o.paymentMethod}"`,
      `"${o.paymentStatus}"`,
      `"${o.orderStatus}"`,
      `"${o.verificationStatus}"`,
      `"${o.courierPartner || "N/A"}"`,
      `"${o.trackingNumber || "N/A"}"`,
    ]);

    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `ApexMart_Orders_Sales_Report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sales & Order Report exported to CSV!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-inter">
            <span>Orders</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Order Reports</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 mt-1">
            Orders Sales & Status Reports
          </h1>
          <p className="text-xs text-slate-500 font-inter">
            Comprehensive business intelligence, order fulfillment velocity & revenue metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-poppins font-semibold text-slate-800 shadow-xs cursor-pointer"
          >
            <option value="Today">Today (Live)</option>
            <option value="Week">This Week</option>
            <option value="Month">This Month</option>
            <option value="Quarter">Fiscal Quarter</option>
          </select>

          <button
            onClick={handleExportFullReport}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-poppins font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-accent" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">Gross Sales Volume</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">{formatCurrency(totalGrossRevenue)}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% from last period</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">Average Order Value (AOV)</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">{formatCurrency(avgOrderValue)}</p>
          <p className="text-[11px] text-slate-400 font-inter">Wholesale bulk tier basket</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">Wholesale Units Ordered</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">{totalUnitsShipped.toLocaleString()} Units</p>
          <p className="text-[11px] text-slate-400 font-inter">Across all catalog SKUs</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">Order Delivery Rate</span>
            <span className="p-2 rounded-xl bg-rose-50 text-accent">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">
            {orders.length ? Math.round(((statusCounts.Delivered + statusCounts.Dispatched) / orders.length) * 100) : 0}%
          </p>
          <p className="text-[11px] text-slate-400 font-inter">Fulfillment conversion rate</p>
        </div>
      </div>

      {/* Analytics Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Distribution Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-poppins font-bold text-sm text-slate-900">Order Status Distribution</h3>
              <p className="text-xs text-slate-400 font-inter">Active volume across all workflow stages</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5">
            {[
              { label: "Delivered", count: statusCounts.Delivered, color: "bg-emerald-500" },
              { label: "Dispatched (In-Transit)", count: statusCounts.Dispatched, color: "bg-purple-500" },
              { label: "Confirmed (Ready)", count: statusCounts.Confirmed, color: "bg-blue-500" },
              { label: "Pending Verification", count: statusCounts.Pending, color: "bg-amber-500" },
              { label: "Cancelled", count: statusCounts.Cancelled, color: "bg-rose-500" },
            ].map((item) => {
              const pct = orders.length ? Math.round((item.count / orders.length) * 100) : 0;

              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-poppins font-semibold">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="text-slate-900">
                      {item.count} orders <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-700", item.color)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Split & Regional Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-poppins font-bold text-sm text-slate-900">Payment Modes & Regional Sales</h3>
              <p className="text-xs text-slate-400 font-inter">Prepaid vs COD ratio and top consuming states</p>
            </div>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          {/* Prepaid vs COD bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-poppins font-bold">
              <span className="text-emerald-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Prepaid (UPI / NEFT): {prepaidPercent}% ({formatCurrency(prepaidTotal)})
              </span>
              <span className="text-amber-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                COD: {codPercent}% ({formatCurrency(codTotal)})
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
              <div className="bg-emerald-500 h-full" style={{ width: `${prepaidPercent}%` }} />
              <div className="bg-amber-500 h-full" style={{ width: `${codPercent}%` }} />
            </div>
          </div>

          {/* Top States List */}
          <div className="pt-2">
            <h4 className="text-[11px] font-poppins font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Top Wholesale Demand by State
            </h4>
            <div className="space-y-2 text-xs font-inter">
              {stateEntries.slice(0, 4).map(([st, amount], idx) => (
                <div key={st} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center font-mono">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{st}</span>
                  </div>
                  <span className="font-poppins font-bold text-slate-900">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
