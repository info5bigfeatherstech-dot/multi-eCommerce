import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateSeoSettings } from "@/store/slices/adminWebsiteSlice";
import {
  Globe,
  Search,
  CheckCircle2,
  AlertCircle,
  Share2,
  Save,
  RotateCcw,
  Sparkles,
  BarChart3,
  Code2,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export default function SeoSettingsView() {
  const dispatch = useAppDispatch();
  const seo = useAppSelector(
    (state) =>
      state.adminWebsite?.seo || {
        defaultMetaTitle:
          "IndiCraft | Premium Multi-Category Shopping & Dropshipping",
        defaultMetaDescription:
          "Shop electronics, designer apparel, handcrafted homeware, and skincare. Enjoy instant COD, 48hr express delivery, and wholesale procurement rates.",
        keywords:
          "ecommerce, online shopping india, electronics, dropshipping india, wholesale supplier, craft ceramics, artisan fashion",
        canonicalDomain: "https://indicraftstore.com",
        ogImageUrl:
          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
        robotsIndex: true,
        googleAnalyticsId: "G-7X9942KLM1",
        metaPixelId: "884910294829102",
      }
  );

  const [formData, setFormData] = useState({
    defaultMetaTitle: seo.defaultMetaTitle || "",
    defaultMetaDescription: seo.defaultMetaDescription || "",
    keywords: seo.keywords || "",
    canonicalDomain: seo.canonicalDomain || "",
    ogImageUrl: seo.ogImageUrl || "",
    robotsIndex: seo.robotsIndex ?? true,
    googleAnalyticsId: seo.googleAnalyticsId || "",
    metaPixelId: seo.metaPixelId || "",
  });

  const [previewTab, setPreviewTab] = useState("google"); // "google" | "social"

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateSeoSettings(formData));
    toast.success("SEO and Search Engine metadata saved successfully!");
  };

  const handleReset = () => {
    setFormData({
      defaultMetaTitle: seo.defaultMetaTitle,
      defaultMetaDescription: seo.defaultMetaDescription,
      keywords: seo.keywords,
      canonicalDomain: seo.canonicalDomain,
      ogImageUrl: seo.ogImageUrl,
      robotsIndex: seo.robotsIndex,
      googleAnalyticsId: seo.googleAnalyticsId,
      metaPixelId: seo.metaPixelId,
    });
    toast.info("Reset SEO settings to saved configuration.");
  };

  const titleLength = formData.defaultMetaTitle.length;
  const descLength = formData.defaultMetaDescription.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              SEO Settings & Search Metadata
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <Sparkles className="h-3 w-3" /> SERP Optimization
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Fine-tune title tags, OpenGraph sharing cards, crawling directives, and conversion analytics tags.
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
            Save Settings
          </button>
        </div>
      </div>

      {/* Grid: Left Column Form, Right Column Live Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Meta Tags Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-base font-semibold text-slate-900">
                  Global Meta Tags & Keywords
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Applied as fallback for any storefront route without specific custom overrides.
                </p>
              </div>

              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase text-slate-600">
                    Default Meta Title *
                  </label>
                  <span
                    className={`text-xs font-medium ${
                      titleLength >= 40 && titleLength <= 65
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {titleLength} / 60 chars (Recommended: 50–60)
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.defaultMetaTitle}
                  onChange={(e) => handleChange("defaultMetaTitle", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase text-slate-600">
                    Default Meta Description *
                  </label>
                  <span
                    className={`text-xs font-medium ${
                      descLength >= 120 && descLength <= 165
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {descLength} / 160 chars (Recommended: 140–160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={formData.defaultMetaDescription}
                  onChange={(e) =>
                    handleChange("defaultMetaDescription", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Meta Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => handleChange("keywords", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Crawling & Domain Directive */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-base font-semibold text-slate-900">
                  Crawling & Indexing Directives
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instruct Googlebot, Bingbot, and web crawlers on canonical linking and indexing.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Canonical Base URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={formData.canonicalDomain}
                    onChange={(e) => handleChange("canonicalDomain", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  OpenGraph Social Share Image URL
                </label>
                <div className="relative">
                  <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={formData.ogImageUrl}
                    onChange={(e) => handleChange("ogImageUrl", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Robots Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/75">
                <div>
                  <div className="font-semibold text-slate-800 text-sm">
                    Search Engine Indexing (`robots.txt`)
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {formData.robotsIndex
                      ? "Allow search engines to index and rank website pages"
                      : "Disallow search engines (noindex, nofollow)"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleChange("robotsIndex", !formData.robotsIndex)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.robotsIndex ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      formData.robotsIndex ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Tracking Scripts / Analytics IDs */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-base font-semibold text-slate-900">
                  Analytics & Conversion Pixels
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Integrated tracking IDs injected into the storefront root document.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Google Analytics 4 ID
                  </label>
                  <div className="relative">
                    <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="G-XXXXXXXXXX"
                      value={formData.googleAnalyticsId}
                      onChange={(e) =>
                        handleChange("googleAnalyticsId", e.target.value)
                      }
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Meta Pixel ID
                  </label>
                  <div className="relative">
                    <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="884910294829102"
                      value={formData.metaPixelId}
                      onChange={(e) => handleChange("metaPixelId", e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
              >
                Save SEO Metadata
              </button>
            </div>
          </form>
        </div>

        {/* Live SERP & Social Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Live SERP & Social Preview
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setPreviewTab("google")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewTab === "google"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Google SERP
                </button>
                <button
                  onClick={() => setPreviewTab("social")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    previewTab === "social"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Social Card
                </button>
              </div>
            </div>

            {previewTab === "google" ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs font-sans">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                    IC
                  </div>
                  <div className="text-xs">
                    <div className="text-slate-900 font-medium">IndiCraft Store</div>
                    <div className="text-slate-500 font-mono text-[11px] truncate max-w-xs">
                      {formData.canonicalDomain || "https://indicraftstore.com"}
                    </div>
                  </div>
                </div>

                <div className="text-base font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                  {formData.defaultMetaTitle || "Store Meta Title Here"}
                </div>

                <div className="text-xs text-[#4d5156] leading-relaxed line-clamp-3">
                  {formData.defaultMetaDescription ||
                    "Enter a descriptive meta description to see how your snippet appears in Google Search results..."}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                {formData.ogImageUrl ? (
                  <img
                    src={formData.ogImageUrl}
                    alt="Social Preview"
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="h-44 w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    No OpenGraph Image Specified
                  </div>
                )}
                <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    {formData.canonicalDomain
                      ? new URL(formData.canonicalDomain).hostname
                      : "indicraftstore.com"}
                  </div>
                  <div className="text-sm font-bold text-slate-900 line-clamp-1">
                    {formData.defaultMetaTitle}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2">
                    {formData.defaultMetaDescription}
                  </div>
                </div>
              </div>
            )}

            {/* SEO Health Audit */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/75 p-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Metadata Health Checklist
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Title Length (50–60 chars)</span>
                  {titleLength >= 40 && titleLength <= 65 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Optimal
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                      <AlertCircle className="h-3.5 w-3.5" /> Needs Adjustment
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Description (140–160 chars)</span>
                  {descLength >= 120 && descLength <= 165 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Optimal
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                      <AlertCircle className="h-3.5 w-3.5" /> Needs Adjustment
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">OpenGraph Social Banner</span>
                  {formData.ogImageUrl ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Configured
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                      <AlertCircle className="h-3.5 w-3.5" /> Missing
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Search Engine Indexing</span>
                  {formData.robotsIndex ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                      <AlertCircle className="h-3.5 w-3.5" /> Noindex Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
