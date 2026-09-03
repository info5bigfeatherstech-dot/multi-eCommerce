"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  Store,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Send,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-primary text-slate-300 font-albert-sans border-t border-primary-light/30 mt-12 select-none">
      
      {/* 1. Newsletter Subscription Bar */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-dark border-b border-primary-light/20 py-10 px-4">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center lg:justify-start gap-2">
              <span>Join ApexMart Wholesale Insider</span>
              <span className="bg-accent/20 text-accent text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                B2B Deals
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-inter">
              Get instant updates on factory price drops, new bulk arrivals & GST invoice offers.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md flex items-center gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter your business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-primary-light/40 border border-primary-light/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-accent font-inter"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-accent hover:bg-accent-hover text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <span>{subscribed ? "Subscribed!" : "Subscribe"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main Multi-Column Footer Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Info (2 Cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="/" onClick={handleScrollToTop} className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent via-accent-400 to-accent-500 flex items-center justify-center text-white shadow-md">
                <Store className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-poppins font-black text-xl tracking-tight text-white group-hover:text-accent transition-colors leading-none">
                    {siteConfig.logoText || "ApexMart"}
                  </span>
                  <span className="bg-accent/20 text-accent p-0.5 rounded-full" title="Verified Wholesale Store">
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </div>
                <span className="font-poppins text-[9px] font-black tracking-widest text-accent uppercase mt-0.5">
                  {siteConfig.logoSubtext || "Wholesale Market"}
                </span>
              </div>
            </a>

            <p className="text-xs text-slate-400 font-inter leading-relaxed max-w-sm">
              Direct factory pricing with instant GST invoicing & zero MOQ. Supplying top-rated retailers & businesses across India.
            </p>

            {/* Contact details */}
            <div className="space-y-2 text-xs font-inter text-slate-300 pt-1">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span>+91 1800-123-4567 (Mon-Sat, 9AM-7PM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span>support@apexmartwholesale.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Apex Building, Corporate Park, Mumbai - 400001</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" onClick={handleScrollToTop} className="p-2 rounded-lg bg-primary-light/30 hover:bg-accent text-slate-300 hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" onClick={handleScrollToTop} className="p-2 rounded-lg bg-primary-light/30 hover:bg-accent text-slate-300 hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" onClick={handleScrollToTop} className="p-2 rounded-lg bg-primary-light/30 hover:bg-accent text-slate-300 hover:text-white transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" onClick={handleScrollToTop} className="p-2 rounded-lg bg-primary-light/30 hover:bg-accent text-slate-300 hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Top Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-poppins">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs font-inter text-slate-400">
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Electronics & Gadgets</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Kitchen & Dining</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Home & Living</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Home Decor</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Jewellery & Accessories</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Beauty & Personal Care</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-poppins">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs font-inter text-slate-400">
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Track Your Order</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">GST Invoice Claim</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Wholesale Bulk Query</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Shipping & Delivery Policy</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Returns & Replacement</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Help Center & FAQ</a></li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-poppins">
              Company Info
            </h4>
            <ul className="space-y-2 text-xs font-inter text-slate-400">
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">About ApexMart</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Direct Factory Network</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Become a Verified Supplier</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" onClick={handleScrollToTop} className="hover:text-accent transition-colors">Contact Us</a></li>
            </ul>
          </div>

        </div>

        {/* Trust Badges Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-primary-light/20 py-6 my-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-primary-light/40 text-accent">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">100% Verified Factories</p>
              <p className="text-[11px] text-slate-400 font-inter">Direct factory sourcing with quality check</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-primary-light/40 text-accent">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Express Pan-India Logistics</p>
              <p className="text-[11px] text-slate-400 font-inter">Fast doorstep dispatch with live tracking</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-primary-light/40 text-accent">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Instant GST Credit</p>
              <p className="text-[11px] text-slate-400 font-inter">Auto GST invoice for tax deduction</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-400 font-inter">
          <p>© 2026 ApexMart Wholesale. All Rights Reserved.</p>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-[11px] text-slate-500">Secured Payments:</span>
            <span className="px-2 py-1 bg-primary-light/40 rounded text-[10px] font-bold text-white">UPI</span>
            <span className="px-2 py-1 bg-primary-light/40 rounded text-[10px] font-bold text-white">VISA</span>
            <span className="px-2 py-1 bg-primary-light/40 rounded text-[10px] font-bold text-white">Mastercard</span>
            <span className="px-2 py-1 bg-primary-light/40 rounded text-[10px] font-bold text-white">NetBanking</span>
            <span className="px-2 py-1 bg-primary-light/40 rounded text-[10px] font-bold text-white">COD</span>
          </div>
        </div>

      </div>

    </footer>
  );
}

export default Footer;
