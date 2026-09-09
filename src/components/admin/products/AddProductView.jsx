import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addProduct } from "@/store/slices/adminProductsSlice";
import {
  PackagePlus,
  ArrowLeft,
  DollarSign,
  Layers,
  Boxes,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Tag,
  ShieldCheck,
  Scale,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function AddProductView() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const categories = useAppSelector((state) => state.adminProducts.categories);
  const attributesList = useAppSelector((state) => state.adminProducts.attributes);

  // Form State
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState(categories[0]?.name || "Electrical & Lighting");
  const [subCategory, setSubCategory] = useState(categories[0]?.subCategories[0]?.name || "");
  const [brand, setBrand] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  // Pricing
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [moq, setMoq] = useState("1");
  const [tier2Price, setTier2Price] = useState("");
  const [tier3Price, setTier3Price] = useState("");

  // Stock
  const [stock, setStock] = useState("50");
  const [lowStockThreshold, setLowStockThreshold] = useState("15");
  const [binLocation, setBinLocation] = useState("Bay 1 / Rack A-01");

  // Specs & Attributes
  const [weightKg, setWeightKg] = useState("1.5");
  const [dimensionsCm, setDimensionsCm] = useState("30 × 20 × 10");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"
  );
  const [selectedAttributes, setSelectedAttributes] = useState({
    wattage: "100W",
    voltage: "220-240V AC",
    warranty: "2 Years",
    material: "Die-Cast Aluminum",
  });

  const handleCategoryChange = (catName) => {
    setCategory(catName);
    const selected = categories.find((c) => c.name === catName);
    if (selected && selected.subCategories.length > 0) {
      setSubCategory(selected.subCategories[0].name);
    } else {
      setSubCategory("");
    }
  };

  const handleAttributeChange = (code, val) => {
    setSelectedAttributes((prev) => ({ ...prev, [code]: val }));
  };

  const handleSubmit = (publishStatus = "Active") => {
    if (!name || !sku || !price || !mrp) {
      toast.error("Please fill all required product details (Title, SKU, Price, MRP)");
      return;
    }

    const newProductData = {
      name,
      sku: sku.toUpperCase(),
      category,
      subCategory,
      brand: brand || "ApexMart Wholesale",
      price: Number(price),
      mrp: Number(mrp),
      moq: Number(moq) || 1,
      tierPrices: {
        tier1: { min: 1, max: 9, price: Number(price) },
        tier2: { min: 10, max: 49, price: Number(tier2Price) || Math.round(Number(price) * 0.92) },
        tier3: { min: 50, max: 999, price: Number(tier3Price) || Math.round(Number(price) * 0.85) },
      },
      stock: Number(stock) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 10,
      binLocation,
      weightKg: Number(weightKg) || 1.0,
      dimensionsCm,
      imageUrl,
      status: publishStatus,
      attributes: selectedAttributes,
      shortDescription,
    };

    dispatch(addProduct(newProductData));
    toast.success(`Product ${name} successfully ${publishStatus === "Active" ? "published" : "saved as draft"}!`);
    navigate("/admin/products");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-poppins font-black uppercase tracking-wider">
                New Product
              </span>
              <span className="text-xs text-slate-400 font-inter">B2B Catalog Entry</span>
            </div>
            <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-0.5">
              Add New Wholesale Product
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSubmit("Draft")}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-poppins font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("Active")}
            className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-poppins font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            Publish to Catalog
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-poppins font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Basic Product Information
            </h2>

            <div className="space-y-3 font-inter text-xs">
              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Commercial LED High Bay Light 100W IP65"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-poppins font-bold text-slate-700 mb-1">
                    Master SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., LGT-BAY-100W"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-800 uppercase focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-poppins font-bold text-slate-700 mb-1">
                    Brand / Manufacturer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., LumiPro Industrial"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-poppins font-bold text-slate-700 mb-1">
                    Primary Category *
                  </label>
                  <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full text-xs bg-white border-slate-200 font-poppins font-semibold">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block font-poppins font-bold text-slate-700 mb-1">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="e.g., Industrial Lighting"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Product Description & Bullet Points
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed technical specs, build quality, and use cases..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Wholesale Tier Pricing */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Wholesale B2B Tier Pricing
              </h2>
              <span className="text-[11px] text-slate-400 font-inter">Quantity-based slab discounts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-inter text-xs">
              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Base Wholesale Rate (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    placeholder="1650"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 font-poppins font-bold text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Tier 1 (1 - 9 units)</span>
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Retail MRP (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    placeholder="3200"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Printed benchmark price</span>
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Minimum Order Qty (MOQ)
                </label>
                <input
                  type="number"
                  min="1"
                  value={moq}
                  onChange={(e) => setMoq(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-poppins font-bold text-slate-900 focus:outline-none focus:border-accent"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Minimum bulk order count</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-inter text-xs">
              <p className="font-poppins font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                Volume Slab Rates
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tier 2: 10 - 49 Units (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1480"
                    value={tier2Price}
                    onChange={(e) => setTier2Price(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tier 3: 50+ Units (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1320"
                    value={tier3Price}
                    onChange={(e) => setTier3Price(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Technical Attributes & Specifications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-poppins font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Technical Specifications & Attributes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-inter text-xs">
              {attributesList.map((attr) => (
                <div key={attr.id}>
                  <label className="block font-poppins font-bold text-slate-700 mb-1">
                    {attr.name}
                  </label>
                  <Select
                    value={selectedAttributes[attr.code] || "none"}
                    onValueChange={(val) => handleAttributeChange(attr.code, val === "none" ? "" : val)}
                  >
                    <SelectTrigger className="w-full text-xs bg-white border-slate-200">
                      <SelectValue placeholder="-- Not Applicable --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Not Applicable --</SelectItem>
                      {attr.values.map((v, i) => (
                        <SelectItem key={i} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Stock, Logistics & Image */}
        <div className="space-y-6">
          {/* Media & Image Preview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 font-inter text-xs">
            <h3 className="font-poppins font-bold text-slate-900 text-xs flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-accent" />
              Product Image Preview
            </h3>

            <div className="w-full aspect-video rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              ) : (
                <span className="text-slate-400">No image URL specified</span>
              )}
            </div>

            <div>
              <label className="block font-poppins font-bold text-slate-700 mb-1">
                Image Web URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-[11px] focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Stock & Storage Location */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 font-inter text-xs">
            <h3 className="font-poppins font-bold text-slate-900 text-xs flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-600" />
              Warehouse & Stock Allocation
            </h3>

            <div>
              <label className="block font-poppins font-bold text-slate-700 mb-1">
                Opening Stock Count
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-poppins font-bold text-slate-900 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-poppins font-bold text-slate-700 mb-1">
                Low-Stock Threshold Alert
              </label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-poppins font-bold text-slate-700 mb-1">
                Warehouse Bin / Pallet Location
              </label>
              <input
                type="text"
                placeholder="e.g., Bay 2 / Rack A-12"
                value={binLocation}
                onChange={(e) => setBinLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-800 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Physical Shipping Weight & Size */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 font-inter text-xs">
            <h3 className="font-poppins font-bold text-slate-900 text-xs flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              Logistics Weight & Dimensions
            </h3>

            <div>
              <label className="block font-poppins font-bold text-slate-700 mb-1">
                Unit Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-poppins font-bold text-slate-700 mb-1">
                Package Dimensions (L × W × H cm)
              </label>
              <input
                type="text"
                value={dimensionsCm}
                onChange={(e) => setDimensionsCm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
