"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeAuthModal, setAuthModalTab, loginSuccess } from "@/store/slices/uiSlice";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Store,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus,
  Check,
  Building2,
} from "lucide-react";

/* ─── Light-Theme Form Input Component (Pure Tailwind) ─────────────────── */
function Field({
  label,
  id,
  type = "text",
  icon: Icon,
  placeholder,
  value,
  onChange,
  required,
  extra,
}) {
  return (
    <div className="flex flex-col gap-1 mb-3 w-full min-w-0">
      <div className="flex items-center justify-between min-w-0 w-full gap-1">
        <label
          htmlFor={id}
          className="font-poppins text-[11px] font-semibold text-slate-600 uppercase tracking-wider min-w-0 truncate"
        >
          {label}
        </label>
        {required && (
          <span className="text-accent text-xs font-bold flex-shrink-0">*</span>
        )}
      </div>

      <div className="relative flex items-center bg-slate-50 hover:bg-white focus-within:bg-white border border-slate-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 rounded-xl transition-all duration-150 w-full min-w-0">
        <span className="flex items-center justify-center pl-3 pr-2 text-slate-400 focus-within:text-accent flex-shrink-0">
          <Icon size={16} />
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
          className="flex-1 w-0 min-w-0 bg-transparent border-0 outline-none font-poppins text-xs sm:text-sm text-slate-900 py-2.5 pr-2 placeholder:text-slate-400 placeholder:font-normal"
          required={required}
        />
        {extra}
      </div>
    </div>
  );
}

/* ─── Password Field with Eye Toggle ─────────────────────────────────────── */
function PasswordField({ label, id, placeholder, value, onChange, required }) {
  const [show, setShow] = useState(false);
  return (
    <Field
      label={label}
      id={id}
      type={show ? "text" : "password"}
      icon={Lock}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      extra={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="px-3 py-2 text-slate-400 hover:text-accent flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      }
    />
  );
}

/* ─── Main Modal (Hardware-Accelerated, Zero-Lag Tailwind) ───────────────── */
export default function AuthModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.isAuthModalOpen);
  const tab = useAppSelector((s) => s.ui.authModalTab);

  /* Form state */
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [regForm, setRegForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const overlayRef = useRef(null);
  const brandName = siteConfig?.name || "ApexMart";

  /* Close on Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => {
      if (e.key === "Escape") dispatch(closeAuthModal());
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isOpen, dispatch]);

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Reset feedback on tab change */
  useEffect(() => {
    setSuccess("");
    setError("");
  }, [tab]);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!loginForm.email || !loginForm.password) {
      setError("Please fill in both email/phone and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Welcome back! You have successfully signed in. ✓");
      dispatch(
        loginSuccess({
          name: loginForm.email.includes("@")
            ? loginForm.email.split("@")[0].replace(/[._-]/g, " ")
            : "Rahul Sharma",
          email: loginForm.email.includes("@") ? loginForm.email : `${loginForm.email}@phone.verified`,
          businessName: "Wholesale Partner",
        })
      );
      setTimeout(() => {
        dispatch(closeAuthModal());
      }, 1000);
    }, 800);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    if (!regForm.name || !regForm.phone || !regForm.email || !regForm.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (regForm.password !== regForm.confirm) {
      setError("Passwords do not match. Please verify.");
      return;
    }
    if (!regForm.terms) {
      setError("Please accept the Terms & Conditions to proceed.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Account created successfully! Welcome aboard. ✓");
      dispatch(
        loginSuccess({
          name: regForm.name,
          email: regForm.email,
          phone: regForm.phone,
          businessName: regForm.businessName || "Wholesale Partner",
        })
      );
      setTimeout(() => {
        dispatch(closeAuthModal());
      }, 1000);
    }, 900);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-modal-backdrop"
      onClick={(e) => {
        if (e.target === overlayRef.current) dispatch(closeAuthModal());
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Authentication"
    >
      <div className="relative w-full max-w-[540px] max-h-[92vh] flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden animate-modal-card transform-gpu">
        {/* Ambient top gradient bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-amber-500 to-orange-400 z-10" />

        {/* Close button */}
        <button
          onClick={() => dispatch(closeAuthModal())}
          aria-label="Close authentication modal"
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/80 flex items-center justify-center transition-all duration-200 hover:rotate-90 z-20 cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="pt-6 px-6 sm:px-8 pb-1 text-center flex-shrink-0">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center shadow-md shadow-accent/25 text-white">
              <Store size={20} strokeWidth={2.3} />
            </div>
            <span className="font-poppins font-extrabold text-xl text-slate-900 tracking-tight">
              {brandName}
            </span>
          </div>

          <h3 className="font-poppins text-lg sm:text-xl font-bold text-slate-900 mb-0.5">
            {tab === "login"
              ? "Sign In to Your Account"
              : "Create Wholesale Account"}
          </h3>

          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {tab === "login"
              ? "Access wholesale prices, order status & instant tracking"
              : "Join verified retailers & get direct factory-wholesale pricing"}
          </p>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="px-6 sm:px-8 pt-2.5 pb-1 flex-shrink-0">
          <div
            className="grid grid-cols-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 gap-1"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === "login"}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-poppins text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer",
                tab === "login"
                  ? "bg-accent text-white shadow-sm shadow-accent/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              )}
              onClick={() => dispatch(setAuthModalTab("login"))}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={tab === "register"}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-poppins text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer",
                tab === "register"
                  ? "bg-accent text-white shadow-sm shadow-accent/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              )}
              onClick={() => dispatch(setAuthModalTab("register"))}
            >
              <UserPlus size={14} />
              <span>Register</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 sm:px-8 py-3.5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-2.5 mb-3 text-center font-medium animate-fadeIn">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl p-2.5 mb-3 text-center font-medium animate-fadeIn">
              {success}
            </div>
          )}

          {/* ── SIGN IN FORM ──────────────────────────────────────── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} noValidate className="space-y-1">
              <Field
                label="Email or Mobile Phone"
                id="login-email"
                type="text"
                icon={Mail}
                placeholder="name@company.com / 9876543210"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />

              <PasswordField
                label="Password"
                id="login-password"
                placeholder="Enter your account password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, password: e.target.value }))
                }
                required
              />

              <div className="flex items-center justify-between pt-1 pb-3 text-xs">
                <label className="flex items-center gap-2 text-slate-600 font-poppins cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={loginForm.remember}
                    onChange={(e) =>
                      setLoginForm((f) => ({
                        ...f,
                        remember: e.target.checked,
                      }))
                    }
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all duration-150",
                      loginForm.remember
                        ? "bg-accent border-accent text-white"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {loginForm.remember && <Check size={11} strokeWidth={3} />}
                  </span>
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="font-poppins font-medium text-accent hover:text-accent-hover hover:underline cursor-pointer bg-transparent border-0"
                  onClick={() =>
                    alert(
                      "Password reset instructions will be sent to your registered email."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              {/* Quick Google option */}
              <div className="flex items-center gap-3 my-3">
                <span className="flex-1 h-px bg-slate-200" />
                <p className="font-poppins text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  or
                </p>
                <span className="flex-1 h-px bg-slate-200" />
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 font-poppins text-xs font-semibold transition-all duration-150 shadow-2xs cursor-pointer"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    setSuccess("Signed in with Google successfully! ✓");
                    dispatch(
                      loginSuccess({
                        name: "Rahul Sharma",
                        email: "rahul.sharma@apexmart.in",
                        businessName: "Sharma Enterprises",
                      })
                    );
                    setTimeout(() => dispatch(closeAuthModal()), 900);
                  }, 700);
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="text-center pt-2 font-poppins text-xs text-slate-500">
                New to {brandName}?{" "}
                <button
                  type="button"
                  onClick={() => dispatch(setAuthModalTab("register"))}
                  className="font-bold text-accent hover:text-accent-hover hover:underline cursor-pointer bg-transparent border-0"
                >
                  Create an account
                </button>
              </div>
            </form>
          )}

          {/* ── REGISTER FORM ─────────────────────────────────────── */}
          {tab === "register" && (
            <form onSubmit={handleRegister} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 w-full min-w-0">
                <Field
                  label="Full Name"
                  id="reg-name"
                  icon={User}
                  placeholder="Rahul Sharma"
                  value={regForm.name}
                  onChange={(e) =>
                    setRegForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
                <Field
                  label="Phone Number"
                  id="reg-phone"
                  type="tel"
                  icon={Phone}
                  placeholder="+91 98765 43210"
                  value={regForm.phone}
                  onChange={(e) =>
                    setRegForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  required
                />
              </div>

              <Field
                label="Business / Store Name (Optional)"
                id="reg-business"
                icon={Building2}
                placeholder="Sharma Enterprises / Style Boutique"
                value={regForm.businessName}
                onChange={(e) =>
                  setRegForm((f) => ({ ...f, businessName: e.target.value }))
                }
              />

              <Field
                label="Email Address"
                id="reg-email"
                type="email"
                icon={Mail}
                placeholder="contact@business.com"
                value={regForm.email}
                onChange={(e) =>
                  setRegForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />

              {/* Password & Confirm Password side by side on desktop, stacked on mobile, zero overflow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 w-full min-w-0">
                <PasswordField
                  label="Password"
                  id="reg-password"
                  placeholder="Min. 8 characters"
                  value={regForm.password}
                  onChange={(e) =>
                    setRegForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                />
                <PasswordField
                  label="Confirm Password"
                  id="reg-confirm"
                  placeholder="Repeat password"
                  value={regForm.confirm}
                  onChange={(e) =>
                    setRegForm((f) => ({ ...f, confirm: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Terms checkbox */}
              <div className="pt-0.5 pb-3">
                <label className="flex items-center gap-2 text-xs text-slate-600 font-poppins cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={regForm.terms}
                    onChange={(e) =>
                      setRegForm((f) => ({ ...f, terms: e.target.checked }))
                    }
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all duration-150 flex-shrink-0",
                      regForm.terms
                        ? "bg-accent border-accent text-white"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {regForm.terms && <Check size={11} strokeWidth={3} />}
                  </span>
                  <span>
                    I agree to the{" "}
                    <span className="text-accent underline font-medium">
                      Terms &amp; Conditions
                    </span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Creating account…</span>
                  </>
                ) : (
                  <>
                    <span>Create Wholesale Account</span>
                    <Sparkles size={15} />
                  </>
                )}
              </button>

              <div className="text-center pt-2 font-poppins text-xs text-slate-500">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => dispatch(setAuthModalTab("login"))}
                  className="font-bold text-accent hover:text-accent-hover hover:underline cursor-pointer bg-transparent border-0"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security & Trust Badges footer */}
        {/* <div className="flex items-center justify-center gap-4 sm:gap-6 py-2.5 px-4 bg-slate-50 border-t border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-1.5 font-poppins text-[10px] sm:text-[11px] font-medium text-slate-500">
            <ShieldCheck size={13} className="text-accent" />
            <span>Secure Login</span>
          </div>
          <div className="flex items-center gap-1.5 font-poppins text-[10px] sm:text-[11px] font-medium text-slate-500">
            <Lock size={13} className="text-accent" />
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center gap-1.5 font-poppins text-[10px] sm:text-[11px] font-medium text-slate-500">
            <Sparkles size={13} className="text-accent" />
            <span>Wholesale Pricing</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
