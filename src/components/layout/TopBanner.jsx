"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, ArrowRight, Clock } from "lucide-react";

export function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 32 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 pt-3 pb-1">
      <div className="bg-gradient-to-r from-accent via-coral-hover to-accent text-white text-xs py-2 px-4 rounded-xl shadow-sm border border-white/10 flex items-center justify-between gap-4">
        
        {/* Left Badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white font-poppins font-bold px-2.5 py-0.5 rounded-full text-[10px] tracking-wide uppercase border border-white/30">
          <Sparkles className="w-3 h-3 text-white animate-pulse" />
          <span>Mega Wholesale Fest</span>
        </div>

        {/* Center Text & Timer */}
        <div className="flex-1 flex items-center justify-center gap-3 text-center flex-wrap">
          <p className="font-poppins font-medium text-xs sm:text-sm">
            <strong className="font-bold">LIGHTNING SALE LIVE!</strong> Get Extra Up to{" "}
            <span className="font-black text-amber-200 underline decoration-amber-200/60">65% OFF</span> + 100% Instant GST Input Credit!
          </p>

          {/* Live Countdown Timer */}
          <div className="hidden sm:flex items-center gap-1 bg-primary/40 px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold text-amber-300 border border-white/20">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>
              {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
            </span>
          </div>

          <a
            href="/deals"
            className="hidden md:inline-flex items-center gap-1 font-poppins font-bold text-xs bg-white text-accent hover:bg-primary hover:text-white px-2.5 py-0.5 rounded-md transition-all ml-1 shadow-sm"
          >
            <span>Shop Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Dismiss Announcement"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}

export default TopBanner;
