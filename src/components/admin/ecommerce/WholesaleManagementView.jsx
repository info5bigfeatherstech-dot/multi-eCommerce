import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateWholesaleTier,
  addWholesaleAccount,
  updateAccountCreditLimit,
} from "@/store/slices/adminEcommerceSlice";
import {
  Briefcase,
  Search,
  PlusCircle,
  Download,
  Building2,
  Users,
  CreditCard,
  Percent,
  CheckCircle2,
  Clock,
  Edit3,
  ShieldCheck,
  Tag,
  SlidersHorizontal,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function WholesaleManagementView() {
  const dispatch = useAppDispatch();
  const tiers = useAppSelector(
    (state) => state.adminEcommerce?.wholesaleTiers || []
  );
  const accounts = useAppSelector(
    (state) => state.adminEcommerce?.wholesaleAccounts || []
  );

  const [activeTab, setActiveTab] = useState("accounts"); // "accounts" | "tiers"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTierFilter, setSelectedTierFilter] = useState("All");
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);

  // Edit Tier Form
  const [tierDiscount, setTierDiscount] = useState("");
  const [tierMinOrder, setTierMinOrder] = useState("");

  // Edit Credit Limit Form
  const [creditLimitVal, setCreditLimitVal] = useState("");
  const [accountStatusVal, setAccountStatusVal] = useState("Active");

  // Add Account Form
  const [newCompany, setNewCompany] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newGstin, setNewGstin] = useState("");
  const [newAssignedTier, setNewAssignedTier] = useState("Silver Wholesale");
  const [newCreditLimit, setNewCreditLimit] = useState(500000);
  const [newPaymentTerms, setNewPaymentTerms] = useState("Net-30");

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchSearch =
        acc.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTier =
        selectedTierFilter === "All" || acc.assignedTier === selectedTierFilter;
      return matchSearch && matchTier;
    });
  }, [accounts, searchTerm, selectedTierFilter]);

  const totalOutstanding = useMemo(() => {
    return accounts.reduce((sum, a) => sum + (a.outstandingDue || 0), 0);
  }, [accounts]);

  const totalCreditAllocated = useMemo(() => {
    return accounts.reduce((sum, a) => sum + (a.creditLimit || 0), 0);
  }, [accounts]);

  const creditUtilization = useMemo(() => {
    if (totalCreditAllocated === 0) return 0;
    return ((totalOutstanding / totalCreditAllocated) * 100).toFixed(1);
  }, [totalOutstanding, totalCreditAllocated]);

  const handleOpenEditTier = (tier) => {
    setEditingTier(tier);
    setTierDiscount(tier.discountRate.toString());
    setTierMinOrder(tier.minOrderValue.toString());
  };

  const handleSaveTier = (e) => {
    e.preventDefault();
    const rate = parseFloat(tierDiscount);
    const minOrder = parseFloat(tierMinOrder);

    if (isNaN(rate) || rate < 0 || rate > 90) {
      toast.error("Please enter a valid wholesale discount rate (0-90%).");
      return;
    }

    dispatch(
      updateWholesaleTier({
        id: editingTier.id,
        discountRate: rate,
        minOrderValue: minOrder,
      })
    );

    toast.success(`Updated ${editingTier.tierName} settings.`);
    setEditingTier(null);
  };

  const handleOpenEditAccount = (acc) => {
    setEditingAccount(acc);
    setCreditLimitVal(acc.creditLimit.toString());
    setAccountStatusVal(acc.status);
  };

  const handleSaveAccountLimit = (e) => {
    e.preventDefault();
    const limit = parseFloat(creditLimitVal);
    if (isNaN(limit) || limit < 0) {
      toast.error("Please enter a valid credit limit.");
      return;
    }

    dispatch(
      updateAccountCreditLimit({
        id: editingAccount.id,
        creditLimit: limit,
        status: accountStatusVal,
      })
    );

    toast.success(`Updated terms for "${editingAccount.companyName}".`);
    setEditingAccount(null);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!newCompany.trim() || !newContact.trim()) {
      toast.error("Company and contact person name are required.");
      return;
    }

    const newAcc = {
      id: `WACC-${Date.now().toString().slice(-4)}`,
      companyName: newCompany.trim(),
      contactPerson: newContact.trim(),
      email: newEmail.trim() || "orders@buyerdomain.com",
      phone: newPhone.trim() || "+91 90000 00000",
      city: newCity.trim() || "National Delivery",
      gstin: newGstin.trim().toUpperCase() || "29AAAAA0000A1Z5",
      assignedTier: newAssignedTier,
      creditLimit: parseFloat(newCreditLimit) || 200000,
      outstandingDue: 0,
      paymentTerms: newPaymentTerms,
      status: "Active",
    };

    dispatch(addWholesaleAccount(newAcc));
    toast.success(`Wholesale account "${newCompany}" onboarded!`);
    setIsAddAccountModalOpen(false);
    setNewCompany("");
    setNewContact("");
    setNewGstin("");
    setNewEmail("");
    setNewPhone("");
  };

  const handleExportCSV = () => {
    const headers = [
      "Account ID",
      "Company Name",
      "Contact Person",
      "Email",
      "Phone",
      "City",
      "GSTIN",
      "Assigned Tier",
      "Credit Limit (INR)",
      "Outstanding Due (INR)",
      "Payment Terms",
      "Status",
    ];

    const rows = filteredAccounts.map((a) => [
      a.id,
      `"${a.companyName.replace(/"/g, '""')}"`,
      `"${a.contactPerson.replace(/"/g, '""')}"`,
      a.email,
      a.phone,
      `"${a.city}"`,
      a.gstin,
      a.assignedTier,
      a.creditLimit,
      a.outstandingDue,
      a.paymentTerms,
      a.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wholesale_accounts_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Wholesale buyer accounts exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Wholesale Accounts & Pricing Tiers
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              <Briefcase className="h-3 w-3" /> B2B Institutional
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage wholesale buyer networks, GSTIN verification, Net-30 credit lines, and bulk volume discount matrices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export Accounts
          </button>
          <button
            onClick={() => setIsAddAccountModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Onboard Wholesale Buyer
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Wholesale Accounts
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{accounts.length}</div>
          <p className="mt-1 text-xs text-slate-500">Verified B2B institutional buyers</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Credit Extended
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            ₹{(totalCreditAllocated / 100000).toFixed(1)} Lakhs
          </div>
          <p className="mt-1 text-xs text-slate-500">Authorized Net-30/45 trade lines</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Outstanding Receivables
            </span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-amber-600">
            ₹{(totalOutstanding / 100000).toFixed(1)} Lakhs
          </div>
          <p className="mt-1 text-xs text-slate-500">Current active ledger due</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Credit Utilization
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Percent className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{creditUtilization}%</div>
          <p className="mt-1 text-xs text-slate-500">Healthy liquidity exposure ratio</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("accounts")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "accounts"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Wholesale Buyer Directory ({accounts.length})
        </button>
        <button
          onClick={() => setActiveTab("tiers")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "tiers"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <Tag className="h-4 w-4" />
          Volume Discount Tiers & MOQ ({tiers.length})
        </button>
      </div>

      {/* View 1: Wholesale Accounts Directory */}
      {activeTab === "accounts" && (
        <div className="space-y-4">
          {/* Search & Tier Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search company, contact, GSTIN, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Tier:</span>
              <Select value={selectedTierFilter} onValueChange={setSelectedTierFilter}>
                <SelectTrigger className="w-[170px] text-xs rounded-lg border-slate-300 h-9 bg-white">
                  <SelectValue placeholder="Select Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Wholesale Tiers</SelectItem>
                  {tiers.map((t) => (
                    <SelectItem key={t.id} value={t.tierName}>
                      {t.tierName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Company & GSTIN</th>
                    <th className="px-6 py-3.5">Contact Person</th>
                    <th className="px-6 py-3.5">Assigned Tier</th>
                    <th className="px-6 py-3.5 text-right">Credit Limit</th>
                    <th className="px-6 py-3.5 text-right">Outstanding Due</th>
                    <th className="px-6 py-3.5">Terms</th>
                    <th className="px-6 py-3.5 text-center">Status</th>
                    <th className="px-6 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                        No wholesale buyer accounts found.
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((acc) => (
                      <tr
                        key={acc.id}
                        className="hover:bg-slate-50/75 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              {acc.companyName}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-xs text-indigo-600 font-medium">
                                {acc.gstin}
                              </span>
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-semibold">
                                <ShieldCheck className="h-3 w-3" /> Verified
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {acc.city}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">
                            {acc.contactPerson}
                          </div>
                          <div className="text-xs text-slate-500">{acc.phone}</div>
                          <div className="text-xs text-slate-400">{acc.email}</div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                            {acc.assignedTier}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right font-mono font-semibold text-slate-800">
                          ₹{acc.creditLimit.toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <span
                            className={`font-mono font-semibold ${
                              acc.outstandingDue > 0
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            ₹{acc.outstandingDue.toLocaleString()}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            {acc.paymentTerms}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              acc.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {acc.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleOpenEditAccount(acc)}
                            className="inline-flex items-center gap-1 p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                            title="Edit Credit & Terms"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Terms</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Volume Pricing Tiers */}
      {activeTab === "tiers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {tier.tierName}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        {tier.id}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-sm font-bold text-emerald-700">
                    {tier.discountRate}% OFF
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <span className="text-slate-500 block font-medium">
                      Order Quantity Range:
                    </span>
                    <span className="text-base font-bold text-slate-800 mt-1 block">
                      {tier.minUnits} – {tier.maxUnits} units
                    </span>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <span className="text-slate-500 block font-medium">
                      Min Order Value (MOV):
                    </span>
                    <span className="text-base font-bold text-slate-800 mt-1 block">
                      ₹{tier.minOrderValue.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Enrolled Wholesale Buyers:</span>
                  <span className="font-bold text-slate-800">
                    {tier.activeBuyersCount} accounts
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleOpenEditTier(tier)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Tier Parameters
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Tier Modal */}
      {editingTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleSaveTier}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Configure {editingTier.tierName}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTier(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Wholesale Discount Rate (%) *
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="90"
                required
                value={tierDiscount}
                onChange={(e) => setTierDiscount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Minimum Order Value (MOV ₹) *
              </label>
              <input
                type="number"
                step="1000"
                required
                value={tierMinOrder}
                onChange={(e) => setTierMinOrder(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setEditingTier(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
              >
                Save Tier Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Account Credit Limit Modal */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleSaveAccountLimit}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Manage Account Terms
                </h3>
                <p className="text-xs text-slate-500">{editingAccount.companyName}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Credit Limit (₹) *
              </label>
              <input
                type="number"
                step="10000"
                required
                value={creditLimitVal}
                onChange={(e) => setCreditLimitVal(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Account Status
              </label>
              <Select value={accountStatusVal} onValueChange={setAccountStatusVal}>
                <SelectTrigger className="w-full rounded-lg border-slate-300">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active (Eligible for Orders)</SelectItem>
                  <SelectItem value="Under Review">Under Review (Hold Dispatches)</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
              >
                Update Terms
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Onboard Account Modal */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreateAccount}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Onboard Wholesale Buyer
              </h3>
              <button
                type="button"
                onClick={() => setIsAddAccountModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Registered Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Trading Corp"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  GSTIN Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="27AABCU9603R1ZM"
                  value={newGstin}
                  onChange={(e) => setNewGstin(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Primary Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deepak Sethi"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98000 12345"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="procurement@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Operating City / Hub
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Maharashtra"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Assigned Tier
                </label>
                <Select value={newAssignedTier} onValueChange={setNewAssignedTier}>
                  <SelectTrigger className="w-full rounded-lg border-slate-300 text-xs">
                    <SelectValue placeholder="Select Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map((t) => (
                      <SelectItem key={t.id} value={t.tierName}>
                        {t.tierName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Credit Limit (₹)
                </label>
                <input
                  type="number"
                  step="50000"
                  value={newCreditLimit}
                  onChange={(e) => setNewCreditLimit(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Payment Terms
                </label>
                <Select value={newPaymentTerms} onValueChange={setNewPaymentTerms}>
                  <SelectTrigger className="w-full rounded-lg border-slate-300 text-xs">
                    <SelectValue placeholder="Select Terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net-30">Net-30 Credit</SelectItem>
                    <SelectItem value="Net-15">Net-15 Credit</SelectItem>
                    <SelectItem value="Net-45">Net-45 Credit</SelectItem>
                    <SelectItem value="Prepaid UPI / RTGS">Prepaid UPI / RTGS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setIsAddAccountModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
              >
                Onboard Buyer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
