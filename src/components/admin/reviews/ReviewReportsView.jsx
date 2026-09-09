import React, { useState, useMemo } from "react";
import { useAppSelector } from "../../../store/hooks";
import {
  BarChart3,
  Star,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
  Award,
  AlertTriangle,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Package,
} from "lucide-react";
import { toast } from "sonner";

const ReviewReportsView = () => {
  const productReviews = useAppSelector(
    (state) => state.adminReviews?.productReviews || []
  );
  const customerFeedback = useAppSelector(
    (state) => state.adminReviews?.customerFeedback || []
  );

  const [dateRange, setDateRange] = useState("all"); // '7d' | '30d' | '90d' | 'all'

  // Calculations
  const totalReviews = productReviews.length;

  const averageRating = useMemo(() => {
    if (totalReviews === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / totalReviews).toFixed(1);
  }, [productReviews, totalReviews]);

  // Star Distribution
  const starDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((r) => {
      if (counts[r.rating] !== undefined) {
        counts[r.rating]++;
      }
    });

    return [5, 4, 3, 2, 1].map((stars) => {
      const count = counts[stars];
      const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
      return {
        stars,
        count,
        percentage,
      };
    });
  }, [productReviews, totalReviews]);

  // Merchant Response Rate
  const responseRate = useMemo(() => {
    if (totalReviews === 0) return 0;
    const repliedCount = productReviews.filter((r) => !!r.merchantReply).length;
    return Math.round((repliedCount / totalReviews) * 100);
  }, [productReviews, totalReviews]);

  // 5-Star Delight Index
  const fiveStarPercentage = useMemo(() => {
    if (totalReviews === 0) return 0;
    const count5 = productReviews.filter((r) => r.rating === 5).length;
    return Math.round((count5 / totalReviews) * 100);
  }, [productReviews, totalReviews]);

  // Category Breakdown
  const categoryStats = useMemo(() => {
    const map = {};
    productReviews.forEach((r) => {
      if (!map[r.category]) {
        map[r.category] = { category: r.category, totalRating: 0, count: 0, fiveStars: 0 };
      }
      map[r.category].totalRating += r.rating;
      map[r.category].count++;
      if (r.rating === 5) map[r.category].fiveStars++;
    });

    return Object.values(map).map((cat) => ({
      name: cat.category,
      avgRating: (cat.totalRating / cat.count).toFixed(1),
      count: cat.count,
      fiveStarShare: Math.round((cat.fiveStars / cat.count) * 100),
    }));
  }, [productReviews]);

  // Product SKUs Aggregation (Top & Needs Attention)
  const productAggregates = useMemo(() => {
    const map = {};
    productReviews.forEach((r) => {
      if (!map[r.sku]) {
        map[r.sku] = {
          sku: r.sku,
          productName: r.productName,
          category: r.category,
          totalRating: 0,
          count: 0,
          ratings: [],
        };
      }
      map[r.sku].totalRating += r.rating;
      map[r.sku].count++;
      map[r.sku].ratings.push(r.rating);
    });

    return Object.values(map).map((p) => ({
      ...p,
      avgRating: parseFloat((p.totalRating / p.count).toFixed(1)),
    }));
  }, [productReviews]);

  const topRatedProducts = useMemo(() => {
    return [...productAggregates]
      .filter((p) => p.avgRating >= 4.0)
      .sort((a, b) => b.avgRating - a.avgRating);
  }, [productAggregates]);

  const needsAttentionProducts = useMemo(() => {
    return [...productAggregates]
      .filter((p) => p.avgRating < 4.0)
      .sort((a, b) => a.avgRating - b.avgRating);
  }, [productAggregates]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Metric", "Value", "Notes"];
    const rows = [
      ["Average Catalog Rating", `${averageRating} / 5.0`, "Calculated over all recorded reviews"],
      ["Total Product Reviews", totalReviews, "Storewide review records"],
      ["Merchant Response Rate", `${responseRate}%`, "Reviews with official merchant reply"],
      ["5-Star Delight Ratio", `${fiveStarPercentage}%`, "Percentage of total reviews with 5 stars"],
      ...starDistribution.map((s) => [`${s.stars} Star Reviews`, s.count, `${s.percentage}% share`]),
      ...categoryStats.map((c) => [
        `Category: ${c.name}`,
        `${c.avgRating} avg (${c.count} reviews)`,
        `${c.fiveStarShare}% 5-star ratio`,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `review_performance_reports_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Review performance report exported to CSV!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Review Reports & Analytics
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Review performance, ratings distribution, and product satisfaction statistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Report CSV
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Rating */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Catalog Rating
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-900">{averageRating}</span>
              <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(parseFloat(averageRating))
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
        </div>

        {/* 5-Star Delight Index */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              5-Star Delight Index
            </span>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {fiveStarPercentage}%
            </div>
            <div className="text-xs text-emerald-700 mt-1 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Highest satisfaction tier
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Merchant Response Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Merchant Response Rate
            </span>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {responseRate}%
            </div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">
              Target benchmark: &gt; 25%
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Total Feedback Volume */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Catalog Reviews
            </span>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {totalReviews}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              + {customerFeedback.length} general store CSAT surveys
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Analytics Grid: Star Histogram & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Star Rating Distribution Histogram (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Star Rating Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Volume and percentage distribution across 1 to 5 stars.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {totalReviews} Total
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {starDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12 text-xs font-semibold text-slate-700">
                  <span>{item.stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      item.stars >= 4
                        ? "bg-emerald-500"
                        : item.stars === 3
                        ? "bg-amber-400"
                        : "bg-rose-400"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="w-16 text-right">
                  <span className="text-xs font-bold text-slate-900">
                    {item.percentage}%
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">
                    ({item.count})
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Positive (4-5★):{" "}
              <strong className="text-slate-900">
                {starDistribution
                  .filter((s) => s.stars >= 4)
                  .reduce((acc, s) => acc + s.percentage, 0)}
                %
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              Critical (&lt;3★):{" "}
              <strong className="text-slate-900">
                {starDistribution
                  .filter((s) => s.stars < 3)
                  .reduce((acc, s) => acc + s.percentage, 0)}
                %
              </strong>
            </span>
          </div>
        </div>

        {/* Category Performance & Sentiment (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Category Satisfaction Scores
              </h2>
              <p className="text-xs text-slate-500">
                Average ratings and 5-star delight rates by product category.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              {categoryStats.length} Categories
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Reviews</th>
                  <th className="py-2.5 px-3">Avg Rating</th>
                  <th className="py-2.5 px-3">5★ Share</th>
                  <th className="py-2.5 px-3 text-right">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {categoryStats.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {cat.name}
                    </td>
                    <td className="py-3 px-3">{cat.count}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      <div className="flex items-center gap-1">
                        <span>{cat.avgRating}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${cat.fiveStarShare}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700">
                          {cat.fiveStarShare}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {parseFloat(cat.avgRating) >= 4.5 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Excellent
                        </span>
                      ) : parseFloat(cat.avgRating) >= 3.5 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Good
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Review Needed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Highlights: Top Rated vs Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rated SKUs */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Top Rated Catalog SKUs
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              High Satisfaction
            </span>
          </div>

          <div className="space-y-3">
            {topRatedProducts.map((p) => (
              <div
                key={p.sku}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-900">
                    {p.productName}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-mono bg-slate-100 text-slate-600 px-1 py-0.2 rounded">
                      {p.sku}
                    </span>
                    <span>{p.category}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-sm font-bold text-slate-900">
                      {p.avgRating}
                    </span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {p.count} review{p.count > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention SKUs */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                SKUs Requiring Follow-up
              </h2>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              Low Ratings / Latency Reports
            </span>
          </div>

          <div className="space-y-3">
            {needsAttentionProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No low-rated SKUs detected in the current catalog.
              </div>
            ) : (
              needsAttentionProducts.map((p) => (
                <div
                  key={p.sku}
                  className="p-3 rounded-lg border border-amber-200 bg-amber-50/20 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-xs text-slate-900">
                      {p.productName}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-mono bg-slate-100 text-slate-600 px-1 py-0.2 rounded">
                        {p.sku}
                      </span>
                      <span>{p.category}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-sm font-bold text-rose-600">
                        {p.avgRating}
                      </span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="text-[10px] text-amber-700 font-medium">
                      Action Recommended
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actionable insight recommendation */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Merchant Quality Recommendation:
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Customer review REV-106 noted audio delay during gaming mode on <em>Aura Pro Earbuds</em>. Coordinate with electronics vendor on firmware patch v1.4 update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewReportsView;
