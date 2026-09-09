import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateRetailPrice,
  toggleRetailStatus,
  addRetailProduct,
} from "@/store/slices/adminEcommerceSlice";
import {
  ShoppingBag,
  Search,
  PlusCircle,
  Download,
  SlidersHorizontal,
  DollarSign,
  TrendingUp,
  Tag,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Edit3,
  Percent,
  Layers,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function RetailManagementView() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(
    (state) => state.adminEcommerce?.retailProducts || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit price state
  const [editPrice, setEditPrice] = useState("");
  const [editMrp, setEditMrp] = useState("");

  // Add product form state
  const [newName, setNewName] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newCategory, setNewCategory] = useState("Fashion & Apparel");
  const [newMrp, setNewMrp] = useState("");
  const [newBaseCost, setNewBaseCost] = useState("");
  const [newSellingPrice, setNewSellingPrice] = useState("");
  const [newBadge, setNewBadge] = useState("New Arrival");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchStatus =
        selectedStatus === "All" || p.channelStatus === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const activeCount = useMemo(
    () => products.filter((p) => p.channelStatus === "Active").length,
    [products]
  );

  const avgMargin = useMemo(() => {
    if (products.length === 0) return 0;
    const totalMargin = products.reduce((sum, p) => {
      const margin = ((p.sellingPrice - p.baseCost) / p.sellingPrice) * 100;
      return sum + margin;
    }, 0);
    return (totalMargin / products.length).toFixed(1);
  }, [products]);

  const total30DayUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.sales30Days || 0), 0);
  }, [products]);

  const handleToggleStatus = (id, name, currentStatus) => {
    dispatch(toggleRetailStatus(id));
    if (currentStatus === "Active") {
      toast.warning(`"${name}" paused from retail storefront.`);
    } else {
      toast.success(`"${name}" is now active for retail shoppers.`);
    }
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditPrice(product.sellingPrice.toString());
    setEditMrp(product.mrp.toString());
  };

  const handleSavePrice = (e) => {
    e.preventDefault();
    const priceNum = parseFloat(editPrice);
    const mrpNum = parseFloat(editMrp);

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid retail selling price.");
      return;
    }
    if (isNaN(mrpNum) || mrpNum < priceNum) {
      toast.error("MRP must be greater than or equal to the selling price.");
      return;
    }

    dispatch(
      updateRetailPrice({
        id: editingProduct.id,
        sellingPrice: priceNum,
        mrp: mrpNum,
      })
    );

    toast.success(`Updated pricing for "${editingProduct.name}"!`);
    setEditingProduct(null);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newSellingPrice || !newBaseCost) {
      toast.error("Please fill all required price fields.");
      return;
    }

    const priceNum = parseFloat(newSellingPrice);
    const costNum = parseFloat(newBaseCost);
    const mrpNum = parseFloat(newMrp) || priceNum * 1.3;

    const newProd = {
      id: `RET-${Date.now().toString().slice(-4)}`,
      sku: newSku.trim() || `APX-${Date.now().toString().slice(-6)}`,
      name: newName.trim(),
      category: newCategory,
      mrp: mrpNum,
      baseCost: costNum,
      sellingPrice: priceNum,
      channelStatus: "Active",
      badge: newBadge.trim() || "New Arrival",
      sales30Days: 0,
    };

    dispatch(addRetailProduct(newProd));
    toast.success(`Retail product "${newName}" created successfully!`);
    setIsAddModalOpen(false);
    setNewName("");
    setNewSku("");
    setNewSellingPrice("");
    setNewBaseCost("");
    setNewMrp("");
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "SKU",
      "Product Name",
      "Category",
      "MRP (INR)",
      "Base Cost (INR)",
      "Selling Price (INR)",
      "Gross Margin %",
      "Status",
      "30-Day Sales",
    ];

    const rows = filteredProducts.map((p) => {
      const margin = (((p.sellingPrice - p.baseCost) / p.sellingPrice) * 100).toFixed(1);
      return [
        p.id,
        p.sku,
        `"${p.name.replace(/"/g, '""')}"`,
        p.category,
        p.mrp,
        p.baseCost,
        p.sellingPrice,
        `${margin}%`,
        p.channelStatus,
        p.sales30Days,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `retail_pricing_catalog_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Retail catalog pricing exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Retail Selling & Pricing Management
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 border border-orange-200">
              <ShoppingBag className="h-3 w-3" /> B2C Channel
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage consumer pricing tiers, retail gross margins, MRP markups, and live storefront catalog availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add Retail Product
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Retail Catalog SKUs
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{products.length}</div>
          <p className="mt-1 text-xs text-slate-500">Configured retail products</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Live on Storefront
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">{activeCount}</div>
          <p className="mt-1 text-xs text-slate-500">Active consumer channel items</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Avg Gross Margin
            </span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Percent className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-indigo-600">{avgMargin}%</div>
          <p className="mt-1 text-xs text-slate-500">Gross profit on selling price</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              30-Day B2C Units Sold
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {total30DayUnits.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">Cumulative direct consumer volume</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU or product title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[170px] text-xs rounded-lg border-slate-300 h-9 bg-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {["All", "Active", "Paused"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedStatus === st
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">SKU & Item Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5 text-right">MRP</th>
                <th className="px-6 py-3.5 text-right">Base Cost</th>
                <th className="px-6 py-3.5 text-right">Selling Price</th>
                <th className="px-6 py-3.5 text-center">Gross Margin</th>
                <th className="px-6 py-3.5 text-center">30D Sales</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                    No retail products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const marginPct = (
                    ((prod.sellingPrice - prod.baseCost) / prod.sellingPrice) *
                    100
                  ).toFixed(1);
                  const discountPct = (
                    ((prod.mrp - prod.sellingPrice) / prod.mrp) *
                    100
                  ).toFixed(0);

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-slate-50/75 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {prod.name}
                            {prod.badge && (
                              <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.2 text-[10px] font-semibold text-indigo-700">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-xs text-slate-400 mt-0.5">
                            {prod.sku} • {prod.id}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {prod.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right font-medium text-slate-400 line-through">
                        ₹{prod.mrp.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-right font-mono text-xs text-slate-600">
                        ₹{prod.baseCost.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-slate-900">
                          ₹{prod.sellingPrice.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          {discountPct}% off MRP
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            parseFloat(marginPct) >= 40
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : parseFloat(marginPct) >= 25
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {marginPct}%
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-slate-700">
                        {prod.sales30Days} units
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            handleToggleStatus(
                              prod.id,
                              prod.name,
                              prod.channelStatus
                            )
                          }
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                            prod.channelStatus === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {prod.channelStatus === "Active" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <PauseCircle className="h-3 w-3" />
                          )}
                          {prod.channelStatus}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="inline-flex items-center gap-1 p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                          title="Quick Price Edit"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Edit Price</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Price Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleSavePrice}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Update Retail Price
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {editingProduct.sku} • {editingProduct.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-600">Base Wholesale Cost:</span>
              <span className="font-bold text-slate-900">
                ₹{editingProduct.baseCost.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Retail Selling Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Maximum Retail Price (MRP ₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={editMrp}
                onChange={(e) => setEditMrp(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Live Profit Preview */}
            {parseFloat(editPrice) > 0 && (
              <div className="rounded-lg bg-indigo-50/70 border border-indigo-200 p-3 space-y-1 text-xs">
                <div className="flex justify-between text-indigo-900 font-medium">
                  <span>Gross Profit per Unit:</span>
                  <span className="font-bold">
                    ₹{(parseFloat(editPrice) - editingProduct.baseCost).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-indigo-800">
                  <span>Calculated Margin:</span>
                  <span className="font-bold">
                    {(
                      ((parseFloat(editPrice) - editingProduct.baseCost) /
                        parseFloat(editPrice)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
              >
                Save Price
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Retail Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreateProduct}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Add New Retail Product
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Linen Blend Kurta"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  SKU Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. APX-FSH-010"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Category *
                </label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="w-full rounded-lg border-slate-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fashion & Apparel">Fashion & Apparel</SelectItem>
                    <SelectItem value="Electronics & Audio">Electronics & Audio</SelectItem>
                    <SelectItem value="Home & Living">Home & Living</SelectItem>
                    <SelectItem value="Beauty & Wellness">Beauty & Wellness</SelectItem>
                    <SelectItem value="Jewellery & Accessories">Jewellery & Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Promotional Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bestseller, 30% Off"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Base Cost (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="800"
                  value={newBaseCost}
                  onChange={(e) => setNewBaseCost(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="1499"
                  value={newSellingPrice}
                  onChange={(e) => setNewSellingPrice(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  MRP (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="2499"
                  value={newMrp}
                  onChange={(e) => setNewMrp(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
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
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
