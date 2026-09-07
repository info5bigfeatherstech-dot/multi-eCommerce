"use client";

import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  Package,
  MessageSquare,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export function DropshippingForm({ onSubmitted, isCompact = false }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    platform: "shopify",
    category: "Home & Living",
    orderVolume: "50-200",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSubmitted) onSubmitted(formData);
    }, 1000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      platform: "shopify",
      category: "Home & Living",
      orderVolume: "50-200",
      notes: "",
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6 px-4 space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
        </div>
        <div className="space-y-1">
          <h4 className="font-poppins font-bold text-sm sm:text-base text-slate-900">
            Dropship Application Received!
          </h4>
          <p className="text-xs font-inter text-slate-500 max-w-xs mx-auto leading-relaxed">
            Welcome aboard, <strong className="text-slate-800">{formData.name}</strong>. Our dropshipping onboarding manager will send your API/CSV catalog access via WhatsApp.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <a
            href={`https://wa.me/919876543210?text=Hello%20Team%2C%20I%20applied%20for%20Dropshipping%20on%20${encodeURIComponent(formData.platform)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs transition-colors shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-poppins font-bold text-xs transition-colors cursor-pointer"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      {/* Name & Phone */}
      <div className={isCompact ? "space-y-2.5" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
        <div className="space-y-1">
          <label className="text-[11px] font-poppins font-bold text-slate-700 flex items-center gap-1">
            <span>Full Name</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Amit Verma"
            className="w-full px-3 py-2 text-xs font-inter rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-poppins font-bold text-slate-700 flex items-center gap-1">
            <span>WhatsApp / Phone</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full px-3 py-2 text-xs font-inter rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
          />
        </div>
      </div>

      {/* Selling Platform & Category */}
      <div className={isCompact ? "space-y-2.5" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
        <div className="space-y-1">
          <label className="text-[11px] font-poppins font-bold text-slate-700">
            Where do you sell?
          </label>
          <Select
            value={formData.platform}
            onValueChange={(val) => setFormData({ ...formData, platform: val })}
          >
            <SelectTrigger className="w-full h-9 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-inter focus:ring-1 focus:ring-accent">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shopify">Shopify Store</SelectItem>
              <SelectItem value="amazon-flipkart">Amazon / Flipkart</SelectItem>
              <SelectItem value="instagram-social">Instagram / Social Commerce</SelectItem>
              <SelectItem value="woocommerce">WooCommerce / Custom Website</SelectItem>
              <SelectItem value="new-starter">Starting New Dropship Store</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-poppins font-bold text-slate-700">
            Niche Category
          </label>
          <Select
            value={formData.category}
            onValueChange={(val) => setFormData({ ...formData, category: val })}
          >
            <SelectTrigger className="w-full h-9 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-inter focus:ring-1 focus:ring-accent">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Home & Living">Home & Living</SelectItem>
              <SelectItem value="Kitchen & Dining">Kitchen & Dining</SelectItem>
              <SelectItem value="Electronics & Gadgets">Electronics & Gadgets</SelectItem>
              <SelectItem value="Beauty & Personal Care">Beauty & Personal Care</SelectItem>
              <SelectItem value="Jewellery & Accessories">Jewellery & Accessories</SelectItem>
              <SelectItem value="All Trending Products">All Trending Products</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expected Daily/Monthly Orders */}
      <div className="space-y-1">
        <label className="text-[11px] font-poppins font-bold text-slate-700">
          Estimated Monthly Orders
        </label>
        <Select
          value={formData.orderVolume}
          onValueChange={(val) => setFormData({ ...formData, orderVolume: val })}
        >
          <SelectTrigger className="w-full h-9 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-inter focus:ring-1 focus:ring-accent">
            <SelectValue placeholder="Select Volume" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under-50">Under 50 Orders / Month (Getting Started)</SelectItem>
            <SelectItem value="50-200">50 - 200 Orders / Month</SelectItem>
            <SelectItem value="200-1000">200 - 1,000 Orders / Month (Active Seller)</SelectItem>
            <SelectItem value="1000+">1,000+ Orders / Month (High Volume Scale)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Message / Store URL */}
      <div className="space-y-1">
        <label className="text-[11px] font-poppins font-bold text-slate-700">
          Website / Store Link or Notes
        </label>
        <textarea
          rows={isCompact ? 2 : 3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Enter your store link or any questions about blind shipping..."
          className="w-full px-3 py-2 text-xs font-inter rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all resize-none"
        />
      </div>

      {/* Submit Button & Trust Features */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Button
          type="submit"
          variant="coral"
          size="sm"
          disabled={isSubmitting}
          className="w-fit inline-flex px-6 py-2.5 rounded-xl font-poppins font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all active:scale-98 items-center justify-center gap-1.5 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Submitting Dropship Form...</span>
          ) : (
            <>
              <Truck className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Apply for Dropshipping</span>
            </>
          )}
        </Button>

        {/* Dropship Features Strip */}
        <div className="flex items-center gap-4 text-[10px] font-inter text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Blind Dispatch (No Logo)
          </span>
          <span className="flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-blue-600" />
            Zero Inventory Risk
          </span>
        </div>
      </div>
    </form>
  );
}

export default DropshippingForm;
