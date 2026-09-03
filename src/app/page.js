"use client";

import React, { useState } from "react";
import TopBanner from "@/components/layout/TopBanner";
import UtilityBar from "@/components/layout/UtilityBar";
import Header from "@/components/layout/Header";
import CategoryNavBar from "@/components/layout/CategoryNavBar";
import CategorySidebar from "@/components/layout/CategorySidebar";
import HeroBanner from "@/components/home/HeroBanner";
import TrustBadges from "@/components/home/TrustBadges";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import ProductDetail from "@/components/product/ProductDetail";
import WishlistPage from "@/components/wishlist/WishlistPage";
import CartDrawer from "@/components/cart/CartDrawer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileDrawerOpen } from "@/store/slices/uiSlice";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const [currentView, setCurrentView] = useState("home"); // "home" | "product" | "wishlist"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const products = useAppSelector((state) => state.products.items);
  const { isCategorySidebarOpen, isMobileDrawerOpen } = useAppSelector(
    (state) => state.ui
  );

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").trim();
      if (hash === "wishlist") {
        setCurrentView("wishlist");
        setSelectedProduct(null);
        window.scrollTo(0, 0);
        return;
      }
      if (hash && products && products.length > 0) {
        const found = products.find((p) => p.slug === hash);
        if (found) {
          setSelectedProduct(found);
          setCurrentView("product");
          window.scrollTo(0, 0);
          return;
        }
      }
      setCurrentView("home");
      setSelectedProduct(null);
      window.scrollTo(0, 0);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [products]);

  // Scroll to top whenever currentView or selectedProduct changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedProduct]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView("product");
    if (product && product.slug) {
      window.location.hash = product.slug;
    }
    window.scrollTo(0, 0);
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
    setCurrentView("home");
    if (window.location.hash) {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70">
      
      {/* 0. Top Announcement Banner */}
      <TopBanner />

      {/* 1. Utility Bar */}
      <UtilityBar />

      {/* 2. Main Header */}
      <Header />

      {/* 3. Category Navigation Bar */}
      <CategoryNavBar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 pt-2 pb-6">
        {currentView === "wishlist" ? (
          <WishlistPage
            onBack={handleBackToCatalog}
            onSelectProduct={handleSelectProduct}
          />
        ) : currentView === "product" && selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackToCatalog}
          />
        ) : (
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

            {/* Featured Collection Product Grid Section */}
            <FeaturedCollection onSelectProduct={handleSelectProduct} />
          </>
        )}
      </main>

      {/* 6. Interactive Cart Drawer */}
      <CartDrawer />

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-primary-dark/80 backdrop-blur-sm transition-opacity"
            onClick={() => dispatch(setMobileDrawerOpen(false))}
          />

          {/* Drawer Content */}
          <div className="relative flex-1 w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-fadeIn">
            <div className="p-4 bg-primary text-white flex items-center justify-between border-b border-primary-light/30">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-accent" />
                <span className="font-poppins font-bold text-sm text-accent">
                  Shop By Category
                </span>
              </div>
              <button
                onClick={() => dispatch(setMobileDrawerOpen(false))}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-primary-light/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <CategorySidebar isMobile={true} />
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Component */}
      <Footer />
    </div>
  );
}
