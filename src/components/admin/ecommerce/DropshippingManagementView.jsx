import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleDropshipperStatus,
  toggleCustomBrandingSlip,
  addDropshipper,
  topUpDropshipWallet,
} from "@/store/slices/adminEcommerceSlice";
import {
  Truck,
  Search,
  PlusCircle,
  Download,
  Wallet,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  SlidersHorizontal,
  PauseCircle,
  PlayCircle,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function DropshippingManagementView() {
  const dispatch = useAppDispatch();
  const dropshippers = useAppSelector(
    (state) => state.adminEcommerce?.dropshippers || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toppingUpPartner, setToppingUpPartner] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState(25000);

  // Add Dropshipper Form
  const [newStoreName, setNewStoreName] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newPlatform, setNewPlatform] = useState("Shopify Store");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [initialBalance, setInitialBalance] = useState(15000);

  const platforms = useMemo(() => {
    const set = new Set(dropshippers.map((d) => d.platform));
    return ["All", ...Array.from(set)];
  }, [dropshippers]);

  const filteredDropshippers = useMemo(() => {
    return dropshippers.filter((d) => {
      const matchSearch =
        d.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPlatform =
        selectedPlatform === "All" || d.platform === selectedPlatform;
      return matchSearch && matchPlatform;
    });
  }, [dropshippers, searchTerm, selectedPlatform]);

  const totalOrders = useMemo(() => {
    return dropshippers.reduce((sum, d) => sum + (d.activeOrders || 0), 0);
  }, [dropshippers]);

  const totalDelivered = useMemo(() => {
    return dropshippers.reduce((sum, d) => sum + (d.totalDelivered || 0), 0);
  }, [dropshippers]);

  const totalFloatBalance = useMemo(() => {
    return dropshippers.reduce((sum, d) => sum + (d.walletBalance || 0), 0);
  }, [dropshippers]);

  const handleToggleStatus = (id, storeName, currentStatus) => {
    dispatch(toggleDropshipperStatus(id));
    if (currentStatus === "Active") {
      toast.warning(`Dropshipper "${storeName}" fulfillment paused.`);
    } else {
      toast.success(`Dropshipper "${storeName}" is now active.`);
    }
  };

  const handleToggleSlip = (id, storeName, currentVal) => {
    dispatch(toggleCustomBrandingSlip(id));
    if (!currentVal) {
      toast.success(`Custom white-label branding slip enabled for "${storeName}".`);
    } else {
      toast.info(`Switched to standard logistics packing slip for "${storeName}".`);
    }
  };

  const handleSaveTopUp = (e) => {
    e.preventDefault();
    if (!topUpAmount || topUpAmount <= 0) {
      toast.error("Please enter a valid credit deposit amount.");
      return;
    }

    dispatch(
      topUpDropshipWallet({
        id: toppingUpPartner.id,
        amount: parseFloat(topUpAmount),
      })
    );

    toast.success(
      `Credited ₹${parseFloat(topUpAmount).toLocaleString()} to ${toppingUpPartner.storeName}'s wallet!`
    );
    setToppingUpPartner(null);
  };

  const handleCreatePartner = (e) => {
    e.preventDefault();
    if (!newStoreName.trim() || !newOwner.trim()) {
      toast.error("Store name and owner name are required.");
      return;
    }

    const newDrop = {
      id: `DROP-${Date.now().toString().slice(-4)}`,
      storeName: newStoreName.trim(),
      ownerName: newOwner.trim(),
      platform: newPlatform,
      email: newEmail.trim() || "partner@store.com",
      phone: newPhone.trim() || "+91 98000 00000",
      activeOrders: 0,
      totalDelivered: 0,
      walletBalance: parseFloat(initialBalance) || 10000,
      customBrandingSlip: true,
      status: "Active",
    };

    dispatch(addDropshipper(newDrop));
    toast.success(`Dropshipper partner "${newStoreName}" onboarded!`);
    setIsAddModalOpen(false);
    setNewStoreName("");
    setNewOwner("");
    setNewEmail("");
    setNewPhone("");
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Store Name",
      "Owner Name",
      "Platform",
      "Email",
      "Phone",
      "Active Orders",
      "Total Delivered",
      "Wallet Balance (INR)",
      "White-Label Slip",
      "Status",
    ];

    const rows = filteredDropshippers.map((d) => [
      d.id,
      `"${d.storeName.replace(/"/g, '""')}"`,
      `"${d.ownerName.replace(/"/g, '""')}"`,
      d.platform,
      d.email,
      d.phone,
      d.activeOrders,
      d.totalDelivered,
      d.walletBalance,
      d.customBrandingSlip ? "Enabled" : "Disabled",
      d.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dropshippers_roster_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Dropshipper network roster exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dropshippers & Automated Orders
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
              <Truck className="h-3 w-3" /> Blind-Shipping Hub
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage partner integrations, automated order routing, prepaid float balances, and white-label packing slips.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export Roster
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Onboard Dropshipper
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Dropshippers Network
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{dropshippers.length}</div>
          <p className="mt-1 text-xs text-slate-500">Connected store channels</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Live Orders in Processing
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <PackageCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-blue-600">{totalOrders}</div>
          <p className="mt-1 text-xs text-slate-500">Auto-routed for warehouse pick</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Delivered Parcels
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {totalDelivered.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">Successfully fulfilled orders</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Prepaid Wallet Float
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-purple-600">
            ₹{totalFloatBalance.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">Partner balances held for dispatch</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search store name, owner, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Platform:</span>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p === "All" ? "All Platforms" : p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dropshippers Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Dropship Store & Owner</th>
                <th className="px-6 py-3.5">Platform</th>
                <th className="px-6 py-3.5 text-center">Active Orders</th>
                <th className="px-6 py-3.5 text-center">Delivered</th>
                <th className="px-6 py-3.5 text-right">Wallet Balance</th>
                <th className="px-6 py-3.5 text-center">Blind Branding</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDropshippers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No dropshippers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredDropshippers.map((drop) => (
                  <tr
                    key={drop.id}
                    className="hover:bg-slate-50/75 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {drop.storeName}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Owner: {drop.ownerName}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {drop.email} • {drop.id}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {drop.platform}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full text-xs">
                        {drop.activeOrders} live
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center font-medium text-slate-700">
                      {drop.totalDelivered.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div
                        className={`font-mono font-bold ${
                          drop.walletBalance > 10000
                            ? "text-emerald-600"
                            : drop.walletBalance > 0
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        ₹{drop.walletBalance.toLocaleString()}
                      </div>
                      {drop.walletBalance <= 0 && (
                        <span className="text-[10px] text-red-500 font-medium">
                          Dispatch On Hold
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          handleToggleSlip(
                            drop.id,
                            drop.storeName,
                            drop.customBrandingSlip
                          )
                        }
                        title="Toggle White-Label Packing Slip"
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                          drop.customBrandingSlip
                            ? "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <FileText className="h-3 w-3" />
                        {drop.customBrandingSlip ? "Custom Slip" : "Standard"}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          handleToggleStatus(drop.id, drop.storeName, drop.status)
                        }
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                          drop.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : drop.status === "Low Balance"
                            ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {drop.status === "Active" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {drop.status}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setToppingUpPartner(drop);
                          setTopUpAmount(25000);
                        }}
                        className="inline-flex items-center gap-1 p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                        title="Deposit Float"
                      >
                        <Wallet className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Top-up</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top-up Wallet Modal */}
      {toppingUpPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleSaveTopUp}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Credit Dropship Wallet
                </h3>
                <p className="text-xs text-slate-500">
                  {toppingUpPartner.storeName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setToppingUpPartner(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs flex justify-between">
              <span className="text-slate-600">Current Balance:</span>
              <span className="font-bold text-slate-900 font-mono">
                ₹{toppingUpPartner.walletBalance.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Deposit Credit Amount (₹) *
              </label>
              <input
                type="number"
                step="500"
                min="500"
                required
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              {[10000, 25000, 50000, 100000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className="flex-1 py-1 text-xs rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-medium text-slate-700"
                >
                  +₹{(amt / 1000).toFixed(0)}k
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setToppingUpPartner(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
              >
                Credit Wallet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Onboard Dropshipper Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreatePartner}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Onboard Dropship Partner
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
                  Store Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TrendyNest Store"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Owner / Operator Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Mehra"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  E-Commerce Engine
                </label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Shopify Store">Shopify Store</option>
                  <option value="WooCommerce">WooCommerce (WordPress)</option>
                  <option value="Custom API">Custom Webhook / API</option>
                  <option value="Amazon/Flipkart Seller">Amazon / Marketplace Seller</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Initial Float Balance (₹)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  placeholder="partner@trendynest.in"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  WhatsApp Contact
                </label>
                <input
                  type="text"
                  placeholder="+91 98000 11223"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
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
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
              >
                Onboard Dropshipper
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
