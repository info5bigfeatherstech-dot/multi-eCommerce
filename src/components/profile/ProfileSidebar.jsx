import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Lock,
  Bell,
  LogOut,
  ShoppingBag,
  Heart,
} from "lucide-react";

export const ProfileSidebar = React.memo(function ProfileSidebar({
  activeTab,
  onSignOut,
}) {
  const navigate = useNavigate();
  const cartCount = useAppSelector((state) => state.cart.totalCount);
  const wishlistCount = useAppSelector((state) => state.wishlist.totalCount);

  const tabs = [
    {
      id: "info",
      path: "/profile/info",
      label: "Business & Profile",
      icon: Building2,
      desc: "Name, GSTIN, and contact details",
    },
    {
      id: "addresses",
      path: "/profile/addresses",
      label: "Delivery Addresses",
      icon: MapPin,
      desc: "Add & edit shipping locations",
    },
    {
      id: "cart",
      path: "/profile/cart",
      label: "My Cart",
      icon: ShoppingBag,
      desc: "Review items & proceed to checkout",
      badge: cartCount > 0 ? cartCount : null,
      badgeColor: "bg-accent text-white",
    },
    {
      id: "wishlist",
      path: "/profile/wishlist",
      label: "My Wishlist",
      icon: Heart,
      desc: "Saved wholesale items & re-order",
      badge: wishlistCount > 0 ? wishlistCount : null,
      badgeColor: "bg-rose-500 text-white",
    },
    {
      id: "security",
      path: "/profile/security",
      label: "Login & Security",
      icon: Lock,
      desc: "Password and access controls",
    },
    {
      id: "preferences",
      path: "/profile/preferences",
      label: "Wholesale Alerts",
      icon: Bell,
      desc: "Notifications and billing preference",
    },
  ];

  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-2 sm:p-3 lg:p-4">
      {/* On mobile/tablet: horizontal scrollable tab strip; on lg+: vertical list */}
      <div className="flex lg:flex-col gap-1.5 lg:space-y-1 overflow-x-auto lg:overflow-x-visible no-scrollbar pb-0.5 lg:pb-0">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabClick(t)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 lg:gap-3 px-3 py-2 lg:py-3 rounded-xl lg:rounded-2xl text-left transition-all duration-150 cursor-pointer group",
                "lg:w-full lg:items-start lg:justify-between",
                isActive
                  ? "bg-accent/10 text-accent font-semibold shadow-2xs border border-accent/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-2 lg:gap-3.5 min-w-0">
                <div
                  className={cn(
                    "w-8 h-8 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                    isActive
                      ? "bg-accent text-white"
                      : "bg-slate-100 text-slate-500 group-hover:text-slate-700"
                  )}
                >
                  <Icon size={17} />
                </div>
                <div className="min-w-0">
                  <p className="font-poppins text-xs sm:text-sm font-bold whitespace-nowrap lg:truncate leading-tight">
                    {t.label}
                  </p>
                  <p className="hidden lg:block text-[11px] text-slate-400 font-inter truncate mt-0.5">
                    {t.desc}
                  </p>
                </div>
              </div>

              {t.badge !== null && t.badge !== undefined && (
                <span
                  className={cn(
                    "text-[10px] font-poppins font-black px-2 py-0.5 rounded-full flex-shrink-0 lg:mt-1 shadow-2xs",
                    t.badgeColor
                  )}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-100 mt-2">
        <button
          type="button"
          onClick={onSignOut}
          className="flex-shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-3 py-2 lg:py-3 rounded-xl lg:rounded-2xl text-left text-rose-600 hover:bg-rose-50 font-poppins text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center flex-shrink-0">
            <LogOut size={17} />
          </div>
          <span className="whitespace-nowrap">Sign Out</span>
        </button>
      </div>
    </div>
  );
});

export default ProfileSidebar;
