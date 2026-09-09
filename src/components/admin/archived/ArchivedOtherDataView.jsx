import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteOtherItem, updateRetentionPolicies } from "@/store/slices/adminArchivedSlice";
import {
  Database,
  Tag,
  Shield,
  Truck,
  Settings2,
  Trash2,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Archive,
  Clock,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

export default function ArchivedOtherDataView() {
  const dispatch = useAppDispatch();
  const otherData = useAppSelector((state) => state.adminArchived?.otherData || {
    coupons: [],
    auditLogs: [],
    vendorLogs: [],
    retentionPolicies: {
      autoArchiveOrdersAfterDays: 180,
      autoArchiveDiscontinuedProducts: true,
      autoArchiveDormantCustomersDays: 365,
      purgeAuditLogsAfterDays: 730,
      coldStorageBackupEnabled: true,
    },
  });

  const [activeTab, setActiveTab] = useState("coupons"); // 'coupons' | 'auditLogs' | 'vendorLogs' | 'policies'
  const [policies, setPolicies] = useState(otherData.retentionPolicies);

  const handleDelete = (group, id, name) => {
    dispatch(deleteOtherItem({ group, id }));
    toast.error(`Archived entry "${name}" deleted.`);
  };

  const handleSavePolicies = (e) => {
    e.preventDefault();
    dispatch(updateRetentionPolicies(policies));
    toast.success("Automated data retention policies updated successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              Auxiliary Records Vault
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-inter">System & Campaign Data</span>
          </div>
          <h1 className="text-2xl font-poppins font-bold text-slate-900 mt-1.5">
            Other Archived Data Manage
          </h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Manage expired discount vouchers, legacy vendor SLA records, compliance audit trails, and automated retention policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success("Historical auxiliary archive report compiled.")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Vault Summary
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("coupons")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "coupons"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Archived Coupons ({otherData.coupons?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("auditLogs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "auditLogs"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Audit Logs ({otherData.auditLogs?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("vendorLogs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "vendorLogs"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Vendor SLAs ({otherData.vendorLogs?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("policies")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "policies"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Retention Policies</span>
        </button>
      </div>

      {/* Tab 1: Archived Coupons */}
      {activeTab === "coupons" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-poppins font-bold text-slate-900 text-sm">Expired & Retired Promotion Codes</h3>
              <p className="text-xs text-slate-400 font-inter">Historical vouchers archived after campaign conclusion</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Discount Value</th>
                  <th className="p-4">Total Redemptions</th>
                  <th className="p-4">Validity End</th>
                  <th className="p-4">Archived Reason</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-inter">
                {(otherData.coupons || []).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div>
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          {c.code}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">ID: {c.id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800">{c.value}</span>
                      <p className="text-xs text-slate-400">{c.type}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900">{c.totalRedemptions.toLocaleString()}</span>
                      <p className="text-xs text-slate-400">times redeemed</p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-slate-700 font-semibold">{c.expiredDate}</p>
                      <p className="text-[11px] text-slate-400">Archived: {c.archivedDate}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-medium">
                        {c.reason}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete("coupons", c.id, c.code)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete voucher from archive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === "auditLogs" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-poppins font-bold text-slate-900 text-sm">Archived Security & System Event Logs</h3>
              <p className="text-xs text-slate-400 font-inter">Historical administrator and system actions preserved for compliance</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                  <th className="p-4">Event Type</th>
                  <th className="p-4">Module</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Event Details</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-inter">
                {(otherData.auditLogs || []).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 block">{log.eventType}</span>
                      <span className="text-[11px] font-mono text-slate-400">{log.id}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                        {log.module}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-medium text-slate-700">{log.actor}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-800 font-semibold">{log.timestamp}</span>
                      <p className="text-[11px] text-slate-400">Archived: {log.archivedDate}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-slate-600 max-w-sm">{log.details}</p>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete("auditLogs", log.id, log.eventType)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete log permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Vendor Logs */}
      {activeTab === "vendorLogs" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-poppins font-bold text-slate-900 text-sm">Archived Vendor & Courier SLAs</h3>
              <p className="text-xs text-slate-400 font-inter">Expired carrier contracts, SLA agreements, and fulfillment partner terms</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-poppins">
                  <th className="p-4">Vendor Name</th>
                  <th className="p-4">Agreement Code</th>
                  <th className="p-4">Validity Duration</th>
                  <th className="p-4">Archived Date</th>
                  <th className="p-4">Archive Justification</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-inter">
                {(otherData.vendorLogs || []).map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 block">{v.vendor}</span>
                      <span className="text-[11px] font-mono text-slate-400">{v.id}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {v.agreementCode}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-700">{v.validityPeriod}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-700">{v.archivedDate}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-600">{v.reason}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete("vendorLogs", v.id, v.vendor)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete vendor record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Retention Policies */}
      {activeTab === "policies" && (
        <form onSubmit={handleSavePolicies} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-poppins font-bold text-slate-900 text-base">
              Automated Data Lifecycle & Retention Policies
            </h3>
            <p className="text-xs text-slate-500 font-inter mt-1">
              Configure automatic archival thresholds and cold storage retention rules for regulatory compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-inter">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Auto-Archive Fulfilled Orders (Days)
              </label>
              <input
                type="number"
                value={policies.autoArchiveOrdersAfterDays}
                onChange={(e) =>
                  setPolicies({ ...policies, autoArchiveOrdersAfterDays: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Orders older than this number of days will be moved into the cold storage ledger automatically.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Auto-Archive Dormant Customers (Days)
              </label>
              <input
                type="number"
                value={policies.autoArchiveDormantCustomersDays}
                onChange={(e) =>
                  setPolicies({ ...policies, autoArchiveDormantCustomersDays: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Buyers with zero logins or purchases within this timeframe will be moved to the dormant archive.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Purge Audit Logs Retention Threshold (Days)
              </label>
              <input
                type="number"
                value={policies.purgeAuditLogsAfterDays}
                onChange={(e) =>
                  setPolicies({ ...policies, purgeAuditLogsAfterDays: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Audit and security event logs older than this limit will be permanently deleted.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Cold Storage Cloud Replication</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Synchronize archived records with encrypted cold storage bucket (AWS S3 Glacier / GCS Archive).
                </p>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <input
                  type="checkbox"
                  id="coldStorageCheck"
                  checked={policies.coldStorageBackupEnabled}
                  onChange={(e) =>
                    setPolicies({ ...policies, coldStorageBackupEnabled: e.target.checked })
                  }
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer w-4 h-4"
                />
                <label htmlFor="coldStorageCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Enable Encrypted Cold Storage Vault
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Retention Policies
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
