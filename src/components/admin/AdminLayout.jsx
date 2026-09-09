import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { adminLogout } from "@/store/slices/adminAuthSlice";
import {
  Store,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  PackageCheck,
  ClipboardList,
  ShieldCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  BellRing,
  Inbox,
  Briefcase,
  Truck,
  Tag,
  Crown,
  Gift,
  Wrench,
  Search,
  ExternalLink,
  Archive,
  Database,
  User,
  Users,
  Clock,
  Sparkles,
  Layers,
  RotateCcw,
  CreditCard,
  GitPullRequest,
  Undo2,
  ShieldAlert,
  Package,
  FolderTree,
  Sliders,
  PlusCircle,
  Boxes,
  DollarSign,
  FileSpreadsheet,
  LineChart,
  Globe,
  FileText,
  ShoppingBag,
  Megaphone,
  MessageCircle,
  Mail,
  Target,
  Smartphone,
  Star,
  MessageSquare,
  UserPlus,
  Activity,
  LifeBuoy,
  Settings,
  Cpu,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const adminUser = useAppSelector((state) => state.adminAuth?.adminUser);
  const orders = useAppSelector((state) => state.adminOrders?.items || []);
  const returnsList = useAppSelector((state) => state.adminReturns?.items || []);
  const rtoItems = useAppSelector((state) => state.adminRto?.items || []);
  const products = useAppSelector((state) => state.adminProducts?.products || []);
  const archivedProducts = useAppSelector((state) => state.adminArchived?.products || []);
  const archivedOrders = useAppSelector((state) => state.adminArchived?.orders || []);
  const archivedCustomers = useAppSelector((state) => state.adminArchived?.customers || []);
  const stockQueries = useAppSelector((state) => state.adminStockQueries?.queries || []);
  const leads = useAppSelector((state) => state.adminLeads?.leads || []);
  const coupons = useAppSelector((state) => state.adminUtilities?.coupons || []);
  const websitePages = useAppSelector((state) => state.adminWebsite?.pages || []);
  const websiteBanners = useAppSelector((state) => state.adminWebsite?.banners || []);
  const retailProducts = useAppSelector((state) => state.adminEcommerce?.retailProducts || []);
  const wholesaleAccounts = useAppSelector((state) => state.adminEcommerce?.wholesaleAccounts || []);
  const dropshippers = useAppSelector((state) => state.adminEcommerce?.dropshippers || []);
  const virtualFranchises = useAppSelector((state) => state.adminEcommerce?.virtualFranchises || []);
  const physicalFranchises = useAppSelector((state) => state.adminEcommerce?.physicalFranchises || []);
  const marketingCampaigns = useAppSelector((state) => state.adminMarketing?.campaigns || []);
  const pushNotifications = useAppSelector((state) => state.adminMarketing?.pushNotifications || []);
  const whatsappCampaigns = useAppSelector((state) => state.adminMarketing?.whatsappCampaigns || []);
  const productReviews = useAppSelector((state) => state.adminReviews?.productReviews || []);
  const staffMembers = useAppSelector((state) => state.adminStaff?.staffMembers || []);
  const supportTickets = useAppSelector((state) => state.adminSupport?.tickets || []);
  const supportQueries = useAppSelector((state) => state.adminSupport?.queries || []);
  const supportComplaints = useAppSelector((state) => state.adminSupport?.complaints || []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(true);
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);
  const [isReturnsExpanded, setIsReturnsExpanded] = useState(true);
  const [isRtoExpanded, setIsRtoExpanded] = useState(true);
  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(true);
  const [isArchivedExpanded, setIsArchivedExpanded] = useState(true);
  const [isStockQueriesExpanded, setIsStockQueriesExpanded] = useState(true);
  const [isLeadsExpanded, setIsLeadsExpanded] = useState(true);
  const [isUtilitiesExpanded, setIsUtilitiesExpanded] = useState(true);
  const [isWebsiteExpanded, setIsWebsiteExpanded] = useState(true);
  const [isEcommerceExpanded, setIsEcommerceExpanded] = useState(true);
  const [isMarketingExpanded, setIsMarketingExpanded] = useState(true);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(true);
  const [isStaffExpanded, setIsStaffExpanded] = useState(true);
  const [isSupportExpanded, setIsSupportExpanded] = useState(true);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);
  const [isDemoExpanded, setIsDemoExpanded] = useState(true);

  const pendingReviewsCount = (productReviews || []).filter((r) => r?.status === "Pending").length;
  const activeStaffCount = (staffMembers || []).filter((s) => s?.status === "Active").length;
  const pendingSupportCount =
    (supportTickets || []).filter((t) => t?.status === "Open").length +
    (supportQueries || []).filter((q) => q?.status === "Unanswered").length;

  const activeCouponsCount = (coupons || []).filter((c) => c?.status === "Active").length;
  const newLeadsCount = (leads || []).filter((l) => l?.status === "New").length;
  const pendingStockQueriesCount = (stockQueries || []).filter((q) => q?.status === "Pending").length;
  const pendingVerificationCount = (orders || []).filter((o) => o?.verificationStatus === "Pending Verification").length;
  const actionRequiredOrdersCount = (orders || []).filter((o) => o?.orderStatus === "Pending" || o?.orderStatus === "Confirmed").length;
  const pendingReturnsCount = (returnsList || []).filter((r) => r?.returnStatus === "Requested").length;
  const pendingRefundsCount = (returnsList || []).filter((r) => r?.refundStatus === "Pending" || r?.refundStatus === "Approved" || r?.refundStatus === "Processing").length;
  const pendingNdrCount = (rtoItems || []).filter((r) => r?.rtoStatus === "Delivery Failed").length;
  const lowStockCount = (products || []).filter((p) => p?.stock > 0 && p?.stock <= p?.lowStockThreshold).length;

  const handleLogout = () => {
    dispatch(adminLogout());
    toast.info("Logged out of Admin Portal");
    navigate("/admin/login");
  };

  const analyticsSubItems = [
    {
      name: "Overview",
      path: "/admin/analytics",
      description: "Whole store performance summary",
      icon: BarChart3,
      exact: true,
    },
    {
      name: "Sales Analytics",
      path: "/admin/analytics/sales",
      description: "Sales and revenue analysis",
      icon: DollarSign,
    },
    {
      name: "Product Analytics",
      path: "/admin/analytics/products",
      description: "Product performance analysis",
      icon: Package,
    },
    {
      name: "Customer Analytics",
      path: "/admin/analytics/customers",
      description: "Customer behaviour and sales analysis",
      icon: Users,
    },
    {
      name: "Reports",
      path: "/admin/analytics/reports",
      description: "Detailed business reports",
      icon: FileSpreadsheet,
    },
  ];

  const archivedSubItems = [
    {
      name: "Products",
      path: "/admin/archived/products",
      description: "Archived products record",
      badge: archivedProducts.length,
      icon: Package,
      exact: true,
    },
    {
      name: "Orders",
      path: "/admin/archived/orders",
      description: "Archived orders record",
      badge: archivedOrders.length,
      icon: ClipboardList,
    },
    {
      name: "Customers",
      path: "/admin/archived/customers",
      description: "Archived customer records",
      badge: archivedCustomers.length,
      icon: Users,
    },
    {
      name: "Other Data",
      path: "/admin/archived/other",
      description: "Other archived data manage",
      icon: Database,
    },
  ];

  const stockQuerySubItems = [
    {
      name: "All Queries",
      path: "/admin/stock-queries",
      description: "all stock-related customer queries",
      badge: pendingStockQueriesCount > 0 ? pendingStockQueriesCount : null,
      badgeColor: "bg-amber-100 text-amber-800",
      icon: BellRing,
      exact: true,
    },
    {
      name: "Product Requests",
      path: "/admin/stock-queries/products",
      description: "Customers requested products",
      icon: Package,
    },
    {
      name: "Customer Requests",
      path: "/admin/stock-queries/customers",
      description: "Individual customer requests manage",
      icon: Users,
    },
    {
      name: "Query Reports",
      path: "/admin/stock-queries/reports",
      description: "Queries and demand reports",
      icon: FileSpreadsheet,
    },
  ];

  const leadsSubItems = [
    {
      name: "All Leads",
      path: "/admin/leads",
      description: "all leads central record",
      badge: newLeadsCount > 0 ? newLeadsCount : null,
      badgeColor: "bg-amber-100 text-amber-800",
      icon: Inbox,
      exact: true,
    },
    {
      name: "Customer Leads",
      path: "/admin/leads/customers",
      description: "Potential customer enquiries",
      icon: Users,
    },
    {
      name: "Wholesale Leads",
      path: "/admin/leads/wholesale",
      description: "Wholesale business enquiries",
      icon: Briefcase,
    },
    {
      name: "Dropshipping Leads",
      path: "/admin/leads/dropshipping",
      description: "Dropshipping partner enquiries",
      icon: Truck,
    },
    {
      name: "Franchise Leads",
      path: "/admin/leads/franchise",
      description: "Franchise partner enquiries",
      icon: Store,
    },
  ];

  const utilitiesSubItems = [
    {
      name: "Coupons & Offers",
      path: "/admin/utilities/coupons",
      description: "Coupons and promotional offers manage",
      badge: activeCouponsCount > 0 ? `${activeCouponsCount} Active` : null,
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: Tag,
      exact: true,
    },
    {
      name: "Loyalty Program",
      path: "/admin/utilities/loyalty",
      description: "Loyalty points and membership manage",
      icon: Crown,
    },
    {
      name: "Notifications",
      path: "/admin/utilities/notifications",
      description: "Customer notifications manage",
      icon: Bell,
    },
    {
      name: "Gift Cards",
      path: "/admin/utilities/gift-cards",
      description: "Gift cards create and manage",
      icon: Gift,
    },
    {
      name: "Other Utilities",
      path: "/admin/utilities/other",
      description: "other supporting ecommerce tools",
      icon: Wrench,
    },
  ];

  const websiteSubItems = [
    {
      name: "Homepage",
      path: "/admin/website/homepage",
      description: "Homepage content and sections manage",
      icon: Layers,
      exact: true,
    },
    {
      name: "Pages",
      path: "/admin/website/pages",
      description: "Website pages manage",
      badge: websitePages.length,
      badgeColor: "bg-blue-100 text-blue-800",
      icon: FileText,
    },
    {
      name: "Banners",
      path: "/admin/website/banners",
      description: "Promotional banners manage",
      badge: websiteBanners.filter((b) => b?.status === "Active").length > 0 ? `${websiteBanners.filter((b) => b?.status === "Active").length} Live` : null,
      badgeColor: "bg-amber-100 text-amber-800",
      icon: Sliders,
    },
    {
      name: "Website Content",
      path: "/admin/website/content",
      description: "Website text media content",
      icon: Database,
    },
    {
      name: "SEO",
      path: "/admin/website/seo",
      description: "SEO settings and metadata manage",
      icon: Globe,
    },
  ];

  const ecommerceSubItems = [
    {
      name: "Retail",
      path: "/admin/ecommerce/retail",
      description: "Retail selling and pricing management",
      badge: retailProducts.filter((p) => p?.channelStatus === "Active").length > 0 ? `${retailProducts.filter((p) => p?.channelStatus === "Active").length} SKUs` : null,
      badgeColor: "bg-orange-100 text-orange-800",
      icon: ShoppingBag,
      exact: true,
    },
    {
      name: "Wholesale",
      path: "/admin/ecommerce/wholesale",
      description: "Wholesale customers and pricing management",
      badge: wholesaleAccounts.length,
      badgeColor: "bg-blue-100 text-blue-800",
      icon: Briefcase,
    },
    {
      name: "Dropshipping",
      path: "/admin/ecommerce/dropshipping",
      description: "Dropshippers, products and orders manage",
      badge: dropshippers.length,
      badgeColor: "bg-purple-100 text-purple-800",
      icon: Truck,
    },
    {
      name: "Virtual Franchise",
      path: "/admin/ecommerce/virtual-franchise",
      description: "Virtual franchise partners and stores manage",
      badge: virtualFranchises.length,
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: Globe,
    },
    {
      name: "Physical Franchise",
      path: "/admin/ecommerce/physical-franchise",
      description: "Physical franchise outlets manage",
      badge: physicalFranchises.length,
      badgeColor: "bg-amber-100 text-amber-800",
      icon: Store,
    },
  ];

  const marketingSubItems = [
    {
      name: "Campaigns",
      path: "/admin/marketing/campaigns",
      description: "Marketing campaigns create and manage",
      badge: marketingCampaigns.filter((c) => c?.status === "Active").length > 0 ? `${marketingCampaigns.filter((c) => c?.status === "Active").length} Live` : null,
      badgeColor: "bg-rose-100 text-rose-800",
      icon: Target,
      exact: true,
    },
    {
      name: "Push Notifications",
      path: "/admin/marketing/push-notifications",
      description: "Promotional push notifications manage",
      badge: pushNotifications.length,
      badgeColor: "bg-blue-100 text-blue-800",
      icon: Smartphone,
    },
    {
      name: "WhatsApp Marketing",
      path: "/admin/marketing/whatsapp",
      description: "WhatsApp campaigns and messages manage",
      badge: whatsappCampaigns.length,
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: MessageCircle,
    },
    {
      name: "Email/SMS Marketing",
      path: "/admin/marketing/email-sms",
      description: "Email and SMS campaigns manage",
      icon: Mail,
    },
    {
      name: "Marketing Reports",
      path: "/admin/marketing/reports",
      description: "Campaign performance reports",
      icon: BarChart3,
    },
  ];

  const reviewsSubItems = [
    {
      name: "Product Reviews",
      path: "/admin/reviews/products",
      description: "Product-specific customer reviews",
      badge: productReviews.length > 0 ? productReviews.length : null,
      badgeColor: "bg-slate-100 text-slate-700",
      icon: Star,
      exact: true,
    },
    {
      name: "Customer Reviews",
      path: "/admin/reviews/customers",
      description: "General customer feedback",
      icon: MessageSquare,
    },
    {
      name: "Review Management",
      path: "/admin/reviews/management",
      description: "Reviews approve, reject and manage",
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Pending` : null,
      badgeColor: "bg-amber-100 text-amber-800",
      icon: ShieldCheck,
    },
    {
      name: "Review Reports",
      path: "/admin/reviews/reports",
      description: "Review performance and statistics",
      icon: BarChart3,
    },
  ];

  const staffSubItems = [
    {
      name: "All Staff",
      path: "/admin/staff/all",
      description: "all staff members manage",
      badge: staffMembers.length > 0 ? staffMembers.length : null,
      badgeColor: "bg-slate-100 text-slate-700",
      icon: Users,
      exact: true,
    },
    {
      name: "Add Staff",
      path: "/admin/staff/add",
      description: "New staff accounts create",
      icon: UserPlus,
    },
    {
      name: "Roles & Permissions",
      path: "/admin/staff/roles",
      description: "Staff access and permissions control",
      icon: ShieldCheck,
    },
    {
      name: "Staff Activity",
      path: "/admin/staff/activity",
      description: "Staff actions and activity monitor",
      icon: Activity,
    },
  ];

  const supportSubItems = [
    {
      name: "Support Tickets",
      path: "/admin/support/tickets",
      description: "Customer support tickets manage",
      badge: supportTickets.filter((t) => t?.status === "Open").length > 0 ? `${supportTickets.filter((t) => t?.status === "Open").length} Open` : null,
      badgeColor: "bg-amber-100 text-amber-800",
      icon: LifeBuoy,
      exact: true,
    },
    {
      name: "Customer Queries",
      path: "/admin/support/queries",
      description: "Customer questions and enquiries handle",
      badge: supportQueries.filter((q) => q?.status === "Unanswered").length > 0 ? `${supportQueries.filter((q) => q?.status === "Unanswered").length} New` : null,
      badgeColor: "bg-blue-100 text-blue-800",
      icon: MessageCircle,
    },
    {
      name: "Complaints",
      path: "/admin/support/complaints",
      description: "Customer complaints manage and resolve",
      badge: supportComplaints.filter((c) => c?.status === "Under Investigation").length > 0 ? `${supportComplaints.filter((c) => c?.status === "Under Investigation").length} Active` : null,
      badgeColor: "bg-rose-100 text-rose-800",
      icon: ShieldAlert,
    },
    {
      name: "Support Reports",
      path: "/admin/support/reports",
      description: "Support performance resolution reports",
      icon: BarChart3,
    },
  ];

  const settingsSubItems = [
    {
      name: "General Settings",
      path: "/admin/settings/general",
      description: "Basic website business settings",
      icon: Store,
      exact: true,
    },
    {
      name: "Payment Settings",
      path: "/admin/settings/payments",
      description: "Payment gateways and payment configuration",
      icon: CreditCard,
    },
    {
      name: "Shipping Settings",
      path: "/admin/settings/shipping",
      description: "Shipping, courier, shipping label and delivery settings",
      icon: Truck,
    },
    {
      name: "Tax/GST",
      path: "/admin/settings/tax",
      description: "Tax and GST configuration",
      icon: FileSpreadsheet,
    },
    {
      name: "Notifications",
      path: "/admin/settings/notifications",
      description: "Notification channels and preferences",
      icon: Bell,
    },
    {
      name: "Integrations",
      path: "/admin/settings/integrations",
      description: "Third-party APIs and integrations",
      icon: Sliders,
    },
    {
      name: "Security",
      path: "/admin/settings/security",
      description: "Login, access and security controls",
      icon: ShieldCheck,
    },
  ];

  const demoSubItems = [
    {
      name: "Demo Dashboard",
      path: "/admin/demo/dashboard",
      description: "For Demo sample dashboard",
      icon: Sparkles,
      exact: true,
    },
    {
      name: "Demo Products",
      path: "/admin/demo/products",
      description: "For Showing Sample products",
      icon: Boxes,
    },
    {
      name: "Demo Orders",
      path: "/admin/demo/orders",
      description: "Sample orders and workflow",
      icon: Truck,
    },
    {
      name: "Demo Features",
      path: "/admin/demo/features",
      description: "demonstration of System features",
      icon: Cpu,
    },
  ];

  const productSubItems = [
    {
      name: "All Products",
      path: "/admin/products",
      description: "All products catalogue",
      badge: products.length,
      icon: Package,
      exact: true,
    },
    {
      name: "Add Product",
      path: "/admin/products/add",
      description: "New products add",
      icon: PlusCircle,
    },
    {
      name: "Categories",
      path: "/admin/products/categories",
      description: "Categories and sub-categories manage",
      icon: FolderTree,
    },
    {
      name: "Inventory",
      path: "/admin/products/inventory",
      description: "Stock and inventory manage",
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
      badgeColor: "bg-amber-100 text-amber-800",
      icon: Boxes,
    },
    {
      name: "Product Attributes",
      path: "/admin/products/attributes",
      description: "Product specifications and attributes manage",
      icon: Sliders,
    },
  ];

  const orderSubItems = [
    {
      name: "All Orders",
      path: "/admin/orders",
      description: "Complete overview of all orders",
      badge: orders.length,
      icon: ClipboardList,
      exact: true,
    },
    {
      name: "Order Management",
      path: "/admin/orders/management",
      description: "Orders manage & process",
      badge: actionRequiredOrdersCount > 0 ? actionRequiredOrdersCount : null,
      badgeColor: "bg-amber-100 text-amber-800",
      icon: PackageCheck,
    },
    {
      name: "Delivery Verification",
      path: "/admin/orders/verification",
      description: "Order/customer verification before dispatch",
      badge: pendingVerificationCount > 0 ? pendingVerificationCount : null,
      badgeColor: "bg-rose-100 text-rose-800",
      icon: ShieldCheck,
    },
    {
      name: "Order Reports",
      path: "/admin/orders/reports",
      description: "Orders sales & status reports",
      icon: BarChart3,
    },
  ];

  const returnSubItems = [
    {
      name: "Returns",
      path: "/admin/returns",
      description: "Customer return requests manage",
      badge: pendingReturnsCount > 0 ? pendingReturnsCount : null,
      badgeColor: "bg-amber-100 text-amber-800",
      icon: RotateCcw,
      exact: true,
    },
    {
      name: "Refunds",
      path: "/admin/returns/refunds",
      description: "Customer refunds manage & process",
      badge: pendingRefundsCount > 0 ? pendingRefundsCount : null,
      badgeColor: "bg-purple-100 text-purple-800",
      icon: CreditCard,
    },
    {
      name: "Return/Refund Management",
      path: "/admin/returns/management",
      description: "Return & refund workflow control",
      icon: GitPullRequest,
    },
    {
      name: "Reports",
      path: "/admin/returns/reports",
      description: "Returns & refunds reports",
      icon: BarChart3,
    },
  ];

  const rtoSubItems = [
    {
      name: "RTO Orders",
      path: "/admin/rto",
      description: "All RTO orders record",
      badge: rtoItems.length,
      icon: Undo2,
      exact: true,
    },
    {
      name: "RTO Management",
      path: "/admin/rto/management",
      description: "RTO orders manage and resolve",
      badge: pendingNdrCount > 0 ? pendingNdrCount : null,
      badgeColor: "bg-rose-100 text-rose-800",
      icon: PackageCheck,
    },
    {
      name: "RTO Verification",
      path: "/admin/rto/verification",
      description: "RTO reason and case verification",
      icon: ShieldAlert,
    },
    {
      name: "RTO Reports",
      path: "/admin/rto/reports",
      description: "RTO performance and cost reports",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-albert-sans text-slate-800">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* ── Clean White Left Sidebar (Fixed Full Height) ── */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-72 h-screen bg-white text-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-200 shadow-sm",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent via-accent-400 to-accent-500 flex items-center justify-center text-white shadow-md">
              <Store className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-poppins font-black text-base text-slate-900 tracking-tight block leading-tight">
                ApexMart
              </span>
              <span className="text-[10px] font-poppins font-bold text-accent tracking-wider uppercase">
                Enterprise Admin
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
          <div>
            <p className="text-[10px] font-poppins font-black uppercase tracking-widest text-slate-400 px-3 mb-2">
              Order Fulfillment Hub
            </p>

            {/* Orders Accordion Parent */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsOrdersExpanded(!isOrdersExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Orders</span>
                </div>
                {isOrdersExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                )}
              </button>

              {/* Submenu links */}
              {isOrdersExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {orderSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Products Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsProductsExpanded(!isProductsExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Products</span>
                </div>
                {isProductsExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                )}
              </button>

              {/* Products Submenu links */}
              {isProductsExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {productSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Returns & Refunds Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsReturnsExpanded(!isReturnsExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Returns & Refunds</span>
                </div>
                {isReturnsExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                )}
              </button>

              {/* Returns Submenu links */}
              {isReturnsExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {returnSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RTO (Return to Origin) Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsRtoExpanded(!isRtoExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Undo2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">RTO</span>
                </div>
                {isRtoExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                )}
              </button>

              {/* RTO Submenu links */}
              {isRtoExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {rtoSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Store Analytics Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsAnalyticsExpanded(!isAnalyticsExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Store Analytics</span>
                </div>
                {isAnalyticsExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                )}
              </button>

              {/* Store Analytics Submenu links */}
              {isAnalyticsExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {analyticsSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Archived Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsArchivedExpanded(!isArchivedExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Archive className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Archived</span>
                </div>
                {isArchivedExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                )}
              </button>

              {/* Archived Submenu links */}
              {isArchivedExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {archivedSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== null && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Out of Stock Query Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsStockQueriesExpanded(!isStockQueriesExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Out of Stock Query</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {pendingStockQueriesCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                      {pendingStockQueriesCount}
                    </span>
                  )}
                  {isStockQueriesExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </div>
              </button>

              {/* Out of Stock Query Submenu links */}
              {isStockQueriesExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {stockQuerySubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== null && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Leads Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsLeadsExpanded(!isLeadsExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Leads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {newLeadsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                      {newLeadsCount} New
                    </span>
                  )}
                  {isLeadsExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </div>
              </button>

              {/* Leads Submenu links */}
              {isLeadsExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {leadsSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== null && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Utilities Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsUtilitiesExpanded(!isUtilitiesExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Utilities</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeCouponsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      {activeCouponsCount} Active
                    </span>
                  )}
                  {isUtilitiesExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </div>
              </button>

              {/* Utilities Submenu links */}
              {isUtilitiesExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {utilitiesSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== null && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Website Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsWebsiteExpanded(!isWebsiteExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Website</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isWebsiteExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </div>
              </button>

              {/* Website Submenu links */}
              {isWebsiteExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {websiteSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== null && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* E-Commerce Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsEcommerceExpanded(!isEcommerceExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">E-Commerce</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isEcommerceExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </div>
              </button>

              {/* E-Commerce Submenu links */}
              {isEcommerceExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {ecommerceSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== null && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Marketing Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsMarketingExpanded(!isMarketingExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Marketing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isMarketingExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </div>
              </button>

              {/* Marketing Submenu links */}
              {isMarketingExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {marketingSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== null && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reviews Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Star className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Reviews</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {pendingReviewsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                      {pendingReviewsCount} Pending
                    </span>
                  )}
                  {isReviewsExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </div>
              </button>

              {/* Reviews Submenu links */}
              {isReviewsExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {reviewsSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== null && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Staff Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsStaffExpanded(!isStaffExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Staff</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {staffMembers.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700">
                      {staffMembers.length}
                    </span>
                  )}
                  {isStaffExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </div>
              </button>

              {/* Staff Submenu links */}
              {isStaffExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {staffSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== null && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Support Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsSupportExpanded(!isSupportExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Support</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {pendingSupportCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                      {pendingSupportCount} Action
                    </span>
                  )}
                  {isSupportExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </div>
              </button>

              {/* Support Submenu links */}
              {isSupportExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {supportSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== null && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Settings Accordion Parent */}
            <div className="space-y-1 mt-2">
              <button
                type="button"
                onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-900">Settings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isSettingsExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </div>
              </button>

              {/* Settings Submenu links */}
              {isSettingsExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {settingsSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== null && (
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                              isActive
                                ? "bg-white/25 text-white"
                                : item.badgeColor || "bg-slate-100 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Demo Accordion Parent */}
            <div className="space-y-1 pt-2">
              <button
                type="button"
                onClick={() => setIsDemoExpanded(!isDemoExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-poppins font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="truncate">Demo Sandbox</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                    Live
                  </span>
                  {isDemoExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </div>
              </button>

              {/* Demo Submenu links */}
              {isDemoExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fadeIn">
                  {demoSubItems.map((item) => {
                    const isActive = item.exact
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-poppins font-semibold transition-all group",
                          isActive
                            ? "bg-accent text-white shadow-xs font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-accent")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Storefront Link */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-poppins font-black uppercase tracking-widest text-slate-400 px-3 mb-2">
              Public Portal
            </p>
            <Link
              to="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-poppins font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-accent" />
              <span>Customer Storefront</span>
            </Link>
          </div>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={adminUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt="Admin"
              className="w-9 h-9 rounded-xl object-cover border border-slate-200"
            />
            <div className="min-w-0">
              <p className="text-xs font-poppins font-bold text-slate-900 truncate leading-tight">
                {adminUser?.name || "Super Admin"}
              </p>
              <p className="text-[10px] text-slate-500 font-inter truncate">
                {adminUser?.role || "Master Admin"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout of Admin"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Main Content Column (Offset by fixed left sidebar on desktop) ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 bg-slate-50/70 min-h-screen">
        {/* Top White Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          {/* Mobile hamburger & Live status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-poppins font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Wholesale Gateway Live</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin/orders/verification"
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Verification Alerts"
            >
              <Bell className="w-4 h-4" />
              {pendingVerificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </Link>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-2 text-xs font-poppins font-bold text-slate-800">
              <span className="hidden md:inline text-slate-900">{adminUser?.name || "Administrator"}</span>
              <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-black uppercase">
                Active
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
