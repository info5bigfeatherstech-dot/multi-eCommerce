"use client";

import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categorySlice";
import { toggleCategorySidebar, setActiveCategoryNavId } from "@/store/slices/uiSlice";
import {
  Grid,
  ChevronDown,
  Sparkles,
  Flame,
} from "lucide-react";
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

const CATEGORY_DISPLAY_NAMES = {
  "home-living": "Home & Living",
  "kitchen-dining": "Kitchen & Dining",
  "electronics-gadgets": "Electronics & Gadgets",
  "beauty-personal-care": "Beauty & Personal Care",
  "sports-fitness": "Sports & Fitness",
  "jewellery-accessories": "Jewellery & Accessories",
  "jewellery-acc": "Jewellery & Accessories",
  "home-decor": "Home Decor",
  "stationery-office-school": "Stationery, Office & School",
  "stationery-office": "Stationery, Office & School",
  "gifts-lifestyle": "Gifts & Lifestyle",
  "travel-outdoor": "Travel & Outdoor",
  "mix-items": "Mix Items",
};

const ALL_CATEGORIES = [
  { slug: "home-living", name: "Home & Living" },
  { slug: "kitchen-dining", name: "Kitchen & Dining" },
  { slug: "electronics-gadgets", name: "Electronics & Gadgets" },
  { slug: "beauty-personal-care", name: "Beauty & Personal Care" },
  { slug: "sports-fitness", name: "Sports & Fitness" },
  { slug: "jewellery-accessories", name: "Jewellery & Accessories" },
  { slug: "home-decor", name: "Home Decor" },
  { slug: "stationery-office-school", name: "Stationery, Office & School" },
  { slug: "gifts-lifestyle", name: "Gifts & Lifestyle" },
  { slug: "travel-outdoor", name: "Travel & Outdoor" },
  { slug: "mix-items", name: "Mix Items" },
];

export function CategoryNavBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);
  const { items: categories, status } = useAppSelector((state) => state.categories);
  const { isCategorySidebarOpen } = useAppSelector((state) => state.ui);

  // Derive active category directly from current route URL
  const categoryMatch = location.pathname.match(/^\/category\/([^/]+)/);
  const activeCategoryNavId = categoryMatch ? categoryMatch[1] : null;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  useEffect(() => {
    dispatch(setActiveCategoryNavId(activeCategoryNavId));
  }, [activeCategoryNavId, dispatch]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleNavClick = (slug) => {
    dispatch(setActiveCategoryNavId(slug));
    navigate(`/category/${slug}`);
  };

  const displayCategories =
    categories && categories.length > 0 ? categories : ALL_CATEGORIES;

  return (
    <nav className="w-full bg-[#121f38] text-white border-b border-slate-800 shadow-sm transition-all">
      <div className="w-full px-2 sm:px-3 py-1 flex items-center gap-1 sm:gap-2">
          
          {/* Shop By Category Button UI Component */}
          <button
            onClick={() => dispatch(toggleCategorySidebar())}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs rounded-lg transition-all shadow-xs flex-shrink-0 cursor-pointer active:scale-95 group",
              isCategorySidebarOpen && "ring-1 ring-white/40 shadow-sm"
            )}
          >
            <Grid className="w-3.5 h-3.5 text-white group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Shop By Category</span>
            <span className="sm:hidden">Categories</span>
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-transform duration-300 text-white",
                isCategorySidebarOpen && "rotate-180"
              )}
            />
          </button>

          {/* Category Navigation Links */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto no-scrollbar py-0.5 flex items-center gap-0.5 xl:gap-1 scroll-smooth"
          >
            {/* Featured Highlight Pills (Just Arrived & Mega Sale - unchanged style, compact spacing) */}
            {FEATURED_ITEMS.map((item) => {
              const itemSlug = item.slug;
              const isActive = activeCategoryNavId === itemSlug;
              const Icon = item.icon;

              return (
                <button
                  key={itemSlug}
                  onClick={() => handleNavClick(itemSlug)}
                  className={cn(
                    "group flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-poppins font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 border",
                    isActive
                      ? "bg-white text-slate-900 border-white shadow-md ring-2 ring-white/30 font-extrabold scale-102"
                      : item.variant === "special"
                      ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border-emerald-400/40 font-bold hover:scale-102"
                      : "bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 border-rose-500/40 font-bold hover:scale-102"
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110",
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
                        "ml-0.5 px-1 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider leading-none shadow-2xs",
                        item.badgeColor
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Subtle Vertical Divider */}
            <div className="h-3.5 w-px bg-white/20 mx-0.5 flex-shrink-0" />

            {/* Normal Category Links for All Departments */}
            {displayCategories.map((cat) => {
              const catSlug = cat.slug || cat.id;
              const isActive =
                Boolean(activeCategoryNavId) &&
                (activeCategoryNavId === catSlug ||
                  (catSlug === "jewellery-accessories" && activeCategoryNavId === "jewellery-acc") ||
                  (catSlug === "stationery-office-school" && activeCategoryNavId === "stationery-office"));
              const displayName = CATEGORY_DISPLAY_NAMES[catSlug] || cat.name;

              return (
                <button
                  key={catSlug}
                  onClick={() => handleNavClick(catSlug)}
                  className={cn(
                    "px-1.5 xl:px-2 py-1 text-[11px] xl:text-xs font-poppins font-medium whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 rounded",
                    isActive
                      ? "bg-white/20 text-white font-bold"
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                  )}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

        </div>
      </nav>
  );
}

export default CategoryNavBar;
