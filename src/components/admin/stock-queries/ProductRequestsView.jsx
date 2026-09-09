import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  broadcastProductRestock,
  triggerSupplierPO,
} from "@/store/slices/adminStockQueriesSlice";
import {
  Package,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Truck,
  Send,
  Users,
  DollarSign,
  Clock,
  Sparkles,
  ChevronRight,
  ShoppingCart,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductRequestsView() {
  const dispatch = useAppDispatch();
  const productDemands = useAppSelector((state) => state.adminStockQueries?.productDemands || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [poModalProduct, setPoModalProduct] = useState(null);
  const [poCodeInput, setPoCodeInput] = useState("");

  const categories = useMemo(() => {
    const set = new Set(productDemands.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [productDemands]);

  const filteredDemands = useMemo(() => {
    return productDemands.filter((p) => {
      const matchSearch =
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [productDemands, searchTerm, selectedCategory]);

  const totalWaitlistCount = useMemo(() => {
    return productDemands.reduce((sum, p) => sum + (p.pendingWaitlist || 0), 0);
  }, [productDemands]);

  const totalDemandValue = useMemo(() => {
    return productDemands.reduce((sum, p) => sum + (p.potentialDemandValue || 0), 0);
  }, [productDemands]);

  const handleBroadcast = (product) => {
    dispatch(broadcastProductRestock({ productId: product.productId }));
    toast.success(`Broadcasted restock alerts to ${product.pendingWaitlist} customers for "${product.productName}".`);
  };

  const handleOpenPOModal = (product) => {
    setPoModalProduct(product);
    setPoCodeInput(`PO-${Math.floor(1000 + Math.random() * 9000)} In Progress`);
  };

  const handleConfirmPO = (e) => {
    e.preventDefault();
    if (!poModalProduct) return;
    dispatch(triggerSupplierPO({ productId: poModalProduct.productId, poCode: poCodeInput }));
    toast.success(`Restock Purchase Order "${poCodeInput}" submitted to ${poModalProduct.supplierName}.`);
    setPoModalProduct(null);
  };

  const handleExportCSV = () => {
    const headers = ["Product ID", "Product Name", "SKU", "Category", "Unit Price", "Total Requests", "Pending Waitlist", "Potential Demand Value (INR)", "Supplier", "Lead Time Days", "PO Status", "Expected Restock"];
    const rows = filteredDemands.map((p) => [
      p.productId,
      `"${p.productName.replace(/"/g, '""')}"`,
      p.sku,
      p.category,
      p.unitPrice,
      p.totalRequests,
      p.pendingWaitlist,
      p.potentialDemandValue,
      `"${p.supplierName}"`,
      p.supplierLeadTimeDays,
      `"${p.restockPOStatus}"`,
      p.expectedRestockDate,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `product_stock_demands_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Product demand requests exported.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-blue-600" />
              SKU Demand Clustering
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Supplier Procurement Link</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Customers Requested Products
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Aggregated waitlists grouped by out-of-stock products to prioritize replenishment orders and supplier purchase orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Demand CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{productDemands.length}</p>
          <p className="text-xs text-slate-400 mt-1">Products with customer waitlists</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Waitlisted Buyers</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{totalWaitlistCount}</p>
          <p className="text-xs text-slate-400 mt-1">Active customer back-in-stock alerts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unrealized Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            ₹{totalDemandValue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Gross potential from waitlisted units</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Supplier Lead Time</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {Math.round(
              productDemands.reduce((acc, p) => acc + p.supplierLeadTimeDays, 0) /
                (productDemands.length || 1)
            )}{" "}
            days
          </p>
          <p className="text-xs text-slate-400 mt-1">Factory order turnaround</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-inter text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2.5">
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
        </div>
      </div>

      {/* Products Demand Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Requested Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Waitlist Demand</th>
                <th className="p-4">Potential Revenue</th>
                <th className="p-4">Supplier & Lead Time</th>
                <th className="p-4">Replenishment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredDemands.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No requested products found</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust search terms or category</p>
                  </td>
                </tr>
              ) : (
                filteredDemands.map((product) => {
                  const hasPending = product.pendingWaitlist > 0;
                  return (
                    <tr key={product.productId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnail}
                            alt={product.productName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">{product.productName}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                {product.sku}
                              </span>
                              <span>•</span>
                              <span>₹{product.unitPrice.toLocaleString()} / unit</span>
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
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-base">
                              {product.pendingWaitlist}
                            </span>
                            <span className="text-xs text-slate-400">buyers waiting</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Total lifetime requests: {product.totalRequests}
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-900">₹{product.potentialDemandValue.toLocaleString()}</p>
                          <p className="text-[11px] text-slate-400">Estimated value</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-xs space-y-0.5">
                          <p className="font-semibold text-slate-800">{product.supplierName}</p>
                          <p className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {product.supplierLeadTimeDays} days turnaround
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                              product.restockPOStatus.includes("In Transit")
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : product.restockPOStatus.includes("Restocked")
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            <Truck className="w-3.5 h-3.5" />
                            {product.restockPOStatus}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5">ETA: {product.expectedRestockDate}</p>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenPOModal(product)}
                            title="Trigger Supplier Purchase Order"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
                            Create PO
                          </button>

                          {hasPending && (
                            <button
                              onClick={() => handleBroadcast(product)}
                              title="Broadcast Restock Alert to All Waitlisted Buyers"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
                            >
                              <Send className="w-3 h-3" />
                              Broadcast ({product.pendingWaitlist})
                            </button>
                          )}
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

      {/* Supplier PO Modal */}
      {poModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmPO}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-slate-100 text-slate-800">
                  <Truck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">
                    Trigger Replenishment PO
                  </h3>
                  <p className="text-xs text-slate-400">{poModalProduct.productName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPoModalProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-semibold text-slate-800">Supplier: {poModalProduct.supplierName}</p>
                <p className="text-slate-500 mt-0.5">Estimated Lead Time: {poModalProduct.supplierLeadTimeDays} business days</p>
                <p className="text-emerald-700 font-semibold mt-1">Pending Waitlist: {poModalProduct.pendingWaitlist} units</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Purchase Order Identifier / Tracking Tag
                </label>
                <input
                  type="text"
                  required
                  value={poCodeInput}
                  onChange={(e) => setPoCodeInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPoModalProduct(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Submit PO to Supplier
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
