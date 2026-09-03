"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { formatCurrency } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Flame, Clock, ShoppingBag, Heart, ShieldCheck, Zap } from "lucide-react";

export function WholesaleDeals({ onSelectProduct }) {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

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

  const handleAddToCart = (product) => {
    dispatch(addItem(product));
    dispatch(setCartDrawerOpen(true));
  };

  const dealProducts = products.slice(0, 4);

  return (
    <section className="py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Deal Section Header with Live Timer */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-dark to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 font-poppins text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 fill-accent animate-pulse" />
                  Limited Time Bulk Savers
                </span>
                <span className="text-xs font-poppins font-medium text-slate-300 hidden sm:inline">
                  Factory Clearance Pricing
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-poppins font-black tracking-tight text-white">
                Today’s Top Wholesale Flash Deals
              </h2>
              <p className="text-xs text-slate-300 font-inter max-w-xl">
                Grab exclusive discounts across Electronics, Beauty, Home & Kitchen categories. Extra 5% off on bulk GST orders above ₹5,000.
              </p>
            </div>

            {/* Live Countdown Box */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl self-start lg:self-center">
              <div className="flex items-center gap-1.5 text-xs font-poppins font-semibold text-slate-200">
                <Clock className="w-4 h-4 text-accent" />
                <span>Ends In:</span>
              </div>
              <div className="flex items-center gap-1.5 font-poppins font-black text-sm">
                <span className="bg-slate-900 text-accent px-2.5 py-1 rounded-lg border border-slate-700 min-w-[32px] text-center shadow-inner">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-accent font-bold">:</span>
                <span className="bg-slate-900 text-accent px-2.5 py-1 rounded-lg border border-slate-700 min-w-[32px] text-center shadow-inner">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-accent font-bold">:</span>
                <span className="bg-slate-900 text-accent px-2.5 py-1 rounded-lg border border-slate-700 min-w-[32px] text-center shadow-inner">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Featured Deals Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((product, idx) => {
            const isInWishlist = wishlistItems.some((item) => item.id === product.id);
            const soldPercent = [78, 92, 65, 84][idx % 4];

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 relative"
              >
                {/* Badges */}
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
                  <Badge variant="coral" className="font-poppins font-black text-[10px] px-2.5 py-0.5 shadow-sm">
                    {product.discount || "50% OFF"}
                  </Badge>
                  <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-poppins font-bold text-[9px] px-2 py-0.5 rounded-full shadow-sm">
                    <Zap className="w-2.5 h-2.5 fill-white" /> FAST SHIP
                  </span>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => dispatch(toggleWishlist(product))}
                  className="absolute top-6 right-6 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 shadow-sm flex items-center justify-center transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isInWishlist ? "fill-rose-500 text-rose-500" : "text-slate-400"
                    }`}
                  />
                </button>

                {/* Image */}
                <div
                  className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-100 mb-4 cursor-pointer"
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-slate-400">
                      {product.category}
                    </span>
                    <h3
                      className="product-title cursor-pointer mt-0.5 line-clamp-2"
                      onClick={() => onSelectProduct && onSelectProduct(product)}
                    >
                      {product.name}
                    </h3>

                    {/* Stock Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-poppins font-semibold">
                        <span className="text-slate-500">Stock Claimed</span>
                        <span className="text-accent">{soldPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-accent rounded-full transition-all duration-1000"
                          style={{ width: `${soldPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="font-poppins font-black text-lg text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="font-inter text-xs text-slate-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="coral"
                    className="w-full gap-2 font-poppins font-bold text-xs shadow-md hover:scale-[1.02] active:scale-95 transition-all mt-2"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Claim Deal Now</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WholesaleDeals;
