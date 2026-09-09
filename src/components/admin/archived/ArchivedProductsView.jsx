import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  restoreProduct,
  deleteProductPermanently,
  batchRestoreProducts,
  batchDeleteProducts,
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
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function ArchivedProductsView() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.adminArchived?.products || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedReason, setSelectedReason] = useState("All");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [detailModalProduct, setDetailModalProduct] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const reasons = useMemo(() => {
    const set = new Set(products.map((p) => p.reason));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchReason = selectedReason === "All" || p.reason === selectedReason;
      return matchSearch && matchCategory && matchReason;
    });
  }, [products, searchTerm, selectedCategory, selectedReason]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((item) => item !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleRestore = (product) => {
    dispatch(restoreProduct(product.id));
    toast.success(`Product "${product.name}" restored to Active Catalog.`);
  };

  const handleBatchRestore = () => {
    if (selectedProductIds.length === 0) return;
    dispatch(batchRestoreProducts(selectedProductIds));
    toast.success(`${selectedProductIds.length} products restored to active catalog.`);
    setSelectedProductIds([]);
  };

  const handleDeletePermanently = (product) => {
    dispatch(deleteProductPermanently(product.id));
    setConfirmDeleteId(null);
    toast.error(`Product "${product.name}" permanently deleted from vault.`);
  };

  const handleBatchDelete = () => {
    if (selectedProductIds.length === 0) return;
    dispatch(batchDeleteProducts(selectedProductIds));
    toast.error(`${selectedProductIds.length} products purged permanently.`);
    setSelectedProductIds([]);
  };

  const handleExportCSV = () => {
    const headers = ["Archive ID", "SKU", "Name", "Category", "Original Price", "Archive Date", "Reason", "Historical Sales"];
    const rows = filteredProducts.map((p) => [
      p.id,
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.originalPrice,
      p.archiveDate,
      `"${p.reason}"`,
      p.totalHistoricalSales,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `archived_products_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Archived products exported as CSV.");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-slate-500" />
              Cold Storage Vault
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Audit Compliant</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Archived Products Record
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Historical catalogue of discontinued, seasonal, or superseded SKUs with full sales logs and restore capabilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Archive CSV
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total In Vault</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{products.length}</p>
          <p className="text-xs text-slate-400 mt-1">Archived product lines</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Historical Units Sold</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {products.reduce((acc, p) => acc + (p.totalHistoricalSales || 0), 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Units fulfilled before archive</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Supplier EOL</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {products.filter((p) => p.reason.toLowerCase().includes("supplier") || p.reason.toLowerCase().includes("eol")).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Vendor discontinued lines</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Zero Stock Remaining</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {products.filter((p) => p.stockAtArchive === 0).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Cleanly depleted inventory</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or archive ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-inter text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-xs font-medium text-slate-500">Reason:</span>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Batch Actions Bar when items selected */}
      {selectedProductIds.length > 0 && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/20 text-xs font-bold flex items-center justify-center">
              {selectedProductIds.length}
            </span>
            <span className="text-sm font-medium">products selected</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBatchRestore}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-all shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restore Selected
            </button>
            <button
              onClick={handleBatchDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-all shadow"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Purge Permanently
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      selectedProductIds.length === filteredProducts.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </th>
                <th className="p-4">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Archive Reason</th>
                <th className="p-4">Archived On</th>
                <th className="p-4">Sales & Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No archived products found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isSelected = selectedProductIds.includes(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? "bg-slate-50" : ""
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(product.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">{product.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                {product.sku}
                              </span>
                              <span>•</span>
                              <span>₹{product.originalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                            {product.reason}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-1">By: {product.archivedBy}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-slate-600">
                          <p className="font-semibold flex items-center gap-1 text-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {product.archiveDate}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">ID: {product.id}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs space-y-0.5">
                          <p className="text-slate-800 font-semibold">
                            {product.totalHistoricalSales.toLocaleString()} <span className="text-slate-400 font-normal">sold</span>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Vault Stock:{" "}
                            <span className={product.stockAtArchive > 0 ? "text-amber-600 font-semibold" : "text-slate-400"}>
                              {product.stockAtArchive}
                            </span>
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDetailModalProduct(product)}
                            title="Inspect Archive Meta"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRestore(product)}
                            title="Restore Product to Live Catalog"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Restore
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(product.id)}
                            title="Purge Permanently"
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
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
      </div>

      {/* Confirmation Modal for Permanent Delete */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-poppins font-bold text-slate-900">
              Permanently Purge Product?
            </h3>
            <p className="text-sm text-slate-500 font-inter mt-2">
              This action cannot be undone. All historical archive logs and metadata for this SKU will be permanently erased.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const target = products.find((p) => p.id === confirmDeleteId);
                  if (target) handleDeletePermanently(target);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-all shadow-md"
              >
                Purge Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Archive className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">
                    Archive Metadata Dossier
                  </h3>
                  <p className="text-xs text-slate-400">{detailModalProduct.id}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailModalProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <img
                  src={detailModalProduct.thumbnail}
                  alt={detailModalProduct.name}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                />
                <div>
                  <p className="font-bold text-slate-900">{detailModalProduct.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">SKU: {detailModalProduct.sku}</p>
                  <p className="text-xs text-slate-600 mt-1">₹{detailModalProduct.originalPrice.toLocaleString()} • {detailModalProduct.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Archive Date</span>
                  <span className="text-slate-800 font-semibold mt-0.5 block">{detailModalProduct.archiveDate}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Archived By</span>
                  <span className="text-slate-800 font-semibold mt-0.5 block">{detailModalProduct.archivedBy}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Archive Reason</span>
                  <span className="text-amber-700 font-semibold mt-0.5 block">{detailModalProduct.reason}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Lifetime Sales Count</span>
                  <span className="text-emerald-700 font-semibold mt-0.5 block">{detailModalProduct.totalHistoricalSales} units</span>
                </div>
              </div>

              {detailModalProduct.tags && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1.5">Historical Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {detailModalProduct.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setDetailModalProduct(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleRestore(detailModalProduct);
                  setDetailModalProduct(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore to Live Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
