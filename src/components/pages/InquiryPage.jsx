"use client";

import React, { useState } from "react";
import {
  FileText,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Send,
  HelpCircle,
  Clock,
  Coins,
  MessageSquare,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Home & Living",
  "Kitchen & Dining",
  "Electronics & Gadgets",
  "Beauty & Personal Care",
  "Sports & Fitness",
  "Jewellery & Accessories",
  "Home Decor",
  "Stationery, Office & School",
  "Gifts & Lifestyle",
  "Travel & Outdoor",
  "Mix Items & Clearance",
];

export function InquiryPage({ onBack: propOnBack }) {
  const navigate = useNavigate();
  const handleBack = propOnBack || (() => navigate("/"));
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    businessType: "offline-retailer",
    gstin: "",
    phone: "",
    email: "",
    cityState: "",
    category: "Home & Living",
    productSkus: "",
    quantityTier: "100-500",
    monthlyBudget: "50k-1lakh",
    customBranding: "no",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedRef = "INQ-" + Math.floor(100000 + Math.random() * 900000);
      setSubmittedRef(generatedRef);
    }, 1300);
  };

  return (
    <div className="py-6 space-y-10 animate-fadeIn">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-poppins font-bold text-slate-600 hover:text-accent group transition-colors self-start cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 group-hover:border-accent flex items-center justify-center transition-all shadow-xs">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-poppins font-bold bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20">
            <Coins className="w-3.5 h-3.5" />
            Tiered Wholesale Pricing
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-poppins font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
            <FileText className="w-3.5 h-3.5" />
            Formal Quotations Ready
          </span>
        </div>
      </div>

      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-poppins font-bold uppercase tracking-wider text-accent">
          Direct Factory Sourcing
        </span>
        <h1 className="text-3xl sm:text-4xl font-poppins font-black text-slate-900 tracking-tight">
          B2B Wholesale & Bulk Inquiry Form
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-inter leading-relaxed">
          Submit your bulk merchandise requirements below. Our wholesale pricing team will prepare a formal GST-compliant quotation with tier discounts within 2 business hours.
        </p>
      </div>

      {/* Submission Success State */}
      {submittedRef ? (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-poppins font-bold uppercase tracking-wider text-emerald-600">
              Inquiry Registered Successfully
            </span>
            <h2 className="text-2xl font-poppins font-black text-slate-900">
              Quotation Request #{submittedRef}
            </h2>
            <p className="text-sm text-slate-600 font-inter max-w-lg mx-auto">
              We have received your wholesale requirement. A dedicated key account manager will review your quantities and reach out via WhatsApp and Email within 2 hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs font-inter max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Company / Name:</span>
              <span className="font-bold text-slate-800">{formData.companyName || formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-bold text-slate-800">{formData.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Quantity:</span>
              <span className="font-bold text-accent">{formData.quantityTier} Units</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={`https://wa.me/919876543210?text=Hello%20Team%2C%20I%20just%20submitted%20inquiry%20reference%20${submittedRef}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp Now</span>
            </a>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-poppins font-bold text-xs transition-all shadow-sm"
            >
              Return to Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Inquiry Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Business Profile */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Building className="w-4 h-4 text-accent" />
                  <h3 className="font-poppins font-bold text-sm text-slate-800 uppercase tracking-wide">
                    1. Business & Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-poppins font-bold text-slate-700">
                      Contact Person Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-poppins font-bold text-slate-700">
                      Business / Shop Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Sharma Enterprises & Retail"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-poppins font-bold text-slate-700">
                      Business Type
                    </label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(val) => setFormData({ ...formData, businessType: val })}
                    >
                      <SelectTrigger className="w-full h-10 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-inter focus:ring-1 focus:ring-accent">
                        <SelectValue placeholder="Select Business Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offline-retailer">Offline Retail Shop</SelectItem>
                        <SelectItem value="online-seller">Amazon / Flipkart Seller</SelectItem>
                        <SelectItem value="dropshipper">Dropshipper / Reseller</SelectItem>
                        <SelectItem value="corporate-gift">Corporate Gifter / Event</SelectItem>
                        <SelectItem value="wholesaler">Regional Wholesaler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-poppins font-bold text-slate-700">
                      GSTIN Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      placeholder="24AAAAA0000A1Z5"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter uppercase transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-poppins font-bold text-slate-700">
                      City & State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cityState}
                      onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-poppins font-bold text-slate-700">
                      Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-poppins font-bold text-slate-700">
                      Official Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="purchasing@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Wholesale Requirement */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Package className="w-4 h-4 text-accent" />
                  <h3 className="font-poppins font-bold text-sm text-slate-800 uppercase tracking-wide">
                    2. Product & Quantity Requirement
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-poppins font-bold text-slate-700">
                      Primary Department
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => setFormData({ ...formData, category: val })}
                    >
                      <SelectTrigger className="w-full h-10 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-inter focus:ring-1 focus:ring-accent">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-poppins font-bold text-slate-700">
                      Estimated Order Quantity
                    </label>
                    <Select
                      value={formData.quantityTier}
                      onValueChange={(val) => setFormData({ ...formData, quantityTier: val })}
                    >
                      <SelectTrigger className="w-full h-10 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-inter focus:ring-1 focus:ring-accent">
                        <SelectValue placeholder="Select Quantity Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50-100">50 - 100 Units (Starter Lot)</SelectItem>
                        <SelectItem value="100-500">100 - 500 Units (Standard Trade)</SelectItem>
                        <SelectItem value="500-2000">500 - 2,000 Units (Master Carton)</SelectItem>
                        <SelectItem value="2000+">2,000+ Units (Container Load)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-poppins font-bold text-slate-700">
                      Monthly Sourcing Budget
                    </label>
                    <Select
                      value={formData.monthlyBudget}
                      onValueChange={(val) => setFormData({ ...formData, monthlyBudget: val })}
                    >
                      <SelectTrigger className="w-full h-10 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-inter focus:ring-1 focus:ring-accent">
                        <SelectValue placeholder="Select Monthly Budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                        <SelectItem value="50k-1lakh">₹50,000 - ₹1,00,000</SelectItem>
                        <SelectItem value="1lakh-5lakh">₹1,00,000 - ₹5,00,000</SelectItem>
                        <SelectItem value="5lakh+">₹5,00,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    Target Products / Specific SKUs
                  </label>
                  <input
                    type="text"
                    value={formData.productSkus}
                    onChange={(e) => setFormData({ ...formData, productSkus: e.target.value })}
                    placeholder="e.g. Wireless Earbuds, Kitchen Choppers, Nano Tape, Thermal Flasks..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    Additional Requirement Notes or Customization Requests
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Include details such as target price point, delivery deadline, packaging requests, or sample needs..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter transition-all resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Generating Wholesale Quotation...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Wholesale Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Information & Perks Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Wholesale Tier Card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-base text-white">Tiered Volume Pricing</h3>
                  <p className="text-xs text-slate-400 font-inter">Direct factory wholesale slab benefits</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs font-inter">
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                  <span className="text-slate-300">50 - 100 Units:</span>
                  <span className="text-accent font-bold">Standard Wholesale</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                  <span className="text-slate-300">100 - 500 Units:</span>
                  <span className="text-emerald-400 font-bold">Extra 8% Off</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                  <span className="text-slate-300">500 - 2000 Units:</span>
                  <span className="text-emerald-400 font-bold">Extra 15% Off</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                  <span className="text-slate-300">2000+ Units:</span>
                  <span className="text-yellow-400 font-bold">Direct Factory Import Rate</span>
                </div>
              </div>
            </div>

            {/* Wholesale Guarantees */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-poppins font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Why B2B Wholesale Buyers Choose Us
              </h3>

              <div className="space-y-3 text-xs font-inter text-slate-600">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <p><strong>Guaranteed Lowest Price:</strong> If you find a lower wholesale rate for identical specs, we beat it.</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <p><strong>Fast Dispatch Hub:</strong> Naroda, Ahmedabad warehouse dispatches up to 5,000 cartons daily.</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <p><strong>Sample Testing:</strong> Order single-piece samples to inspect quality before placing container orders.</p>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Support */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md space-y-2 text-center">
              <h4 className="font-poppins font-bold text-sm">Need a Fast Quote on WhatsApp?</h4>
              <p className="text-xs text-emerald-100 font-inter">
                Send SKU screenshots to our wholesale executive for instant rates.
              </p>
              <a
                href="https://wa.me/919876543210?text=Hello%20Wholesale%20Team%2C%20I%20need%20a%20bulk%20quote"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 px-4 py-2 rounded-xl bg-white text-emerald-800 font-poppins font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm"
              >
                Open WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InquiryPage;
