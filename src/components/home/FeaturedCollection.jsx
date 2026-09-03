"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productSlice";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { formatCurrency } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ShoppingBag, Heart, Star, Sparkles } from "lucide-react";

export function FeaturedCollection({ onSelectProduct }) {
  const dispatch = useAppDispatch();
  const { items: products, status } = useAppSelector((state) => state.products);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const handleAddToCart = (product) => {
    dispatch(addItem(product));
    dispatch(setCartDrawerOpen(true));
  };

  return (
    <section className="py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-left mb-8 space-y-1">
          <h2 className="section-title">
            Featured Collection
          </h2>
          <p className="section-subtitle">
            Direct factory wholesale pricing with instant GST invoicing & zero MOQ.
          </p>
        </div>

        {/* 4-Column Responsive Grid */}
        {status === "loading" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                <Skeleton className="w-full h-64 rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
                {(() => {
                  const isInWishlist = wishlistItems.some((item) => item.id === product.id);
                  return (
                    <button
                      onClick={() => dispatch(toggleWishlist(product))}
                      className="absolute top-6 right-6 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 shadow-sm flex items-center justify-center transition-colors"
                      aria-label="Add to Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isInWishlist ? "fill-rose-500 text-rose-500" : "text-slate-400"
                        }`}
                      />
                    </button>
                  );
                })()}

                {/* Product Image Container */}
                <div
                  className="relative w-full h-64 rounded-xl overflow-hidden bg-slate-100 mb-4 cursor-pointer"
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Information */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      className="product-title cursor-pointer"
                      onClick={() => onSelectProduct && onSelectProduct(product)}
                    >
                      <span>{product.name}</span>
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

                  {/* Add to Cart Button */}
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
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default FeaturedCollection;
