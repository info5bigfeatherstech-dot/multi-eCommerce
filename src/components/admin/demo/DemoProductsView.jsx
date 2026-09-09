import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addSampleProduct } from "@/store/slices/adminDemoSlice";
import {
  Boxes,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Copy,
  Layers,
  Sparkles,
  Tag,
  CheckCircle2,
  Percent,
  TrendingUp,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  Package,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function DemoProductsView() {
  const dispatch = useAppDispatch();
  const sampleProducts = useAppSelector((state) => state.adminDemo?.sampleProducts || []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product state
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Consumer Electronics",
    brand: "",
    retailPrice: 2999,
    wholesalePrice: 1899,
    wholesaleMinQty: 20,
    dropshipPrice: 2199,
    franchiseMargin: "25%",
    franchisePayout: 750,
    stockQty: 500,
    stockStatus: "In Stock",
    supportedChannels: ["Retail", "Wholesale", "Dropshipping", "Franchise"],
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80",
    hsnCode: "85183000",
    gstRate: 18,
  });

  const categories = ["All", ...Array.from(new Set(sampleProducts.map((p) => p.category)))];
  const channels = ["All", "Retail", "Wholesale", "Dropshipping", "Franchise"];

  const filteredProducts = sampleProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel =
      selectedChannel === "All" || product.supportedChannels.includes(selectedChannel);
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesChannel && matchesCategory;
  });

  const handleCloneProduct = (product) => {
    toast.success(`Copied "${product.name}" specs to clipboard & ready for active catalog import!`);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name.trim()) {
      toast.error("Please enter a product name.");
      return;
    }

    dispatch(addSampleProduct({
      ...newProduct,
      sku: `SMP-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: 4.8,
      reviewsCount: 1,
    }));

    setIsAddModalOpen(false);
    toast.success(`Demo product "${newProduct.name}" added to showcase catalog!`);
    setNewProduct({
      name: "",
      category: "Consumer Electronics",
      brand: "",
      retailPrice: 2999,
      wholesalePrice: 1899,
      wholesaleMinQty: 20,
      dropshipPrice: 2199,
      franchiseMargin: "25%",
      franchisePayout: 750,
      stockQty: 500,
      stockStatus: "In Stock",
      supportedChannels: ["Retail", "Wholesale", "Dropshipping", "Franchise"],
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80",
      hsnCode: "85183000",
      gstRate: 18,
    });
  };

  const handleExportCsv = () => {
    const headers = [
      "ID",
      "SKU",
      "Name",
      "Category",
      "Brand",
      "Retail Price (INR)",
      "Wholesale Price (INR)",
      "Min Wholesale Qty",
      "Dropship Price (INR)",
      "Franchise Margin",
      "Stock Qty",
      "Status",
    ];
    const rows = filteredProducts.map((p) => [
      p.id,
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.brand,
      p.retailPrice,
      p.wholesalePrice,
      p.wholesaleMinQty,
      p.dropshipPrice,
      p.franchiseMargin,
      p.stockQty,
      p.stockStatus,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `demo_products_multitier_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sample product catalog exported.");
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-poppins font-black text-slate-900 tracking-tight">
                  Sample Multi-Tier Products
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-800 border border-blue-200">
                  {filteredProducts.length} Items Showcase
                </span>
              </div>
              <p className="text-xs text-slate-500 font-inter mt-0.5">
                Demonstrates how a single SKU dynamically supports Retail MRP, Wholesale tier slabs, Dropshipper costs, and Franchise margins.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent text-white text-xs font-poppins font-bold shadow-xs hover:bg-accent/90 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sample Product</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-poppins font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Catalog</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sample products by name, SKU, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent bg-slate-50/50"
            />
          </div>

          {/* Category Shadcn dropdown */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <span className="text-xs font-poppins font-bold text-slate-500 whitespace-nowrap">Category:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-9 text-xs rounded-xl bg-slate-50/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Channel Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-xs font-poppins font-bold text-slate-500 whitespace-nowrap">Sales Channel:</span>
          {channels.map((channel) => (
            <button
              key={channel}
              onClick={() => setSelectedChannel(channel)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-poppins font-semibold whitespace-nowrap transition-colors cursor-pointer",
                selectedChannel === channel
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {channel}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            {/* Image and Header */}
            <div>
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/90 text-slate-800 backdrop-blur-xs shadow-2xs">
                    {product.sku}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-2xs">
                    {product.stockStatus}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="p-2 rounded-xl bg-white/90 text-slate-700 hover:bg-white hover:text-accent shadow-xs transition-colors cursor-pointer"
                    title="Quick View Specs"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-2 rounded-xl bg-white/90 text-slate-700 hover:bg-white hover:text-slate-900 shadow-xs transition-colors cursor-pointer"
                        title="Product Options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Product Controls</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedProduct(product)}>
                        <Eye className="w-4 h-4 mr-2 text-slate-500" />
                        <span>View Tier Specs</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCloneProduct(product)}>
                        <Copy className="w-4 h-4 mr-2 text-slate-500" />
                        <span>Copy SKU Info</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          toast.success(`Inventory audit verified for ${product.sku}: ${product.stockQty} units available.`);
                        }}
                      >
                        <Package className="w-4 h-4 mr-2 text-emerald-600" />
                        <span>Verify Stock Count</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-inter mb-0.5">
                    <span>{product.brand}</span>
                    <span>HSN: {product.hsnCode} ({product.gstRate}%)</span>
                  </div>
                  <h3 className="text-sm font-poppins font-bold text-slate-900 line-clamp-1">
                    {product.name}
                  </h3>
                </div>

                {/* Multi-tier Pricing Grid */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                  <div className="text-[10px] font-poppins font-black uppercase text-slate-400 tracking-wider">
                    Multi-Tier Price Matrix
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 font-inter block">Retail MRP</span>
                      <span className="font-poppins font-black text-slate-900">
                        ₹{product.retailPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200/70">
                      <span className="text-[10px] text-indigo-600 font-inter font-semibold block">
                        Wholesale (Min {product.wholesaleMinQty})
                      </span>
                      <span className="font-poppins font-black text-indigo-700">
                        ₹{product.wholesalePrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200/70">
                      <span className="text-[10px] text-amber-600 font-inter font-semibold block">Dropship Cost</span>
                      <span className="font-poppins font-black text-amber-700">
                        ₹{product.dropshipPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200/70">
                      <span className="text-[10px] text-emerald-600 font-inter font-semibold block">Franchise Margin</span>
                      <span className="font-poppins font-black text-emerald-700">
                        {product.franchiseMargin} (+₹{product.franchisePayout})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Supported Channels tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {product.supportedChannels.map((ch) => (
                    <span
                      key={ch}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 pt-0">
              <button
                onClick={() => setSelectedProduct(product)}
                className="w-full py-2 rounded-xl border border-slate-200 text-xs font-poppins font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Pricing & Inventory Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    {selectedProduct.sku}
                  </span>
                  <h3 className="text-base font-poppins font-bold text-slate-900">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-inter">
                    {selectedProduct.brand} • {selectedProduct.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pricing Deep Dive */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="text-xs font-poppins font-bold text-slate-700 uppercase tracking-wider">
                Dynamic Pricing Engine Breakdown
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 text-[11px] block">Customer Retail Price</span>
                  <span className="text-lg font-poppins font-black text-slate-900">
                    ₹{selectedProduct.retailPrice.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">B2C Storefront checkout price</p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                  <span className="text-indigo-700 text-[11px] font-semibold block">B2B Wholesale Tier</span>
                  <span className="text-lg font-poppins font-black text-indigo-700">
                    ₹{selectedProduct.wholesalePrice.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-indigo-600 mt-0.5">Min Order: {selectedProduct.wholesaleMinQty} units</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                  <span className="text-amber-700 text-[11px] font-semibold block">Dropship Procurement</span>
                  <span className="text-lg font-poppins font-black text-amber-700">
                    ₹{selectedProduct.dropshipPrice.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-amber-600 mt-0.5">Reseller profit: ₹{selectedProduct.retailPrice - selectedProduct.dropshipPrice}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-emerald-700 text-[11px] font-semibold block">Franchise Commission</span>
                  <span className="text-lg font-poppins font-black text-emerald-700">
                    {selectedProduct.franchiseMargin}
                  </span>
                  <p className="text-[10px] text-emerald-600 mt-0.5">₹{selectedProduct.franchisePayout} payout per unit sold</p>
                </div>
              </div>
            </div>

            {/* Warehouse & Tax */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-inter">Live Inventory</span>
                <span className="font-poppins font-bold text-slate-800">{selectedProduct.stockQty} Units</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-inter">HSN / SAC</span>
                <span className="font-poppins font-bold text-slate-800">{selectedProduct.hsnCode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-inter">GST Tax Rate</span>
                <span className="font-poppins font-bold text-slate-800">{selectedProduct.gstRate}%</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  handleCloneProduct(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-poppins font-bold hover:bg-accent/90 cursor-pointer"
              >
                Copy SKU & Pricing Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sample Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-poppins font-bold text-slate-900">
                Add New Sample Product
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-poppins font-bold text-slate-700 block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Ergonomic Mouse"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-poppins font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(val) => setNewProduct({ ...newProduct, category: val })}
                  >
                    <SelectTrigger className="w-full rounded-xl border-slate-200 text-xs font-inter">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consumer Electronics">Consumer Electronics</SelectItem>
                      <SelectItem value="FMCG & Gourmet">FMCG & Gourmet</SelectItem>
                      <SelectItem value="Fashion & Apparel">Fashion & Apparel</SelectItem>
                      <SelectItem value="Home & Appliances">Home & Appliances</SelectItem>
                      <SelectItem value="Industrial & B2B">Industrial & B2B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-poppins font-bold text-slate-700 block mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Tech"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Multi-tier pricing inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-poppins font-semibold text-slate-600 block mb-1">
                    Retail MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.retailPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, retailPrice: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-inter"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-poppins font-semibold text-slate-600 block mb-1">
                    Wholesale (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.wholesalePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, wholesalePrice: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-inter"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-poppins font-semibold text-slate-600 block mb-1">
                    Dropship (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.dropshipPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, dropshipPrice: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-inter"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-poppins font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-poppins font-bold hover:bg-accent/90 cursor-pointer"
                >
                  Save Sample Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
