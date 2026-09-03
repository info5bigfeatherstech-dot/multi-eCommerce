"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { formatCurrency } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ShoppingBag, Heart, Star, Sparkles, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const SPOTLIGHT_TABS = [
  { id: "all", label: "All Popular" },
  { id: "Electronics & Gadgets", label: "Electronics & Gadgets" },
  { id: "Jewellery & Accessories", label: "Jewellery & Accessories" },
  { id: "Home & Living", label: "Home & Living" },
  { id: "Kitchen & Dining", label: "Kitchen & Dining" },
  { id: "Beauty & Personal Care", label: "Beauty & Personal Care" },
  { id: "Gifts & Lifestyle", label: "Gifts & Lifestyle" },
];

export function CategorySpotlight({ onSelectProduct }) {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts =
    activeTab === "all"
      ? products
      : products.filter(
          (p) => p.category && p.category.toLowerCase().includes(activeTab.toLowerCase().split(" ")[0])
        );

  const displayList = filteredProducts.length > 0 ? filteredProducts : products;

  const handleAddToCart = (product) => {
    dispatch(addItem(product));
    dispatch(setCartDrawerOpen(true));
  };

  return (
    <section className="py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Section Header & Interactive Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-accent">
                Curated Selection
              </span>
            </div>
            <h2 className="section-title text-2xl md:text-3xl font-extrabold text-slate-900">
              Category Showcase & Best Sellers
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {SPOTLIGHT_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-poppins font-semibold transition-all whitespace-nowrap",
                    isActive
                      ? "bg-primary text-white shadow-md scale-105"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayList.slice(0, 8).map((product) => {
            const isInWishlist = wishlistItems.some((item) => item.id === product.id);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 relative"
              >
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-6 left-6 z-10">
                    <Badge variant="coral" className="font-poppins font-extrabold text-[10px] px-2.5 py-0.5 shadow-sm">
                      {product.discount}
                    </Badge>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => dispatch(toggleWishlist(product))}
                  className="absolute top-6 right-6 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 shadow-sm flex items-center justify-center transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isInWishlist ? "fill-rose-500 text-rose-500" : "text-slate-400"
                    }`}
                  />
                </button>

                {/* Product Image */}
                <div
                  className="relative w-full h-60 rounded-xl overflow-hidden bg-slate-100 mb-4 cursor-pointer"
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-poppins font-bold text-accent uppercase tracking-wider">
                      {product.category || "Wholesale Direct"}
                    </span>
                    <h3
                      className="product-title cursor-pointer mt-1 line-clamp-2"
                      onClick={() => onSelectProduct && onSelectProduct(product)}
                    >
                      {product.name}
                    </h3>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-poppins font-black text-base text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="font-inter text-xs text-slate-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <Button
                    variant="coral"
                    className="w-full gap-2 font-poppins font-bold text-xs shadow-md hover:scale-[1.02] active:scale-95 transition-all mt-2"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategorySpotlight;
