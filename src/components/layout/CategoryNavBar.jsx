"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categorySlice";
import { toggleCategorySidebar, setActiveCategoryNavId } from "@/store/slices/uiSlice";
import { Grid, ChevronDown } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { slug: "just-arrived", label: "Just Arrived", isFeatured: true },
  { slug: "under-99", label: "⚡ Under ₹99 Store", isFeatured: true },
  { slug: "mega-sale", label: "🔥 Mega Sale", isFeatured: true },
  { slug: "home-living", label: "Home & Living", isFeatured: false },
  { slug: "kitchen-dining", label: "Kitchen & Dining", isFeatured: false },
  { slug: "electronics-gadgets", label: "Electronics & Gadgets", isFeatured: false },
  { slug: "beauty-care", label: "Beauty & Personal Care", isFeatured: false },
  { slug: "sports-fitness", label: "Sports & Fitness", isFeatured: false },
  { slug: "jewellery-acc", label: "Jewellery & Accessories", isFeatured: false },
  { slug: "home-decor", label: "Home Decor", isFeatured: false },
  { slug: "stationery-office", label: "Stationery, Office & School", isFeatured: false },
  { slug: "gifts-lifestyle", label: "Gifts & Lifestyle", isFeatured: false },
  { slug: "travel-outdoor", label: "Travel & Outdoor", isFeatured: false },
  { slug: "mix-items", label: "Mix Items", isFeatured: false },
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
    <div className="w-full max-w-[1600px] mx-auto px-4 py-1">
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
              const itemSlug = item.slug || item.id;
              const isActive = activeCategoryNavId === itemSlug;
              return (
                <button
                  key={itemSlug}
                  onClick={() => dispatch(setActiveCategoryNavId(itemSlug))}
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

          {/* More Categories Shadcn Dropdown */}
          <div className="flex-shrink-0 py-1">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1 text-xs font-poppins font-bold text-slate-200 hover:text-accent rounded-lg hover:bg-white/10 transition-colors focus:outline-none cursor-pointer">
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 max-h-80 overflow-y-auto">
                <DropdownMenuLabel>All Departments</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((cat) => {
                  const catSlug = cat.slug || cat.id;
                  return (
                    <DropdownMenuItem
                      key={catSlug}
                      onClick={() => dispatch(setActiveCategoryNavId(catSlug))}
                      className="cursor-pointer flex items-center justify-between py-1.5"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400">{cat.itemCount || "100+"}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      </nav>
    </div>
  );
}

export default CategoryNavBar;
