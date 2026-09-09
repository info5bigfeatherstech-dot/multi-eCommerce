import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLeadStatus } from "@/store/slices/adminLeadsSlice";
import {
  Truck,
  Search,
  Filter,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  Key,
  Globe,
  Mail,
  Phone,
  Store,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function DropshippingLeadsView() {
  const dispatch = useAppDispatch();
  const allLeads = useAppSelector((state) => state.adminLeads?.leads || []);

  const dropshipLeads = useMemo(() => {
    return allLeads.filter((l) => l.type === "Dropshipping");
  }, [allLeads]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [apiKeyModalLead, setApiKeyModalLead] = useState(null);

  const filteredLeads = useMemo(() => {
    return dropshipLeads.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.niche && l.niche.toLowerCase().includes(searchTerm.toLowerCase())) ||
        l.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === "All" || l.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [dropshipLeads, searchTerm, selectedStatus]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateLeadStatus({ id, status: newStatus }));
    toast.info(`Partner status updated to ${newStatus}.`);
  };

  const handleApprovePartner = (lead) => {
    dispatch(updateLeadStatus({ id: lead.id, status: "Converted" }));
    setApiKeyModalLead(lead);
    toast.success(`Partner "${lead.company}" approved for blind dispatch!`);
  };

  const handleExportCSV = () => {
    const headers = ["Lead ID", "Store Name", "Founder Name", "Store URL", "Monthly Projected Orders", "Product Niche", "Email", "Phone", "Status", "Date"];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.company}"`,
      `"${l.name}"`,
      l.storeUrl || "N/A",
      `"${l.estimatedOrdersPerMonth || "N/A"}"`,
      `"${l.niche || "General"}"`,
      l.email,
      `"${l.phone}"`,
      l.status,
      l.date,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dropshipping_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Dropshipping partner leads exported.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-cyan-600" />
              Blind Shipping Reseller Program
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Automated Fulfillment API</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Dropshipping Partner Enquiries
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Review merchant applications from Shopify, WooCommerce, and social commerce resellers seeking blind dispatch and custom branded packaging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Dropship CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Partner Applicants</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">{dropshipLeads.length}</p>
          <p className="text-xs text-slate-400 mt-1">Total reseller applications</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Resellers</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {dropshipLeads.filter((l) => l.status === "Converted").length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Integrated & dispatching</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Under Verification</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {dropshipLeads.filter((l) => l.status === "New" || l.status === "Contacted").length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Store audit & SLA review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Monthly Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">350+</p>
          <p className="text-xs text-slate-400 mt-1">Projected monthly volume / partner</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dropshipping applications by store, founder, or niche..."
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
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Approved & Active</option>
              <option value="Dropped">Rejected</option>
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
                <th className="p-4">Store & Partner Details</th>
                <th className="p-4">Channel / Website</th>
                <th className="p-4">Estimated Monthly Orders</th>
                <th className="p-4">Target Niche</th>
                <th className="p-4">Partnership Status</th>
                <th className="p-4">Operations Rep</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Truck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No dropshipping partner enquiries found</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust search filters</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{lead.company}</p>
                        <p className="text-xs text-slate-600">Founder: {lead.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{lead.email} • {lead.city}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      {lead.storeUrl ? (
                        <a
                          href={lead.storeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span className="max-w-xs truncate">{lead.storeUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Social Commerce / App</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-900 text-xs block">{lead.estimatedOrdersPerMonth}</span>
                      <span className="text-[10px] text-slate-400">Blind dispatch required</span>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        {lead.niche}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer focus:outline-none ${
                          lead.status === "New"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : lead.status === "Contacted"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : lead.status === "Converted"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Approved (Active)</option>
                        <option value="Dropped">Rejected</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <p className="text-xs font-medium text-slate-800">{lead.assignedTo}</p>
                      <p className="text-[11px] text-slate-400">{lead.date}</p>
                    </td>

                    <td className="p-4 text-right">
                      {lead.status !== "Converted" ? (
                        <button
                          onClick={() => handleApprovePartner(lead)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
                        >
                          <Key className="w-3.5 h-3.5" />
                          Approve Partner
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          API Active
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

      {/* API Key Modal */}
      {apiKeyModalLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Key className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">Dropship Partner Approved</h3>
                  <p className="text-xs text-slate-400">{apiKeyModalLead.company}</p>
                </div>
              </div>
              <button
                onClick={() => setApiKeyModalLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <p className="text-xs text-slate-600">
                Generated blind shipping fulfillment token for {apiKeyModalLead.name}. Dispatch packaging will hide store identifiers and show partner branding.
              </p>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">API Access Token</span>
                <code className="text-xs font-mono font-bold text-slate-900 break-all select-all block">
                  sk_live_drop_{Math.random().toString(36).substring(2, 15)}
                </code>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setApiKeyModalLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
