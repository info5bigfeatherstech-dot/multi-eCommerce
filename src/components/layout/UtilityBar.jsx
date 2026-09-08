"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOffers } from "@/store/slices/offerSlice";
import { HelpCircle, MapPin, Sparkles } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export function UtilityBar() {
  const dispatch = useAppDispatch();
  const { items: offers, status } = useAppSelector((state) => state.offers);
  const [pincode, setPincode] = useState("380001 (Ahmedabad)");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOffers());
    }
  }, [dispatch, status]);

  return (
    <div className="w-full bg-[#0d1727] text-white border-b border-white/10 shadow-xs">
      <div className="w-full px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 sm:gap-4 text-xs">
        
        {/* Left: Help & Location Pill */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="tel:+9118001234567"
            className="flex items-center gap-1.5 bg-black hover:bg-slate-900 text-white font-poppins font-bold px-3 py-1 rounded-md text-xs transition-all shadow-xs border border-slate-800"
          >
            <HelpCircle className="w-3.5 h-3.5 text-accent" />
            <span>Help & Support</span>
          </a>

          <div className="hidden md:flex items-center gap-1 text-slate-300 font-poppins text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span>Deliver to:</span>
            <span className="font-semibold text-white underline cursor-pointer decoration-accent/50">
              {pincode}
            </span>
          </div>
        </div>

        {/* Center: Infinite Auto-scrolling Marquee */}
        <div className="flex-1 overflow-hidden relative mx-2 hidden sm:block">
          {status === "loading" ? (
            <div className="flex justify-center items-center py-0.5">
              <Skeleton className="h-4 w-64 bg-primary-light/40" />
            </div>
          ) : (
            <div className="flex whitespace-nowrap animate-marquee">
              {[...offers, ...offers, ...offers].map((offer, idx) => (
                <div key={`${offer.id}-${idx}`} className="flex items-center gap-2 mx-6">
                  <Sparkles className="w-3 h-3 text-accent flex-shrink-0" />
                  <span className="text-slate-200 font-inter text-xs">
                    <strong className="text-accent font-poppins font-bold mr-1.5 tracking-wide">
                      {offer.highlight}:
                    </strong>
                    {offer.text}
                  </span>
                  <span className="text-slate-500 ml-6">•</span>
                </div>
              ))}
            </div>
          )}
        </div>

        

      </div>
    </div>
  );
}

export default UtilityBar;
