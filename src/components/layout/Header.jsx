"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { siteConfig } from "@/config/site";
import SearchBar from "./SearchBar";
import { formatCurrency } from "@/lib/utils";
import {
  User,
  Heart,
  ShoppingBag,
  Store,
  Menu,
  ShieldCheck,
  ChevronDown,
  Package,
  FileText,
  LogOut,
  Phone,
  MessageSquare,
  Mail,
  Headphones,
  ClipboardList,
  ArrowUpRight,
  Coins,
  Sparkles,
  Truck,
} from "lucide-react";
import { toggleMobileDrawer, toggleCartDrawer } from "@/store/slices/uiSlice";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlistCount = useAppSelector((state) => state.wishlist.totalCount);
  const { totalCount: cartCount, totalAmount: cartAmount } = useAppSelector(
    (state) => state.cart
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-1">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-primary via-primary-700 to-primary text-white shadow-xl border border-primary-light/40 rounded-2xl px-4 sm:px-5 py-2.5 transition-all">
        <div className="flex items-center justify-between gap-3 lg:gap-6">

          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => dispatch(toggleMobileDrawer())}
              aria-label="Toggle Mobile Menu"
              className="lg:hidden p-2 rounded-lg bg-primary-light/40 hover:bg-primary-light text-white focus:outline-none"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
                <Store className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-poppins font-black text-xl tracking-tight text-white group-hover:text-accent transition-colors">
                    {siteConfig.name}
                  </span>
                  <span className="hidden sm:inline-flex items-center justify-center p-0.5 rounded-full bg-accent/20 text-accent">
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </div>
                <span className="font-poppins text-[9px] font-black tracking-widest text-accent uppercase mt-0.5">
                  {siteConfig.logoSubtext}
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <SearchBar />
          </div>

          {/* Right of Search Bar: Dropshipping & Inquiry Buttons (Navigate directly to their page) */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            {/* 1. Dropshipping Page Button */}
            <button
              onClick={() => navigate("/dropshipping")}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all duration-200 focus:outline-none shadow-xs hover:border-white/20 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 group-hover:text-blue-300 flex items-center justify-center transition-colors">
                <Truck className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-poppins font-medium text-slate-300">
                  Blind Dispatch
                </span>
                <span className="text-xs font-poppins font-bold text-white group-hover:text-accent transition-colors">
                  Dropshipping
                </span>
              </div>
            </button>

            {/* 2. Inquiry Page Button */}
            <button
              onClick={() => navigate("/inquiry")}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-accent/20 hover:bg-accent/30 border border-accent/40 text-left transition-all duration-200 focus:outline-none shadow-xs cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-accent/30 text-accent group-hover:text-white flex items-center justify-center transition-colors">
                <ClipboardList className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-poppins font-medium text-accent">
                  Direct Quotes
                </span>
                <span className="text-xs font-poppins font-bold text-white group-hover:text-accent-hover transition-colors">
                  Inquiry Form
                </span>
              </div>
            </button>
          </div>

          {/* Right: Account, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* Account Dropdown (Shadcn DropdownMenu) */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all duration-200 focus:outline-none shadow-xs hover:border-white/20">
                <User className="w-5 h-5 text-white stroke-[2]" />
                <div className="flex flex-col leading-tight hidden sm:flex">
                  <span className="text-[10px] font-poppins font-medium text-slate-300">
                    Hello, Sign in
                  </span>
                  <span className="text-xs font-poppins font-bold text-white flex items-center gap-1">
                    <span>Account</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Business Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <User className="w-4 h-4 text-accent" />
                  <span>Sign In / Register</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  <span>Wholesale Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>GST Invoices</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/contact")}
                  className="gap-2 cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-accent" />
                  <span>Help & Contact Desk</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist Button */}
            <button
              onClick={() => navigate("/wishlist")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all duration-200 focus:outline-none shadow-xs hover:border-white/20 cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <Heart className="w-5 h-5 text-white stroke-[2]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-md animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col leading-tight hidden sm:flex">
                <span className="text-[10px] font-poppins font-medium text-slate-300">
                  Saved Items
                </span>
                <span className="text-xs font-poppins font-bold text-white">
                  Wishlist
                </span>
              </div>
            </button>

            {/* Cart Button (Triggers CartDrawer) */}
            <button
              onClick={() => dispatch(toggleCartDrawer())}
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white border-none shadow-md hover:scale-[1.02] transition-all cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white stroke-[2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-accent shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col leading-tight hidden sm:flex">
                <span className="text-[10px] font-poppins font-medium text-white/90">
                  {cartCount} Items
                </span>
                <span className="text-xs font-poppins font-black text-white">
                  {formatCurrency(cartAmount)}
                </span>
              </div>
            </button>

          </div>

        </div>

        {/* Mobile Search Bar & Quick Links Row */}
        <div className="mt-2.5 md:hidden space-y-2">
          <SearchBar />
          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={() => navigate("/dropshipping")}
              className="flex-1 py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-poppins font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Dropshipping</span>
            </button>
            <button
              onClick={() => navigate("/inquiry")}
              className="flex-1 py-2 px-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-white text-xs font-poppins font-bold flex items-center justify-center gap-1.5 border border-accent/30 transition-colors cursor-pointer"
            >
              <ClipboardList className="w-3.5 h-3.5 text-accent" />
              <span>Inquiry Form</span>
            </button>
          </div>
        </div>

      </header>
    </div>
  );
}

export default Header;
