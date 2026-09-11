import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  ShoppingCart,
  Clock,
  TrendingUp,
  AlertTriangle,
  Search,
  Eye,
  Mail,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  Package,
  X,
  RefreshCw,
  Send,
  Sparkles,
  DollarSign,
  User,
} from "lucide-react";
import {
  useAdminCartsQuery,
  useAdminAbandonedCartsQuery,
  useAdminHighValueCartsQuery,
  useAdminCartDetailQuery,
  useBulkCartReminderEmailMutation,
  useBulkCartReminderPushMutation,
} from "@/hooks/useAdminAnalyticsQuery";
import { formatCurrency, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

export default function AdminCartsView() {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "abandoned" | "high-value"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCartId, setSelectedCartId] = useState(null);

  // Auto push toggle states matching the design
  const [cartAutoPush, setCartAutoPush] = useState(true);
  const [wishlistAutoPush, setWishlistAutoPush] = useState(true);

  // Queries
  const {
    data: allCartsData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    refetch: refetchAll,
  } = useAdminCartsQuery({ search: searchTerm });

  const {
    data: abandonedCartsData,
    isLoading: isLoadingAbandoned,
    isError: isErrorAbandoned,
    error: errorAbandoned,
    refetch: refetchAbandoned,
  } = useAdminAbandonedCartsQuery({ hours: 24 });

  const {
    data: highValueCartsData,
    isLoading: isLoadingHighValue,
    isError: isErrorHighValue,
    error: errorHighValue,
    refetch: refetchHighValue,
  } = useAdminHighValueCartsQuery({ minAmount: 5000 });

  const { data: cartDetail, isLoading: isLoadingDetail } = useAdminCartDetailQuery(selectedCartId);

  // Recovery mutations
  const bulkEmailMutation = useBulkCartReminderEmailMutation();
  const bulkPushMutation = useBulkCartReminderPushMutation();

  const extractCartsList = (queryData) => {
    if (!queryData) return [];
    if (Array.isArray(queryData)) return queryData;
    if (Array.isArray(queryData.data)) return queryData.data;
    if (Array.isArray(queryData.carts)) return queryData.carts;
    if (Array.isArray(queryData.data?.data)) return queryData.data.data;
    if (Array.isArray(queryData.data?.carts)) return queryData.data.carts;
    return [];
  };

  // Defensive normalizer supporting all backend response shapes
  const normalizeCart = (cart) => {
    if (!cart) return null;
    const cartId = cart._id || cart.cartId || cart.id || String(Math.random());
    const user = cart.user || cart.customer || {};
    const customerName = user.name || (user.email ? user.email.split("@")[0] : "Shopper");
    const customerEmail = user.email || "";
    const customerPhone = user.phone || "";
    const customerRole = user.role || user.userType || "User";
    const customerAvatar =
      user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=0D8ABC&color=fff&bold=true`;

    const items = Array.isArray(cart.items)
      ? cart.items.map((item, idx) => {
          const productName = item.productName || item.title || item.name || "Item";
          const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
          const quantity = Number(item.quantity ?? item.qty ?? 1);
          const lineTotal = Number(item.lineTotal ?? unitPrice * quantity);
          const sku = item.sku || item.productCode || "";
          const variantText =
            Array.isArray(item.variantAttributes) && item.variantAttributes.length > 0
              ? item.variantAttributes.map((a) => `${a.key}: ${a.value}`).join(" · ")
              : item.variant || (sku ? `Code: ${sku}` : "Standard SKU");
          const image =
            item.imageUrl ||
            item.image ||
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80";

          return {
            ...item,
            productId: item.productId || item._id || idx,
            productName,
            title: productName,
            unitPrice,
            price: unitPrice,
            quantity,
            lineTotal,
            sku,
            variant: variantText,
            imageUrl: image,
            image,
          };
        })
      : [];

    const totalAmount = Number(
      cart.totalAmount ??
        cart.totalValue ??
        items.reduce((s, i) => s + i.lineTotal, 0)
    );

    const itemCount = Number(
      cart.itemCount ??
        cart.totalItems ??
        items.reduce((s, i) => s + i.quantity, 0)
    );

    const updatedAt = cart.updatedAt || cart.lastActivity || cart.createdAt || new Date().toISOString();
    const isAbandoned = Date.now() - new Date(updatedAt).getTime() > 24 * 60 * 60 * 1000;

    return {
      ...cart,
      _id: cartId,
      cartId,
      id: cartId,
      user: {
        ...user,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        role: customerRole,
        avatar: customerAvatar,
      },
      customer: {
        ...user,
        id: user._id || user.id || cartId,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        role: customerRole,
        avatar: customerAvatar,
      },
      items,
      totalAmount,
      totalValue: totalAmount,
      itemCount,
      totalItems: itemCount,
      updatedAt,
      isAbandoned,
    };
  };

  const rawAll = extractCartsList(allCartsData);
  const rawAbandoned = extractCartsList(abandonedCartsData);
  const rawHighValue = extractCartsList(highValueCartsData);

  const allCarts = rawAll.map(normalizeCart).filter(Boolean);

  // Compute abandoned and high-value from allCarts if dedicated endpoint returned empty or is not configured
  const computedAbandoned = allCarts.filter((c) => c.isAbandoned);
  const abandonedCarts =
    rawAbandoned.length > 0 ? rawAbandoned.map(normalizeCart).filter(Boolean) : computedAbandoned;

  const computedHighValue = allCarts.filter((c) => c.totalAmount >= 5000);
  const highValueCarts =
    rawHighValue.length > 0 ? rawHighValue.map(normalizeCart).filter(Boolean) : computedHighValue;

  // Active dataset depending on tab
  const currentList =
    activeTab === "all"
      ? allCarts
      : activeTab === "abandoned"
      ? abandonedCarts
      : highValueCarts;

  const isLoadingCurrent =
    activeTab === "all"
      ? isLoadingAll
      : activeTab === "abandoned"
      ? isLoadingAbandoned && abandonedCarts.length === 0
      : isLoadingHighValue && highValueCarts.length === 0;

  const isErrorCurrent =
    activeTab === "all"
      ? isErrorAll
      : activeTab === "abandoned"
      ? isErrorAbandoned && abandonedCarts.length === 0
      : isErrorHighValue && highValueCarts.length === 0;

  const errorCurrent =
    activeTab === "all"
      ? errorAll
      : activeTab === "abandoned"
      ? errorAbandoned
      : errorHighValue;

  // Filter by search
  const filteredList = currentList.filter((cart) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      cart.customer?.name?.toLowerCase().includes(q) ||
      cart.customer?.email?.toLowerCase().includes(q) ||
      cart.customer?.phone?.includes(q) ||
      cart.items?.some((i) => i.title?.toLowerCase().includes(q) || i.sku?.toLowerCase().includes(q))
    );
  });

  // Calculate high-level metrics
  const totalActiveCartsCount = allCarts.length;
  const totalCartRevenue = allCarts.reduce((s, c) => s + (c.totalValue || 0), 0);
  const abandonedCount = abandonedCarts.length;
  const abandonedValue = abandonedCarts.reduce((s, c) => s + (c.totalValue || 0), 0);
  const highValueCount = highValueCarts.length;

  const handleQuickRecover = async (customer) => {
    const custId = customer?.id || customer?._id;
    if (!custId) return;
    await bulkPushMutation.mutateAsync({
      userIds: [custId],
      title: "Your shopping bag is reserved! ⚡",
      body: "Complete your wholesale order now to claim guaranteed factory allocation.",
      directLink: "/checkout",
    });
  };

  const activeCart =
    (selectedCartId && allCarts.find((c) => c._id === selectedCartId || c.cartId === selectedCartId)) ||
    (cartDetail ? normalizeCart(cartDetail) : null);

  return (
    <div className="space-y-6 animate-fadeIn font-poppins">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
              Shopping Cart Analytics
            </span>
            <span className="text-xs text-slate-400 font-inter">Live Checkout Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>Customer Carts</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {totalActiveCartsCount} Active Session(s)
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-1">
            Monitor real-time basket additions, analyze abandoned checkouts older than 24h, and recover high-value accounts.
          </p>
        </div>

        <button
          onClick={() => {
            refetchAll();
            refetchAbandoned();
            refetchHighValue();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Sync Pipeline</span>
        </button>
      </div>

      {/* ── Summary Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Active Carts
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-accent flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalActiveCartsCount}</div>
          <p className="text-[11px] text-slate-400 font-inter mt-0.5">
            Active pipeline: <strong className="text-slate-700">{formatCurrency(totalCartRevenue)}</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">
              Abandoned (24h+)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{abandonedCount}</div>
          <p className="text-[11px] text-slate-400 font-inter mt-0.5">
            Potential loss: <strong className="text-rose-600">{formatCurrency(abandonedValue)}</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
              High Value (&gt;₹5,000)
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-700 mt-2">{highValueCount}</div>
          <p className="text-[11px] text-slate-400 font-inter mt-0.5">
            Wholesale priority accounts
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Recovery Benchmark
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">14.2%</div>
          <p className="text-[11px] text-slate-400 font-inter mt-0.5">
            Automated lead push success
          </p>
        </div>
      </div>

      {/* ── Navigation Tabs & Search ── */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Tabs */}
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
            All Carts ({totalActiveCartsCount})
          </button>
          <button
            onClick={() => setActiveTab("abandoned")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
              activeTab === "abandoned"
                ? "bg-rose-500 text-white shadow-xs"
                : "text-slate-600 hover:text-rose-600"
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Abandoned (24h+) ({abandonedCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("high-value")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
              activeTab === "high-value"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 hover:text-purple-600"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>High Value (&gt;₹5k) ({highValueCount})</span>
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

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search carts by customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-poppins focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* ── Carts Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-poppins">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Email & Contact</th>
                <th className="py-4 px-4 text-center">Total Items</th>
                <th className="py-4 px-4">Total Cart Value</th>
                <th className="py-4 px-4">Last Activity</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoadingCurrent ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-inter">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-accent" />
                    Loading cart sessions...
                  </td>
                </tr>
              ) : isErrorCurrent ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-rose-600 font-inter space-y-2">
                    <AlertTriangle className="w-6 h-6 mx-auto text-rose-500" />
                    <p className="font-bold text-slate-800">API Error: {errorCurrent?.message || "Failed to load carts from backend"}</p>
                    <button
                      onClick={() => {
                        if (activeTab === "all") refetchAll();
                        else if (activeTab === "abandoned") refetchAbandoned();
                        else refetchHighValue();
                      }}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    >
                      Retry Request
                    </button>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-inter space-y-2">
                    <ShoppingCart className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="font-bold text-slate-700">No carts found in this bucket</p>
                    <p className="text-xs text-slate-400">All customer carts have checked out or no carts match the criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((cart) => {
                  const isAbandoned =
                    (Date.now() - new Date(cart.updatedAt).getTime()) > 24 * 60 * 60 * 1000;
                  const cartKey = cart._id || cart.cartId || cart.id;
                  const customerName =
                    cart.customer?.name || cart.customer?.email?.split("@")[0] || "Shopper";
                  const avatarUrl =
                    cart.customer?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      customerName
                    )}&background=0D8ABC&color=fff&bold=true`;

                  return (
                    <tr key={cartKey} className="hover:bg-slate-50/70 transition-colors">
                      {/* Customer Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={avatarUrl}
                            alt={customerName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{customerName}</div>
                            {(cart.customer?.role || cart.customer?.userType) && (
                              <span className="text-[10px] text-slate-400 font-inter">
                                {cart.customer.role || cart.customer.userType}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-3 px-4">
                        <div className="font-inter text-slate-700">{cart.customer?.email}</div>
                        <div className="text-[10px] text-slate-400 font-inter">{cart.customer?.phone}</div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs">
                          {cart.totalItems} item(s)
                        </span>
                      </td>

                      {/* Value */}
                      <td className="py-3 px-4">
                        <span className="font-black text-slate-900 text-sm">
                          {formatCurrency(cart.totalValue)}
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td className="py-3 px-4 font-inter text-slate-600">
                        <div>{new Date(cart.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(cart.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {isAbandoned ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                            Abandoned
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedCartId(cart._id || cart.cartId)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-accent hover:text-accent font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Items</span>
                        </button>
                        <button
                          onClick={() => handleQuickRecover(cart.customer)}
                          className="px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-accent hover:text-white text-accent font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Send Quick Cart Recovery Push"
                        >
                          <Send className="w-3 h-3" />
                          <span className="hidden sm:inline">Recover</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CART SNAPSHOT MODAL ── */}
      {selectedCartId && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCartId(null);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-modal-backdrop font-poppins"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-modal-card">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-accent text-white">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Cart Snapshot</h3>
                  <p className="text-xs text-slate-300 font-inter">Cart ID: {selectedCartId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCartId(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-poppins">
              {/* Customer Contact Details Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {activeCart?.customer?.name || "Anonymous Guest Customer"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                    {activeCart?.customer?.role || "Retail Customer"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-500 font-inter">
                  <div>
                    <span className="text-slate-400">Email: </span>
                    <a href={`mailto:${activeCart?.customer?.email}`} className="text-accent underline font-medium">
                      {activeCart?.customer?.email || "No email available"}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400">Phone: </span>
                    <span className="font-medium text-slate-700">
                      {activeCart?.customer?.phone || "No phone listed"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Cart Contents ({activeCart?.items?.length || 0})
                </h4>
                {isLoadingDetail && !activeCart?.items?.length ? (
                  <div className="py-8 text-center text-slate-400 font-inter">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-accent" />
                    Loading items...
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeCart?.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/70 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || item.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80"}
                            alt={item.title || item.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{item.title || item.productName}</div>
                            <div className="text-[10px] text-slate-400 font-inter">
                              {item.variant || item.productCode || item.sku || "Standard SKU"}
                            </div>
                            <div className="text-accent font-bold mt-0.5">
                              {formatCurrency(item.price || item.unitPrice)} × {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="font-black text-slate-900 text-sm">
                          {formatCurrency(item.lineTotal || (item.price * item.quantity))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Value Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Cart Items Total</span>
                  <span className="font-bold text-slate-900">{formatCurrency(activeCart?.totalValue || 0)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-inter">
                  <span>Estimated 18% GST Input Credit</span>
                  <span>{formatCurrency(Math.round((activeCart?.totalValue || 0) * 0.18))}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-accent">{formatCurrency(activeCart?.totalValue || 0)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer with Quick Recovery Trigger */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="coral"
                size="sm"
                onClick={() => {
                  handleQuickRecover(activeCart?.customer);
                  setSelectedCartId(null);
                }}
                className="gap-1.5 text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Push Recovery</span>
              </Button>

              <Button variant="outline" size="sm" onClick={() => setSelectedCartId(null)}>
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
