import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  DollarSign,
  Package,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export default function StockQueryReportsView() {
  const queries = useAppSelector((state) => state.adminStockQueries?.queries || []);
  const productDemands = useAppSelector((state) => state.adminStockQueries?.productDemands || []);

  const [timeRange, setTimeRange] = useState("30days");

  const totalQueries = queries.length;
  const notifiedCount = queries.filter((q) => q.status === "Notified" || q.status === "Restocked").length;
  const convertedCount = queries.filter((q) => q.status === "Restocked").length;
  const conversionRate = totalQueries > 0 ? Math.round((convertedCount / totalQueries) * 100) : 0;
  const totalDemandValue = productDemands.reduce((sum, p) => sum + (p.potentialDemandValue || 0), 0);

  const channelBreakdown = [
    { channel: "WhatsApp Alert", count: 42, percentage: "51%", color: "bg-emerald-500" },
    { channel: "Email Notification", count: 28, percentage: "34%", color: "bg-blue-500" },
    { channel: "SMS Alert", count: 12, percentage: "15%", color: "bg-purple-500" },
  ];

  const handleExportReport = () => {
    toast.success("Stock Queries & Demand Intelligence Report compiled and downloaded.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
              Demand Intelligence
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Procurement Analytics</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Queries and Demand Reports
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Historical stock demand forecasting, notification conversion funnel, and unmet customer demand valuation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last Quarter</option>
              <option value="year">Full Year 2026</option>
            </select>
          </div>

          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Intelligence Report
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unmet Demand Total</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            ₹{totalDemandValue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Back-In-Stock Conversions</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{conversionRate}%</p>
          <p className="text-xs text-slate-400 mt-1">Purchased after restock alert</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dispatched Restock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{notifiedCount}</p>
          <p className="text-xs text-slate-400 mt-1">Sent via WhatsApp, SMS, & Mail</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Wait Time to Restock</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">8.2 days</p>
          <p className="text-xs text-slate-400 mt-1">From user query to inventory check-in</p>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Demanded Products Ranking */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-poppins font-bold text-slate-900 text-base">
                Top Requested Out-of-Stock SKUs
              </h3>
              <p className="text-xs text-slate-400 font-inter">
                Ranked by customer waitlist volume and projected revenue impact
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
              Procurement Priority
            </span>
          </div>

          <div className="space-y-4 font-inter">
            {productDemands.map((product, idx) => {
              const maxDemand = Math.max(...productDemands.map((p) => p.totalRequests), 1);
              const barPercent = Math.round((product.totalRequests / maxDemand) * 100);

              return (
                <div key={product.productId} className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <img
                        src={product.thumbnail}
                        alt={product.productName}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm line-clamp-1">{product.productName}</p>
                        <p className="text-xs text-slate-400 font-mono">{product.sku} • {product.category}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">
                        ₹{product.potentialDemandValue.toLocaleString()}
                      </p>
                      <p className="text-xs text-amber-700 font-semibold">{product.totalRequests} buyers waiting</p>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full transition-all duration-500"
                        style={{ width: `${barPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Preferred Notification Channel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-poppins font-bold text-slate-900 text-base">
              Alert Channel Share
            </h3>
            <p className="text-xs text-slate-400 font-inter mt-0.5">
              Breakdown of customer notification channel selection
            </p>
          </div>

          <div className="space-y-4 font-inter">
            {channelBreakdown.map((item) => (
              <div key={item.channel} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.channel}</span>
                  <span className="text-slate-900">{item.percentage} ({item.count} alerts)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: item.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-inter space-y-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Automated Restock Dispatch
            </span>
            <p className="text-slate-600 leading-relaxed">
              When an admin marks a product as restocked in the Products Inventory manager, the system can automatically broadcast personalized alerts to all waitlisted customers with a 1-click buy link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
