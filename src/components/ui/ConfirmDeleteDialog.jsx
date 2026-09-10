import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { AlertTriangle, Trash2, Loader2, ShieldAlert } from "lucide-react";

/**
 * ConfirmDeleteDialog
 * Ultra-premium, modern confirmation modal for dangerous/permanent delete actions.
 */
export default function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  description = "Are you sure you want to permanently delete this item? This action cannot be undone.",
  itemName = "",
  confirmText = "Delete Permanently",
  cancelText = "Cancel",
  isLoading = false,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) return;
    try {
      setIsSubmitting(true);
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeLoading = Boolean(isLoading || isSubmitting);

  const handleOpenChange = (open) => {
    if (!open && !activeLoading) {
      onClose?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        onClose={() => !activeLoading && onClose?.()}
        className="max-w-[420px] p-0 rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/25 overflow-hidden font-montreal"
      >
        {/* Ambient top glowing aura */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-28 bg-gradient-to-b from-rose-500/20 via-rose-500/10 to-transparent blur-2xl pointer-events-none rounded-full" />

        <div className="p-7 relative z-10">
          {/* Centered Animated Danger Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              {/* Pulsing outer ring */}
              <div className="absolute -inset-2 rounded-2xl bg-rose-500/15 blur-xs animate-pulse pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-rose-50 to-rose-100/70 border border-rose-200 flex items-center justify-center text-rose-600 shadow-md shadow-rose-500/10 relative">
                <Trash2 className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Header & Typography */}
          <DialogHeader className="text-center space-y-1.5">
            <DialogTitle className="text-xl font-heading font-black text-slate-900 tracking-tight text-center">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs font-montreal text-slate-500 text-center max-w-[320px] mx-auto leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>

          {/* Item Preview Card */}
          {itemName && (
            <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs text-rose-500">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-heading font-black uppercase tracking-wider text-slate-400">
                    Target Item
                  </p>
                  <p className="text-xs font-heading font-bold text-slate-900 truncate">
                    {itemName}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-rose-100/80 text-rose-700 text-[10px] font-heading font-black uppercase tracking-wider shrink-0 border border-rose-200/50">
                Irreversible
              </span>
            </div>
          )}

          {/* Warning Micro-Callout */}
          {/* <div className="mt-3.5 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50/60 border border-amber-200/50 text-amber-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <p className="text-[11px] font-montreal text-amber-700/90 leading-tight">
              Once deleted, all associated records cannot be recovered.
            </p>
          </div> */}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={activeLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-98 text-slate-700 font-heading font-bold text-xs transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={activeLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-700 text-white font-heading font-bold text-xs transition-all shadow-md shadow-rose-600/20 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {activeLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
