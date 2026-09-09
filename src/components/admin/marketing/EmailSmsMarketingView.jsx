import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addEmailSmsCampaign } from "@/store/slices/adminMarketingSlice";
import {
  Mail,
  MessageSquare,
  Search,
  PlusCircle,
  Download,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  SlidersHorizontal,
  TrendingUp,
  Percent,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function EmailSmsMarketingView() {
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector(
    (state) => state.adminMarketing?.emailSmsCampaigns || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All"); // "All" | "Email" | "SMS"
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  // Compose form state
  const [composeType, setComposeType] = useState("Email");
  const [composeName, setComposeName] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeAudience, setComposeAudience] = useState("All Retail Shoppers");
  const [composeBody, setComposeBody] = useState("");

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchSearch =
        c.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.subjectLine &&
          c.subjectLine.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.senderHeader &&
          c.senderHeader.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = selectedType === "All" || c.type === selectedType;
      return matchSearch && matchType;
    });
  }, [campaigns, searchTerm, selectedType]);

  const totalDispatches = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + (c.recipientsCount || 0), 0);
  }, [campaigns]);

  const avgOpenRate = useMemo(() => {
    if (campaigns.length === 0) return 0;
    const total = campaigns.reduce((sum, c) => sum + (c.openRate || 0), 0);
    return (total / campaigns.length).toFixed(1);
  }, [campaigns]);

  const avgClickRate = useMemo(() => {
    if (campaigns.length === 0) return 0;
    const total = campaigns.reduce((sum, c) => sum + (c.clickRate || 0), 0);
    return (total / campaigns.length).toFixed(1);
  }, [campaigns]);

  const handleCompose = (e) => {
    e.preventDefault();
    if (!composeName.trim()) {
      toast.error("Campaign name is required.");
      return;
    }

    const recipients = Math.floor(Math.random() * 8000) + 2000;
    const newCamp = {
      id: `EMS-${Date.now().toString().slice(-4)}`,
      type: composeType,
      campaignName: composeName.trim(),
      subjectLine:
        composeType === "Email"
          ? composeSubject.trim() || "Exciting updates from ApexMart"
          : undefined,
      senderHeader: composeType === "SMS" ? "APXMRT" : undefined,
      targetAudience: composeAudience,
      recipientsCount: recipients,
      deliveredRate: 98.6,
      openRate: composeType === "Email" ? 36.4 : 95.0,
      clickRate: (Math.random() * 6 + 6).toFixed(1),
      status: "Sent",
      sentAt: new Date().toISOString().split("T")[0],
    };

    dispatch(addEmailSmsCampaign(newCamp));
    toast.success(
      `${composeType} campaign "${composeName}" sent to ${recipients.toLocaleString()} recipients!`
    );
    setIsComposeModalOpen(false);
    setComposeName("");
    setComposeSubject("");
    setComposeBody("");
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Type",
      "Campaign Name",
      "Subject / Header",
      "Target Audience",
      "Recipients",
      "Delivered Rate %",
      "Open Rate %",
      "Click Rate %",
      "Status",
      "Date",
    ];

    const rows = filteredCampaigns.map((c) => [
      c.id,
      c.type,
      `"${c.campaignName.replace(/"/g, '""')}"`,
      `"${(c.subjectLine || c.senderHeader || "").replace(/"/g, '""')}"`,
      `"${c.targetAudience}"`,
      c.recipientsCount,
      `${c.deliveredRate}%`,
      `${c.openRate}%`,
      `${c.clickRate}%`,
      c.status,
      c.sentAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `email_sms_campaigns_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Email and SMS campaign logs exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Email Newsletters & SMS Gateway
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              <Mail className="h-3 w-3" /> Direct Messaging
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Dispatch promotional email newsletters, DLT-approved SMS notifications, and transactional sequence flows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => setIsComposeModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Compose Message
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Messages Dispatched
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {totalDispatches.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">Across Email & SMS gateways</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Avg Delivery Success
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">
            98.5%
          </div>
          <p className="mt-1 text-xs text-slate-500">DKIM/SPF verified sender score</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Avg Open Rate
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-blue-600">
            {avgOpenRate}%
          </div>
          <p className="mt-1 text-xs text-slate-500">Combined recipient engagement</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Avg Click-Through Rate
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Percent className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-purple-600">
            {avgClickRate}%
          </div>
          <p className="mt-1 text-xs text-slate-500">Actionable link traffic</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaign name, subject, or audience..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {["All", "Email", "SMS"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                selectedType === type
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {type === "All" ? "All Messages" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Channel</th>
                <th className="px-6 py-3.5">Campaign & Subject</th>
                <th className="px-6 py-3.5">Target Audience</th>
                <th className="px-6 py-3.5 text-right">Recipients</th>
                <th className="px-6 py-3.5 text-center">Delivery</th>
                <th className="px-6 py-3.5 text-center">Open Rate</th>
                <th className="px-6 py-3.5 text-center">Click Rate</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No Email or SMS campaigns found.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((camp) => (
                  <tr
                    key={camp.id}
                    className="hover:bg-slate-50/75 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {camp.type === "Email" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                          <Mail className="h-3 w-3" /> Email
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                          <MessageSquare className="h-3 w-3" /> SMS
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {camp.campaignName}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 max-w-sm truncate">
                          {camp.type === "Email"
                            ? `Subject: ${camp.subjectLine}`
                            : `Sender: ${camp.senderHeader}`}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {camp.sentAt} • {camp.id}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {camp.targetAudience}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-mono font-semibold text-slate-800">
                      {camp.recipientsCount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-center font-mono text-xs text-emerald-600 font-bold">
                      {camp.deliveredRate}%
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-slate-800 text-xs">
                        {camp.openRate}%
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full text-xs">
                        {camp.clickRate}%
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          camp.status === "Sent"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {camp.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compose Message Modal */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleCompose}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Compose {composeType} Broadcast
              </h3>
              <button
                type="button"
                onClick={() => setIsComposeModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Channel Dispatch Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setComposeType("Email")}
                  className={`p-3 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                    composeType === "Email"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Email Newsletter
                </button>
                <button
                  type="button"
                  onClick={() => setComposeType("SMS")}
                  className={`p-3 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                    composeType === "SMS"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  SMS Gateway (DLT)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Campaign Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. September Wholesale Volume Digest"
                value={composeName}
                onChange={(e) => setComposeName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {composeType === "Email" ? (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exclusive Wholesale Clearance: Up to 50% OFF"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  DLT Registered Sender ID
                </label>
                <input
                  type="text"
                  disabled
                  value="APXMRT (Approved)"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Target Recipient Audience
              </label>
              <select
                value={composeAudience}
                onChange={(e) => setComposeAudience(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All Retail Shoppers">All Retail Shoppers</option>
                <option value="Wholesale & B2B Inquiries">Wholesale & B2B Inquiries</option>
                <option value="Dropshipping Partner Database">Dropshipping Partner Database</option>
                <option value="Abandoned Cart Users">Abandoned Cart Users</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Body Content
              </label>
              <textarea
                rows={3}
                placeholder={
                  composeType === "Email"
                    ? "Enter newsletter text, markdown, or HTML snippet..."
                    : "Enter 160-character SMS copy..."
                }
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setIsComposeModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"
              >
                <Send className="h-4 w-4" />
                Dispatch {composeType}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
