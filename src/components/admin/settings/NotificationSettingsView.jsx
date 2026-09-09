import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateNotificationSettings } from "../../../store/slices/adminSettingsSlice";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  CheckCircle2,
  Send,
  Eye,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/Select";

const EVENT_LABELS = {
  orderPlaced: "Order Confirmed & Payment Received",
  orderDispatched: "Order Dispatched with Courier AWB Tracking",
  outForDelivery: "Out for Delivery (Morning Dispatch Alert)",
  orderDelivered: "Order Successfully Delivered Confirmation",
  refundApproved: "Return / Refund Processed into Bank Account",
  abandonedCartRecovery: "Abandoned Checkout Recovery Nudge (2 hrs)",
};

const NotificationSettingsView = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.adminSettings?.notifications || {}
  );

  const [formData, setFormData] = useState({ ...notifications });
  const [activePreviewTab, setActivePreviewTab] = useState("whatsapp"); // 'whatsapp' | 'sms' | 'email'

  const handleProviderChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTriggerToggle = (eventKey, channelKey) => {
    setFormData((prev) => ({
      ...prev,
      triggers: {
        ...prev.triggers,
        [eventKey]: {
          ...prev.triggers?.[eventKey],
          [channelKey]: !prev.triggers?.[eventKey]?.[channelKey],
        },
      },
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateNotificationSettings(formData));
    toast.success("Notification channels and triggers saved!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Bell className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Notification Channels & Preferences
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Notification channels and preferences across Email, SMS, WhatsApp, and Web Push.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Provider Credentials */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <Mail className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              1. Communication Gateway Providers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transactional Email Provider
              </label>
              <Select
                value={formData.emailProvider || "Amazon SES"}
                onValueChange={(val) => handleProviderChange("emailProvider", val)}
              >
                <SelectTrigger className="w-full text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Email Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amazon SES">Amazon Simple Email Service (SES)</SelectItem>
                  <SelectItem value="SendGrid">Twilio SendGrid API</SelectItem>
                  <SelectItem value="Postmark">Postmark App</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="email"
                value={formData.emailSender || ""}
                onChange={(e) => handleProviderChange("emailSender", e.target.value)}
                placeholder="Sender Email (e.g. orders@apexstore.in)"
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg mt-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SMS Provider
              </label>
              <Select
                value={formData.smsProvider || "Twilio / Fast2SMS"}
                onValueChange={(val) => handleProviderChange("smsProvider", val)}
              >
                <SelectTrigger className="w-full text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="SMS Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Twilio / Fast2SMS">Twilio / Fast2SMS DLT</SelectItem>
                  <SelectItem value="Gupshup SMS">Gupshup Enterprise</SelectItem>
                  <SelectItem value="Karix">Karix Telecom</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="text"
                value={formData.smsSenderId || ""}
                onChange={(e) => handleProviderChange("smsSenderId", e.target.value)}
                placeholder="6-Char DLT Sender ID (e.g. APEXIN)"
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg mt-2 focus:outline-none uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Business API
              </label>
              <Select
                value={formData.whatsappProvider || "WhatsApp Cloud API"}
                onValueChange={(val) => handleProviderChange("whatsappProvider", val)}
              >
                <SelectTrigger className="w-full text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="WhatsApp Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp Cloud API">Meta WhatsApp Cloud API</SelectItem>
                  <SelectItem value="Interakt">Interakt by Jio Haptik</SelectItem>
                  <SelectItem value="Wati">Wati.io API</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="text"
                value={formData.whatsappBusinessNumber || ""}
                onChange={(e) => handleProviderChange("whatsappBusinessNumber", e.target.value)}
                placeholder="Verified Phone (+91 98765 00000)"
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg mt-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Event Trigger Matrix Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                2. Automated Customer Event Triggers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle which communication channels fire on specific order and store events.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-2/5">Store Event</th>
                  <th className="py-3 px-3 text-center">Email</th>
                  <th className="py-3 px-3 text-center">SMS</th>
                  <th className="py-3 px-3 text-center">WhatsApp</th>
                  <th className="py-3 px-3 text-center">Web Push</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                {Object.entries(formData.triggers || {}).map(([eventKey, channels]) => (
                  <tr key={eventKey} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {EVENT_LABELS[eventKey] || eventKey}
                    </td>
                    {["email", "sms", "whatsapp", "push"].map((ch) => (
                      <td key={ch} className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={!!channels[ch]}
                          onChange={() => handleTriggerToggle(eventKey, ch)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Live Template Preview */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                3. Sample Customer Message Preview
              </h2>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActivePreviewTab("whatsapp")}
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  activePreviewTab === "whatsapp"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab("sms")}
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  activePreviewTab === "sms"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                SMS
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab("email")}
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  activePreviewTab === "email"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Email
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-lg mx-auto font-sans text-xs">
            {activePreviewTab === "whatsapp" && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Apex Store Order Confirmed (ORD-9481)
                </div>
                <p className="leading-relaxed">
                  Hi <strong>Ananya</strong>, thank you for your purchase of <em>Pure Handloom Chanderi Silk Saree</em>! Your order is being hand-packed at our warehouse.
                </p>
                <div className="p-2 bg-white/80 rounded border border-emerald-200 font-mono text-[11px]">
                  Estimated Delivery: 2-3 business days
                </div>
              </div>
            )}

            {activePreviewTab === "sms" && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900 font-mono text-xs leading-relaxed">
                [APEXIN]: Your order #ORD-9481 has been confirmed for ₹4,899. Track shipment anytime at https://apexstore.in/track/ORD-9481.
              </div>
            )}

            {activePreviewTab === "email" && (
              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2 text-slate-800">
                <div className="text-xs font-bold text-slate-900">
                  Subject: Your Apex Store Order #ORD-9481 Confirmation
                </div>
                <p className="text-[11px] text-slate-500">
                  From: orders@apexstore.in | To: customer@email.com
                </p>
                <div className="border-t border-slate-100 pt-2 text-xs leading-relaxed">
                  Dear Customer, thank you for shopping with Apex Store. We have received your payment and generated order invoice #INV-9481. You will receive live tracking updates once the courier partner scans the shipment.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Notification Triggers
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettingsView;
