import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  reattemptDelivery,
  initiateRTS,
  warehouseStockIn,
  bulkInitiateRTS,
  closeRtoCase,
} from "@/store/slices/adminRtoSlice";
import {
  RotateCcw,
  Truck,
  PackageCheck,
  Calendar,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  X,
  Building2,
  Clock,
  ShieldCheck,
  Ban,
  Send,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function RtoManagementView() {
  const dispatch = useAppDispatch();
  const rtoItems = useAppSelector((state) => state.adminRto.items);

  // Selected Action Modals
  const [reattemptModalItem, setReattemptModalItem] = useState(null);
  const [rtsModalItem, setRtsModalItem] = useState(null);
  const [stockInModalItem, setStockInModalItem] = useState(null);

  // Re-attempt Form State
  const [alternatePhone, setAlternatePhone] = useState("");
  const [alternateAddress, setAlternateAddress] = useState("");
  const [newDeliveryDate, setNewDeliveryDate] = useState("");
  const [reattemptNotes, setReattemptNotes] = useState("");

  // RTS Form State
  const [reverseCourier, setReverseCourier] = useState("Delhivery Reverse");
  const [reverseAwb, setReverseAwb] = useState("");
  const [reverseFreight, setReverseFreight] = useState(900);

  // Stock-in Form State
  const [packageCondition, setPackageCondition] = useState("Pristine");
  const [restockLocation, setRestockLocation] = useState("Rack B-14 Primary Hub");
  const [inspectedBy, setInspectedBy] = useState("Operations Lead");
  const [stockNotes, setStockNotes] = useState("");

  // Multi-select for bulk action
  const [selectedIds, setSelectedIds] = useState([]);

  // Pending action items (Delivery Failed or In-Transit or Warehouse dock pending)
  const actionItems = rtoItems.filter(
    (item) => item.rtoStatus !== "Closed"
  );

  const handleOpenReattempt = (item) => {
    setReattemptModalItem(item);
    setAlternatePhone(item.buyer.phone);
    setAlternateAddress(item.buyer.address);
    setNewDeliveryDate(new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10));
    setReattemptNotes("Consignee verified phone and promised to receive on selected date.");
  };

  const handleConfirmReattempt = (e) => {
    e.preventDefault();
    if (!reattemptModalItem) return;

    dispatch(
      reattemptDelivery({
        rtoId: reattemptModalItem.id,
        alternatePhone,
        alternateAddress,
        newDeliveryDate,
        notes: reattemptNotes,
      })
    );

    toast.success(`Scheduled delivery re-attempt for ${reattemptModalItem.id}`);
    setReattemptModalItem(null);
  };

  const handleOpenRts = (item) => {
    setRtsModalItem(item);
    setReverseCourier(item.forwardCourier.includes("Delhivery") ? "Delhivery Reverse" : "BlueDart Surface");
    setReverseAwb(`RTS-${Math.floor(100000 + Math.random() * 900000)}`);
    setReverseFreight(item.forwardFreight);
  };

  const handleConfirmRts = (e) => {
    e.preventDefault();
    if (!rtsModalItem) return;

    dispatch(
      initiateRTS({
        rtoId: rtsModalItem.id,
        reverseCourier,
        reverseAwb,
        reverseFreight,
      })
    );

    toast.success(`Initiated Return to Origin (RTS) for ${rtsModalItem.id}`);
    setRtsModalItem(null);
  };

  const handleOpenStockIn = (item) => {
    setStockInModalItem(item);
    setPackageCondition("Pristine");
    setRestockLocation("Warehouse Bay 3 / Pallet 12");
    setInspectedBy("Warehouse Dock Lead");
    setStockNotes("Seal intact, units verified against packing slip.");
  };

  const handleConfirmStockIn = (e) => {
    e.preventDefault();
    if (!stockInModalItem) return;

    dispatch(
      warehouseStockIn({
        rtoId: stockInModalItem.id,
        condition: packageCondition,
        restockLocation,
        inspectedBy,
        stockNotes,
      })
    );

    toast.success(`Warehouse check-in & stock updated for ${stockInModalItem.id}`);
    setStockInModalItem(null);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkRts = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one RTO order");
      return;
    }
    dispatch(bulkInitiateRTS(selectedIds));
    toast.success(`Initiated RTS for ${selectedIds.length} orders`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-accent text-[10px] font-poppins font-black uppercase tracking-wider">
              Resolution Engine
            </span>
            <span className="text-xs text-slate-400 font-inter">Action Required Cases</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            RTO Management & Resolution
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Resolve failed deliveries with customer re-attempts, initiate return-to-seller (RTS), or receive and restock returned warehouse inventory.
          </p>
        </div>

        {/* Bulk Action Button */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl">
            <span className="text-xs font-poppins font-bold text-accent">
              {selectedIds.length} selected
            </span>
            <button
              onClick={handleBulkRts}
              className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-poppins font-bold hover:bg-accent-hover transition-colors cursor-pointer shadow-xs"
            >
              Bulk Mark RTS
            </button>
          </div>
        )}
      </div>

      {/* ── Active RTO Action Cards List ── */}
      <div className="space-y-4">
        {actionItems.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <p className="font-poppins font-bold text-slate-800 text-base">All RTO cases resolved!</p>
            <p className="text-xs text-slate-400 mt-1">
              No pending undelivered packages requiring urgent resolution.
            </p>
          </div>
        ) : (
          actionItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
            >
              {/* Left Column: Checkbox & Consignee info */}
              <div className="flex items-start gap-4 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => handleToggleSelect(item.id)}
                  className="mt-1 w-4 h-4 rounded text-accent focus:ring-accent border-slate-300 cursor-pointer"
                />

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-poppins font-black text-slate-900 text-sm">
                      {item.id}
                    </span>
                    <span className="text-xs font-poppins font-bold text-accent bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                      {item.orderId}
                    </span>
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-poppins font-bold uppercase",
                        item.rtoStatus === "Delivery Failed"
                          ? "bg-rose-100 text-rose-800"
                          : item.rtoStatus === "In-Transit to Origin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      )}
                    >
                      {item.rtoStatus}
                    </span>
                  </div>

                  <p className="font-poppins font-bold text-slate-800 text-xs">
                    {item.buyer.name} · <span className="font-normal text-slate-500">{item.buyer.businessName}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{item.buyer.city}, {item.buyer.state}</span>
                    <span>•</span>
                    <span>{item.buyer.phone}</span>
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] mt-2">
                    <span className="font-semibold text-rose-600">Failed Reason: </span>
                    <span className="text-slate-700 font-medium">{item.rtoReason}</span>
                    <span className="text-slate-400 block text-[10px] italic mt-0.5">
                      Courier: "{item.courierRemark}"
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Logistics & Inventory summary */}
              <div className="text-xs font-inter space-y-1 lg:border-l lg:border-r border-slate-100 lg:px-6 flex-shrink-0 min-w-[200px]">
                <p className="font-poppins font-bold text-slate-900 text-sm">
                  ₹{item.orderValue.toLocaleString("en-IN")}
                </p>
                <p className="text-slate-500 text-[11px]">
                  Mode: <span className="font-semibold text-slate-700">{item.paymentMode}</span>
                </p>
                <p className="text-slate-500 text-[11px]">
                  Carrier: <span className="font-medium text-slate-800">{item.forwardCourier}</span>
                </p>
                <p className="text-slate-400 text-[10px] font-mono">
                  AWB: {item.forwardAwb}
                </p>
                {item.reverseAwb && (
                  <p className="text-amber-700 text-[10px] font-mono font-bold">
                    Rev AWB: {item.reverseAwb}
                  </p>
                )}
              </div>

              {/* Right Column: Resolution Actions */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-shrink-0 w-full lg:w-auto">
                {item.rtoStatus === "Delivery Failed" && (
                  <>
                    <button
                      onClick={() => handleOpenReattempt(item)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-poppins font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-attempt Delivery</span>
                    </button>

                    <button
                      onClick={() => handleOpenRts(item)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Initiate RTS</span>
                    </button>
                  </>
                )}

                {item.rtoStatus === "In-Transit to Origin" && (
                  <button
                    onClick={() => handleOpenStockIn(item)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Warehouse className="w-3.5 h-3.5" />
                    <span>Dock Receive & Restock</span>
                  </button>
                )}

                {item.rtoStatus === "Warehouse Received" && (
                  <button
                    onClick={() => {
                      dispatch(closeRtoCase({ rtoId: item.id, resolutionNotes: "Warehouse restocked & case closed" }));
                      toast.success(`Closed RTO case ${item.id}`);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-poppins font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark Case Closed</span>
                  </button>
                )}

                {item.rtoStatus === "Re-attempted" && (
                  <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-poppins font-bold text-xs">
                    Re-attempt In Progress
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Re-attempt Delivery Modal ── */}
      {reattemptModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-sm">
                    Schedule Delivery Re-attempt
                  </h3>
                  <p className="text-[10px] text-slate-400 font-inter">
                    {reattemptModalItem.id} · Order #{reattemptModalItem.orderId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReattemptModalItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReattempt} className="p-5 space-y-4 text-xs font-inter">
              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Target Re-attempt Date
                </label>
                <input
                  type="date"
                  required
                  value={newDeliveryDate}
                  onChange={(e) => setNewDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-inter focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Alternate Contact Number
                </label>
                <input
                  type="text"
                  required
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-inter focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Confirmed Delivery Address / Landmark
                </label>
                <textarea
                  rows={2}
                  required
                  value={alternateAddress}
                  onChange={(e) => setAlternateAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-inter focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Instructions for Delivery Executive
                </label>
                <textarea
                  rows={2}
                  value={reattemptNotes}
                  onChange={(e) => setReattemptNotes(e.target.value)}
                  placeholder="e.g., Deliver before 2 PM, call before dispatch..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-inter focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setReattemptModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-poppins font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-poppins font-bold shadow-sm"
                >
                  Send Re-attempt Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Initiate RTS Modal ── */}
      {rtsModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-accent flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-sm">
                    Initiate Return to Origin (RTS)
                  </h3>
                  <p className="text-[10px] text-slate-400 font-inter">
                    Order reverse logistics for {rtsModalItem.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRtsModalItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRts} className="p-5 space-y-4 text-xs font-inter">
              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Reverse Logistics Partner
                </label>
                <Select value={reverseCourier} onValueChange={setReverseCourier}>
                  <SelectTrigger className="w-full text-xs bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Reverse Logistics Partner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delhivery Reverse">Delhivery Reverse Logistics</SelectItem>
                    <SelectItem value="BlueDart Surface">BlueDart Reverse Surface</SelectItem>
                    <SelectItem value="Ekart Surface">Ekart Reverse</SelectItem>
                    <SelectItem value="DTDC Express">DTDC Commercial Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Reverse AWB Tracking #
                </label>
                <input
                  type="text"
                  required
                  value={reverseAwb}
                  onChange={(e) => setReverseAwb(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Estimated Reverse Freight (₹)
                </label>
                <input
                  type="number"
                  required
                  value={reverseFreight}
                  onChange={(e) => setReverseFreight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                Shipment will be redirected from delivery hub to ApexMart Central Fulfillment Center.
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRtsModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-poppins font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold shadow-sm"
                >
                  Confirm Reverse Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Dock Stock-in Modal ── */}
      {stockInModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Warehouse className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-sm">
                    Warehouse Dock Inwarding & Stocking
                  </h3>
                  <p className="text-[10px] text-slate-400 font-inter">
                    Receive returned goods for {stockInModalItem.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStockInModalItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmStockIn} className="p-5 space-y-4 text-xs font-inter">
              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Package & Product Condition
                </label>
                <Select value={packageCondition} onValueChange={setPackageCondition}>
                  <SelectTrigger className="w-full text-xs bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Package Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pristine">Pristine (Seals intact, restockable immediately)</SelectItem>
                    <SelectItem value="Packaging Damaged">Packaging Damaged (Repackaging required)</SelectItem>
                    <SelectItem value="Defective/Opened">Defective / Opened (Technical QC required)</SelectItem>
                    <SelectItem value="Destroyed">Destroyed / Total Loss (File insurance claim)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Warehouse Restock Location / Pallet
                </label>
                <input
                  type="text"
                  required
                  value={restockLocation}
                  onChange={(e) => setRestockLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Inspected By
                </label>
                <input
                  type="text"
                  required
                  value={inspectedBy}
                  onChange={(e) => setInspectedBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Dock Inspection Notes
                </label>
                <textarea
                  rows={2}
                  value={stockNotes}
                  onChange={(e) => setStockNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setStockInModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-poppins font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold shadow-sm"
                >
                  Confirm Inward & Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
