"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { addItem, removeItem } from "@/store/slices/cartSlice";
import { formatCurrency } from "@/lib/utils";
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, ArrowRight, Tag } from "lucide-react";
import Button from "@/components/ui/Button";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const { isCartDrawerOpen } = useAppSelector((state) => state.ui);
  const { items: cartItems, totalCount, totalAmount } = useAppSelector(
    (state) => state.cart
  );

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary-dark/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={() => dispatch(setCartDrawerOpen(false))}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-fadeIn">
        
        {/* Drawer Header */}
        <div className="p-4 bg-primary text-white flex items-center justify-between border-b border-primary-light/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <span className="font-poppins font-bold text-base text-white">
              My Wholesale Cart
            </span>
            <span className="bg-accent text-white font-poppins text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              {totalCount} items
            </span>
          </div>
          <button
            onClick={() => dispatch(setCartDrawerOpen(false))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-primary-light/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-accent-light p-3 border-b border-accent-soft text-xs font-inter text-slate-700 flex items-center gap-2">
          <Tag className="w-4 h-4 text-accent flex-shrink-0" />
          <span>
            {totalAmount >= 599 ? (
              <strong className="text-accent font-poppins font-bold">
                🎉 Congratulations! You unlocked Free Shipping!
              </strong>
            ) : (
              <span>
                Add <strong>{formatCurrency(599 - totalAmount)}</strong> more for <strong>Free Shipping</strong>!
              </span>
            )}
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <ShoppingBag className="w-16 h-16 stroke-[1.2] text-slate-300" />
              <p className="font-poppins text-sm font-semibold text-slate-600">
                Your cart is empty
              </p>
              <p className="text-xs font-inter">
                Add products from the featured collection to build your order.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-poppins text-xs font-bold text-slate-800 line-clamp-1">
                    {item.name}
                  </h4>
                  <div className="text-xs font-poppins font-bold text-accent mt-0.5">
                    {formatCurrency(item.price)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-poppins font-bold text-slate-800 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(addItem(item))}
                        className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeItem(item.id))}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors ml-auto"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Drawer Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1 text-xs font-inter text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-poppins font-semibold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>GST Tax Credit Claim</span>
                <span>Includes 18% GST</span>
              </div>
              <div className="flex justify-between text-sm font-poppins font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-accent">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Button
              variant="coral"
              size="lg"
              className="w-full gap-2 shadow-xl font-poppins font-bold"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Proceed to Wholesale Checkout</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}

export default CartDrawer;
