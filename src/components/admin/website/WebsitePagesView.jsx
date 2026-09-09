import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updatePageStatus,
  addNewPage,
  deletePage,
} from "@/store/slices/adminWebsiteSlice";
import {
  FileText,
  Search,
  PlusCircle,
  ExternalLink,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Globe,
  SlidersHorizontal,
  FileCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function WebsitePagesView() {
  const dispatch = useAppDispatch();
  const pages = useAppSelector((state) => state.adminWebsite?.pages || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingPage, setViewingPage] = useState(null);

  // New page form state
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newStatus, setNewStatus] = useState("Published");
  const [newContent, setNewContent] = useState("");

  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const matchSearch =
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        selectedStatus === "All" || page.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [pages, searchTerm, selectedStatus]);

  const totalViews = useMemo(() => {
    return pages.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  }, [pages]);

  const publishedCount = useMemo(
    () => pages.filter((p) => p.status === "Published").length,
    [pages]
  );
  const draftCount = pages.length - publishedCount;

  const handleStatusToggle = (id, currentStatus, title) => {
    const nextStatus = currentStatus === "Published" ? "Draft" : "Published";
    dispatch(updatePageStatus({ id, status: nextStatus }));
    toast.success(`Page "${title}" marked as ${nextStatus}.`);
  };

  const handleDelete = (id, title, isCore) => {
    if (isCore) {
      toast.error("Core system page cannot be deleted.");
      return;
    }
    dispatch(deletePage(id));
    toast.info(`Page "${title}" has been deleted.`);
  };

  const handleCreatePage = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Page title is required.");
      return;
    }

    let slug = newSlug.trim();
    if (!slug) {
      slug = `/${newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    }
    if (!slug.startsWith("/")) {
      slug = `/${slug}`;
    }

    const newPageObj = {
      id: `PAG-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      slug,
      status: newStatus,
      lastUpdated: new Date().toISOString().split("T")[0],
      viewsCount: 0,
      isCore: false,
    };

    dispatch(addNewPage(newPageObj));
    toast.success(`Page "${newTitle}" created successfully!`);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewSlug("");
    setNewContent("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Website Pages & CMS
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              <FileCheck className="h-3 w-3" /> Content Manager
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create, publish, and maintain policy, inquiry, landing, and custom informational pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add New Page
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Pages
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{pages.length}</div>
          <p className="mt-1 text-xs text-slate-500">Live & draft website routes</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Published Pages
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">{publishedCount}</div>
          <p className="mt-1 text-xs text-slate-500">Accessible to visitors</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Drafts
            </span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-amber-600">{draftCount}</div>
          <p className="mt-1 text-xs text-slate-500">Pending publication</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Page Impressions
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Globe className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {totalViews.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">Combined cumulative views</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search page title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-500">Filter:</span>
          {["All", "Published", "Draft"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedStatus === status
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Page Title & Slug</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Last Updated</th>
                <th className="px-6 py-3.5 text-right">Page Views</th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No website pages found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    className="hover:bg-slate-50/75 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {page.title}
                          </div>
                          <div className="font-mono text-xs text-indigo-600">
                            {page.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {page.isCore ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
                          <ShieldCheck className="h-3 w-3 text-slate-500" />
                          Core System
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 border border-purple-200">
                          <Sparkles className="h-3 w-3 text-purple-500" />
                          Custom CMS
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleStatusToggle(page.id, page.status, page.title)
                        }
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                          page.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {page.status === "Published" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {page.status}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {page.lastUpdated}
                    </td>

                    <td className="px-6 py-4 text-right font-semibold text-slate-800">
                      {page.viewsCount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={page.slug}
                          target="_blank"
                          title="Open live URL"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-slate-500" />
                        </Link>

                        <button
                          onClick={() => setViewingPage(page)}
                          title="View Details"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-slate-500" />
                        </button>

                        {!page.isCore && (
                          <button
                            onClick={() =>
                              handleDelete(page.id, page.title, page.isCore)
                            }
                            title="Delete Page"
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page Details Modal */}
      {viewingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Page Details: {viewingPage.title}
              </h3>
              <button
                onClick={() => setViewingPage(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 py-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Route Slug</span>
                  <p className="font-mono text-sm font-semibold text-indigo-600 mt-0.5">
                    {viewingPage.slug}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Status</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {viewingPage.status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-xs text-slate-500">Total Views</span>
                  <p className="text-base font-bold text-slate-900">
                    {viewingPage.viewsCount.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-xs text-slate-500">Last Modified</span>
                  <p className="text-sm font-medium text-slate-700">
                    {viewingPage.lastUpdated}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800 flex items-center justify-between">
                <span>Direct visitor destination link available</span>
                <Link
                  to={viewingPage.slug}
                  target="_blank"
                  className="font-semibold underline flex items-center gap-1"
                >
                  Visit Page <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                onClick={() => setViewingPage(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Page Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreatePage}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create New CMS Page</h3>
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
                Page Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Careers & Job Openings"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                placeholder="/careers"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Leave blank to auto-generate from page title.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Publishing Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Published">Published (Public)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Page Content Summary / Excerpt
              </label>
              <textarea
                rows={3}
                placeholder="Initial body copy, meta description, or HTML content preview..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
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
                Create Page
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
