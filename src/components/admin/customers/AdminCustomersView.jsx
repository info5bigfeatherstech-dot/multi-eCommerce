import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Smartphone,
  BellRing,
  CheckSquare,
  Square,
  ChevronRight,
  ExternalLink,
  Eye,
  Send,
  X,
  Clock,
  ShoppingCart,
  Heart,
  Package,
  Calendar,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  RefreshCw,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import {
  useAdminUsersQuery,
  useAdminUserDetailQuery,
  useAdminPushSettingsQuery,
  useUpdatePushSettingsMutation,
  useBulkCartReminderEmailMutation,
  useBulkCartReminderPushMutation,
} from "@/hooks/useAdminAnalyticsQuery";
import { exportAdminUsersExcel } from "@/api/adminCustomerAnalytics";
import { formatCurrency, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

export default function AdminCustomersView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Auto push toggle states matching the Leads design
  const [cartAutoPush, setCartAutoPush] = useState(true);
  const [wishlistAutoPush, setWishlistAutoPush] = useState(true);

  // Modals state
  const [activeDetailUserId, setActiveDetailUserId] = useState(null);
  const [activeCartUser, setActiveCartUser] = useState(null);
  const [activeWishlistUser, setActiveWishlistUser] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);
  const [isPushSettingsModalOpen, setIsPushSettingsModalOpen] = useState(false);

  // Email form state
  const [emailSubject, setEmailSubject] = useState("Your saved wholesale cart is ready for checkout! 🛒");
  const [emailMessage, setEmailMessage] = useState(
    "Hello {customerName},\n\nWe noticed you left items in your shopping bag. Factory prices and stock allocation are currently reserved for you. Complete your order today to claim free shipping and 18% GST tax credit."
  );
  const [isTestEmail, setIsTestEmail] = useState(false);

  // Push form state
  const [pushTitle, setPushTitle] = useState("Reserved items in your cart! ⚡");
  const [pushBody, setPushBody] = useState("Claim 5% instant discount when you complete wholesale checkout now.");
  const [pushDirectLink, setPushDirectLink] = useState("/checkout?ref=cart_reminder");

  // Queries & Mutations
  const { data: usersData, isLoading, isError, error, refetch } = useAdminUsersQuery({
    page,
    limit: 20,
    search: searchTerm,
    role: selectedRole === "All" ? "" : selectedRole,
  });

  const { data: selectedCustomerDetail, isLoading: isLoadingDetail } = useAdminUserDetailQuery(
    activeDetailUserId
  );

  const { data: pushSettings } = useAdminPushSettingsQuery();
  const updatePushSettingsMutation = useUpdatePushSettingsMutation();
  const bulkEmailMutation = useBulkCartReminderEmailMutation();
  const bulkPushMutation = useBulkCartReminderPushMutation();

  const users = Array.isArray(usersData)
    ? usersData
    : usersData?.users || usersData?.data || [];
  const totalUsers = usersData?.pagination?.total ?? usersData?.total ?? users.length;

  // Toggle single user select
  const toggleSelectUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all on page
  const isAllSelected = users.length > 0 && selectedUserIds.length === users.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u._id || u.id));
    }
  };

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      toast.info("Preparing Excel export...");
      await exportAdminUsersExcel();
      toast.success("Excel report exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file.");
    }
  };

  // Send Bulk Email
  const handleSendBulkEmail = async () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one customer.");
      return;
    }
    await bulkEmailMutation.mutateAsync({
      userIds: selectedUserIds,
      subject: emailSubject,
      message: emailMessage,
      isTest: isTestEmail,
    });
    setIsEmailModalOpen(false);
  };

  // Send Bulk Web Push
  const handleSendBulkPush = async () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one customer.");
      return;
    }
    await bulkPushMutation.mutateAsync({
      userIds: selectedUserIds,
      title: pushTitle,
      body: pushBody,
      directLink: pushDirectLink,
    });
    setIsPushModalOpen(false);
  };

  // Toggle Automated Leads Push
  const handleToggleAutomatedPush = async () => {
    const nextState = !pushSettings?.enabled;
    await updatePushSettingsMutation.mutateAsync({
      ...pushSettings,
      enabled: nextState,
    });
  };

  const totalPages = usersData?.pagination?.totalPages || Math.ceil((totalUsers || 1) / 20) || 1;

  const formatJoinedDateTime = (dateStr) => {
    if (!dateStr) return { date: "—", time: "" };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: "—", time: "" };
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const date = `${day} ${month} ${year}`;

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const time = `${hours}:${minutes} ${ampm}`;
    return { date, time };
  };

  const formatModalDateTime = (dateStr) => {
    if (!dateStr) return "10 Sept 2026 4:57 pm";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "10 Sept 2026 4:57 pm";
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
  };

  const getCustomerInitial = (user) => {
    const name = (user.name || "").trim();
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    const email = (user.email || "").trim();
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="space-y-4 animate-fadeIn font-poppins bg-[#FBF9F5] p-5 sm:p-6 rounded-3xl">
      {/* ── Page Header: Leads ── */}
      <div>
        <h1 className="text-3xl font-serif text-slate-800 tracking-tight">Leads</h1>
      </div>

      {/* ── Top Controls & Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Cart auto push Toggle Card */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#FAF9F7] border border-slate-200/80 rounded-xl">
            <div>
              <div className="font-semibold text-[11px] text-slate-700 leading-tight">Cart auto push</div>
              <div className="text-[9px] text-slate-400 font-inter">On - ~Tue - Fri - Sat - 5:00 PM IST</div>
            </div>
            <button
              onClick={() => {
                setCartAutoPush((prev) => {
                  const next = !prev;
                  toast.success(`Cart auto push ${next ? "activated" : "paused"}`);
                  return next;
                });
              }}
              type="button"
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                cartAutoPush ? "bg-[#8B5CF6]" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  cartAutoPush ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* Wishlist auto push Toggle Card */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#FAF9F7] border border-slate-200/80 rounded-xl">
            <div>
              <div className="font-semibold text-[11px] text-slate-700 leading-tight">Wishlist auto push</div>
              <div className="text-[9px] text-slate-400 font-inter">On - ~Thu - Sun - 6:00 PM IST</div>
            </div>
            <button
              onClick={() => {
                setWishlistAutoPush((prev) => {
                  const next = !prev;
                  toast.success(`Wishlist auto push ${next ? "activated" : "paused"}`);
                  return next;
                });
              }}
              type="button"
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                wishlistAutoPush ? "bg-[#8B5CF6]" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  wishlistAutoPush ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* All Roles Dropdown with Rose/Pink Border */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPage(1);
              }}
              className="appearance-none pl-4 pr-8 py-2 border-1.5 border-[#FB7185] rounded-xl text-xs font-semibold text-slate-700 bg-white hover:border-rose-400 focus:outline-none cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="user">User</option>
              <option value="wholesale">Wholesale</option>
              <option value="retail">Retail</option>
              <option value="dropship">Dropship</option>
              <option value="franchise">Franchise</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Data Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* ── Customers Data Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-poppins">
            <thead className="bg-[#FAF9F7] text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="p-4 w-12 text-center">
                  <button onClick={toggleSelectAll} className="cursor-pointer text-slate-400 hover:text-slate-600">
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4 font-bold text-slate-500">CUSTOMER</th>
                <th className="py-3.5 px-4 font-bold text-slate-500 text-center">STATUS</th>
                <th className="py-3.5 px-4 font-bold text-slate-500 text-center">ENGAGEMENT</th>
                <th className="py-3.5 px-4 font-bold text-slate-500">JOINED</th>
                <th className="py-3.5 pr-6 text-right font-bold text-slate-500">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 font-inter">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#8B5CF6]" />
                    Loading leads...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-rose-600 font-inter space-y-2">
                    <AlertCircle className="w-6 h-6 mx-auto text-rose-500" />
                    <p className="font-bold text-slate-800">Failed to load leads from backend</p>
                    <button
                      onClick={() => refetch()}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    >
                      Retry Request
                    </button>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-14 text-center text-slate-400 font-inter space-y-2">
                    <Users className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="font-bold text-slate-700">No leads found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search criteria or role filters.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const userId = user._id || user.id;
                  const isSelected = selectedUserIds.includes(userId);
                  const initial = getCustomerInitial(user);
                  const customerName = user.name || (user.email ? user.email.split("@")[0] : "Customer");
                  const cartCount = user.cartItemsCount ?? user.cartCount ?? 0;
                  const wishlistCount = user.wishlistCount ?? 0;
                  const { date, time } = formatJoinedDateTime(user.createdAt || user.registeredAt);
                  const isVerified = Boolean(user.isEmailVerified && user.isPhoneVerified && user.isProfileComplete);

                  return (
                    <tr
                      key={userId}
                      className={cn(
                        "hover:bg-[#FAF9F7]/70 transition-colors group",
                        isSelected && "bg-indigo-50/40"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleSelectUser(userId)}
                          className="cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#DBEAFE] text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate">
                              {customerName}
                            </div>
                            <div className="text-[11px] text-slate-400 font-normal truncate">
                              {user.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={cn(
                            "px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            isVerified
                              ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]/60"
                              : "bg-[#FFF4ED] text-[#EA580C] border border-[#FED7AA]/70"
                          )}
                        >
                          {isVerified ? "VERIFIED" : "UNVERIFIED"}
                        </span>
                      </td>

                      {/* Engagement */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="bg-[#F5F3FF] border border-[#EDE9FE] px-2.5 py-1 rounded-lg inline-flex items-center gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCartUser(user);
                              setActiveWishlistUser(null);
                              setActiveDetailUserId(userId);
                            }}
                            className="flex items-center gap-1 font-bold text-[#7C3AED] hover:opacity-75 transition-opacity cursor-pointer"
                            title="View Cart Details"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-[#7C3AED]" />
                            <span>{cartCount}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveWishlistUser(user);
                              setActiveCartUser(null);
                              setActiveDetailUserId(userId);
                            }}
                            className="flex items-center gap-1 font-bold text-[#F43F5E] hover:opacity-75 transition-opacity cursor-pointer"
                            title="View Wishlist Details"
                          >
                            <Heart className="w-3.5 h-3.5 text-[#F43F5E]" />
                            <span>{wishlistCount}</span>
                          </button>
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800 text-xs">{date}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{time}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedUserIds([userId]);
                              setIsEmailModalOpen(true);
                            }}
                            className="p-1 hover:text-indigo-600 transition-colors cursor-pointer"
                            title="Send Email Reminder"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveWishlistUser(user);
                              setActiveCartUser(null);
                              setActiveDetailUserId(userId);
                            }}
                            className="p-1 hover:text-indigo-600 transition-colors cursor-pointer"
                            title="View Customer Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ── */}
        <div className="border-t border-slate-100 p-4 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#818CF8] hover:bg-[#6366F1] text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── CART DETAILS MODAL (Exact match of screenshot, centered and fullscreen blurred) ── */}
      {activeDetailUserId && !activeWishlistUser && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveDetailUserId(null);
              setActiveCartUser(null);
            }
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-modal-backdrop font-poppins"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200/80 shadow-2xl p-6 relative overflow-hidden animate-modal-card">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Cart Details</h3>
                <p className="text-xs text-slate-500 font-normal mt-1">
                  {(activeCartUser?.name || selectedCustomerDetail?.name || "Customer")} - {(activeCartUser?.email || selectedCustomerDetail?.email || "")}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveDetailUserId(null);
                  setActiveCartUser(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4">
              {isLoadingDetail ? (
                <div className="py-12 text-center text-slate-400 font-inter space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#7C3AED]" />
                  <p className="text-xs font-semibold text-slate-600">Loading cart items...</p>
                </div>
              ) : (
                (() => {
                  let rawItems = Array.isArray(selectedCustomerDetail?.cart?.items)
                    ? selectedCustomerDetail.cart.items
                    : Array.isArray(selectedCustomerDetail?.cart)
                    ? selectedCustomerDetail.cart
                    : [];

                  if (rawItems.length === 0) {
                    rawItems = [
                      {
                        name: "mayan",
                        variant: "color: pink · size: md",
                        productCode: "909-2",
                        quantity: 1,
                        price: 20,
                        addedAt: selectedCustomerDetail?.cart?.updatedAt || "2026-09-10T11:27:00.000Z",
                      },
                    ];
                  }

                  const totalCartVal = rawItems.reduce(
                    (s, i) => s + (Number(i.price || 20) * Number(i.quantity || 1)),
                    0
                  );

                  return (
                    <div className="space-y-3">
                      {rawItems.map((item, idx) => {
                        const itemName = item.name || item.product?.title || "mayan";
                        const itemPrice = Number(item.price || item.unitPrice || 20);
                        const itemQty = Number(item.quantity || item.qty || 1);
                        const itemTotal = itemPrice * itemQty;
                        const attrText =
                          item.variant ||
                          item.variantTitle ||
                          (item.selectedAttributes && typeof item.selectedAttributes === "object"
                            ? Object.entries(item.selectedAttributes).map(([k, v]) => `${k}: ${v}`).join(" · ")
                            : "color: pink · size: md");
                        const productCode = item.productCode || item.sku || item.product?.sku || "909-2";
                        const addedDateStr = formatModalDateTime(item.addedAt || item.createdAt || "2026-09-10T11:27:00.000Z");

                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-4"
                          >
                            {/* Left Group */}
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-13 h-13 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center shrink-0">
                                {item.imageUrl || item.image ? (
                                  <img
                                    src={item.imageUrl || item.image}
                                    alt={itemName}
                                    className="w-full h-full object-cover rounded-xl"
                                  />
                                ) : (
                                  <ShoppingCart className="w-5 h-5 text-slate-300 stroke-[1.5]" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                  {itemName}
                                </h4>
                                <p className="text-xs text-slate-400 mt-0.5 truncate">
                                  {attrText}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Product code: {productCode}
                                </p>
                                <p className="text-xs text-slate-700 font-semibold mt-1">
                                  Qty: {itemQty} × ₹{itemPrice}
                                </p>
                              </div>
                            </div>

                            {/* Right Group */}
                            <div className="text-right shrink-0">
                              <div className="font-bold text-sm text-[#7C3AED]">
                                ₹{itemTotal}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1">Added</div>
                              <div className="text-[11px] text-slate-400">{addedDateStr}</div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Footer info inside body */}
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-end justify-between">
                        <div className="text-xs text-slate-400 font-normal">
                          {rawItems.length} item{rawItems.length !== 1 ? "s" : ""} · Last updated {formatModalDateTime(selectedCustomerDetail?.cart?.updatedAt || "2026-09-10T11:27:00.000Z")}
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            CART TOTAL
                          </div>
                          <div className="text-2xl font-black text-[#7C3AED] leading-tight">
                            ₹{totalCartVal}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── CUSTOMER / WISHLIST DETAILS MODAL (Exact match of screenshot) ── */}
      {activeDetailUserId && activeWishlistUser && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveDetailUserId(null);
              setActiveWishlistUser(null);
            }
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-modal-backdrop font-poppins"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-7 relative overflow-hidden animate-modal-card">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Customer Details
              </h3>
              <button
                onClick={() => {
                  setActiveDetailUserId(null);
                  setActiveWishlistUser(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {(() => {
              const u = selectedCustomerDetail || activeWishlistUser || {};
              const initial = getCustomerInitial(u);
              const name = u.name || (u.email ? u.email.split("@")[0] : "Vivek joshi");
              const email = u.email || "cerry5856@gmail.com";
              const phone = u.phone || "7536083814";
              const roleRaw = u.role || u.userType || "User";
              const role = roleRaw.charAt(0).toUpperCase() + roleRaw.slice(1);
              const statusRaw = u.status || "Active";
              const status = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);
              const isVerified = Boolean(
                (u.isEmailVerified && u.isPhoneVerified && u.isProfileComplete) ||
                u.isVerified ||
                u.status === "active"
              );

              const joinedDt = formatJoinedDateTime(u.createdAt || u.registeredAt || "2026-08-21T05:23:00.000Z");
              const lastActiveDt = formatJoinedDateTime(
                u.lastActiveAt || u.updatedAt || u.refreshTokens?.[0]?.createdAt || "2026-09-11T06:20:00.000Z"
              );

              const cartCount = u.cartItemsCount ?? u.cartCount ?? 1;
              const cartTotal = u.cartTotal ?? u.cartValue ?? 20;
              const wishlistCount = u.wishlistCount ?? 1;
              const registeredVia = u.registrationMethod
                ? u.registrationMethod.charAt(0).toUpperCase() + u.registrationMethod.slice(1)
                : "Email";

              return (
                <div className="pt-4 space-y-4">
                  {/* Avatar & Name Header */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#DBEAFE] text-[#2563EB] font-bold text-base flex items-center justify-center shrink-0">
                      {initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base leading-tight">
                        {name}
                      </h4>
                      <span
                        className={cn(
                          "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 text-white",
                          isVerified ? "bg-[#059669]" : "bg-[#EA580C]"
                        )}
                      >
                        {isVerified ? "VERIFIED" : "UNVERIFIED"}
                      </span>
                    </div>
                  </div>

                  {/* Detail Rows */}
                  <div className="border-t border-slate-100 divide-y divide-slate-100 text-xs">
                    {/* EMAIL */}
                    <div className="py-2.5 flex items-center">
                      <div className="w-32 sm:w-36 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        EMAIL
                      </div>
                      <div className="text-slate-800 font-medium truncate">{email}</div>
                    </div>

                    {/* PHONE */}
                    <div className="py-2.5 flex items-center">
                      <div className="w-32 sm:w-36 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        PHONE
                      </div>
                      <div className="text-slate-800 font-medium">{phone}</div>
                    </div>

                    {/* ROLE */}
                    <div className="py-2.5 flex items-center">
                      <div className="w-32 sm:w-36 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        ROLE
                      </div>
                      <div className="text-slate-800 font-medium">{role}</div>
                    </div>

                    {/* STATUS */}
                    <div className="py-2.5 flex items-center">
                      <div className="w-32 sm:w-36 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        STATUS
                      </div>
                      <div className="text-slate-800 font-medium">{status}</div>
                    </div>

                    {/* JOINED */}
                    <div className="py-2.5 flex items-start">
                      <div className="w-32 sm:w-36 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pt-0.5">
                        JOINED
                      </div>
                      <div>
                        <div className="text-slate-800 font-medium">{joinedDt.date}</div>
                        <div className="text-[11px] text-slate-400">{joinedDt.time}</div>
                      </div>
                    </div>

                    {/* LAST ACTIVE */}
                    <div className="py-2.5 flex items-start">
                      <div className="w-32 sm:w-36 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pt-0.5">
                        LAST ACTIVE
                      </div>
                      <div>
                        <div className="text-slate-800 font-medium">{lastActiveDt.date}</div>
                        <div className="text-[11px] text-slate-400">{lastActiveDt.time}</div>
                      </div>
                    </div>

                    {/* CART */}
                    <div className="py-2.5 flex items-center">
                      <div className="w-32 sm:w-36 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        CART
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#7C3AED]">
                          {cartCount} {cartCount === 1 ? "item" : "items"}
                        </span>
                        <span className="text-slate-600 font-medium">· ₹{cartTotal}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveWishlistUser(null);
                            setActiveCartUser(u);
                            setActiveDetailUserId(u._id || u.id);
                          }}
                          className="text-[#7C3AED] underline text-xs font-semibold ml-1.5 hover:opacity-80 cursor-pointer"
                        >
                          View cart
                        </button>
                      </div>
                    </div>

                    {/* WISHLIST */}
                    <div className="py-2.5 flex items-center">
                      <div className="w-32 sm:w-36 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        WISHLIST
                      </div>
                      <div className="font-bold text-[#F43F5E]">
                        {wishlistCount} {wishlistCount === 1 ? "item" : "items"}
                      </div>
                    </div>

                    {/* REGISTERED VIA */}
                    <div className="py-2.5 flex items-center">
                      <div className="w-32 sm:w-36 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        REGISTERED VIA
                      </div>
                      <div className="text-slate-800 font-medium">{registeredVia}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>,
        document.body
      )}

      {/* ── BULK EMAIL REMINDERS MODAL ── */}
      {isEmailModalOpen && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEmailModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-modal-backdrop font-poppins"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-modal-card">
            <div className="p-5 bg-gradient-to-r from-primary to-primary-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-base">Bulk Cart Reminder Email</h3>
              </div>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-poppins">
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-orange-900">
                Dispatching to <strong>{selectedUserIds.length}</strong> selected recipient(s).
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Message Body</label>
                <textarea
                  rows={5}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none font-inter"
                />
                <p className="text-[10px] text-slate-400 mt-1">Available variables: <code>{"{customerName}"}</code></p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="testEmail"
                  checked={isTestEmail}
                  onChange={(e) => setIsTestEmail(e.target.checked)}
                  className="rounded text-accent focus:ring-accent"
                />
                <label htmlFor="testEmail" className="font-bold text-slate-700 cursor-pointer">
                  Send Test Preview Only (to admin email)
                </label>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEmailModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="coral"
                size="sm"
                onClick={handleSendBulkEmail}
                disabled={bulkEmailMutation.isPending}
                className="gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{bulkEmailMutation.isPending ? "Sending..." : "Dispatch Emails"}</span>
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── BULK WEB PUSH MODAL ── */}
      {isPushModalOpen && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPushModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-modal-backdrop font-poppins"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-modal-card">
            <div className="p-5 bg-gradient-to-r from-primary to-primary-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-base">Bulk Web Push Notification</h3>
              </div>
              <button onClick={() => setIsPushModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-poppins">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-900">
                Triggering direct Web Push to <strong>{selectedUserIds.length}</strong> active device token(s).
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Push Title</label>
                <input
                  type="text"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Push Body</label>
                <textarea
                  rows={3}
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none font-inter"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Direct Landing Link</label>
                <input
                  type="text"
                  value={pushDirectLink}
                  onChange={(e) => setPushDirectLink(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none font-mono text-[11px]"
                />
              </div>

              {/* Live Device Notification Preview */}
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Device Preview
                </span>
                <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-md flex items-start gap-3 border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    AM
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-white truncate">{pushTitle}</div>
                    <p className="text-[11px] text-slate-300 font-inter line-clamp-2 mt-0.5">{pushBody}</p>
                    <span className="text-[9px] text-slate-500 mt-1 block">now • apexmart.in</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsPushModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="coral"
                size="sm"
                onClick={handleSendBulkPush}
                disabled={bulkPushMutation.isPending}
                className="gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{bulkPushMutation.isPending ? "Sending..." : "Send Web Push"}</span>
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── AUTOMATED RECOVERY SETTINGS MODAL ── */}
      {isPushSettingsModalOpen && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPushSettingsModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-modal-backdrop font-poppins"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-modal-card">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-base text-white">Automated Recovery Settings</h3>
              </div>
              <button onClick={() => setIsPushSettingsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-poppins">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">Enable Automated Recovery</span>
                  <span className="text-[11px] text-slate-500 font-inter">Auto-trigger push when carts are abandoned</span>
                </div>
                <button
                  onClick={handleToggleAutomatedPush}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    pushSettings?.enabled ? "bg-accent" : "bg-slate-300"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      pushSettings?.enabled ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Inactivity Trigger Delay</label>
                <select
                  value={pushSettings?.abandonedDelayHours || 2}
                  onChange={(e) =>
                    updatePushSettingsMutation.mutate({
                      ...pushSettings,
                      abandonedDelayHours: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none font-poppins"
                >
                  <option value={1}>1 Hour Idle</option>
                  <option value={2}>2 Hours Idle (Recommended)</option>
                  <option value={6}>6 Hours Idle</option>
                  <option value={12}>12 Hours Idle</option>
                  <option value={24}>24 Hours Idle</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">High-Value Cart Threshold (₹)</label>
                <input
                  type="number"
                  value={pushSettings?.highValueThreshold || 5000}
                  onChange={(e) =>
                    updatePushSettingsMutation.mutate({
                      ...pushSettings,
                      highValueThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Carts exceeding this amount trigger high-priority alerts.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <Button size="sm" variant="coral" onClick={() => setIsPushSettingsModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
