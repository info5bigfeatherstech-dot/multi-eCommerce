"use client";

import React from "react";
import { ArrowRight, Sparkles, Smartphone, Home, Gift } from "lucide-react";

export function PromoBanners({ onSelectCategory }) {
  const promoItems = [
    {
      id: "electronics",
      categorySlug: "electronics-gadgets",
      badge: "TECH & SMART GADGETS",
      title: "Next-Gen Electronics & Accessories",
      subtitle: "Earbuds, Smartwatches & Chargers at factory prices",
      cta: "Explore Electronics",
      bgGradient: "from-slate-900 via-indigo-950 to-slate-950",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      icon: Smartphone,
      accentColor: "text-cyan-400",
    },
    {
      id: "home-living",
      categorySlug: "home-decor",
      badge: "MODERN LIVING",
      title: "Elevate Your Space with Home Decor",
      subtitle: "Wall art, lamps, vases & cozy aesthetic living essentials",
      cta: "Browse Home Decor",
      bgGradient: "from-slate-900 via-rose-950 to-slate-950",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      icon: Home,
      accentColor: "text-rose-400",
    },
    {
      id: "gifts",
      categorySlug: "gifts-lifestyle",
      badge: "SPECIAL OCCASIONS",
      title: "Curated Gifts & Premium Lifestyle",
      subtitle: "Personalized hampers, party decor & novelty products",
      cta: "Shop Gift Hampers",
      bgGradient: "from-slate-900 via-amber-950 to-slate-950",
      image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80",
      icon: Gift,
      accentColor: "text-amber-400",
    },
  ];

  return (
    <section className="py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onSelectCategory && onSelectCategory(item.categorySlug)}
                className={`group relative rounded-3xl overflow-hidden bg-gradient-to-br ${item.bgGradient} p-6 md:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-white/10 flex flex-col justify-between min-h-[300px]`}
              >
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0 opacity-30 group-hover:opacity-40 transition-opacity duration-500">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 font-poppins text-[10px] font-extrabold uppercase tracking-widest text-slate-100">
                    <IconComponent className={`w-3.5 h-3.5 ${item.accentColor}`} />
                    {item.badge}
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-300 opacity-80" />
                </div>

                {/* Main Content */}
                <div className="relative z-10 space-y-3 mt-12">
                  <h3 className="font-poppins font-black text-xl md:text-2xl leading-tight text-white group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-inter text-xs text-slate-300 line-clamp-2">
                    {item.subtitle}
                  </p>

                  <div className="pt-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs shadow-md group-hover:translate-x-1 transition-all">
                      <span>{item.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PromoBanners;
