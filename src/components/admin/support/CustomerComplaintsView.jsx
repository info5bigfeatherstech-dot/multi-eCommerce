import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  createComplaint,
  updateComplaintStatus,
} from "../../../store/slices/adminSupportSlice";
import {
  AlertTriangle,
  Search,
  Filter,
  Download,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  User,
  ExternalLink,
  Edit2,
  Sparkles,
  Gift,
  X,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/Select";
import { toast } from "sonner";

const CustomerComplaintsView = () => {
  const dispatch = useAppDispatch();
  const complaints = useAppSelector(
    (state) => state.adminSupport?.complaints || []
  );
  const staffMembers = useAppSelector(
    (state) => state.adminStaff?.staffMembers || []
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Resolution Modal State
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusInput, setStatusInput] = useState("Resolved");
  const [rootCauseInput, setRootCauseInput] = useState("");
  const [resolutionInput, setResolutionInput] = useState("");
  const [compensationInput, setCompensationInput] = useState("");

  // New Complaint Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newOrderId, setNewOrderId] = useState("");
  const [newType, setNewType] = useState("Courier SLA Breach");
  const [newSeverity, setNewSeverity] = useState("High");
  const [newDesc, setNewDesc] = useState("");
  const [newLead, setNewLead] = useState("Pooja Hegde");

  // Metrics
  const totalComplaints = complaints.length;
  const underInvestigation = complaints.filter(
    (c) => c.status === "Under Investigation"
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (severityFilter !== "all" && c.severity !== severityFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.customerName.toLowerCase().includes(q);
        const matchOrder = (c.orderId || "").toLowerCase().includes(q);
        const matchType = c.complaintType.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchLead = c.assignedLead.toLowerCase().includes(q);
        return matchName || matchOrder || matchType || matchDesc || matchLead;
      }
      return true;
    });
  }, [complaints, statusFilter, severityFilter, searchQuery]);

  // Handlers
  const openResolveModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusInput(complaint.status || "Resolved");
    setRootCauseInput(complaint.rootCause || "");
    setResolutionInput(complaint.resolution || "");
    setCompensationInput(complaint.compensationOffered || "");
    setResolveModalOpen(true);
  };

  const handleSaveResolution = (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    dispatch(
      updateComplaintStatus({
        id: selectedComplaint.id,
        status: statusInput,
        rootCause: rootCauseInput.trim(),
        resolution: resolutionInput.trim(),
        compensationOffered: compensationInput.trim(),
      })
    );

    toast.success(`Complaint #${selectedComplaint.id} resolution updated!`);
    setResolveModalOpen(false);
    setSelectedComplaint(null);
  };

  const handleCreateComplaint = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newDesc.trim()) {
      toast.error("Please fill in required grievance details.");
      return;
    }

    const complaintData = {
      customerName: newName.trim(),
      customerContact: newContact.trim() || "N/A",
      orderId: newOrderId.trim() || "ORD-General",
      complaintType: newType,
      severity: newSeverity,
      status: "Under Investigation",
      assignedLead: newLead,
      description: newDesc.trim(),
      rootCause: "Under initial review by operations team.",
      compensationOffered: "Pending assessment",
    };

    dispatch(createComplaint(complaintData));
    toast.success("Customer complaint logged for formal investigation!");
    setCreateModalOpen(false);
    setNewName("");
    setNewContact("");
    setNewOrderId("");
    setNewDesc("");
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Complaint ID",
      "Reported Date",
      "Customer Name",
      "Contact",
      "Order ID",
      "Type",
      "Severity",
      "Status",
      "Assigned Lead",
      "Description",
      "Root Cause",
      "Resolution",
      "Compensation Offered",
    ];

    const rows = filteredComplaints.map((c) => [
      c.id,
      c.reportedDate,
      `"${c.customerName}"`,
      `"${c.customerContact}"`,
      c.orderId,
      `"${c.complaintType}"`,
      c.severity,
      c.status,
      `"${c.assignedLead}"`,
      `"${c.description.replace(/"/g, '""')}"`,
      `"${(c.rootCause || "").replace(/"/g, '""')}"`,
      `"${(c.resolution || "").replace(/"/g, '""')}"`,
      `"${(c.compensationOffered || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_complaints_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Complaints log exported to CSV!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Customer Complaints & Grievances
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Customer complaints manage and resolve, conduct root cause analysis, and issue compensation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Complaints
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Log Grievance
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Grievances */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Escalations
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {totalComplaints}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Recorded customer disputes
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Under Investigation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Under Investigation
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {underInvestigation}
            </div>
            <div className="text-xs text-amber-700 mt-1 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Active operations audit
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved with Settlement */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Resolved & Settled
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {resolvedCount}
            </div>
            <div className="text-xs text-emerald-700 mt-1 font-medium">
              {totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0}% settlement rate
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Compensation Issued */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Compensation Rate
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              100%
            </div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">
              Wallet credit or free replacement
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
            <Gift className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search complaint, order ID, buyer..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="w-44">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Severity Filter */}
            <div className="w-40">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="High">High Severity</SelectItem>
                  <SelectItem value="Medium">Medium Severity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredComplaints.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <ShieldAlert className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">
              No customer grievances found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to review recorded complaints.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Complaint ID & Date</th>
                  <th className="py-3 px-4">Customer & Order</th>
                  <th className="py-3 px-4">Grievance Type</th>
                  <th className="py-3 px-4">Details & Root Cause</th>
                  <th className="py-3 px-4">Investigator Lead</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
                {filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID & Date */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">
                        {c.id}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {c.reportedDate}
                      </div>
                    </td>

                    {/* Customer & Order */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {c.customerName}
                      </div>
                      <div className="text-[11px] font-mono text-indigo-600 mt-0.5">
                        {c.orderId}
                      </div>
                    </td>

                    {/* Type & Severity */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="font-semibold text-slate-800">
                        {c.complaintType}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.severity === "High"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {c.severity} Severity
                        </span>
                      </div>
                    </td>

                    {/* Description & Root Cause */}
                    <td className="py-3.5 px-4 align-top max-w-sm">
                      <p className="text-slate-800 text-xs leading-relaxed font-medium">
                        {c.description}
                      </p>
                      {c.rootCause && (
                        <div className="mt-1.5 p-2 bg-slate-50 rounded border-l-2 border-amber-500 text-[11px] text-slate-600">
                          <strong className="text-amber-800 block mb-0.5">
                            RCA (Root Cause):
                          </strong>
                          {c.rootCause}
                        </div>
                      )}
                      {c.compensationOffered && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <Gift className="w-3 h-3" />
                          <span>Offered: {c.compensationOffered}</span>
                        </div>
                      )}
                    </td>

                    {/* Investigator */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.assignedLead}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      {c.status === "Under Investigation" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Investigating
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Resolved
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <button
                        onClick={() => openResolveModal(c)}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Resolve</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resolution & RCA Modal */}
      {resolveModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                  <FileText className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Grievance Resolution & RCA
                </h3>
              </div>
              <button
                onClick={() => setResolveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResolution} className="p-5 space-y-4">
              {/* Grievance snippet */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="font-semibold text-slate-800 mb-1 flex items-center justify-between">
                  <span>{selectedComplaint.customerName} (#{selectedComplaint.orderId})</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedComplaint.id}
                  </span>
                </div>
                <div className="text-slate-500 font-medium text-[11px] mb-1">
                  Type: {selectedComplaint.complaintType}
                </div>
                <p className="text-slate-700 italic">
                  "{selectedComplaint.description}"
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resolution Status
                </label>
                <Select value={statusInput} onValueChange={setStatusInput}>
                  <SelectTrigger className="w-full text-xs bg-white border-slate-200">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                    <SelectItem value="Resolved">Resolved & Settled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Root Cause Analysis (RCA)
                </label>
                <textarea
                  rows={2}
                  value={rootCauseInput}
                  onChange={(e) => setRootCauseInput(e.target.value)}
                  placeholder="Identify what failure occurred (e.g. 3PL courier delay, warehouse packaging error)..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corrective Action / Resolution
                </label>
                <textarea
                  rows={2}
                  value={resolutionInput}
                  onChange={(e) => setResolutionInput(e.target.value)}
                  placeholder="Describe corrective actions taken to resolve the issue..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Compensation Offered to Customer
                </label>
                <input
                  type="text"
                  value={compensationInput}
                  onChange={(e) => setCompensationInput(e.target.value)}
                  placeholder="e.g. ₹500 Store Wallet Credit + 15% OFF coupon"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResolveModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Grievance Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Log Customer Grievance
                </h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Customer Name"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Email / Phone
                  </label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="customer@email.com"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={newOrderId}
                    onChange={(e) => setNewOrderId(e.target.value)}
                    placeholder="ORD-XXXX"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grievance Type
                  </label>
                  <Select value={newType} onValueChange={setNewType}>
                    <SelectTrigger className="w-full text-xs bg-white border-slate-200">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Courier SLA Breach">Courier SLA Breach</SelectItem>
                      <SelectItem value="Packaging Defect">Packaging Defect</SelectItem>
                      <SelectItem value="Payment Deduction Glitch">Payment Glitch</SelectItem>
                      <SelectItem value="Defective Product">Defective Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Severity
                  </label>
                  <Select value={newSeverity} onValueChange={setNewSeverity}>
                    <SelectTrigger className="w-full text-xs bg-white border-slate-200">
                      <SelectValue placeholder="Select Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Lead Investigator
                </label>
                <Select value={newLead || (staffMembers[0]?.name || "")} onValueChange={setNewLead}>
                  <SelectTrigger className="w-full text-xs bg-white border-slate-200">
                    <SelectValue placeholder="Select Lead Investigator" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name} ({s.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grievance Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detail the exact incident and customer dissatisfaction..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Log Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerComplaintsView;
