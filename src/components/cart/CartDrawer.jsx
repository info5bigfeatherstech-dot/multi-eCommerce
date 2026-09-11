import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { addItem, removeItem } from "@/store/slices/cartSlice";
import {
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "@/hooks/useCartQuery";
import { useAddToWishlistMutation } from "@/hooks/useWishlistQuery";
import { formatCurrency, cn } from "@/lib/utils";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  ArrowRight,
  Tag,
  CheckCircle2,
  Heart,
  ExternalLink,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isCartDrawerOpen } = useAppSelector((state) => state.ui);
  const { items: cartItems, totalCount, totalAmount } = useAppSelector(
    (state) => state.cart
  );

  const updateCartMutation = useUpdateCartItemMutation();
  const removeCartMutation = useRemoveCartItemMutation();
  const addToWishlistMutation = useAddToWishlistMutation();

  const debounceTimers = useRef({});

  const freeShippingThreshold = 599;
  const progressPercent = Math.min(100, Math.round((totalAmount / freeShippingThreshold) * 100));

  const handleProceedToCheckout = () => {
    dispatch(setCartDrawerOpen(false));
    navigate("/checkout");
  };

  const handleGoToFullCart = () => {
    dispatch(setCartDrawerOpen(false));
    navigate("/cart");
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }

    // Update Redux state immediately for snappy local badge response
    if (newQuantity > item.quantity) {
      dispatch(addItem(item));
    } else {
      dispatch(removeItem(item.id));
    }

    // Debounce API sync to PUT /cart/item
    const itemKey = `${item.id || item.slug}_${item.variantId || ""}`;
    if (debounceTimers.current[itemKey]) {
      clearTimeout(debounceTimers.current[itemKey]);
    }
    debounceTimers.current[itemKey] = setTimeout(() => {
      updateCartMutation.mutate({
        productId: item.id || item.slug,
        variantId: item.variantId,
        quantity: newQuantity,
      });
    }, 300);
  };

  const handleRemoveItem = (item) => {
    dispatch(removeItem(item.id));
    removeCartMutation.mutate({
      productId: item.id || item.slug,
      variantId: item.variantId,
    });
    toast.success(`Removed "${item.name}" from cart.`);
  };

  const handleMoveToWishlist = (item) => {
    dispatch(removeItem(item.id));
    removeCartMutation.mutate({
      productId: item.id || item.slug,
      variantId: item.variantId,
    });
    addToWishlistMutation.mutate({
      productSlug: item.slug || item.id,
      variantId: item.variantId,
      product: item,
    });
  };

  return (
    <Drawer
      direction="right"
      open={isCartDrawerOpen}
      onOpenChange={(isOpen) => dispatch(setCartDrawerOpen(isOpen))}
    >
      <DrawerContent
        direction="right"
        className="w-full sm:max-w-md md:max-w-[460px] h-full flex flex-col p-0 border-l border-slate-200/80 bg-white z-50 shadow-2xl font-poppins"
      >
        <DrawerHeader className="sr-only">
          <DrawerTitle>Shopping Cart</DrawerTitle>
          <DrawerDescription>
            Review and adjust quantities of your selected items before checkout.
          </DrawerDescription>
        </DrawerHeader>

        {/* 1. Drawer Header */}
        <div className="p-4 bg-primary text-white flex items-center justify-between border-b border-primary-light/30 flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-light/40 text-accent">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-poppins font-bold text-base text-white">
                  My Cart
                </span>
                <span className="bg-accent text-white font-poppins text-xs font-black px-2 py-0.5 rounded-full">
                  {totalCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-inter">
                Direct factory pricing • Zero MOQ
              </p>
            </div>
          </div>

          <DrawerClose asChild>
            <button
              onClick={() => dispatch(setCartDrawerOpen(false))}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-primary-light/40 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </DrawerClose>
        </div>

        {/* 2. Free Shipping Progress Indicator */}
        <div className="bg-orange-50/80 p-3 border-b border-orange-100/80 text-xs font-inter text-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              {totalAmount >= freeShippingThreshold ? (
                <span className="text-accent font-poppins font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Unlocked Free Express Shipping!
                </span>
              ) : (
                <span className="text-xs">
                  Add <strong className="text-accent font-poppins font-bold">{formatCurrency(freeShippingThreshold - totalAmount)}</strong> more for <strong>Free Shipping</strong>!
                </span>
              )}
            </div>
            <span className="text-[11px] font-poppins font-bold text-slate-500">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-accent h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 3. Cart Items Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3 min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <p className="font-poppins text-base font-bold text-slate-700">
                Your cart is empty
              </p>
              <p className="text-xs font-inter text-slate-400 max-w-xs leading-relaxed">
                Add products from the Deals Under ₹99 or Best Sellers to start your order.
              </p>
              <DrawerClose asChild>
                <button
                  onClick={() => dispatch(setCartDrawerOpen(false))}
                  className="mt-2 px-5 py-2 rounded-xl bg-accent text-white font-poppins font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors shadow-xs"
                >
                  Browse Catalog
                </button>
              </DrawerClose>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-accent/40 shadow-2xs hover:shadow-xs transition-all duration-200 group"
              >
                {/* Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-poppins text-xs font-bold text-slate-800 line-clamp-1 leading-snug">
                    {item.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-poppins font-black text-accent">
                      {formatCurrency(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-[10px] font-inter text-slate-400 line-through">
                        {formatCurrency(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Quantity Stepper & Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="p-1 hover:bg-slate-200 text-slate-600 transition-colors active:scale-95 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-poppins font-bold text-slate-900 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="p-1 hover:bg-slate-200 text-slate-600 transition-colors active:scale-95 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Move to Wishlist"
                        aria-label="Move item to wishlist"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Item"
                        aria-label="Remove item from cart"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. Cart Drawer Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 flex-shrink-0 shadow-lg">
            <div className="space-y-1.5 text-xs font-inter text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-poppins font-bold text-slate-900">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  GST Input Credit Claim
                </span>
                <span className="font-bold">18% GST Invoice Included</span>
              </div>
              <div className="flex justify-between text-base font-poppins font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Payable</span>
                <span className="text-accent text-lg">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleProceedToCheckout}
                variant="coral"
                size="lg"
                className="w-full gap-2 shadow-md hover:shadow-xl font-poppins font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all active:scale-98 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                <span>Proceed to Wholesale Checkout</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>

              <button
                onClick={handleGoToFullCart}
                className="w-full py-2 rounded-xl text-center text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Cart & Apply Coupons</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default CartDrawer;
