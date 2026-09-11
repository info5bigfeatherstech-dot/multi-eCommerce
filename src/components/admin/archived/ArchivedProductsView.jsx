import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useArchivedProductsQuery,
  useRestoreProductMutation,
  useHardDeleteProductMutation,
  useBulkRestoreProductsMutation,
  useBulkHardDeleteProductsMutation,
} from "@/hooks/useAdminArchivedProductsQuery";
import {
  restoreProduct as reduxRestoreProduct,
  deleteProductPermanently as reduxDeleteProductPermanently,
  batchRestoreProducts as reduxBatchRestore,
  batchDeleteProducts as reduxBatchDelete,
} from "@/store/slices/adminArchivedSlice";
import {
  Archive,
  Search,
  Filter,
  RotateCcw,
  Trash2,
  Package,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Download,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  RefreshCw,
  Clock,
  Tag,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";
import { cn, formatCurrency } from "@/lib/utils";

/**
 * Normalizes backend product schema or fallback Redux shape into table structure.
 */
function normalizeArchivedProduct(p) {
  if (!p) return null;
  const id = p._id || p.id || String(Math.random());
  const name = p.name || p.title || "Untitled Product";
  const variant0 = Array.isArray(p.variants) && p.variants.length > 0 ? p.variants[0] : null;
  const sku = p.sku || variant0?.sku || variant0?.productCode || "N/A";
  const slug = p.slug || sku.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const category =
    typeof p.category === "object" ? p.category?.name || "General" : p.category || "General";
  const brand = p.brand || "ApexMart Wholesale";

  const price =
    typeof p.price === "object"
      ? Number(p.price.sale || p.price.base || 0)
      : Number(p.price || p.originalPrice || 0);

  const thumbnail =
    (Array.isArray(p.images) && p.images[0]?.url) ||
    (Array.isArray(p.images) && typeof p.images[0] === "string" && p.images[0]) ||
    variant0?.images?.[0]?.url ||
    p.thumbnail ||
    p.imageUrl ||
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80";

  let formattedDate = p.archiveDate || "N/A";
  if (p.archivedAt) {
    try {
      const d = new Date(p.archivedAt);
      if (!isNaN(d.getTime())) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        let hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;
        formattedDate = `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
      }
    } catch {
      formattedDate = p.archiveDate || "N/A";
    }
  }

  const reason = p.reason || "Discontinued by Admin";
  const archivedBy = p.archivedBy || "Catalog Team";
  const totalHistoricalSales = Number(p.totalHistoricalSales || p.soldCount || 0);
  const stockAtArchive = Number(p.stockAtArchive ?? p.stock ?? 0);

  return {
    ...p,
    id,
    slug,
    name,
    sku,
    category,
    brand,
    price,
    thumbnail,
    archiveDate: formattedDate,
    rawArchivedAt: p.archivedAt || p.archiveDate,
    reason,
    archivedBy,
    totalHistoricalSales,
    stockAtArchive,
  };
}

export default function ArchivedProductsView() {
  const dispatch = useAppDispatch();
  const reduxProducts = useAppSelector((state) => state.adminArchived?.products || []);

  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProductSlugs, setSelectedProductSlugs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Modal State
  const [detailModalProduct, setDetailModalProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Lock body scroll and listen for Escape key when dossier modal is open
  useEffect(() => {
    if (!detailModalProduct) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setDetailModalProduct(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [detailModalProduct]);

  // React Query Queries & Mutations
  const {
    data: queryData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useArchivedProductsQuery({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
  });

  const restoreMutation = useRestoreProductMutation();
  const hardDeleteMutation = useHardDeleteProductMutation();
  const bulkRestoreMutation = useBulkRestoreProductsMutation();
  const bulkHardDeleteMutation = useBulkHardDeleteProductsMutation();

  // Extract products and pagination from query result or fallback to Redux
  const { products, totalCount, totalPages } = useMemo(() => {
    const rawList =
      queryData?.products ||
      queryData?.data?.products ||
      queryData?.data ||
      (Array.isArray(queryData) ? queryData : null);

    if (rawList && Array.isArray(rawList)) {
      const normalized = rawList.map(normalizeArchivedProduct).filter(Boolean);
      const total =
        queryData?.pagination?.total ??
        queryData?.data?.pagination?.total ??
        queryData?.total ??
        normalized.length;
      const pages =
        queryData?.pagination?.totalPages ??
        queryData?.data?.pagination?.totalPages ??
        queryData?.totalPages ??
        Math.max(1, Math.ceil(total / pageSize));

      return {
        products: normalized,
        totalCount: total,
        totalPages: pages,
      };
    }

    // Fallback: Redux mock store
    const normalizedRedux = reduxProducts.map(normalizeArchivedProduct).filter(Boolean);
    const filtered = normalizedRedux.filter((p) => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      return matchSearch && matchCat;
    });

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      products: paginated,
      totalCount: total,
      totalPages: pages,
    };
  }, [queryData, reduxProducts, debouncedSearch, selectedCategory, currentPage, pageSize]);

  // Dynamic category list for filter dropdown
  const categories = useMemo(() => {
    const all = (queryData?.products || reduxProducts).map((p) =>
      typeof p.category === "object" ? p.category?.name || "General" : p.category || "General"
    );
    const unique = Array.from(new Set(all.filter(Boolean)));
    return ["All", ...unique];
  }, [queryData, reduxProducts]);

  // Multi-select handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProductSlugs(products.map((p) => p.slug || p.id));
    } else {
      setSelectedProductSlugs([]);
    }
  };

  const handleSelectOne = (slug) => {
    if (selectedProductSlugs.includes(slug)) {
      setSelectedProductSlugs(selectedProductSlugs.filter((s) => s !== slug));
    } else {
      setSelectedProductSlugs([...selectedProductSlugs, slug]);
    }
  };

  // Restore single product
  const handleRestore = async (product) => {
    const targetSlug = product.slug || product.id;
    try {
      await restoreMutation.mutateAsync(targetSlug);
      dispatch(reduxRestoreProduct(product.id));
      setSelectedProductSlugs((prev) => prev.filter((s) => s !== targetSlug));
    } catch {
      // Handled by mutation onError
    }
  };

  // Hard delete single product
  const handleConfirmHardDelete = async () => {
    if (!productToDelete) return;
    const targetSlug = productToDelete.slug || productToDelete.id;
    try {
      await hardDeleteMutation.mutateAsync(targetSlug);
      dispatch(reduxDeleteProductPermanently(productToDelete.id));
      setSelectedProductSlugs((prev) => prev.filter((s) => s !== targetSlug));
      setProductToDelete(null);
    } catch {
      // Handled by mutation onError
    }
  };

  // Bulk restore
  const handleBatchRestore = async () => {
    if (selectedProductSlugs.length === 0) return;
    try {
      await bulkRestoreMutation.mutateAsync(selectedProductSlugs);
      dispatch(reduxBatchRestore(selectedProductSlugs));
      setSelectedProductSlugs([]);
    } catch {
      // Handled by mutation onError
    }
  };

  // Bulk hard delete
  const handleConfirmBulkHardDelete = async () => {
    if (selectedProductSlugs.length === 0) return;
    try {
      await bulkHardDeleteMutation.mutateAsync(selectedProductSlugs);
      dispatch(reduxBatchDelete(selectedProductSlugs));
      setSelectedProductSlugs([]);
      setIsBulkDeleteModalOpen(false);
    } catch {
      // Handled by mutation onError
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Slug",
      "SKU",
      "Name",
      "Category",
      "Brand",
      "Wholesale Price (Rs)",
      "Archive Date",
      "Reason",
      "Historical Sales Units",
    ];
    const rows = products.map((p) => [
      p.id,
      `"${p.slug}"`,
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.brand}"`,
      p.price,
      `"${p.archiveDate}"`,
      `"${p.reason}"`,
      p.totalHistoricalSales,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `archived_products_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Archived catalog exported as CSV");
  };

  return (
    <div className="space-y-6 animate-fadeIn font-poppins">
      {/* ── Top Header Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-amber-600" />
              Cold Storage Vault
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Audit Compliant Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-3">
            <span>Archived Products Record</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {totalCount} In Vault
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-1">
            Historical catalogue of discontinued, seasonal, or superseded SKUs. Restore back to active or permanently purge.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh Vault Data"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("w-4 h-4 text-slate-600", isFetching && "animate-spin text-accent")} />
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Archive CSV</span>
          </button>
        </div>
      </div>

      {/* ── KPI Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total In Vault
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalCount}</p>
          <p className="text-[11px] text-slate-400 font-inter mt-0.5">Archived product lines</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Historical Units Sold
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-600 mt-2">
            {products.reduce((acc, p) => acc + (p.totalHistoricalSales || 0), 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 font-inter mt-0.5">Units fulfilled before archive</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Supplier EOL Lines
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">
            {products.filter((p) => p.reason.toLowerCase().includes("eol") || p.reason.toLowerCase().includes("discontinued")).length}
          </p>
          <p className="text-[11px] text-slate-400 font-inter mt-0.5">Vendor discontinued items</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Zero Stock Depleted
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {products.filter((p) => p.stockAtArchive === 0).length}
          </p>
          <p className="text-[11px] text-slate-400 font-inter mt-0.5">Cleanly cleared inventory</p>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, slug, brand, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-poppins focus:outline-none focus:border-accent text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">Category:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px] h-7 text-xs font-bold text-slate-800 border-none bg-transparent shadow-none focus:ring-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs font-poppins">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-xs font-semibold text-slate-500">Rows:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[75px] h-7 text-xs font-bold text-slate-800 border-none bg-transparent shadow-none focus:ring-0">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20" className="text-xs">20</SelectItem>
                <SelectItem value="50" className="text-xs">50</SelectItem>
                <SelectItem value="100" className="text-xs">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Floating Bulk Actions Bar ── */}
      {selectedProductSlugs.length > 0 && (
        <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-black flex items-center justify-center">
              {selectedProductSlugs.length}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-200">
              products selected in vault
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchRestore}
              disabled={bulkRestoreMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className={cn("w-3.5 h-3.5", bulkRestoreMutation.isPending && "animate-spin")} />
              <span>Restore Selected</span>
            </button>
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Permanently</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Archived Products Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-poppins">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-4 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selectedProductSlugs.length === products.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-accent focus:ring-accent cursor-pointer"
                  />
                </th>
                <th className="py-4 px-4">Product Details</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Brand</th>
                <th className="py-4 px-4">Archived On</th>
                <th className="py-4 px-4">Historical Sales</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && !queryData ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400 font-inter">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-accent" />
                    <span>Loading archived products vault...</span>
                  </td>
                </tr>
              ) : isError && products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-rose-500 font-inter space-y-2">
                    <AlertCircle className="w-6 h-6 mx-auto text-rose-500" />
                    <p className="font-bold text-slate-800">Failed to load archived catalog</p>
                    <p className="text-xs text-slate-400">{error?.message || "Please check backend connection"}</p>
                    <button
                      onClick={() => refetch()}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors mt-2"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 font-inter space-y-2">
                    <Package className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="font-bold text-slate-700">No archived products found</p>
                    <p className="text-xs text-slate-400">
                      {debouncedSearch
                        ? `No products match "${debouncedSearch}".`
                        : "Active catalog is clean; no products are currently archived."}
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const slug = product.slug || product.id;
                  const isSelected = selectedProductSlugs.includes(slug);

                  return (
                    <tr
                      key={slug}
                      className={cn(
                        "hover:bg-slate-50/70 transition-colors group",
                        isSelected && "bg-orange-50/30"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(slug)}
                          className="rounded border-slate-300 text-accent focus:ring-accent cursor-pointer"
                        />
                      </td>

                      {/* Product details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate max-w-[240px]">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-inter">
                              <span className="font-mono bg-slate-100 text-slate-600 px-1 py-0.2 rounded text-[10px]">
                                {product.sku}
                              </span>
                              <span>•</span>
                              <span className="font-mono text-slate-500 truncate max-w-[140px]">
                                /{product.slug}
                              </span>
                              {product.price > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="font-semibold text-slate-700">
                                    {formatCurrency(product.price)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700">
                          {product.category}
                        </span>
                      </td>

                      {/* Brand */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold text-slate-700">
                          {product.brand}
                        </span>
                      </td>

                      {/* Archived Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold">{product.archiveDate}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-inter mt-0.5 truncate max-w-[160px]">
                          {product.reason}
                        </p>
                      </td>

                      {/* Sales & Stock */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs space-y-0.5">
                          <p className="text-slate-900 font-bold">
                            {product.totalHistoricalSales.toLocaleString()}{" "}
                            <span className="text-slate-400 font-normal text-[11px]">sold</span>
                          </p>
                          <p className="text-[11px] text-slate-500 font-inter">
                            Depleted Stock:{" "}
                            <strong className={product.stockAtArchive > 0 ? "text-amber-600" : "text-slate-400"}>
                              {product.stockAtArchive}
                            </strong>
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Info Button */}
                          <button
                            onClick={() => setDetailModalProduct(product)}
                            title="Inspect Archive Meta"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Info className="w-4 h-4" />
                          </button>

                          {/* Restore Button */}
                          <button
                            onClick={() => handleRestore(product)}
                            disabled={restoreMutation.isPending}
                            title="Restore to Active Storefront Catalog"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>

                          {/* Permanently Delete Button */}
                          <button
                            onClick={() => setProductToDelete(product)}
                            disabled={hardDeleteMutation.isPending}
                            title="Permanently Delete (Hard Delete)"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer & Pagination ── */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-inter">
          <div>
            Showing{" "}
            <strong className="text-slate-900 font-semibold">
              {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-slate-900 font-semibold">
              {Math.min(currentPage * pageSize, totalCount)}
            </strong>{" "}
            of <strong className="text-slate-900 font-semibold">{totalCount}</strong> archived products
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <span className="px-2 text-slate-600 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Single Product Permanent Delete Dialog ── */}
      <ConfirmDeleteDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmHardDelete}
        title="Permanently Delete Product?"
        description="This action cannot be undone. The product, all associated variants, inventory history, and database records will be permanently erased."
        itemName={productToDelete ? `${productToDelete.name} (${productToDelete.slug})` : ""}
        confirmText="Permanently Delete"
        isLoading={hardDeleteMutation.isPending}
      />

      {/* ── Bulk Permanent Delete Dialog ── */}
      <ConfirmDeleteDialog
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkHardDelete}
        title="Purge Selected Products Permanently?"
        description={`Are you sure you want to permanently erase ${selectedProductSlugs.length} selected products from the database? This action is irreversible.`}
        confirmText="Purge Selected Permanently"
        isLoading={bulkHardDeleteMutation.isPending}
      />

      {/* ── Archive Product Dossier / Metadata Modal ── */}
      {detailModalProduct && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDetailModalProduct(null);
            }
          }}
          className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/90 animate-in fade-in zoom-in-95 duration-150 font-poppins relative z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Archive className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Archive Metadata Dossier
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{detailModalProduct.slug}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailModalProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-xs font-poppins">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <img
                  src={detailModalProduct.thumbnail}
                  alt={detailModalProduct.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{detailModalProduct.name}</p>
                  <p className="text-slate-500 font-mono mt-0.5">SKU: {detailModalProduct.sku}</p>
                  <p className="text-slate-700 font-semibold mt-0.5">
                    {formatCurrency(detailModalProduct.price)} • {detailModalProduct.category}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium text-[11px]">Archived Date</span>
                  <span className="text-slate-900 font-bold mt-0.5 block">{detailModalProduct.archiveDate}</span>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium text-[11px]">Archived By</span>
                  <span className="text-slate-900 font-bold mt-0.5 block">{detailModalProduct.archivedBy}</span>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium text-[11px]">Archive Reason</span>
                  <span className="text-amber-700 font-bold mt-0.5 block">{detailModalProduct.reason}</span>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium text-[11px]">Lifetime Sales Units</span>
                  <span className="text-blue-600 font-bold mt-0.5 block">{detailModalProduct.totalHistoricalSales} units</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setDetailModalProduct(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleRestore(detailModalProduct);
                  setDetailModalProduct(null);
                }}
                disabled={restoreMutation.isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore to Active Catalog</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
