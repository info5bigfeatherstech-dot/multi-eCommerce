"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setActiveCategoryNavId } from "@/store/slices/uiSlice";
import { Grid, Sparkles, Flame, Tag, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStorefrontLabels } from "@/api/storefrontLabels";

function getLabelIconAndBadge(label) {
  const slug = String(label?.slug || "").toLowerCase();
  const name = String(label?.name || "").toLowerCase();

  if (slug.includes("deal") || name.includes("deal") || slug.includes("sale") || name.includes("sale")) {
    return {
      Icon: Flame,
      iconClass: "text-rose-400 group-hover:scale-110",
      badge: "HOT",
      badgeClass: "bg-rose-500 text-white",
      pillClass:
        "bg-rose-500/15 text-rose-200 hover:bg-rose-500/25 border-rose-500/30 font-bold",
    };
  }

  if (slug.includes("arrival") || name.includes("arrival") || slug.includes("new") || name.includes("today")) {
    return {
      Icon: Sparkles,
      iconClass: "text-emerald-300 group-hover:scale-110",
      badge: "NEW",
      badgeClass: "bg-emerald-500 text-white",
      pillClass:
        "bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25 border-emerald-400/30 font-bold",
    };
  }

  return {
    Icon: Tag,
    iconClass: "text-amber-300 group-hover:scale-110",
    badge: null,
    badgeClass: "",
    pillClass:
      "bg-amber-500/15 text-amber-200 hover:bg-amber-500/25 border-amber-400/30 font-semibold",
  };
}

export function CategoryNavBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNavLabels = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getStorefrontLabels({
        showInNavOnly: true,
        storefront: "ecomm",
      });
      setLabels(res.labels || []);
    } catch (err) {
      console.warn("Could not load storefront labels for nav:", err?.message || err);
      // Fallback to empty, won't break the navigation bar
      setLabels([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNavLabels();
  }, [fetchNavLabels]);

  useEffect(() => {
    const matched = labels.find(
      (l) =>
        location.pathname === l.pagePath ||
        location.pathname === `/TagProducts/${l.slug}` ||
        location.pathname === `/tag-products/${l.slug}`
    );
    dispatch(setActiveCategoryNavId(matched ? matched.slug : null));
  }, [location.pathname, labels, dispatch]);

  const handleNavClick = (label) => {
    dispatch(setActiveCategoryNavId(label.slug));
    const targetPath = label.pagePath || `/TagProducts/${label.slug}`;
    navigate(targetPath);
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
      <div className="w-full px-3 sm:px-6 py-1.5 flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {/* 1. Shop By Category Button */}
        <button
          type="button"
          onClick={handleShopByCategoryClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs rounded-lg transition-all shadow-xs flex-shrink-0 cursor-pointer active:scale-95 group"
          title="Shop By Category"
        >
          <Grid className="w-3.5 h-3.5 text-white group-hover:rotate-90 transition-transform duration-300" />
          <span className="whitespace-nowrap">Shop By Category</span>
        </button>

        {/* 2. Subtle Divider */}
        <div className="h-4 w-px bg-white/20 mx-0.5 sm:mx-2 flex-shrink-0" />

        {/* 3. Live Storefront Labels Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
          {isLoading && labels.length === 0 ? (
            <div className="flex items-center gap-2">
              <div className="h-7 w-28 rounded-lg bg-white/10 animate-pulse" />
              <div className="h-7 w-28 rounded-lg bg-white/10 animate-pulse" />
            </div>
          ) : labels.length === 0 ? null : (
            labels.map((label) => {
              const isActive =
                location.pathname === label.pagePath ||
                location.pathname === `/TagProducts/${label.slug}` ||
                location.pathname === `/tag-products/${label.slug}`;

              const { Icon, iconClass, badge, badgeClass, pillClass } = getLabelIconAndBadge(label);

              return (
                <button
                  key={label.id || label.slug}
                  onClick={() => handleNavClick(label)}
                  title={label.description || label.name}
                  className={cn(
                    "group flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-poppins whitespace-nowrap transition-all duration-150 cursor-pointer flex-shrink-0 border",
                    isActive
                      ? "bg-white text-slate-900 border-white shadow-xs font-bold"
                      : pillClass
                  )}
                >
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-150",
                      isActive ? "text-accent" : iconClass
                    )}
                  />

                  <span>{label.name}</span>

                  {badge && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider leading-none shadow-2xs",
                        badgeClass
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </nav>
  );
}

export default CategoryNavBar;
