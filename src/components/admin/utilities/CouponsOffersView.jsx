import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addCoupon,
  toggleCouponStatus,
  deleteCoupon,
} from "@/store/slices/adminUtilitiesSlice";
import {
  Tag,
  Search,
  Filter,
  Download,
  PlusCircle,
  Percent,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  PauseCircle,
  PlayCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function CouponsOffersView() {
  const dispatch = useAppDispatch();
  const coupons = useAppSelector((state) => state.adminUtilities?.coupons || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Coupon Form state
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState("Percentage");
  const [newDiscount, setNewDiscount] = useState(20);
  const [newMinSpend, setNewMinSpend] = useState(999);
  const [newMaxDiscount, setNewMaxDiscount] = useState(500);
  const [newMaxUsage, setNewMaxUsage] = useState(1000);
  const [newEndDate, setNewEndDate] = useState("2026-12-31");

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === "All" || c.status === selectedStatus;
      const matchType = selectedType === "All" || c.type === selectedType;
      return matchSearch && matchStatus && matchType;
    });
  }, [coupons, searchTerm, selectedStatus, selectedType]);

  const totalRedemptions = useMemo(() => {
    return coupons.reduce((sum, c) => sum + (c.timesUsed || 0), 0);
  }, [coupons]);

  const totalRevenue = useMemo(() => {
    return coupons.reduce((sum, c) => sum + (c.revenueGenerated || 0), 0);
  }, [coupons]);

  const handleToggle = (id, currentStatus) => {
    dispatch(toggleCouponStatus(id));
    toast.info(`Coupon ${currentStatus === "Active" ? "paused" : "activated"}.`);
  };

  const handleDelete = (id, code) => {
    dispatch(deleteCoupon(id));
    toast.error(`Coupon ${code} removed.`);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const cleanCode = newCode.trim().toUpperCase().replace(/\s+/g, "");
    if (!cleanCode) return;

    dispatch(
      addCoupon({
        id: `CPN-${Date.now()}`,
        code: cleanCode,
        type: newType,
        discount: Number(newDiscount),
        minSpend: Number(newMinSpend),
        maxDiscount: Number(newMaxDiscount),
        timesUsed: 0,
        maxUsage: Number(newMaxUsage),
        startDate: new Date().toISOString().split("T")[0],
        endDate: newEndDate,
        status: "Active",
        revenueGenerated: 0,
      })
    );

    toast.success(`Promotional coupon "${cleanCode}" created and published!`);
    setIsCreateModalOpen(false);
    setNewCode("");
  };

  const handleExportCSV = () => {
    const headers = ["Coupon ID", "Code", "Type", "Discount", "Min Spend (INR)", "Max Discount", "Redemptions", "Max Usage", "Start Date", "End Date", "Status", "Revenue Driven"];
    const rows = filteredCoupons.map((c) => [
      c.id,
      c.code,
      c.type,
      c.discount,
      c.minSpend,
      c.maxDiscount,
      c.timesUsed,
      c.maxUsage,
      c.startDate,
      c.endDate,
      c.status,
      c.revenueGenerated,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `coupons_offers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Coupons data exported.");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              Promotion & Discount Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Conversion Optimizer</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Coupons and Promotional Offers Manage
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Create alphanumeric discount vouchers, set minimum cart spend rules, and monitor coupon-driven checkout revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Coupon
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Codes</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {coupons.filter((c) => c.status === "Active").length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Live promotional vouchers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Redemptions</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {totalRedemptions.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Times used by shoppers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sales Driven</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Revenue via promo checkout</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Discount Rate</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">18.5%</p>
          <p className="text-xs text-slate-400 mt-1">Across percentage promotions</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code (e.g. FESTIVE25)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-inter text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-xs font-medium text-slate-500">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Percentage">Percentage</option>
              <option value="Flat">Flat Amount</option>
              <option value="Free Shipping">Free Shipping</option>
            </select>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Cart Rule</th>
                <th className="p-4">Redemption Progress</th>
                <th className="p-4">Validity Range</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Tag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No promotional coupons found</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust search query or filter</p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const percentUsed = Math.min(
                    Math.round((coupon.timesUsed / (coupon.maxUsage || 1)) * 100),
                    100
                  );
                  return (
                    <tr key={coupon.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div>
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 text-sm tracking-wide">
                            {coupon.code}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-1">ID: {coupon.id}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-900">
                          {coupon.type === "Percentage"
                            ? `${coupon.discount}% OFF`
                            : coupon.type === "Flat"
                            ? `₹${coupon.discount} FLAT OFF`
                            : "FREE DELIVERY"}
                        </span>
                        <p className="text-xs text-slate-400">{coupon.type}</p>
                      </td>

                      <td className="p-4">
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800">Min Spend: ₹{coupon.minSpend}</p>
                          <p className="text-slate-400">Max Cap: ₹{coupon.maxDiscount}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1 max-w-[140px]">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">{coupon.timesUsed}</span>
                            <span className="text-slate-400">/ {coupon.maxUsage}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-900 rounded-full"
                              style={{ width: `${percentUsed}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-xs text-slate-600">
                          <p className="font-semibold flex items-center gap-1 text-slate-800">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {coupon.endDate}
                          </p>
                          <p className="text-[11px] text-slate-400">Started: {coupon.startDate}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                            coupon.status === "Active"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : coupon.status === "Paused"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {coupon.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggle(coupon.id, coupon.status)}
                            title={coupon.status === "Active" ? "Pause Coupon" : "Activate Coupon"}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            {coupon.status === "Active" ? (
                              <PauseCircle className="w-4 h-4" />
                            ) : (
                              <PlayCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            title="Delete Coupon"
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

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-slate-100 text-slate-800">
                  <Tag className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">Create Promotional Coupon</h3>
                  <p className="text-xs text-slate-400">Publish a new discount voucher code</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Coupon Code (uppercase alphanumeric)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH30"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Discount Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Flat">Flat Amount (₹)</option>
                    <option value="Free Shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    required
                    value={newMinSpend}
                    onChange={(e) => setNewMinSpend(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    required
                    value={newMaxDiscount}
                    onChange={(e) => setNewMaxDiscount(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Total Usage Limit</label>
                  <input
                    type="number"
                    required
                    value={newMaxUsage}
                    onChange={(e) => setNewMaxUsage(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Publish Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
