"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
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

const FAQS = [
  {
    q: "What is your Minimum Order Quantity (MOQ)?",
    a: "We have ZERO MOQ on most catalog products! You can purchase as little as 1 sample piece or 10,000 bulk wholesale pieces at genuine factory pricing.",
  },
  {
    q: "How do I receive a GST Tax Invoice for my business?",
    a: "All orders automatically generate a 100% compliant GST Tax Invoice. Simply enter your company name and GSTIN during checkout to claim your full input tax credit.",
  },
  {
    q: "What are the shipping charges and delivery timelines across India?",
    a: "We provide Free Express Delivery on orders over ₹599. Metro cities receive delivery in 2-3 business days, while all other tier 2/3 locations are delivered within 4-5 business days.",
  },
  {
    q: "Can I inspect or return damaged wholesale shipments?",
    a: "Yes! We provide a 7-day hassle-free replacement or full refund policy for any transit-damaged or defective units with dedicated WhatsApp photo verification.",
  },
];

export function ContactPage({ onBack: propOnBack }) {
  const navigate = useNavigate();
  const handleBack = propOnBack || (() => navigate("/"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "wholesale",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "wholesale",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <div className="py-6 space-y-10 animate-fadeIn">
      {/* Top Header & Back Button */}
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
            <Sparkles className="w-3.5 h-3.5" />
            2-Hour SLA Response Time
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-poppins font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Wholesale Desk
          </span>
        </div>
      </div>

      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-poppins font-bold uppercase tracking-wider text-accent">
          Customer Support & Helpdesk
        </span>
        <h1 className="text-3xl sm:text-4xl font-poppins font-black text-slate-900 tracking-tight">
          We’re Here to Help Your Business Grow
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-inter leading-relaxed">
          Have questions about bulk order pricing, order dispatches, GST invoicing, or custom packaging? Contact our dedicated executive team anytime.
        </p>
      </div>

      {/* 4 Contact Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Phone */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-poppins font-bold text-base text-slate-900">Phone Support</h3>
            <p className="text-xs text-slate-500 font-inter">
              Direct line for order queries & immediate wholesale consultations.
            </p>
            <div className="space-y-1">
              <p className="font-poppins font-bold text-sm text-slate-800">+91 1800-123-4567</p>
              <p className="font-poppins font-semibold text-xs text-slate-500">+91 98765 43210 (Direct)</p>
            </div>
          </div>
          <a
            href="tel:+9118001234567"
            className="w-full mt-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-poppins font-bold text-xs text-center transition-colors"
          >
            Call Support Now
          </a>
        </div>

        {/* WhatsApp */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-poppins font-bold text-base text-slate-900">WhatsApp Desk</h3>
            <p className="text-xs text-slate-500 font-inter">
              Instant product pictures, wholesale stock updates & live assistance.
            </p>
            <div className="space-y-1">
              <p className="font-poppins font-bold text-sm text-emerald-700">+91 98765 43210</p>
              <p className="font-inter text-xs text-slate-400">Average response: 3 mins</p>
            </div>
          </div>
          <a
            href="https://wa.me/919876543210?text=Hello%20Wholesale%20Team"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs text-center transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Email */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-poppins font-bold text-base text-slate-900">Official Email</h3>
            <p className="text-xs text-slate-500 font-inter">
              Send purchase orders, GST vendor onboarding & official inquiries.
            </p>
            <div className="space-y-1">
              <p className="font-poppins font-bold text-xs text-slate-800 truncate">wholesale@b2btrade.com</p>
              <p className="font-poppins font-semibold text-xs text-slate-500 truncate">support@b2btrade.com</p>
            </div>
          </div>
          <a
            href="mailto:wholesale@b2btrade.com"
            className="w-full mt-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-poppins font-bold text-xs text-center transition-colors"
          >
            Email Wholesale Team
          </a>
        </div>

        {/* Warehouse */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-poppins font-bold text-base text-slate-900">Warehouse Hub</h3>
            <p className="text-xs text-slate-500 font-inter">
              Central dispatch & fulfillment center for all pan-India shipments.
            </p>
            <p className="font-inter text-xs text-slate-700 leading-relaxed">
              Plot 42, GIDC Industrial Area, Naroda, Ahmedabad, Gujarat - 382330
            </p>
          </div>
          <div className="w-full mt-3 py-2 rounded-xl bg-slate-100 text-slate-600 font-poppins font-semibold text-xs text-center">
            Mon-Sat: 9AM - 7PM IST
          </div>
        </div>
      </div>

      {/* Main Interactive Contact Form & Operations Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-poppins font-bold text-slate-900">
              Send Us a Message
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-inter">
              Fill in your inquiry details below. Our wholesale executive will get back to you promptly.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-poppins font-bold text-emerald-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700 font-inter max-w-md mx-auto">
                  Thank you for reaching out. A confirmation has been logged, and our team will contact you within 2 business hours.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-poppins font-bold hover:bg-emerald-800 transition-colors shadow-sm"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    Phone / WhatsApp <span className="text-rose-500">*</span>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-poppins font-bold text-slate-700">
                    Department
                  </label>
                  <Select
                    value={formData.department}
                    onValueChange={(val) => setFormData({ ...formData, department: val })}
                  >
                    <SelectTrigger className="w-full h-10 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-inter focus:ring-1 focus:ring-accent">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wholesale">Wholesale Orders & Quotes</SelectItem>
                      <SelectItem value="dispatch">Order Tracking & Logistics</SelectItem>
                      <SelectItem value="gst">GST Invoices & Accounts</SelectItem>
                      <SelectItem value="returns">Damages & Return Claims</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-poppins font-bold text-slate-700">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Bulk purchase pricing for Kitchen storage items"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-poppins font-bold text-slate-700">
                  Message / Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your requirements or questions in detail..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-xs font-inter transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Support</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Info: Business Hours & Trust Badges */}
        <div className="lg:col-span-5 space-y-6">
          {/* Operating Hours Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-base text-white">Business & Dispatch Hours</h3>
                <p className="text-xs text-slate-400 font-inter">Live support operates on IST timezone</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-inter">
              <div className="flex justify-between text-slate-300">
                <span>Monday - Friday:</span>
                <span className="font-semibold text-white">9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Saturday:</span>
                <span className="font-semibold text-white">9:30 AM - 5:30 PM</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Sunday:</span>
                <span className="text-accent font-semibold">Emergency WhatsApp Only</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800/80">
                <span>Daily Dispatch Cutoff:</span>
                <span className="text-emerald-400 font-semibold">4:00 PM Daily</span>
              </div>
            </div>
          </div>

          {/* Wholesale Guarantees */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-poppins font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Direct Factory Trade Commitments
            </h3>

            <div className="space-y-3 text-xs font-inter text-slate-600">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p><strong>100% Tax Compliant:</strong> Instant GST invoices with valid HSN codes for ITC claim.</p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p><strong>Verified Packaging:</strong> Multi-layer corrugated packaging for zero damage transit.</p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p><strong>Dedicated Manager:</strong> Real human support assigned to high-volume trade accounts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1 text-center max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-poppins font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 font-inter">
            Common questions answered regarding orders, shipping, and wholesale policies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-accent/40 transition-all cursor-pointer space-y-2 bg-slate-50/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-poppins font-bold text-xs text-slate-800">
                    {faq.q}
                  </h4>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-slate-400 transition-transform duration-300 flex-shrink-0",
                      isOpen ? "rotate-180 text-accent" : ""
                    )}
                  />
                </div>
                {isOpen && (
                  <p className="text-[11px] text-slate-600 font-inter leading-relaxed pt-1 border-t border-slate-200/60 animate-fadeIn">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
