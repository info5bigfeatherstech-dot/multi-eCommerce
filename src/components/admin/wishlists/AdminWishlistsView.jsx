import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Heart,
  Clock,
  Flame,
  TrendingUp,
  Search,
  Eye,
  ShoppingBag,
  ExternalLink,
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  RefreshCw,
  Award,
} from "lucide-react";
import {
  useAdminWishlistsQuery,
  useAdminStaleWishlistsQuery,
  useAdminPopularProductsQuery,
} from "@/hooks/useAdminAnalyticsQuery";
import { formatCurrency, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

export default function AdminWishlistsView() {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "stale" | "popular"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWishlistCustomer, setSelectedWishlistCustomer] = useState(null);

  // Auto push toggle states matching the design
  const [cartAutoPush, setCartAutoPush] = useState(true);
  const [wishlistAutoPush, setWishlistAutoPush] = useState(true);

  // Queries
  const {
    data: allWishlistsData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    refetch: refetchAll,
  } = useAdminWishlistsQuery({ search: searchTerm });

  const {
    data: staleWishlistsData,
    isLoading: isLoadingStale,
    isError: isErrorStale,
    error: errorStale,
    refetch: refetchStale,
  } = useAdminStaleWishlistsQuery({ days: 7 });

  const {
    data: popularProducts,
    isLoading: isLoadingPopular,
    isError: isErrorPopular,
    error: errorPopular,
    refetch: refetchPopular,
  } = useAdminPopularProductsQuery();

  const extractWishlistsList = (queryData) => {
    if (!queryData) return [];
    if (Array.isArray(queryData)) return queryData;
    if (Array.isArray(queryData.data)) return queryData.data;
    if (Array.isArray(queryData.wishlists)) return queryData.wishlists;
    if (Array.isArray(queryData.data?.data)) return queryData.data.data;
    if (Array.isArray(queryData.data?.wishlists)) return queryData.data.wishlists;
    return [];
  };

  const normalizeWishlist = (wl) => {
    if (!wl) return null;
    const wlId = wl._id || wl.id || String(Math.random());
    const user = wl.user || wl.customer || {};
    const customerName = user.name || (user.email ? user.email.split("@")[0] : "Customer");
    const customerEmail = user.email || "";
    const customerAvatar =
      user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=0D8ABC&color=fff&bold=true`;

    const items = Array.isArray(wl.items)
      ? wl.items.map((item, idx) => {
          const productName =
            typeof item === "string" ? item : item.productName || item.title || item.name || "Saved Item";
          const price = typeof item === "object" ? Number(item.unitPrice ?? item.price ?? 20) : 20;
          const image = typeof item === "object" ? item.imageUrl || item.image || null : null;
          const inStock = typeof item === "object" ? item.inStock !== false && item.stock !== 0 : true;

          return {
            ...item,
            id: item._id || item.productId || idx,
            productName,
            title: productName,
            name: productName,
            price,
            unitPrice: price,
            image,
            imageUrl: image,
            inStock,
          };
        })
      : [];

    const itemsCount = Number(wl.itemCount ?? wl.itemsCount ?? items.length);
    const estimatedValue = Number(
      wl.totalAmount ??
        wl.estimatedValue ??
        wl.totalValue ??
        items.reduce((s, i) => s + (i.price || 0), 0)
    );

    const lastUpdated = wl.updatedAt || wl.lastUpdated || wl.createdAt || new Date().toISOString();
    const daysUntouched = Math.max(
      0,
      Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
    );
    const isStale = daysUntouched >= 7;

    return {
      ...wl,
      _id: wlId,
      id: wlId,
      user: {
        ...user,
        name: customerName,
        email: customerEmail,
        avatar: customerAvatar,
      },
      customer: {
        ...user,
        name: customerName,
        email: customerEmail,
        avatar: customerAvatar,
      },
      items,
      itemsCount,
      itemCount: itemsCount,
      estimatedValue,
      totalAmount: estimatedValue,
      lastUpdated,
      updatedAt: lastUpdated,
      daysUntouched,
      isStale,
    };
  };

  const rawAllWl = extractWishlistsList(allWishlistsData);
  const rawStaleWl = extractWishlistsList(staleWishlistsData);

  const allWishlists = rawAllWl.map(normalizeWishlist).filter(Boolean);
  const computedStale = allWishlists.filter((w) => w.isStale);
  const staleWishlists =
    rawStaleWl.length > 0 ? rawStaleWl.map(normalizeWishlist).filter(Boolean) : computedStale;
  const popularList = Array.isArray(popularProducts?.data)
    ? popularProducts.data
    : Array.isArray(popularProducts)
    ? popularProducts
    : [];

  const isLoadingCurrent =
    activeTab === "all"
      ? isLoadingAll
      : activeTab === "stale"
      ? isLoadingStale
      : isLoadingPopular;

  const isErrorCurrent =
    activeTab === "all"
      ? isErrorAll
      : activeTab === "stale"
      ? isErrorStale
      : isErrorPopular;

  const errorCurrent =
    activeTab === "all"
      ? errorAll
      : activeTab === "stale"
      ? errorStale
      : errorPopular;

  const totalSavedItems = allWishlists.reduce((s, w) => s + (w.itemsCount || 0), 0);
  const totalEstimatedDemand = allWishlists.reduce((s, w) => s + (w.estimatedValue || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn font-poppins">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold uppercase tracking-wider">
              Customer Wishlist Analytics
            </span>
            <span className="text-xs text-slate-400 font-inter">Purchase Intent & Demand Signal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>Customer Wishlists & Saved Items</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {allWishlists.length} Active Lists
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-1">
            Analyze customer saved favorites, discover unpurchased stale wishlists, and rank top popular products.
          </p>
        </div>

        <button
          onClick={() => {
            refetchAll();
            refetchStale();
            refetchPopular();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Saved Items
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalSavedItems}</div>
          <p className="text-[11px] text-slate-400 font-inter mt-0.5">
            Estimated demand: <strong className="text-slate-800">{formatCurrency(totalEstimatedDemand)}</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
              Stale Wishlists (7d+)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{staleWishlists.length}</div>
          <p className="text-[11px] text-slate-400 font-inter mt-0.5">
            Untouched for 7+ days (ideal for discount nudges)
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
              Top Trending Product
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-accent flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 mt-2 truncate">
            {popularList[0]?.name || "Industrial Power Drill"}
          </div>
          <p className="text-[11px] text-slate-400 font-inter mt-0.5">
            Saved by <strong className="text-accent">{popularList[0]?.savedCount || 384}</strong> shoppers
          </p>
        </div>
      </div>

      {/* ── Tabs & Search ── */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl w-full xl:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            All Wishlists ({allWishlists.length})
          </button>
          <button
            onClick={() => setActiveTab("stale")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
              activeTab === "stale"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-slate-600 hover:text-amber-600"
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Stale Wishlists (7d+) ({staleWishlists.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
              activeTab === "popular"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-600 hover:text-rose-600"
            )}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Popular Products ({popularList.length})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full xl:w-auto justify-end">
          {/* Cart auto push Toggle Card */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#FAF9F7] border border-slate-200/80 rounded-xl">
            <div>
              <div className="font-semibold text-[11px] text-slate-700 leading-tight">Cart auto push</div>
              <div className="text-[9px] text-slate-400 font-inter">On - ~Tue - Fri - Sat - 5:00 PM IST</div>
            </div>
            <button
              onClick={() => {
                setCartAutoPush((prev) => {
                  const next = !prev;
                  toast.success(`Cart auto push ${next ? "activated" : "paused"}`);
                  return next;
                });
              }}
              type="button"
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                cartAutoPush ? "bg-[#8B5CF6]" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  cartAutoPush ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* Wishlist auto push Toggle Card */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#FAF9F7] border border-slate-200/80 rounded-xl">
            <div>
              <div className="font-semibold text-[11px] text-slate-700 leading-tight">Wishlist auto push</div>
              <div className="text-[9px] text-slate-400 font-inter">On - ~Thu - Sun - 6:00 PM IST</div>
            </div>
            <button
              onClick={() => {
                setWishlistAutoPush((prev) => {
                  const next = !prev;
                  toast.success(`Wishlist auto push ${next ? "activated" : "paused"}`);
                  return next;
                });
              }}
              type="button"
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                wishlistAutoPush ? "bg-[#8B5CF6]" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  wishlistAutoPush ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {activeTab !== "popular" && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search wishlists by customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-poppins focus:outline-none focus:border-accent"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT: Popular Products Tab ── */}
      {activeTab === "popular" ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Most Desired Products Leaderboard</span>
              </h3>
              <p className="text-xs text-slate-400 font-inter">
                Ranked by unique customer wishlist saves across the platform.
              </p>
            </div>
            <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
              Live Popularity
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {popularList.map((product) => {
              const stockBadge =
                product.stockStatus === "In Stock" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    In Stock ({product.stockQuantity})
                  </span>
                ) : product.stockStatus === "Low Stock" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    <AlertTriangle className="w-3 h-3" />
                    Low Stock ({product.stockQuantity})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    <XCircle className="w-3 h-3" />
                    Out of Stock
                  </span>
                );

              return (
                <div
                  key={product.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0",
                        product.rank === 1
                          ? "bg-amber-400 text-amber-950 ring-4 ring-amber-100"
                          : product.rank === 2
                          ? "bg-slate-300 text-slate-800 ring-4 ring-slate-100"
                          : product.rank === 3
                          ? "bg-amber-700 text-white ring-4 ring-amber-100"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      #{product.rank}
                    </div>

                    {/* Image */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />

                    {/* Name & Category */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-slate-400 font-inter">{product.category}</span>
                        <span>•</span>
                        {stockBadge}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Saves */}
                  <div className="flex items-center gap-6 justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-accent">{formatCurrency(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-slate-400 line-through font-inter">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-inter">Selling Price</div>
                    </div>

                    <div className="px-4 py-2 rounded-2xl bg-rose-50 border border-rose-100 text-center min-w-[110px]">
                      <div className="flex items-center justify-center gap-1 text-rose-600 font-black text-base">
                        <Heart className="w-4 h-4 fill-rose-600" />
                        <span>{product.savedCount}</span>
                      </div>
                      <div className="text-[10px] text-rose-500 font-inter font-bold">Shopper Saves</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── Wishlists Table (All / Stale) ── */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-poppins">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4 text-center">Saved Items Count</th>
                  <th className="py-4 px-4">Total Estimated Value</th>
                  <th className="py-4 px-4">Last Updated</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoadingCurrent ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-inter">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-accent" />
                      Loading wishlist data...
                    </td>
                  </tr>
                ) : isErrorCurrent ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-rose-600 font-inter space-y-2">
                      <AlertTriangle className="w-6 h-6 mx-auto text-rose-500" />
                      <p className="font-bold text-slate-800">API Error: {errorCurrent?.message || "Failed to load wishlists from backend"}</p>
                      <button
                        onClick={() => {
                          if (activeTab === "all") refetchAll();
                          else refetchStale();
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        Retry Request
                      </button>
                    </td>
                  </tr>
                ) : (activeTab === "all" ? allWishlists : staleWishlists).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 font-inter space-y-2">
                      <Heart className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-bold text-slate-700">No wishlists found in this view</p>
                    </td>
                  </tr>
                ) : (
                  (activeTab === "all" ? allWishlists : staleWishlists).map((wl, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      {/* Customer Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              wl.customer?.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                wl.customer?.name || wl.customer?.email?.split("@")[0] || "Customer"
                              )}&background=0D8ABC&color=fff&bold=true`
                            }
                            alt={wl.customer?.name || "Customer"}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <span className="font-bold text-slate-900">{wl.customer?.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-inter text-slate-600">
                        {wl.customer?.email}
                      </td>

                      {/* Items count */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                          <Heart className="w-3 h-3 fill-rose-600" />
                          {wl.itemsCount} item(s)
                        </span>
                      </td>

                      {/* Value */}
                      <td className="py-3 px-4">
                        <span className="font-black text-slate-900 text-sm">
                          {formatCurrency(wl.estimatedValue)}
                        </span>
                      </td>

                      {/* Last updated */}
                      <td className="py-3 px-4 font-inter text-slate-500">
                        <div>{new Date(wl.lastUpdated).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</div>
                        {wl.daysUntouched && (
                          <div className="text-[10px] text-amber-600 font-bold">
                            {wl.daysUntouched} days idle
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedWishlistCustomer(wl)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-accent hover:text-accent font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Saved</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Wishlist Customer Modal ── */}
      {selectedWishlistCustomer && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedWishlistCustomer(null);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-modal-backdrop font-poppins"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-modal-card">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <div>
                  <h3 className="font-bold text-base">{selectedWishlistCustomer.customer?.name}'s Wishlist</h3>
                  <p className="text-xs text-slate-400 font-inter">{selectedWishlistCustomer.customer?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWishlistCustomer(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs font-poppins">
              <div className="space-y-2">
                {(selectedWishlistCustomer.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{item.name || item.title || item.productName}</div>
                      <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Ready for Purchase</div>
                    </div>
                    <div className="font-bold text-accent text-sm">
                      {formatCurrency(item.price || 1499)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-100 p-3 rounded-2xl flex justify-between font-bold text-slate-800">
                <span>Total Potential Order Value</span>
                <span className="text-accent">{formatCurrency(selectedWishlistCustomer.estimatedValue)}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setSelectedWishlistCustomer(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
