"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categorySlice";
import { toggleCategorySidebar, setActiveCategoryNavId } from "@/store/slices/uiSlice";
import { Grid, ChevronDown } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "just-arrived", label: "Just Arrived", isFeatured: true },
  { id: "home-living", label: "Home & Living", isFeatured: false },
  { id: "kitchen-dining", label: "Kitchen & Dining", isFeatured: false },
  { id: "electronics-gadgets", label: "Electronics & Gadgets", isFeatured: false },
  { id: "beauty-care", label: "Beauty & Personal Care", isFeatured: false },
  { id: "sports-fitness", label: "Sports & Fitness", isFeatured: false },
  { id: "jewellery-acc", label: "Jewellery & Accessories", isFeatured: false },
  { id: "home-decor", label: "Home Decor", isFeatured: false },
  { id: "stationery-office", label: "Stationery, Office & School", isFeatured: false },
  { id: "gifts-lifestyle", label: "Gifts & Lifestyle", isFeatured: false },
  { id: "travel-outdoor", label: "Travel & Outdoor", isFeatured: false },
  { id: "mix-items", label: "Mix Items", isFeatured: false },
];

export function CategoryNavBar() {
  const dispatch = useAppDispatch();
  const { items: categories, status } = useAppSelector((state) => state.categories);
  const { isCategorySidebarOpen, activeCategoryNavId } = useAppSelector(
    (state) => state.ui
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-1 select-none">
      <nav className="bg-primary text-white rounded-xl shadow-sm border border-primary-light/40 px-3">
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Shop By Category Trigger Button */}
          <button
            onClick={() => dispatch(toggleCategorySidebar())}
            className={cn(
              "flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs rounded-lg transition-all shadow-sm flex-shrink-0 my-1",
              isCategorySidebarOpen && "ring-2 ring-white/30"
            )}
          >
            <Grid className="w-4 h-4 text-white" />
            <span>Shop By Category</span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-300 ml-1 text-white",
                isCategorySidebarOpen && "rotate-180"
              )}
            />
          </button>

          {/* Horizontal Scrollable Top Category Links */}
          <div className="flex-1 overflow-x-auto no-scrollbar py-1.5 flex items-center gap-1 sm:gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeCategoryNavId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => dispatch(setActiveCategoryNavId(item.id))}
                  className={cn(
                    "px-3 py-1 text-xs font-poppins font-semibold whitespace-nowrap transition-colors relative",
                    item.isFeatured
                      ? "text-accent font-bold"
                      : isActive
                      ? "text-accent font-bold"
                      : "text-slate-100 hover:text-accent"
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full animate-fadeIn" />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </nav>
    </div>
  );
}

export default CategoryNavBar;
