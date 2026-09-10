import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategories } from "@/store/slices/adminProductsSlice";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  hardDeleteCategory,
  toggleCategoryVisibility,
  toggleCategoryMovingFast,
} from "@/api/adminCategories";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Eye,
  EyeOff,
  Flame,
  Upload,
  Image as ImageIcon,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";

export default function CategoriesView() {
  const dispatch = useAppDispatch();
  const reduxCategories = useAppSelector((state) => state.adminProducts.categories) || [];

  // Local categories list populated by API, defaulting to Redux state
  const [categories, setCategoriesList] = useState(reduxCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [expandedCats, setExpandedCats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParentCatId, setSelectedParentCatId] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name, type: 'category' | 'subcategory' }
  const [isDeleting, setIsDeleting] = useState(false);

  // Category Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  // Edit-specific clear flags
  const [clearImage, setClearImage] = useState(false);
  const [clearBannerImage, setClearBannerImage] = useState(false);

  // Sub-category Form State
  const [subName, setSubName] = useState("");
  const [subDescription, setSubDescription] = useState("");
  const [subStatus, setSubStatus] = useState("active");
  const [subOrder, setSubOrder] = useState(0);
  const [subImageFile, setSubImageFile] = useState(null);
  const [subImagePreview, setSubImagePreview] = useState("");

  /**
   * Fetch All Categories from Backend API
   * Endpoint: GET /categories/admin/categories
   */
  const fetchCategories = async (showToast = false) => {
    setIsLoading(true);
    try {
      const data = await getAllCategories();
      if (Array.isArray(data) && data.length > 0) {
        // Ensure subCategories array exists on each item and images are normalized to strings
        const formatted = data.map((cat) => {
          const imageUrl =
            (typeof cat.image === "object" && cat.image?.url) ||
            (typeof cat.image === "string" && cat.image) ||
            cat.imageUrl ||
            "";
          const bannerImageUrl =
            (typeof cat.bannerImage === "object" && cat.bannerImage?.url) ||
            (typeof cat.bannerImage === "string" && cat.bannerImage) ||
            cat.bannerImageUrl ||
            "";

          return {
            ...cat,
            id: cat._id || cat.id,
            imageUrl,
            bannerImageUrl,
            subCategories: (cat.children || cat.subCategories || []).map((sub) => ({
              ...sub,
              id: sub._id || sub.id,
              imageUrl:
                (typeof sub.image === "object" && sub.image?.url) ||
                (typeof sub.image === "string" && sub.image) ||
                sub.imageUrl ||
                "",
              bannerImageUrl:
                (typeof sub.bannerImage === "object" && sub.bannerImage?.url) ||
                (typeof sub.bannerImage === "string" && sub.bannerImage) ||
                sub.bannerImageUrl ||
                "",
            })),
          };
        });
        setCategoriesList(formatted);
        dispatch(setCategories(formatted));
        if (showToast) toast.success(`Loaded ${formatted.length} categories from server`);
      } else if (reduxCategories.length > 0) {
        setCategoriesList(reduxCategories);
      }
    } catch (error) {
      console.warn("Categories API fetch error:", error);
      if (showToast) {
        toast.error(`API Error: ${error.message || "Failed to fetch categories"}`);
      }
      // Fall back to cached redux state if network fails
      if (reduxCategories.length > 0) {
        setCategoriesList(reduxCategories);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, []);

  // Update expanded list when categories change
  useEffect(() => {
    if (categories.length > 0 && expandedCats.length === 0) {
      setExpandedCats(categories.slice(0, 3).map((c) => c.id));
    }
  }, [categories]);

  const toggleExpand = (catId) => {
    setExpandedCats((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  // Image Upload Handlers with File Validation
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 5MB contract validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Category image must be 5MB or less");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setClearImage(false);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 20MB contract validation
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Banner image must be 20MB or less");
      return;
    }

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
    setClearBannerImage(false);
  };

  const handleSubImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Sub-category image must be 5MB or less");
      return;
    }

    setSubImageFile(file);
    setSubImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setStatus("active");
    setOrder(0);
    setImageFile(null);
    setImagePreview("");
    setBannerFile(null);
    setBannerPreview("");
    setClearImage(false);
    setClearBannerImage(false);
    setEditingCategory(null);
  };

  /**
   * Create Primary Category
   * Endpoint: POST /categories/admin/categories
   * Payload: multipart/form-data
   */
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        status,
        order: Number(order) || 0,
      };

      if (imageFile) payload.image = imageFile;
      if (bannerFile) payload.bannerImage = bannerFile;

      await createCategory(payload);
      toast.success(`Category "${name}" created successfully`);
      setIsAddCatModalOpen(false);
      resetForm();
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Create Subcategory
   * Endpoint: POST /categories/admin/categories
   * Payload: multipart/form-data with parent ID
   */
  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    if (!subName.trim() || !selectedParentCatId) {
      toast.error("Sub-category name and parent are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: subName.trim(),
        parent: selectedParentCatId,
        description: subDescription.trim(),
        status: subStatus,
        order: Number(subOrder) || 0,
      };

      if (subImageFile) payload.image = subImageFile;

      await createCategory(payload);
      toast.success(`Sub-category "${subName}" created successfully`);
      setIsAddSubModalOpen(false);
      setSubName("");
      setSubDescription("");
      setSubImageFile(null);
      setSubImagePreview("");
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to create sub-category");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Open Edit Category Modal
   */
  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || "");
    setDescription(cat.description || "");
    setStatus(cat.status || "active");
    setOrder(cat.order !== undefined ? cat.order : 0);
    setImagePreview(cat.imageUrl || (typeof cat.image === "object" ? cat.image?.url : cat.image) || "");
    setBannerPreview(cat.bannerImageUrl || (typeof cat.bannerImage === "object" ? cat.bannerImage?.url : cat.bannerImage) || "");
    setImageFile(null);
    setBannerFile(null);
    setClearImage(false);
    setClearBannerImage(false);
    setIsEditModalOpen(true);
  };

  /**
   * Update Category
   * Endpoint: PUT /categories/admin/categories/:id
   * Payload: multipart/form-data
   */
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        status,
        order: Number(order) || 0,
      };

      if (imageFile) payload.image = imageFile;
      if (bannerFile) payload.bannerImage = bannerFile;
      if (clearImage) payload.clearImage = "true";
      if (clearBannerImage) payload.clearBannerImage = "true";

      const catId = editingCategory.id || editingCategory._id;
      await updateCategory(catId, payload);
      toast.success(`Category "${name}" updated successfully`);
      setIsEditModalOpen(false);
      resetForm();
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Confirm and execute delete via Radix UI dialog
   * Endpoint: DELETE /categories/admin/categories/:id/hard
   */
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await hardDeleteCategory(deleteTarget.id);
      toast.success(
        deleteTarget.type === "category"
          ? `Category "${deleteTarget.name}" deleted permanently`
          : `Sub-category "${deleteTarget.name}" removed`
      );
      setDeleteTarget(null);
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Toggle Visibility
   * Endpoint: PATCH /categories/admin/categories/:id/toggle-visibility
   */
  const handleToggleVisibility = async (cat) => {
    const catId = cat.id || cat._id;
    const newHidden = !cat.isHidden;
    try {
      await toggleCategoryVisibility(catId, newHidden);
      toast.success(newHidden ? "Category hidden" : "Category visible");
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to toggle visibility");
    }
  };

  /**
   * Toggle Moving Fast
   * Endpoint: PATCH /categories/admin/categories/:id/toggle-moving-fast
   */
  const handleToggleMovingFast = async (cat) => {
    const catId = cat.id || cat._id;
    const newMovingFast = !cat.showInMovingFast;
    try {
      await toggleCategoryMovingFast(catId, newMovingFast);
      toast.success(newMovingFast ? "Added to Moving Fast" : "Removed from Moving Fast");
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to update Moving Fast");
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchParent =
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q));
    const subList = c.subCategories || c.children || [];
    const matchSub = subList.some((s) => s.name && s.name.toLowerCase().includes(q));
    return matchParent || matchSub;
  });

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-heading font-black uppercase tracking-wider">
              Taxonomy Management
            </span>
            <span className="text-xs text-slate-400 font-montreal">Tree Architecture</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Categories & Sub-Categories
          </h1>
          <p className="text-xs text-slate-500 font-montreal mt-0.5">
            Manage your store hierarchy, upload category & banner media, toggle visibility, and trigger direct admin APIs.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Refresh button to test GET /categories/admin/categories */}
          <button
            onClick={() => fetchCategories(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-heading font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            title="Refresh from API (GET /categories/admin/categories)"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-slate-500", isLoading && "animate-spin")} />
            <span>{isLoading ? "Syncing..." : "Sync API"}</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsAddCatModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Primary Category</span>
          </button>
        </div>
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
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-montreal text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-accent bg-slate-50/50 focus:bg-white transition-colors"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="px-3 py-2.5 rounded-xl text-xs font-heading font-bold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Loading State ── */}
      {isLoading && categories.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
          <p className="text-sm font-heading font-bold text-slate-700">Loading Categories from API...</p>
          <p className="text-xs text-slate-400 font-montreal mt-1">GET /categories/admin/categories</p>
        </div>
      )}

      {/* Live Categories API Status Pill */}
      <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-2 text-[11px] font-montreal">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-heading font-bold text-slate-800">
            Live Database Categories
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 font-semibold">
            {categories.length} Categories Loaded
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[10px]">
          GET /api/categories/admin/categories
        </span>
      </div>

      {/* ── Categories List Accordion ── */}
      <div className="space-y-4">
        {filteredCategories.map((cat) => {
          const catId = cat.id || cat._id;
          const isExpanded = expandedCats.includes(catId);
          const subList = cat.subCategories || cat.children || [];

          return (
            <div
              key={catId}
              className={cn(
                "bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all",
                cat.isHidden && "opacity-75 bg-slate-50/70"
              )}
            >
              {/* Category Header Row */}
              <div className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div
                  onClick={() => toggleExpand(catId)}
                  className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                >
                  <button className="p-1 text-slate-400 hover:text-slate-700">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 transition-transform" />
                    ) : (
                      <ChevronRight className="w-5 h-5 transition-transform" />
                    )}
                  </button>

                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-accent flex items-center justify-center flex-shrink-0 overflow-hidden border border-orange-100">
                    {cat.imageUrl || (typeof cat.image === "object" ? cat.image?.url : cat.image) ? (
                      <img
                        src={cat.imageUrl || (typeof cat.image === "object" ? cat.image?.url : cat.image)}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Layers className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-slate-900 text-sm">{cat.name}</h3>
                      {cat.slug && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono">
                          /{cat.slug}
                        </span>
                      )}
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-heading font-bold",
                          cat.status === "active" || !cat.status
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        )}
                      >
                        {cat.status || "active"}
                      </span>

                      {cat.order !== undefined && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-mono">
                          Order: {cat.order}
                        </span>
                      )}

                      {cat.showInMovingFast && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-heading font-bold border border-amber-200">
                          <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Moving Fast
                        </span>
                      )}

                      {cat.isHidden && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-heading font-bold border border-rose-200">
                          Hidden
                        </span>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-slate-400 font-montreal truncate mt-0.5">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Moving Fast Toggle */}
                  <button
                    onClick={() => handleToggleMovingFast(cat)}
                    className={cn(
                      "p-2 rounded-xl transition-colors cursor-pointer",
                      cat.showInMovingFast
                        ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                        : "text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                    )}
                    title={cat.showInMovingFast ? "Remove from Moving Fast" : "Feature in Moving Fast"}
                  >
                    <Flame className="w-4 h-4" />
                  </button>

                  {/* Visibility Toggle */}
                  <button
                    onClick={() => handleToggleVisibility(cat)}
                    className={cn(
                      "p-2 rounded-xl transition-colors cursor-pointer",
                      cat.isHidden
                        ? "text-rose-600 bg-rose-50 hover:bg-rose-100"
                        : "text-slate-400 hover:text-emerald-600 hover:bg-slate-100"
                    )}
                    title={cat.isHidden ? "Make Category Visible" : "Hide Category"}
                  >
                    {cat.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  {/* Edit Category */}
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Category (PUT /categories/admin/categories/:id)"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Add Sub-category */}
                  <button
                    onClick={() => {
                      setSelectedParentCatId(catId);
                      setSubName("");
                      setSubDescription("");
                      setSubImageFile(null);
                      setSubImagePreview("");
                      setIsAddSubModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-accent" />
                    <span>Add Sub-category</span>
                  </button>

                  {/* Hard Delete */}
                  <button
                    onClick={() => setDeleteTarget({ id: catId, name: cat.name, type: "category" })}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Permanently Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Nested Subcategories Area */}
              {isExpanded && (
                <div className="px-6 pb-5 pt-1 border-t border-slate-100 bg-slate-50/40">
                  <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Nested Sub-Categories ({subList.length})
                  </p>

                  {subList.length === 0 ? (
                    <p className="text-xs text-slate-400 font-montreal italic py-2">
                      No sub-categories created yet. Click "Add Sub-category" above.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {subList.map((sub) => {
                        const subId = sub.id || sub._id;
                        return (
                          <div
                            key={subId}
                            className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 group hover:border-slate-300"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {(sub.imageUrl || (typeof sub.image === "object" ? sub.image?.url : sub.image)) && (
                                <img
                                  src={sub.imageUrl || (typeof sub.image === "object" ? sub.image?.url : sub.image)}
                                  alt={sub.name}
                                  className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                              <div className="min-w-0">
                                <p className="font-heading font-bold text-slate-800 text-xs truncate">
                                  {sub.name}
                                </p>
                                {sub.slug && (
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    /{sub.slug}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => setDeleteTarget({ id: subId, name: sub.name, type: "subcategory" })}
                                className="p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Remove subcategory"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-sm">Add Primary Category</h3>
                <span className="text-[11px] text-slate-400 font-mono">POST /categories/admin/categories</span>
              </div>
              <button
                onClick={() => setIsAddCatModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-5 space-y-4 text-xs font-montreal overflow-y-auto flex-1">
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., HVAC & Air Cooling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of wholesale products in this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Category Image Upload (Max 5MB) */}
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Category Icon / Thumbnail (Max 5MB)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 hover:border-accent bg-slate-50 cursor-pointer text-slate-600 transition-colors">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                        }}
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400">
                    {imageFile ? imageFile.name : "Optional image"}
                  </span>
                </div>
              </div>

              {/* Banner Image Upload (Max 20MB) */}
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Category Banner Image (Max 20MB)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 hover:border-accent bg-slate-50 cursor-pointer text-slate-600 transition-colors">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>Choose Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                    />
                  </label>
                  {bannerPreview && (
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-slate-200">
                      <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setBannerFile(null);
                          setBannerPreview("");
                        }}
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400">
                    {bannerFile ? bannerFile.name : "Optional hero banner"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-heading font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-heading font-bold shadow-sm disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? "Creating..." : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Category Modal (PUT /categories/admin/categories/:id) ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-sm">Edit Category</h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  PUT /categories/admin/categories/{editingCategory?.id || editingCategory?._id}
                </span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="p-5 space-y-4 text-xs font-montreal overflow-y-auto flex-1">
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Change Image */}
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Category Image
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 hover:border-accent bg-slate-50 cursor-pointer text-slate-600">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>Upload New</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <div className="flex items-center gap-2">
                      <img src={imagePreview} alt="Preview" className="w-8 h-8 rounded object-cover border" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                          setClearImage(true);
                        }}
                        className="text-rose-500 hover:text-rose-700 text-[11px] underline"
                      >
                        Clear Image
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Banner */}
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Category Banner
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 hover:border-accent bg-slate-50 cursor-pointer text-slate-600">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>Upload New</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                    />
                  </label>

                  {bannerPreview && (
                    <div className="flex items-center gap-2">
                      <img src={bannerPreview} alt="Banner" className="w-14 h-8 rounded object-cover border" />
                      <button
                        type="button"
                        onClick={() => {
                          setBannerFile(null);
                          setBannerPreview("");
                          setClearBannerImage(true);
                        }}
                        className="text-rose-500 hover:text-rose-700 text-[11px] underline"
                      >
                        Clear Banner
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-heading font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-heading font-bold shadow-sm disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? "Updating..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Sub-category Modal (POST /categories/admin/categories with parent) ── */}
      {isAddSubModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-sm">Add Sub-category</h3>
                <span className="text-[11px] text-slate-400 font-mono">Parent ID: {selectedParentCatId}</span>
              </div>
              <button
                onClick={() => setIsAddSubModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubcategory} className="p-5 space-y-4 text-xs font-montreal">
              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Sub-category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Exhaust Fans & Blowers"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional sub-category description..."
                  value={subDescription}
                  onChange={(e) => setSubDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-heading font-bold text-slate-700 mb-1">
                  Optional Sub-category Image (Max 5MB)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 hover:border-accent bg-slate-50 cursor-pointer text-slate-600">
                    <Upload className="w-4 h-4 text-accent" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSubImageChange}
                      className="hidden"
                    />
                  </label>
                  {subImagePreview && (
                    <img src={subImagePreview} alt="Preview" className="w-8 h-8 rounded object-cover border" />
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddSubModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-heading font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-heading font-bold shadow-sm disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? "Creating..." : "Create Sub-category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Radix UI Delete Confirmation Dialog ── */}
      <ConfirmDeleteDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === "category" ? "Delete Category" : "Remove Sub-Category"}
        description={
          deleteTarget?.type === "category"
            ? "Are you sure you want to permanently delete this category? This will affect products assigned to it and cannot be undone."
            : "Are you sure you want to remove this nested sub-category? This action cannot be undone."
        }
        itemName={deleteTarget?.name}
        confirmText={deleteTarget?.type === "category" ? "Delete Category" : "Remove Sub-Category"}
        isLoading={isDeleting}
      />
    </div>
  );
}
