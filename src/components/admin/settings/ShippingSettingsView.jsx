import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  updateShippingSettings,
  updateCourierPartner,
} from "../../../store/slices/adminSettingsSlice";
import {
  Truck,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  FileText,
  Sliders,
  DollarSign,
  Package,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/Select";

const ShippingSettingsView = () => {
  const dispatch = useAppDispatch();
  const shipping = useAppSelector((state) => state.adminSettings?.shipping || {});

  const [formData, setFormData] = useState({ ...shipping });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleCourier = (courier) => {
    const nextStatus = courier.status === "Active" ? "Inactive" : "Active";
    dispatch(
      updateCourierPartner({
        courierId: courier.id,
        config: { status: nextStatus },
      })
    );

    setFormData((prev) => ({
      ...prev,
      courierPartners: prev.courierPartners.map((c) =>
        c.id === courier.id ? { ...c, status: nextStatus } : c
      ),
    }));

    toast.success(`${courier.name} courier partner marked as ${nextStatus}`);
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateShippingSettings(formData));
    toast.success("Shipping and courier configuration saved!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Truck className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Shipping & Courier Settings
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Shipping, courier, shipping label and delivery settings across fulfillment partners.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Configuration
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Rates & Thresholds */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              1. Customer Shipping Rates & Free Delivery
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Free Shipping Cart Threshold (₹)
              </label>
              <input
                type="number"
                value={formData.freeShippingThreshold || 0}
                onChange={(e) =>
                  handleChange("freeShippingThreshold", parseInt(e.target.value) || 0)
                }
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-900"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Orders above this subtotal qualify for free delivery.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard Surface Rate (₹)
              </label>
              <input
                type="number"
                value={formData.standardShippingFee || 0}
                onChange={(e) =>
                  handleChange("standardShippingFee", parseInt(e.target.value) || 0)
                }
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-900"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Applied to orders below the free shipping threshold.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Express Air Priority Rate (₹)
              </label>
              <input
                type="number"
                value={formData.expressShippingFee || 0}
                onChange={(e) =>
                  handleChange("expressShippingFee", parseInt(e.target.value) || 0)
                }
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-900"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Optional customer add-on for next-flight express shipping.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Courier Partner Routing */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
                <Truck className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                2. Integrated 3PL Courier Partners
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Ranked in priority order for automated AWB generation
            </span>
          </div>

          <div className="space-y-3">
            {(formData.courierPartners || []).map((courier, index) => (
              <div
                key={courier.id}
                className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold font-mono">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{courier.name}</span>
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                        Acc: {courier.accountNo}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Auto-manifesting active for pin-codes served
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      courier.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {courier.status === "Active" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {courier.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleCourier(courier)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded hover:bg-indigo-50"
                  >
                    {courier.status === "Active" ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Shipping Label & Packing Slip */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-md bg-purple-50 text-purple-600">
              <Printer className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              3. Automated Shipping Label & Manifest Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thermal Label Output Format
              </label>
              <Select
                value={formData.labelFormat || "4x6 Thermal"}
                onValueChange={(val) => handleChange("labelFormat", val)}
              >
                <SelectTrigger className="w-full text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Label Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4x6 Thermal">4x6 Thermal Label (Standard Roll)</SelectItem>
                  <SelectItem value="A4 2-per-page">A4 Standard (2 per page)</SelectItem>
                  <SelectItem value="A4 4-per-page">A4 Standard (4 per page)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Courier Barcode Standard
              </label>
              <Select
                value={formData.barcodeFormat || "Code 128"}
                onValueChange={(val) => handleChange("barcodeFormat", val)}
              >
                <SelectTrigger className="w-full text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Barcode Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Code 128">Code 128 (High Density 1D)</SelectItem>
                  <SelectItem value="GS1-128">GS1-128 Standard</SelectItem>
                  <SelectItem value="QR Code">2D QR Code + Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Packing Slip Customer Note
              </label>
              <input
                type="text"
                value={formData.packingSlipNote || ""}
                onChange={(e) => handleChange("packingSlipNote", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">
                Include Brand Logo on Thermal Shipping Label
              </span>
              <input
                type="checkbox"
                checked={!!formData.includeBrandLogo}
                onChange={(e) => handleChange("includeBrandLogo", e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">
                Print Return Warehouse Address for RTO Returns on Bottom of Label
              </span>
              <input
                type="checkbox"
                checked={!!formData.includeReturnAddress}
                onChange={(e) => handleChange("includeReturnAddress", e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Section 4: Delivery Timelines (SLA Buffers) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-md bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              4. Estimated Transit Days (Shown on Product Pages)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Metro Cities
              </label>
              <input
                type="text"
                value={formData.deliveryTransitMetros || "2 - 3 Days"}
                onChange={(e) => handleChange("deliveryTransitMetros", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rest of India (Tier 2/3)
              </label>
              <input
                type="text"
                value={formData.deliveryTransitRestOfIndia || "4 - 6 Days"}
                onChange={(e) => handleChange("deliveryTransitRestOfIndia", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special / Remote Zones
              </label>
              <input
                type="text"
                value={formData.deliveryTransitRemote || "7 - 9 Days"}
                onChange={(e) => handleChange("deliveryTransitRemote", e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Shipping Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingSettingsView;
