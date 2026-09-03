import React from "react";
import { cn } from "@/lib/utils";

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-poppins font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer";

    const variants = {
      default: "bg-primary hover:bg-primary-light text-white shadow-sm hover:shadow-md",
      coral: "bg-accent hover:bg-accent-hover text-white font-semibold shadow-sm hover:shadow-md",
      yellow: "bg-accent hover:bg-accent-hover text-white font-semibold shadow-sm hover:shadow-md",
      outline: "border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-700",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
      indigoGhost: "bg-transparent hover:bg-primary-light/40 text-white",
      navyGhost: "bg-transparent hover:bg-primary-light/40 text-white",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      default: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base font-semibold",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
