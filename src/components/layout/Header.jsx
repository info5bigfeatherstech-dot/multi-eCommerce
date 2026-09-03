"use client";

import React from "react";
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
} from "lucide-react";
import { toggleMobileDrawer, toggleCartDrawer, setCurrentView } from "@/store/slices/uiSlice";
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

            <button
              onClick={() => {
                dispatch(setCurrentView("home"));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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
            </button>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <SearchBar />
          </div>

          {/* Right of Search Bar: Dropping Contact & Inquiry Form */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {/* Contact Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all duration-200 focus:outline-none shadow-xs hover:border-white/20">
                <Headphones className="w-4 h-4 text-accent stroke-[2.2]" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-poppins font-medium text-slate-300">
                    Support Desk
                  </span>
                  <span className="text-xs font-poppins font-bold text-white flex items-center gap-1">
                    <span>Contact</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 p-2 space-y-1">
                <DropdownMenuLabel className="flex items-center justify-between pb-1">
                  <span>Support & Wholesale Desk</span>
                  <span className="text-[9px] bg-accent/15 text-accent px-1.5 py-0.5 rounded font-bold">IST Hours</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <a href="tel:+9118001234567" className="block">
                  <DropdownMenuItem className="gap-2.5 cursor-pointer py-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">+91 1800-123-4567</div>
                      <div className="text-[10px] text-slate-400">Toll-Free Support Line</div>
                    </div>
                  </DropdownMenuItem>
                </a>

                <a href="https://wa.me/919876543210?text=Hello%20Wholesale%20Support" target="_blank" rel="noopener noreferrer" className="block">
                  <DropdownMenuItem className="gap-2.5 cursor-pointer py-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-700">+91 98765 43210</div>
                      <div className="text-[10px] text-slate-400">WhatsApp Wholesale Chat</div>
                    </div>
                  </DropdownMenuItem>
                </a>

                <a href="mailto:wholesale@b2btrade.com" className="block">
                  <DropdownMenuItem className="gap-2.5 cursor-pointer py-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 truncate">wholesale@b2btrade.com</div>
                      <div className="text-[10px] text-slate-400">Email Inquiries (2h SLA)</div>
                    </div>
                  </DropdownMenuItem>
                </a>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => dispatch(setCurrentView("contact"))}
                  className="gap-2 py-2 text-accent focus:text-accent font-bold justify-between"
                >
                  <span>Open Full Contact Page</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Inquiry Form Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/20 hover:bg-accent/30 border border-accent/40 text-left transition-all duration-200 focus:outline-none shadow-xs">
                <ClipboardList className="w-4 h-4 text-accent stroke-[2.2]" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-poppins font-medium text-accent">
                    B2B Quotes
                  </span>
                  <span className="text-xs font-poppins font-bold text-white flex items-center gap-1">
                    <span>Inquiry Form</span>
                    <ChevronDown className="w-3 h-3 text-slate-300" />
                  </span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 p-2 space-y-1">
                <DropdownMenuLabel className="flex items-center justify-between pb-1">
                  <span>B2B Wholesale Inquiries</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Zero MOQ</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => dispatch(setCurrentView("inquiry"))}
                  className="gap-2.5 cursor-pointer py-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Wholesale Volume Quote</div>
                    <div className="text-[10px] text-slate-400">Tiered pricing for 50-10,000+ units</div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => dispatch(setCurrentView("inquiry"))}
                  className="gap-2.5 cursor-pointer py-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Dropshipping Inquiry</div>
                    <div className="text-[10px] text-slate-400">Blind dispatch & CSV feeds</div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => dispatch(setCurrentView("inquiry"))}
                  className="gap-2.5 cursor-pointer py-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Custom Brand Packaging</div>
                    <div className="text-[10px] text-slate-400">Private label & logo printing</div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => dispatch(setCurrentView("inquiry"))}
                  className="gap-2 py-2 text-white bg-accent hover:bg-accent-hover focus:bg-accent-hover font-bold justify-between rounded-lg shadow-sm"
                >
                  <span>Fill Inquiry Form Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                dispatch(setCurrentView("wishlist"));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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
              onClick={() => {
                dispatch(setCurrentView("contact"));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-poppins font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
            >
              <Headphones className="w-3.5 h-3.5 text-accent" />
              <span>Contact Desk</span>
            </button>
            <button
              onClick={() => {
                dispatch(setCurrentView("inquiry"));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex-1 py-1.5 px-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-white text-xs font-poppins font-bold flex items-center justify-center gap-1.5 border border-accent/30 transition-colors"
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
