import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  updateSecuritySettings,
  generateApiToken,
  revokeApiToken,
} from "../../../store/slices/adminSettingsSlice";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  AlertTriangle,
  Globe,
  Clock,
  Key,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const SecuritySettingsView = () => {
  const dispatch = useAppDispatch();
  const security = useAppSelector((state) => state.adminSettings?.security || {});

  const [formData, setFormData] = useState({ ...security });
  const [newIpInput, setNewIpInput] = useState("");

  // Token Modal
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddIp = (e) => {
    e.preventDefault();
    if (!newIpInput.trim()) return;

    const updatedIps = [...(formData.whitelistedIps || []), newIpInput.trim()];
    setFormData((prev) => ({ ...prev, whitelistedIps: updatedIps }));
    setNewIpInput("");
    toast.success(`IP address ${newIpInput.trim()} added to whitelist.`);
  };

  const handleRemoveIp = (ipToRemove) => {
    const updatedIps = (formData.whitelistedIps || []).filter((ip) => ip !== ipToRemove);
    setFormData((prev) => ({ ...prev, whitelistedIps: updatedIps }));
    toast.info(`Removed ${ipToRemove} from whitelist.`);
  };

  const handleCreateToken = (e) => {
    e.preventDefault();
    if (!newTokenName.trim()) return;

    dispatch(generateApiToken({ name: newTokenName.trim() }));
    toast.success(`New API token "${newTokenName}" generated!`);
    setTokenModalOpen(false);
    setNewTokenName("");
  };

  const handleRevokeToken = (id, name) => {
    if (window.confirm(`Revoke API token "${name}"? Existing integrations using it will fail.`)) {
      dispatch(revokeApiToken(id));
      toast.error(`Revoked API token "${name}".`);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateSecuritySettings(formData));
    toast.success("Security & access control policies saved!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Security & Access Controls
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Login, access and security controls, authentication rules, session management, and developer API tokens.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Security Policies
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Authentication & Password Policies */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <Lock className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              1. Authentication & Session Policies
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Two-Factor Authentication (2FA)
              </label>
              <select
                value={formData.twoFactorEnforcement || "allAdmins"}
                onChange={(e) => handleChange("twoFactorEnforcement", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-800 font-medium"
              >
                <option value="allAdmins">Enforce for All Admin Users (Recommended)</option>
                <option value="superAdminOnly">Enforce for Super Admins Only</option>
                <option value="optional">Optional per User</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password Rotation Expiry
              </label>
              <select
                value={formData.passwordExpiryDays || 90}
                onChange={(e) => handleChange("passwordExpiryDays", parseInt(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-800 font-medium"
              >
                <option value={90}>Every 90 Days (PCI-DSS Standard)</option>
                <option value={180}>Every 180 Days</option>
                <option value={0}>Never Expire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Idle Session Timeout
              </label>
              <select
                value={formData.sessionTimeoutMinutes || 60}
                onChange={(e) => handleChange("sessionTimeoutMinutes", parseInt(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-800 font-medium"
              >
                <option value={30}>30 Minutes</option>
                <option value={60}>60 Minutes (1 Hour)</option>
                <option value={240}>4 Hours</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brute Force Max Failed Login Lockout
              </label>
              <input
                type="number"
                value={formData.maxFailedLoginAttempts || 5}
                onChange={(e) => handleChange("maxFailedLoginAttempts", parseInt(e.target.value) || 5)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Number of invalid password attempts before temporary IP ban.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lockout Duration (Minutes)
              </label>
              <input
                type="number"
                value={formData.lockoutDurationMinutes || 30}
                onChange={(e) => handleChange("lockoutDurationMinutes", parseInt(e.target.value) || 30)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Minutes account remains frozen before permitting another sign-in attempt.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: IP Whitelisting */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
                <Globe className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  2. Office & VPN IP Whitelisting
                </h2>
                <p className="text-xs text-slate-500">
                  Restrict portal accessibility strictly to designated corporate or VPN IP addresses.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <span>Enable Restriction:</span>
              <input
                type="checkbox"
                checked={!!formData.ipWhitelistingEnabled}
                onChange={(e) => handleChange("ipWhitelistingEnabled", e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newIpInput}
                onChange={(e) => setNewIpInput(e.target.value)}
                placeholder="e.g. 157.48.12.89 or 192.168.1.0/24"
                className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleAddIp}
                className="px-4 py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add IP
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {(formData.whitelistedIps || []).map((ip) => (
                <span
                  key={ip}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono text-slate-700 border border-slate-200"
                >
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>{ip}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIp(ip)}
                    className="text-slate-400 hover:text-rose-600 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Developer Personal Access Tokens */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                <Key className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  3. Developer API Tokens & Personal Access Keys
                </h2>
                <p className="text-xs text-slate-500">
                  Manage bearer tokens for mobile apps, barcode scanners, and warehouse IoT terminals.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTokenModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Generate Token
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Token Name</th>
                  <th className="py-3 px-4">Bearer Token</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Expiry</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                {(security.apiTokens || []).map((token) => (
                  <tr key={token.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {token.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {token.tokenMasked}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{token.createdDate}</td>
                    <td className="py-3 px-4 text-slate-500">{token.expiresDate}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRevokeToken(token.id, token.name)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Security Policies
          </button>
        </div>
      </form>

      {/* Generate API Token Modal */}
      {tokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                  <Key className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Generate Personal Access Token
                </h3>
              </div>
              <button
                onClick={() => setTokenModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateToken} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Token Purpose / Client Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                  placeholder="e.g. ERP Invoicing Script, Warehouse Scanner"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTokenModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettingsView;
