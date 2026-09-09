import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateGeneralSettings } from "../../../store/slices/adminSettingsSlice";
import {
  Store,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  Save,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const GeneralSettingsView = () => {
  const dispatch = useAppDispatch();
  const general = useAppSelector((state) => state.adminSettings?.general || {});

  const [formData, setFormData] = useState({ ...general });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateGeneralSettings(formData));
    toast.success("General store settings saved successfully!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Store className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              General Store Settings
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Basic website business settings, contact info, store branding, and localization.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Maintenance Mode Alert if enabled */}
      {formData.maintenanceMode && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-800 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <strong className="font-bold">Maintenance Mode is Currently Active:</strong>
              <span className="ml-1 text-amber-700">
                Public storefront is showing a maintenance banner to visitors. Admins can still preview products.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleChange("maintenanceMode", false)}
            className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-amber-300 rounded text-amber-800 hover:bg-amber-100"
          >
            Deactivate
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Store & Brand Profile */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <Building className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              1. Brand & Business Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Public Store Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.storeName || ""}
                onChange={(e) => handleChange("storeName", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Legal Entity Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.legalEntity || ""}
                onChange={(e) => handleChange("legalEntity", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Store Tagline & Pitch
              </label>
              <input
                type="text"
                value={formData.tagline || ""}
                onChange={(e) => handleChange("tagline", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Store Brand Logo URL
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  value={formData.logoUrl || ""}
                  onChange={(e) => handleChange("logoUrl", e.target.value)}
                  className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                />
                {formData.logoUrl && (
                  <img
                    src={formData.logoUrl}
                    alt="Logo Preview"
                    className="w-9 h-9 rounded object-cover border border-slate-200"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Official Contact Information */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <Mail className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              2. Official Contact Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Support Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={formData.supportEmail || ""}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Toll-Free Helpline / Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.supportPhone || ""}
                  onChange={(e) => handleChange("supportPhone", e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Registered Business Address */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-md bg-purple-50 text-purple-600">
              <MapPin className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              3. Registered Headquarters & Invoicing Address
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Street Address / Building
              </label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.state || ""}
                onChange={(e) => handleChange("state", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PIN Code
              </label>
              <input
                type="text"
                value={formData.pincode || ""}
                onChange={(e) => handleChange("pincode", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Localization & Maintenance Mode */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-md bg-blue-50 text-blue-600">
              <Globe className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              4. Regional Formats & Store Availability
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Store Currency
              </label>
              <select
                value={formData.currency || "INR (₹)"}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Storefront Timezone
              </label>
              <select
                value={formData.timezone || "Asia/Kolkata"}
                onChange={(e) => handleChange("timezone", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none"
              >
                <option value="Asia/Kolkata (IST, UTC+5:30)">
                  Asia/Kolkata (IST, UTC+5:30)
                </option>
                <option value="UTC">UTC Universal Time</option>
                <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date Formatting
              </label>
              <select
                value={formData.dateFormat || "DD/MM/YYYY"}
                onChange={(e) => handleChange("dateFormat", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none font-mono"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Store Maintenance Mode
              </div>
              <div className="text-[11px] text-slate-500">
                Temporarily take public customer storefront offline for catalog upgrades or server maintenance.
              </div>
            </div>
            <input
              type="checkbox"
              checked={!!formData.maintenanceMode}
              onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Save General Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettingsView;
