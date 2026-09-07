"use client";

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categorySlice";
import { toggleCategorySidebar, setActiveCategoryNavId } from "@/store/slices/uiSlice";
import {
  Grid,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Flame,
  Home,
  Utensils,
  Smartphone,
  Heart,
  Activity,
  Gem,
  Palette,
  BookOpen,
  Gift,
  Compass,
  Layers,
} from "lucide-react";
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
  {
    slug: "just-arrived",
    label: "Just Arrived",
    icon: Sparkles,
    badge: "NEW",
    badgeColor: "bg-emerald-500 text-white",
    variant: "special",
  },
  {
    slug: "under-99",
    label: "Under ₹99 Store",
    icon: Zap,
    badge: "₹99",
    badgeColor: "bg-amber-400 text-slate-900",
    variant: "highlight",
  },
  {
    slug: "mega-sale",
    label: "Mega Sale",
    icon: Flame,
    badge: "HOT",
    badgeColor: "bg-rose-500 text-white",
    variant: "sale",
  },
  {
    slug: "home-living",
    label: "Home & Living",
    icon: Home,
  },
  {
    slug: "kitchen-dining",
    label: "Kitchen & Dining",
    icon: Utensils,
  },
  // {
  //   slug: "electronics-gadgets",
  //   label: "Electronics",
  //   icon: Smartphone,
  // },
  // {
  //   slug: "beauty-care",
  //   label: "Beauty & Care",
  //   icon: Heart,
  // },
  // {
  //   slug: "sports-fitness",
  //   label: "Sports & Fitness",
  //   icon: Activity,
  // },
  {
    slug: "jewellery-acc",
    label: "Jewellery",
    icon: Gem,
  },
  {
    slug: "home-decor",
    label: "Home Decor",
    icon: Palette,
  },
  {
    slug: "stationery-office",
    label: "Stationery",
    icon: BookOpen,
  },
  // {
  //   slug: "gifts-lifestyle",
  //   label: "Gifts",
  //   icon: Gift,
  // },
  // {
  //   slug: "travel-outdoor",
  //   label: "Travel & Outdoor",
  //   icon: Compass,
  // },
  // {
  //   slug: "mix-items",
  //   label: "Clearance",
  //   icon: Layers,
  //   badge: "DEALS",
  //   badgeColor: "bg-purple-500 text-white",
  // },
];

export function CategoryNavBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const { items: categories, status } = useAppSelector((state) => state.categories);
  const { isCategorySidebarOpen, activeCategoryNavId } = useAppSelector(
    (state) => state.ui
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  const handleNavClick = (slug) => {
    dispatch(setActiveCategoryNavId(slug));
    navigate(`/category/${slug}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-1">
      <nav className="bg-primary text-white rounded-2xl shadow-md border border-primary-light/40 px-2 sm:px-3 py-1.5 transition-all">
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Shop By Category Button UI Component */}
          <button
            onClick={() => dispatch(toggleCategorySidebar())}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs rounded-xl transition-all shadow-sm flex-shrink-0 cursor-pointer active:scale-95 group",
              isCategorySidebarOpen && "ring-2 ring-white/40 shadow-md"
            )}
          >
            <Grid className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Shop By Category</span>
            <span className="sm:hidden">Categories</span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-300 text-white",
                isCategorySidebarOpen && "rotate-180"
              )}
            />
          </button>

          {/* Left Arrow Scroll Button */}
          {/* <button
            onClick={() => scroll("left")}
            aria-label="Scroll categories left"
            className="hidden lg:flex w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-all flex-shrink-0 cursor-pointer border border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button> */}

          {/* Horizontal Scrollable Category Pills UI Components */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto no-scrollbar py-0.5 flex items-center gap-1.5 sm:gap-2 scroll-smooth"
          >
            {NAV_ITEMS.map((item) => {
              const itemSlug = item.slug || item.id;
              const isActive = activeCategoryNavId === itemSlug;
              const Icon = item.icon;

              return (
                <button
                  key={itemSlug}
                  onClick={() => handleNavClick(itemSlug)}
                  className={cn(
                    "group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-poppins font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 border",
                    isActive
                      ? "bg-white text-slate-900 border-white shadow-md ring-2 ring-white/30 font-extrabold scale-102"
                      : item.variant === "special"
                      ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border-emerald-400/40 font-bold hover:scale-102"
                      : item.variant === "highlight"
                      ? "bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 border-amber-400/40 font-bold hover:scale-102"
                      : item.variant === "sale"
                      ? "bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 border-rose-500/40 font-bold hover:scale-102"
                      : "bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white border-white/15 hover:border-white/25 hover:scale-102"
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
                          : item.variant === "highlight"
                          ? "text-amber-300"
                          : item.variant === "sale"
                          ? "text-rose-400"
                          : "text-slate-300 group-hover:text-white"
                      )}
                    />
                  )}

                  <span>{item.label}</span>

                  {item.badge && (
                    <span
                      className={cn(
                        "ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider leading-none shadow-2xs",
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

          {/* Right Arrow Scroll Button */}
          {/* <button
            onClick={() => scroll("right")}
            aria-label="Scroll categories right"
            className="hidden lg:flex w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-all flex-shrink-0 cursor-pointer border border-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button> */}

          {/* More Categories Dropdown UI Component */}
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-poppins font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-all focus:outline-none cursor-pointer shadow-xs">
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2 max-h-80 overflow-y-auto">
                <DropdownMenuLabel className="font-poppins font-bold text-xs text-slate-700">
                  All Product Departments
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((cat) => {
                  const catSlug = cat.slug || cat.id;
                  return (
                    <DropdownMenuItem
                      key={catSlug}
                      onClick={() => handleNavClick(catSlug)}
                      className="cursor-pointer flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <span className="font-poppins text-xs font-medium text-slate-800">
                        {cat.name}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                        {cat.itemCount || "100+"}
                      </span>
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
