import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addPhysicalFranchise,
  updateOutletStatus,
} from "@/store/slices/adminEcommerceSlice";
import {
  Store,
  Search,
  PlusCircle,
  Download,
  MapPin,
  Phone,
  User,
  Boxes,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Building,
  TrendingUp,
  DollarSign,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export default function PhysicalFranchiseView() {
  const dispatch = useAppDispatch();
  const outlets = useAppSelector(
    (state) => state.adminEcommerce?.physicalFranchises || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingOutlet, setViewingOutlet] = useState(null);

  // Add Outlet Form
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("Maharashtra");
  const [newPin, setNewPin] = useState("");
  const [newSqft, setNewSqft] = useState(2000);
  const [newManager, setNewManager] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRoyalty, setNewRoyalty] = useState(5);

  const filteredOutlets = useMemo(() => {
    return outlets.filter((o) => {
      const matchSearch =
        o.outletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.outletCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.storeManager.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        selectedStatus === "All" || o.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [outlets, searchTerm, selectedStatus]);

  const totalSqft = useMemo(() => {
    return outlets.reduce((sum, o) => sum + (o.storeSizeSqft || 0), 0);
  }, [outlets]);

  const totalMonthlyRevenue = useMemo(() => {
    return outlets.reduce((sum, o) => sum + (o.lastMonthRevenue || 0), 0);
  }, [outlets]);

  const totalStockAllocated = useMemo(() => {
    return outlets.reduce((sum, o) => sum + (o.inventoryStockUnits || 0), 0);
  }, [outlets]);

  const operationalCount = useMemo(() => {
    return outlets.filter((o) => o.status === "Operational").length;
  }, [outlets]);

  const handleStatusChange = (id, outletName, newStatus) => {
    dispatch(updateOutletStatus({ id, status: newStatus }));
    toast.success(`Outlet "${outletName}" status updated to ${newStatus}.`);
  };

  const handleCreateOutlet = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newCity.trim() || !newManager.trim()) {
      toast.error("Please fill all required outlet information.");
      return;
    }

    const code =
      newCode.trim().toUpperCase() ||
      `APX-OUT-${(outlets.length + 1).toString().padStart(3, "0")}`;

    const newOutletObj = {
      id: `PFR-${Date.now().toString().slice(-4)}`,
      outletCode: code,
      outletName: newName.trim(),
      city: newCity.trim(),
      state: newState,
      pinCode: newPin.trim() || "560001",
      storeSizeSqft: parseFloat(newSqft) || 2000,
      storeManager: newManager.trim(),
      contactPhone: newPhone.trim() || "+91 80 0000 0000",
      monthlyRoyaltyRate: parseFloat(newRoyalty) || 5,
      lastMonthRevenue: 0,
      inventoryStockUnits: 3000,
      status: "Operational",
    };

    dispatch(addPhysicalFranchise(newOutletObj));
    toast.success(`Physical franchise outlet "${newName}" added!`);
    setIsAddModalOpen(false);
    setNewCode("");
    setNewName("");
    setNewCity("");
    setNewPin("");
    setNewManager("");
    setNewPhone("");
  };

  const handleExportCSV = () => {
    const headers = [
      "Outlet Code",
      "Outlet Name",
      "City",
      "State",
      "PIN Code",
      "Floor Area (SqFt)",
      "Manager",
      "Phone",
      "Royalty %",
      "Last Month Revenue (INR)",
      "Allocated Stock Units",
      "Status",
    ];

    const rows = filteredOutlets.map((o) => [
      o.outletCode,
      `"${o.outletName.replace(/"/g, '""')}"`,
      `"${o.city}"`,
      o.state,
      o.pinCode,
      o.storeSizeSqft,
      `"${o.storeManager.replace(/"/g, '""')}"`,
      o.contactPhone,
      `${o.monthlyRoyaltyRate}%`,
      o.lastMonthRevenue,
      o.inventoryStockUnits,
      o.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `physical_franchises_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Physical franchise outlets exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Physical Franchise Outlets & Retail Stores
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
              <Store className="h-3 w-3" /> Brick & Mortar Outlets
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage physical retail store locations, inventory allocations, franchise royalty agreements, and store managers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export Outlets
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add Franchise Outlet
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Retail Outlets
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Building className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{outlets.length}</div>
          <p className="mt-1 text-xs text-slate-500">{operationalCount} currently operational</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Retail Carpet Area
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Store className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {totalSqft.toLocaleString()} sq.ft
          </div>
          <p className="mt-1 text-xs text-slate-500">Across tier-1 & tier-2 metros</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Monthly Offline Revenue
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">
            ₹{(totalMonthlyRevenue / 100000).toFixed(1)} Lakhs
          </div>
          <p className="mt-1 text-xs text-slate-500">Last month in-store billed</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Inventory Stock In-Store
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Boxes className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {totalStockAllocated.toLocaleString()} units
          </div>
          <p className="mt-1 text-xs text-slate-500">Dispatched & available on racks</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search outlet code, name, city, or manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Status:</span>
          {["All", "Operational", "Renovation", "Under Setup"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedStatus === st
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Outlets Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Code & Outlet Name</th>
                <th className="px-6 py-3.5">Location & Area</th>
                <th className="px-6 py-3.5">Store Manager</th>
                <th className="px-6 py-3.5 text-center">Royalty Rate</th>
                <th className="px-6 py-3.5 text-right">Last Month GMV</th>
                <th className="px-6 py-3.5 text-right">Floor Stock</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOutlets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No physical franchise outlets found matching your query.
                  </td>
                </tr>
              ) : (
                filteredOutlets.map((outlet) => (
                  <tr
                    key={outlet.id}
                    className="hover:bg-slate-50/75 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {outlet.outletName}
                        </div>
                        <div className="font-mono text-xs text-indigo-600 font-medium mt-0.5">
                          {outlet.outletCode}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {outlet.city}, {outlet.state} - {outlet.pinCode}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Area: {outlet.storeSizeSqft.toLocaleString()} sq.ft
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        {outlet.storeManager}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {outlet.contactPhone}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                        {outlet.monthlyRoyaltyRate}%
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                      {outlet.lastMonthRevenue > 0
                        ? `₹${outlet.lastMonthRevenue.toLocaleString()}`
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-slate-800">
                        {outlet.inventoryStockUnits.toLocaleString()} units
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          outlet.status === "Operational"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : outlet.status === "Renovation"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {outlet.status === "Operational" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {outlet.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <select
                        value={outlet.status}
                        onChange={(e) =>
                          handleStatusChange(
                            outlet.id,
                            outlet.outletName,
                            e.target.value
                          )
                        }
                        className="text-xs rounded border border-slate-300 px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Operational">Operational</option>
                        <option value="Renovation">Renovation</option>
                        <option value="Under Setup">Under Setup</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Outlet Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCreateOutlet}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Register Physical Franchise Outlet
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
                  Outlet Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ApexMart Phoenix Marketcity"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Outlet Code
                </label>
                <input
                  type="text"
                  placeholder="APX-OUT-006"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  City / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whitefield"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  State
                </label>
                <input
                  type="text"
                  placeholder="Karnataka"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  placeholder="560066"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Store Manager Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harish Chandra"
                  value={newManager}
                  onChange={(e) => setNewManager(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Store Phone Hotline
                </label>
                <input
                  type="text"
                  placeholder="+91 80 4120 5500"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Carpet Floor Area (Sq.Ft)
                </label>
                <input
                  type="number"
                  step="100"
                  value={newSqft}
                  onChange={(e) => setNewSqft(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Royalty Fee Rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newRoyalty}
                  onChange={(e) => setNewRoyalty(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
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
                Register Outlet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
