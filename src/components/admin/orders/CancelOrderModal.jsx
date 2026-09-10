import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { AlertTriangle, X, Loader2, PackageX, ShieldAlert } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CANCELLATION_REASONS = [
  "Customer requested cancellation",
  "Item out of stock / inventory mismatch",
  "Customer changed delivery address",
  "Fraud / suspicious transaction",
  "Duplicate order placed by customer",
  "Other / merchant decision",
];

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  order,
  isCancelling = false,
}) {
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [customNote, setCustomNote] = useState("");

  if (!order) return null;

  const rawId = String(order.orderIdDisplay || order.id || "OWB-ECOMM-099391");
  const displayId = rawId.startsWith("#") ? rawId : `#${rawId}`;
  const totalAmount = order.totalAmount || 0;
  const customerName = order.customer?.name || order.shippingAddress?.name || "Customer";

  const handleConfirm = () => {
    const finalReason =
      selectedReason === "Other / merchant decision" && customNote.trim()
        ? customNote.trim()
        : customNote.trim()
        ? `${selectedReason}: ${customNote.trim()}`
        : selectedReason;

    onConfirm(finalReason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isCancelling && !open && onClose()}>
      <DialogContent
        onClose={() => !isCancelling && onClose()}
        className="max-w-[460px] p-0 rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20 overflow-hidden font-sans"
      >
        {/* Glowing top ambient gradient */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-28 bg-gradient-to-b from-rose-500/20 via-rose-500/5 to-transparent blur-2xl pointer-events-none rounded-full" />

        <div className="p-6 sm:p-7 relative z-10 space-y-5">
          {/* Danger icon badge */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-rose-500/15 blur-xs animate-pulse pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-rose-50 to-rose-100/70 border border-rose-200 flex items-center justify-center text-rose-600 shadow-md shadow-rose-500/10 relative">
                <PackageX className="w-7 h-7 stroke-[2]" />
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <DialogHeader className="text-center space-y-1.5">
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight text-center">
              Cancel Order
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 text-center max-w-[340px] mx-auto leading-relaxed">
              Are you sure you want to cancel order <span className="font-bold text-slate-800">{displayId}</span>? This will release reserved stock back into warehouse inventory.
            </DialogDescription>
          </DialogHeader>

          {/* Order Details Brief Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Customer & Order
              </p>
              <p className="text-xs font-bold text-slate-900 truncate">
                {customerName}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {displayId}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Order Value
              </p>
              <p className="text-sm font-bold text-slate-900">
                ₹{Number(totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Cancellation Reason Dropdown/Radios */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Reason for Cancellation <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              disabled={isCancelling}
              className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all cursor-pointer"
            >
              {CANCELLATION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Optional notes textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Additional Notes <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              disabled={isCancelling}
              placeholder="e.g. Customer called on phone to cancel..."
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
            />
          </div>

          {/* Warning notice */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug">
              This action cannot be undone. Any active courier shipment or pickup manifest will be voided.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isCancelling}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-98 text-slate-700 font-bold text-xs transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              Keep Order
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isCancelling}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/20 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Cancel Order</span>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
