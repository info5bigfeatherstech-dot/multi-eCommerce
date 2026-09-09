"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { formatCurrency, cn } from "@/lib/utils";
import { notifyAddToCart, notifyWishlist } from "@/lib/notify";
import {
  Flame,
  Clock,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  Truck,
  Heart,
} from "lucide-react";

const FEATURED_DEALS = [
  {
    id: "deal-spice-dispenser",
    slug: "rotating-spice-dispenser",
    name: "360° Rotating Multi-Grid Kitchen Spice & Grain Dispenser",
    category: "KITCHEN DINING",
    description: "Airtight, moisture-proof food grade storage with one-touch measurement dispenser.",
    price: 599,
    originalPrice: 1499,
    discount: "60% OFF",
    saveAmount: "Save ₹900",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-tws-earbuds",
    slug: "dual-driver-tws-earbuds",
    name: "Dual Driver Ultra Bass TWS Wireless Earbuds with ENC",
    category: "ELECTRONICS GADGETS",
    description: "50-hour playback, instant quad-mic clear calling, IPX5 sweat resistance with low latency gaming mode.",
    price: 799,
    originalPrice: 2899,
    discount: "73% OFF",
    saveAmount: "Save ₹2,200",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-brass-diya",
    slug: "brass-peacock-diya-set",
    name: "Pure Brass Handcrafted Peacock Diya & Urli Set",
    category: "HOME DECOR",
    description: "Solid brass traditional carving for festive puja room, living decor and Diwali gifting.",
    price: 849,
    originalPrice: 1999,
    discount: "58% OFF",
    saveAmount: "Save ₹1,150",
    imageUrl: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-veg-chopper",
    slug: "12-in-1-veg-chopper",
    name: "12-in-1 Ultra Sharp Vegetable & Fruit Chopper with Catch Tray",
    category: "KITCHEN DINING",
    description: "Stainless steel rust-resistant blades, anti-skid base with hand protector safety guard.",
    price: 389,
    originalPrice: 1299,
    discount: "70% OFF",
    saveAmount: "Save ₹910",
    imageUrl: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-wireless-dock",
    slug: "4-in-1-wireless-dock",
    name: "4-in-1 Magnetic Fast Wireless Charging Dock with Night Lamp",
    category: "ELECTRONICS GADGETS",
    description: "15W wireless fast charging station for phone, smartwatch and earbuds with ambient light.",
    price: 699,
    originalPrice: 2499,
    discount: "72% OFF",
    saveAmount: "Save ₹1,800",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-thermal-flask",
    slug: "thermal-flask-750ml",
    name: "Double-Wall Vacuum Insulated Stainless Steel Thermal Flask 750ml",
    category: "KITCHEN DINING",
    description: "24-hour hot & cold temperature retention with leakproof condensation-free exterior.",
    price: 349,
    originalPrice: 999,
    discount: "65% OFF",
    saveAmount: "Save ₹650",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-facial-brush",
    slug: "sonic-facial-brush",
    name: "Sonic Facial Cleansing Brush & Silicone Exfoliator",
    category: "BEAUTY & PERSONAL CARE",
    description: "Waterproof IPX7 sonic vibration with heated massage modes for deep pore cleansing.",
    price: 449,
    originalPrice: 1499,
    discount: "70% OFF",
    saveAmount: "Save ₹1,050",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    id: "deal-ultrapods",
    slug: "transparent-ultrapods-max-tws",
    name: "Transparent Ultrapods Max TWS Earbuds with LED Display",
    category: "ELECTRONICS GADGETS",
    description: "Crystal clear ENC calling with futuristic neon LED battery casing and USB-C quick charge.",
    price: 499,
    originalPrice: 1599,
    discount: "68% OFF",
    saveAmount: "Save ₹1,100",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
];

export function WholesaleDeals({ onSelectProduct }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [timeLeft, setTimeLeft] = useState({ hours: 10, minutes: 24, seconds: 45 });
  const [addedIds, setAddedIds] = useState({});
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addItem(product));
    notifyAddToCart(product, {
      onOpenCart: () => dispatch(setCartDrawerOpen(true)),
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1300);
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
        {/* Header with Countdown Timer */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              
              <span className="text-xs font-poppins font-medium text-slate-500 hidden sm:inline">
                Direct Factory Liquidation Rates
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-900 tracking-tight">
              Today’s Top Wholesale Flash Deals
            </h2>
          </div>

          {/* Live Countdown Timer */}
          <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-sm border border-slate-800 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 text-xs font-poppins font-bold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-accent animate-spin-slow" />
              <span>Ends In:</span>
            </div>
            <div className="flex items-center gap-1 font-poppins font-black text-xs text-accent">
              <span className="bg-slate-800 px-2 py-0.5 rounded-md min-w-[24px] text-center border border-slate-700">
                {String(timeLeft.hours).padStart(2, "0")}h
              </span>
              <span>:</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded-md min-w-[24px] text-center border border-slate-700">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
              <span>:</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded-md min-w-[24px] text-center border border-slate-700">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Container with Left/Right Arrows */}
        <div className="relative group/carousel">
          {/* Left Arrow Button — hidden on mobile to avoid negative-margin overflow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-accent hover:border-accent shadow-lg items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Right Arrow Button — hidden on mobile to avoid negative-margin overflow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-accent hover:border-accent shadow-lg items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Horizontal Scrollable Deals Track: EXACTLY 5 PRODUCTS SHOWN AT A TIME ON DESKTOP */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-3.5 lg:gap-3.5 xl:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 px-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {FEATURED_DEALS.map((deal) => {
              const isAdded = addedIds[deal.id];
              const isInWishlist = wishlistItems.some(
                (item) =>
                  (item.slug && deal.slug && item.slug === deal.slug) ||
                  (item.id && deal.id && item.id === deal.id)
              );

              return (
                <div
                  key={deal.slug || deal.id}
                  onClick={() => onSelectProduct && onSelectProduct(deal)}
                  className="w-[165px] sm:w-[calc((100%-2*12px)/3)] md:w-[calc((100%-3*14px)/4)] lg:w-[calc((100%-4*14px)/5)] xl:w-[calc((100%-4*16px)/5)] flex-shrink-0 group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden hover:-translate-y-1 cursor-pointer"
                >
                  {/* Image Container with Rounded Corners & Dual Badges */}
                  <div className="relative w-full aspect-[16/11] sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                    <img
                      src={deal.imageUrl}
                      alt={deal.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Dual Badges: Orange Discount + Dark Deal of the Day */}
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded-md bg-accent text-white font-poppins font-black text-[9px] uppercase tracking-wider shadow-xs">
                        {deal.discount}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-900/95 text-white font-poppins font-bold text-[9px] shadow-xs">
                        Deal of the Day
                      </span>
                    </div>

                    {/* Top-Right Wishlist / Like Button */}
                    <button
                      onClick={(e) => handleWishlistToggle(e, deal)}
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

                  {/* Content (NO DESCRIPTION) */}
                  <div className="text-left space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating Line */}
                      <div className="flex items-center gap-1 text-[11px] font-poppins font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>4.8</span>
                        <span className="text-slate-400 font-normal">(1,240)</span>
                      </div>

                      <h3
                        title={deal.name}
                        className="font-poppins font-bold text-xs sm:text-[13px] text-slate-800 leading-snug line-clamp-2 mt-0.5 group-hover:text-accent transition-colors min-h-[34px]"
                      >
                        {deal.name}
                      </h3>

                      {/* Price Row */}
                      <div className="flex items-baseline gap-1.5 pt-1">
                        <span className="text-base sm:text-lg font-poppins font-black text-accent">
                          {formatCurrency(deal.price)}
                        </span>
                        <span className="text-[11px] font-inter text-slate-400 line-through">
                          {formatCurrency(deal.originalPrice)}
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

                    {/* Full-Width Add to Cart / Grab Deal Button */}
                    <div className="pt-2">
                      <button
                        onClick={(e) => handleAddToCart(e, deal)}
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

export default WholesaleDeals;
