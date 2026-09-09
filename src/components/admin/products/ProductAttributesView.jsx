import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addAttribute,
  addAttributeValue,
  removeAttributeValue,
} from "@/store/slices/adminProductsSlice";
import {
  Tag,
  Plus,
  X,
  Sliders,
  CheckCircle2,
  Sparkles,
  Layers,
  Search,
  Check,
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

export default function ProductAttributesView() {
  const dispatch = useAppDispatch();
  const attributes = useAppSelector((state) => state.adminProducts.attributes);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Attribute Form
  const [attrName, setAttrName] = useState("");
  const [attrCode, setAttrCode] = useState("");
  const [attrCategory, setAttrCategory] = useState("General Technical");
  const [attrInputType, setAttrInputType] = useState("Select");
  const [attrValuesRaw, setAttrValuesRaw] = useState("");

  // Inline Value Add Input State
  const [activeInputAttrId, setActiveInputAttrId] = useState(null);
  const [newValueText, setNewValueText] = useState("");

  const handleCreateAttribute = (e) => {
    e.preventDefault();
    if (!attrName) return;

    const parsedValues = attrValuesRaw
      ? attrValuesRaw.split(",").map((v) => v.trim()).filter(Boolean)
      : [];

    dispatch(
      addAttribute({
        name: attrName,
        code: attrCode || attrName.toLowerCase().replace(/[^a-z0-9]+/g, ""),
        category: attrCategory,
        inputType: attrInputType,
        values: parsedValues,
      })
    );

    toast.success(`Attribute "${attrName}" created`);
    setIsAddModalOpen(false);
    setAttrName("");
    setAttrCode("");
    setAttrValuesRaw("");
  };

  const handleAddInlineValue = (attrId) => {
    if (!newValueText.trim()) return;

    dispatch(addAttributeValue({ attributeId: attrId, value: newValueText.trim() }));
    toast.success(`Added "${newValueText.trim()}"`);
    setNewValueText("");
    setActiveInputAttrId(null);
  };

  const handleRemoveValue = (attrId, val) => {
    dispatch(removeAttributeValue({ attributeId: attrId, value: val }));
    toast.info(`Removed "${val}"`);
  };

  const filteredAttributes = attributes.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.values.some((v) => v.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-poppins font-black uppercase tracking-wider">
              Technical Specifications
            </span>
            <span className="text-xs text-slate-400 font-inter">Attribute Dictionary</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            Product Specifications & Attributes
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Configure standardized B2B technical parameters, ratings, certifications, and acceptable value sets for product filtering.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-poppins font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Attribute</span>
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search attributes, codes, or specification values..."
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

      {/* ── Attributes Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAttributes.map((attr) => (
          <div
            key={attr.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-sm">{attr.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[11px] text-accent font-semibold">
                      #{attr.code}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500 font-inter">{attr.category}</span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-poppins font-bold uppercase">
                  {attr.inputType}
                </span>
              </div>

              {/* Pill Tags Area */}
              <div className="pt-2">
                <p className="text-[10px] font-poppins font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Defined Values ({attr.values.length})
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {attr.values.map((val, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-inter group hover:border-slate-300"
                    >
                      <span>{val}</span>
                      <button
                        onClick={() => handleRemoveValue(attr.id, val)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete value"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Value Inline */}
            <div className="pt-3 border-t border-slate-100">
              {activeInputAttrId === attr.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter value..."
                    value={newValueText}
                    onChange={(e) => setNewValueText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInlineValue(attr.id);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-accent text-xs font-inter text-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddInlineValue(attr.id)}
                    className="p-1.5 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveInputAttrId(null);
                      setNewValueText("");
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveInputAttrId(attr.id);
                    setNewValueText("");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-poppins font-bold text-accent hover:text-accent-hover transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Specification Value</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Add New Attribute Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-poppins font-bold text-slate-900 text-sm">Add Specification Attribute</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAttribute} className="p-5 space-y-4 text-xs font-inter">
              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Attribute Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Pipe Diameter / Bore Size"
                  value={attrName}
                  onChange={(e) => {
                    setAttrName(e.target.value);
                    setAttrCode(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, ""));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  System Code
                </label>
                <input
                  type="text"
                  placeholder="pipeDiameter"
                  value={attrCode}
                  onChange={(e) => setAttrCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-poppins font-bold text-slate-700 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Mechanical"
                    value={attrCategory}
                    onChange={(e) => setAttrCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-poppins font-bold text-slate-700 mb-1">
                    Input Field Type
                  </label>
                  <Select value={attrInputType} onValueChange={setAttrInputType}>
                    <SelectTrigger className="w-full text-xs bg-white border-slate-200 font-semibold">
                      <SelectValue placeholder="Field Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Select">Dropdown Select</SelectItem>
                      <SelectItem value="Text">Free Text</SelectItem>
                      <SelectItem value="Number">Numeric Value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Initial Value Options (Comma Separated)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., 0.5 inch, 1.0 inch, 1.5 inch, 2.0 inch"
                  value={attrValuesRaw}
                  onChange={(e) => setAttrValuesRaw(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-poppins font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold shadow-sm"
                >
                  Save Attribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
