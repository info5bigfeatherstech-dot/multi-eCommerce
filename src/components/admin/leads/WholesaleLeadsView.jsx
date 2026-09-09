import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLeadStatus } from "@/store/slices/adminLeadsSlice";
import {
  Briefcase,
  Search,
  Filter,
  Download,
  Building2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function WholesaleLeadsView() {
  const dispatch = useAppDispatch();
  const allLeads = useAppSelector((state) => state.adminLeads?.leads || []);

  const wholesaleLeads = useMemo(() => {
    return allLeads.filter((l) => l.type === "Wholesale");
  }, [allLeads]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [quoteModalLead, setQuoteModalLead] = useState(null);
  const [quoteDiscount, setQuoteDiscount] = useState("35%");

  const filteredLeads = useMemo(() => {
    return wholesaleLeads.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        l.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.gstNumber && l.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = selectedStatus === "All" || l.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [wholesaleLeads, searchTerm, selectedStatus]);

  const totalWholesaleValue = useMemo(() => {
    return wholesaleLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
  }, [wholesaleLeads]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateLeadStatus({ id, status: newStatus }));
    toast.info(`Wholesale lead status marked as ${newStatus}.`);
  };

  const handleSendQuote = (e) => {
    e.preventDefault();
    if (!quoteModalLead) return;
    toast.success(`Official B2B quotation (${quoteDiscount} tier discount) sent to ${quoteModalLead.company}!`);
    setQuoteModalLead(null);
  };

  const handleExportCSV = () => {
    const headers = ["Lead ID", "Company Name", "Contact Person", "GST Number", "Email", "Phone", "City", "Requested Volume", "Estimated Value (INR)", "Status", "Date"];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.company}"`,
      `"${l.name}"`,
      l.gstNumber || "N/A",
      l.email,
      `"${l.phone}"`,
      `"${l.city}"`,
      `"${l.requestedVolume || "N/A"}"`,
      l.estimatedValue || 0,
      l.status,
      l.date,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wholesale_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Wholesale leads exported.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-purple-600" />
              B2B Institutional Pipeline
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Distributors & Retail Chains</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Wholesale Business Enquiries
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Commercial wholesale proposals, recurring bulk order consignments, and GST-registered B2B trade partnerships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Wholesale CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wholesale Enquiries</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{wholesaleLeads.length}</p>
          <p className="text-xs text-slate-400 mt-1">Enterprise & wholesale inquiries</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">B2B Deal Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            ₹{totalWholesaleValue.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Total projected annual contracts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Negotiation</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {wholesaleLeads.filter((l) => l.status === "In Negotiation").length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Price quote & terms review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">GST Verified</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">100%</p>
          <p className="text-xs text-slate-400 mt-1">Legitimate tax compliance cleared</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search wholesale accounts by company, contact person, city, or GST..."
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

      {/* Wholesale Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Enterprise / Company</th>
                <th className="p-4">Requested Volume</th>
                <th className="p-4">Deal Valuation</th>
                <th className="p-4">GST / Tax ID</th>
                <th className="p-4">Status Stage</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No wholesale enquiries found</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust search parameters</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{lead.company}</p>
                        <p className="text-xs text-slate-600 mt-0.5">Contact: {lead.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {lead.city} • {lead.email}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-800 block text-xs">{lead.requestedVolume}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{lead.interest}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">₹{lead.estimatedValue.toLocaleString()}</p>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        High Potential
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {lead.gstNumber}
                      </span>
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
                      <p className="text-xs font-medium text-slate-800">{lead.assignedTo}</p>
                      <p className="text-[11px] text-slate-400">{lead.date}</p>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setQuoteModalLead(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Send Quote
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send B2B Quote Modal */}
      {quoteModalLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSendQuote}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">Generate Wholesale Quote</h3>
                  <p className="text-xs text-slate-400">{quoteModalLead.company}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuoteModalLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-semibold text-slate-900">Volume: {quoteModalLead.requestedVolume}</p>
                <p className="text-slate-500 mt-0.5">Contact: {quoteModalLead.email}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Tier Discount Percentage
                </label>
                <input
                  type="text"
                  required
                  value={quoteDiscount}
                  onChange={(e) => setQuoteDiscount(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuoteModalLead(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Formal Quote PDF
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
