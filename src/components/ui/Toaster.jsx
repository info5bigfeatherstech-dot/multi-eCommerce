"use client";

import React from "react";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster({ ...props }) {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      duration={3200}
      visibleToasts={3}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl font-albert-sans",
          description: "group-[.toast]:text-slate-500 text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:font-bold text-xs",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 group-[.toast]:rounded-xl text-xs",
        },
      }}
      {...props}
    />
  );
}

export default Toaster;
