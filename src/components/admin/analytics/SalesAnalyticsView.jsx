import React from "react";
import { useAppSelector } from "@/store/hooks";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  Clock,
  MapPin,
  FileSpreadsheet,
  Download,
  Receipt,
  Percent,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function SalesAnalyticsView() {
  const salesFinancials = useAppSelector((state) => state.adminAnalytics.salesFinancials);
  const paymentModes = useAppSelector((state) => state.adminAnalytics.paymentModes);
  const stateSales = useAppSelector((state) => state.adminAnalytics.stateSales);
  const peakHours = useAppSelector((state) => state.adminAnalytics.peakHours);

  const handleExportSalesCSV = () => {
    const headers = ["State", "Orders Count", "Gross Revenue (Rs)", "Market Share (%)", "YoY Growth"];
    const rows = stateSales.map((s) => [s.state, s.orders, s.revenue, `${s.share}%`, s.growth]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apexmart_sales_state_breakdown_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported regional sales report");
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-poppins font-black uppercase tracking-wider">
              Revenue Accounting
            </span>
            <span className="text-xs text-slate-400 font-inter">Financial Realization</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            Sales & Revenue Analysis
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Audit gross vs net billing, tax receipts, B2B credit settlement terms, and regional revenue concentration.
          </p>
        </div>

        <button
          onClick={handleExportSalesCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-poppins font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Sales Breakdown</span>
        </button>
      </div>

      {/* ── Financial Ledger Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-slate-400">
            Gross Billed
          </span>
          <p className="text-xl font-poppins font-black text-slate-900">
            ₹{(salesFinancials.grossSales / 100000).toFixed(2)}L
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Before discounts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-slate-400">
            Trade Discounts
          </span>
          <p className="text-xl font-poppins font-black text-rose-600">
            -₹{(salesFinancials.tradeDiscounts / 100000).toFixed(2)}L
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Tier volume slabs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-slate-400">
            Net Revenue
          </span>
          <p className="text-xl font-poppins font-black text-emerald-600">
            ₹{(salesFinancials.netSales / 100000).toFixed(2)}L
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Realized catalog sales</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-slate-400">
            GST Tax Collected
          </span>
          <p className="text-xl font-poppins font-black text-blue-600">
            ₹{(salesFinancials.gstTaxCollected / 100000).toFixed(2)}L
          </p>
          <span className="text-[10px] text-slate-400 font-inter">GSTR-1 Liability</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-slate-400">
            Shipping Freight
          </span>
          <p className="text-xl font-poppins font-black text-slate-900">
            ₹{(salesFinancials.shippingFreightIncome / 100000).toFixed(2)}L
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Customer freight billing</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-slate-400">
            Total Receivables
          </span>
          <p className="text-xl font-poppins font-black text-purple-700">
            ₹{(salesFinancials.totalGrossReceivables / 100000).toFixed(2)}L
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Full invoice amount</span>
        </div>
      </div>

      {/* ── Mid Section: Payment Methods & Hourly Demand ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-poppins font-bold text-slate-900 text-sm">
              Sales by Payment Mode & Terms
            </h3>
            <span className="text-xs text-slate-400 font-inter">Settlement mix</span>
          </div>

          <div className="space-y-3 font-inter">
            {paymentModes.map((pm, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-poppins font-bold text-slate-800">{pm.mode}</span>
                  <span className="font-poppins font-bold text-accent">{pm.share}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${pm.share}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{pm.count} consignments</span>
                  <span className="font-semibold text-slate-800">
                    ₹{pm.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Demand Trading Hours */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-poppins font-bold text-slate-900 text-sm mb-1">
              Peak Wholesale Order Windows
            </h3>
            <p className="text-xs text-slate-400 font-inter">
              Concentration of buyer procurement orders throughout the business day.
            </p>
          </div>

          <div className="space-y-3 font-inter">
            {peakHours.map((ph, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{ph.hour}</span>
                  <span className="text-[11px] text-slate-500">{ph.orders} orders ({ph.label})</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${ph.intensity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-[11px] font-inter">
            Peak dispatch fulfillment occurs at 12 PM cutoff. 58% of wholesale orders are placed before noon.
          </div>
        </div>
      </div>

      {/* ── Regional State-wise Sales Leaderboard ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-poppins font-bold text-slate-900 text-sm">
              State-wise Revenue Leaderboard
            </h3>
            <p className="text-xs text-slate-400 font-inter">
              Geographical distribution of wholesale demand across Indian states.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-inter">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-poppins font-bold uppercase text-[10px]">
                <th className="p-3">State / Territory</th>
                <th className="p-3 text-center">B2B Orders</th>
                <th className="p-3 text-right">Gross Sales (₹)</th>
                <th className="p-3 text-center">National Share</th>
                <th className="p-3 text-center">Growth Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stateSales.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="p-3 font-poppins font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span>{s.state}</span>
                  </td>
                  <td className="p-3 text-center text-slate-700 font-medium">{s.orders}</td>
                  <td className="p-3 text-right font-poppins font-bold text-slate-900">
                    ₹{s.revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700 text-[11px]">
                      {s.share}%
                    </span>
                  </td>
                  <td className="p-3 text-center font-poppins font-bold text-emerald-600">
                    {s.growth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
