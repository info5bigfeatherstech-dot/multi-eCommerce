import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteProduct,
  toggleProductStatus,
  updateProduct,
} from "@/store/slices/adminProductsSlice";
import {
  Package,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Tag,
  Boxes,
  DollarSign,
  TrendingUp,
  X,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function AllProductsView() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.adminProducts.products);
  const categories = useAppSelector((state) => state.adminProducts.categories);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStockStatus, setSelectedStockStatus] = useState("All"); // All, In Stock, Low Stock, Out of Stock
  const [selectedStatus, setSelectedStatus] = useState("All"); // All, Active, Draft

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editMrp, setEditMrp] = useState("");
  const [editMoq, setEditMoq] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editStatus, setEditStatus] = useState("Active");

  // Summary KPIs
  const totalProducts = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalStockValue = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesStockStatus =
        selectedStockStatus === "All" ||
        (selectedStockStatus === "In Stock" && item.stock > item.lowStockThreshold) ||
        (selectedStockStatus === "Low Stock" && item.stock > 0 && item.stock <= item.lowStockThreshold) ||
        (selectedStockStatus === "Out of Stock" && item.stock === 0);

      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStockStatus && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStockStatus, selectedStatus]);

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setEditPrice(prod.price);
    setEditMrp(prod.mrp);
    setEditMoq(prod.moq);
    setEditStock(prod.stock);
    setEditStatus(prod.status);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    dispatch(
      updateProduct({
        id: editingProduct.id,
        updates: {
          price: Number(editPrice),
          mrp: Number(editMrp),
          moq: Number(editMoq),
          stock: Number(editStock),
          status: editStatus,
        },
      })
    );

    toast.success(`Updated ${editingProduct.name}`);
    setEditingProduct(null);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(deleteProduct(id));
      toast.success("Product removed from catalog");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "SKU",
      "Product Name",
      "Category",
      "Sub Category",
      "Brand",
      "Base Wholesale Price (Rs)",
      "MRP (Rs)",
      "MOQ",
      "Stock Level",
      "Status",
      "Bin Location",
    ];

    const rows = filteredProducts.map((p) => [
      p.sku,
      `"${p.name}"`,
      `"${p.category}"`,
      `"${p.subCategory || ""}"`,
      `"${p.brand || ""}"`,
      p.price,
      p.mrp,
      p.moq,
      p.stock,
      p.status,
      `"${p.binLocation || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apexmart_products_catalogue_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported catalogue to CSV");
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-accent text-[10px] font-poppins font-black uppercase tracking-wider">
              Wholesale Catalog
            </span>
            <span className="text-xs text-slate-400 font-inter">Inventory & SKU Database</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            All Products Catalogue
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Manage your entire B2B wholesale master catalog, tier pricing, inventory levels, and visibility status.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-poppins font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-poppins font-bold transition-all shadow-xs active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Total SKUs Listed
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-accent flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">{totalProducts}</p>
          <span className="text-[10px] text-slate-400 font-inter">Master active items</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Total Stock Valuation
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-emerald-600">
            ₹{totalStockValue.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-slate-400 font-inter">{totalStockUnits} total units in warehouse</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Low Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-amber-600">{lowStockCount}</p>
          <span className="text-[10px] text-amber-600 font-medium font-inter">Re-order threshold breached</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Out of Stock
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-rose-600">{outOfStockCount}</p>
          <span className="text-[10px] text-rose-600 font-medium font-inter">Requires urgent replenishment</span>
        </div>
      </div>

      {/* ── Filters & Search Controls ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Product name, SKU, Brand, or Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-inter text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-accent bg-slate-50/50 focus:bg-white transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="w-44">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-10 text-xs bg-white border-slate-200">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Status Filter */}
          <div className="w-40">
            <Select value={selectedStockStatus} onValueChange={setSelectedStockStatus}>
              <SelectTrigger className="h-10 text-xs bg-white border-slate-200">
                <SelectValue placeholder="All Stock Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Stock Levels</SelectItem>
                <SelectItem value="In Stock">In Stock (&gt; Threshold)</SelectItem>
                <SelectItem value="Low Stock">Low Stock Alert</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock (0)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Publish Status Filter */}
          <div className="w-36">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-10 text-xs bg-white border-slate-200">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active (Public)</SelectItem>
                <SelectItem value="Draft">Draft (Hidden)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchQuery || selectedCategory !== "All" || selectedStockStatus !== "All" || selectedStatus !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedStockStatus("All");
                setSelectedStatus("All");
              }}
              className="px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Products Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Category & Brand</th>
                <th className="py-3.5 px-4">Wholesale Price (₹)</th>
                <th className="py-3.5 px-4">Tier Rates</th>
                <th className="py-3.5 px-4">Stock & Bin</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-inter">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-poppins font-bold text-slate-700">No products found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try altering your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
                  const isOut = p.stock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product details with image */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0 bg-slate-50"
                          />
                          <div className="min-w-0 max-w-[280px]">
                            <p className="font-poppins font-bold text-slate-900 text-xs line-clamp-1">
                              {p.name}
                            </p>
                            <span className="text-[11px] font-mono text-slate-400 font-medium">
                              SKU: {p.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Brand */}
                      <td className="py-4 px-4">
                        <p className="font-poppins font-semibold text-slate-800 text-xs">
                          {p.category}
                        </p>
                        <p className="text-[11px] text-slate-400">{p.brand || "Generic Wholesale"}</p>
                      </td>

                      {/* Price & MRP */}
                      <td className="py-4 px-4 font-poppins">
                        <p className="font-bold text-slate-900 text-sm">
                          ₹{p.price.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10px] text-slate-400 line-through">
                          MRP ₹{p.mrp.toLocaleString("en-IN")}
                        </p>
                      </td>

                      {/* Tier Rates Preview */}
                      <td className="py-4 px-4 font-inter text-[11px] text-slate-600 space-y-0.5">
                        {p.tierPrices ? (
                          <>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 text-[10px]">10-49:</span>
                              <span className="font-semibold text-slate-800">
                                ₹{p.tierPrices.tier2?.price || p.price}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 text-[10px]">50+:</span>
                              <span className="font-bold text-emerald-600">
                                ₹{p.tierPrices.tier3?.price || p.price}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="text-slate-400">Flat rate</span>
                        )}
                      </td>

                      {/* Stock & Bin */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-poppins font-bold text-xs",
                              isOut ? "text-rose-600" : isLow ? "text-amber-600" : "text-slate-900"
                            )}
                          >
                            {p.stock} units
                          </span>
                          {isLow && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                              Low
                            </span>
                          )}
                          {isOut && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">
                              Out
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {p.binLocation || "Unassigned Bin"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => {
                            dispatch(toggleProductStatus(p.id));
                            toast.info(`Toggled ${p.name} to ${p.status === "Active" ? "Draft" : "Active"}`);
                          }}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-poppins font-bold uppercase transition-colors cursor-pointer",
                            p.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                          )}
                        >
                          {p.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Quick Edit Product"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-orange-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

      {/* ── Quick Edit Modal ── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-poppins font-bold text-slate-900 text-sm">Quick Edit Product</h3>
                <p className="text-[10px] text-slate-400 font-mono">{editingProduct.sku}</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs font-inter">
              <p className="font-poppins font-bold text-slate-800 text-xs line-clamp-1">
                {editingProduct.name}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-poppins font-bold text-slate-700 mb-1">
                    Base Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-poppins font-bold text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-poppins font-bold text-slate-700 mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editMrp}
                    onChange={(e) => setEditMrp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-poppins font-bold text-slate-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-poppins font-bold text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-poppins font-bold text-slate-700 mb-1">
                    MOQ (Min Order Qty)
                  </label>
                  <input
                    type="number"
                    required
                    value={editMoq}
                    onChange={(e) => setEditMoq(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Catalog Status
                </label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="w-full text-xs bg-white border-slate-200 font-poppins font-semibold">
                    <SelectValue placeholder="Catalog Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active (Visible to Buyers)</SelectItem>
                    <SelectItem value="Draft">Draft (Internal Only)</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-poppins font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
