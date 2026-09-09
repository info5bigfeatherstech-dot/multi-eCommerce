"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { formatCurrency, cn } from "@/lib/utils";
import { notifyAddToCart, notifyWishlist } from "@/lib/notify";
import { DEALS_UNDER_99 } from "@/data/under99Deals";
import productsData from "@/data/products.json";
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
  ChevronRight,
  Share2,
  PackageCheck,
} from "lucide-react";

export default function ProductDetail({ product: propProduct, onBack: propOnBack }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const reduxProducts = useAppSelector((state) => state.products.items) || [];
  const wishlistItems = useAppSelector((state) => state.wishlist.items) || [];

  // Match specific product across Redux items, under99Deals, and products.json
  const matchedProduct =
    propProduct ||
    reduxProducts.find((p) => p.slug === slug || p.id === slug) ||
    DEALS_UNDER_99.find((p) => p.slug === slug || p.id === slug) ||
    productsData.find((p) => p.slug === slug || p.id === slug) ||
    DEALS_UNDER_99.find(
      (p) =>
        p.slug?.toLowerCase() === slug?.toLowerCase() ||
        p.id?.toLowerCase() === slug?.toLowerCase()
    );

  // Fallback if somehow not matched
  const currentProduct = matchedProduct || {
    id: slug || "product-item",
    slug: slug || "product-item",
    name: slug
      ? slug
          .replace(/^deal-|^prod-/, "")
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Selected Product",
    category: "Daily Essentials",
    price: 99,
    originalPrice: 199,
    discountBadge: "-50%",
    discount: "50% OFF",
    rating: 4.8,
    reviewCount: 140,
    stockLeft: 24,
    description: "High quality everyday essential item. Durable, portable, and convenient to use.",
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
    ],
  };

  const imagesList =
    currentProduct.images && currentProduct.images.length > 0
      ? currentProduct.images
      : [currentProduct.imageUrl];

  const [selectedImage, setSelectedImage] = useState(imagesList[0] || currentProduct.imageUrl);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync selected image whenever product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const imgs =
      currentProduct.images && currentProduct.images.length > 0
        ? currentProduct.images
        : [currentProduct.imageUrl];
    setSelectedImage(imgs[0] || currentProduct.imageUrl);
    setQuantity(1);
    setPincodeChecked(false);
    setIsAdded(false);
  }, [slug, currentProduct.id, currentProduct.imageUrl]);

  const isInWishlist = wishlistItems.some(
    (item) =>
      (item.slug && currentProduct.slug && item.slug === currentProduct.slug) ||
      (item.id && currentProduct.id && item.id === currentProduct.id)
  );

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Check if it's an under 99 product
  const isUnder99 = Number(currentProduct.price) <= 99;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 font-albert-sans animate-fadeIn">
      {/* 1. Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-slate-500 font-inter">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={propOnBack || (() => navigate(-1))}
            className="flex items-center gap-1.5 text-slate-700 hover:text-accent font-bold transition-colors mr-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span>/</span>
          <Link to="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <span>/</span>
          {isUnder99 ? (
            <span className="text-accent font-semibold">Deals Under ₹99</span>
          ) : (
            <span className="hover:text-accent transition-colors">
              {currentProduct.category || "Products"}
            </span>
          )}
          <span>/</span>
          <span className="font-bold text-slate-900 line-clamp-1 max-w-[280px]">
            {currentProduct.name}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-slate-600 hover:text-accent transition-colors cursor-pointer text-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? "Link Copied!" : "Share"}</span>
        </button>
      </div>

      {/* 2. Main Product 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-4">
          {/* Main Showcase Image Container */}
          <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[520px] bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center p-6 border border-slate-200/80 shadow-xs group">
            <img
              src={selectedImage}
              alt={currentProduct.name}
              className="max-h-full max-w-full object-contain drop-shadow-md transition-all duration-300 hover:scale-105"
            />

            {/* Discount Badge */}
            {(currentProduct.discount || currentProduct.discountBadge) && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-accent text-white font-poppins font-black text-xs uppercase shadow-sm">
                  {currentProduct.discount || currentProduct.discountBadge}
                </span>
              </div>
            )}

            {/* Top-Right Wishlist Heart Button */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer border border-slate-100"
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

          {/* Thumbnail Row (shown only if multiple images exist) */}
          {imagesList.length > 1 && (
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {imagesList.slice(0, 4).map((imgUrl, index) => {
                const isSelected = selectedImage === imgUrl;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={cn(
                      "relative h-20 sm:h-24 rounded-2xl bg-white overflow-hidden border-2 transition-all p-2 flex items-center justify-center cursor-pointer",
                      isSelected
                        ? "border-accent ring-2 ring-accent/20 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100"
                    )}
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
          )}

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <PackageCheck className="w-5 h-5 mx-auto text-accent" />
              <p className="text-xs font-bold text-slate-800 font-poppins">Ready to Ship</p>
              <p className="text-[11px] text-slate-400 font-inter">In Stock</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <ShieldCheck className="w-5 h-5 mx-auto text-emerald-600" />
              <p className="text-xs font-bold text-slate-800 font-poppins">100% Quality</p>
              <p className="text-[11px] text-slate-400 font-inter">Inspected</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <RotateCcw className="w-5 h-5 mx-auto text-blue-600" />
              <p className="text-xs font-bold text-slate-800 font-poppins">7 Days Return</p>
              <p className="text-[11px] text-slate-400 font-inter">Hassle-Free</p>
            </div>
          </div>
        </div>

        {/* Right Column: Product Detail & Purchase Box (5 Cols) */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          {/* Category Tag & Under ₹99 Highlight */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-poppins font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {currentProduct.category || "General Utility"}
            </span>
            {isUnder99 && (
              <span className="text-xs font-poppins font-bold text-accent bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                ⚡ Under ₹99 Steal
              </span>
            )}
          </div>

          {/* Header Title & Description */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              {currentProduct.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-inter leading-relaxed">
              {currentProduct.description}
            </p>
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-500 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700 font-inter">
              {currentProduct.rating || 4.8}
            </span>
            <span className="text-xs text-slate-400 font-inter">
              ({currentProduct.reviewCount || 180} reviews)
            </span>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Price Block */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-accent font-poppins">
                {formatCurrency(currentProduct.price)}
              </span>
              {currentProduct.originalPrice && (
                <span className="text-base font-semibold text-slate-400 line-through font-inter">
                  {formatCurrency(currentProduct.originalPrice)}
                </span>
              )}
              {(currentProduct.discount || currentProduct.discountBadge) && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  {currentProduct.discount || currentProduct.discountBadge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-inter">
              Special budget deal. Price inclusive of all taxes.
            </p>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Color Selector (shown only if product has defined color variations) */}
          {currentProduct.colors && currentProduct.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block font-inter">
                Available Colors
              </label>
              <div className="flex items-center gap-2">
                {currentProduct.colors.map((c, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 border border-slate-200 text-slate-800"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector + Stock Warning */}
          <div className="flex items-center gap-4 flex-wrap pt-1">
            <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stock Left */}
            <div className="text-xs font-inter">
              <p className="font-bold text-slate-800">
                Only <span className="text-accent">{currentProduct.stockLeft || 25} Items</span> Left!
              </p>
              <p className="text-slate-400 text-[11px]">In stock, ready to dispatch</p>
            </div>
          </div>

          {/* Total Price preview if quantity > 1 */}
          {quantity > 1 && (
            <div className="text-xs font-inter text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex justify-between items-center">
              <span>Total for {quantity} items:</span>
              <span className="font-poppins font-black text-sm text-slate-900">
                {formatCurrency(currentProduct.price * quantity)}
              </span>
            </div>
          )}

          {/* CTA Action Buttons + Wishlist Button */}
          <div className="flex items-center gap-2 sm:gap-3 pt-2">
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-3 sm:px-6 rounded-full bg-slate-900 hover:bg-black active:scale-95 text-white font-poppins font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className={cn(
                "flex-1 py-3.5 px-3 sm:px-6 rounded-full border-2 font-poppins font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95",
                isAdded
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-accent bg-accent hover:bg-accent-hover text-white shadow-md hover:shadow-lg"
              )}
            >
              {isAdded ? "Added ✓" : "Add to Cart"}
            </button>
            <button
              onClick={handleToggleWishlist}
              title={isInWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
              className={cn(
                "w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90 flex-shrink-0",
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
            {/* Delivery Row with Pincode check */}
            <div className="p-4 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600 flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="font-bold text-slate-800">Fast Delivery</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter Postal Code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg w-32 focus:outline-none focus:border-accent bg-white font-mono"
                  />
                  <button
                    onClick={() => {
                      if (pincode.length === 6) setPincodeChecked(true);
                    }}
                    className="text-[11px] font-bold text-slate-700 underline hover:text-accent cursor-pointer"
                  >
                    Check Availability
                  </button>
                </div>
                {pincodeChecked && (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3" /> Delivery available for {pincode}! Dispatches in 24 hours.
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
                <p className="font-bold text-slate-800">Return & Replacement</p>
                <p className="text-slate-500">
                  Easy 7-day hassle-free replacement for transit defect or damage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
