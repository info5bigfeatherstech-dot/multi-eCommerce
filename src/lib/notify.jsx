import React from "react";
import { toast } from "sonner";
import { ShoppingBag, Heart, CheckCircle2, ArrowRight, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

/**
 * Impressive Shadcn Sonner Toast for Cart actions
 */
export function notifyAddToCart(product, { onOpenCart } = {}) {
  const imageUrl = product.imageUrl || (product.images && product.images[0]) || "";
  const name = product.name || "Product";
  const price = product.price || 0;

  toast.custom((t) => (
    <div className="w-[340px] sm:w-[380px] bg-white/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300 ring-1 ring-emerald-500/10">
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
        <p className="text-[11px] font-poppins font-extrabold text-accent mt-0.5">
          {formatCurrency(price)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <button
          onClick={() => {
            toast.dismiss(t);
            if (onOpenCart) onOpenCart();
          }}
          className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-[11px] font-poppins font-bold shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>View</span>
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-slate-400 hover:text-slate-600 p-0.5 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  ));
}

/**
 * Impressive Shadcn Sonner Toast for Wishlist actions
 */
export function notifyWishlist(product, isAdded, { onViewWishlist } = {}) {
  const imageUrl = product.imageUrl || (product.images && product.images[0]) || "";
  const name = product.name || "Product";

  toast.custom((t) => (
    <div
      className={`w-[340px] sm:w-[380px] bg-white/95 backdrop-blur-xl border rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300 ${
        isAdded
          ? "border-rose-500/30 ring-1 ring-rose-500/10"
          : "border-slate-300/80 ring-1 ring-slate-200"
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

      {/* Actions */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {isAdded && (
          <button
            onClick={() => {
              toast.dismiss(t);
              if (onViewWishlist) onViewWishlist();
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-poppins font-bold shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Wishlist</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={() => toast.dismiss(t)}
          className="text-slate-400 hover:text-slate-600 p-0.5 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  ));
}
