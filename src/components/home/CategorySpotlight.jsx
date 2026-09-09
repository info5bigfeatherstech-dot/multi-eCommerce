"use client";

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { formatCurrency, cn } from "@/lib/utils";
import { notifyAddToCart, notifyWishlist } from "@/lib/notify";
import {
  ShoppingBag,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  Check,
  ArrowRight,
} from "lucide-react";

const BEST_SELLER_PRODUCTS = [
  {
    id: "bs-spice-dispenser",
    slug: "rotating-spice-dispenser",
    rank: 1,
    name: "360° Rotating Multi-Grid Kitchen Spice & Grain Dispenser",
    discount: "60% OFF",
    rating: "4.8",
    reviewCount: "1,240",
    price: 599,
    originalPrice: 1499,
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bs-tws-earbuds",
    slug: "dual-driver-tws-earbuds",
    rank: 2,
    name: "Dual Driver Ultra Bass TWS Wireless Earbuds with ENC",
    discount: "73% OFF",
    rating: "4.7",
    reviewCount: "2,450",
    price: 799,
    originalPrice: 2899,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bs-brass-diya",
    slug: "brass-peacock-diya-set",
    rank: 3,
    name: "Pure Brass Handcrafted Peacock Diya & Urli Set",
    discount: "58% OFF",
    rating: "4.9",
    reviewCount: "890",
    price: 849,
    originalPrice: 1999,
    imageUrl: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bs-jar-candles",
    slug: "luxury-soy-wax-jar-candles",
    rank: null,
    name: "Luxury Soy Wax Scented Aromatherapy Jar Candles Set",
    discount: "58% OFF",
    rating: "4.8",
    reviewCount: "940",
    price: 499,
    originalPrice: 1199,
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bs-granite-tawa",
    slug: "granite-dosa-tawa-pan-set",
    rank: null,
    name: "Heavy Duty Granite Die-Cast Dosa Tawa & Non-Stick Pan Set",
    discount: "64% OFF",
    rating: "4.7",
    reviewCount: "1,680",
    price: 999,
    originalPrice: 2799,
    imageUrl: "https://images.unsplash.com/photo-1584990347449-397cf1e52db0?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bs-smart-watch",
    slug: "smart-fitness-health-watch-amoled",
    rank: null,
    name: "Smart Fitness Health Watch with AMOLED Display & Heart Rate",
    discount: "50% OFF",
    rating: "4.8",
    reviewCount: "3,120",
    price: 1299,
    originalPrice: 2599,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bs-veg-chopper",
    slug: "12-in-1-veg-chopper",
    rank: null,
    name: "12-in-1 Ultra Sharp Vegetable & Fruit Chopper with Catch Tray",
    discount: "70% OFF",
    rating: "4.7",
    reviewCount: "4,210",
    price: 389,
    originalPrice: 1299,
    imageUrl: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "bs-ultrapods",
    slug: "transparent-ultrapods-max-tws",
    rank: null,
    name: "Transparent Ultrapods Max TWS Earbuds with LED Display",
    discount: "68% OFF",
    rating: "4.8",
    reviewCount: "1,950",
    price: 499,
    originalPrice: 1599,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
];

export function CategorySpotlight({ onSelectProduct }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const scrollContainerRef = useRef(null);
  const [addedIds, setAddedIds] = useState({});

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addItem(product));
    notifyAddToCart(product, {
      onOpenCart: () => dispatch(setCartDrawerOpen(true)),
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
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

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const firstCard = scrollContainerRef.current.firstElementChild;
      const scrollAmount = firstCard ? firstCard.offsetWidth + 14 : 260;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8">
      <div className="w-full">
        {/* Section Header Matching Screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-accent font-poppins text-xs font-bold">
                Most Popular
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-900 tracking-tight">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-inter">
              The highest-rated, repeat-ordered essentials across all 19,000+ Indian pincodes.
            </p>
          </div>

          <button
            onClick={() => scroll("right")}
            className="self-start sm:self-end inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300 hover:border-slate-800 text-slate-700 hover:text-slate-900 text-xs font-poppins font-bold transition-all shadow-2xs"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Carousel Container with 5 Cards Visible on Desktop */}
        <div className="relative group/carousel">
          {/* Left Arrow Button — hidden on mobile to avoid overflow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-accent hover:border-accent shadow-lg items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Right Arrow Button — hidden on mobile to avoid overflow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-accent hover:border-accent shadow-lg items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* 5-Cards Row (NO DESCRIPTION) */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-3.5 lg:gap-3.5 xl:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 px-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {BEST_SELLER_PRODUCTS.map((product) => {
              const isAdded = addedIds[product.id];
              const isInWishlist = wishlistItems.some((item) => item.id === product.id);

              return (
                <div
                  key={product.slug || product.id}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                  className="w-[165px] sm:w-[calc((100%-2*12px)/3)] md:w-[calc((100%-3*14px)/4)] lg:w-[calc((100%-4*14px)/5)] xl:w-[calc((100%-4*16px)/5)] flex-shrink-0 group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden hover:-translate-y-1 cursor-pointer"
                >
                  {/* Product Image Showcase */}
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Top-Left Badges: Rank Badge & Discount */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
                      {product.rank && (
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-poppins font-black text-[10px] flex items-center justify-center shadow-xs">
                          #{product.rank}
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded-md bg-accent text-white font-poppins font-black text-[9px] uppercase tracking-wider shadow-xs">
                        {product.discount}
                      </span>
                    </div>

                    {/* Top-Right Wishlist Button */}
                    <button
                      onClick={(e) => handleWishlistToggle(e, product)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 shadow-xs flex items-center justify-center transition-colors"
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

                  {/* Content (NO DESCRIPTION) */}
                  <div className="text-left space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating Line */}
                      <div className="flex items-center gap-1 text-[11px] font-poppins font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                      </div>

                      {/* Product Title */}
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
                        <span className="text-[11px] font-inter text-slate-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
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

                    {/* Add to Cart Button (Full Width) */}
                    <div className="pt-2">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={cn(
                          "w-full py-2 px-3 rounded-xl font-poppins font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95",
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-accent hover:bg-accent-hover text-white hover:shadow-md"
                        )}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Added</span>
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

export default CategorySpotlight;
