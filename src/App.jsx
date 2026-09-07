import React from "react";
import { Routes, Route } from "react-router-dom";
import TopBanner from "./components/layout/TopBanner";
import UtilityBar from "./components/layout/UtilityBar";
import Header from "./components/layout/Header";
import CategoryNavBar from "./components/layout/CategoryNavBar";
import CategorySidebar from "./components/layout/CategorySidebar";
import HomePage from "./components/home/HomePage";
import DropshippingPage from "./components/pages/DropshippingPage";
import InquiryPage from "./components/pages/InquiryPage";
import ContactPage from "./components/pages/ContactPage";
import WishlistPage from "./components/wishlist/WishlistPage";
import ProductDetail from "./components/product/ProductDetail";
import CheckoutPage from "./components/pages/CheckoutPage";
import CategoryPage from "./components/pages/CategoryPage";
import CartDrawer from "./components/cart/CartDrawer";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import Toaster from "./components/ui/Toaster";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setMobileDrawerOpen } from "./store/slices/uiSlice";
import { Store, X } from "lucide-react";
import AuthModal from "./components/auth/AuthModal";

export default function App() {
  const dispatch = useAppDispatch();
  const isMobileDrawerOpen = useAppSelector(
    (state) => state.ui.isMobileDrawerOpen
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70">
      {/* Instant Scroll to Top on route change */}
      <ScrollToTop />

      {/* Shadcn Sonner Toaster */}
      <Toaster />

      {/* 0. Top Announcement Banner */}
      {/* <TopBanner /> */}

      {/* 1. Utility Bar */}
      <UtilityBar />

      {/* 2. Main Header */}
      <Header />

      {/* 3. Category Navigation Bar */}
      <CategoryNavBar />

      {/* Main Content Area: Routed with React Router */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 pt-4 pb-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dropshipping" element={<DropshippingPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/category/:slug/:subSlug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          {/* Catch-all route returns to Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Interactive Cart Drawer */}
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

      {/* Auth Login / Register Modal (global popup) */}
      <AuthModal />

      {/* Main Footer Component */}
      <Footer />
    </div>
  );
}
