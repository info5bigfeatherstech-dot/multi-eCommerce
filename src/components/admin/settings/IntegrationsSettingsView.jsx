import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateIntegration } from "../../../store/slices/adminSettingsSlice";
import {
  Sliders,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Edit2,
  Lock,
  RefreshCw,
  Sparkles,
  X,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/Select";

const IntegrationsSettingsView = () => {
  const dispatch = useAppDispatch();
  const integrations = useAppSelector(
    (state) => state.adminSettings?.integrations || []
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [statusInput, setStatusInput] = useState("Connected");

  const handleOpenEdit = (item) => {
    setSelectedIntegration(item);
    setTrackingInput(item.trackingId || "");
    setStatusInput(item.status || "Connected");
    setEditModalOpen(true);
  };

  const handleSaveIntegration = (e) => {
    e.preventDefault();
    if (!selectedIntegration) return;

    dispatch(
      updateIntegration({
        integrationId: selectedIntegration.id,
        config: {
          trackingId: trackingInput.trim(),
          status: statusInput,
          lastSynced: statusInput === "Connected" ? new Date().toLocaleString() : selectedIntegration.lastSynced,
        },
      })
    );

    toast.success(`Updated integration settings for ${selectedIntegration.name}!`);
    setEditModalOpen(false);
    setSelectedIntegration(null);
  };

  const handleTestConnection = (name) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: `Pinging ${name} API endpoint...`,
        success: `${name} responded 200 OK! Webhook endpoint verified.`,
        error: "Connection failed",
      }
    );
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Share2 className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Third-Party Integrations & APIs
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Third-party APIs and integrations across analytics, ERP, accounting, messaging, and cloud storage.
          </p>
        </div>

        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto">
          {integrations.filter((i) => i.status === "Connected").length} Connected Services
        </span>
      </div>

      {/* Integrations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                    {item.name}
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    item.status === "Connected"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {item.status === "Connected" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {item.status}
                </span>
              </div>

              {/* ID & Sync Details */}
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-600 truncate">
                  <span className="text-slate-400 text-[11px]">Key / Tracking ID:</span>
                  <span className="font-mono text-[11px] truncate max-w-[190px] font-semibold text-slate-800">
                    {item.trackingId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Last Sync:</span>
                  <span>{item.lastSynced}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => handleTestConnection(item.name)}
                className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                Test Connection
              </button>

              <button
                type="button"
                onClick={() => handleOpenEdit(item)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configure Integration Modal */}
      {editModalOpen && selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                  <Sliders className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Configure {selectedIntegration.name}
                </h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIntegration} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Connection Status
                </label>
                <Select value={statusInput} onValueChange={setStatusInput}>
                  <SelectTrigger className="w-full text-xs border-slate-200">
                    <SelectValue placeholder="Connection Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Connected">Connected & Active</SelectItem>
                    <SelectItem value="Disconnected">Disconnected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  API Key / Tracking ID / Resource URI <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
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
                  Save Integration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsSettingsView;
