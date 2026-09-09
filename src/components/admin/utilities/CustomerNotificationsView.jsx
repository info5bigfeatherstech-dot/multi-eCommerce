import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createBroadcastNotification,
  deleteNotification,
} from "@/store/slices/adminUtilitiesSlice";
import {
  Bell,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  PlusCircle,
  Clock,
  CheckCircle2,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  Sparkles,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function CustomerNotificationsView() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.adminUtilities?.notifications || []);

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newChannel, setNewChannel] = useState("WhatsApp & SMS");
  const [newAudience, setNewAudience] = useState("All Registered Customers (21,080)");
  const [newMessage, setNewMessage] = useState("");

  const handleCreateBroadcast = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    dispatch(
      createBroadcastNotification({
        id: `NTF-${Date.now()}`,
        title: newTitle,
        channel: newChannel,
        targetAudience: newAudience,
        status: "Delivered",
        openRate: "92.0%",
        clickRate: "38.5%",
        sentDate: new Date().toISOString().replace("T", " ").substring(0, 16),
        message: newMessage,
      })
    );

    toast.success(`Broadcast campaign "${newTitle}" queued and dispatched!`);
    setIsComposeOpen(false);
    setNewTitle("");
    setNewMessage("");
  };

  const handleDelete = (id, title) => {
    dispatch(deleteNotification(id));
    toast.error(`Notification log "${title}" removed.`);
  };

  const handleTestSend = (notif) => {
    toast.success(`Test preview of "${notif.title}" sent to admin phone/email.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              Omnichannel Messaging Hub
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">Automated & Broadcast Triggers</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Customer Notifications Manage
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Dispatch promotional WhatsApp broadcasts, configure automated abandoned cart recovery SMS, and manage delivery tracking alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsComposeOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Compose Broadcast
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Open Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">87.2%</p>
          <p className="text-xs text-slate-400 mt-1">WhatsApp & SMS deliverability</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Click-Through Rate</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">44.1%</p>
          <p className="text-xs text-slate-400 mt-1">Direct link clicks to cart</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Automated Flows</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">
            {notifications.filter((n) => n.status.includes("Active")).length} Flows
          </p>
          <p className="text-xs text-slate-400 mt-1">Real-time cart & tracking triggers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Reach</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-poppins font-bold text-slate-900 mt-3">21,080</p>
          <p className="text-xs text-slate-400 mt-1">Opted-in verified contacts</p>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-poppins font-bold text-slate-900 text-sm">Campaigns & Trigger Flows</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                <th className="p-4">Campaign / Flow Title</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Target Segment</th>
                <th className="p-4">Engagement (Open / Click)</th>
                <th className="p-4">Execution Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-inter">
              {notifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 max-w-xs">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{notif.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 italic">
                        "{notif.message}"
                      </p>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                      {notif.channel}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="text-xs text-slate-700 font-medium">{notif.targetAudience}</span>
                  </td>

                  <td className="p-4">
                    <div className="text-xs space-y-0.5">
                      <p className="text-emerald-700 font-bold">{notif.openRate} open rate</p>
                      <p className="text-slate-500">{notif.clickRate} click rate</p>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="text-xs text-slate-600">{notif.sentDate}</span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        notif.status.includes("Active")
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}
                    >
                      {notif.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleTestSend(notif)}
                        title="Send Test Notification to Admin"
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(notif.id, notif.title)}
                        title="Delete Notification"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compose Broadcast Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateBroadcast}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Send className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-base">Compose Broadcast Notification</h3>
                  <p className="text-xs text-slate-400">Deliver promotional communication to customers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm font-inter">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flash Weekend Surprise Discount"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Delivery Channel</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="WhatsApp & SMS">WhatsApp & SMS</option>
                    <option value="WhatsApp Only">WhatsApp Only</option>
                    <option value="SMS Only">SMS Only</option>
                    <option value="Email Newsletter">Email Newsletter</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Target Segment</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="All Registered Customers (21,080)">All Customers (21,080)</option>
                    <option value="Diamond Elite Club (410 Members)">Diamond Elite (410)</option>
                    <option value="Recent Buyers (Last 30 Days)">Recent Buyers (3,240)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your message with emojis and promotional link..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
