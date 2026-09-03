"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBanners } from "@/store/slices/bannerSlice";
import Carousel from "@/components/ui/Carousel";
import Skeleton from "@/components/ui/Skeleton";

export function HeroBanner() {
  const dispatch = useAppDispatch();
  const { items: banners, status } = useAppSelector((state) => state.banners);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBanners());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return (
      <div className="w-full h-[440px] rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <Skeleton className="w-full h-full bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="w-full h-[440px] relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-100">
      <Carousel autoPlay={true} interval={5500} className="w-full h-full">
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={banner.ctaLink || "#"}
            className="relative w-full h-full block overflow-hidden group cursor-pointer"
          >
            {/* Clean full-bleed image without any text overlay */}
            <img
              src={banner.imageUrl}
              alt={banner.title || "Hero Banner"}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            />
          </a>
        ))}
      </Carousel>
    </div>
  );
}

export default HeroBanner;
