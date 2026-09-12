"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeFromWishlist,
  clearWishlist,
} from "@/store/slices/wishlistSlice";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import {
  useWishlistQuery,
  useRemoveWishlistMutation,
  useBulkRemoveWishlistMutation,
  useClearWishlistMutation,
  useMoveWishlistToCartMutation,
} from "@/hooks/useWishlistQuery";
import { formatCurrency, cn } from "@/lib/utils";
import { notifyAddToCart } from "@/lib/notify";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Package,
  Layers,
  CheckSquare,
  Square,
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function WishlistPage({ onBack: propOnBack, onSelectProduct }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleBack = propOnBack || (() => navigate("/"));

  // React Query hooks
  const { data: wishlistData, isLoading } = useWishlistQuery();
  const removeWishlistMutation = useRemoveWishlistMutation();
  const bulkRemoveMutation = useBulkRemoveWishlistMutation();
  const clearMutation = useClearWishlistMutation();
  const moveWishlistToCartMutation = useMoveWishlistToCartMutation();

  const reduxWishlistItems = useAppSelector((state) => state.wishlist?.items) || [];
  // Merge or fallback to query data
  const wishlistItems = wishlistData?.items?.length ? wishlistData.items : reduxWishlistItems;

  const [selectedSlugs, setSelectedSlugs] = useState([]);

  const handleProductClick = (product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      navigate(`/product/${product.slug || product.id}`);
    }
  };

  // Move single item to Cart
  const handleMoveToCart = (product) => {
    const targetId = product.wishlistEntryId || product._id || product.id;
    const slug = product.slug || product.id;
    moveWishlistToCartMutation.mutate({
      moveAll: false,
      productIds: [targetId],
    });
    // Synchronize Redux
    dispatch(addItem(product));
    dispatch(removeFromWishlist(slug));
  };

  // Move All to Cart
  const handleMoveAllToBag = () => {
    moveWishlistToCartMutation.mutate({
      moveAll: true,
    });
    // Add all to Redux
    wishlistItems.forEach((p) => dispatch(addItem(p)));
    dispatch(clearWishlist());
  };

  // Remove single item
  const handleRemove = (product) => {
    const slug = product.slug || product.id;
    removeWishlistMutation.mutate(slug);
    dispatch(removeFromWishlist(slug));
  };

  // Clear all
  const handleClearAll = () => {
    clearMutation.mutate();
    dispatch(clearWishlist());
    setSelectedSlugs([]);
  };

  // Toggle selection
  const toggleSelectSlug = (slug) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Bulk remove selected
  const handleBulkRemove = () => {
    if (selectedSlugs.length === 0) return;
    bulkRemoveMutation.mutate({ slugs: selectedSlugs });
    selectedSlugs.forEach((s) => dispatch(removeFromWishlist(s)));
    setSelectedSlugs([]);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 font-poppins animate-fadeIn pb-16">
      {/* ── Top Header & Action Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-accent font-bold transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>My Wishlist</span>
            <span className="text-xs font-bold bg-rose-100 text-rose-600 px-3 py-1 rounded-full">
              {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
            </span>
          </h1>
        </div>

        {wishlistItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            {selectedSlugs.length > 0 && (
              <button
                onClick={handleBulkRemove}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedSlugs.length})</span>
              </button>
            )}

            <Button
              variant="coral"
              size="sm"
              onClick={handleMoveAllToBag}
              disabled={moveWishlistToCartMutation.isPending}
              className="gap-2 text-xs font-bold px-4 py-2.5 shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag</span>
            </Button>

            <button
              onClick={handleClearAll}
              className="text-xs text-slate-500 hover:text-rose-600 font-bold transition-colors px-2.5 py-2 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Wishlist Items Grid or Empty State ── */}
      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-12 space-y-4 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center shadow-inner">
            <Heart className="w-10 h-10 fill-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your wishlist is empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-inter leading-relaxed">
            Explore our industrial catalogs and click the heart icon on any product to save it for later or track restocks.
          </p>
          <button
            onClick={handleBack}
            className="mt-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Explore Bestsellers</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const slug = product.slug || product.id;
            const isSelected = selectedSlugs.includes(slug);
            const discountPercent =
              product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

            const isOutOfStock = product.stock === 0 || product.inStock === false;

            return (
              <div
                key={slug}
                className="group bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 relative"
              >
                {/* Checkbox Select for Bulk */}
                <button
                  onClick={() => toggleSelectSlug(slug)}
                  className="absolute top-6 left-6 z-10 p-1 rounded-lg bg-white/90 backdrop-blur-md shadow-xs text-slate-400 hover:text-accent cursor-pointer transition-colors"
                  title="Select for bulk action"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-accent" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>

                {/* Remove Wishlist Button */}
                <button
                  onClick={() => handleRemove(product)}
                  className="absolute top-6 right-6 z-10 h-8 w-8 rounded-full bg-white/95 backdrop-blur-md text-rose-500 hover:bg-rose-50 shadow-sm flex items-center justify-center transition-all cursor-pointer"
                  title="Remove from Wishlist"
                  aria-label="Remove item"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>

                {/* Badges: Sale & Stock Status */}
                <div className="absolute top-16 left-6 z-10 flex flex-col gap-1.5 pointer-events-none">
                  {discountPercent > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-accent text-white font-black text-[10px] uppercase tracking-wider shadow-2xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                  {isOutOfStock ? (
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider">
                      Out of Stock
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Product Thumbnail */}
                <div
                  className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-100 mb-4 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Details & CTA */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-accent transition-colors cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.name}
                    </h3>

                    {/* Price display */}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-black text-base text-accent">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="font-inter text-xs text-slate-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Move to Cart CTA */}
                  <Button
                    variant="coral"
                    disabled={isOutOfStock || moveWishlistToCartMutation.isPending}
                    className="w-full gap-2 font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition-all mt-2 py-2.5 rounded-xl cursor-pointer"
                    onClick={() => handleMoveToCart(product)}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? "Out of Stock" : "Move to Cart"}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
