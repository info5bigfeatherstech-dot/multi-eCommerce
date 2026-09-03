"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromWishlist, clearWishlist } from "@/store/slices/wishlistSlice";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { formatCurrency } from "@/lib/utils";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles, Star } from "lucide-react";
import Button from "@/components/ui/Button";

export default function WishlistPage({ onBack: propOnBack, onSelectProduct }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleBack = propOnBack || (() => navigate("/"));
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const handleMoveToCart = (product) => {
    dispatch(addItem(product));
    dispatch(removeFromWishlist(product.slug || product.id));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 font-albert-sans animate-fadeIn">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary font-bold transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>My Wishlist</span>
            <span className="text-sm font-semibold bg-rose-100 text-rose-600 px-3 py-1 rounded-full">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
            </span>
          </h1>
        </div>

        {wishlistItems.length > 0 && (
          <button
            onClick={() => dispatch(clearWishlist())}
            className="text-xs text-slate-500 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </button>
        )}
      </div>

      {/* Wishlist Items Grid or Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center shadow-inner">
            <Heart className="w-8 h-8 fill-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your wishlist is empty</h2>
          <p className="text-xs text-slate-500 font-inter">
            Explore our wholesale catalog and click the heart icon on any product to save it for later.
          </p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Explore Products</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 relative"
            >
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(product.id)}
                className="absolute top-6 right-6 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md text-rose-500 hover:bg-rose-50 shadow-sm flex items-center justify-center transition-all"
                title="Remove from Wishlist"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
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

              {/* Product Details & Actions */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3
                    className="product-title cursor-pointer"
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                  >
                    <span>{product.name}</span>
                  </h3>

                  {/* Price */}
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

                {/* Move to Cart CTA */}
                <Button
                  variant="coral"
                  className="w-full gap-2 font-poppins font-bold text-xs shadow-md hover:scale-[1.02] active:scale-95 transition-all mt-2"
                  onClick={() => handleMoveToCart(product)}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Move to Cart</span>
                </Button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
