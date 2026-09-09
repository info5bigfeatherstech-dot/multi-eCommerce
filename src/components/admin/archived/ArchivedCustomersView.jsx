import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { restoreCustomer, deleteCustomerPermanently } from "@/store/slices/adminArchivedSlice";
import {
  Users,
  Search,
  Filter,
  RotateCcw,
  Trash2,
  Calendar,
  Download,
  ShieldCheck,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Info,
  Archive,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function ArchivedCustomersView() {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.adminArchived?.customers || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReason, setSelectedReason] = useState("All");
  const [activeModalCust, setActiveModalCust] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const reasons = useMemo(() => {
    const set = new Set(customers.map((c) => c.reason));
    return ["All", ...Array.from(set)];
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchReason = selectedReason === "All" || c.reason === selectedReason;
      return matchSearch && matchReason;
    });
  }, [customers, searchTerm, selectedReason]);

  const totalHistoricalLTV = useMemo(() => {
    return customers.reduce((acc, c) => acc + (c.lifetimeValue || 0), 0);
  }, [customers]);

  const handleRestore = (customer) => {
    dispatch(restoreCustomer(customer.id));
    toast.success(`Customer ${customer.name} restored to active customer directory.`);
  };

  const handleDelete = (customer) => {
    dispatch(deleteCustomerPermanently(customer.id));
    setDeleteTargetId(null);
    toast.error(`Customer dossier for ${customer.name} permanently wiped.`);
  };

  const handleExportCSV = () => {
    const headers = ["Archive ID", "Customer Name", "Email", "Phone", "City", "Historical Orders", "Lifetime Value (INR)", "Joined Date", "Archive Date", "Reason", "Status"];
    const rows = filteredCustomers.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      `"${c.phone}"`,
      `"${c.city}"`,
      c.totalHistoricalOrders,
      c.lifetimeValue,
      c.joinedDate,
      c.archiveDate,
      `"${c.reason}"`,
      `"${c.status}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `archived_customers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Archived customers compliance export generated.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Customer Vault
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">GDPR & DPDP Governed</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Archived Customer Records
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Cold storage archives of dormant buyers, merged duplicate identities, and data-erasure compliance requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Compliance Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Archived Profiles</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{customers.length}</p>
          <p className="text-xs text-slate-400 mt-1">Total dormant & closed records</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Historical LTV Total</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            ₹{totalHistoricalLTV.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Total spending prior to archive</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">GDPR & DPDP Deletion</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {customers.filter((c) => c.reason.toLowerCase().includes("deletion") || c.reason.toLowerCase().includes("gdpr")).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Anonymized consent records</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Merged Duplicates</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {customers.filter((c) => c.reason.toLowerCase().includes("merged")).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Unified with primary accounts</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-inter text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-500">Reason:</span>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Customer Profile</th>
                <th className="p-4">Contact & City</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4">Archive Status</th>
                <th className="p-4">Reason For Archive</th>
                <th className="p-4">Archived On</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No archived customer records found</p>
                    <p className="text-xs text-slate-400 mt-1">Try refining search parameters</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{customer.name}</p>
                          <p className="text-xs text-slate-400">ID: {customer.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-xs space-y-0.5">
                        <p className="text-slate-700 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {customer.email}
                        </p>
                        <p className="text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {customer.phone}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {customer.city}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-900">₹{customer.lifetimeValue.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{customer.totalHistoricalOrders} historical orders</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        {customer.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {customer.reason}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-xs text-slate-600">
                        <p className="font-semibold text-slate-800">{customer.archiveDate}</p>
                        <p className="text-[11px] text-slate-400">Member since {customer.joinedDate}</p>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveModalCust(customer)}
                          title="Inspect Archive Record"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRestore(customer)}
                          title="Restore to Active Directory"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restore
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(customer.id)}
                          title="Purge Record"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-poppins font-bold text-slate-900">
              Permanently Purge Customer Record?
            </h3>
            <p className="text-sm text-slate-500 font-inter mt-2">
              Warning: This is an irreversible purge. Personal data and identifiers will be completely eradicated from the system.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const target = customers.find((c) => c.id === deleteTargetId);
                  if (target) handleDelete(target);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md"
              >
                Purge Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {activeModalCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-poppins font-bold text-slate-900 text-base">
                  Customer Vault Record
                </h3>
                <p className="text-xs text-slate-400">{activeModalCust.id}</p>
              </div>
              <button
                onClick={() => setActiveModalCust(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-lg font-bold">
                  {activeModalCust.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{activeModalCust.name}</p>
                  <p className="text-xs text-slate-500">{activeModalCust.email} • {activeModalCust.phone}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activeModalCust.city}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Joined Platform</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{activeModalCust.joinedDate}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Date Archived</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{activeModalCust.archiveDate}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Historical Orders</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{activeModalCust.totalHistoricalOrders} orders</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-slate-400 block font-medium">Lifetime Spend</span>
                  <span className="text-emerald-700 font-bold mt-0.5 block">₹{activeModalCust.lifetimeValue.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <span className="text-amber-800 font-semibold block">Archive Protocol Reason</span>
                <p className="text-amber-700 mt-0.5">{activeModalCust.reason}</p>
                <p className="text-[11px] text-amber-600 mt-1">Status: {activeModalCust.status}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveModalCust(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleRestore(activeModalCust);
                  setActiveModalCust(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
