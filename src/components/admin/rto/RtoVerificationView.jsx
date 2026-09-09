import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  verifyRtoReason,
  raiseCourierDispute,
} from "@/store/slices/adminRtoSlice";
import {
  ShieldAlert,
  ShieldCheck,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  Search,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Building2,
  MapPin,
  X,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function RtoVerificationView() {
  const dispatch = useAppDispatch();
  const rtoItems = useAppSelector((state) => state.adminRto.items);

  const [filterType, setFilterType] = useState("All");
  const [selectedCase, setSelectedCase] = useState(null);
  const [disputeModalCase, setDisputeModalCase] = useState(null);

  // Verification Form State
  const [verificationStatus, setVerificationStatus] = useState("Fake Attempt Confirmed");
  const [buyerFeedback, setBuyerFeedback] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  // Dispute Form State
  const [disputeCategory, setDisputeCategory] = useState("Fake Delivery Attempt - No Call/Visit Made");
  const [disputeNotes, setDisputeNotes] = useState("");

  const filteredItems = rtoItems.filter((item) => {
    if (filterType === "All") return true;
    return item.verification.status === filterType;
  });

  const handleOpenVerify = (item) => {
    setSelectedCase(item);
    setVerificationStatus(item.verification.status !== "Pending Verification" ? item.verification.status : "Fake Attempt Confirmed");
    setBuyerFeedback(item.verification.customerFeedback || "");
    setInternalNotes(item.verification.internalNotes || "");
  };

  const handleSaveVerification = (e) => {
    e.preventDefault();
    if (!selectedCase) return;

    dispatch(
      verifyRtoReason({
        rtoId: selectedCase.id,
        status: verificationStatus,
        customerContacted: true,
        customerFeedback: buyerFeedback,
        internalNotes,
      })
    );

    toast.success(`Verification saved for ${selectedCase.id}`);
    setSelectedCase(null);
  };

  const handleOpenDispute = (item) => {
    setDisputeModalCase(item);
    setDisputeCategory("Fake Delivery Attempt - GPS Misalignment & No Call");
    setDisputeNotes(`Buyer ${item.buyer.name} confirms presence at shop. Courier marked 'Premises Closed' without physical visit.`);
  };

  const handleConfirmDispute = (e) => {
    e.preventDefault();
    if (!disputeModalCase) return;

    dispatch(
      raiseCourierDispute({
        rtoId: disputeModalCase.id,
        disputeCategory,
        disputeNotes,
      })
    );

    toast.success(`Dispute ticket raised with ${disputeModalCase.forwardCourier}`);
    setDisputeModalCase(null);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-poppins font-black uppercase tracking-wider">
              Fraud & NDR Audit
            </span>
            <span className="text-xs text-slate-400 font-inter">Courier Partner Accountability</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 tracking-tight mt-1">
            RTO Reason & Case Verification
          </h1>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Audit non-delivery reports (NDR), verify fake courier attempts through direct buyer outreach, and file courier freight penalty disputes.
          </p>
        </div>

        {/* Status Counts */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-poppins font-bold text-slate-500">
            {rtoItems.filter((i) => i.verification.status === "Pending Verification").length} Pending Audits
          </span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { label: "All Audit Cases", value: "All" },
          { label: "Pending Verification", value: "Pending Verification" },
          { label: "Fake Attempt Confirmed", value: "Fake Attempt Confirmed" },
          { label: "Genuine Rejection", value: "Genuine Rejection" },
          { label: "Dispute Raised", value: "Dispute Raised" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-poppins font-semibold whitespace-nowrap transition-all cursor-pointer",
              filterType === tab.value
                ? "bg-accent text-white shadow-xs font-bold"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Cases Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            {/* Case Header */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-poppins font-black text-slate-900 text-sm">{item.id}</span>
                    <span className="text-xs font-poppins font-bold text-accent">{item.orderId}</span>
                  </div>
                  <p className="text-xs font-poppins font-bold text-slate-800 mt-0.5">
                    {item.buyer.name} · <span className="font-normal text-slate-500">{item.buyer.businessName}</span>
                  </p>
                </div>

                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-poppins font-bold uppercase",
                    item.verification.status === "Fake Attempt Confirmed"
                      ? "bg-rose-100 text-rose-800"
                      : item.verification.status === "Genuine Rejection"
                      ? "bg-slate-100 text-slate-700"
                      : item.verification.status === "Dispute Raised"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-amber-100 text-amber-800"
                  )}
                >
                  {item.verification.status}
                </span>
              </div>

              {/* Courier NDR claim */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs font-inter">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Courier Partner:</span>
                  <span className="font-semibold text-slate-800">{item.forwardCourier}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Forward AWB:</span>
                  <span className="font-mono text-slate-700">{item.forwardAwb}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Courier Claim:</span>
                  <span className="font-bold text-rose-600">{item.rtoReason}</span>
                </div>
                <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                  "{item.courierRemark}"
                </p>
              </div>

              {/* Buyer Feedback / Investigation Log */}
              {item.verification.customerFeedback && (
                <div className="mt-3 p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 text-xs font-inter space-y-1">
                  <span className="text-[10px] font-poppins font-bold uppercase text-blue-700 tracking-wider">
                    Buyer Statement
                  </span>
                  <p className="text-slate-700 italic">"{item.verification.customerFeedback}"</p>
                </div>
              )}

              {/* Dispute Ticket Indicator */}
              {item.verification.disputeTicketId && (
                <div className="mt-2 flex items-center gap-2 text-xs font-poppins font-bold text-purple-700 bg-purple-50 p-2 rounded-xl border border-purple-200">
                  <Ticket className="w-4 h-4" />
                  <span>Courier Dispute #{item.verification.disputeTicketId} Active</span>
                </div>
              )}
            </div>

            {/* Actions Toolbar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              {/* Buyer quick contact */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${item.buyer.phone}`}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Call Buyer"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`https://wa.me/${item.buyer.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(item.buyer.name)},%20ApexMart%20Support%20here%20regarding%20your%20order%20${item.orderId}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  title="WhatsApp Buyer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenVerify(item)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-poppins font-bold transition-colors cursor-pointer"
                >
                  Audit Reason
                </button>

                {item.verification.status !== "Dispute Raised" && (
                  <button
                    onClick={() => handleOpenDispute(item)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-poppins font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    Raise Dispute
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Reason Audit Modal ── */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-poppins font-bold text-slate-900 text-sm">
                  NDR Investigation & Buyer Verification
                </h3>
                <p className="text-[10px] text-slate-400 font-inter">
                  {selectedCase.id} · {selectedCase.buyer.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVerification} className="p-5 space-y-4 text-xs font-inter">
              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Verification Conclusion
                </label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-inter focus:outline-none focus:border-accent"
                >
                  <option value="Fake Attempt Confirmed">
                    Fake Attempt Confirmed (Delivery boy never called or visited)
                  </option>
                  <option value="Genuine Rejection">
                    Genuine Rejection (Customer refused or requested cancellation)
                  </option>
                  <option value="Pending Verification">
                    Pending Verification (Further follow-up required)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Buyer Statement / Call Recording Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={buyerFeedback}
                  onChange={(e) => setBuyerFeedback(e.target.value)}
                  placeholder="Record buyer's exact feedback on why delivery did not occur..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Internal Operations Note
                </label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Internal notes for ops and billing..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-poppins font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins font-bold shadow-sm"
                >
                  Save Verification Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Raise Courier Dispute Modal ── */}
      {disputeModalCase && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-slate-900 text-sm">
                    Lodge Courier Fake Attempt Dispute
                  </h3>
                  <p className="text-[10px] text-slate-400 font-inter">
                    Against {disputeModalCase.forwardCourier} · AWB #{disputeModalCase.forwardAwb}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDisputeModalCase(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispute} className="p-5 space-y-4 text-xs font-inter">
              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Dispute Category
                </label>
                <select
                  value={disputeCategory}
                  onChange={(e) => setDisputeCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-inter focus:outline-none focus:border-accent"
                >
                  <option value="Fake Delivery Attempt - GPS Misalignment & No Call">
                    Fake Attempt: Delivery executive never visited buyer premises
                  </option>
                  <option value="Falsified Customer Contact Log">
                    Falsified Log: Call logs show 0 outgoing attempts to buyer
                  </option>
                  <option value="Package Damage by Carrier In-Transit">
                    Carrier Damage: Packaging destroyed causing buyer refusal
                  </option>
                  <option value="Delay Exceeded SLA Window">
                    SLA Breach: Delivery delayed past committed transit window
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-poppins font-bold text-slate-700 mb-1">
                  Evidence & Explanation for Carrier Ops
                </label>
                <textarea
                  rows={3}
                  required
                  value={disputeNotes}
                  onChange={(e) => setDisputeNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-[11px] space-y-1">
                <p className="font-bold">Claim Request: 100% Reverse & Forward Freight Waiver</p>
                <p className="text-purple-700">
                  ApexMart will automatically withhold ₹{disputeModalCase.forwardFreight + (disputeModalCase.reverseFreight || 0)} from courier's weekly billing cycle.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDisputeModalCase(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-poppins font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-poppins font-bold shadow-sm"
                >
                  Submit Dispute Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
