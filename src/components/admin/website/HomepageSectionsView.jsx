import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleSection,
  reorderSections,
} from "@/store/slices/adminWebsiteSlice";
import {
  LayoutDashboard,
  Layers,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  PlusCircle,
  Eye,
  SlidersHorizontal,
  Search,
  Sparkles,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function HomepageSectionsView() {
  const dispatch = useAppDispatch();
  const sections = useAppSelector((state) => state.adminWebsite?.sections || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedSection, setSelectedSection] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New section form state
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState("Product Slider");
  const [newBadge, setNewBadge] = useState("Featured");

  const filteredSections = useMemo(() => {
    return sections.filter((sec) => {
      const matchSearch =
        sec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sec.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        filterStatus === "All" ||
        (filterStatus === "Active" && sec.enabled) ||
        (filterStatus === "Inactive" && !sec.enabled);
      return matchSearch && matchStatus;
    });
  }, [sections, searchTerm, filterStatus]);

  const activeCount = useMemo(
    () => sections.filter((s) => s.enabled).length,
    [sections]
  );
  const inactiveCount = sections.length - activeCount;

  const handleToggle = (id, name, currentStatus) => {
    dispatch(toggleSection(id));
    if (currentStatus) {
      toast.warning(`"${name}" hidden from Homepage.`);
    } else {
      toast.success(`"${name}" is now live on Homepage.`);
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    // Update order numbers
    newSections.forEach((s, idx) => {
      s.order = idx + 1;
    });
    dispatch(reorderSections(newSections));
    toast.info(`Moved "${temp.name}" up in layout order.`);
  };

  const handleMoveDown = (index) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    // Update order numbers
    newSections.forEach((s, idx) => {
      s.order = idx + 1;
    });
    dispatch(reorderSections(newSections));
    toast.info(`Moved "${temp.name}" down in layout order.`);
  };

  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Please enter a section name.");
      return;
    }

    const newSection = {
      id: `SEC-${Date.now().toString().slice(-4)}`,
      name: newName.trim(),
      description: newDesc.trim() || "Custom homepage section block",
      type: newType,
      enabled: true,
      order: sections.length + 1,
      badgeText: newBadge.trim() || "Custom",
    };

    const updated = [...sections, newSection];
    dispatch(reorderSections(updated));
    toast.success(`Section "${newName}" created and added to layout!`);
    setIsAddModalOpen(false);
    setNewName("");
    setNewDesc("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Homepage Layout & Sections
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
              <Sparkles className="h-3 w-3" /> Live Editor
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Reorder, toggle, and manage interactive storefront sections displayed on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ExternalLink className="h-4 w-4 text-slate-500" />
            View Storefront
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add Section
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Sections
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{sections.length}</div>
          <p className="mt-1 text-xs text-slate-500">Configured homepage blocks</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Active on Storefront
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">{activeCount}</div>
          <p className="mt-1 text-xs text-slate-500">Currently visible to shoppers</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Hidden / Inactive
            </span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-amber-600">{inactiveCount}</div>
          <p className="mt-1 text-xs text-slate-500">Temporarily disabled</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Layout Status
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <LayoutDashboard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">Synchronized</div>
          <p className="mt-1 text-xs text-slate-500">Real-time Redux persistence</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search section name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-500">Visibility:</span>
          {["All", "Active", "Inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === status
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Sections Table & Reordering */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/75 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            Homepage Section Sequence
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="h-3.5 w-3.5 text-slate-400" />
            Use arrow buttons to adjust vertical layout hierarchy on the storefront.
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredSections.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No homepage sections found matching your filters.
            </div>
          ) : (
            filteredSections.map((section, idx) => {
              const originalIndex = sections.findIndex((s) => s.id === section.id);
              return (
                <div
                  key={section.id}
                  className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    section.enabled ? "hover:bg-slate-50/80" : "bg-slate-50/50 opacity-75"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Order Rank */}
                    <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm shrink-0">
                      <span>#{section.order || originalIndex + 1}</span>
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">
                          {section.name}
                        </h3>
                        <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {section.type}
                        </span>
                        {section.badgeText && (
                          <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                            {section.badgeText}
                          </span>
                        )}
                        {!section.enabled && (
                          <span className="rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-xs font-medium text-red-600">
                            Hidden from Store
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 max-w-xl">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Move Controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs">
                      <button
                        title="Move Up"
                        disabled={originalIndex === 0}
                        onClick={() => handleMoveUp(originalIndex)}
                        className="p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed border-r border-slate-200 transition-colors"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        title="Move Down"
                        disabled={originalIndex === sections.length - 1}
                        onClick={() => handleMoveDown(originalIndex)}
                        className="p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>

                    {/* View Details */}
                    <button
                      onClick={() => setSelectedSection(section)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-500" />
                      Details
                    </button>

                    {/* Enable / Disable Switch */}
                    <button
                      onClick={() =>
                        handleToggle(section.id, section.name, section.enabled)
                      }
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        section.enabled
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                          : "bg-slate-200 text-slate-700 border border-slate-300 hover:bg-slate-300"
                      }`}
                    >
                      {section.enabled ? "Active" : "Disabled"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Section Overview: {selectedSection.name}
              </h3>
              <button
                onClick={() => setSelectedSection(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 py-4 text-sm">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Section ID & Type
                </span>
                <p className="font-mono text-sm font-semibold text-slate-800">
                  {selectedSection.id} ({selectedSection.type})
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500">Summary</span>
                <p className="mt-1 text-slate-700">{selectedSection.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-xs text-slate-500">Sequence Position</span>
                  <p className="text-lg font-bold text-slate-900">
                    Slot #{selectedSection.order}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-xs text-slate-500">Display Tag</span>
                  <p className="text-sm font-semibold text-indigo-600">
                    {selectedSection.badgeText || "None"}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                This section's content pulls live dynamic catalog items from the store Redux database.
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                onClick={() => setSelectedSection(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Section Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleAddSection}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Homepage Block</h3>
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
                Section Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Seasonal Clearance Sale"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Block Type *
              </label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger className="w-full rounded-lg border-slate-300">
                  <SelectValue placeholder="Select block type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product Slider">Product Slider</SelectItem>
                  <SelectItem value="Product Grid">Product Grid</SelectItem>
                  <SelectItem value="Category Grid">Category Grid</SelectItem>
                  <SelectItem value="Features Bar">Features Bar</SelectItem>
                  <SelectItem value="Testimonials">Testimonials</SelectItem>
                  <SelectItem value="Custom HTML/Media">Custom Media Banner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Display Badge / Tag
              </label>
              <input
                type="text"
                placeholder="e.g. Hot Deal, 50% Off"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Description / Subtitle
              </label>
              <textarea
                rows={2}
                placeholder="Brief description of this section's purpose"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
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
                Create Section
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
