import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateTaxGstSettings } from "../../../store/slices/adminSettingsSlice";
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  Building,
  Percent,
  Plus,
  Trash2,
  Info,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const TaxGstSettingsView = () => {
  const dispatch = useAppDispatch();
  const taxGst = useAppSelector((state) => state.adminSettings?.taxGst || {});

  const [formData, setFormData] = useState({ ...taxGst });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSlabRateChange = (index, newRate) => {
    const updatedSlabs = [...(formData.hsnSlabs || [])];
    updatedSlabs[index] = {
      ...updatedSlabs[index],
      gstRate: parseFloat(newRate) || 0,
    };
    setFormData((prev) => ({ ...prev, hsnSlabs: updatedSlabs }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateTaxGstSettings(formData));
    toast.success("Tax & GST configuration updated successfully!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Tax & GST Configuration
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Tax and GST configuration, HSN code tax slabs, and electronic invoicing rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Tax Settings
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: GST Identification & Registration */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <Building className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              1. Business GST & PAN Credentials
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Goods and Services Tax Identification Number (GSTIN) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.gstin || ""}
                onChange={(e) => handleChange("gstin", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-slate-900 uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Permanent Account Number (PAN) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.panNumber || ""}
                onChange={(e) => handleChange("panNumber", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-slate-900 uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Legal Trade Name for Invoicing
              </label>
              <input
                type="text"
                value={formData.legalTradeName || ""}
                onChange={(e) => handleChange("legalTradeName", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State GST Jurisdiction
              </label>
              <input
                type="text"
                value={formData.stateJurisdiction || ""}
                onChange={(e) => handleChange("stateJurisdiction", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Calculation Model & Invoicing */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <Percent className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              2. Catalog Pricing Model & E-Way Bill
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Store Catalog Tax Calculation Model
              </label>
              <select
                value={formData.pricingModel || "inclusive"}
                onChange={(e) => handleChange("pricingModel", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none"
              >
                <option value="inclusive">
                  Prices are Inclusive of GST (Indian Retail Standard)
                </option>
                <option value="exclusive">
                  Prices are Exclusive of GST (Calculated at Checkout)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-Way Bill Mandatory Order Limit (₹)
              </label>
              <input
                type="number"
                value={formData.eWayBillThreshold || 50000}
                onChange={(e) =>
                  handleChange("eWayBillThreshold", parseInt(e.target.value) || 0)
                }
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  Automatic Inter-state vs. Intra-state Tax Determination
                </div>
                <div className="text-[11px] text-slate-500">
                  Applies IGST (Integrated Tax) for out-of-state deliveries; splits 50% CGST + 50% SGST within home state automatically.
                </div>
              </div>
              <input
                type="checkbox"
                checked={!!formData.autoCalculateInterstateIgst}
                onChange={(e) =>
                  handleChange("autoCalculateInterstateIgst", e.target.checked)
                }
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Section 3: HSN Code Tax Slabs Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                3. Standard HSN Category Tax Slabs
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign rates to product categories for auto-computing tax on invoices.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">HSN Code</th>
                  <th className="py-3 px-4">Category Description</th>
                  <th className="py-3 px-4 w-32">GST Rate (%)</th>
                  <th className="py-3 px-4 w-32">Cess (%)</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                {(formData.hsnSlabs || []).map((slab, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {slab.hsnCode}
                    </td>
                    <td className="py-3 px-4">{slab.description}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={slab.gstRate}
                          onChange={(e) => handleSlabRateChange(idx, e.target.value)}
                          className="w-16 p-1 text-xs border border-slate-200 rounded font-semibold text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <span className="text-slate-400 font-semibold">%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {slab.cess}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
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
            Save Tax Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaxGstSettingsView;
