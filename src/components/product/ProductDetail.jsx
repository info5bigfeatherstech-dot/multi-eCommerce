"use client";

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { formatCurrency, cn } from "@/lib/utils";
import { notifyAddToCart, notifyWishlist } from "@/lib/notify";
import {
  Star,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
  Check,
  ShieldCheck,
  Heart,
} from "lucide-react";
import Button from "@/components/ui/Button";

const COLOR_OPTIONS = [
  { id: "red", name: "Pink & Red", bg: "bg-rose-500", border: "border-rose-300" },
  { id: "space-gray", name: "Space Gray", bg: "bg-slate-700", border: "border-slate-500" },
  { id: "green", name: "Light Green", bg: "bg-emerald-200", border: "border-emerald-400" },
  { id: "silver", name: "Silver", bg: "bg-slate-200", border: "border-slate-300" },
  { id: "blue", name: "Sky Blue", bg: "bg-sky-300", border: "border-sky-400" },
];

export default function ProductDetail({ product: propProduct, onBack: propOnBack }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const products = useAppSelector((state) => state.products.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const matchedProduct =
    propProduct || products?.find((p) => p.slug === slug || p.id === slug);

  // Default fallback product if none passed
  const currentProduct = matchedProduct || {
    id: "prod-airpods-max",
    name: "AirPods Max — High-Fidelity Over-Ear Headphones",
    category: "Mobile & Electronics",
    subcategory: "Headphones",
    price: 49999,
    originalPrice: 59900,
    monthlyPrice: 4166,
    rating: 4.9,
    reviewCount: 121,
    stockLeft: 12,
    description:
      "A perfect balance of exhilarating high-fidelity audio and the effortless magic of AirPods. Ultimate personal listening experience with Active Noise Cancellation & Spatial Audio.",
    imageUrl:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80",
    ],
  };

  const imagesList = currentProduct.images || [currentProduct.imageUrl];

  const isInWishlist = wishlistItems.some(
    (item) =>
      (item.slug && currentProduct.slug && item.slug === currentProduct.slug) ||
      (item.id && currentProduct.id && item.id === currentProduct.id)
  );

  const [selectedImage, setSelectedImage] = useState(imagesList[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].id);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(addItem({ ...currentProduct, quantity }));
    setIsAdded(true);
    notifyAddToCart(currentProduct, {
      onOpenCart: () => dispatch(setCartDrawerOpen(true)),
    });
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleToggleWishlist = () => {
    const nextIsAdded = !isInWishlist;
    dispatch(toggleWishlist(currentProduct));
    notifyWishlist(currentProduct, nextIsAdded, {
      onViewWishlist: () => navigate("/wishlist"),
    });
  };

  const handleBuyNow = () => {
    dispatch(addItem({ ...currentProduct, quantity }));
    navigate("/checkout");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 font-albert-sans animate-fadeIn">
      
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-slate-500 font-inter">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={propOnBack || (() => navigate("/"))}
            className="flex items-center gap-1.5 text-slate-700 hover:text-primary font-bold transition-colors mr-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span>/</span>
          <span>Electronics</span>
          <span>/</span>
          <span>Audio</span>
          <span>/</span>
          <span>Headphones</span>
          <span>/</span>
          <span>Shop Headphones by type</span>
          <span>/</span>
          <span className="font-bold text-slate-900 line-clamp-1 max-w-[200px]">
            {currentProduct.slug || currentProduct.name}
          </span>
        </div>
      </div>

      {/* Main PDP 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Gallery (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-4">
          
          {/* Hero Main Image Container */}
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[540px] bg-slate-100/90 rounded-3xl overflow-hidden flex items-center justify-center p-6 border border-slate-200/80 shadow-inner group">
            <img
              src={selectedImage}
              alt={currentProduct.name}
              className="max-h-full max-w-full object-contain drop-shadow-xl transition-all duration-300 hover:scale-105"
            />
            {/* Top-Right Wishlist Heart Button */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer"
              aria-label="Toggle Wishlist"
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  isInWishlist ? "fill-rose-500 text-rose-500" : "text-slate-400 hover:text-rose-500"
                )}
              />
            </button>
          </div>

          {/* 4-Thumbnail Row */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {imagesList.slice(0, 4).map((imgUrl, index) => {
              const isSelected = selectedImage === imgUrl;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative h-20 sm:h-24 rounded-2xl bg-slate-100 overflow-hidden border-2 transition-all p-2 flex items-center justify-center ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 shadow-md"
                      : "border-transparent hover:border-slate-300 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Product Detail & Purchase Box (5 Cols) */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          
          {/* Header Title & Description */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {currentProduct.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-inter leading-relaxed">
              {currentProduct.description}
            </p>
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-emerald-600 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-emerald-600 text-emerald-600"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-600 font-inter">
              ({currentProduct.reviewCount || 121})
            </span>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Price Block */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {formatCurrency(currentProduct.price)}
              </span>
              <span className="text-sm font-semibold text-slate-600 font-inter">
                or {formatCurrency(currentProduct.monthlyPrice || Math.round(currentProduct.price / 6))}/month
              </span>
            </div>
            <p className="text-xs text-slate-500 font-inter">
              Suggested payments with 6 months special financing
            </p>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Color Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block font-inter">
              Choose a Color
            </label>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((color) => {
                const isSelected = selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    title={color.name}
                    className={`w-9 h-9 rounded-full ${color.bg} border-2 flex items-center justify-center transition-all shadow-sm ${
                      isSelected
                        ? "ring-2 ring-primary ring-offset-2 scale-110 border-white"
                        : "hover:scale-105 border-white"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector + Stock Warning */}
          <div className="flex items-center gap-4 flex-wrap pt-2">
            {/* Pill Quantity Input */}
            <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Low Stock Badge */}
            <div className="text-xs font-inter">
              <p className="font-bold text-slate-800">
                Only <span className="text-accent">{currentProduct.stockLeft || 12} Items</span> Left!
              </p>
              <p className="text-slate-400 text-[11px]">Don't miss it</p>
            </div>
          </div>

          {/* CTA Action Buttons + Wishlist Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#064e3b] hover:bg-[#04392b] active:scale-95 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className={cn(
                "flex-1 py-3.5 px-6 rounded-full border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95",
                isAdded
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-[#064e3b] text-[#064e3b] hover:bg-[#064e3b]/5"
              )}
            >
              {isAdded ? "Added to Cart ✓" : "Add to Cart"}
            </button>
            <button
              onClick={handleToggleWishlist}
              title={isInWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
              className={cn(
                "w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 flex-shrink-0",
                isInWishlist
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-200"
              )}
            >
              <Heart className={cn("w-5 h-5", isInWishlist && "fill-rose-500 text-rose-500")} />
            </button>
          </div>

          {/* Delivery & Return Info Box */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50 text-xs font-inter">
            
            {/* Free Delivery Row */}
            <div className="p-4 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600 flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="font-bold text-slate-800">Free Delivery</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter Postal Code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg w-32 focus:outline-none focus:border-primary bg-white"
                  />
                  <button
                    onClick={() => setPincodeChecked(true)}
                    className="text-[11px] font-bold text-slate-700 underline hover:text-primary"
                  >
                    Check Availability
                  </button>
                </div>
                {pincodeChecked && (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3" /> Delivery available for {pincode || "this location"} within 2-3 days!
                  </p>
                )}
              </div>
            </div>

            {/* Return Delivery Row */}
            <div className="p-4 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600 flex-shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-800">Return Delivery</p>
                <p className="text-slate-500">
                  Free 30days Delivery Returns.{" "}
                  <button className="font-bold text-slate-700 underline hover:text-primary">
                    Details
                  </button>
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
