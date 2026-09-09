import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  replyToQuery,
  convertQueryToTicket,
} from "../../../store/slices/adminSupportSlice";
import {
  MessageCircle,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  LifeBuoy,
  Phone,
  Mail,
  X,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

const CustomerQueriesView = () => {
  const dispatch = useAppDispatch();
  const queries = useAppSelector((state) => state.adminSupport?.queries || []);

  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'Unanswered' | 'Replied'
  const [channelFilter, setChannelFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Reply Modal State
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Metrics
  const totalQueries = queries.length;
  const unansweredCount = queries.filter((q) => q.status === "Unanswered").length;
  const repliedCount = queries.filter((q) => q.status === "Replied").length;

  // Filtered queries
  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      if (statusFilter !== "all" && q.status !== statusFilter) return false;
      if (channelFilter !== "all" && q.channel !== channelFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = q.customerName.toLowerCase().includes(query);
        const matchContact = q.contact.toLowerCase().includes(query);
        const matchTopic = q.topic.toLowerCase().includes(query);
        const matchQuestion = q.question.toLowerCase().includes(query);
        return matchName || matchContact || matchTopic || matchQuestion;
      }
      return true;
    });
  }, [queries, statusFilter, channelFilter, searchQuery]);

  // Handlers
  const openReplyModal = (query) => {
    setSelectedQuery(query);
    setReplyText(query.reply || "");
    setReplyModalOpen(true);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedQuery) return;

    dispatch(
      replyToQuery({
        id: selectedQuery.id,
        replyText: replyText.trim(),
      })
    );
    toast.success(`Response dispatched to ${selectedQuery.customerName}!`);
    setReplyModalOpen(false);
    setSelectedQuery(null);
    setReplyText("");
  };

  const handleConvertToTicket = (id, name) => {
    dispatch(convertQueryToTicket(id));
    toast.success(`Inquiry from ${name} escalated to official Support Ticket!`);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Query ID",
      "Customer Name",
      "Contact",
      "Channel",
      "Topic",
      "Question",
      "Status",
      "Official Reply",
      "Received At",
    ];

    const rows = filteredQueries.map((q) => [
      q.id,
      `"${q.customerName}"`,
      `"${q.contact}"`,
      q.channel,
      `"${q.topic.replace(/"/g, '""')}"`,
      `"${q.question.replace(/"/g, '""')}"`,
      q.status,
      q.reply ? `"${q.reply.replace(/"/g, '""')}"` : '""',
      q.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_queries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Customer inquiries exported to CSV!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Customer Queries & Inquiries
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Customer questions and enquiries handle across Web Contact Form, WhatsApp, and Storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Queries
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {totalQueries}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Pre & post-order inquiries
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Unanswered */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Awaiting Response
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {unansweredCount}
            </div>
            <div className="text-xs text-amber-700 mt-1 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Target response &lt; 2 hrs
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Replied */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Answered Inquiries
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {repliedCount}
            </div>
            <div className="text-xs text-emerald-700 mt-1 font-medium">
              {totalQueries > 0 ? Math.round((repliedCount / totalQueries) * 100) : 0}% answer rate
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Average Turnaround */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Avg Turnaround
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              1.8 hrs
            </div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">
              Within WhatsApp SLA
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
            <Clock className="w-6 h-6" />
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
              placeholder="Search topic, buyer, question..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="min-w-[140px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Unanswered">Unanswered</SelectItem>
                  <SelectItem value="Replied">Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Channel Filter */}
            <div className="min-w-[150px]">
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="All Channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Contact Us Form">Contact Us Form</SelectItem>
                  <SelectItem value="Web Portal">Web Portal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Queries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredQueries.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <MessageCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">
              No customer inquiries found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to inspect other inquiries.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Query ID / Time</th>
                  <th className="py-3 px-4">Customer Contact</th>
                  <th className="py-3 px-4">Topic & Channel</th>
                  <th className="py-3 px-4">Customer Question</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
                {filteredQueries.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID & Time */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">
                        {q.id}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {q.createdAt}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {q.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        {q.contact.includes("@") ? (
                          <Mail className="w-3 h-3 text-slate-400" />
                        ) : (
                          <Phone className="w-3 h-3 text-slate-400" />
                        )}
                        <span>{q.contact}</span>
                      </div>
                    </td>

                    {/* Topic & Channel */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-800">
                        {q.topic}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            q.channel === "WhatsApp"
                              ? "bg-emerald-100 text-emerald-800"
                              : q.channel === "Contact Us Form"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {q.channel}
                        </span>
                      </div>
                    </td>

                    {/* Question & Reply preview */}
                    <td className="py-3.5 px-4 align-top max-w-sm">
                      <p className="text-slate-800 text-xs leading-relaxed font-medium">
                        "{q.question}"
                      </p>
                      {q.reply && (
                        <div className="mt-2 p-2 bg-slate-50 rounded border-l-2 border-indigo-500 text-[11px] text-slate-600">
                          <strong className="text-indigo-700 block mb-0.5">
                            Our Reply:
                          </strong>
                          {q.reply}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      {q.status === "Unanswered" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          Unanswered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Replied
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openReplyModal(q)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>{q.reply ? "Edit Reply" : "Reply"}</span>
                        </button>

                        <button
                          onClick={() => handleConvertToTicket(q.id, q.customerName)}
                          title="Convert into Trackable Support Ticket"
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                        >
                          <LifeBuoy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModalOpen && selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                  <MessageCircle className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Respond to Customer Inquiry
                </h3>
              </div>
              <button
                onClick={() => setReplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="p-5 space-y-4">
              {/* Question preview */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="font-semibold text-slate-800 mb-1 flex items-center justify-between">
                  <span>{selectedQuery.customerName} ({selectedQuery.contact})</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedQuery.id}
                  </span>
                </div>
                <div className="text-slate-500 font-medium text-[11px] mb-1">
                  Topic: {selectedQuery.topic}
                </div>
                <p className="text-slate-700 italic">
                  "{selectedQuery.question}"
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Response (Dispatched via {selectedQuery.channel})
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a helpful and courteous reply..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerQueriesView;
