"use client";

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setActiveCategoryNavId } from "@/store/slices/uiSlice";
import { Grid, Sparkles, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURED_ITEMS = [
  {
    slug: "just-arrived",
    label: "Just Arrived",
    icon: Sparkles,
    badge: "NEW",
    badgeColor: "bg-emerald-500 text-white",
    variant: "special",
  },
  {
    slug: "mega-sale",
    label: "Mega Sale",
    icon: Flame,
    badge: "HOT",
    badgeColor: "bg-rose-500 text-white",
    variant: "sale",
  },
];

export function CategoryNavBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const matched = FEATURED_ITEMS.find((item) => location.pathname === `/category/${item.slug}`);
    dispatch(setActiveCategoryNavId(matched ? matched.slug : null));
  }, [location.pathname, dispatch]);

  const handleNavClick = (slug) => {
    dispatch(setActiveCategoryNavId(slug));
    navigate(`/category/${slug}`);
  };

  const handleShopByCategoryClick = () => {
    if (location.pathname === "/") {
      const el = document.getElementById("shop-by-category-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 480, behavior: "smooth" });
      }
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="w-full bg-[#121f38] text-white border-b border-slate-800 shadow-sm transition-all">
      <div className="w-full px-4 sm:px-6 py-1.5 flex items-center gap-3 sm:gap-4">
        {/* 1. Shop By Category Button */}
        <button
          type="button"
          onClick={handleShopByCategoryClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs rounded-lg transition-all shadow-xs flex-shrink-0 cursor-pointer active:scale-95 group ml-4 sm:ml-10"
          title="Shop By Category"
        >
          <Grid className="w-3.5 h-3.5 text-white group-hover:rotate-90 transition-transform duration-300" />
          <span className="whitespace-nowrap">Shop By Category</span>
        </button>

        {/* 2. Subtle Divider */}
        <div className="h-4 w-px bg-white/20 mx-1 sm:mx-2 flex-shrink-0" />

        {/* 3. Featured Pills: Only Just Arrived and Mega Sale */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          {FEATURED_ITEMS.map((item) => {
            const itemSlug = item.slug;
            const isActive = location.pathname === `/category/${itemSlug}`;
            const Icon = item.icon;

            return (
              <button
                key={itemSlug}
                onClick={() => handleNavClick(itemSlug)}
                className={cn(
                  "group flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-poppins font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex-shrink-0 border",
                  isActive
                    ? "bg-white text-slate-900 border-white shadow-xs font-extrabold"
                    : item.variant === "special"
                    ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border-emerald-400/30 font-bold hover:scale-102"
                    : "bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 border-rose-500/30 font-bold hover:scale-102"
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-150 group-hover:scale-110",
                      isActive
                        ? "text-accent"
                        : item.variant === "special"
                        ? "text-emerald-300"
                        : "text-rose-400"
                    )}
                  />
                )}

                <span>{item.label}</span>

                {item.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider leading-none shadow-2xs",
                      item.badgeColor
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default CategoryNavBar;
