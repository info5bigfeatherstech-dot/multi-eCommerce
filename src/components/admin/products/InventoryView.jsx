import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { adjustStock } from "@/store/slices/adminProductsSlice";
import {
  Boxes,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Search,
  Warehouse,
  History,
  X,
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

export default function InventoryView() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.adminProducts.products);
  const inventoryLogs = useAppSelector((state) => state.adminProducts.inventoryLogs);

  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("All"); // All, Low Stock, Out of Stock, In Stock

  // Stock Adjustment Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState("add"); // "add" or "subtract"
  const [adjustmentQty, setAdjustmentQty] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("Dock Inward Shipment");
  const [adjustmentNotes, setAdjustmentNotes] = useState("");

  // KPIs
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValuation = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.binLocation && p.binLocation.toLowerCase().includes(q));

    const matchStock =
      stockFilter === "All" ||
      (stockFilter === "Low Stock" && p.stock > 0 && p.stock <= p.lowStockThreshold) ||
      (stockFilter === "Out of Stock" && p.stock === 0) ||
      (stockFilter === "In Stock" && p.stock > p.lowStockThreshold);

    return matchQuery && matchStock;
  });

  const handleOpenAdjust = (prod) => {
    setSelectedProduct(prod);
    setAdjustmentType("add");
    setAdjustmentQty("");
    setAdjustmentReason("Dock Inward Shipment");
    setAdjustmentNotes("");
  };

  const handleConfirmAdjustment = (e) => {
    e.preventDefault();
    if (!selectedProduct || !adjustmentQty) return;

    const qty = Number(adjustmentQty);
    const finalChange = adjustmentType === "add" ? qty : -qty;

    dispatch(
      adjustStock({
        id: selectedProduct.id,
        adjustmentQty: finalChange,
        reason: adjustmentReason,
        notes: adjustmentNotes,
        adjustedBy: "Inventory Ops Manager",
      })
    );

    toast.success(
      `Adjusted stock for ${selectedProduct.sku}: ${finalChange >= 0 ? "+" : ""}${finalChange} units`
    );
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-poppins font-black uppercase tracking-wider">
              Warehouse Ops
            </span>
            <span className="text-xs text-slate-400 font-inter">Stock Level Control</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            Stock & Inventory Management
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Monitor real-time warehouse inventory counts, storage bay allocations, re-order thresholds, and adjustment audit logs.
          </p>
        </div>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Total Units In Stock
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-slate-900">{totalUnits}</p>
          <span className="text-[10px] text-slate-400 font-inter capitalize">Across all warehouse bays</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Total Stock Valuation
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-emerald-600">
            ₹{totalValuation.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-slate-400 font-inter capitalize">At wholesale base cost</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Low Stock Warnings
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-amber-600">{lowStockProducts.length}</p>
          <span className="text-[10px] text-amber-600 font-medium font-inter capitalize">At or below re-order point</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-slate-400">
              Stockout SKUs
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-black text-rose-600">{outOfStockProducts.length}</p>
          <span className="text-[10px] text-rose-600 font-medium font-inter capitalize">Zero available inventory</span>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU, Product title, or Bay / Bin location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-inter text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-accent bg-slate-50/50 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["All", "Low Stock", "Out of Stock", "In Stock"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStockFilter(filter)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-poppins font-semibold whitespace-nowrap transition-all cursor-pointer",
                stockFilter === filter
                  ? "bg-accent text-white shadow-xs font-bold"
                  : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ── Inventory Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Item & SKU</th>
                <th className="py-3.5 px-4">Warehouse Location</th>
                <th className="py-3.5 px-4 text-center">Available Stock</th>
                <th className="py-3.5 px-4 text-center">Re-order Level</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-inter">
              {filteredProducts.map((p) => {
                const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
                const isOut = p.stock === 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-poppins font-bold text-slate-900 text-xs line-clamp-1">
                        {p.name}
                      </p>
                      <span className="font-mono text-[11px] text-slate-400">SKU: {p.sku}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 flex items-center gap-1.5 pt-4">
                      <Warehouse className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.binLocation || "General Floor"}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-poppins font-black text-sm text-slate-900">
                      {p.stock}
                    </td>

                    <td className="py-3.5 px-4 text-center text-slate-500 font-medium">
                      {p.lowStockThreshold} units
                    </td>

                    <td className="py-3.5 px-4">
                      {isOut ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-poppins font-bold uppercase">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-poppins font-bold uppercase">
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-poppins font-bold uppercase">
                          Healthy Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenAdjust(p)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-poppins font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                      >
                        <span>Adjust</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Recent Stock Adjustment Audit Logs ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-accent" />
          <h3 className="font-poppins font-bold text-slate-900 text-sm">
            Recent Inventory Adjustment History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-inter">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-poppins font-bold uppercase text-[10px]">
                <th className="p-2.5">Date / Time</th>
                <th className="p-2.5">SKU</th>
                <th className="p-2.5 text-center">Change</th>
                <th className="p-2.5">Reason Type</th>
                <th className="p-2.5 text-center">Resulting Stock</th>
                <th className="p-2.5">Adjusted By</th>
                <th className="p-2.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventoryLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="p-2.5 font-mono text-slate-400 text-[11px]">{log.date}</td>
                  <td className="p-2.5 font-mono font-bold text-slate-800">{log.sku}</td>
                  <td className="p-2.5 text-center font-poppins font-black">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded",
                        log.change.startsWith("+")
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      )}
                    >
                      {log.change}
                    </span>
                  </td>
                  <td className="p-2.5 font-medium text-slate-700">{log.type}</td>
                  <td className="p-2.5 text-center font-bold text-slate-900">{log.resultingStock}</td>
                  <td className="p-2.5 text-slate-500">{log.adjustedBy}</td>
                  <td className="p-2.5 text-slate-400 italic">{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Adjust Stock Modal ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-poppins font-bold text-slate-900 text-sm">Quick Stock Adjustment</h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  {selectedProduct.sku} · Current: {selectedProduct.stock} units
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjustment} className="p-5 space-y-4 text-xs font-inter">
              <p className="font-poppins font-bold text-slate-800 text-xs line-clamp-1">
                {selectedProduct.name}
              </p>

              {/* Adjustment Mode Switch */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAdjustmentType("add")}
                  className={cn(
                    "py-2 rounded-lg font-poppins font-bold text-xs flex items-center justify-center gap-1.5 transition-all",
                    adjustmentType === "add"
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Inward Stock (+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentType("subtract")}
                  className={cn(
                    "py-2 rounded-lg font-poppins font-bold text-xs flex items-center justify-center gap-1.5 transition-all",
                    adjustmentType === "subtract"
                      ? "bg-white text-rose-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Deduct Stock (-)</span>
                </button>
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Quantity ({adjustmentType === "add" ? "Units to Inward" : "Units to Deduct"}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g., 25"
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-poppins font-bold text-slate-900 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Adjustment Reason Type
                </label>
                <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                  <SelectTrigger className="w-full text-xs bg-white border-slate-200 font-semibold">
                    <SelectValue placeholder="Select Reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dock Inward Shipment">Dock Inward Shipment (PO Received)</SelectItem>
                    <SelectItem value="RTO Restocked">RTO / Customer Return Restocked</SelectItem>
                    <SelectItem value="Physical Stock Count Audit">Physical Warehouse Count Audit</SelectItem>
                    <SelectItem value="Damaged / Scrapped">Damaged / Scrapped / Expired</SelectItem>
                    <SelectItem value="Customer Sample Dispatched">Customer Sample Dispatched</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  PO Number / Audit Reference Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Factory delivery Challan #9981 verified..."
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-poppins font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={cn(
                    "px-4 py-2 rounded-xl text-white font-poppins font-bold shadow-sm",
                    adjustmentType === "add"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  )}
                >
                  Save Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
