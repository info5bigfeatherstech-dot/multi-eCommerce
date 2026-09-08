"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productSlice";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { formatCurrency, cn } from "@/lib/utils";
import { notifyAddToCart, notifyWishlist } from "@/lib/notify";
import Skeleton from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  ShoppingBag,
  Heart,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
} from "lucide-react";

export function FeaturedCollection({ onSelectProduct }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: products, status } = useAppSelector((state) => state.products);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [showAll, setShowAll] = useState(false);
  const [addedProductIds, setAddedProductIds] = useState({});

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addItem(product));
    notifyAddToCart(product, {
      onOpenCart: () => dispatch(setCartDrawerOpen(true)),
    });

    setAddedProductIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProductIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    const isCurrentInWishlist = wishlistItems.some(
      (item) =>
        (item.slug && product.slug && item.slug === product.slug) ||
        (item.id && product.id && item.id === product.id)
    );
    dispatch(toggleWishlist(product));
    notifyWishlist(product, !isCurrentInWishlist, {
      onViewWishlist: () => navigate("/wishlist"),
    });
  };

  // Restrict to exactly 8 products by default as requested
  const displayedProducts = showAll ? products : products.slice(0, 8);

  return (
    <section className="py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-accent">
                Handpicked Wholesale
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Zero MOQ
              </span>
            </div>
            <h2 className="section-title text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Collection
            </h2>
            <p className="section-subtitle text-xs sm:text-sm text-slate-500 font-inter">
              Direct factory wholesale pricing with instant GST invoicing & zero MOQ.
            </p>
          </div>

          {/* Top-Right "View All Products" Button */}
          {products.length > 8 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="self-start sm:self-end flex items-center gap-1.5 text-xs font-poppins font-bold text-accent hover:text-accent-hover group transition-colors py-1 px-2 rounded-lg hover:bg-accent/10"
            >
              <span>{showAll ? "Show Top 8" : `View All Products (${products.length})`}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* 4-Column Responsive Grid (8 Products) */}
        {status === "loading" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200">
                <Skeleton className="w-full h-36 sm:h-52 md:h-64 rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayedProducts.map((product) => {
              const isInWishlist = wishlistItems.some((item) => item.id === product.id);
              const isJustAdded = addedProductIds[product.id];

              return (
                <div
                  key={product.slug || product.id}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 relative cursor-pointer hover:-translate-y-1"
                >
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-6 left-6 z-10">
                      <Badge variant="coral" className="font-poppins font-extrabold text-[10px] px-2.5 py-0.5 shadow-sm">
                        {product.discount}
                      </Badge>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className="absolute top-6 right-6 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 shadow-sm flex items-center justify-center transition-colors"
                    aria-label="Add to Wishlist"
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isInWishlist ? "fill-rose-500 text-rose-500" : "text-slate-400"
                      )}
                    />
                  </button>

                  {/* Product Image Container */}
                  <div className="relative w-full h-36 sm:h-52 md:h-64 rounded-xl overflow-hidden bg-slate-100 mb-3 sm:mb-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Information */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3
                        title={product.name}
                        className="product-title line-clamp-2 min-h-[40px] group-hover:text-accent transition-colors"
                      >
                        {product.name}
                      </h3>

                      {/* Price Block */}
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-poppins font-black text-base text-slate-900">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="font-inter text-xs text-slate-400 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={cn(
                        "w-full py-2.5 px-4 rounded-xl font-poppins font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm",
                        isJustAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-accent hover:bg-accent-hover text-white shadow-xs hover:shadow-md"
                      )}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom "View All Products" Button */}
        {products.length > 8 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-white hover:bg-slate-50 border-2 border-accent text-accent hover:text-accent-hover font-poppins font-extrabold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <span>{showAll ? "Show Less (8 Products)" : `View All Products (${products.length} Items)`}</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  showAll && "rotate-180"
                )}
              />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

export default FeaturedCollection;
