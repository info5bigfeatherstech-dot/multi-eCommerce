"use client";

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categorySlice";
import { setActiveFlyoutCategoryId, setCategorySidebarOpen } from "@/store/slices/uiSlice";
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

export function CategorySidebar({ isMobile = false, onClose }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: categories, status } = useAppSelector((state) => state.categories);

  const [hoveredId, setHoveredId] = useState(null);
  const [flyoutTop, setFlyoutTop] = useState(0);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  const activeCategoryObject = hoveredId
    ? categories.find((c) => c.slug === hoveredId || c.id === hoveredId)
    : null;

  const handleCategoryHover = (catSlug, e) => {
    setHoveredId(catSlug);
    dispatch(setActiveFlyoutCategoryId(catSlug));
    if (e?.currentTarget && sidebarRef.current) {
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const itemRect = e.currentTarget.getBoundingClientRect();
      let targetTop = itemRect.top - sidebarRect.top;

      // Ensure flyout stays comfortable within the screen
      const estimatedFlyoutHeight = 280;
      const viewportHeight = window.innerHeight;
      if (itemRect.top + estimatedFlyoutHeight > viewportHeight - 16) {
        const overflow = (itemRect.top + estimatedFlyoutHeight) - (viewportHeight - 16);
        targetTop = Math.max(0, targetTop - overflow);
      }

      setFlyoutTop(Math.max(0, Math.round(targetTop)));
    }
  };

  const handleCategoryClick = (catSlug) => {
    navigate(`/category/${catSlug}`);
    if (onClose) onClose();
    else dispatch(setCategorySidebarOpen(false));
  };

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "relative bg-white border border-slate-200/90 shadow-sm rounded-2xl flex flex-col justify-between overflow-visible z-30",
        isMobile ? "w-full shadow-none border-none" : "w-64 h-[440px] flex-shrink-0"
      )}
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* 1. DeoDap-Style Top Navy Header */}
      {!isMobile && (
        <div
          onMouseEnter={() => setHoveredId(null)}
          className="bg-[#121f38] text-white px-3.5 py-2.5 flex items-center justify-between flex-shrink-0 rounded-t-2xl"
        >
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-accent" />
            <span className="font-poppins font-bold text-xs uppercase tracking-wider">
              Shop By Category
            </span>
          </div>
        </div>
      )}

      {/* 2. Docked Category List (Fits evenly inside h-[440px]) */}
      <div className="p-1.5 flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between">
        {status === "loading" ? (
          <div className="p-2 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div key={n} className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-3" />
              </div>
            ))}
          </div>
        ) : (
          categories.map((category) => {
            const catSlug = category.slug || category.id;
            const IconComponent = iconMap[category.icon] || Package;
            const isActive = hoveredId === catSlug;

            return (
              <div
                key={catSlug}
                onMouseEnter={(e) => handleCategoryHover(catSlug, e)}
                onClick={() => handleCategoryClick(catSlug)}
                className={cn(
                  "group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors font-poppins text-xs font-medium",
                  isActive
                    ? "bg-rose-50 text-accent font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComponent
                    className={cn(
                      "w-3.5 h-3.5 flex-shrink-0 stroke-[1.8]",
                      isActive ? "text-accent" : "text-slate-500 group-hover:text-primary"
                    )}
                  />
                  <span className="truncate">{category.name}</span>
                </div>

                <ChevronRight
                  className={cn(
                    "w-3.5 h-3.5 flex-shrink-0 stroke-[2]",
                    isActive ? "text-accent" : "text-slate-300 group-hover:text-slate-500"
                  )}
                />
              </div>
            );
          })
        )}
      </div>

      {/* 3. Bottom Button: View All Categories */}
      <div
        onMouseEnter={() => setHoveredId(null)}
        className="p-1.5 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl flex-shrink-0"
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
            setTimeout(() => {
              const el = document.getElementById("shop-by-category-section");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              } else {
                window.scrollTo({ top: 450, behavior: "smooth" });
              }
            }, 100);
            if (onClose) onClose();
            else dispatch(setCategorySidebarOpen(false));
          }}
          className="flex items-center gap-2 w-full py-1.5 px-2.5 rounded-lg hover:bg-slate-200/60 text-slate-800 font-poppins text-xs font-bold transition-all text-left cursor-pointer"
        >
          <Grid className="w-3.5 h-3.5 text-accent" />
          <span>View All Categories</span>
        </button>
      </div>

      {/* 4. Desktop Floating Submenu Flyout (Only when category is hovered) */}
      {!isMobile && hoveredId && activeCategoryObject && (
        <CategoryFlyout category={activeCategoryObject} top={flyoutTop} onClose={onClose} />
      )}
    </div>
  );
}

export default CategorySidebar;
