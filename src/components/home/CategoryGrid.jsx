"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { ArrowRight, Sparkles, Layers, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const fallbackImageMap = {
  "home-living": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
  "kitchen-dining": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
  "electronics-gadgets": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  "beauty-personal-care": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
  "sports-fitness": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
  "jewellery-accessories": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
  "home-decor": "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80",
  "stationery-office-school": "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",
  "gifts-lifestyle": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
  "travel-outdoor": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
  "mix-items": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
};

const tagMap = {
  "home-living": "Popular",
  "kitchen-dining": "Best Value",
  "electronics-gadgets": "Top Tech",
  "beauty-personal-care": "Trending",
  "sports-fitness": "Fitness",
  "jewellery-accessories": "Bestseller",
  "home-decor": "Aesthetic",
  "stationery-office-school": "Office",
  "gifts-lifestyle": "Gifting",
  "travel-outdoor": "Outdoor",
  "mix-items": "Bulk Deals",
};

export function CategoryGrid({ onSelectCategory }) {
  const categories = useAppSelector((state) => state.categories.items);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (slug) => {
    setImageErrors((prev) => ({ ...prev, [slug]: true }));
  };

  return (
    <section className="py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-accent">
                Explore Collections
              </span>
              
            </div>
            <h2 className="section-title text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              Shop By Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-inter mt-1">
              Direct factory pricing & wholesale rates across curated collections
            </p>
          </div>

          <button
            onClick={() => onSelectCategory && onSelectCategory("all")}
            className="self-start sm:self-end flex items-center gap-1.5 text-xs font-poppins font-bold text-accent hover:text-accent-hover group transition-colors"
          >
            <span>View All Departments</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Visual Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((cat) => {
            const slug = cat.slug || cat.id;
            const imgSrc =
              (!imageErrors[slug] && (cat.imageUrl || fallbackImageMap[slug])) ||
              fallbackImageMap[slug] ||
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80";

            const tag = cat.tag || tagMap[slug] || "Wholesale";

            return (
              <div
                key={slug}
                onClick={() => onSelectCategory && onSelectCategory(slug)}
                className="group relative rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden hover:-translate-y-1"
              >
                {/* Image Showcase Container */}
                <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-slate-100">
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    onError={() => handleImageError(slug)}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Overlay for visual polish */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

                  {/* Top Tag Pill */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-poppins font-bold text-slate-800 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {tag}
                  </span>

                  {/* Item Count floating pill */}
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-inter font-semibold text-white">
                    {cat.itemCount ? `${cat.itemCount.toLocaleString()}+ Items` : "In Stock"}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <h3
                      title={cat.name}
                      className="font-poppins font-bold text-sm text-slate-800 line-clamp-1 group-hover:text-accent transition-colors"
                    >
                      {cat.name}
                    </h3>
                    <p className="font-inter text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {cat.subCategories && cat.subCategories.length > 0
                        ? cat.subCategories
                            .map((s) => s.name.split(" ")[0])
                            .slice(0, 2)
                            .join(", ") + " & more"
                        : "Wholesale Selection"}
                    </p>
                  </div>

                  {/* Hover footer action */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-poppins font-semibold text-slate-400 group-hover:text-accent transition-colors">
                      {cat.subCategories ? `${cat.subCategories.length} Sub-types` : "View All"}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 12th Card: Balanced Grid Highlight to Complete 6x2 Layout */}
          <div
            onClick={() => onSelectCategory && onSelectCategory("all")}
            className="group relative rounded-2xl bg-gradient-to-br from-primary via-primary-light to-primary text-white p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1 border border-primary-light/40"
          >
            {/* Background Glow */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-accent/20 blur-2xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                <Layers className="w-5 h-5" />
              </div>
              <span className="inline-block text-[10px] font-poppins font-bold uppercase tracking-wider text-accent">
                Complete Catalog
              </span>
              <h3 className="font-poppins font-extrabold text-base text-white leading-tight">
                All 20,000+ Items
              </h3>
              <p className="text-[11px] text-slate-300 font-inter leading-relaxed">
                Explore all 11 wholesale departments with zero MOQ.
              </p>
            </div>

            <div className="relative z-10 mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-poppins font-bold text-accent group-hover:text-white transition-colors">
                Browse All
              </span>
              <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300 shadow-sm">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
