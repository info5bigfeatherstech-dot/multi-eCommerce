"use client";

import React, { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginSuccess, logout, openAuthModal } from "@/store/slices/uiSlice";
import { toast } from "sonner";
import { User } from "lucide-react";

import {
  ProfileHeader,
  ProfileSidebar,
  ProfileInfoTab,
  ProfileAddressesTab,
  ProfileCartTab,
  ProfileWishlistTab,
  ProfileSecurityTab,
  ProfilePreferencesTab,
} from "@/components/profile";

export function ProfilePage() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.ui);

  // Derive active tab from URL param (default to "info" for /profile)
  const validTabs = [
    "info",
    "addresses",
    "cart",
    "wishlist",
    "security",
    "preferences",
  ];
  const activeTab = validTabs.includes(tab) ? tab : "info";

  // Stable callbacks
  const handleUpdateProfile = useCallback(
    (updatedFields) => {
      dispatch(
        loginSuccess({
          ...user,
          ...updatedFields,
        })
      );
    },
    [dispatch, user]
  );

  const handleSignOut = useCallback(() => {
    dispatch(logout());
    toast.success("You have been signed out.");
    navigate("/");
  }, [dispatch, navigate]);

  // If not logged in, show an attractive prompt that opens the login modal
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200/90 shadow-xl text-center animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
          <User size={28} />
        </div>
        <h2 className="font-poppins font-extrabold text-xl text-slate-900 mb-1.5">
          Wholesale Account Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-inter mb-6 leading-relaxed">
          Please sign in to access your wholesale buyer profile, registered GST information, saved delivery addresses, and order history.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => dispatch(openAuthModal("login"))}
            className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 transition-all cursor-pointer"
          >
            Sign In to Account
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-poppins text-xs font-semibold transition-all cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* 1. Memoized Profile Hero Banner */}
      <ProfileHeader user={user} />

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Nav (Links reflect in the URL: /profile/addresses, etc.) */}
        <div className="lg:col-span-1">
          <ProfileSidebar activeTab={activeTab} onSignOut={handleSignOut} />
        </div>

        {/* Tab Panels: Kept mounted in the DOM to PREVENT remounting & re-fetching APIs */}
        <div className="lg:col-span-3">
          <div className={activeTab === "info" ? "block" : "hidden"}>
            <ProfileInfoTab user={user} onUpdateProfile={handleUpdateProfile} />
          </div>

          <div className={activeTab === "addresses" ? "block" : "hidden"}>
            <ProfileAddressesTab />
          </div>

          <div className={activeTab === "cart" ? "block" : "hidden"}>
            <ProfileCartTab />
          </div>

          <div className={activeTab === "wishlist" ? "block" : "hidden"}>
            <ProfileWishlistTab />
          </div>

          <div className={activeTab === "security" ? "block" : "hidden"}>
            <ProfileSecurityTab />
          </div>

          <div className={activeTab === "preferences" ? "block" : "hidden"}>
            <ProfilePreferencesTab />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
