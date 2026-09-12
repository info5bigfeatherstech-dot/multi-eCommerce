import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAppSelector } from "@/store/hooks";
import {
  Tag,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  X,
  Search,
  Loader2,
  Eye,
  EyeOff,
  Globe,
  Package,
  CheckCircle2,
  ShieldAlert,
  CheckSquare,
  Square,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";
import { getAllProducts } from "@/api/adminProducts";
import {
  getAdminProductLabels,
  createAdminProductLabel,
  updateAdminProductLabel,
  deleteAdminProductLabel,
  assignProductsToLabel,
} from "@/api/adminProductLabels";

const EMPTY_FORM = {
  name: "",
  slug: "",
  pagePath: "",
  description: "",
  isActive: true,
  showInNav: true,
  sortOrder: 100,
  storefronts: ["ecomm", "wholesale"],
};

function slugifyName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function isValidPagePath(path) {
  const p = String(path || "").trim();
  if (!p) return true;
  // Strictly disallow absolute protocols, domain schemes, or backslashes
  if (/^[a-z][a-z0-9+.-]*:/i.test(p) || p.includes("://") || p.includes("\\") || p.startsWith("//")) {
    return false;
  }
  // Must be a relative path starting with /
  return p.startsWith("/");
}

function productImage(p) {
  const v0 = Array.isArray(p.variants) && p.variants[0] ? p.variants[0] : null;
  return (
    (Array.isArray(p.images) && p.images[0]?.url) ||
    (Array.isArray(p.images) && typeof p.images[0] === "string" && p.images[0]) ||
    v0?.images?.[0]?.url ||
    p.imageUrl ||
    ""
  );
}

export default function ProductLabelsView() {
  const adminUser = useAppSelector((state) => state.adminAuth?.adminUser);
  const normalizedRole = String(adminUser?.role || adminUser?.userType || "admin")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  // Read: admin, product_manager, marketing_manager, inventory_manager
  // Write: admin, product_manager, marketing_manager (only inventory_manager is strictly read-only)
  const isReadOnly = normalizedRole === "inventory_manager";
  const canWrite = !isReadOnly;

  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pathTouched, setPathTouched] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [assignLabel, setAssignLabel] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [selectedProductSlugs, setSelectedProductSlugs] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [productFilterTab, setProductFilterTab] = useState("all"); // 'all' | 'on_label' | 'not_on_label'

  const fetchLabels = useCallback(async (showToast = false) => {
    setIsLoading(true);
    try {
      const res = await getAdminProductLabels();
      setLabels(res.labels || []);
      if (showToast) toast.success(`Loaded ${res.labels?.length || 0} labels`);
    } catch (error) {
      toast.error(error.message || "Failed to load labels");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

  const filteredLabels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return labels;
    return labels.filter((l) => {
      return (
        l.name.toLowerCase().includes(q) ||
        l.slug.toLowerCase().includes(q) ||
        l.pagePath.toLowerCase().includes(q)
      );
    });
  }, [labels, searchQuery]);

  const previewSlug = slugTouched ? slugifyName(form.slug) : slugifyName(form.name);
  const previewPath =
    pathTouched && form.pagePath.trim()
      ? form.pagePath.trim().startsWith("/")
        ? form.pagePath.trim()
        : `/${form.pagePath.trim()}`
      : previewSlug
        ? `/TagProducts/${previewSlug}`
        : "";

  const openCreate = () => {
    setEditingLabel(null);
    setForm({ ...EMPTY_FORM, sortOrder: labels.length ? Math.max(...labels.map((l) => l.sortOrder || 0)) + 10 : 100 });
    setSlugTouched(false);
    setPathTouched(false);
    setIsModalOpen(true);
  };

  const openEdit = (label) => {
    setEditingLabel(label);
    setForm({
      name: label.name || "",
      slug: label.slug || "",
      pagePath: label.pagePath || "",
      description: label.description || "",
      isActive: label.isActive !== false,
      showInNav: label.showInNav !== false,
      sortOrder: Number(label.sortOrder) || 0,
      storefronts: Array.isArray(label.storefronts) && label.storefronts.length
        ? [...label.storefronts]
        : ["ecomm", "wholesale"],
    });
    setSlugTouched(true);
    setPathTouched(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingLabel(null);
    setForm(EMPTY_FORM);
  };

  const toggleStorefront = (key) => {
    setForm((prev) => {
      const has = prev.storefronts.includes(key);
      const next = has ? prev.storefronts.filter((s) => s !== key) : [...prev.storefronts, key];
      return { ...prev, storefronts: next.length ? next : [key] };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canWrite) {
      toast.error("You have read-only access (inventory_manager). Writing requires admin or manager privileges.");
      return;
    }
    const name = form.name.trim();
    if (!name) {
      toast.error("Label name is required");
      return;
    }
    if (name.length > 80) {
      toast.error("Name must be at most 80 characters");
      return;
    }

    const slug = slugTouched ? slugifyName(form.slug) : slugifyName(form.name);
    let pagePath = "";
    if (pathTouched && form.pagePath.trim()) {
      pagePath = form.pagePath.trim().startsWith("/")
        ? form.pagePath.trim()
        : `/${form.pagePath.trim()}`;
    } else if (slug) {
      pagePath = `/TagProducts/${slug}`;
    }

    if (pagePath && !isValidPagePath(pagePath)) {
      toast.error("Page URL must be a relative path (e.g. /TagProducts/rakhis-sale). External URLs (https://...) are rejected.");
      return;
    }
    if (!form.storefronts.length) {
      toast.error("Select at least one storefront");
      return;
    }

    const payload = {
      name,
      description: String(form.description || "").trim().slice(0, 300),
      isActive: Boolean(form.isActive),
      showInNav: Boolean(form.showInNav),
      sortOrder: Number.isFinite(Number(form.sortOrder)) ? Number(form.sortOrder) : 100,
      storefronts: form.storefronts,
    };
    if (slug) payload.slug = slug;
    if (pagePath) payload.pagePath = pagePath;

    setIsSubmitting(true);
    try {
      if (editingLabel) {
        const key = editingLabel.slug || editingLabel.id;
        const res = await updateAdminProductLabel(key, payload);
        if (res.slugMigrated) {
          toast.success("Label updated! Products were automatically migrated to the new slug.");
        } else {
          toast.success(res.message || "Label updated successfully");
        }
      } else {
        const res = await createAdminProductLabel(payload);
        toast.success(res.message || "Label created successfully");
      }
      closeModal();
      await fetchLabels();
    } catch (error) {
      toast.error(error.message || "Failed to save label");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!canWrite) {
      toast.error("You have read-only access (inventory_manager).");
      return;
    }
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const key = deleteTarget.slug || deleteTarget.id;
      const res = await deleteAdminProductLabel(key);
      const updatedProducts = res?.cleanup?.productsUpdated;
      toast.success(
        res?.message ||
          `Deleted “${deleteTarget.name}”${
            updatedProducts ? ` and unassigned from ${updatedProducts} product(s)` : " and unassigned from products"
          }`
      );
      setDeleteTarget(null);
      if (assignLabel && (assignLabel.slug === deleteTarget.slug || assignLabel.id === deleteTarget.id)) {
        setAssignLabel(null);
        setSelectedProductSlugs([]);
      }
      await fetchLabels();
    } catch (error) {
      toast.error(error.message || "Failed to delete label");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (label) => {
    if (!canWrite) {
      toast.error("You have read-only access.");
      return;
    }
    try {
      await updateAdminProductLabel(label.slug || label.id, { isActive: !label.isActive });
      toast.success(label.isActive ? "Label hidden from storefront" : "Label activated");
      await fetchLabels();
    } catch (error) {
      toast.error(error.message || "Failed to update label status");
    }
  };

  useEffect(() => {
    if (!assignLabel) return undefined;
    const q = productSearch.trim();
    const timer = setTimeout(async () => {
      setIsSearchingProducts(true);
      try {
        const res = await getAllProducts({
          page: 1,
          limit: 50,
          search: q,
          status: "active",
        });
        const list = res.products || res.data || res.items || (Array.isArray(res) ? res : []);
        setProductResults(Array.isArray(list) ? list : []);
      } catch (error) {
        toast.error(error.message || "Failed to search products");
        setProductResults([]);
      } finally {
        setIsSearchingProducts(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [assignLabel, productSearch]);

  const toggleProductSlug = (slug) => {
    const key = String(slug || "").trim();
    if (!key) return;
    setSelectedProductSlugs((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  // Filter products in assignment drawer
  const visibleAssignmentProducts = useMemo(() => {
    if (!assignLabel) return [];
    return productResults.filter((p) => {
      const tags = Array.isArray(p.tags)
        ? p.tags
        : Array.isArray(p.appliedTags)
        ? p.appliedTags
        : [];
      const hasLabel = tags.includes(assignLabel.slug);

      if (productFilterTab === "on_label") return hasLabel;
      if (productFilterTab === "not_on_label") return !hasLabel;
      return true;
    });
  }, [productResults, assignLabel, productFilterTab]);

  const selectAllVisible = () => {
    const slugs = visibleAssignmentProducts
      .map((p) => String(p.slug || "").trim())
      .filter(Boolean);
    setSelectedProductSlugs((prev) => [...new Set([...prev, ...slugs])]);
  };

  const deselectAllVisible = () => {
    const slugsToRemove = new Set(
      visibleAssignmentProducts.map((p) => String(p.slug || "").trim())
    );
    setSelectedProductSlugs((prev) => prev.filter((s) => !slugsToRemove.has(s)));
  };

  const handleAssign = async (value) => {
    if (!canWrite) {
      toast.error("You have read-only access (inventory_manager).");
      return;
    }
    if (!assignLabel?.slug) {
      toast.error("Select a label first");
      return;
    }
    if (!selectedProductSlugs.length) {
      toast.error("Select at least one product");
      return;
    }
    setIsAssigning(true);
    try {
      const res = await assignProductsToLabel({
        slugs: selectedProductSlugs,
        flagType: assignLabel.slug,
        value,
      });
      const count = res.updatedCount ?? selectedProductSlugs.length;
      toast.success(
        res.message ||
          (value
            ? `Applied “${assignLabel.name}” to ${count} product(s)`
            : `Removed “${assignLabel.name}” from ${count} product(s)`)
      );
      setProductResults((prev) =>
        prev.map((p) => {
          const slug = String(p.slug || "").trim();
          if (!selectedProductSlugs.includes(slug)) return p;
          const currentTags = Array.isArray(p.tags)
            ? [...p.tags]
            : Array.isArray(p.appliedTags)
            ? [...p.appliedTags]
            : [];
          const updatedTags = value
            ? [...new Set([...currentTags, assignLabel.slug])]
            : currentTags.filter((t) => t !== assignLabel.slug);
          return { ...p, tags: updatedTags, appliedTags: updatedTags };
        })
      );
      setSelectedProductSlugs([]);
      await fetchLabels();
    } catch (error) {
      toast.error(error.message || "Failed to update products");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn font-poppins bg-[#FBF9F5] p-5 sm:p-6 rounded-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-serif text-slate-800 tracking-tight">Product Labels</h1>
          <p className="text-xs text-slate-500 mt-1.5 font-montreal">
            Create Storefront Collections (Today’s Deal, On Sale, Festival Sales). Click URL and Product Assignment are Admin-Controlled.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => fetchLabels(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-slate-500", isLoading && "animate-spin")} />
            <span>{isLoading ? "Syncing..." : "Sync"}</span>
          </button>
          <button
            type="button"
            onClick={openCreate}
            disabled={!canWrite}
            title={!canWrite ? "Writing restricted for Inventory Manager" : "Create new label"}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs",
              canWrite
                ? "bg-accent hover:bg-accent-hover cursor-pointer"
                : "bg-slate-300 opacity-60 cursor-not-allowed"
            )}
          >
            <Plus className="w-4 h-4" />
            <span>Add Label</span>
          </button>
        </div>
      </div>

      {!canWrite && (
        <div className="flex items-center gap-2.5 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-900 text-xs font-montreal">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            You are logged in with role <strong className="capitalize font-heading">{adminUser?.role || "Inventory Manager"}</strong> (Read-only for marketing labels). Creating, editing, deleting, or updating product tags requires Administrator or Marketing privileges.
          </span>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Labels by Name, Slug, or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-montreal text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-accent bg-slate-50/50 focus:bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-heading font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Label</th>
                <th className="py-3.5 px-4">Click URL</th>
                <th className="py-3.5 px-4">Storefronts</th>
                <th className="py-3.5 px-4">Products</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-montreal">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 mx-auto text-accent animate-spin mb-2" />
                    <p className="text-sm font-heading font-bold text-slate-700">Loading labels...</p>
                  </td>
                </tr>
              ) : filteredLabels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Tag className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-heading font-bold text-slate-700">No labels found</p>
                    <p className="text-xs text-slate-400 mt-0.5 mb-3">Create a label to start grouping products.</p>
                    {canWrite && (
                      <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add First Label</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredLabels.map((label) => (
                  <tr key={label.id || label.slug} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-heading font-bold text-slate-900 text-xs">{label.name}</p>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">{label.slug}</p>
                      {label.isSystem && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-orange-50 text-accent text-[9px] font-bold uppercase">
                          Default
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-[11px] text-slate-600">{label.pagePath}</span>
                      {label.showInNav ? (
                        <p className="text-[10px] text-emerald-600 mt-0.5">Shown in storefront nav</p>
                      ) : (
                        <p className="text-[10px] text-slate-400 mt-0.5">Hidden from nav</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(label.storefronts || []).map((sf) => (
                          <span
                            key={sf}
                            className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold capitalize"
                          >
                            {sf}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-heading font-bold text-slate-800">{label.productCount}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase",
                          label.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        )}
                      >
                        {label.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setAssignLabel(label);
                            setSelectedProductSlugs([]);
                            setProductSearch("");
                            setProductFilterTab("all");
                          }}
                          title="Assign products"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-orange-50 transition-colors cursor-pointer"
                        >
                          <Package className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={!canWrite}
                          onClick={() => handleToggleActive(label)}
                          title={!canWrite ? "Read-only" : label.isActive ? "Deactivate" : "Activate"}
                          className={cn(
                            "p-1.5 rounded-lg text-slate-400 transition-colors",
                            canWrite
                              ? "hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                              : "opacity-40 cursor-not-allowed"
                          )}
                        >
                          {label.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          disabled={!canWrite}
                          onClick={() => openEdit(label)}
                          title={!canWrite ? "Read-only" : "Edit label"}
                          className={cn(
                            "p-1.5 rounded-lg text-slate-400 transition-colors",
                            canWrite
                              ? "hover:text-accent hover:bg-orange-50 cursor-pointer"
                              : "opacity-40 cursor-not-allowed"
                          )}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={!canWrite}
                          onClick={() => setDeleteTarget(label)}
                          title={!canWrite ? "Read-only" : "Delete label"}
                          className={cn(
                            "p-1.5 rounded-lg text-slate-400 transition-colors",
                            canWrite
                              ? "hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                              : "opacity-40 cursor-not-allowed"
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {assignLabel && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Assign products to “{assignLabel.name}”</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                  {assignLabel.slug}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5 font-montreal">
                Select products below and apply or remove this label flag via <code>PUT /api/admin/products/updateFlags</code>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAssignLabel(null);
                setSelectedProductSlugs([]);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-montreal text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-accent bg-slate-50/50 focus:bg-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-heading font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setProductFilterTab("all")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg transition-all",
                  productFilterTab === "all" ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                )}
              >
                All ({productResults.length})
              </button>
              <button
                type="button"
                onClick={() => setProductFilterTab("on_label")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg transition-all",
                  productFilterTab === "on_label" ? "bg-white text-emerald-700 shadow-2xs" : "hover:text-slate-900"
                )}
              >
                On label ({productResults.filter((p) => (p.tags || p.appliedTags || []).includes(assignLabel.slug)).length})
              </button>
              <button
                type="button"
                onClick={() => setProductFilterTab("not_on_label")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg transition-all",
                  productFilterTab === "not_on_label" ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                )}
              >
                Not on label ({productResults.filter((p) => !(p.tags || p.appliedTags || []).includes(assignLabel.slug)).length})
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px] font-montreal text-slate-500">
            <span>
              Showing <strong>{visibleAssignmentProducts.length}</strong> matching products
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllVisible}
                disabled={visibleAssignmentProducts.length === 0}
                className="hover:text-accent font-bold cursor-pointer disabled:opacity-40"
              >
                Select all visible
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={deselectAllVisible}
                disabled={selectedProductSlugs.length === 0}
                className="hover:text-slate-800 font-bold cursor-pointer disabled:opacity-40"
              >
                Deselect visible
              </button>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-100 divide-y divide-slate-50">
            {isSearchingProducts ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="w-5 h-5 mx-auto animate-spin text-accent" />
                <p className="text-xs text-slate-500 mt-2">Searching products...</p>
              </div>
            ) : visibleAssignmentProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                <p className="font-heading font-bold text-slate-600">No products found</p>
                <p className="text-[11px]">Try adjusting your search query or filter tab.</p>
              </div>
            ) : (
              visibleAssignmentProducts.map((p) => {
                const slug = String(p.slug || "").trim();
                const checked = selectedProductSlugs.includes(slug);
                const tags = Array.isArray(p.tags)
                  ? p.tags
                  : Array.isArray(p.appliedTags)
                  ? p.appliedTags
                  : [];
                const hasLabel = tags.includes(assignLabel.slug);
                if (!slug) return null;
                return (
                  <label
                    key={p._id || slug}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleProductSlug(slug)}
                      className="rounded border-slate-300 text-accent focus:ring-accent"
                    />
                    {productImage(p) ? (
                      <img
                        src={productImage(p)}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200 bg-slate-50"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-heading font-bold text-slate-800 truncate">{p.name}</p>
                      <p className="text-[10px] font-mono text-slate-400 truncate">{slug}</p>
                    </div>
                    {hasLabel && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        On label
                      </span>
                    )}
                  </label>
                );
              })
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-slate-600 font-heading font-bold">
              {selectedProductSlugs.length} product(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isAssigning || !selectedProductSlugs.length || !canWrite}
                onClick={() => handleAssign(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                {isAssigning ? "Updating..." : "Remove label"}
              </button>
              <button
                type="button"
                disabled={isAssigning || !selectedProductSlugs.length || !assignLabel.isActive || !canWrite}
                onClick={() => handleAssign(true)}
                className="px-3.5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                {isAssigning ? "Updating..." : "Apply label"}
              </button>
            </div>
          </div>
          {!assignLabel.isActive && (
            <div className="flex items-center gap-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 font-montreal">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>This label is currently inactive. Activate it before applying to new products. You can still remove existing assignments.</span>
            </div>
          )}
        </div>
      )}

      {isModalOpen &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget && !isSubmitting) {
                closeModal();
              }
            }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-modal-backdrop font-poppins"
            style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          >
            <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-modal-card">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                <div>
                  <h3 className="font-heading font-bold text-slate-900 text-sm">
                    {editingLabel ? "Edit Label" : "Add Label"}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {editingLabel ? "PUT /admin/product-labels/:slug" : "POST /admin/product-labels"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-5 space-y-4 text-xs font-montreal overflow-y-auto flex-1">
                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    placeholder="e.g. Rakhi's Sale"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder={previewSlug || "rakhis-sale"}
                    value={slugTouched ? form.slug : previewSlug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setForm((prev) => ({ ...prev, slug: e.target.value }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-mono focus:outline-none focus:border-accent"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Lowercase letters, numbers, hyphens. Used in ?tags=</p>
                </div>

                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">Click URL (page path)</label>
                  <input
                    type="text"
                    maxLength={200}
                    placeholder={previewPath || "/TagProducts/rakhis-sale"}
                    value={pathTouched ? form.pagePath : previewPath}
                    onChange={(e) => {
                      setPathTouched(true);
                      setForm((prev) => ({ ...prev, pagePath: e.target.value }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-mono focus:outline-none focus:border-accent"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Relative path only. Storefront opens this when the label is clicked.
                  </p>
                </div>

                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    maxLength={300}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-heading font-bold text-slate-700 mb-1">Sort order</label>
                    <input
                      type="number"
                      value={form.sortOrder}
                      onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2 pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-slate-300 text-accent focus:ring-accent"
                      />
                      <span className="font-heading font-bold text-slate-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.showInNav}
                        onChange={(e) => setForm((prev) => ({ ...prev, showInNav: e.target.checked }))}
                        className="rounded border-slate-300 text-accent focus:ring-accent"
                      />
                      <span className="font-heading font-bold text-slate-700">Show in nav</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-heading font-bold text-slate-700 mb-2">
                    <Globe className="w-3.5 h-3.5 inline mr-1" />
                    Storefronts
                  </label>
                  <div className="flex gap-3">
                    {["ecomm", "wholesale"].map((sf) => (
                      <label key={sf} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.storefronts.includes(sf)}
                          onChange={() => toggleStorefront(sf)}
                          className="rounded border-slate-300 text-accent focus:ring-accent"
                        />
                        <span className="capitalize font-semibold text-slate-700">{sf}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Saving..." : editingLabel ? "Save changes" : "Create label"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      <ConfirmDeleteDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete label?"
        itemName={deleteTarget?.name || ""}
        description="This removes the label from the storefront and unassigns it from every product. This cannot be undone."
        confirmText="Delete label"
      />
    </div>
  );
}
