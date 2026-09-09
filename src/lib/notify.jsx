import React from "react";
import { toast } from "sonner";
import { ShoppingBag, Heart, CheckCircle2, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

/**
 * Impressive Shadcn Sonner Toast for Cart actions (Clean, Minimal, No X icon)
 */
export function notifyAddToCart(product, { onOpenCart } = {}) {
  const imageUrl = product.imageUrl || (product.images && product.images[0]) || "";
  const name = product.name || "Product";
  const price = product.price || 0;

  toast.custom((t) => (
    <div
      onClick={() => {
        if (onOpenCart) {
          toast.dismiss(t);
          onOpenCart();
        }
      }}
      className="w-[330px] sm:w-[370px] bg-white/95 backdrop-blur-xl border border-emerald-500/25 rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300 ring-1 ring-emerald-500/10 cursor-pointer hover:shadow-xl transition-all"
    >
      {/* Product Image Thumbnail */}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Info Details */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-poppins font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
            <ShoppingBag className="w-3 h-3 text-emerald-600" />
            Added to Cart
          </span>
        </div>
        <h4 className="font-poppins font-bold text-xs text-slate-900 truncate leading-tight">
          {name}
        </h4>
        <p className="text-[11px] font-poppins font-bold text-accent mt-0.5">
          {formatCurrency(price)}
        </p>
      </div>

      {/* Action Button */}
      <div className="flex items-center flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(t);
            if (onOpenCart) onOpenCart();
          }}
          className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-700 text-white text-[11px] font-poppins font-bold shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>View</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  ));
}

/**
 * Impressive Shadcn Sonner Toast for Wishlist actions (Clean, Minimal, No X icon)
 */
export function notifyWishlist(product, isAdded, { onViewWishlist } = {}) {
  const imageUrl = product.imageUrl || (product.images && product.images[0]) || "";
  const name = product.name || "Product";

  toast.custom((t) => (
    <div
      onClick={() => {
        if (isAdded && onViewWishlist) {
          toast.dismiss(t);
          onViewWishlist();
        }
      }}
      className={`w-[330px] sm:w-[370px] bg-white/95 backdrop-blur-xl border rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300 transition-all ${
        isAdded
          ? "border-rose-500/25 ring-1 ring-rose-500/10 cursor-pointer hover:shadow-xl"
          : "border-slate-200/90 ring-1 ring-slate-100"
      }`}
    >
      {/* Product Image Thumbnail */}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Heart className="w-5 h-5" />
          </div>
        )}
        <div
          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-white flex items-center justify-center shadow-md ${
            isAdded ? "bg-rose-500" : "bg-slate-500"
          }`}
        >
          <Heart className={`w-3 h-3 ${isAdded ? "fill-white" : ""}`} />
        </div>
      </div>

      {/* Info Details */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-poppins font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isAdded
                ? "text-rose-700 bg-rose-50 border-rose-200/60"
                : "text-slate-600 bg-slate-100 border-slate-200"
            }`}
          >
            <Heart
              className={`w-3 h-3 ${
                isAdded ? "fill-rose-500 text-rose-500" : "text-slate-500"
              }`}
            />
            {isAdded ? "Saved to Wishlist" : "Removed from Wishlist"}
          </span>
        </div>
        <h4 className="font-poppins font-bold text-xs text-slate-900 truncate leading-tight">
          {name}
        </h4>
        <p className="text-[11px] font-poppins text-slate-400 mt-0.5">
          {isAdded ? "Added to your personal wishlist" : "Item removed from wishlist"}
        </p>
      </div>

      {/* Action Button */}
      {isAdded && (
        <div className="flex items-center flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss(t);
              if (onViewWishlist) onViewWishlist();
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-poppins font-bold shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Wishlist</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  ));
}
