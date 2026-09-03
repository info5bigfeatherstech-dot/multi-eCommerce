import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "coral", children, ...props }) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-poppins transition-colors";

  const variants = {
    coral: "bg-accent text-white shadow-sm",
    yellow: "bg-accent text-white shadow-sm",
    indigo: "bg-primary text-white",
    softCoral: "bg-accent-light text-accent-500 border border-accent-soft",
    softIndigo: "bg-primary-soft text-primary border border-primary-light/20",
    outline: "border border-slate-300 text-slate-700",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}

export default Badge;
