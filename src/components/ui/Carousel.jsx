"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Carousel({
  children,
  autoPlay = true,
  interval = 5000,
  className,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = React.Children.toArray(children);
  const count = slides.length;

  const nextSlide = useCallback(() => {
    if (count === 0) return;
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count === 0) return;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (!autoPlay || isHovered || count <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isHovered, count, nextSlide]);

  if (count === 0) return null;

  return (
    <div
      className={cn("relative overflow-hidden group rounded-2xl shadow-md", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides wrapper */}
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="w-full flex-shrink-0 h-full">
            {slide}
          </div>
        ))}
      </div>

      {/* Floating White Pill Controls (Bottom Center: ← • • • →) */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 bg-white/95 px-4 py-1.5 rounded-full shadow-lg border border-slate-200/80 backdrop-blur-sm">
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="text-slate-700 hover:text-accent transition-colors p-0.5 focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={cn(
                  "rounded-full transition-all duration-300 focus:outline-none",
                  currentIndex === idx
                    ? "h-2 w-5 bg-primary"
                    : "h-2 w-2 bg-slate-300 hover:bg-slate-400"
                )}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="text-slate-700 hover:text-accent transition-colors p-0.5 focus:outline-none"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Carousel;
