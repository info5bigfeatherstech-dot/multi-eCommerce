import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addVirtualFranchise,
  toggleVirtualFranchiseStatus,
  settleVirtualPayout,
} from "@/store/slices/adminEcommerceSlice";
import {
  Globe,
  Search,
  PlusCircle,
  Download,
  ExternalLink,
  Store,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  PauseCircle,
  PlayCircle,
  Users,
  Percent,
  SlidersHorizontal,
  Layers,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function VirtualFranchiseView() {
  const dispatch = useAppDispatch();
  const franchises = useAppSelector(
    (state) => state.adminEcommerce?.virtualFranchises || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Virtual Franchise Form
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newOperator, setNewOperator] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCommissionRate, setNewCommissionRate] = useState(15);

  const filteredFranchises = useMemo(() => {
    return franchises.filter((f) => {
      const matchSearch =
        f.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.coverageCity.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "All" || f.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [franchises, searchTerm, statusFilter]);

  const totalGmv = useMemo(() => {
    return franchises.reduce((sum, f) => sum + (f.gmvGenerated || 0), 0);
  }, [franchises]);

  const totalCommission = useMemo(() => {
    return franchises.reduce((sum, f) => sum + (f.commissionEarned || 0), 0);
  }, [franchises]);

  const totalCustomers = useMemo(() => {
    return franchises.reduce((sum, f) => sum + (f.activeCustomers || 0), 0);
  }, [franchises]);

  const handleToggle = (id, partnerName, currentStatus) => {
    dispatch(toggleVirtualFranchiseStatus(id));
    if (currentStatus === "Active") {
      toast.warning(`Virtual franchise "${partnerName}" disabled.`);
    } else {
      toast.success(`Virtual franchise "${partnerName}" is now active.`);
    }
  };

  const handleSettle = (id, partnerName, amount) => {
    dispatch(settleVirtualPayout(id));
    toast.success(
      `Commission payout of ₹${amount.toLocaleString()} settled for "${partnerName}"!`
    );
  };

  const handleCreateFranchise = (e) => {
    e.preventDefault();
    if (!newPartnerName.trim() || !newOperator.trim()) {
      toast.error("Please fill partner name and operator name.");
      return;
    }

    let domain = newDomain.trim().toLowerCase();
    if (!domain) {
      domain = `${newPartnerName.toLowerCase().replace(/[^a-z0-9]+/g, "")}.apexmart.in`;
    }

    const newVfr = {
      id: `VFR-${Date.now().toString().slice(-4)}`,
      partnerName: newPartnerName.trim(),
      operator: newOperator.trim(),
      domain,
      coverageCity: newCity.trim() || "Pan-India",
      commissionRate: parseFloat(newCommissionRate) || 15,
      gmvGenerated: 0,
      commissionEarned: 0,
      payoutStatus: "Settled",
      activeCustomers: 0,
      status: "Active",
    };

    dispatch(addVirtualFranchise(newVfr));
    toast.success(`Virtual franchise store "${newPartnerName}" created!`);
    setIsAddModalOpen(false);
    setNewPartnerName("");
    setNewOperator("");
    setNewDomain("");
    setNewCity("");
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Store Name",
      "Operator",
      "Domain",
      "Coverage Territory",
      "Commission Rate %",
      "GMV Generated (INR)",
      "Commission Earned (INR)",
      "Payout Status",
      "Active Shoppers",
      "Status",
    ];

    const rows = filteredFranchises.map((f) => [
      f.id,
      `"${f.partnerName.replace(/"/g, '""')}"`,
      `"${f.operator.replace(/"/g, '""')}"`,
      f.domain,
      `"${f.coverageCity}"`,
      `${f.commissionRate}%`,
      f.gmvGenerated,
      f.commissionEarned,
      f.payoutStatus,
      f.activeCustomers,
      f.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `virtual_franchises_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Virtual franchise roster exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Virtual Franchise Partners & Digital Stores
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <Globe className="h-3 w-3" /> White-Label Network
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage regional white-label partner storefronts, subdomains, rev-share commissions, and monthly partner payouts.
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
            Add Virtual Franchise
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Virtual Partner Stores
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Store className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{franchises.length}</div>
          <p className="mt-1 text-xs text-slate-500">Active regional digital domains</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total GMV Generated
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">
            ₹{(totalGmv / 100000).toFixed(1)} Lakhs
          </div>
          <p className="mt-1 text-xs text-slate-500">Gross sales via virtual partners</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Partner Commission
            </span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Percent className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-indigo-600">
            ₹{(totalCommission / 1000).toFixed(1)}k
          </div>
          <p className="mt-1 text-xs text-slate-500">Earned at avg 15% rev-share</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Network Shoppers
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {totalCustomers.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">Shoppers acquired through partners</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search store name, operator, city, or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Status:</span>
          {["All", "Active", "Paused"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Virtual Franchises Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Store & Domain</th>
                <th className="px-6 py-3.5">Operator</th>
                <th className="px-6 py-3.5">Coverage Territory</th>
                <th className="px-6 py-3.5 text-center">Rev-Share</th>
                <th className="px-6 py-3.5 text-right">GMV Generated</th>
                <th className="px-6 py-3.5 text-right">Commission Earned</th>
                <th className="px-6 py-3.5 text-center">Payout</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFranchises.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                    No virtual franchise stores found matching your search.
                  </td>
                </tr>
              ) : (
                filteredFranchises.map((vfr) => (
                  <tr
                    key={vfr.id}
                    className="hover:bg-slate-50/75 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {vfr.partnerName}
                        </div>
                        <a
                          href={`https://${vfr.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-indigo-600 hover:underline mt-0.5"
                        >
                          {vfr.domain} <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {vfr.operator}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {vfr.coverageCity}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                        {vfr.commissionRate}%
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                      ₹{vfr.gmvGenerated.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-right font-mono font-bold text-indigo-600">
                      ₹{vfr.commissionEarned.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          vfr.payoutStatus === "Settled"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {vfr.payoutStatus === "Settled" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {vfr.payoutStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          handleToggle(vfr.id, vfr.partnerName, vfr.status)
                        }
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                          vfr.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {vfr.status === "Active" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <PauseCircle className="h-3 w-3" />
                        )}
                        {vfr.status}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {vfr.payoutStatus === "Pending Payout" ? (
                        <button
                          onClick={() =>
                            handleSettle(
                              vfr.id,
                              vfr.partnerName,
                              vfr.commissionEarned
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors"
                        >
                          Settle Payout
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">
                          All Clear
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Virtual Franchise Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreateFranchise}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Onboard Virtual Franchise Store
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
                  Virtual Store Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ApexMart Jaipur South"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Partner / Operator Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alok Rathore"
                  value={newOperator}
                  onChange={(e) => setNewOperator(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Custom Domain / Subdomain
                </label>
                <input
                  type="text"
                  placeholder="jaipur.apexmart.in"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Coverage City / Territory
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jaipur, Rajasthan"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Rev-Share Commission Rate (%) *
              </label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="50"
                required
                value={newCommissionRate}
                onChange={(e) => setNewCommissionRate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard platform rev-share bracket: 12% to 18% of gross product value.
              </span>
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
                Launch Virtual Store
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
