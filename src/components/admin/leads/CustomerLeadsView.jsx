import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLeadStatus, updateLeadNotes } from "@/store/slices/adminLeadsSlice";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MessageSquare,
  DollarSign,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function CustomerLeadsView() {
  const dispatch = useAppDispatch();
  const allLeads = useAppSelector((state) => state.adminLeads?.leads || []);

  const customerLeads = useMemo(() => {
    return allLeads.filter((l) => l.type === "Customer");
  }, [allLeads]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [noteEditLead, setNoteEditLead] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  const filteredLeads = useMemo(() => {
    return customerLeads.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.interest && l.interest.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = selectedStatus === "All" || l.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [customerLeads, searchTerm, selectedStatus]);

  const totalValue = useMemo(() => {
    return customerLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
  }, [customerLeads]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateLeadStatus({ id, status: newStatus }));
    toast.info(`Status updated to ${newStatus}.`);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteEditLead) return;
    dispatch(updateLeadNotes({ id: noteEditLead.id, notes: noteInput }));
    toast.success("Lead notes updated.");
    setNoteEditLead(null);
  };

  const handleExportCSV = () => {
    const headers = ["Lead ID", "Customer Name", "Email", "Phone", "City", "Requirement", "Est Value (INR)", "Status", "Priority", "Logged On"];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name}"`,
      l.email,
      `"${l.phone}"`,
      `"${l.city}"`,
      `"${(l.interest || "").replace(/"/g, '""')}"`,
      l.estimatedValue || 0,
      l.status,
      l.priority,
      l.date,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Customer leads exported.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              B2C Shoppers & Custom Inquiries
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Direct Buyer Intent</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Potential Customer Enquiries
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Retail customer inquiries for customized orders, festive bulk gift sets, and bespoke product requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Customer CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{customerLeads.length}</p>
          <p className="text-xs text-slate-400 mt-1">Direct buyer requests</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            ₹{totalValue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Potential deal value</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {customerLeads.filter((l) => l.status === "New" || l.status === "Contacted").length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Actively in conversation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Closed Won</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {customerLeads.filter((l) => l.status === "Converted").length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Successfully ordered</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer leads by name, email, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-inter text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-40">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                <div className="flex items-center gap-1.5 truncate">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <SelectValue placeholder="Stage" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Stages</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="In Negotiation">In Negotiation</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Customer Details</th>
                <th className="p-4">Specific Requirement</th>
                <th className="p-4">Estimated Value</th>
                <th className="p-4">Lead Status</th>
                <th className="p-4">Assigned Representative</th>
                <th className="p-4">Notes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No customer enquiries found</p>
                    <p className="text-xs text-slate-400 mt-1">Try relaxing filters</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-slate-900">{lead.name}</p>
                        <p className="text-xs text-slate-400">{lead.email}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {lead.city} • {lead.phone}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="text-xs font-semibold text-slate-800">{lead.interest}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Source: {lead.source}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">₹{lead.estimatedValue.toLocaleString()}</p>
                      <span className="text-[10px] text-slate-400">Projected</span>
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
                      <p className="text-xs font-medium text-slate-800">{lead.assignedTo || "Unassigned"}</p>
                      <p className="text-[11px] text-slate-400">{lead.date}</p>
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        {lead.notes || "No notes"}
                      </p>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setNoteEditLead(lead);
                            setNoteInput(lead.notes || "");
                          }}
                          title="Edit Internal Note"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Send Direct WhatsApp Message"
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note Edit Modal */}
      {noteEditLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveNote}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-poppins font-bold text-slate-900 text-base">Edit Customer Lead Notes</h3>
              <button
                type="button"
                onClick={() => setNoteEditLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <textarea
                rows={4}
                required
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-800"
                placeholder="Add conversation summary or customer requirements..."
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setNoteEditLead(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow"
              >
                Save Notes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
