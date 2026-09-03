import React from "react";
import { FolderTree, Image, Tag, Shield } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-poppins font-bold text-white">
          Admin Control Center
        </h2>
        <p className="text-slate-400 text-sm">
          Redux Toolkit slices (`categorySlice`, `bannerSlice`, `offerSlice`, `trustBadgeSlice`) are pre-configured with async CRUD thunks ready for live API integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
            <FolderTree className="w-5 h-5" />
          </div>
          <h3 className="font-poppins font-bold text-white text-base">Categories CRUD</h3>
          <p className="text-xs text-slate-400">Manage categories & 2-column subcategory flyouts.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Image className="w-5 h-5" />
          </div>
          <h3 className="font-poppins font-bold text-white text-base">Banners CRUD</h3>
          <p className="text-xs text-slate-400">Configure auto-rotating hero slides & CTA links.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <h3 className="font-poppins font-bold text-white text-base">Offers Marquee</h3>
          <p className="text-xs text-slate-400">Update scrolling marquee announcement strings.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-poppins font-bold text-white text-base">Trust Badges</h3>
          <p className="text-xs text-slate-400">Manage business trust highlights & icons.</p>
        </div>
      </div>
    </div>
  );
}
