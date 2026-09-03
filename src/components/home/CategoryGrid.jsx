"use client";

import React from "react";
import { useAppSelector } from "@/store/hooks";
import {
  Home,
  Utensils,
  Smartphone,
  Sparkles,
  Dumbbell,
  Gem,
  Palette,
  FileText,
  Gift,
  Compass,
  Package,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIconMap = {
  "cat-home-living": Home,
  "cat-kitchen-dining": Utensils,
  "cat-electronics-gadgets": Smartphone,
  "cat-beauty-personal-care": Sparkles,
  "cat-sports-fitness": Dumbbell,
  "cat-jewellery-accessories": Gem,
  "cat-home-decor": Palette,
  "cat-stationery-office-school": FileText,
  "cat-gifts-lifestyle": Gift,
  "cat-travel-outdoor": Compass,
  "cat-mix-items": Package,
};

const categoryColorMap = {
  "cat-home-living": "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/60",
  "cat-kitchen-dining": "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/60",
  "cat-electronics-gadgets": "from-blue-500/10 to-cyan-500/10 text-blue-600 border-blue-200/60",
  "cat-beauty-personal-care": "from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-200/60",
  "cat-sports-fitness": "from-violet-500/10 to-purple-500/10 text-violet-600 border-violet-200/60",
  "cat-jewellery-accessories": "from-indigo-500/10 to-blue-500/10 text-indigo-600 border-indigo-200/60",
  "cat-home-decor": "from-fuchsia-500/10 to-pink-500/10 text-fuchsia-600 border-fuchsia-200/60",
  "cat-stationery-office-school": "from-sky-500/10 to-blue-500/10 text-sky-600 border-sky-200/60",
  "cat-gifts-lifestyle": "from-coral-500/10 to-rose-500/10 text-accent border-rose-200/60",
  "cat-travel-outdoor": "from-teal-500/10 to-emerald-500/10 text-teal-600 border-teal-200/60",
  "cat-mix-items": "from-slate-500/10 to-zinc-500/10 text-slate-700 border-slate-200/60",
};

export function CategoryGrid({ onSelectCategory }) {
  const categories = useAppSelector((state) => state.categories.items);

  return (
    <section className="py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-poppins font-bold uppercase tracking-wider text-accent">
              Explore Collections
            </span>
            <h2 className="section-title text-2xl md:text-3xl font-extrabold text-slate-900 mt-0.5">
              Shop By Category
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-inter max-w-md">
            Browse our top 11 wholesale product categories with factory prices & instant GST invoicing.
          </p>
        </div>

        {/* 11 Categories Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => {
            const IconComp = categoryIconMap[cat.id] || Package;
            const colorStyles = categoryColorMap[cat.id] || "from-slate-50 to-slate-100 text-slate-700 border-slate-200";

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                className={cn(
                  "group relative p-4 rounded-2xl bg-white border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden",
                  colorStyles.split(" ").slice(-1)[0] // border color
                )}
              >
                {/* Background Accent Glow */}
                <div
                  className={cn(
                    "absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-gradient-to-br opacity-50 group-hover:scale-150 transition-transform duration-500",
                    colorStyles.split(" ").slice(0, 2).join(" ")
                  )}
                />

                <div className="relative z-10 space-y-3">
                  {/* Icon Box */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br transition-transform group-hover:scale-110 duration-300",
                      colorStyles.split(" ").slice(0, 3).join(" ")
                    )}
                  >
                    <IconComp className="w-5 h-5 stroke-[2]" />
                  </div>

                  {/* Text Content */}
                  <div>
                    <h3 className="font-poppins font-bold text-sm text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="font-inter text-[11px] text-slate-400 mt-0.5 font-medium">
                      {cat.itemCount ? `${cat.itemCount.toLocaleString()}+ Items` : "Explore Catalog"}
                    </p>
                  </div>
                </div>

                {/* Subcategories pill & hover arrow */}
                <div className="relative z-10 mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-poppins font-semibold text-slate-400 group-hover:text-accent transition-colors">
                    {cat.subCategories ? `${cat.subCategories.length} Sub-types` : "View All"}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
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

export default CategoryGrid;
