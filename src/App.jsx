import React, { useState } from "react";
import TopBanner from "./components/layout/TopBanner";
import UtilityBar from "./components/layout/UtilityBar";
import Header from "./components/layout/Header";
import CategoryNavBar from "./components/layout/CategoryNavBar";
import CategorySidebar from "./components/layout/CategorySidebar";
import HeroBanner from "./components/home/HeroBanner";
import TrustBadges from "./components/home/TrustBadges";
import FeaturedCollection from "./components/home/FeaturedCollection";
import CategoryGrid from "./components/home/CategoryGrid";
import WholesaleDeals from "./components/home/WholesaleDeals";
import Under99Store from "./components/home/Under99Store";
import SaleProductShowcase from "./components/home/SaleProductShowcase";
import PromoBanners from "./components/home/PromoBanners";
import CategorySpotlight from "./components/home/CategorySpotlight";
import CustomerTrust from "./components/home/CustomerTrust";
import ProductDetail from "./components/product/ProductDetail";
import WishlistPage from "./components/wishlist/WishlistPage";
import ContactPage from "./components/pages/ContactPage";
import InquiryPage from "./components/pages/InquiryPage";
import CartDrawer from "./components/cart/CartDrawer";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setMobileDrawerOpen, setCurrentView } from "./store/slices/uiSlice";
import Footer from "./components/layout/Footer";
import { Store, X } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const dispatch = useAppDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const products = useAppSelector((state) => state.products.items);
  const { isCategorySidebarOpen, isMobileDrawerOpen, currentView } = useAppSelector(
    (state) => state.ui
  );

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").trim();
      if (hash === "wishlist") {
        dispatch(setCurrentView("wishlist"));
        setSelectedProduct(null);
        window.scrollTo(0, 0);
        return;
      }
      if (hash === "contact") {
        dispatch(setCurrentView("contact"));
        setSelectedProduct(null);
        window.scrollTo(0, 0);
        return;
      }
      if (hash === "inquiry") {
        dispatch(setCurrentView("inquiry"));
        setSelectedProduct(null);
        window.scrollTo(0, 0);
        return;
      }
      if (hash && products && products.length > 0) {
        const found = products.find((p) => p.slug === hash);
        if (found) {
          setSelectedProduct(found);
          dispatch(setCurrentView("product"));
          window.scrollTo(0, 0);
          return;
        }
      }
      dispatch(setCurrentView("home"));
      setSelectedProduct(null);
      window.scrollTo(0, 0);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [products, dispatch]);

  // Scroll to top whenever currentView or selectedProduct changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedProduct]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    dispatch(setCurrentView("product"));
    window.location.hash = product.slug;
    window.scrollTo(0, 0);
  };

  const handleBackToCatalog = () => {
    dispatch(setCurrentView("home"));
    setSelectedProduct(null);
    window.location.hash = "";
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
        ) : currentView === "contact" ? (
          <ContactPage onBack={handleBackToCatalog} />
        ) : currentView === "inquiry" ? (
          <InquiryPage onBack={handleBackToCatalog} />
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

            {/* 1. Category Cards Grid (11 Categories with Images) */}
            <CategoryGrid onSelectCategory={(slug) => console.log("Selected category:", slug)} />

            {/* 2. Budget Wholesale: Under ₹99 Store */}
            <Under99Store onSelectProduct={handleSelectProduct} />

            {/* 3. Today's Wholesale Flash Deals (Live Timer & Stock Progress) */}
            <WholesaleDeals onSelectProduct={handleSelectProduct} />

            {/* 4. Mega Sale & Clearance Showcase (Up to 75% OFF) */}
            <SaleProductShowcase onSelectProduct={handleSelectProduct} />

            {/* 5. Category Feature Banners (Electronics, Home Decor, Gifts) */}
            <PromoBanners onSelectCategory={(slug) => console.log("Selected banner category:", slug)} />

            {/* 6. Category Spotlight & Tabbed Product Showcase */}
            <CategorySpotlight onSelectProduct={handleSelectProduct} />

            {/* 7. Featured Collection Product Grid */}
            <FeaturedCollection onSelectProduct={handleSelectProduct} />

            {/* 8. Customer Trust & Wholesale Testimonials */}
            <CustomerTrust />
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
