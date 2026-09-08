import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { removeFromWishlist, clearWishlist } from "@/store/slices/wishlistSlice";
import { formatCurrency } from "@/lib/utils";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Package,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

export const ProfileWishlistTab = React.memo(function ProfileWishlistTab() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems, totalCount } = useAppSelector(
    (state) => state.wishlist
  );

  const handleAddToCart = (product) => {
    dispatch(
      addItem({
        id: product.id || product.slug,
        slug: product.slug,
        name: product.name || product.title,
        price: product.price,
        originalPrice: product.originalPrice || product.mrp,
        imageUrl: product.imageUrl || product.image,
      })
    );
    toast.success(`"${product.name || product.title}" added to wholesale cart! 🛒`);
  };

  const handleMoveAllToCart = () => {
    if (wishlistItems.length === 0) return;
    wishlistItems.forEach((product) => {
      dispatch(
        addItem({
          id: product.id || product.slug,
          slug: product.slug,
          name: product.name || product.title,
          price: product.price,
          originalPrice: product.originalPrice || product.mrp,
          imageUrl: product.imageUrl || product.image,
        })
      );
    });
    toast.success(`Moved all ${wishlistItems.length} items to your cart! 🛒`);
  };

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success("Item removed from wishlist.");
  };

  const handleClearAll = () => {
    dispatch(clearWishlist());
    toast.success("Wishlist cleared.");
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <Heart size={30} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-slate-900 mb-1">
          Your Wishlist is Empty
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-inter max-w-sm mx-auto mb-6 leading-relaxed">
          Save wholesale products and top trending merchandise you want to restock or order later.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/20 transition-all cursor-pointer"
        >
          <Sparkles size={15} />
          <span>Explore Trending Products</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-poppins font-bold text-lg text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>My Saved Wishlist</span>
            <span className="text-xs font-poppins font-bold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-200/60">
              {totalCount} {totalCount === 1 ? "Product" : "Products"}
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Quickly re-order saved wholesale merchandise or move them directly to cart
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleMoveAllToCart}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <ShoppingCart size={13} />
            <span>Move All to Cart</span>
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-poppins font-semibold text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Clear Wishlist"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {wishlistItems.map((product) => {
          const id = product.id || product.slug;
          const name = product.name || product.title;
          const image =
            product.imageUrl ||
            product.image ||
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80";

          return (
            <div
              key={id}
              className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-accent/40 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${product.slug || id}`)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-400 hover:text-rose-600 flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                  <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 text-[10px] font-poppins font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                    <CheckCircle2 size={10} /> Ready Stock
                  </span>
                </div>

                <h4
                  onClick={() => navigate(`/product/${product.slug || id}`)}
                  className="font-poppins font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 hover:text-accent cursor-pointer transition-colors leading-snug"
                >
                  {name}
                </h4>

                <div className="flex items-baseline gap-2 mt-1.5 mb-3">
                  <span className="font-poppins font-black text-sm sm:text-base text-accent">
                    {formatCurrency(product.price)}
                  </span>
                  {(product.originalPrice || product.mrp) && (
                    <span className="text-xs font-inter text-slate-400 line-through">
                      {formatCurrency(product.originalPrice || product.mrp)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 py-2 px-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <ShoppingCart size={13} />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/product/${product.slug || id}`)}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-poppins text-xs font-semibold transition-colors cursor-pointer"
                  title="View details"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ProfileWishlistTab;
