import React from "react";
import { useAppSelector } from "@/store/hooks";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Boxes,
  PieChart,
  Percent,
  Download,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductAnalyticsView() {
  const topProducts = useAppSelector((state) => state.adminAnalytics.topProducts);
  const categoryShares = useAppSelector((state) => state.adminAnalytics.categoryShares);
  const deadStock = useAppSelector((state) => state.adminAnalytics.deadStock);

  const handleExportProductCSV = () => {
    const headers = ["SKU", "Product Name", "Category", "Units Sold", "Revenue (Rs)", "Gross Margin (%)", "Velocity"];
    const rows = topProducts.map((p) => [
      p.sku,
      `"${p.name}"`,
      `"${p.category}"`,
      p.unitsSold,
      p.revenue,
      `${p.margin}%`,
      p.velocity,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apexmart_top_products_performance_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported top products report");
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-poppins font-black uppercase tracking-wider">
              SKU Intelligence
            </span>
            <span className="text-xs text-slate-400 font-inter">Inventory Velocity & Margins</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            Product Performance Analysis
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Identify top revenue drivers, analyze product-level profit margins, monitor category market share, and liquidate dead stock.
          </p>
        </div>

        <button
          onClick={handleExportProductCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-poppins font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Product Performance</span>
        </button>
      </div>

      {/* ── Top Performing SKUs Table ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="font-poppins font-bold text-slate-900 text-sm">
            Top 5 Wholesale Best-Selling SKUs
          </h3>
          <p className="text-xs text-slate-400 font-inter">
            Ranked by total realized procurement volume and gross profitability.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-inter">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-poppins font-bold uppercase text-[10px]">
                <th className="p-3">Product / SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Units Sold</th>
                <th className="p-3 text-right">Revenue (₹)</th>
                <th className="p-3 text-center">Gross Margin</th>
                <th className="p-3 text-center">Remaining Stock</th>
                <th className="p-3">Sales Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.map((prod, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="p-3">
                    <p className="font-poppins font-bold text-slate-900 text-xs">{prod.name}</p>
                    <span className="font-mono text-[10px] text-slate-400 font-medium">
                      SKU: {prod.sku}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">{prod.category}</td>
                  <td className="p-3 text-center font-poppins font-bold text-slate-800">
                    {prod.unitsSold}
                  </td>
                  <td className="p-3 text-right font-poppins font-black text-slate-900">
                    ₹{prod.revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-poppins font-bold text-[11px]">
                      {prod.margin}%
                    </span>
                  </td>
                  <td className="p-3 text-center font-semibold text-slate-700">
                    {prod.stock} units
                  </td>
                  <td className="p-3 text-slate-500 text-[11px] font-medium">{prod.velocity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mid Section: Category Shares & Dead Stock ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-poppins font-bold text-slate-900 text-sm">
              Category Revenue Share & Margins
            </h3>
            <span className="text-xs text-slate-400 font-inter">5 categories</span>
          </div>

          <div className="space-y-3 font-inter">
            {categoryShares.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-poppins font-bold text-slate-900">
                      ₹{(cat.revenue / 100000).toFixed(1)}L ({cat.percentage}%)
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-emerald-600 font-semibold">{cat.margin}% margin</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dead Stock & Slow Moving Inventory Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="font-poppins font-bold text-slate-900 text-sm">
                Dead Stock & Idle Capital Watchlist
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-inter">
              SKUs with zero purchase orders in 30+ days requiring operational markdown or re-order.
            </p>
          </div>

          <div className="space-y-3 font-inter">
            {deadStock.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-poppins font-bold text-slate-800">{item.name}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                    {item.daysWithoutSale} days idle
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>SKU: {item.sku}</span>
                  <span>•</span>
                  <span>Stock: {item.stock} units</span>
                  <span>•</span>
                  <span>Holding Value: ₹{item.inventoryValue.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-[11px] text-amber-800 font-medium pt-1 border-t border-slate-200/60 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  <span>Action: {item.recommendation}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
