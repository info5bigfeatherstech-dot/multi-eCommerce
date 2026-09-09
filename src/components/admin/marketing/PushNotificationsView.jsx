import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addPushNotification } from "@/store/slices/adminMarketingSlice";
import {
  Bell,
  Search,
  PlusCircle,
  Download,
  Smartphone,
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
  Eye,
  SlidersHorizontal,
  Layers,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function PushNotificationsView() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.adminMarketing?.pushNotifications || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Live preview state / draft state
  const [draftTitle, setDraftTitle] = useState("⚡ Flash 40% Off Active Now!");
  const [draftMessage, setDraftMessage] = useState(
    "Top wireless audio and kitchen ceramic sets on instant discount. Free express shipping above ₹499."
  );
  const [draftSegment, setDraftSegment] = useState("All Registered Shoppers");
  const [draftLink, setDraftLink] = useState("/category/electronics");

  const segments = useMemo(() => {
    const set = new Set(notifications.map((n) => n.segment));
    return ["All", ...Array.from(set)];
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.segment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSegment =
        selectedSegment === "All" || n.segment === selectedSegment;
      return matchSearch && matchSegment;
    });
  }, [notifications, searchTerm, selectedSegment]);

  const totalDelivered = useMemo(() => {
    return notifications.reduce((sum, n) => sum + (n.sentCount || 0), 0);
  }, [notifications]);

  const avgCtr = useMemo(() => {
    const sentOnes = notifications.filter((n) => n.status === "Sent");
    if (sentOnes.length === 0) return 0;
    const total = sentOnes.reduce((sum, n) => sum + (n.clickRate || 0), 0);
    return (total / sentOnes.length).toFixed(1);
  }, [notifications]);

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!draftTitle.trim() || !draftMessage.trim()) {
      toast.error("Title and message are required.");
      return;
    }

    const newPush = {
      id: `PSH-${Date.now().toString().slice(-4)}`,
      title: draftTitle.trim(),
      message: draftMessage.trim(),
      segment: draftSegment,
      sentCount: Math.floor(Math.random() * 5000) + 1200,
      clickRate: (Math.random() * 8 + 5).toFixed(1),
      deepLink: draftLink.trim() || "/",
      status: "Sent",
      sentAt: "Just now",
    };

    dispatch(addPushNotification(newPush));
    toast.success(`Push notification dispatched to ${newPush.sentCount} devices!`);
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Title",
      "Message",
      "Audience Segment",
      "Sent Count",
      "CTR %",
      "Deep Link",
      "Status",
      "Sent Timestamp",
    ];

    const rows = filteredNotifications.map((n) => [
      n.id,
      `"${n.title.replace(/"/g, '""')}"`,
      `"${n.message.replace(/"/g, '""')}"`,
      `"${n.segment}"`,
      n.sentCount,
      `${n.clickRate}%`,
      n.deepLink,
      n.status,
      `"${n.sentAt}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `push_notifications_log_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Push notification history exported as CSV.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Promotional Push Notifications
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              <Smartphone className="h-3 w-3" /> Web & App Alerts
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Dispatch real-time lockscreen notifications to mobile apps and browser opt-in subscribers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export History
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Compose Notification
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Push Broadcasts
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Bell className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {notifications.length}
          </div>
          <p className="mt-1 text-xs text-slate-500">Scheduled & dispatched alerts</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Device Deliveries
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Smartphone className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-blue-600">
            {totalDelivered.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500">Impressions displayed on screens</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Average CTR
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600">
            {avgCtr}%
          </div>
          <p className="mt-1 text-xs text-slate-500">Industry benchmark: 3.2%</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Top Engagement Channel
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-purple-600">
            Cart Recovery
          </div>
          <p className="mt-1 text-xs text-slate-500">14.2% direct conversion rate</p>
        </div>
      </div>

      {/* Grid: Left Column History, Right Column Live Lockscreen Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search notification title, message, or segment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="w-52">
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger className="h-9 text-xs bg-white border-slate-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                    <SelectValue placeholder="Segment" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {segments.map((seg) => (
                    <SelectItem key={seg} value={seg}>
                      {seg === "All" ? "All Audience Segments" : seg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/75 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Notification Details</th>
                    <th className="px-5 py-3.5">Target Segment</th>
                    <th className="px-5 py-3.5 text-right">Sent</th>
                    <th className="px-5 py-3.5 text-center">CTR %</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-center">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredNotifications.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        No push notifications found.
                      </td>
                    </tr>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <tr
                        key={notif.id}
                        className="hover:bg-slate-50/75 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <div className="font-semibold text-slate-900">
                              {notif.title}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {notif.message}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">
                              {notif.sentAt} • {notif.deepLink}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {notif.segment}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right font-mono font-semibold text-slate-800">
                          {notif.sentCount.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs">
                            {notif.clickRate}%
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              notif.status === "Sent"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {notif.status === "Sent" ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {notif.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => {
                              setDraftTitle(notif.title);
                              setDraftMessage(notif.message);
                              setDraftSegment(notif.segment);
                              setDraftLink(notif.deepLink);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                            title="Load into Live Lockscreen Preview"
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

        {/* Live Lockscreen Phone Preview (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Live Mobile Lockscreen Preview
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                iOS & Android
              </span>
            </div>

            {/* Mobile Lockscreen Simulation */}
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800 p-4 text-white shadow-lg space-y-3 font-sans">
              {/* Status bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>9:41 AM</span>
                <span>LTE 100%</span>
              </div>

              {/* Notification card on lockscreen */}
              <div className="rounded-xl bg-slate-800/80 backdrop-blur-md p-3.5 border border-slate-700/80 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-md bg-accent flex items-center justify-center text-white text-[10px] font-bold">
                      A
                    </div>
                    <span className="text-xs font-semibold tracking-tight text-white/90">
                      ApexMart Shopping
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">now</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">
                    {draftTitle || "Notification Title"}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    {draftMessage || "Notification message content..."}
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-indigo-300 font-medium border-t border-slate-700/60">
                  <span>Opens: {draftLink || "/"}</span>
                  <span className="underline">View Offer</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-slate-400">
                Audience: <strong className="text-white">{draftSegment}</strong>
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
              <span>
                Clicking "Preview" on any log row loads its exact content into this lockscreen simulator.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Compose Notification Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleSendNotification}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Compose Push Notification
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
                Notification Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Flash 40% Off Active Now!"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Body Message Text *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Enter alert text that will appear on mobile lockscreens..."
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Emojis are supported. Keep within 120 characters for optimal visibility without truncation.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Target Audience Segment
                </label>
                <Select value={draftSegment} onValueChange={setDraftSegment}>
                  <SelectTrigger className="w-full text-xs bg-white border-slate-300">
                    <SelectValue placeholder="Target Audience Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Registered Shoppers">All Registered Shoppers</SelectItem>
                    <SelectItem value="Cart Abandoners (24h)">Cart Abandoners (24h)</SelectItem>
                    <SelectItem value="Wholesale Buyers Network">Wholesale Buyers Network</SelectItem>
                    <SelectItem value="VIP Tier Customers">VIP Tier Customers</SelectItem>
                    <SelectItem value="Inactive 30+ Days">Inactive 30+ Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Deep Link URL
                </label>
                <input
                  type="text"
                  placeholder="/category/fashion"
                  value={draftLink}
                  onChange={(e) => setDraftLink(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>
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
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"
              >
                <Send className="h-4 w-4" />
                Dispatch Alert Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
