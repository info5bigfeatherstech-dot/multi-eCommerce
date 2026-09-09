import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addCategory,
  addSubcategory,
  deleteCategory,
  deleteSubcategory,
} from "@/store/slices/adminProductsSlice";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Boxes,
  Zap,
  Wrench,
  Sun,
  Cog,
  ShieldAlert,
  Sparkles,
  X,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CategoriesView() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.adminProducts.categories);

  const [expandedCats, setExpandedCats] = useState(categories.map((c) => c.id));
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);
  const [selectedParentCatId, setSelectedParentCatId] = useState("");

  // Category Form State
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Layers");

  // Sub-category Form State
  const [newSubName, setNewSubName] = useState("");
  const [newSubSlug, setNewSubSlug] = useState("");

  const toggleExpand = (catId) => {
    setExpandedCats((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;

    dispatch(
      addCategory({
        name: newCatName,
        slug: newCatSlug || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: newCatDesc,
        icon: newCatIcon,
        subCategories: [],
      })
    );

    toast.success(`Category "${newCatName}" added successfully`);
    setIsAddCatModalOpen(false);
    setNewCatName("");
    setNewCatSlug("");
    setNewCatDesc("");
  };

  const handleOpenAddSub = (catId) => {
    setSelectedParentCatId(catId);
    setNewSubName("");
    setNewSubSlug("");
    setIsAddSubModalOpen(true);
  };

  const handleCreateSubcategory = (e) => {
    e.preventDefault();
    if (!selectedParentCatId || !newSubName) return;

    dispatch(
      addSubcategory({
        categoryId: selectedParentCatId,
        name: newSubName,
        slug: newSubSlug || newSubName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      })
    );

    toast.success(`Sub-category "${newSubName}" added`);
    setIsAddSubModalOpen(false);
  };

  const handleDeleteCat = (catId, name) => {
    if (confirm(`Are you sure you want to delete "${name}" and all its subcategories?`)) {
      dispatch(deleteCategory(catId));
      toast.success(`Category "${name}" removed`);
    }
  };

  const handleDeleteSub = (catId, subId, subName) => {
    if (confirm(`Remove subcategory "${subName}"?`)) {
      dispatch(deleteSubcategory({ categoryId: catId, subcategoryId: subId }));
      toast.success(`Subcategory "${subName}" removed`);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchParent = c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    const matchSub = c.subCategories.some((s) => s.name.toLowerCase().includes(q));
    return matchParent || matchSub;
  });

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-poppins font-black uppercase tracking-wider">
              Taxonomy Management
            </span>
            <span className="text-xs text-slate-400 font-inter">Tree Architecture</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            Categories & Sub-Categories
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Organize wholesale product hierarchy, manage nested sub-categories, and assign navigation links.
          </p>
        </div>

        <button
          onClick={() => setIsAddCatModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-poppins font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Primary Category</span>
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories or sub-categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-inter text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-accent bg-slate-50/50 focus:bg-white transition-colors"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Categories List Accordion ── */}
      <div className="space-y-4">
        {filteredCategories.map((cat) => {
          const isExpanded = expandedCats.includes(cat.id);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Category Header Row */}
              <div className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div
                  onClick={() => toggleExpand(cat.id)}
                  className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                >
                  <button className="p-1 text-slate-400 hover:text-slate-700">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 transition-transform" />
                    ) : (
                      <ChevronRight className="w-5 h-5 transition-transform" />
                    )}
                  </button>

                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-accent flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-poppins font-bold text-slate-900 text-sm">{cat.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono">
                        /{cat.slug}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-poppins font-bold">
                        {cat.productCount || 0} Products
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-inter truncate mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleOpenAddSub(cat.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-poppins font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-accent" />
                    <span>Add Sub-category</span>
                  </button>

                  <button
                    onClick={() => handleDeleteCat(cat.id, cat.name)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Nested Subcategories Area */}
              {isExpanded && (
                <div className="px-6 pb-5 pt-1 border-t border-slate-100 bg-slate-50/40">
                  <p className="text-[10px] font-poppins font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Nested Sub-Categories ({cat.subCategories.length})
                  </p>

                  {cat.subCategories.length === 0 ? (
                    <p className="text-xs text-slate-400 font-inter italic py-2">
                      No sub-categories created yet. Click "Add Sub-category" above.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {cat.subCategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 group hover:border-slate-300"
                        >
                          <div className="min-w-0">
                            <p className="font-poppins font-bold text-slate-800 text-xs truncate">
                              {sub.name}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              /{sub.slug}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {sub.count || 0} items
                            </span>
                            <button
                              onClick={() => handleDeleteSub(cat.id, sub.id, sub.name)}
                              className="p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete subcategory"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Add Primary Category Modal ── */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-poppins font-bold text-slate-900 text-sm">Add Primary Category</h3>
              <button
                onClick={() => setIsAddCatModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-5 space-y-4 text-xs font-inter">
              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., HVAC & Air Cooling"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="hvac-air-cooling"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Category Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of wholesale products in this category..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-poppins font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold shadow-sm"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Sub-category Modal ── */}
      {isAddSubModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-poppins font-bold text-slate-900 text-sm">Add Sub-category</h3>
              <button
                onClick={() => setIsAddSubModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubcategory} className="p-5 space-y-4 text-xs font-inter">
              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Sub-category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Exhaust Fans & Blowers"
                  value={newSubName}
                  onChange={(e) => {
                    setNewSubName(e.target.value);
                    setNewSubSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="exhaust-fans-blowers"
                  value={newSubSlug}
                  onChange={(e) => setNewSubSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddSubModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-poppins font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold shadow-sm"
                >
                  Create Sub-category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
