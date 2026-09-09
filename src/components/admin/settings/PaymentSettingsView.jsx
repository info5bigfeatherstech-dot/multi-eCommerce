import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  updatePaymentGateway,
  updateCodSettings,
} from "../../../store/slices/adminSettingsSlice";
import {
  CreditCard,
  Save,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Edit2,
  Lock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Banknote,
  X,
} from "lucide-react";
import { toast } from "sonner";

const PaymentSettingsView = () => {
  const dispatch = useAppDispatch();
  const payments = useAppSelector((state) => state.adminSettings?.payments || []);
  const cod = useAppSelector((state) => state.adminSettings?.cod || {});

  const [codForm, setCodForm] = useState({ ...cod });

  // Modal State for Editing Gateway Credentials
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [showSecret, setShowSecret] = useState(false);

  const handleOpenEdit = (gateway) => {
    setSelectedGateway({ ...gateway });
    setShowSecret(false);
    setEditModalOpen(true);
  };

  const handleSaveGateway = (e) => {
    e.preventDefault();
    if (!selectedGateway) return;

    dispatch(
      updatePaymentGateway({
        gatewayId: selectedGateway.id,
        config: {
          status: selectedGateway.status,
          testMode: selectedGateway.testMode,
          keyId: selectedGateway.keyId,
          keySecret: selectedGateway.keySecret,
          webhookSecret: selectedGateway.webhookSecret,
        },
      })
    );
    toast.success(`Configuration for ${selectedGateway.name} updated!`);
    setEditModalOpen(false);
    setSelectedGateway(null);
  };

  const handleToggleGatewayStatus = (gateway) => {
    const nextStatus = gateway.status === "Active" ? "Inactive" : "Active";
    dispatch(
      updatePaymentGateway({
        gatewayId: gateway.id,
        config: { status: nextStatus },
      })
    );
    toast.success(`${gateway.name} marked as ${nextStatus}`);
  };

  const handleSaveCod = (e) => {
    e.preventDefault();
    dispatch(updateCodSettings(codForm));
    toast.success("Cash on Delivery (COD) settings saved!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Payment Gateways & Methods
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Payment gateways and payment configuration across digital payments and Cash on Delivery.
          </p>
        </div>
      </div>

      {/* Section 1: Digital Payment Gateways */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            Online Payment Gateways & Aggregators
          </h2>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            {payments.filter((p) => p.status === "Active").length} Active Gateways
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {payments.map((gateway) => (
            <div
              key={gateway.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {gateway.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {gateway.description}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                      gateway.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {gateway.status === "Active" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {gateway.status}
                  </span>
                </div>

                {/* Credentials Snippet */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-sans text-[11px] text-slate-400">Environment:</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        gateway.testMode
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {gateway.testMode ? "Sandbox Test" : "Live Production"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 truncate">
                    <span className="font-sans text-[11px] text-slate-400">Key ID:</span>
                    <span className="text-[11px] truncate max-w-[180px]">{gateway.keyId}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleGatewayStatus(gateway)}
                  className={`text-[11px] font-semibold transition-colors ${
                    gateway.status === "Active"
                      ? "text-rose-600 hover:text-rose-800"
                      : "text-emerald-600 hover:text-emerald-800"
                  }`}
                >
                  {gateway.status === "Active" ? "Deactivate Gateway" : "Activate Gateway"}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(gateway)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  Configure Keys
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Cash on Delivery (COD) Settings */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-amber-50 text-amber-600">
              <Banknote className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Cash on Delivery (COD) Rules
              </h2>
              <p className="text-xs text-slate-500">
                Manage order limits, convenience fees, and automated RTO fraud filters.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
            <span>COD Active:</span>
            <input
              type="checkbox"
              checked={!!codForm.enabled}
              onChange={(e) =>
                setCodForm((prev) => ({ ...prev, enabled: e.target.checked }))
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>

        <form onSubmit={handleSaveCod} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum COD Order Value (₹)
              </label>
              <input
                type="number"
                value={codForm.minOrderValue || 0}
                onChange={(e) =>
                  setCodForm((prev) => ({
                    ...prev,
                    minOrderValue: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maximum COD Order Value (₹)
              </label>
              <input
                type="number"
                value={codForm.maxOrderValue || 0}
                onChange={(e) =>
                  setCodForm((prev) => ({
                    ...prev,
                    maxOrderValue: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                COD Convenience Fee (₹)
              </label>
              <input
                type="number"
                value={codForm.convenienceFee || 0}
                onChange={(e) =>
                  setCodForm((prev) => ({
                    ...prev,
                    convenienceFee: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  Require Mobile OTP Verification for COD Orders
                </div>
                <div className="text-[11px] text-slate-500">
                  Sends an instant 4-digit SMS OTP prior to order confirmation to eliminate fake numbers.
                </div>
              </div>
              <input
                type="checkbox"
                checked={!!codForm.requireOtpVerification}
                onChange={(e) =>
                  setCodForm((prev) => ({
                    ...prev,
                    requireOtpVerification: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  Restrict COD for Customers with Past RTO History
                </div>
                <div className="text-[11px] text-slate-500">
                  Automatically hides Cash on Delivery if customer has &gt;1 previous delivery failure.
                </div>
              </div>
              <input
                type="checkbox"
                checked={!!codForm.restrictHighRtoCustomers}
                onChange={(e) =>
                  setCodForm((prev) => ({
                    ...prev,
                    restrictHighRtoCustomers: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save COD Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Gateway Key Configuration Modal */}
      {editModalOpen && selectedGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                  <Lock className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Configure {selectedGateway.name}
                </h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGateway} className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Sandbox / Test Mode
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Process simulated dummy transactions without actual card charges.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedGateway.testMode}
                  onChange={(e) =>
                    setSelectedGateway({
                      ...selectedGateway,
                      testMode: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Public Key ID / App ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={selectedGateway.keyId || ""}
                  onChange={(e) =>
                    setSelectedGateway({
                      ...selectedGateway,
                      keyId: e.target.value,
                    })
                  }
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Secret Key / Salt <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                  >
                    {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showSecret ? "Hide Secret" : "Show Secret"}
                  </button>
                </div>
                <input
                  type={showSecret ? "text" : "password"}
                  value={selectedGateway.keySecret || ""}
                  onChange={(e) =>
                    setSelectedGateway({
                      ...selectedGateway,
                      keySecret: e.target.value,
                    })
                  }
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Webhook Signing Secret
                </label>
                <input
                  type="text"
                  value={selectedGateway.webhookSecret || ""}
                  onChange={(e) =>
                    setSelectedGateway({
                      ...selectedGateway,
                      webhookSecret: e.target.value,
                    })
                  }
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Save API Keys
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSettingsView;
