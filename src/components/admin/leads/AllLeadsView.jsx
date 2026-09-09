import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateLeadStatus,
  assignLead,
  deleteLead,
} from "@/store/slices/adminLeadsSlice";
import {
  Inbox,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  MapPin,
  Building2,
  DollarSign,
  Users,
  Briefcase,
  Truck,
  Store,
  Eye,
  Trash2,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function AllLeadsView() {
  const dispatch = useAppDispatch();
  const leads = useAppSelector((state) => state.adminLeads?.leads || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeModalLead, setActiveModalLead] = useState(null);
  const [assignModalLead, setAssignModalLead] = useState(null);
  const [assignedRepInput, setAssignedRepInput] = useState("");

  const types = ["All", "Customer", "Wholesale", "Dropshipping", "Franchise"];
  const statuses = ["All", "New", "Contacted", "In Negotiation", "Converted", "Dropped"];

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = selectedType === "All" || l.type === selectedType;
      const matchStatus = selectedStatus === "All" || l.status === selectedStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [leads, searchTerm, selectedType, selectedStatus]);

  const totalPipelineValue = useMemo(() => {
    return leads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
  }, [leads]);

  const newLeadsCount = useMemo(() => leads.filter((l) => l.status === "New").length, [leads]);
  const convertedCount = useMemo(() => leads.filter((l) => l.status === "Converted").length, [leads]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateLeadStatus({ id, status: newStatus }));
    toast.info(`Lead status updated to ${newStatus}.`);
  };

  const handleAssignConfirm = (e) => {
    e.preventDefault();
    if (!assignModalLead || !assignedRepInput) return;
    dispatch(assignLead({ id: assignModalLead.id, assignedTo: assignedRepInput }));
    toast.success(`Lead assigned to ${assignedRepInput}.`);
    setAssignModalLead(null);
    setAssignedRepInput("");
  };

  const handleDelete = (id) => {
    dispatch(deleteLead(id));
    toast.error("Lead record removed.");
  };

  const handleExportCSV = () => {
    const headers = ["Lead ID", "Type", "Name", "Company", "Email", "Phone", "City", "Interest", "Value (INR)", "Status", "Priority", "Assigned To", "Date"];
    const rows = filteredLeads.map((l) => [
      l.id,
      l.type,
      `"${l.name}"`,
      `"${l.company || "N/A"}"`,
      l.email,
      `"${l.phone}"`,
      `"${l.city}"`,
      `"${(l.interest || "").replace(/"/g, '""')}"`,
      l.estimatedValue || 0,
      l.status,
      l.priority,
      `"${l.assignedTo || "Unassigned"}"`,
      l.date,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `all_leads_central_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("All leads exported as CSV.");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <Inbox className="w-3.5 h-3.5 text-slate-500" />
              Unified Inquiries Central
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Omnichannel B2B & B2C Pipeline</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            All Leads Central Record
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Master repository of customer queries, wholesale distribution proposals, dropshipping partners, and retail store franchise inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Central CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Leads</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{leads.length}</p>
          <p className="text-xs text-slate-400 mt-1">Across all 4 partnership channels</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pipeline Pipeline Value</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            ₹{totalPipelineValue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Estimated deal value</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{newLeadsCount}</p>
          <p className="text-xs text-slate-400 mt-1">Awaiting first sales contact</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Converted Wins</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{convertedCount}</p>
          <p className="text-xs text-slate-400 mt-1">Onboarded partners & closed buyers</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by contact name, company, email, phone, city, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-inter text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-44">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                <div className="flex items-center gap-1.5 truncate">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <SelectValue placeholder="Channel Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t === "All" ? "All Channels" : t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "All" ? "All Stages" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Contact & Company</th>
                <th className="p-4">Lead Channel</th>
                <th className="p-4">Inquiry Scope / Interest</th>
                <th className="p-4">Est. Deal Value</th>
                <th className="p-4">Pipeline Stage</th>
                <th className="p-4">Assigned Rep</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No leads match your criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting search filters</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const typeColor =
                    lead.type === "Wholesale"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : lead.type === "Dropshipping"
                      ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                      : lead.type === "Franchise"
                      ? "bg-orange-50 text-accent border-orange-200"
                      : "bg-blue-50 text-blue-700 border-blue-200";

                  const TypeIcon =
                    lead.type === "Wholesale"
                      ? Briefcase
                      : lead.type === "Dropshipping"
                      ? Truck
                      : lead.type === "Franchise"
                      ? Store
                      : Users;

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-slate-900">{lead.name}</p>
                          {lead.company && (
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {lead.company}
                            </p>
                          )}
                          <div className="text-xs text-slate-400 space-y-0.5 mt-1">
                            <p className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </p>
                            <p className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {lead.phone} • {lead.city}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${typeColor}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          {lead.type}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">Src: {lead.source}</p>
                      </td>

                      <td className="p-4 max-w-xs">
                        <p className="text-xs font-medium text-slate-800 line-clamp-2">
                          {lead.interest}
                        </p>
                        {lead.notes && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                            "{lead.notes}"
                          </p>
                        )}
                      </td>

                      <td className="p-4">
                        {lead.estimatedValue ? (
                          <div>
                            <p className="font-bold text-slate-900">₹{lead.estimatedValue.toLocaleString()}</p>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Estimated</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            {lead.investmentBudget || lead.estimatedOrdersPerMonth || "Under Review"}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="w-32">
                          <Select
                            value={lead.status}
                            onValueChange={(val) => handleStatusChange(lead.id, val)}
                          >
                            <SelectTrigger className="h-7 text-xs font-semibold bg-white border-slate-200">
                              <SelectValue placeholder={lead.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Contacted">Contacted</SelectItem>
                              <SelectItem value="In Negotiation">In Negotiation</SelectItem>
                              <SelectItem value="Converted">Converted</SelectItem>
                              <SelectItem value="Dropped">Dropped</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800">{lead.assignedTo || "Unassigned"}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{lead.date}</p>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setAssignModalLead(lead);
                              setAssignedRepInput(lead.assignedTo || "Karan Johar (Sales Exec)");
                            }}
                            title="Assign Sales Rep"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setActiveModalLead(lead)}
                            title="Inspect Lead Details"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            title="Delete Lead"
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

      {/* Assign Rep Modal */}
      {assignModalLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAssignConfirm}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-poppins font-bold text-slate-900 text-base">Assign Lead Account Owner</h3>
              <button
                type="button"
                onClick={() => setAssignModalLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-slate-900">{assignModalLead.name}</p>
                <p className="text-slate-500">{assignModalLead.type} Inquiry • {assignModalLead.city}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Select Sales Executive / Account Manager
                </label>
                <Select value={assignedRepInput} onValueChange={setAssignedRepInput}>
                  <SelectTrigger className="w-full text-xs bg-slate-50 border-slate-200 text-slate-900">
                    <SelectValue placeholder="Select Sales Executive" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Karan Johar (Sales Exec)">Karan Johar (Sales Exec)</SelectItem>
                    <SelectItem value="Pooja Hegde (B2B Lead)">Pooja Hegde (B2B Lead)</SelectItem>
                    <SelectItem value="Siddharth Roy (Partner Ops)">Siddharth Roy (Partner Ops)</SelectItem>
                    <SelectItem value="Rameshwar Rao (VP Expansion)">Rameshwar Rao (VP Expansion)</SelectItem>
                    <SelectItem value="Sneha Nair (Customer Support)">Sneha Nair (Customer Support)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssignModalLead(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confirm Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lead Detail Modal */}
      {activeModalLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-poppins font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>Lead Intelligence Dossier</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-normal">
                    {activeModalLead.id}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Origin: {activeModalLead.source}</p>
              </div>
              <button
                onClick={() => setActiveModalLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base">{activeModalLead.name}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                    {activeModalLead.type} Partner
                  </span>
                </div>
                {activeModalLead.company && (
                  <p className="text-xs text-slate-600 font-semibold mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {activeModalLead.company}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  <p>Email: {activeModalLead.email}</p>
                  <p>Phone: {activeModalLead.phone}</p>
                  <p>Location: {activeModalLead.city}</p>
                  <p>Logged: {activeModalLead.date}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Specific Requirements / Scope</span>
                <p className="text-slate-700">{activeModalLead.interest}</p>
                {activeModalLead.requestedVolume && (
                  <p className="text-slate-600 font-medium">Requested Volume: {activeModalLead.requestedVolume}</p>
                )}
                {activeModalLead.gstNumber && (
                  <p className="text-slate-600 font-mono">GST / Tax ID: {activeModalLead.gstNumber}</p>
                )}
                {activeModalLead.storeUrl && (
                  <p className="text-blue-600">Store URL: {activeModalLead.storeUrl}</p>
                )}
                {activeModalLead.propertyStatus && (
                  <p className="text-slate-600">Property Details: {activeModalLead.propertyStatus}</p>
                )}
              </div>

              {activeModalLead.notes && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <span className="font-bold text-amber-800 block">Internal Account Notes</span>
                  <p className="text-amber-700 mt-0.5">{activeModalLead.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveModalLead(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <a
                href={`mailto:${activeModalLead.email}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow"
              >
                <Mail className="w-3.5 h-3.5" />
                Contact via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
