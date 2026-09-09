import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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
import {
  Store, X, Heart, User, ClipboardList, Truck,
  ShoppingBag, ChevronRight, LogIn, MapPin, ShieldCheck,
} from "lucide-react";
import AuthModal from "./components/auth/AuthModal";

// Admin Panel Components
import AdminLoginPage from "./components/admin/AdminLoginPage";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AllOrdersView from "./components/admin/orders/AllOrdersView";
import OrderManagementView from "./components/admin/orders/OrderManagementView";
import DeliveryVerificationView from "./components/admin/orders/DeliveryVerificationView";
import OrderReportsView from "./components/admin/orders/OrderReportsView";
import ReturnsView from "./components/admin/returns/ReturnsView";
import RefundsView from "./components/admin/returns/RefundsView";
import ReturnRefundWorkflowView from "./components/admin/returns/ReturnRefundWorkflowView";
import ReturnReportsView from "./components/admin/returns/ReturnReportsView";
import RtoOrdersView from "./components/admin/rto/RtoOrdersView";
import RtoManagementView from "./components/admin/rto/RtoManagementView";
import RtoVerificationView from "./components/admin/rto/RtoVerificationView";
import RtoReportsView from "./components/admin/rto/RtoReportsView";
import AllProductsView from "./components/admin/products/AllProductsView";
import AddProductView from "./components/admin/products/AddProductView";
import CategoriesView from "./components/admin/products/CategoriesView";
import InventoryView from "./components/admin/products/InventoryView";
import ProductAttributesView from "./components/admin/products/ProductAttributesView";
import AnalyticsOverviewView from "./components/admin/analytics/AnalyticsOverviewView";
import SalesAnalyticsView from "./components/admin/analytics/SalesAnalyticsView";
import ProductAnalyticsView from "./components/admin/analytics/ProductAnalyticsView";
import CustomerAnalyticsView from "./components/admin/analytics/CustomerAnalyticsView";
import StoreReportsView from "./components/admin/analytics/StoreReportsView";
import ArchivedProductsView from "./components/admin/archived/ArchivedProductsView";
import ArchivedOrdersView from "./components/admin/archived/ArchivedOrdersView";
import ArchivedCustomersView from "./components/admin/archived/ArchivedCustomersView";
import ArchivedOtherDataView from "./components/admin/archived/ArchivedOtherDataView";
import AllStockQueriesView from "./components/admin/stock-queries/AllStockQueriesView";
import ProductRequestsView from "./components/admin/stock-queries/ProductRequestsView";
import CustomerRequestsView from "./components/admin/stock-queries/CustomerRequestsView";
import StockQueryReportsView from "./components/admin/stock-queries/StockQueryReportsView";
import AllLeadsView from "./components/admin/leads/AllLeadsView";
import CustomerLeadsView from "./components/admin/leads/CustomerLeadsView";
import WholesaleLeadsView from "./components/admin/leads/WholesaleLeadsView";
import DropshippingLeadsView from "./components/admin/leads/DropshippingLeadsView";
import FranchiseLeadsView from "./components/admin/leads/FranchiseLeadsView";
import CouponsOffersView from "./components/admin/utilities/CouponsOffersView";
import LoyaltyProgramView from "./components/admin/utilities/LoyaltyProgramView";
import CustomerNotificationsView from "./components/admin/utilities/CustomerNotificationsView";
import GiftCardsView from "./components/admin/utilities/GiftCardsView";
import OtherUtilitiesView from "./components/admin/utilities/OtherUtilitiesView";
import HomepageSectionsView from "./components/admin/website/HomepageSectionsView";
import WebsitePagesView from "./components/admin/website/WebsitePagesView";
import PromotionalBannersView from "./components/admin/website/PromotionalBannersView";
import WebsiteContentView from "./components/admin/website/WebsiteContentView";
import SeoSettingsView from "./components/admin/website/SeoSettingsView";
import RetailManagementView from "./components/admin/ecommerce/RetailManagementView";
import WholesaleManagementView from "./components/admin/ecommerce/WholesaleManagementView";
import DropshippingManagementView from "./components/admin/ecommerce/DropshippingManagementView";
import VirtualFranchiseView from "./components/admin/ecommerce/VirtualFranchiseView";
import PhysicalFranchiseView from "./components/admin/ecommerce/PhysicalFranchiseView";
import CampaignsView from "./components/admin/marketing/CampaignsView";
import PushNotificationsView from "./components/admin/marketing/PushNotificationsView";
import WhatsAppMarketingView from "./components/admin/marketing/WhatsAppMarketingView";
import EmailSmsMarketingView from "./components/admin/marketing/EmailSmsMarketingView";
import MarketingReportsView from "./components/admin/marketing/MarketingReportsView";
import ProductReviewsView from "./components/admin/reviews/ProductReviewsView";
import CustomerFeedbackView from "./components/admin/reviews/CustomerFeedbackView";
import ReviewManagementView from "./components/admin/reviews/ReviewManagementView";
import ReviewReportsView from "./components/admin/reviews/ReviewReportsView";
import AllStaffView from "./components/admin/staff/AllStaffView";
import AddStaffView from "./components/admin/staff/AddStaffView";
import RolesPermissionsView from "./components/admin/staff/RolesPermissionsView";
import StaffActivityView from "./components/admin/staff/StaffActivityView";
import SupportTicketsView from "./components/admin/support/SupportTicketsView";
import CustomerQueriesView from "./components/admin/support/CustomerQueriesView";
import CustomerComplaintsView from "./components/admin/support/CustomerComplaintsView";
import SupportReportsView from "./components/admin/support/SupportReportsView";

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobileDrawerOpen = useAppSelector((state) => state.ui.isMobileDrawerOpen);
  const { isAuthenticated, user } = useAppSelector((state) => state.ui);
  const wishlistCount = useAppSelector((state) => state.wishlist.totalCount);
  const cartCount = useAppSelector((state) => state.cart.totalCount);

  const closeDrawer = () => dispatch(setMobileDrawerOpen(false));

  const goTo = (path) => {
    closeDrawer();
    navigate(path);
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  // ── Dedicated Admin Panel Layout & Routing ──
  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        <Toaster />
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/orders" replace />} />
            {/* Orders Sub-module */}
            <Route path="orders" element={<AllOrdersView />} />
            <Route path="orders/management" element={<OrderManagementView />} />
            <Route path="orders/verification" element={<DeliveryVerificationView />} />
            <Route path="orders/reports" element={<OrderReportsView />} />

            {/* Products Sub-module */}
            <Route path="products" element={<AllProductsView />} />
            <Route path="products/add" element={<AddProductView />} />
            <Route path="products/categories" element={<CategoriesView />} />
            <Route path="products/inventory" element={<InventoryView />} />
            <Route path="products/attributes" element={<ProductAttributesView />} />

            {/* Returns & Refunds Sub-module */}
            <Route path="returns" element={<ReturnsView />} />
            <Route path="returns/refunds" element={<RefundsView />} />
            <Route path="returns/management" element={<ReturnRefundWorkflowView />} />
            <Route path="returns/reports" element={<ReturnReportsView />} />

            {/* RTO (Return to Origin) Sub-module */}
            <Route path="rto" element={<RtoOrdersView />} />
            <Route path="rto/management" element={<RtoManagementView />} />
            <Route path="rto/verification" element={<RtoVerificationView />} />
            <Route path="rto/reports" element={<RtoReportsView />} />

            {/* Store Analytics Sub-module */}
            <Route path="analytics" element={<AnalyticsOverviewView />} />
            <Route path="analytics/sales" element={<SalesAnalyticsView />} />
            <Route path="analytics/products" element={<ProductAnalyticsView />} />
            <Route path="analytics/customers" element={<CustomerAnalyticsView />} />
            <Route path="analytics/reports" element={<StoreReportsView />} />

            {/* Archived Sub-module */}
            <Route path="archived" element={<Navigate to="/admin/archived/products" replace />} />
            <Route path="archived/products" element={<ArchivedProductsView />} />
            <Route path="archived/orders" element={<ArchivedOrdersView />} />
            <Route path="archived/customers" element={<ArchivedCustomersView />} />
            <Route path="archived/other" element={<ArchivedOtherDataView />} />

            {/* Out of Stock Query Sub-module */}
            <Route path="stock-queries" element={<AllStockQueriesView />} />
            <Route path="stock-queries/products" element={<ProductRequestsView />} />
            <Route path="stock-queries/customers" element={<CustomerRequestsView />} />
            <Route path="stock-queries/reports" element={<StockQueryReportsView />} />

            {/* Leads Sub-module */}
            <Route path="leads" element={<AllLeadsView />} />
            <Route path="leads/customers" element={<CustomerLeadsView />} />
            <Route path="leads/wholesale" element={<WholesaleLeadsView />} />
            <Route path="leads/dropshipping" element={<DropshippingLeadsView />} />
            <Route path="leads/franchise" element={<FranchiseLeadsView />} />

            {/* Utilities Sub-module */}
            <Route path="utilities" element={<Navigate to="/admin/utilities/coupons" replace />} />
            <Route path="utilities/coupons" element={<CouponsOffersView />} />
            <Route path="utilities/loyalty" element={<LoyaltyProgramView />} />
            <Route path="utilities/notifications" element={<CustomerNotificationsView />} />
            <Route path="utilities/gift-cards" element={<GiftCardsView />} />
            <Route path="utilities/other" element={<OtherUtilitiesView />} />

            {/* Website Sub-module */}
            <Route path="website" element={<Navigate to="/admin/website/homepage" replace />} />
            <Route path="website/homepage" element={<HomepageSectionsView />} />
            <Route path="website/pages" element={<WebsitePagesView />} />
            <Route path="website/banners" element={<PromotionalBannersView />} />
            <Route path="website/content" element={<WebsiteContentView />} />
            <Route path="website/seo" element={<SeoSettingsView />} />

            {/* E-Commerce Sub-module */}
            <Route path="ecommerce" element={<Navigate to="/admin/ecommerce/retail" replace />} />
            <Route path="ecommerce/retail" element={<RetailManagementView />} />
            <Route path="ecommerce/wholesale" element={<WholesaleManagementView />} />
            <Route path="ecommerce/dropshipping" element={<DropshippingManagementView />} />
            <Route path="ecommerce/virtual-franchise" element={<VirtualFranchiseView />} />
            <Route path="ecommerce/physical-franchise" element={<PhysicalFranchiseView />} />

            {/* Marketing Sub-module */}
            <Route path="marketing" element={<Navigate to="/admin/marketing/campaigns" replace />} />
            <Route path="marketing/campaigns" element={<CampaignsView />} />
            <Route path="marketing/push-notifications" element={<PushNotificationsView />} />
            <Route path="marketing/whatsapp" element={<WhatsAppMarketingView />} />
            <Route path="marketing/email-sms" element={<EmailSmsMarketingView />} />
            <Route path="marketing/reports" element={<MarketingReportsView />} />

            {/* Reviews Sub-module */}
            <Route path="reviews" element={<Navigate to="/admin/reviews/products" replace />} />
            <Route path="reviews/products" element={<ProductReviewsView />} />
            <Route path="reviews/customers" element={<CustomerFeedbackView />} />
            <Route path="reviews/management" element={<ReviewManagementView />} />
            <Route path="reviews/reports" element={<ReviewReportsView />} />

            {/* Staff Sub-module */}
            <Route path="staff" element={<Navigate to="/admin/staff/all" replace />} />
            <Route path="staff/all" element={<AllStaffView />} />
            <Route path="staff/add" element={<AddStaffView />} />
            <Route path="staff/roles" element={<RolesPermissionsView />} />
            <Route path="staff/activity" element={<StaffActivityView />} />

            {/* Support Sub-module */}
            <Route path="support" element={<Navigate to="/admin/support/tickets" replace />} />
            <Route path="support/tickets" element={<SupportTicketsView />} />
            <Route path="support/queries" element={<CustomerQueriesView />} />
            <Route path="support/complaints" element={<CustomerComplaintsView />} />
            <Route path="support/reports" element={<SupportReportsView />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/orders" replace />} />
        </Routes>
      </>
    );
  }

  // ── Public Storefront Layout & Routing ──
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

      {/* Main Content Area: Full width, perfectly aligned with navbars */}
      <main className="flex-1 w-full px-3 sm:px-6 pt-3 sm:pt-4 pb-8">
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
                        {user?.email || "verified buyer"}
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
