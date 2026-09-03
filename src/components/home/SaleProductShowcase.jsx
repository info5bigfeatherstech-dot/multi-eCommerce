"use client";

import React, { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { formatCurrency } from "@/lib/utils";
import {
  Flame,
  ShoppingBag,
  Heart,
  Star,
  Zap,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SALE_CATEGORIES = [
  { id: "all", label: "All Mega Deals" },
  { id: "electronics", label: "Tech & Gadgets", category: "Electronics & Gadgets" },
  { id: "kitchen-home", label: "Kitchen & Home", categories: ["Kitchen & Dining", "Home Decor", "Home & Living"] },
  { id: "personal-travel", label: "Beauty & Travel", categories: ["Beauty & Personal Care", "Travel & Outdoor"] },
];

export function SaleProductShowcase({ onSelectProduct }) {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const scrollContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const [addedProductIds, setAddedProductIds] = useState({});

  // Filter products that are marked as sale or have high discount
  const saleProducts = products.filter(
    (p) => p.isSale || (p.discount && parseInt(p.discount) >= 60)
  );

  const filteredProducts = saleProducts.filter((product) => {
    if (activeTab === "all") return true;
    const tabConfig = SALE_CATEGORIES.find((t) => t.id === activeTab);
    if (!tabConfig) return true;
    if (tabConfig.category) return product.category === tabConfig.category;
    if (tabConfig.categories) return tabConfig.categories.includes(product.category);
    return true;
  });

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addItem(product));
    dispatch(setCartDrawerOpen(true));

    setAddedProductIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProductIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Sale Header Box */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white font-poppins text-xs font-black uppercase tracking-wider shadow-sm animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-white" />
                Mega Clearance Sale
              </span>
              <span className="text-xs font-poppins font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                Up to 75% OFF
              </span>
            </div>
            <h2 className="section-title text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              Super Sale & Factory Clearance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-inter">
              High-volume liquidation wholesale lots directly from verified manufacturers
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            {SALE_CATEGORIES.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-poppins font-bold transition-all whitespace-nowrap",
                    isActive
                      ? "bg-rose-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel Container with Left/Right Arrows */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-accent hover:border-accent shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-accent hover:border-accent shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Horizontal Scrollable Row: AT LEAST 5 PRODUCTS SHOWN AT A TIME ON DESKTOP */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-3.5 lg:gap-3.5 xl:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 px-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredProducts.map((product) => {
              const isJustAdded = addedProductIds[product.id];
              const savings = product.originalPrice - product.price;

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                  className="w-[210px] sm:w-[calc((100%-2*12px)/3)] md:w-[calc((100%-3*14px)/4)] lg:w-[calc((100%-4*14px)/5)] xl:w-[calc((100%-4*16px)/5)] flex-shrink-0 group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden hover:-translate-y-1 cursor-pointer"
                >
                  {/* Product Image Showcase with Rounded Corners & Dual Badges */}
                  <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Dual Badges: Orange Discount + Dark Deal of the Day */}
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded-md bg-accent text-white font-poppins font-black text-[9px] uppercase tracking-wider shadow-xs">
                        {product.discount || "50% OFF"}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-900/95 text-white font-poppins font-bold text-[9px] shadow-xs">
                        Deal of the Day
                      </span>
                    </div>
                  </div>

                  {/* Content (NO DESCRIPTION) */}
                  <div className="text-left space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating Line */}
                      <div className="flex items-center gap-1 text-[11px] font-poppins font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>4.8</span>
                        <span className="text-slate-400 font-normal">(980)</span>
                      </div>

                      <h3
                        title={product.name}
                        className="font-poppins font-bold text-xs sm:text-[13px] text-slate-800 leading-snug line-clamp-2 mt-0.5 group-hover:text-accent transition-colors min-h-[34px]"
                      >
                        {product.name}
                      </h3>

                      {/* Price Row */}
                      <div className="flex items-baseline gap-1.5 pt-1">
                        <span className="text-base sm:text-lg font-poppins font-black text-accent">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] font-inter text-slate-400 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Trust / Stock Availability Line */}
                      <div className="flex items-center gap-2 pt-0.5 text-[10px] font-poppins font-bold text-emerald-600">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          COD Available
                        </span>
                        <span>•</span>
                        <span>In Stock</span>
                      </div>
                    </div>

                    {/* Full-Width Add to Cart Button */}
                    <div className="pt-2">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={cn(
                          "w-full py-2 px-3 rounded-xl font-poppins font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95",
                          isJustAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-accent hover:bg-accent-hover text-white hover:shadow-md"
                        )}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
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
        </div>
      </div>
    </section>
  );
}

export default SaleProductShowcase;
