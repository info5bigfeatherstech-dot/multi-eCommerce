import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  createTicket,
  updateTicketStatus,
  assignTicketAgent,
  replyToTicket,
} from "../../../store/slices/adminSupportSlice";
import {
  LifeBuoy,
  Plus,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Send,
  User,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const CANNED_RESPONSES = [
  "Hello, we have contacted our fulfillment warehouse to prioritize your order dispatch immediately.",
  "Your refund request has been escalated to our accounts team. You will receive an automated SMS once processed.",
  "We sincerely apologize for the inconvenience caused. Our senior operations lead is reviewing this with the courier.",
  "A replacement unit has been booked under express shipping at no additional cost to you.",
];

const SupportTicketsView = () => {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector((state) => state.adminSupport?.tickets || []);
  const staffMembers = useAppSelector((state) => state.adminStaff?.staffMembers || []);

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");

  // Thread Drawer State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");

  // New Ticket Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newOrderId, setNewOrderId] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("Delivery & Packaging");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newChannel, setNewChannel] = useState("Web Portal");
  const [newInitialMsg, setNewInitialMsg] = useState("");

  // Metrics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "Open").length;
  const inProgressTickets = tickets.filter((t) => t.status === "In Progress").length;
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      if (activeTab !== "all" && ticket.status !== activeTab) return false;
      if (priorityFilter !== "all" && ticket.priority !== priorityFilter) return false;
      if (channelFilter !== "all" && ticket.channel !== channelFilter) return false;
      if (agentFilter !== "all" && ticket.assignedAgent !== agentFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSubject = ticket.subject.toLowerCase().includes(q);
        const matchName = ticket.customerName.toLowerCase().includes(q);
        const matchEmail = ticket.customerEmail.toLowerCase().includes(q);
        const matchId = ticket.id.toLowerCase().includes(q);
        const matchOrder = (ticket.orderId || "").toLowerCase().includes(q);
        return matchSubject || matchName || matchEmail || matchId || matchOrder;
      }
      return true;
    });
  }, [tickets, activeTab, priorityFilter, channelFilter, agentFilter, searchQuery]);

  // Handlers
  const handleOpenThread = (ticket) => {
    setSelectedTicket(ticket);
    setReplyText("");
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    dispatch(
      replyToTicket({
        id: selectedTicket.id,
        text: replyText.trim(),
        author: "Support Desk Agent",
      })
    );

    // Update local drawer state with the new message
    const updated = {
      ...selectedTicket,
      status: selectedTicket.status === "Open" ? "In Progress" : selectedTicket.status,
      messages: [
        ...selectedTicket.messages,
        {
          id: `msg-${Date.now()}`,
          author: "Support Desk Agent",
          senderType: "agent",
          text: replyText.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };
    setSelectedTicket(updated);
    setReplyText("");
    toast.success("Reply dispatched to customer!");
  };

  const handleUpdateStatus = (id, newStatus) => {
    dispatch(updateTicketStatus({ id, status: newStatus }));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
    toast.success(`Ticket #${id} status updated to ${newStatus}`);
  };

  const handleAssignAgent = (id, agent) => {
    dispatch(assignTicketAgent({ id, agent }));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, assignedAgent: agent });
    }
    toast.success(`Assigned ticket #${id} to ${agent}`);
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newSubject.trim()) {
      toast.error("Please provide customer name and subject.");
      return;
    }

    const newTicketData = {
      customerName: newCustomerName.trim(),
      customerEmail: newCustomerEmail.trim() || "customer@store.in",
      customerPhone: newCustomerPhone.trim() || "+91 99999 00000",
      orderId: newOrderId.trim() || "N/A",
      subject: newSubject.trim(),
      category: newCategory,
      priority: newPriority,
      channel: newChannel,
      assignedAgent: staffMembers[0]?.name || "Pooja Hegde",
      initialMessage: newInitialMsg.trim() || newSubject.trim(),
    };

    dispatch(createTicket(newTicketData));
    toast.success("Support ticket logged successfully!");
    setCreateModalOpen(false);
    setNewCustomerName("");
    setNewCustomerEmail("");
    setNewCustomerPhone("");
    setNewOrderId("");
    setNewSubject("");
    setNewInitialMsg("");
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Ticket ID",
      "Customer Name",
      "Email",
      "Phone",
      "Order ID",
      "Subject",
      "Category",
      "Priority",
      "Status",
      "Channel",
      "Assigned Agent",
      "Created At",
    ];

    const rows = filteredTickets.map((t) => [
      t.id,
      `"${t.customerName}"`,
      t.customerEmail,
      `"${t.customerPhone}"`,
      t.orderId,
      `"${t.subject.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.priority,
      t.status,
      t.channel,
      `"${t.assignedAgent}"`,
      `"${t.createdAt}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `support_tickets_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Support tickets exported to CSV!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <LifeBuoy className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Support Tickets
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Customer support tickets manage, track resolution SLAs, and assign staff agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Tickets
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tickets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Support Tickets
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {totalTickets}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across all customer channels
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <LifeBuoy className="w-6 h-6" />
          </div>
        </div>

        {/* Open Tickets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Open / Action Required
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {openTickets}
            </div>
            <div className="text-xs text-amber-700 mt-1 font-medium">
              Awaiting first response / update
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              In Progress
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {inProgressTickets}
            </div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">
              Assigned & actively handled
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Resolved & Closed
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {resolvedTickets}
            </div>
            <div className="text-xs text-emerald-700 mt-1 font-medium">
              {totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0}% resolution rate
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto">
            {["all", "Open", "In Progress", "Resolved", "Closed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab === "all" ? `All (${totalTickets})` : tab}
              </button>
            ))}
          </div>

          {/* Search & Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket, customer, order..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Channel Filter */}
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">All Channels</option>
              <option value="Web Portal">Web Portal</option>
              <option value="Email">Email</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Phone">Phone</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <LifeBuoy className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">
              No support tickets found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try switching status tabs or clearing your search filters to view other tickets.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket ID & Time</th>
                  <th className="py-3 px-4">Customer Info</th>
                  <th className="py-3 px-4">Subject & Category</th>
                  <th className="py-3 px-4">Priority & Channel</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => handleOpenThread(ticket)}
                  >
                    {/* ID & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">
                        {ticket.id}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ticket.createdAt}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {ticket.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {ticket.customerEmail}
                      </div>
                    </td>

                    {/* Subject & Category */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate">
                        {ticket.subject}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {ticket.category}
                        </span>
                        {ticket.orderId && ticket.orderId !== "N/A" && (
                          <span className="text-[10px] font-mono text-indigo-600">
                            #{ticket.orderId}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Priority & Channel */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            ticket.priority === "Urgent"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : ticket.priority === "High"
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : ticket.priority === "Medium"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        via {ticket.channel}
                      </div>
                    </td>

                    {/* Assigned Agent */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ticket.assignedAgent}</span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {ticket.status === "Open" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          Open
                        </span>
                      )}
                      {ticket.status === "In Progress" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                          <Clock className="w-3 h-3" />
                          In Progress
                        </span>
                      )}
                      {ticket.status === "Resolved" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Resolved
                        </span>
                      )}
                      {ticket.status === "Closed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Closed
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenThread(ticket);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-md border border-slate-200 hover:border-indigo-200 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Thread</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Conversation Thread Modal / Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-indigo-700">
                    #{selectedTicket.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate max-w-md">
                    {selectedTicket.subject}
                  </h3>
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>{selectedTicket.customerName}</span>
                  <span>•</span>
                  <span>{selectedTicket.customerEmail}</span>
                  <span>•</span>
                  <span>{selectedTicket.createdAt}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ticket Management Toolbar */}
            <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Status:</span>
                <select
                  value={selectedTicket.status}
                  onChange={(e) =>
                    handleUpdateStatus(selectedTicket.id, e.target.value)
                  }
                  className="py-1 px-2 font-medium bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Assignee:</span>
                <select
                  value={selectedTicket.assignedAgent}
                  onChange={(e) =>
                    handleAssignAgent(selectedTicket.id, e.target.value)
                  }
                  className="py-1 px-2 font-medium bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                >
                  {staffMembers.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conversation Messages Scrollable Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
              {selectedTicket.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.senderType === "agent" ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 px-1">
                    <span className="font-semibold text-slate-700">
                      {msg.author}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-md p-3.5 rounded-xl text-xs leading-relaxed shadow-xs ${
                      msg.senderType === "agent"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Composer */}
            <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-slate-200 space-y-2.5">
              {/* Canned Response Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-400 flex-shrink-0 font-medium">Quick Reply:</span>
                {CANNED_RESPONSES.slice(0, 2).map((canned, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(canned)}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 truncate max-w-xs transition-colors"
                  >
                    {canned}
                  </button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official response to the customer..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Sending as: <strong>Support Desk Agent</strong>
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                  <LifeBuoy className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Create Support Ticket
                </h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="e.g. Anand Kumar"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="anand@gmail.com"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="+91 98000 11223"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Related Order ID
                  </label>
                  <input
                    type="text"
                    value={newOrderId}
                    onChange={(e) => setNewOrderId(e.target.value)}
                    placeholder="e.g. ORD-9481"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ticket Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Brief summary of customer issue..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Delivery & Packaging">Delivery & Packaging</option>
                    <option value="Product Technical Support">Technical Support</option>
                    <option value="Refunds & Payments">Refunds & Payments</option>
                    <option value="Billing & Invoicing">Billing & Invoicing</option>
                    <option value="General Query">General Query</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Channel
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Web Portal">Web Portal</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Message / Context
                </label>
                <textarea
                  rows={2}
                  value={newInitialMsg}
                  onChange={(e) => setNewInitialMsg(e.target.value)}
                  placeholder="Details of the customer inquiry or complaint..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketsView;
