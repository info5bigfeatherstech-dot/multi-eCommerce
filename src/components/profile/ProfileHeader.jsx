import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { CheckCircle2, Mail, Phone, ShoppingBag, Heart, MapPin } from "lucide-react";

export const ProfileHeader = React.memo(function ProfileHeader({ user }) {
  const navigate = useNavigate();
  const cartCount = useAppSelector((state) => state.cart.totalCount);
  const wishlistCount = useAppSelector((state) => state.wishlist.totalCount);

  const initials = useMemo(() => {
    if (!user?.name) return "AP";
    const parts = user.name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }, [user?.name]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 mb-6 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent via-amber-500 to-primary" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-accent via-orange-500 to-amber-600 text-white font-poppins font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-accent/20 flex-shrink-0">
            {initials}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-poppins font-extrabold text-xl sm:text-2xl text-slate-900 truncate">
                {user?.name || "Wholesale Partner"}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-poppins font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <CheckCircle2 size={12} />
                Verified Buyer
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-inter mt-1 truncate">
              {user?.businessName || "ApexMart Business Wholesale Member"}
            </p>

            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 font-poppins">
              <span className="flex items-center gap-1">
                <Mail size={13} className="text-slate-400" />
                <span className="truncate">{user?.email || "partner@business.com"}</span>
              </span>
              {user?.phone && (
                <span className="hidden sm:flex items-center gap-1">
                  <Phone size={13} className="text-slate-400" />
                  <span>{user.phone}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => navigate("/profile/cart")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200/80 hover:border-accent/40 text-slate-700 hover:text-accent font-poppins text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
            title="View Cart"
          >
            <ShoppingBag size={15} className="text-accent group-hover:scale-110 transition-transform" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-accent text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile/wishlist")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-rose-50/60 border border-slate-200/80 hover:border-rose-300 text-slate-700 hover:text-rose-600 font-poppins text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
            title="View Wishlist"
          >
            <Heart size={15} className="text-rose-500 group-hover:scale-110 transition-transform" />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile/addresses")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 font-poppins text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
            title="Manage Addresses"
          >
            <MapPin size={15} className="text-slate-500 group-hover:scale-110 transition-transform" />
            <span>Addresses</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProfileHeader;
