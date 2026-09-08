import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem, decrementItem, removeItem, clearCart } from "@/store/slices/cartSlice";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Package,
} from "lucide-react";
import { toast } from "sonner";

export const ProfileCartTab = React.memo(function ProfileCartTab() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: cartItems, totalCount, totalAmount } = useAppSelector(
    (state) => state.cart
  );

  const freeShippingThreshold = 599;
  const isFreeShipping = totalAmount >= freeShippingThreshold;
  const progressPercent = Math.min(
    100,
    Math.round((totalAmount / freeShippingThreshold) * 100)
  );

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Wholesale cart cleared.");
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-accent flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={30} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-slate-900 mb-1">
          Your Wholesale Cart is Empty
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-inter max-w-sm mx-auto mb-6 leading-relaxed">
          You haven't added any products to your cart yet. Explore our wholesale catalog or deals to place bulk orders.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/20 transition-all cursor-pointer"
        >
          <Package size={15} />
          <span>Browse Wholesale Catalog</span>
        </button>
      </div>
    );
  }

  const estimatedGst = Math.round(totalAmount * 0.18);
  const grandTotal = totalAmount + (isFreeShipping ? 0 : 99);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        {/* Header */}
        <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-poppins font-bold text-lg text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent" />
              <span>My Wholesale Cart</span>
              <span className="text-xs font-poppins font-bold bg-accent/10 text-accent px-2.5 py-0.5 rounded-full">
                {totalCount} {totalCount === 1 ? "Item" : "Items"}
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-inter mt-0.5">
              Direct factory pricing with wholesale slab discounts
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            className="text-xs font-poppins font-semibold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-orange-50/80 p-3.5 rounded-2xl border border-orange-100/80 mb-6">
          <div className="flex items-center justify-between text-xs font-inter mb-1.5">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              {isFreeShipping ? (
                <span className="text-accent font-poppins font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Free Wholesale Express Shipping Unlocked!
                </span>
              ) : (
                <span className="text-slate-700">
                  Add <strong className="text-accent font-poppins font-bold">{formatCurrency(freeShippingThreshold - totalAmount)}</strong> more for <strong>Free Express Shipping</strong>
                </span>
              )}
            </div>
            <span className="font-poppins font-bold text-slate-500 text-[11px]">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-accent h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item Cards */}
        <div className="divide-y divide-slate-100">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 flex-shrink-0">
                  <img
                    src={
                      item.imageUrl ||
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4
                    onClick={() => navigate(`/product/${item.slug || item.id}`)}
                    className="font-poppins font-bold text-xs sm:text-sm text-slate-900 truncate hover:text-accent cursor-pointer transition-colors"
                  >
                    {item.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-poppins font-black text-xs sm:text-sm text-accent">
                      {formatCurrency(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-[11px] font-inter text-slate-400 line-through">
                        {formatCurrency(item.originalPrice)}
                      </span>
                    )}
                    <span className="text-[10px] font-poppins font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      Wholesale Price
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-inter mt-1">
                    Subtotal:{" "}
                    <strong className="text-slate-700 font-poppins">
                      {formatCurrency(item.price * item.quantity)}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => dispatch(decrementItem(item.id))}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="px-3 text-xs font-poppins font-bold text-slate-900 min-w-[28px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch(addItem(item))}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer active:scale-95"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(removeItem(item.id))}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove from Cart"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary & Checkout Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <h3 className="font-poppins font-bold text-base text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>Order Cost Summary</span>
          <span className="text-xs font-inter font-normal text-slate-400">
            GST Invoice Available
          </span>
        </h3>

        <div className="space-y-2.5 text-xs font-inter text-slate-600 mb-5">
          <div className="flex justify-between">
            <span>Wholesale Items Subtotal</span>
            <span className="font-poppins font-bold text-slate-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Estimated 18% Input GST</span>
            <span className="font-poppins font-semibold text-slate-700">
              {formatCurrency(estimatedGst)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Express Cargo Shipping</span>
            <span>
              {isFreeShipping ? (
                <span className="text-emerald-600 font-poppins font-bold uppercase text-[11px]">
                  FREE
                </span>
              ) : (
                <span className="font-poppins font-semibold text-slate-800">
                  {formatCurrency(99)}
                </span>
              )}
            </span>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
            <span className="font-poppins font-bold text-sm text-slate-900">
              Grand Total
            </span>
            <div className="text-right">
              <span className="font-poppins font-black text-xl text-accent">
                {formatCurrency(grandTotal)}
              </span>
              <p className="text-[10px] text-slate-400 font-inter">
                Includes all taxes &amp; shipping
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="flex-1 py-3 px-6 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Wholesale Checkout</span>
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-poppins text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-inter">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>100% Blind Shipping Guaranteed • Official GST Tax Invoices</span>
        </div>
      </div>
    </div>
  );
});

export default ProfileCartTab;
