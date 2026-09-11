import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Heart,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  CheckSquare,
  Square,
  Package,
} from "lucide-react";
import {
  useCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useBulkRemoveCartMutation,
  useClearCartMutation,
} from "@/hooks/useCartQuery";
import { useAddToWishlistMutation } from "@/hooks/useWishlistQuery";
import { formatCurrency, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cartData, isLoading } = useCartQuery();
  const updateCartMutation = useUpdateCartItemMutation();
  const removeCartMutation = useRemoveCartItemMutation();
  const bulkRemoveMutation = useBulkRemoveCartMutation();
  const clearCartMutation = useClearCartMutation();
  const addToWishlistMutation = useAddToWishlistMutation();

  const [selectedItemKeys, setSelectedItemKeys] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Debounced quantity updates tracking
  const debounceTimers = useRef({});

  const cartItems = cartData?.items || [];
  const totalAmount = cartData?.totalAmount || 0;
  const totalCount = cartData?.totalCount || 0;

  const freeShippingThreshold = 599;
  const isFreeShipping = totalAmount >= freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((totalAmount / freeShippingThreshold) * 100));

  // Quantity Change Handler with debounced API sync
  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }

    const itemKey = `${item.id || item.slug}_${item.variantId || ""}`;
    if (debounceTimers.current[itemKey]) {
      clearTimeout(debounceTimers.current[itemKey]);
    }

    // Debounce mutation by 300ms
    debounceTimers.current[itemKey] = setTimeout(() => {
      updateCartMutation.mutate({
        productId: item.id || item.slug,
        variantId: item.variantId,
        quantity: newQuantity,
      });
    }, 300);
  };

  // Remove single item with optimistic update
  const handleRemoveItem = (item) => {
    removeCartMutation.mutate({
      productId: item.id || item.slug,
      variantId: item.variantId,
    });
    toast.success(`Removed "${item.name}" from cart.`);
  };

  // Move single item to wishlist
  const handleMoveToWishlist = (item) => {
    addToWishlistMutation.mutate({
      productSlug: item.slug || item.id,
      variantId: item.variantId,
      product: item,
    });
    removeCartMutation.mutate({
      productId: item.id || item.slug,
      variantId: item.variantId,
    });
    toast.success(`Moved "${item.name}" to your wishlist.`);
  };

  // Toggle select item for bulk remove
  const toggleSelectItem = (item) => {
    const key = `${item.id || item.slug}_${item.variantId || ""}`;
    setSelectedItemKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Bulk remove selected
  const handleBulkRemove = () => {
    if (selectedItemKeys.length === 0) return;
    const itemsToRemove = cartItems
      .filter((i) => selectedItemKeys.includes(`${i.id || i.slug}_${i.variantId || ""}`))
      .map((i) => ({ productId: i.id || i.slug, variantId: i.variantId }));

    bulkRemoveMutation.mutate({ items: itemsToRemove });
    setSelectedItemKeys([]);
  };

  // Apply Coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "WHOLESALE10") {
      const discount = Math.round(totalAmount * 0.1);
      setAppliedDiscount(discount);
      toast.success("Coupon 'WHOLESALE10' applied: 10% discount!");
    } else if (couponCode.trim().toUpperCase() === "FREESHIP") {
      setAppliedDiscount(50);
      toast.success("Coupon 'FREESHIP' applied!");
    } else {
      toast.error("Invalid coupon code. Try 'WHOLESALE10'.");
    }
  };

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-3 font-poppins">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-700">Loading your wholesale cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 font-poppins animate-fadeIn pb-16">
      {/* ── Top Header & Breadcrumb ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-accent font-bold transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>Shopping Cart</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/10 text-accent">
              {totalCount} {totalCount === 1 ? "Item" : "Items"}
            </span>
          </h1>
        </div>

        {cartItems.length > 0 && (
          <div className="flex items-center gap-2">
            {selectedItemKeys.length > 0 && (
              <button
                onClick={handleBulkRemove}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Selected ({selectedItemKeys.length})</span>
              </button>
            )}
            <button
              onClick={() => clearCartMutation.mutate()}
              className="text-xs text-slate-500 hover:text-rose-600 font-bold transition-colors px-3 py-2 cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* ── Empty Cart State ── */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 sm:p-16 text-center max-w-lg mx-auto my-8 space-y-4 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-orange-50 text-accent mx-auto flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your cart is currently empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-inter max-w-sm mx-auto leading-relaxed">
            Direct factory wholesale pricing with zero minimum order quantities. Discover bestselling industrial tools and retail packs.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Explore Wholesale Catalog</span>
            </button>
          </div>
        </div>
      ) : (
        /* ── Cart Layout: Items + Order Summary ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Milestone Progress Bar */}
            <div className="bg-orange-50/90 border border-orange-100 p-4 rounded-2xl text-xs font-inter text-slate-700 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-accent flex-shrink-0" />
                  {isFreeShipping ? (
                    <span className="text-accent font-poppins font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Unlocked Free Express Delivery!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-accent font-poppins font-bold">{formatCurrency(freeShippingThreshold - totalAmount)}</strong> more for <strong>Free Express Shipping</strong>!
                    </span>
                  )}
                </div>
                <span className="font-poppins font-bold text-slate-500">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-accent h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items Card List */}
            <div className="space-y-3">
              {cartItems.map((item) => {
                const itemKey = `${item.id || item.slug}_${item.variantId || ""}`;
                const isSelected = selectedItemKeys.includes(itemKey);

                return (
                  <div
                    key={itemKey}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs transition-all duration-200"
                  >
                    {/* Left: Checkbox + Thumbnail + Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleSelectItem(item)}
                        className="text-slate-400 hover:text-accent cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-accent" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 space-y-1">
                        <Link
                          to={`/product/${item.slug || item.id}`}
                          className="font-bold text-sm text-slate-900 hover:text-accent line-clamp-1 transition-colors"
                        >
                          {item.name}
                        </Link>
                        {item.variantId && (
                          <div className="text-[11px] text-slate-400 font-inter">
                            Variant: {item.variantId}
                          </div>
                        )}
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-accent text-sm">
                            {formatCurrency(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-slate-400 line-through font-inter">
                              {formatCurrency(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quantity Stepper, Total, Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-2xs">
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors active:scale-95 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-900 min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors active:scale-95 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[80px]">
                        <div className="font-black text-slate-900 text-base">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>

                      {/* Actions: Move to Wishlist & Remove */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Move to Wishlist"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove from Cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 sticky top-24">
            <h3 className="font-black text-lg text-slate-900 tracking-tight pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Coupon Code Box */}
            <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Discount Code (e.g. WHOLESALE10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-poppins uppercase tracking-wider focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 font-inter">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900 font-poppins">{formatCurrency(totalAmount)}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold font-poppins">
                  {isFreeShipping ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatCurrency(49)
                  )}
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount Applied</span>
                  <span>- {formatCurrency(appliedDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-emerald-600">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  18% GST Input Credit Claimable
                </span>
                <span className="font-bold font-poppins">{formatCurrency(Math.round(totalAmount * 0.18))}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-poppins">
                <div>
                  <span className="font-black text-base text-slate-900 block">Total Payable</span>
                  <span className="text-[10px] text-slate-400 font-inter">Inclusive of all taxes</span>
                </div>
                <span className="font-black text-2xl text-accent">
                  {formatCurrency(Math.max(0, totalAmount + (isFreeShipping ? 0 : 49) - appliedDiscount))}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Button
              variant="coral"
              size="lg"
              onClick={() => navigate("/checkout")}
              className="w-full gap-2 shadow-lg hover:shadow-xl font-bold text-xs uppercase tracking-wider py-4 rounded-2xl transition-all active:scale-98 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>

            <div className="pt-2 text-center text-[11px] text-slate-400 font-inter">
              🔒 Safe & Secure 256-Bit SSL Encrypted Checkout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
