"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categorySlice";
import { setActiveFlyoutCategoryId } from "@/store/slices/uiSlice";
import CategoryFlyout from "./CategoryFlyout";
import Skeleton from "@/components/ui/Skeleton";
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
  ChevronRight,
  Grid,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
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
};

export function CategorySidebar({ isMobile = false }) {
  const dispatch = useAppDispatch();
  const { items: categories, status } = useAppSelector((state) => state.categories);
  const { activeFlyoutCategoryId } = useAppSelector((state) => state.ui);

  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  // Robust active category selection using proper slug
  const currentActiveSlug =
    hoveredId ||
    activeFlyoutCategoryId ||
    (categories[0] && (categories[0].slug || categories[0].id)) ||
    "home-living";

  const activeCategoryObject =
    categories.find((c) => c.slug === currentActiveSlug || c.id === currentActiveSlug) || categories[0];

  const handleCategoryHover = (catSlug) => {
    setHoveredId(catSlug);
    dispatch(setActiveFlyoutCategoryId(catSlug));
  };

  return (
    <div
      className={cn(
        "relative bg-white border border-slate-200/80 shadow-md rounded-2xl flex flex-col justify-between overflow-visible z-30",
        isMobile ? "w-full shadow-none border-none" : "w-64 flex-shrink-0"
      )}
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* Seamless Docked Category List (No duplicate header) */}
      <div className="p-2 space-y-0.5">
        {status === "loading" ? (
          <div className="p-2 space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div key={n} className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-3" />
              </div>
            ))}
          </div>
        ) : (
          categories.map((category) => {
            const catSlug = category.slug || category.id;
            const IconComponent = iconMap[category.icon] || Package;
            const isActive =
              activeCategoryObject &&
              (activeCategoryObject.slug === catSlug || activeCategoryObject.id === catSlug);

            return (
              <div
                key={catSlug}
                onMouseEnter={() => handleCategoryHover(catSlug)}
                onClick={() => handleCategoryHover(category.id)}
                className={cn(
                  "group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors font-poppins text-xs font-medium",
                  isActive
                    ? "bg-rose-50 text-accent font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <IconComponent
                    className={cn(
                      "w-4 h-4 stroke-[1.8]",
                      isActive ? "text-accent" : "text-slate-500 group-hover:text-primary"
                    )}
                  />
                  <span className="line-clamp-1">{category.name}</span>
                </div>

                <ChevronRight
                  className={cn(
                    "w-3.5 h-3.5 stroke-[2]",
                    isActive ? "text-accent" : "text-slate-300 group-hover:text-slate-500"
                  )}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Button: View All Categories */}
      <div className="p-2 border-t border-slate-100">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 w-full py-2 px-3 rounded-xl hover:bg-slate-100 text-slate-800 font-poppins text-xs font-bold transition-all"
        >
          <Grid className="w-4 h-4 text-slate-700" />
          <span>View All Categories</span>
        </a>
      </div>

      {/* Desktop Floating Submenu Flyout */}
      {!isMobile && activeCategoryObject && (
        <CategoryFlyout category={activeCategoryObject} />
      )}
    </div>
  );
}

export default CategorySidebar;
