"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { notifyAddToCart, notifyWishlist } from "@/lib/notify";
import { formatCurrency, cn } from "@/lib/utils";
import {
  getStorefrontLabelBySlug,
  getStorefrontProductsByTag,
} from "@/api/storefrontLabels";
import {
  Tag,
  ArrowLeft,
  Sparkles,
  Flame,
  Search,
  ShoppingBag,
  Heart,
  Star,
  Check,
  Truck,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Filter,
} from "lucide-react";

export function TagProductsPage({ defaultSlug }) {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Resolve target slug
  const activeSlug = useMemo(() => {
    if (defaultSlug) return defaultSlug;
    if (params.slug) return params.slug;
    // Extract slug if route was e.g. /today-arrival or /on-sale
    const path = location.pathname.toLowerCase().replace(/^\//, "");
    if (path.startsWith("tagproducts/")) return path.replace("tagproducts/", "");
    if (path.startsWith("tag-products/")) return path.replace("tag-products/", "");
    return path;
  }, [defaultSlug, params.slug, location.pathname]);

  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  // Label Metadata State
  const [label, setLabel] = useState(null);
  const [isLoadingLabel, setIsLoadingLabel] = useState(true);
  const [labelError, setLabelError] = useState(null);

  // Products State
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [addedIds, setAddedIds] = useState({});

  // 1. Fetch Label Metadata (Title, Description, Storefront)
  useEffect(() => {
    if (!activeSlug) return;
    let isCancelled = false;

    async function loadLabelDetails() {
      setIsLoadingLabel(true);
      setLabelError(null);
      try {
        const res = await getStorefrontLabelBySlug(activeSlug, { storefront: "ecomm" });
        if (!isCancelled) {
          setLabel(res.label);
          // Set page title for SEO
          document.title = `${res.label.name} | ApexMart Wholesale`;
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("Label detail fetch error:", err);
          setLabelError(err);
          // Fallback title formatting from slug
          const fallbackName = activeSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          document.title = `${fallbackName} | ApexMart Wholesale`;
        }
      } finally {
        if (!isCancelled) setIsLoadingLabel(false);
      }
    }

    loadLabelDetails();
    return () => {
      isCancelled = true;
    };
  }, [activeSlug]);

  // 2. Fetch Products tagged with this label
  const loadProducts = useCallback(
    async (pageToLoad = 1) => {
      if (!activeSlug) return;
      setIsLoadingProducts(true);
      setProductsError(null);

      try {
        const res = await getStorefrontProductsByTag(activeSlug, {
          page: pageToLoad,
          limit: 12,
          search: searchQuery.trim(),
          sort: sortBy === "featured" ? "" : sortBy,
          storefront: "ecomm",
        });

        setProducts(res.products || []);
        setTotalProducts(res.totalProducts || 0);
        setTotalPages(res.totalPages || 1);
        setCurrentPage(res.page || 1);
      } catch (err) {
        console.warn("Tag products fetch error:", err);
        setProductsError(err.message || "Failed to load products for this label");
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    },
    [activeSlug, searchQuery, sortBy]
  );

  // Debounced fetch on search or sort change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(1);
    }, searchQuery ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadProducts, searchQuery, sortBy]);

  // Handlers
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addItem(product));
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    notifyAddToCart(product.name);
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    const isNowInWishlist = !wishlistItems.some(
      (item) =>
        (item.slug && product.slug && item.slug === product.slug) ||
        (item.id && product.id && item.id === product.id)
    );
    dispatch(toggleWishlist(product));
    notifyWishlist(product.name, isNowInWishlist);
  };

  // Sort client-side if needed as instant feedback
  const sortedProducts = useMemo(() => {
    let list = [...products];
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [products, sortBy]);

  // 404 / LABEL_NOT_FOUND State
  if (labelError?.isNotFound || labelError?.code === "LABEL_NOT_FOUND") {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
            <AlertCircle className="w-8 h-8 stroke-[1.75]" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-800">
              Collection Unavailable
            </h1>
            <p className="text-xs text-slate-500 font-montreal max-w-md mx-auto mt-2">
              The requested collection <code>/{activeSlug}</code> is currently inactive, has expired, or does not exist for this storefront.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-heading font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Go Back
            </button>
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold shadow-xs cursor-pointer"
            >
              Browse All Collections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName =
    label?.name ||
    activeSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ── Breadcrumbs ── */}
      <nav aria-label="Breadcrumb" className="text-xs font-inter text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-accent font-semibold transition-colors">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-400">Collections</span>
        <span className="text-slate-300">/</span>
        <span className="font-poppins font-bold text-slate-800 line-clamp-1">{displayName}</span>
      </nav>

      {/* ── Hero Banner ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0f1f38] via-[#162c4e] to-[#0f1f38] text-white p-6 sm:p-8 overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-[11px] font-heading font-black tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Collection
              </span>
              {label?.storefronts && (
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-montreal font-semibold uppercase">
                  {label.storefronts.join(" & ")}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif tracking-tight text-white font-bold">
              {isLoadingLabel ? (
                <span className="inline-block w-48 h-8 bg-white/10 rounded-lg animate-pulse" />
              ) : (
                displayName
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-montreal line-clamp-2 max-w-xl">
              {label?.description ||
                "Explore exclusive wholesale deals, verified premium stock, and bulk rates for this curated collection."}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center flex-shrink-0">
              <Tag className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-heading font-black text-slate-400">Total Items</p>
              <p className="text-lg font-heading font-black text-white">
                {isLoadingProducts ? "..." : totalProducts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters & Search Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search within this collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-montreal text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-accent bg-slate-50/50 focus:bg-white"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
          <span className="text-xs text-slate-500 font-montreal">
            Showing <strong className="text-slate-900 font-heading">{sortedProducts.length}</strong> items
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-heading font-bold text-slate-600 hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-heading font-bold text-slate-700 bg-white focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Products Grid ── */}
      {isLoadingProducts ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
          <Loader2 className="w-8 h-8 mx-auto text-accent animate-spin mb-3" />
          <p className="text-sm font-heading font-bold text-slate-700">Loading products...</p>
          <p className="text-xs text-slate-400 mt-1 font-montreal">Fetching tagged items from catalog</p>
        </div>
      ) : productsError ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-rose-100 shadow-xs p-6 space-y-3">
          <AlertCircle className="w-10 h-10 mx-auto text-rose-500 stroke-[1.5]" />
          <h3 className="font-heading font-bold text-slate-800 text-base">Could not load products</h3>
          <p className="text-xs text-slate-500 font-montreal max-w-sm mx-auto">{productsError}</p>
          <button
            type="button"
            onClick={() => loadProducts(currentPage)}
            className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-heading font-bold hover:bg-accent-hover cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-800">
              No products found in this collection
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-montreal mt-1">
              {searchQuery
                ? "No products match your search query. Try clearing your search keywords."
                : "Products are currently being assigned to this collection. Please check back soon."}
            </p>
          </div>
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-5 py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors shadow-xs cursor-pointer"
            >
              Clear Search
            </button>
          ) : (
            <Link
              to="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-accent text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors shadow-xs cursor-pointer"
            >
              Browse All Categories
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {sortedProducts.map((product) => {
            const productSlug = product.slug || product.id;
            const isInWishlist = wishlistItems.some(
              (item) =>
                (item.slug && product.slug && item.slug === product.slug) ||
                (item.id && product.id && item.id === product.id)
            );
            const isAdded = Boolean(addedIds[product.id]);

            return (
              <div
                key={product.id || product.slug}
                onClick={() => navigate(`/product/${productSlug}`)}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-3 shadow-xs hover:shadow-xl hover:border-accent/40 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Top Image */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-2.5">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {product.discount && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-accent text-white text-[10px] font-heading font-black shadow-xs">
                      {product.discount}
                    </span>
                  )}

                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer z-10"
                    aria-label="Toggle Wishlist"
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isInWishlist
                          ? "fill-rose-500 text-rose-500"
                          : "text-slate-400 hover:text-rose-500"
                      )}
                    />
                  </button>

                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[9px] font-montreal font-semibold">
                    MOQ: {product.moq || 1} Pc
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-1 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-heading font-bold text-amber-500 mb-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating || 4.8}</span>
                      <span className="text-slate-400 font-normal">
                        ({product.reviewCount || 38})
                      </span>
                    </div>

                    <h3
                      title={product.name}
                      className="font-heading font-bold text-xs text-slate-800 line-clamp-2 leading-snug group-hover:text-accent transition-colors"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-heading font-black text-accent">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[11px] text-slate-400 line-through font-montreal">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product)}
                      className={cn(
                        "w-full mt-2.5 py-2 px-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 shadow-xs cursor-pointer",
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-[#121f38] hover:bg-[#1a2d50] text-white"
                      )}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-accent" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            disabled={currentPage <= 1 || isLoadingProducts}
            onClick={() => loadProducts(currentPage - 1)}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-heading font-bold text-slate-600 px-3">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages || isLoadingProducts}
            onClick={() => loadProducts(currentPage + 1)}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default TagProductsPage;
