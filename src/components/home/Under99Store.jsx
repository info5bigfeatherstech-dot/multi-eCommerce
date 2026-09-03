"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { notifyAddToCart, notifyWishlist } from "@/lib/notify";
import { Check, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const DEALS_UNDER_99 = [
  {
    id: "deal-bear-buckle",
    slug: "bear-button-jeans-buckle",
    name: "Bear Button Jeans Buckle (1 Pair) – Adjustable Alloy Jean Button Replacement",
    category: "Accessories",
    originalPrice: 199,
    price: 99,
    discountBadge: "-50%",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-toothbrush-cover",
    slug: "plastic-toothbrush-cover-portable",
    name: "1Pc Plastic Toothbrush Cover, Anti Bacterial Toothbrush Case Box, Portable",
    category: "Personal Care",
    originalPrice: 19,
    price: 9,
    discountBadge: "-53%",
    imageUrl: "https://images.unsplash.com/photo-1559591937-e1032b4b4e9f?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-10grid-storage",
    slug: "10-grid-large-storage-organizer",
    name: "10 Grid Large Plastic Storage Organizer Box – Adjustable Divider Jewelry & Craft",
    category: "Home & Storage",
    originalPrice: 199,
    price: 99,
    discountBadge: "-50%",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-ice-stick-tray",
    slug: "silicone-ice-stick-tray-mold",
    name: "Silicone Ice Stick Tray – 10 Grid Ice Cube Mold for Bottled Drinks, Water Bottles",
    category: "Kitchen & Dining",
    originalPrice: 159,
    price: 79,
    discountBadge: "-50%",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-climbing-hooks",
    slug: "leaf-shape-climbing-plant-hooks",
    name: "10Pcs Leaf Shape Climbing Plant, Wall Vine Climbing Plant Support Hook Self-Adhesive",
    category: "Home Decor",
    originalPrice: 99,
    price: 49,
    discountBadge: "-51%",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-wall-hooks-10",
    slug: "self-adhesive-wall-hooks-10pcs",
    name: "Self-Adhesive Wall Hooks (10 Pcs) – Round Hooks for Keys, Towels, Kitchen & Door",
    category: "Home & Living",
    originalPrice: 99,
    price: 49,
    discountBadge: "-51%",
    imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-sweat-pads-10",
    slug: "underarm-sweat-pads-10pcs",
    name: "10 Pcs Underarm Sweat Pads – Disposable Armpit Guards for Clothing Protection",
    category: "Personal Care",
    originalPrice: 199,
    price: 99,
    discountBadge: "-50%",
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-food-covers-75",
    slug: "disposable-food-cover-set-75pcs",
    name: "Disposable Food Cover Set – Kitchen & Dining Hygiene Essentials (Pack of 75 Pcs)",
    category: "Kitchen & Dining",
    originalPrice: 199,
    price: 99,
    discountBadge: "-50%",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-hanging-organizer",
    slug: "16-pocket-hanging-wardrobe-organizer",
    name: "Premium 16 Pocket Hanging Wardrobe Organizer – Cupboard Storage for Socks & Accessories",
    category: "Home & Storage",
    originalPrice: 199,
    price: 99,
    discountBadge: "-50%",
    imageUrl: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-food-clips-18",
    slug: "18-pcs-plastic-food-clips-set",
    name: "18 Pcs Food Clips Set – Plastic Snack & Bag Sealing Clips in 3 Sizes (Large, Medium, Small)",
    category: "Kitchen & Dining",
    originalPrice: 99,
    price: 49,
    discountBadge: "-51%",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
];

export function Under99Store({ onSelectProduct }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [addedIds, setAddedIds] = useState({});

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
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Section Header: Text Left-Aligned with Brand Theme Colors */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-accent">
                Wholesale Budget Steals
              </span>
          
            </div>
            <h2 className="text-2xl sm:text-3xl font-poppins font-extrabold text-slate-900 tracking-tight">
              Find Deals Under <span className="text-accent">₹99</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-inter">
              Direct factory pricing on trending household utilities, smart organizers & daily essentials
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-poppins font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              10 Hot Deals Live
            </span>
          </div>
        </div>

        {/* 5-Column Grid Matching User's Reference Screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {DEALS_UNDER_99.map((item) => {
            const isAdded = addedIds[item.id];
            const isInWishlist = wishlistItems.some(
              (w) =>
                (w.slug && item.slug && w.slug === item.slug) ||
                (w.id && item.id && w.id === item.id)
            );

            return (
              <div
                key={item.slug || item.id}
                onClick={() => onSelectProduct && onSelectProduct(item)}
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
                  <div className="absolute top-2 left-2 min-w-[32px] h-[32px] px-1 rounded-full bg-accent text-white font-poppins font-extrabold text-[10px] flex items-center justify-center shadow-md leading-none">
                    {item.discountBadge}
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
                      Rs. {item.originalPrice.toFixed(2)}
                    </span>
                    <span className="font-poppins font-bold text-sm text-accent">
                      RS. {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Pill Outline Button: ADD TO CART */}
                <button
                  onClick={(e) => handleAddToCart(e, item)}
                  className={cn(
                    "w-full py-1.5 px-3 rounded-full font-poppins font-bold text-[11px] tracking-wider uppercase transition-all duration-200 text-center border",
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
