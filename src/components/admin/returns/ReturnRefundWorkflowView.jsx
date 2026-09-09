import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateReturnStage, updateQCStatus, processRefund } from "@/store/slices/adminReturnsSlice";
import {
  GitPullRequest,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Search,
  Building2,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  X,
  PackageCheck,
  ArrowRight,
  Sparkles,
  Inbox,
  Send,
  Boxes,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function ReturnRefundWorkflowView() {
  const dispatch = useAppDispatch();
  const returnsList = useAppSelector((state) => state.adminReturns.items);

  const [selectedStage, setSelectedStage] = useState(0); // 0 = All, 1 to 5 = Stages
  const [qcModalReturn, setQcModalReturn] = useState(null);
  const [disposition, setDisposition] = useState("Restock to Active Inventory");
  const [qcNotes, setQcNotes] = useState("");
  const [isQcPassed, setIsQcPassed] = useState(true);

  const stages = [
    { id: 1, name: "1. Claim Received", desc: "Customer submitted claim", icon: Inbox, color: "text-amber-600 bg-amber-50" },
    { id: 2, name: "2. Pickup Scheduled", desc: "Reverse courier booked", icon: Clock, color: "text-blue-600 bg-blue-50" },
    { id: 3, name: "3. In-Transit", desc: "Moving to warehouse", icon: Truck, color: "text-purple-600 bg-purple-50" },
    { id: 4, name: "4. QC Inspection", desc: "Dock examination & verdict", icon: ShieldCheck, color: "text-orange-600 bg-orange-50" },
    { id: 5, name: "5. Refund Settled", desc: "Funds disbursed to buyer", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  ];

  const filteredReturns = returnsList.filter((r) => {
    if (selectedStage !== 0 && r.stage !== selectedStage) {
      return false;
    }
    return true;
  });

  const handleAdvanceStage = (ret, nextStage, newStatus) => {
    dispatch(
      updateReturnStage({
        returnId: ret.id,
        stage: nextStage,
        returnStatus: newStatus,
      })
    );
    toast.success(`Claim ${ret.id} advanced to Stage ${nextStage}: ${newStatus}!`);
  };

  const handleOpenQC = (ret) => {
    setQcModalReturn(ret);
    setDisposition("Restock to Active Inventory");
    setQcNotes(ret.qcNotes || "Warehouse dock inspection: items counted & condition verified.");
    setIsQcPassed(true);
  };

  const handleSaveQC = (e) => {
    e.preventDefault();
    if (!qcModalReturn) return;
    dispatch(
      updateQCStatus({
        returnId: qcModalReturn.id,
        isPassed: isQcPassed,
        disposition,
        qcNotes,
      })
    );
    toast.success(`QC inspection recorded for ${qcModalReturn.id}: ${isQcPassed ? "PASSED" : "FAILED"}`);
    setQcModalReturn(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-inter">
          <span>Returns & Refunds</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Workflow Control</span>
        </div>
        <h1 className="text-2xl font-poppins font-black text-slate-900 mt-1">
          Return & Refund Workflow Control
        </h1>
        <p className="text-xs text-slate-500 font-inter">
          Step-by-step reverse logistics pipeline: tracking from customer claim to warehouse QC examination and refund execution
        </p>
      </div>

      {/* 5-Stage Stepper / Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stages.map((stg) => {
          const count = returnsList.filter((r) => r.stage === stg.id).length;
          const isSelected = selectedStage === stg.id;
          const IconComp = stg.icon;

          return (
            <button
              key={stg.id}
              onClick={() => setSelectedStage(isSelected ? 0 : stg.id)}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all cursor-pointer relative",
                isSelected
                  ? "bg-white border-accent ring-2 ring-accent/20 shadow-md"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("p-2 rounded-xl", stg.color)}>
                  <IconComp className="w-4 h-4" />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 font-poppins font-bold text-xs text-slate-800">
                  {count}
                </span>
              </div>
              <p className="font-poppins font-bold text-xs text-slate-900 mt-3">{stg.name}</p>
              <p className="text-[10px] text-slate-400 font-inter mt-0.5">{stg.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Pipeline Status Banner */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Boxes className="w-4 h-4 text-accent" />
          <span className="text-xs font-poppins font-bold text-slate-800">
            {selectedStage === 0
              ? `Showing all ${returnsList.length} claims in workflow pipeline`
              : `Filtered by Stage ${selectedStage} (${filteredReturns.length} active claims)`}
          </span>
        </div>
        {selectedStage !== 0 && (
          <button
            onClick={() => setSelectedStage(0)}
            className="text-xs text-accent font-poppins font-bold hover:underline"
          >
            Clear Stage Filter
          </button>
        )}
      </div>

      {/* Workflow Claims Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReturns.map((ret) => (
          <div
            key={ret.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all space-y-4"
          >
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-poppins font-black text-base text-slate-900">{ret.id}</span>
                <span className="text-xs font-mono text-slate-500">Order: {ret.orderId}</span>
                <span className="text-xs text-slate-400">{ret.requestDate}</span>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[11px] font-poppins font-bold border",
                    ret.returnStatus.includes("Passed") && "bg-emerald-50 text-emerald-700 border-emerald-200",
                    ret.returnStatus.includes("Failed") && "bg-rose-50 text-rose-700 border-rose-200",
                    ret.returnStatus.includes("In-Transit") && "bg-purple-50 text-purple-700 border-purple-200",
                    ret.returnStatus.includes("Pickup") && "bg-blue-50 text-blue-700 border-blue-200",
                    ret.returnStatus === "Requested" && "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {ret.returnStatus}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-poppins font-bold text-slate-900">
                  Value: {formatCurrency(ret.refundAmount)}
                </span>
              </div>
            </div>

            {/* 5-Step Visual Indicator */}
            <div className="py-2">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accent z-0 transition-all duration-500"
                  style={{ width: `${((ret.stage - 1) / 4) * 100}%` }}
                />

                {[1, 2, 3, 4, 5].map((sNum) => {
                  const isDone = ret.stage >= sNum;
                  const isCurrent = ret.stage === sNum;

                  return (
                    <div key={sNum} className="relative z-10 flex flex-col items-center">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center font-poppins font-bold text-xs transition-all shadow-xs",
                          isCurrent
                            ? "bg-accent text-white ring-4 ring-accent/20 scale-110"
                            : isDone
                            ? "bg-emerald-600 text-white"
                            : "bg-white border-2 border-slate-200 text-slate-400"
                        )}
                      >
                        {isDone && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : sNum}
                      </div>
                      <span className="text-[10px] font-poppins font-semibold text-slate-600 mt-1 hidden sm:block">
                        {stages[sNum - 1].name.replace(/^\d+\.\s*/, "")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Middle details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs font-inter pt-1">
              <div className="space-y-1">
                <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase">Customer</span>
                <p className="font-bold text-slate-900">{ret.customer.name}</p>
                <p className="text-slate-600">{ret.customer.businessName}</p>
                <p className="text-slate-500">{ret.customer.city} ({ret.customer.phone})</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase">Returned Goods</span>
                <p className="font-bold text-slate-900">{ret.item.name}</p>
                <p className="text-slate-600">Quantity: <strong>{ret.item.qty} units</strong></p>
                <p className="text-slate-500 italic">"{ret.reasonDetails}"</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase">Reverse Tracking & QC</span>
                {ret.reverseCourier ? (
                  <p className="text-purple-700 font-semibold">{ret.reverseCourier}</p>
                ) : (
                  <p className="text-slate-400 italic">No reverse courier assigned</p>
                )}
                {ret.reverseAwb && <p className="font-mono text-purple-900">AWB: {ret.reverseAwb}</p>}
                {ret.qcDisposition && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-poppins font-bold text-[10px]">
                    Disposition: {ret.qcDisposition}
                  </span>
                )}
              </div>
            </div>

            {/* Stage Workflow Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                {ret.stage === 2 && (
                  <button
                    onClick={() => handleAdvanceStage(ret, 3, "Reverse In-Transit")}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-poppins font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Courier Picked Up ➔ In-Transit</span>
                  </button>
                )}

                {ret.stage === 3 && (
                  <button
                    onClick={() => handleAdvanceStage(ret, 4, "QC Pending")}
                    className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-poppins font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Inbox className="w-3.5 h-3.5" />
                    <span>Warehouse Received ➔ Start QC</span>
                  </button>
                )}

                {ret.stage === 4 && (
                  <button
                    onClick={() => handleOpenQC(ret)}
                    className="px-4 py-1.5 bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Execute QC Inspection & Verdict</span>
                  </button>
                )}

                {ret.stage === 4 && ret.returnStatus === "QC Passed" && (
                  <button
                    onClick={() => {
                      dispatch(
                        processRefund({
                          returnId: ret.id,
                          payoutMethod: "Instant UPI Payout",
                          utr: `UPI-${Date.now()}`,
                        })
                      );
                      toast.success(`Refund disbursed to ${ret.customer.name}!`);
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Trigger Automated Refund</span>
                  </button>
                )}

                {ret.stage === 5 && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-poppins font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Workflow Fully Completed</span>
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-400">
                Current Stage: <strong className="text-slate-800">Stage {ret.stage} ({ret.returnStatus})</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* QC Inspection Modal */}
      {qcModalReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-poppins font-bold text-sm">Warehouse Dock QC Inspection</span>
              <button onClick={() => setQcModalReturn(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQC} className="p-6 space-y-4 text-xs font-inter">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900">Examining: {qcModalReturn.item.name}</p>
                <p className="text-slate-500 mt-0.5">Quantity: {qcModalReturn.item.qty} units | Buyer: {qcModalReturn.customer.name}</p>
                <p className="text-slate-500 italic mt-0.5">Reported Issue: {qcModalReturn.reasonDetails}</p>
              </div>

              {/* Pass / Fail Toggle */}
              <div>
                <label className="block text-xs font-poppins font-semibold text-slate-700 mb-1.5">
                  Inspection Decision
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQcPassed(true)}
                    className={cn(
                      "py-2.5 px-3 rounded-xl border text-xs font-poppins font-bold flex items-center justify-center gap-2 cursor-pointer transition-all",
                      isQcPassed
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-400/20"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>QC Passed (Approve)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsQcPassed(false)}
                    className={cn(
                      "py-2.5 px-3 rounded-xl border text-xs font-poppins font-bold flex items-center justify-center gap-2 cursor-pointer transition-all",
                      !isQcPassed
                        ? "bg-rose-50 border-rose-400 text-rose-700 ring-2 ring-rose-400/20"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>QC Failed (Reject)</span>
                  </button>
                </div>
              </div>

              {/* Disposition */}
              {isQcPassed && (
                <div>
                  <label className="block text-xs font-poppins font-semibold text-slate-700 mb-1.5">
                    Inventory Disposition
                  </label>
                  <Select value={disposition} onValueChange={setDisposition}>
                    <SelectTrigger className="w-full text-xs bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select Disposition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Restock to Active Inventory">Restock to Active Inventory (Like-New Condition)</SelectItem>
                      <SelectItem value="Write-off to Manufacturer Warranty">Write-off to Manufacturer Warranty / Factory Claim</SelectItem>
                      <SelectItem value="Send to Clearance / Seconds Lot">Send to Clearance / Seconds Liquidation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-poppins font-semibold text-slate-700 mb-1.5">
                  Inspection Log & Warehouse Notes
                </label>
                <textarea
                  value={qcNotes}
                  onChange={(e) => setQcNotes(e.target.value)}
                  required
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQcModalReturn(null)}
                  className="px-4 py-2 rounded-xl text-xs font-poppins font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-poppins font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Submit Inspection Verdict
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
