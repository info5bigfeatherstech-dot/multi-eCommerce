import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  RotateCcw,
  Download,
  AlertTriangle,
  TrendingDown,
  PieChart,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function ReturnReportsView() {
  const returnsList = useAppSelector((state) => state.adminReturns.items);
  const orders = useAppSelector((state) => state.adminOrders.items);
  const [timeRange, setTimeRange] = useState("Month");

  const totalReturnCount = returnsList.length;
  const totalReturnValue = returnsList.reduce((sum, r) => sum + r.refundAmount, 0);
  const totalSettledRefunds = returnsList.filter((r) => r.refundStatus === "Refunded").reduce((s, r) => s + r.refundAmount, 0);

  // Return Rate % compared to total orders
  const returnRate = orders.length > 0 ? ((totalReturnCount / orders.length) * 100).toFixed(1) : 0;

  // QC Pass rate
  const inspectedCount = returnsList.filter((r) => r.returnStatus === "QC Passed" || r.returnStatus === "QC Failed").length;
  const qcPassedCount = returnsList.filter((r) => r.returnStatus === "QC Passed").length;
  const qcPassRate = inspectedCount > 0 ? Math.round((qcPassedCount / inspectedCount) * 100) : 0;

  // Categorize by Return Reason
  const reasonCounts = {};
  returnsList.forEach((r) => {
    reasonCounts[r.reasonCategory] = (reasonCounts[r.reasonCategory] || 0) + 1;
  });

  const reasonEntries = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]);

  const handleExportCSV = () => {
    const headers = [
      "Return ID",
      "Order ID",
      "Date",
      "Customer",
      "Product Name",
      "SKU",
      "Qty Returned",
      "Refund Value (INR)",
      "Reason Category",
      "Reason Details",
      "Workflow Stage",
      "Return Status",
      "QC Disposition",
      "Refund Status",
      "Payout Mode",
      "Bank UTR",
    ];

    const rows = returnsList.map((r) => [
      r.id,
      r.orderId,
      `"${r.requestDate}"`,
      `"${r.customer.name}"`,
      `"${r.item.name}"`,
      `"${r.item.sku}"`,
      r.item.qty,
      r.refundAmount,
      `"${r.reasonCategory}"`,
      `"${r.reasonDetails}"`,
      `"Stage ${r.stage}"`,
      `"${r.returnStatus}"`,
      `"${r.qcDisposition || "Pending"}"`,
      `"${r.refundStatus}"`,
      `"${r.payoutMethod}"`,
      `"${r.payoutUtr || "Pending"}"`,
    ]);

    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `ApexMart_Returns_Defects_Report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Comprehensive Returns report exported to CSV!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-inter">
            <span>Returns & Refunds</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Reports</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 mt-1">
            Returns & Refunds Analytics
          </h1>
          <p className="text-xs text-slate-500 font-inter">
            Defect rate tracking, root-cause categorization, and reverse logistics turnaround metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-36">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today (Live)</SelectItem>
                <SelectItem value="Week">This Week</SelectItem>
                <SelectItem value="Month">This Month</SelectItem>
                <SelectItem value="Quarter">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-poppins font-bold rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-accent" />
            <span>Download Returns CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">Wholesale Return Rate</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <RotateCcw className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">{returnRate}%</p>
          <p className="text-[11px] text-slate-400 font-inter">Industry benchmark: &lt; 5.0%</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">Gross Claims Value</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-poppins font-black text-rose-600">{formatCurrency(totalReturnValue)}</p>
          <p className="text-[11px] text-slate-400 font-inter">{formatCurrency(totalSettledRefunds)} settled to date</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">Warehouse QC Pass Rate</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-poppins font-black text-emerald-600">{qcPassRate}%</p>
          <p className="text-[11px] text-slate-400 font-inter">{qcPassedCount} passed inspections</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-poppins font-bold text-slate-500 uppercase tracking-wider">Turnaround Time</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">2.6 Days</p>
          <p className="text-[11px] text-slate-400 font-inter">Claim received to refund issued</p>
        </div>
      </div>

      {/* Breakdown Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reasons Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-poppins font-bold text-sm text-slate-900">Return Reason Breakdown</h3>
              <p className="text-xs text-slate-400 font-inter">Primary root cause cited by buyers</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5">
            {reasonEntries.map(([reason, count], idx) => {
              const pct = totalReturnCount > 0 ? Math.round((count / totalReturnCount) * 100) : 0;
              const colors = ["bg-rose-500", "bg-amber-500", "bg-blue-500", "bg-purple-500", "bg-emerald-500"];
              const color = colors[idx % colors.length];

              return (
                <div key={reason} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-poppins font-semibold">
                    <span className="text-slate-700">{reason}</span>
                    <span className="text-slate-900 font-bold">
                      {count} claims <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highest Returned SKUs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-poppins font-bold text-sm text-slate-900">High Return Rate Products</h3>
              <p className="text-xs text-slate-400 font-inter">Products requiring factory quality audit</p>
            </div>
            <Package className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 text-xs font-inter">
            {returnsList.slice(0, 4).map((r, i) => (
              <div key={r.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div className="min-w-0 pr-3">
                  <p className="font-bold text-slate-900 truncate">{r.item.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">SKU: {r.item.sku} • {r.item.qty} units claimed</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-poppins font-bold text-slate-900 block">{formatCurrency(r.refundAmount)}</span>
                  <span className="text-[10px] text-rose-600 font-semibold">{r.reasonCategory}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
