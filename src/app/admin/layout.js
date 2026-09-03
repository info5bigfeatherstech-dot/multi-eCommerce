import React from "react";

export const metadata = {
  title: "Admin Panel | ApexMart",
  description: "Administrative control panel for categories, banners, offers & trust badges",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-inter">
      {/* Reserved Admin Header Shell */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-accent animate-pulse" />
          <h1 className="font-poppins font-bold text-lg text-white">
            ApexMart Admin Workspace
          </h1>
        </div>
        <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 font-mono">
          v1.0.0 — Redux CRUD Enabled
        </span>
      </header>

      {/* Admin Body Container */}
      <div className="flex-1 flex">{children}</div>
    </div>
  );
}
