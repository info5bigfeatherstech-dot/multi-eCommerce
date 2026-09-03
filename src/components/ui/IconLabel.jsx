import React from "react";
import { cn } from "@/lib/utils";

export function IconLabel({
  icon: Icon,
  title,
  subtitle,
  badgeCount,
  onClick,
  className,
  iconClassName,
  titleClassName,
  subtitleClassName,
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all duration-200 focus:outline-none shadow-xs hover:border-white/20",
        className
      )}
    >
      <div className="relative flex items-center justify-center flex-shrink-0">
        {Icon && (
          <Icon className={cn("w-5 h-5 text-white group-hover:text-accent transition-colors stroke-[2]", iconClassName)} />
        )}
        {badgeCount !== undefined && badgeCount !== null && badgeCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-md animate-pulse">
            {badgeCount}
          </span>
        )}
      </div>

      {(title || subtitle) && (
        <div className="flex flex-col leading-tight">
          {title && (
            <span className={cn("text-[11px] font-poppins font-medium text-slate-300 group-hover:text-white transition-colors", titleClassName)}>
              {title}
            </span>
          )}
          {subtitle && (
            <span className={cn("text-xs font-poppins font-bold text-white group-hover:text-accent transition-colors", subtitleClassName)}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

export default IconLabel;
