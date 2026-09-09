import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLeadStatus } from "@/store/slices/adminLeadsSlice";
import {
  Store,
  Search,
  Filter,
  Download,
  MapPin,
  Building2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Video,
  Eye,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function FranchiseLeadsView() {
  const dispatch = useAppDispatch();
  const allLeads = useAppSelector((state) => state.adminLeads?.leads || []);

  const franchiseLeads = useMemo(() => {
    return allLeads.filter((l) => l.type === "Franchise");
  }, [allLeads]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [meetingModalLead, setMeetingModalLead] = useState(null);
  const [meetingDate, setMeetingDate] = useState("2026-09-15");

  const filteredLeads = useMemo(() => {
    return franchiseLeads.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        l.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.interest && l.interest.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = selectedStatus === "All" || l.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [franchiseLeads, searchTerm, selectedStatus]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateLeadStatus({ id, status: newStatus }));
    toast.info(`Franchise lead status set to ${newStatus}.`);
  };

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    if (!meetingModalLead) return;
    dispatch(updateLeadStatus({ id: meetingModalLead.id, status: "In Negotiation" }));
    toast.success(`Franchise evaluation meeting scheduled with ${meetingModalLead.name} for ${meetingDate}.`);
    setMeetingModalLead(null);
  };

  const handleExportCSV = () => {
    const headers = ["Lead ID", "Investor Name", "Enterprise", "Target City", "Investment Budget", "Property Status", "Email", "Phone", "Status", "Date"];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.company || "Individual"}"`,
      `"${l.city}"`,
      `"${l.investmentBudget || "N/A"}"`,
      `"${(l.propertyStatus || "").replace(/"/g, '""')}"`,
      l.email,
      `"${l.phone}"`,
      l.status,
      l.date,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `franchise_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Franchise partner leads exported.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-accent border border-orange-200 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-accent" />
              Retail Expansion & Franchise
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Omnichannel Store Network</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Franchise Partner Enquiries
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Evaluate high-net-worth investors and commercial property owners proposing exclusive brand flagship retail stores across key metropolitan zones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Franchise CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Franchise Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-accent flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{franchiseLeads.length}</p>
          <p className="text-xs text-slate-400 mt-1">Prospective regional investors</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Capital in Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">₹85+ Lakhs</p>
          <p className="text-xs text-slate-400 mt-1">Committed expansion investment</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Site Evaluations</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {franchiseLeads.filter((l) => l.status === "In Negotiation").length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Commercial lease & footfall audit</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Storefront Size</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">1,250 sq.ft</p>
          <p className="text-xs text-slate-400 mt-1">Prime high-street spaces</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search franchise proposals by investor name, enterprise, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-inter text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-500">Stage:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Stages</option>
              <option value="New">New Inquiries</option>
              <option value="Contacted">Contacted</option>
              <option value="In Negotiation">Site Evaluation</option>
              <option value="Converted">Agreement Executed</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Investor & Enterprise</th>
                <th className="p-4">Target Location</th>
                <th className="p-4">Proposed Investment</th>
                <th className="p-4">Commercial Property Details</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Expansion Lead</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Store className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No franchise partner enquiries found</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting search filters</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{lead.name}</p>
                        {lead.company && (
                          <p className="text-xs text-slate-600 font-medium">{lead.company}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-0.5">{lead.email} • {lead.phone}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                        <span>{lead.city}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{lead.interest}</p>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-900 text-xs block">{lead.investmentBudget}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Solvency Verified</span>
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 line-clamp-2">
                        {lead.propertyStatus}
                      </p>
                    </td>

                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer focus:outline-none ${
                          lead.status === "New"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : lead.status === "In Negotiation"
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : lead.status === "Converted"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Negotiation">Site Evaluation</option>
                        <option value="Converted">Agreement Executed</option>
                        <option value="Dropped">Dropped</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <p className="text-xs font-medium text-slate-800">{lead.assignedTo}</p>
                      <p className="text-[11px] text-slate-400">{lead.date}</p>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setMeetingModalLead(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Schedule Site Call
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {meetingModalLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleScheduleMeeting}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-orange-50 text-accent">
                  <Store className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">Schedule Site Evaluation</h3>
                  <p className="text-xs text-slate-400">{meetingModalLead.name} ({meetingModalLead.city})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMeetingModalLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-900">Target: {meetingModalLead.interest}</p>
                <p className="text-slate-600">Property: {meetingModalLead.propertyStatus}</p>
                <p className="text-emerald-700 font-semibold">Budget: {meetingModalLead.investmentBudget}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Proposed Inspection / Video Conference Date
                </label>
                <input
                  type="date"
                  required
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMeetingModalLead(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs font-semibold shadow"
              >
                <Calendar className="w-3.5 h-3.5" />
                Dispatch Calendar Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
