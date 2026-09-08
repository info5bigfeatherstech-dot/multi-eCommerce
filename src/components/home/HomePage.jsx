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

  const handleSelectProduct = (product) => {
    const slug = product.slug || product.id;
    navigate(`/product/${slug}`);
  };

  const handleSelectCategory = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <>
      {/* Top Hero Grid Area: Category Sidebar on left, Banner in middle, Trust Badges on right */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Category Sidebar - Permanently docked on the left corner matching image height */}
        <div className="hidden lg:block flex-shrink-0 w-64">
          <CategorySidebar />
        </div>

        {/* Hero Banner Carousel - Dynamically takes remaining width with flex-1 */}
        <div className="w-full flex-1 min-w-0 transition-all duration-300">
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
      {/* <CustomerTrust /> */}
    </>
  );
}

export default HomePage;
