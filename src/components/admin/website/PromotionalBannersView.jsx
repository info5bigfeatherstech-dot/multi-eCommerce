import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleBannerStatus,
  addNewBanner,
  deleteBanner,
} from "@/store/slices/adminWebsiteSlice";
import {
  Image,
  Sliders,
  PlusCircle,
  ExternalLink,
  Eye,
  Trash2,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  MousePointerClick,
  TrendingUp,
  Layers,
  Sparkles,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function PromotionalBannersView() {
  const dispatch = useAppDispatch();
  const banners = useAppSelector((state) => state.adminWebsite?.banners || []);

  const [selectedPlacement, setSelectedPlacement] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewBanner, setPreviewBanner] = useState(null);

  // New Banner form state
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newCtaText, setNewCtaText] = useState("Shop Now");
  const [newCtaLink, setNewCtaLink] = useState("/category/fashion");
  const [newLocation, setNewLocation] = useState("Hero Main Carousel (Slide 3)");
  const [newImageUrl, setNewImageUrl] = useState(
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
  );
  const [newStatus, setNewStatus] = useState("Active");

  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      if (selectedPlacement === "All") return true;
      if (selectedPlacement === "Hero") return b.location.toLowerCase().includes("hero");
      if (selectedPlacement === "Mid-Page") return b.location.toLowerCase().includes("mid-page");
      if (selectedPlacement === "Announcement") return b.location.toLowerCase().includes("announcement");
      return true;
    });
  }, [banners, selectedPlacement]);

  const totalClicks = useMemo(() => {
    return banners.reduce((sum, b) => sum + (b.clickCount || 0), 0);
  }, [banners]);

  const activeCount = useMemo(
    () => banners.filter((b) => b.status === "Active").length,
    [banners]
  );

  const handleToggleStatus = (id, currentStatus, title) => {
    dispatch(toggleBannerStatus(id));
    if (currentStatus === "Active") {
      toast.warning(`Banner "${title}" paused.`);
    } else {
      toast.success(`Banner "${title}" is now active.`);
    }
  };

  const handleDeleteBanner = (id, title) => {
    dispatch(deleteBanner(id));
    toast.error(`Banner "${title}" removed.`);
  };

  const handleCreateBanner = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please provide a banner title.");
      return;
    }

    const bannerObj = {
      id: `BAN-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || "Exclusive limited-time storefront offer",
      ctaText: newCtaText.trim() || "Explore Now",
      ctaLink: newCtaLink.trim() || "/",
      location: newLocation,
      imageUrl: newImageUrl.trim(),
      status: newStatus,
      clickCount: 0,
    };

    dispatch(addNewBanner(bannerObj));
    toast.success(`Promotional banner "${newTitle}" published!`);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewSubtitle("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Promotional Banners & Creative Assets
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
              <Megaphone className="h-3 w-3" /> Marketing Hub
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Deploy hero carousels, mid-page campaign cards, and top notification bars across the store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add New Banner
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Banners
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{banners.length}</div>
          <p className="mt-1 text-xs text-slate-500">Across all placements</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Active Campaigns
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">{activeCount}</div>
          <p className="mt-1 text-xs text-slate-500">Currently live & visible</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total CTR Clicks
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <MousePointerClick className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {totalClicks.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">Visitor interactions recorded</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Avg CTR Efficiency
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-purple-600">4.82%</div>
          <p className="mt-1 text-xs text-slate-500">Above ecommerce benchmark (2.5%)</p>
        </div>
      </div>

      {/* Placement Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <span className="text-xs font-semibold uppercase text-slate-400 px-3">
          Filter Placement:
        </span>
        {[
          { label: "All Banners", val: "All" },
          { label: "Hero Slider", val: "Hero" },
          { label: "Mid-Page Promos", val: "Mid-Page" },
          { label: "Announcement Bar", val: "Announcement" },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setSelectedPlacement(tab.val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedPlacement === tab.val
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Banner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBanners.map((banner) => (
          <div
            key={banner.id}
            className={`group rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${
              banner.status === "Active"
                ? "border-slate-200"
                : "border-slate-200 bg-slate-50/60 opacity-80"
            }`}
          >
            {/* Visual Header / Thumbnail */}
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              {banner.imageUrl ? (
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 text-center">
                  <span className="text-sm font-semibold text-white/90">
                    {banner.title}
                  </span>
                </div>
              )}

              {/* Status & Placement Overlays */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="rounded-md bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-xs font-medium text-white border border-white/20">
                  {banner.location}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-xs ${
                    banner.status === "Active"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-600 text-white"
                  }`}
                >
                  {banner.status}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                  {banner.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {banner.subtitle}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
                    CTA: {banner.ctaText}
                  </span>
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-mono text-indigo-700">
                    {banner.ctaLink}
                  </span>
                </div>
              </div>

              {/* Footer / Stats & Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <MousePointerClick className="h-3.5 w-3.5 text-indigo-600" />
                  {banner.clickCount.toLocaleString()} clicks
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewBanner(banner)}
                    title="Preview Banner"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="h-4 w-4 text-slate-500" />
                  </button>

                  <button
                    onClick={() =>
                      handleToggleStatus(banner.id, banner.status, banner.title)
                    }
                    title={
                      banner.status === "Active"
                        ? "Pause Banner"
                        : "Activate Banner"
                    }
                    className={`p-1.5 rounded-lg border transition-colors ${
                      banner.status === "Active"
                        ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {banner.status === "Active" ? (
                      <PauseCircle className="h-4 w-4" />
                    ) : (
                      <PlayCircle className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteBanner(banner.id, banner.title)}
                    title="Delete Banner"
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Banner Creative Preview
              </h3>
              <button
                onClick={() => setPreviewBanner(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4">
              {previewBanner.imageUrl && (
                <div className="rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={previewBanner.imageUrl}
                    alt={previewBanner.title}
                    className="w-full h-56 object-cover"
                  />
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-slate-500">Placement</span>
                <p className="text-sm font-semibold text-slate-800">
                  {previewBanner.location}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500">Headline</span>
                <p className="text-base font-bold text-slate-900">
                  {previewBanner.title}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {previewBanner.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={previewBanner.ctaLink}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                >
                  {previewBanner.ctaText} <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <span className="text-xs text-slate-500">
                  Destination: {previewBanner.ctaLink}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                onClick={() => setPreviewBanner(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Banner Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreateBanner}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Add Promotional Banner
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Campaign Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mega Weekend Flash Sale"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Subtitle / Offer Details
              </label>
              <input
                type="text"
                placeholder="e.g. Flat 40% OFF on all wireless headphones"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Placement Location *
              </label>
              <select
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Hero Main Carousel (Slide 3)">Hero Main Carousel</option>
                <option value="Mid-Page Promotional Banner">Mid-Page Promotional Banner</option>
                <option value="Top Sticky Announcement Bar">Top Sticky Announcement Bar</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  placeholder="Shop Now"
                  value={newCtaText}
                  onChange={(e) => setNewCtaText(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  placeholder="/category/fashion"
                  value={newCtaLink}
                  onChange={(e) => setNewCtaLink(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Image Media URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Publish Banner
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
