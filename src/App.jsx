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
import ProfilePage from "./components/pages/ProfilePage";
import CartDrawer from "./components/cart/CartDrawer";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import Toaster from "./components/ui/Toaster";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setMobileDrawerOpen, openAuthModal } from "./store/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import {
  Store, X, Heart, User, ClipboardList, Truck,
  ShoppingBag, ChevronRight, LogIn, MapPin, ShieldCheck,
} from "lucide-react";
import AuthModal from "./components/auth/AuthModal";

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobileDrawerOpen = useAppSelector((state) => state.ui.isMobileDrawerOpen);
  const { isAuthenticated, user } = useAppSelector((state) => state.ui);
  const wishlistCount = useAppSelector((state) => state.wishlist.totalCount);
  const cartCount = useAppSelector((state) => state.cart.totalCount);

  const closeDrawer = () => dispatch(setMobileDrawerOpen(false));

  const goTo = (path) => {
    closeDrawer();
    navigate(path);
  };

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

      {/* Main Content Area: Routed with React Router (Entire Width) */}
      <main className="flex-1 w-full px-2.5 sm:px-4 lg:px-6 pt-3 sm:pt-4 pb-8 max-w-[1700px] mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dropshipping" element={<DropshippingPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:tab" element={<ProfilePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/category/:slug/:subSlug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          {/* Catch-all route returns to Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Interactive Cart Drawer */}
      <CartDrawer />

      {/* Mobile Drawer — always mounted, slides in/out with CSS transform */}
      <div
        className={`fixed inset-0 z-50 flex lg:hidden transition-all duration-300 ${
          isMobileDrawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-primary-dark/80 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeDrawer}
        />

        {/* Drawer Panel — slides from left */}
        <div
          className={`relative w-full max-w-[300px] bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* ── Header ── */}
          <div className="px-4 py-3 bg-gradient-to-r from-primary via-primary-700 to-primary text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-accent" />
              <span className="font-poppins font-black text-sm text-white tracking-tight">
                Menu
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">

            {/* ── User Card ── */}
            <div className="mx-3 mt-3 rounded-2xl bg-gradient-to-br from-primary/95 to-slate-900 text-white p-4 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-accent/20 blur-2xl pointer-events-none" />
              {isAuthenticated ? (
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-poppins font-black text-sm text-white truncate">
                        {user?.name || "Wholesale Partner"}
                      </p>
                      <p className="text-[10px] text-slate-300 font-inter truncate">
                        {user?.email || "Verified Retailer"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => goTo("/profile")}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-poppins font-bold text-white flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    View My Profile
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                  </button>
                </div>
              ) : (
                <div className="relative z-10 space-y-3">
                  <div>
                    <p className="font-poppins font-black text-sm text-white">Hello, Guest!</p>
                    <p className="text-[11px] text-slate-300 font-inter mt-0.5">
                      Sign in for exclusive wholesale rates.
                    </p>
                  </div>
                  <button
                    onClick={() => { closeDrawer(); dispatch(openAuthModal("login")); }}
                    className="w-full py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-poppins font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In / Register
                  </button>
                </div>
              )}
            </div>

            {/* ── Quick Actions Grid ── */}
            <div className="px-3 mt-3">
              <p className="text-[10px] font-poppins font-black uppercase tracking-wider text-slate-400 px-1 mb-2">
                Quick Access
              </p>
              <div className="grid grid-cols-2 gap-2">

                <button
                  onClick={() => goTo("/wishlist")}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-50 border border-rose-100 hover:border-rose-300 transition-all active:scale-95 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-poppins font-bold text-slate-800 leading-tight">Wishlist</p>
                    <p className="text-[10px] text-slate-400 font-inter">
                      {wishlistCount > 0 ? `${wishlistCount} saved` : "Saved items"}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => goTo("/profile")}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50 border border-blue-100 hover:border-blue-300 transition-all active:scale-95 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-poppins font-bold text-slate-800 leading-tight">Profile</p>
                    <p className="text-[10px] text-slate-400 font-inter">Account & orders</p>
                  </div>
                </button>

                <button
                  onClick={() => goTo("/inquiry")}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-orange-50 border border-orange-100 hover:border-orange-300 transition-all active:scale-95 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-poppins font-bold text-slate-800 leading-tight">Inquiry</p>
                    <p className="text-[10px] text-slate-400 font-inter">Get bulk quotes</p>
                  </div>
                </button>

                <button
                  onClick={() => goTo("/dropshipping")}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-cyan-50 border border-cyan-100 hover:border-cyan-300 transition-all active:scale-95 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-poppins font-bold text-slate-800 leading-tight">Dropship</p>
                    <p className="text-[10px] text-slate-400 font-inter">Blind dispatch</p>
                  </div>
                </button>

              </div>
            </div>

            {/* ── Divider ── */}
            <div className="mx-3 my-3 flex items-center gap-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] font-poppins font-black uppercase tracking-wider text-slate-400">
                Browse Categories
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* ── Category Sidebar ── */}
            <div className="px-3 pb-6">
              <CategorySidebar isMobile={true} onClose={closeDrawer} />
            </div>

          </div>
        </div>
      </div>

      {/* Auth Login / Register Modal (global popup) */}
      <AuthModal />

      {/* Main Footer Component */}
      <Footer />
    </div>
  );
}
