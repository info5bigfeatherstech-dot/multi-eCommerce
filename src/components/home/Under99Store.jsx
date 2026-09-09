"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { notifyAddToCart, notifyWishlist } from "@/lib/notify";
import { Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEALS_UNDER_99 } from "@/data/under99Deals";

export function Under99Store({ onSelectProduct }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [addedIds, setAddedIds] = useState({});

  // Show ONLY products strictly under or equal to ₹99
  const under99Items = DEALS_UNDER_99.filter((item) => Number(item.price) <= 99);

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    dispatch(addItem(item));
    notifyAddToCart(item, {
      onOpenCart: () => dispatch(setCartDrawerOpen(true)),
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  const handleWishlistToggle = (e, item) => {
    e.stopPropagation();
    const isCurrentInWishlist = wishlistItems.some(
      (w) =>
        (w.slug && item.slug && w.slug === item.slug) ||
        (w.id && item.id && w.id === item.id)
    );
    dispatch(toggleWishlist(item));
    notifyWishlist(item, !isCurrentInWishlist, {
      onViewWishlist: () => navigate("/wishlist"),
    });
  };

  return (
    <section className="py-8">
      <div className="w-full">
        {/* Section Header: Text Left-Aligned with Brand Theme Colors */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-slate-900 tracking-tight">
              Find Deals Under <span className="text-accent">₹99</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-inter">
              Direct factory pricing on trending household utilities, smart organizers & daily essentials
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-poppins font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              {under99Items.length} Hot Deals Live
            </span>
          </div>
        </div>

        {/* 5-Column Grid Matching User's Reference Screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {under99Items.map((item) => {
            const isAdded = addedIds[item.id];
            const isInWishlist = wishlistItems.some(
              (w) =>
                (w.slug && item.slug && w.slug === item.slug) ||
                (w.id && item.id && w.id === item.id)
            );

            return (
              <div
                key={item.slug || item.id}
                onClick={() => {
                  if (onSelectProduct) {
                    onSelectProduct(item);
                  } else {
                    navigate(`/product/${item.slug || item.id}`);
                  }
                }}
                className="group cursor-pointer flex flex-col justify-between space-y-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-accent/40 transition-all duration-300"
              >
                {/* Image Container with Top-Left Badge & Top-Right Wishlist Button */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Circular Discount Badge (Top Left) */}
                  <div className="absolute top-2 left-2 min-w-[32px] h-[32px] px-1 rounded-full bg-accent text-white font-poppins font-bold text-[10px] flex items-center justify-center shadow-md leading-none">
                    {item.discountBadge || "-50%"}
                  </div>

                  {/* Top-Right Wishlist / Like Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, item)}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 shadow-xs flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                    aria-label="Add to Wishlist"
                  >
                    <Heart
                      className={cn(
                        "w-3.5 h-3.5 transition-colors",
                        isInWishlist ? "fill-rose-500 text-rose-500" : "text-slate-400"
                      )}
                    />
                  </button>
                </div>

                {/* Text Content (Left Aligned) */}
                <div className="text-left space-y-1.5 flex-1 flex flex-col justify-between">
                  <h3
                    title={item.name}
                    className="font-inter text-xs text-slate-800 line-clamp-2 leading-snug group-hover:text-accent transition-colors min-h-[32px]"
                  >
                    {item.name}
                  </h3>

                  {/* Price Row: Strikethrough MRP + Bold Brand Accent Price */}
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="font-inter text-xs text-slate-400 line-through">
                      Rs. {Number(item.originalPrice).toFixed(2)}
                    </span>
                    <span className="font-poppins font-bold text-sm text-accent">
                      RS. {Number(item.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Pill Outline Button: ADD TO CART */}
                <button
                  onClick={(e) => handleAddToCart(e, item)}
                  className={cn(
                    "w-full py-1.5 px-3 rounded-full font-poppins font-bold text-[11px] tracking-wider uppercase transition-all duration-200 text-center border cursor-pointer",
                    isAdded
                      ? "bg-accent border-accent text-white shadow-sm"
                      : "bg-white border-slate-800 text-slate-800 hover:bg-accent hover:border-accent hover:text-white shadow-xs"
                  )}
                >
                  {isAdded ? (
                    <span className="flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>ADDED</span>
                    </span>
                  ) : (
                    "ADD TO CART"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Under99Store;
