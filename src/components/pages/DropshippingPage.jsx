"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  ArrowLeft,
  ShieldCheck,
  Package,
  Sparkles,
  Coins,
} from "lucide-react";
import DropshippingForm from "@/components/common/DropshippingForm";

export function DropshippingPage({ onBack: propOnBack }) {
  const navigate = useNavigate();
  const handleBack = propOnBack || (() => navigate("/"));

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-10 animate-fadeIn">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-poppins font-bold text-slate-600 hover:text-accent group transition-colors self-start cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 group-hover:border-accent flex items-center justify-center transition-all shadow-xs">
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-accent" />
          </div>
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-poppins font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
            <Truck className="w-3.5 h-3.5" />
            Same-Day Dispatch Across India
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-poppins font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Blind Shipping Guaranteed
          </span>
        </div>
      </div>

      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-poppins font-bold uppercase tracking-wider text-accent">
          Direct Manufacturer Reselling
        </span>
        <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-slate-900 tracking-tight">
          Dropshipping Partner Application
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-inter leading-relaxed">
          Scale your e-commerce store with zero inventory risk. We manufacture, store, pack, and blind-ship directly to your customers with your store label.
        </p>
      </div>

      {/* 4 Feature Highlights */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="font-poppins font-bold text-sm text-slate-900">
            Blind Dispatch
          </h4>
          <p className="text-xs text-slate-500 font-inter leading-relaxed">
            No factory labels or pricing. Packages ship strictly with your brand/store details.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <h4 className="font-poppins font-bold text-sm text-slate-900">
            True Factory Rates
          </h4>
          <p className="text-xs text-slate-500 font-inter leading-relaxed">
            Direct-from-plant pricing giving you 40% - 70% retail profit margins on every order.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-accent flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <h4 className="font-poppins font-bold text-sm text-slate-900">
            Zero MOQ Policy
          </h4>
          <p className="text-xs text-slate-500 font-inter leading-relaxed">
            Order single pieces as orders arrive on your store. Never get stuck with dead stock.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-poppins font-bold text-sm text-slate-900">
            Media & CSV Feeds
          </h4>
          <p className="text-xs text-slate-500 font-inter leading-relaxed">
            Ready-to-upload product photography, ad creatives, and 1-click Shopify import files.
          </p>
        </div>
      </div> */}

      {/* Main Content: Centered Form */}
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 space-y-1">
          <h3 className="font-poppins font-bold text-lg text-slate-900">
            Apply for Dropshipping Partner Account
          </h3>
          <p className="text-xs font-inter text-slate-500">
            Fill in your store details below. Our onboarding team activates your catalog access within 2 hours.
          </p>
        </div>

        <DropshippingForm />
      </div>
    </div>
  );
}

export default DropshippingPage;
