import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  ArrowUpRight,
  Sparkles,
  Layers,
  CheckCircle2,
  PieChart,
} from "lucide-react";
import { toast } from "sonner";

export default function MarketingReportsView() {
  const campaigns = useAppSelector(
    (state) => state.adminMarketing?.campaigns || []
  );

  const [dateRange, setDateRange] = useState("Last 30 Days");

  const channelPerformance = [
    {
      channel: "WhatsApp Business API",
      spend: 38500,
      ordersGenerated: 1420,
      revenueGenerated: 420000,
      cac: 27.1,
      roas: 10.9,
      efficiency: "Excellent",
    },
    {
      channel: "Mobile & Web Push Alerts",
      spend: 18200,
      ordersGenerated: 890,
      revenueGenerated: 198000,
      cac: 20.4,
      roas: 10.8,
      efficiency: "Excellent",
    },
    {
      channel: "Email Newsletters",
      spend: 24000,
      ordersGenerated: 620,
      revenueGenerated: 245000,
      cac: 38.7,
      roas: 10.2,
      efficiency: "High",
    },
    {
      channel: "DLT SMS Gateway",
      spend: 19800,
      ordersGenerated: 410,
      revenueGenerated: 112000,
      cac: 48.2,
      roas: 5.65,
      efficiency: "Moderate",
    },
    {
      channel: "Paid Social & Meta Ads",
      spend: 145000,
      ordersGenerated: 1850,
      revenueGenerated: 680000,
      cac: 78.3,
      roas: 4.68,
      efficiency: "Good Scale",
    },
  ];

  const totalSpend = useMemo(() => {
    return channelPerformance.reduce((sum, c) => sum + c.spend, 0);
  }, []);

  const totalRevenue = useMemo(() => {
    return channelPerformance.reduce((sum, c) => sum + c.revenueGenerated, 0);
  }, []);

  const totalOrders = useMemo(() => {
    return channelPerformance.reduce((sum, c) => sum + c.ordersGenerated, 0);
  }, []);

  const blendedRoas = (totalRevenue / totalSpend).toFixed(2);
  const blendedCac = (totalSpend / totalOrders).toFixed(1);

  const handleExportCSV = () => {
    const headers = [
      "Marketing Channel",
      "Spend (INR)",
      "Orders Generated",
      "Revenue Generated (INR)",
      "Customer Acquisition Cost - CAC (INR)",
      "ROAS Multiplier",
      "Channel Efficiency",
    ];

    const rows = channelPerformance.map((c) => [
      `"${c.channel}"`,
      c.spend,
      c.ordersGenerated,
      c.revenueGenerated,
      c.cac,
      `${c.roas}x`,
      c.efficiency,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `marketing_roi_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Marketing ROI & Attribution report exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Marketing Performance & Attribution Reports
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
              <BarChart3 className="h-3 w-3" /> ROI Intelligence
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Analyze channel revenue attribution, Customer Acquisition Cost (CAC), and Return on Ad Spend (ROAS).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-sm text-xs text-slate-700">
            <Calendar className="h-4 w-4 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                toast.info(`Aggregating data for ${e.target.value}...`);
              }}
              className="bg-transparent focus:outline-none font-medium cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Current Quarter">Current Quarter</option>
              <option value="Full Financial Year">Full Financial Year</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export Report CSV
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Attributed Gross Sales
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">
            ₹{(totalRevenue / 100000).toFixed(1)} Lakhs
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {totalOrders.toLocaleString()} customer orders generated
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Marketing Outlay
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            ₹{(totalSpend / 100000).toFixed(2)} Lakhs
          </div>
          <p className="mt-1 text-xs text-slate-500">Blended multichannel spend</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Blended ROAS
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-purple-600">
            {blendedRoas}x
          </div>
          <p className="mt-1 text-xs text-slate-500">₹{blendedRoas} earned per ₹1 spent</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Blended CAC
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            ₹{blendedCac}
          </div>
          <p className="mt-1 text-xs text-slate-500">Cost per acquired customer order</p>
        </div>
      </div>

      {/* Channel Breakdown Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/75 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Channel Attribution & ROI Performance Matrix
          </h2>
          <span className="text-xs text-slate-500">
            Period: <strong>{dateRange}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Marketing Channel</th>
                <th className="px-6 py-3.5 text-right">Channel Spend</th>
                <th className="px-6 py-3.5 text-center">Orders Generated</th>
                <th className="px-6 py-3.5 text-right">Attributed Revenue</th>
                <th className="px-6 py-3.5 text-right">Cost Per Order (CAC)</th>
                <th className="px-6 py-3.5 text-center">ROAS Multiplier</th>
                <th className="px-6 py-3.5 text-center">Efficiency Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {channelPerformance.map((item) => (
                <tr
                  key={item.channel}
                  className="hover:bg-slate-50/75 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {item.channel}
                  </td>

                  <td className="px-6 py-4 text-right font-mono text-slate-800">
                    ₹{item.spend.toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-center font-bold text-slate-900">
                    {item.ordersGenerated.toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">
                    ₹{item.revenueGenerated.toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-right font-mono text-slate-700">
                    ₹{item.cac}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full text-xs">
                      {item.roas}x
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.efficiency === "Excellent"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.efficiency === "High"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {item.efficiency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Converting Campaigns Cards */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-3">
          Top Converting Active Campaigns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaigns.slice(0, 3).map((camp, idx) => (
            <div
              key={camp.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Rank #{idx + 1}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {camp.roas}x ROAS
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {camp.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{camp.objective}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Spend:</span>
                  <span className="font-bold text-slate-800">
                    ₹{camp.spend.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Revenue:</span>
                  <span className="font-bold text-emerald-600">
                    ₹{camp.revenueGenerated.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
