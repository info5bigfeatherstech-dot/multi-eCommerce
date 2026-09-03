"use client";

import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export function NormalInquiryForm({ onSubmitted, isCompact = false }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    inquiryType: "wholesale-quote",
    message: "",
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
      inquiryType: "wholesale-quote",
      message: "",
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6 px-4 space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
        </div>
        <div className="space-y-1">
          <h4 className="font-poppins font-bold text-sm sm:text-base text-slate-900">
            Inquiry Sent Successfully!
          </h4>
          <p className="text-xs font-inter text-slate-500 max-w-xs mx-auto leading-relaxed">
            Thank you, <strong className="text-slate-800">{formData.name}</strong>. Our team will contact you via WhatsApp/call within 2 hours.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <a
            href={`https://wa.me/919876543210?text=Hello%20I%20just%20submitted%20an%20inquiry%20for%20${encodeURIComponent(formData.inquiryType)}`}
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
            New Inquiry
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
            <span>Your Name</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Rajesh Sharma"
            className="w-full px-3 py-2 text-xs font-inter rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-poppins font-bold text-slate-700 flex items-center gap-1">
            <span>Mobile / WhatsApp</span>
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

      {/* Inquiry Type / Category */}
      <div className="space-y-1">
        <label className="text-[11px] font-poppins font-bold text-slate-700">
          Inquiry Type / Requirement
        </label>
        <Select
          value={formData.inquiryType}
          onValueChange={(val) => setFormData({ ...formData, inquiryType: val })}
        >
          <SelectTrigger className="w-full h-9 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-inter focus:ring-1 focus:ring-accent">
            <SelectValue placeholder="Select Inquiry Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wholesale-quote">Wholesale Bulk Pricing & Quote</SelectItem>
            <SelectItem value="product-sample">Sample Piece / Trial Order</SelectItem>
            <SelectItem value="custom-branding">Custom Logo & Packaging</SelectItem>
            <SelectItem value="general-inquiry">General Question / Product Check</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Message / Details */}
      <div className="space-y-1">
        <label className="text-[11px] font-poppins font-bold text-slate-700">
          Message / Products Interested In
        </label>
        <textarea
          rows={isCompact ? 2 : 3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us what products or quantities you are looking for..."
          className="w-full px-3 py-2 text-xs font-inter rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="coral"
        size="sm"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl font-poppins font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
      >
        {isSubmitting ? (
          <span>Sending Inquiry...</span>
        ) : (
          <>
            <Send className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Send Normal Inquiry</span>
          </>
        )}
      </Button>

      <div className="flex items-center justify-between text-[10px] font-inter text-slate-400 pt-1">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Direct Factory Response
        </span>
        <span>Replies in ~2 Hours</span>
      </div>
    </form>
  );
}

export default NormalInquiryForm;
