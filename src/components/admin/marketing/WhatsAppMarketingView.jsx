import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addWhatsAppBroadcast } from "@/store/slices/adminMarketingSlice";
import {
  MessageCircle,
  Search,
  PlusCircle,
  Download,
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
  Eye,
  SlidersHorizontal,
  CheckCheck,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export default function WhatsAppMarketingView() {
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector(
    (state) => state.adminMarketing?.whatsappCampaigns || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Live preview message state
  const [previewTitle, setPreviewTitle] = useState(
    "🎉 Festive Mega Sale is Live!"
  );
  const [previewBody, setPreviewBody] = useState(
    "Hello {{name}}, explore up to 50% wholesale discounts on pure silk handlooms and audio tech. Use coupon PREPAID10 at checkout."
  );
  const [previewCta, setPreviewCta] = useState("View Festive Catalog");
  const [previewTemplate, setPreviewTemplate] = useState(
    "festive_vip_early_bird"
  );
  const [previewSegment, setPreviewSegment] = useState(
    "All Active Opt-in Numbers"
  );

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      return (
        c.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.recipientSegment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [campaigns, searchTerm]);

  const totalDelivered = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + (c.deliveredCount || 0), 0);
  }, [campaigns]);

  const totalReads = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + (c.readCount || 0), 0);
  }, [campaigns]);

  const totalReplies = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + (c.repliesCount || 0), 0);
  }, [campaigns]);

  const avgReadRate = useMemo(() => {
    if (totalDelivered === 0) return 0;
    return ((totalReads / totalDelivered) * 100).toFixed(1);
  }, [totalReads, totalDelivered]);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!previewTitle.trim() || !previewBody.trim()) {
      toast.error("Campaign message body is required.");
      return;
    }

    const count = Math.floor(Math.random() * 3000) + 1500;
    const newBroadcast = {
      id: `WA-${Date.now().toString().slice(-4)}`,
      campaignName: previewTitle.trim(),
      templateName: previewTemplate,
      recipientSegment: previewSegment,
      recipientCount: count,
      deliveredCount: Math.floor(count * 0.98),
      readCount: Math.floor(count * 0.82),
      repliesCount: Math.floor(count * 0.12),
      status: "Active Broadcast",
      sentAt: new Date().toISOString().split("T")[0],
    };

    dispatch(addWhatsAppBroadcast(newBroadcast));
    toast.success(
      `WhatsApp Business broadcast queued for ${count.toLocaleString()} recipients!`
    );
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Campaign Name",
      "Template Code",
      "Audience Segment",
      "Recipients",
      "Delivered",
      "Read Count",
      "Replies Count",
      "Status",
      "Date",
    ];

    const rows = filteredCampaigns.map((c) => [
      c.id,
      `"${c.campaignName.replace(/"/g, '""')}"`,
      c.templateName,
      `"${c.recipientSegment}"`,
      c.recipientCount,
      c.deliveredCount,
      c.readCount,
      c.repliesCount,
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
      `whatsapp_campaigns_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("WhatsApp marketing logs exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              WhatsApp Business API Marketing
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <MessageCircle className="h-3 w-3" /> Meta Cloud API
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Dispatch pre-approved Meta WhatsApp templates, automated abandoned cart nudges, and bulk catalog broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export Logs
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Broadcast WhatsApp Message
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Messages Delivered
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <CheckCheck className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {totalDelivered.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">98.4% Meta delivery rate</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Average Read Rate
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">
            {avgReadRate}%
          </div>
          <p className="mt-1 text-xs text-slate-500">Blue tick confirmed read</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Customer Inbound Replies
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <MessageCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-blue-600">
            {totalReplies.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">Direct conversational leads</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Account Health
            </span>
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            Green Tier High
          </div>
          <p className="mt-1 text-xs text-slate-500">Meta Quality Rating: High</p>
        </div>
      </div>

      {/* Grid: Left Column Broadcast Table, Right Column Live Chat Bubble Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaign, template, or segment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Campaign & Template</th>
                    <th className="px-5 py-3.5">Audience Segment</th>
                    <th className="px-5 py-3.5 text-right">Delivered</th>
                    <th className="px-5 py-3.5 text-right">Read</th>
                    <th className="px-5 py-3.5 text-right">Replies</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-center">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCampaigns.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        No WhatsApp campaigns found.
                      </td>
                    </tr>
                  ) : (
                    filteredCampaigns.map((camp) => (
                      <tr
                        key={camp.id}
                        className="hover:bg-slate-50/75 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <div className="font-semibold text-slate-900">
                              {camp.campaignName}
                            </div>
                            <div className="font-mono text-xs text-emerald-700 mt-0.5">
                              {camp.templateName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {camp.sentAt}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {camp.recipientSegment}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right font-mono font-semibold text-slate-800">
                          {camp.deliveredCount.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-right font-mono font-semibold text-emerald-600">
                          {camp.readCount.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-right font-mono font-semibold text-blue-600">
                          {camp.repliesCount.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              camp.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            {camp.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => {
                              setPreviewTitle(camp.campaignName);
                              setPreviewTemplate(camp.templateName);
                              setPreviewSegment(camp.recipientSegment);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                            title="Load into Live Chat Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live WhatsApp Bubble Preview (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 rounded-2xl border border-slate-200 bg-[#e5ddd5] p-4 shadow-sm space-y-3 font-sans">
            {/* WhatsApp Header Bar */}
            <div className="rounded-xl bg-[#075e54] p-3 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center font-bold text-[#075e54] text-xs shadow-xs">
                  A
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1">
                    ApexMart Official
                    <span className="h-3.5 w-3.5 rounded-full bg-emerald-400 text-white flex items-center justify-center text-[8px]">
                      ✓
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-100">
                    Official Business Account
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-emerald-200">Verified</span>
            </div>

            {/* Chat Bubble Message */}
            <div className="bg-white rounded-xl rounded-tl-xs p-3.5 shadow-sm space-y-2.5 max-w-[95%]">
              <div className="font-bold text-slate-900 text-xs leading-snug">
                {previewTitle}
              </div>

              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {previewBody}
              </div>

              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                <span>10:45 AM</span>
                <span className="text-sky-500 font-bold">✓✓</span>
              </div>

              {/* Quick Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
                <button
                  type="button"
                  className="w-full py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1 hover:bg-emerald-100"
                >
                  <ExternalLink className="h-3 w-3" />
                  {previewCta}
                </button>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="rounded-xl bg-white/90 backdrop-blur-xs p-3 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Meta Template:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {previewTemplate}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Audience:</span>
                <span className="font-medium text-slate-900">
                  {previewSegment}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast WhatsApp Message Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleBroadcast}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                New WhatsApp Broadcast
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Broadcast Campaign Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Festival Season Early Bird Preview"
                value={previewTitle}
                onChange={(e) => setPreviewTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Approved Meta Template
                </label>
                <select
                  value={previewTemplate}
                  onChange={(e) => setPreviewTemplate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                >
                  <option value="festive_vip_early_bird">festive_vip_early_bird</option>
                  <option value="b2b_wholesale_catalog_v2">b2b_wholesale_catalog_v2</option>
                  <option value="prepaid_checkout_offer">prepaid_checkout_offer</option>
                  <option value="dropship_wallet_refill">dropship_wallet_refill</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Recipient Segment
                </label>
                <select
                  value={previewSegment}
                  onChange={(e) => setPreviewSegment(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All Active Opt-in Numbers">All Active Opt-in Numbers</option>
                  <option value="Verified Wholesale Buyers">Verified Wholesale Buyers</option>
                  <option value="COD Order Placing Customers">COD Order Placing Customers</option>
                  <option value="Dropshippers with Low Balance">Dropshippers with Low Balance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Body Message Template Text *
              </label>
              <textarea
                rows={4}
                required
                value={previewBody}
                onChange={(e) => setPreviewBody(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Action Button Label (CTA)
              </label>
              <input
                type="text"
                placeholder="View Offer"
                value={previewCta}
                onChange={(e) => setPreviewCta(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
              >
                <Send className="h-4 w-4" />
                Dispatch Broadcast
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
