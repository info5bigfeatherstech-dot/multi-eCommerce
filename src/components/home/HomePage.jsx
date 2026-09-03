"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import CategorySidebar from "@/components/layout/CategorySidebar";
import HeroBanner from "@/components/home/HeroBanner";
import TrustBadges from "@/components/home/TrustBadges";
import CategoryGrid from "@/components/home/CategoryGrid";
import Under99Store from "@/components/home/Under99Store";
import WholesaleDeals from "@/components/home/WholesaleDeals";
import SaleProductShowcase from "@/components/home/SaleProductShowcase";
import PromoBanners from "@/components/home/PromoBanners";
import CategorySpotlight from "@/components/home/CategorySpotlight";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import CustomerTrust from "@/components/home/CustomerTrust";
import { cn } from "@/lib/utils";

export function HomePage() {
  const navigate = useNavigate();
  const isCategorySidebarOpen = useAppSelector(
    (state) => state.ui.isCategorySidebarOpen
  );

  const handleSelectProduct = (product) => {
    const slug = product.slug || product.id;
    navigate(`/product/${slug}`);
  };

  const handleSelectCategory = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <>
      {/* Top Hero Grid Area */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Category Sidebar */}
        {isCategorySidebarOpen && (
          <div className="hidden lg:block animate-fadeIn flex-shrink-0">
            <CategorySidebar />
          </div>
        )}

        {/* Hero Banner Carousel */}
        <div
          className={cn(
            "w-full transition-all duration-300",
            isCategorySidebarOpen
              ? "lg:w-[calc(100%-16rem-18rem-2rem)]"
              : "lg:w-[calc(100%-18rem-1rem)]"
          )}
        >
          <HeroBanner />
        </div>

        {/* Trust Badges Column */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <TrustBadges />
        </div>
      </div>

      {/* 1. Category Cards Grid (11 Categories with Images) */}
      <CategoryGrid onSelectCategory={handleSelectCategory} />

      {/* 2. Budget Wholesale: Under ₹99 Store */}
      <Under99Store onSelectProduct={handleSelectProduct} />

      {/* 3. Today's Wholesale Flash Deals (Live Timer & Stock Progress) */}
      <WholesaleDeals onSelectProduct={handleSelectProduct} />

      {/* 4. Mega Sale & Clearance Showcase (Up to 75% OFF) */}
      <SaleProductShowcase onSelectProduct={handleSelectProduct} />

      {/* 5. Category Feature Banners (Electronics, Home Decor, Gifts) */}
      <PromoBanners onSelectCategory={handleSelectCategory} />

      {/* 6. Category Spotlight & Tabbed Product Showcase */}
      <CategorySpotlight onSelectProduct={handleSelectProduct} />

      {/* 7. Featured Collection Product Grid */}
      <FeaturedCollection onSelectProduct={handleSelectProduct} />

      {/* 8. Customer Trust & Wholesale Testimonials */}
      <CustomerTrust />
    </>
  );
}

export default HomePage;
