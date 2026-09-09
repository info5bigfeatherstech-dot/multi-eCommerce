"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setCategorySidebarOpen } from "@/store/slices/uiSlice";
import { ArrowRight, Sparkles, Tag, ShieldCheck } from "lucide-react";

export function CategoryFlyout({ category, top = 0, onClose }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  if (!category || !category.subCategories || category.subCategories.length === 0) {
    return null;
  }

  // Split subcategories into 2 balanced columns
  const half = Math.ceil(category.subCategories.length / 2);
  const col1 = category.subCategories.slice(0, half);
  const col2 = category.subCategories.slice(half);

  const handleSubClick = (subSlug) => {
    navigate(`/category/${category.slug}/${subSlug}`);
    if (onClose) onClose();
    else dispatch(setCategorySidebarOpen(false));
  };

  const handleViewAll = () => {
    navigate(`/category/${category.slug}`);
    if (onClose) onClose();
    else dispatch(setCategorySidebarOpen(false));
  };

  return (
    <div
      style={{ top: `${top}px` }}
      className="absolute left-[calc(100%+8px)] z-50 w-[460px] bg-white text-slate-800 shadow-2xl rounded-2xl border border-slate-200 p-5 animate-fadeIn flex flex-col justify-between transition-[top] duration-150 ease-out before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-3 before:content-['']"
    >
      <div>
        {/* Category Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div>
            <h3 className="font-poppins font-bold text-sm text-primary flex items-center gap-2">
              <span>{category.name}</span>
              <span className="text-xs font-normal text-slate-500 font-inter">
                ({category.itemCount?.toLocaleString() || 0} items)
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-inter mt-0.5">
              Verified B2B wholesale manufacturers & direct suppliers
            </p>
          </div>
          <span className="bg-accent/10 text-accent font-poppins font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-accent/20">
            Factory Direct
          </span>
        </div>

        {/* 2-Column List with Hover Lift */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <div className="space-y-2">
            {col1.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSubClick(sub.slug)}
                className="w-full text-left group flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 font-poppins text-xs text-slate-700 hover:text-accent transition-all cursor-pointer"
              >
                <span className="font-medium line-clamp-1">{sub.name}</span>
                {sub.isPopular && (
                  <Sparkles className="w-3 h-3 text-accent flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {col2.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSubClick(sub.slug)}
                className="w-full text-left group flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 font-poppins text-xs text-slate-700 hover:text-accent transition-all cursor-pointer"
              >
                <span className="font-medium line-clamp-1">{sub.name}</span>
                {sub.isPopular && (
                  <Sparkles className="w-3 h-3 text-accent flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Promo Footer Strip */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-primary via-primary-light to-primary text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-poppins font-bold text-accent">GST Invoice Guaranteed</div>
            <div className="text-[10px] text-slate-300">Claim 100% Tax Input Credit</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleViewAll}
          className="text-[11px] font-poppins font-bold text-white bg-accent hover:bg-accent-hover px-3 py-1 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
        >
          View All
        </button>
      </div>
    </div>
  );
}

export default CategoryFlyout;
