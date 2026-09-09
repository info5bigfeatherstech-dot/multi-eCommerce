import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateWebsiteContent } from "@/store/slices/adminWebsiteSlice";
import {
  FileText,
  Building2,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Globe,
  Share2,
  Megaphone,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";

export default function WebsiteContentView() {
  const dispatch = useAppDispatch();
  const content = useAppSelector(
    (state) =>
      state.adminWebsite?.content || {
        brandName: "IndiCraft Global",
        tagline: "India's Finest Multi-Category E-Commerce & B2B Distribution Hub",
        supportEmail: "support@indicraftstore.com",
        supportPhone: "+91 80 4567 8900",
        whatsappNumber: "+91 98200 11223",
        headquarters:
          "Level 4, Prestige Tech Park, Marathahalli-Sarjapur Ring Rd, Bengaluru, Karnataka 560103",
        workingHours: "Monday – Saturday: 9:00 AM – 8:00 PM IST",
        socialLinks: {
          instagram: "https://instagram.com/indicraft_global",
          facebook: "https://facebook.com/indicraftglobal",
          linkedin: "https://linkedin.com/company/indicraft",
          youtube: "https://youtube.com/@indicraftstore",
        },
        announcementBarText:
          "🎉 Grand Festive Sale Live! Extra 10% instant discount on UPI prepaid checkouts. Free Delivery across India.",
      }
  );

  const [formData, setFormData] = useState({
    brandName: content.brandName || "",
    tagline: content.tagline || "",
    supportEmail: content.supportEmail || "",
    supportPhone: content.supportPhone || "",
    whatsappNumber: content.whatsappNumber || "",
    headquarters: content.headquarters || "",
    workingHours: content.workingHours || "",
    announcementBarText: content.announcementBarText || "",
    socialLinks: {
      instagram: content.socialLinks?.instagram || "",
      facebook: content.socialLinks?.facebook || "",
      linkedin: content.socialLinks?.linkedin || "",
      youtube: content.socialLinks?.youtube || "",
    },
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (network, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value,
      },
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateWebsiteContent(formData));
    toast.success("Website content and global text settings updated!");
  };

  const handleReset = () => {
    setFormData({
      brandName: content.brandName,
      tagline: content.tagline,
      supportEmail: content.supportEmail,
      supportPhone: content.supportPhone,
      whatsappNumber: content.whatsappNumber,
      headquarters: content.headquarters,
      workingHours: content.workingHours,
      announcementBarText: content.announcementBarText,
      socialLinks: { ...content.socialLinks },
    });
    toast.info("Reset form to current saved state.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Website Content & Media Text
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
              <Building2 className="h-3 w-3" /> Global Identity
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configure global store identity, customer support hotlines, operating hours, and social media channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RotateCcw className="h-4 w-4 text-slate-500" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Live Announcement Bar Preview Banner */}
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-3.5 text-white shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs overflow-hidden">
          <span className="rounded-md bg-white/20 px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
            Live Bar Preview
          </span>
          <span className="truncate">{formData.announcementBarText || "Enter announcement text below..."}</span>
        </div>
        <span className="shrink-0 text-xs text-indigo-200 font-medium">Store Header</span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: "general", label: "Brand & Identity", icon: Building2 },
          { id: "support", label: "Customer Care & Location", icon: Phone },
          { id: "announcement", label: "Announcement & Ticker", icon: Megaphone },
          { id: "social", label: "Social Media Links", icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === "general" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Store Brand & Tagline
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The primary branding shown across headers, footers, invoice printouts, and automated emails.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brandName}
                  onChange={(e) => handleChange("brandName", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Customer Care & Corporate Address
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Contact channels shown on Contact Us, Dropshipping Portal, and Order confirmation footers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Support Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => handleChange("supportEmail", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Toll-Free Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.supportPhone}
                    onChange={(e) => handleChange("supportPhone", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  WhatsApp Support
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Headquarters / Warehouse Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <textarea
                    rows={3}
                    value={formData.headquarters}
                    onChange={(e) => handleChange("headquarters", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Customer Support Operating Hours
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <textarea
                    rows={3}
                    value={formData.workingHours}
                    onChange={(e) => handleChange("workingHours", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "announcement" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Top Announcement Bar & Header Marquee
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Displays at the very top of all store pages to highlight discounts, shipping policies, or flash deals.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Announcement Message Text
              </label>
              <textarea
                rows={3}
                value={formData.announcementBarText}
                onChange={(e) => handleChange("announcementBarText", e.target.value)}
                placeholder="e.g. Free shipping on all orders over ₹499. Use coupon FIRST10 for 10% off."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Emojis are fully supported. Recommended character count: 80 - 140 chars.
              </span>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Social Media Profiles & Channels
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Links rendered on the storefront footer, customer emails, and mobile navigation drawer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Instagram Profile URL
                </label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-600" />
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleSocialChange("instagram", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Facebook Page URL
                </label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleSocialChange("facebook", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  LinkedIn Company URL
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-700" />
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  YouTube Channel URL
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600" />
                  <input
                    type="url"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => handleSocialChange("youtube", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
          >
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}
