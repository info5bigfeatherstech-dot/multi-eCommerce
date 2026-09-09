"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTrustBadges } from "@/store/slices/trustBadgeSlice";
import Skeleton from "@/components/ui/Skeleton";
import { Tag, ShieldCheck, Package, ArrowUpRight } from "lucide-react";

export function TrustBadges() {
  const dispatch = useAppDispatch();
  const { items: badges, status } = useAppSelector((state) => state.trustBadges);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTrustBadges());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-3 lg:h-[440px] justify-between">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-full h-24 lg:h-full rounded-2xl bg-slate-200" />
        ))}
      </div>
    );
  }

  const displayBadges = [
    {
      id: "badge-1",
      title: "Lowest Prices",
      subtitle: "Direct Factory Wholesale",
      stat: "100% Price Match",
      icon: Tag,
      iconBg: "bg-rose-100/80 text-rose-600",
      badgeColor: "bg-rose-50 border-rose-200/80",
    },
    {
      id: "badge-2",
      title: "GST Inclusive",
      subtitle: "Instant Input Credit Claim",
      stat: "Save Up to 28%",
      icon: ShieldCheck,
      iconBg: "bg-emerald-100/80 text-emerald-600",
      badgeColor: "bg-emerald-50 border-emerald-200/80",
    },
    {
      id: "badge-3",
      title: "Zero MOQ",
      subtitle: "Buy 1 Unit or 10,000 Units",
      stat: "No Limit Sample",
      icon: Package,
      iconBg: "bg-amber-100/80 text-amber-700",
      badgeColor: "bg-amber-50 border-amber-200/80",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col justify-between gap-3 lg:h-[440px]">
      {displayBadges.map((badge) => {
        const IconComponent = badge.icon;

        return (
          <div
            key={badge.id}
            className={`flex-1 p-4 rounded-2xl bg-white border ${badge.badgeColor} shadow-xs flex flex-col justify-between group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden`}
          >
            {/* Top Stat Chip & Icon */}
            <div className="flex items-center justify-between">
              <div
                className={`h-11 w-11 rounded-xl ${badge.iconBg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs`}
              >
                <IconComponent className="w-6 h-6 stroke-[2]" />
              </div>

              <span className="text-[10px] font-poppins font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/90 text-slate-700 border border-slate-200 shadow-2xs">
                {badge.stat}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-2">
              <h4 className="font-poppins font-black text-sm text-primary group-hover:text-accent transition-colors flex items-center justify-between">
                <span>{badge.title}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-accent group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
              </h4>
              <p className="font-inter text-xs text-slate-500 mt-0.5">
                {badge.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TrustBadges;
