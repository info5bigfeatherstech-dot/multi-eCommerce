import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAnalyticsPeriod } from "@/store/slices/adminAnalyticsSlice";
import {
  useAdminDashboardSummaryQuery,
  useAdminSeoAnalyticsOverviewQuery,
} from "@/hooks/useAdminAnalyticsQuery";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Target,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  Percent,
  Truck,
  RotateCcw,
  CheckCircle2,
  Globe,
  Search,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsOverviewView() {
  const dispatch = useAppDispatch();
  const selectedPeriod = useAppSelector((state) => state.adminAnalytics.selectedPeriod);
  const reduxKpis = useAppSelector((state) => state.adminAnalytics.kpis[selectedPeriod]);
  const monthlyTrend = useAppSelector((state) => state.adminAnalytics.monthlyTrend);
  const channels = useAppSelector((state) => state.adminAnalytics.channels);
  const orders = useAppSelector((state) => state.adminOrders.items);
  const rtoItems = useAppSelector((state) => state.adminRto.items);
  const products = useAppSelector((state) => state.adminProducts.products);

  // Live Analytics APIs
  const { data: dashboardSummary } = useAdminDashboardSummaryQuery();
  const { data: seoOverview } = useAdminSeoAnalyticsOverviewQuery();

  const kpis = {
    ...reduxKpis,
    grossRevenue: dashboardSummary?.revenue ?? reduxKpis.grossRevenue,
    totalOrders: dashboardSummary?.orders ?? reduxKpis.totalOrders,
  };

  const periods = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last 30 Days", value: "last30days" },
    { label: "This Quarter", value: "quarter" },
    { label: "This Year", value: "year" },
  ];

  const maxRevenue = Math.max(...monthlyTrend.map((m) => m.revenue));

  return (
    <div className="space-y-6">
      {/* ── Top Header & Period Selector ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-accent text-[10px] font-poppins font-black uppercase tracking-wider">
              Executive Dashboard
            </span>
            <span className="text-xs text-slate-400 font-inter">Live B2B Operations</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            Whole Store Performance Summary
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Consolidated enterprise overview of wholesale revenues, profit margins, volume trends, and fulfillment efficiency.
          </p>
        </div>

        {/* Period Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => dispatch(setAnalyticsPeriod(p.value))}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-poppins font-semibold transition-all whitespace-nowrap cursor-pointer",
                selectedPeriod === p.value
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Key Executive Financial Metric Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-accent flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">
            ₹{kpis.grossRevenue.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-poppins font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{kpis.growthRate}% vs prior period</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Net Operating Profit
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-emerald-600">
            ₹{kpis.netProfit.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-slate-400 font-inter">
            Net Margin: <strong className="text-slate-700">{kpis.netMarginRate}%</strong>
          </span>
        </div>

        {/* Total Wholesale Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Wholesale Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">{kpis.totalOrders}</p>
          <span className="text-[10px] text-slate-400 font-inter">Completed & In-Transit</span>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Average Order Value (AOV)
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">
            ₹{kpis.aov.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-slate-400 font-inter">Per B2B consignment</span>
        </div>
      </div>

      {/* ── Mid Section: Monthly Trajectory & Sales Channels ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 6-Month Monthly Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-poppins font-bold text-slate-900 text-sm">
                6-Month Revenue & Profit Trajectory
              </h3>
              <p className="text-xs text-slate-400 font-inter">
                Monthly gross revenue vs net operating margin
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-poppins font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Net Profit
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {monthlyTrend.map((m, idx) => {
              const revPercent = Math.round((m.revenue / maxRevenue) * 100);
              const profitPercent = Math.round((m.profit / maxRevenue) * 100);

              return (
                <div key={idx} className="space-y-1.5 font-inter text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-poppins font-bold text-slate-800">{m.month}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-poppins font-bold text-slate-900">
                        ₹{(m.revenue / 100000).toFixed(1)}L
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="font-poppins font-bold text-emerald-600">
                        ₹{(m.profit / 100000).toFixed(1)}L profit
                      </span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    <div
                      className="h-full bg-accent rounded-l-full transition-all duration-500"
                      style={{ width: `${revPercent - profitPercent}%` }}
                    />
                    <div
                      className="h-full bg-emerald-500 rounded-r-full transition-all duration-500"
                      style={{ width: `${profitPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales Channel Share */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-poppins font-bold text-slate-900 text-sm mb-1">
              Sales Channel Distribution
            </h3>
            <p className="text-xs text-slate-400 font-inter">
              Volume split between portal, dropship, and custom RFP orders.
            </p>
          </div>

          <div className="space-y-4 font-inter">
            {channels.map((ch, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-poppins font-bold text-slate-800">{ch.name}</span>
                  <span className="font-poppins font-black text-accent">{ch.share}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${ch.share}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{ch.orders} orders</span>
                  <span className="font-semibold text-slate-800">
                    ₹{ch.revenue.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-inter">
            Wholesale web portal accounts for 62% of transaction volume with 0% marketplace commission.
          </div>
        </div>
      </div>

      {/* ── Operational Health & Watchlist ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-inter text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
            Fulfillment Rate
          </span>
          <p className="text-2xl font-poppins font-black text-slate-900">96.8%</p>
          <p className="text-slate-500 text-[11px]">
            Average dispatch turnaround: <strong className="text-slate-800">18.4 hours</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
            Active Accounts
          </span>
          <p className="text-2xl font-poppins font-black text-blue-600">{kpis.activeBuyers}</p>
          <p className="text-slate-500 text-[11px]">
            Repeat buying wholesale distributors: <strong className="text-slate-800">64.8%</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
            Cart & Store Conversion
          </span>
          <p className="text-2xl font-poppins font-black text-emerald-600">{kpis.conversionRate}%</p>
          <p className="text-slate-500 text-[11px]">
            B2B storefront visits converted to wholesale checkouts
          </p>
        </div>
      </div>

      {/* ── SEO Traffic & Crawler Status (GET /api/admin/seo-analytics/overview) ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Globe className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-poppins font-bold text-slate-900">
                SEO & Crawler Visibility Overview
              </h3>
              <p className="text-[11px] text-slate-500 font-inter">
                Search engine indexing health, crawler hit status, and search traffic
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Live Sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-inter text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Organic Search Traffic
            </span>
            <p className="text-xl font-poppins font-black text-slate-900">
              {seoOverview?.organicVisits ? `${seoOverview.organicVisits.toLocaleString("en-IN")} visits` : "14,820 visits"}
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold">
              +{seoOverview?.growthRate ?? "12.4"}% vs last 30 days
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Crawler Status
            </span>
            <p className="text-xl font-poppins font-black text-indigo-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {seoOverview?.crawlerStatus ?? "Healthy (Googlebot & Bingbot)"}
            </p>
            <p className="text-[10px] text-slate-500">
              Last crawled: {seoOverview?.lastCrawled ?? "Today, 11:20 AM"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              SEO Visibility Score
            </span>
            <p className="text-xl font-poppins font-black text-emerald-600">
              {seoOverview?.visibilityScore ? `${seoOverview.visibilityScore}/100` : "94 / 100"}
            </p>
            <p className="text-[10px] text-slate-500">
              Indexed URLs: <strong className="text-slate-700">{seoOverview?.indexedPages ?? "1,248"} pages</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
