import React from "react";
import { useAppSelector } from "@/store/hooks";
import {
  Users,
  TrendingUp,
  Award,
  Clock,
  Building2,
  MapPin,
  CheckCircle2,
  Download,
  Sparkles,
  Repeat,
  HeartHandshake,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function CustomerAnalyticsView() {
  const customerSegments = useAppSelector((state) => state.adminAnalytics.customerSegments);
  const topCustomers = useAppSelector((state) => state.adminAnalytics.topCustomers);
  const customerMetrics = useAppSelector((state) => state.adminAnalytics.customerMetrics);

  const handleExportCustomersCSV = () => {
    const headers = ["Account ID", "Contact Name", "Company", "City", "State", "Orders", "Total Spend (Rs)", "AOV", "Tier", "Payment Reliability"];
    const rows = topCustomers.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.company}"`,
      c.city,
      c.state,
      c.ordersCount,
      c.totalSpend,
      c.aov,
      c.tier,
      c.paymentReliability,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apexmart_top_customers_ledger_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported top customers report");
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-poppins font-black uppercase tracking-wider">
              Buyer Retention & LTV
            </span>
            <span className="text-xs text-slate-400 font-inter">Wholesale Cohort Insights</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            Customer Behaviour & Sales Analysis
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Monitor client retention rates, average re-order velocity, B2B account segmentation, and credit payment reliability.
          </p>
        </div>

        <button
          onClick={handleExportCustomersCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-poppins font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Buyer Accounts</span>
        </button>
      </div>

      {/* ── Customer Retention Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Repeat Purchase Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-emerald-600">
            {customerMetrics.repeatPurchaseRate}%
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Wholesale buyers ordering 2+ times</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Avg Re-order Cycle
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">
            {customerMetrics.avgReorderIntervalDays} Days
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Interval between repeat restocks</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Customer Lifetime Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-accent flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">
            ₹{customerMetrics.customerLifetimeValue.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Average annualized account value</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Account Churn Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-purple-700">
            {customerMetrics.churnRate}%
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Inactive for &gt;90 days</span>
        </div>
      </div>

      {/* ── B2B Customer Cohorts Breakdown ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-poppins font-bold text-slate-900 text-sm">
              B2B Client Segmentation & Revenue Contribution
            </h3>
            <p className="text-xs text-slate-400 font-inter">
              Tier distribution across VIP enterprise distributors and independent hardware retailers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-inter text-xs">
          {customerSegments.map((seg, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-poppins font-bold text-slate-900">{seg.segment}</span>
                <span className="font-poppins font-black text-accent text-sm">{seg.share}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${seg.share}%` }}
                />
              </div>
              <div className="flex justify-between text-slate-500 pt-1 text-[11px]">
                <span>{seg.count} registered accounts</span>
                <span className="font-semibold text-slate-800">
                  ₹{(seg.revenue / 100000).toFixed(1)}L total
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Avg spend per account: <strong className="text-slate-700">₹{seg.avgSpend.toLocaleString("en-IN")}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Buying Accounts Leaderboard ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-poppins font-bold text-slate-900 text-sm">
              Top 5 Wholesale Account Partners
            </h3>
            <p className="text-xs text-slate-400 font-inter">
              Highest lifetime spending businesses with credit settlement metrics.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-inter">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-poppins font-bold uppercase text-[10px]">
                <th className="p-3">Partner Company & Contact</th>
                <th className="p-3">Location</th>
                <th className="p-3 text-center">Consignments</th>
                <th className="p-3 text-right">Total Procurement</th>
                <th className="p-3 text-right">AOV</th>
                <th className="p-3 text-center">Credit Reliability</th>
                <th className="p-3 text-center">Account Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80">
                  <td className="p-3">
                    <p className="font-poppins font-bold text-slate-900 text-xs">{cust.company}</p>
                    <span className="text-[11px] text-slate-500">{cust.name}</span>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">
                    {cust.city}, {cust.state}
                  </td>
                  <td className="p-3 text-center font-poppins font-bold text-slate-800">
                    {cust.ordersCount}
                  </td>
                  <td className="p-3 text-right font-poppins font-black text-slate-900">
                    ₹{cust.totalSpend.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 text-right font-semibold text-slate-700">
                    ₹{cust.aov.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-poppins font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {cust.paymentReliability}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-accent font-poppins font-bold text-[10px]">
                      {cust.tier}
                    </span>
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
