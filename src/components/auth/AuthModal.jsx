"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closeAuthModal,
  setAuthModalTab,
  loginSuccess,
  setCartDrawerOpen,
} from "@/store/slices/uiSlice";
import { mergeCart, mergeWishlist, getCart } from "@/api";
import { setCartFromApi } from "@/store/slices/cartSlice";
import {
  getSecurityQuestions,
  DEFAULT_SECURITY_QUESTIONS,
  register as apiRegister,
  verifyRegistrationOtp as apiVerifyOtp,
  login as apiLogin,
  forgotPasswordFindUser as apiForgotFindUser,
  forgotPasswordVerifyAnswers as apiForgotVerifyAnswers,
  forgotPasswordVerifyOtpFallback as apiForgotVerifyOtpFallback,
  forgotPasswordResetDirect as apiForgotResetDirect,
} from "@/api/ecommAuth";
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
  ArrowLeft,
  LogIn,
  UserPlus,
  Check,
  HelpCircle,
  KeyRound,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

/* ─── Form Input Field Component ─────────────────────────────────────────── */
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
  autoFocus,
  disabled,
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

      <div className={cn(
        "relative flex items-center bg-slate-50 hover:bg-white focus-within:bg-white border border-slate-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 rounded-xl transition-all duration-150 w-full min-w-0",
        disabled && "opacity-60 bg-slate-100 cursor-not-allowed"
      )}>
        {Icon && (
          <span className="flex items-center justify-center pl-3 pr-2 text-slate-400 focus-within:text-accent flex-shrink-0">
            <Icon size={16} />
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          disabled={disabled}
          autoComplete="off"
          className="flex-1 w-0 min-w-0 bg-transparent border-0 outline-none font-poppins text-xs sm:text-sm text-slate-900 py-2.5 px-3 placeholder:text-slate-400 placeholder:font-normal"
          required={required}
        />
        {extra}
      </div>
    </div>
  );
}

/* ─── Password Field with Eye Toggle ─────────────────────────────────────── */
function PasswordField({ label, id, placeholder, value, onChange, required, disabled }) {
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
      disabled={disabled}
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

/* ─── Main AuthModal Component ───────────────────────────────────────────── */
export default function AuthModal() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isOpen = useAppSelector((s) => s.ui.isAuthModalOpen);
  const tab = useAppSelector((s) => s.ui.authModalTab);
  const redirectAfter = useAppSelector((s) => s.ui.authRedirectAfter);

  // Active view inside modal: "login" | "register" | "verify-otp" | "forgot-step1" | "forgot-step2" | "forgot-step2b" | "forgot-step3"
  const [view, setView] = useState("login");

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Security questions for registration
  const [questions, setQuestions] = useState(DEFAULT_SECURITY_QUESTIONS);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // 1. Sign In Form State
  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
    remember: true,
  });

  // 2. Register Form State
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    questionId: DEFAULT_SECURITY_QUESTIONS[0]?.id || "favorite_place",
    securityAnswer: "",
    terms: true,
  });

  // 3. OTP Verification State (Post-registration)
  const [otpData, setOtpData] = useState({
    identifier: "",
    otp: "",
  });

  // 4. Forgot Password Flow State
  const [forgotData, setForgotData] = useState({
    identifier: "",
    challengeToken: "",
    question: null,
    answer: "",
    attemptsRemaining: 3,
    requiresOtpFallback: false,
    emailHint: "",
    fallbackOtp: "",
    resetToken: "",
    newPassword: "",
    confirmPassword: "",
  });

  const overlayRef = useRef(null);
  const brandName = siteConfig?.name || "ApexMart";

  // Synchronize modal view with Redux tab changes
  useEffect(() => {
    if (tab === "register") {
      setView("register");
    } else if (tab === "login") {
      setView("login");
    }
  }, [tab]);

  // Fetch security questions on mount or open
  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    setQuestionsLoading(true);
    getSecurityQuestions()
      .then((res) => {
        if (mounted && Array.isArray(res) && res.length > 0) {
          setQuestions(res);
          if (!regForm.questionId || !res.find((q) => q.id === regForm.questionId)) {
            setRegForm((f) => ({ ...f, questionId: res[0].id }));
          }
        }
      })
      .catch(() => {
        if (mounted) setQuestions(DEFAULT_SECURITY_QUESTIONS);
      })
      .finally(() => {
        if (mounted) setQuestionsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") dispatch(closeAuthModal());
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, dispatch]);

  // Lock body scroll when open
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

  // Reset feedback messages on view/tab changes
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [view]);

  const currentCartItems = useAppSelector((s) => s.cart.items);

  if (!isOpen) return null;

  /* ─── Helper to Complete Login & Redirect ─────────────────────────────── */
  const completeAuthSuccess = (userData, accessToken, successMessage, refreshToken) => {
    setSuccess(successMessage || "Authentication successful! Welcome back. ✓");
    dispatch(loginSuccess({ user: userData, accessToken, refreshToken }));

    // 1. Sync guest cart with backend: POST /api/cart/merge with guest items, then GET /api/cart
    const guestItems = (currentCartItems || []).map((item) => ({
      productId: item.productId || item.id,
      productSlug: item.slug || undefined,
      variantId: item.variantId || undefined,
      quantity: item.quantity || 1,
    }));

    if (guestItems.length > 0) {
      mergeCart({ items: guestItems })
        .then((merged) => {
          if (merged) dispatch(setCartFromApi(merged));
          return getCart();
        })
        .then((fresh) => {
          if (fresh) dispatch(setCartFromApi(fresh));
        })
        .catch(() => {});
    } else {
      getCart()
        .then((fresh) => {
          if (fresh) dispatch(setCartFromApi(fresh));
        })
        .catch(() => {});
    }

    // 2. Sync wishlist
    mergeWishlist().catch(() => {});

    setTimeout(() => {
      dispatch(closeAuthModal());
      dispatch(setCartDrawerOpen(false));
      if (redirectAfter) {
        navigate(redirectAfter);
      }
    }, 1000);
  };

  /* ─── 1. Handle Login Submission ───────────────────────────────────────── */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginForm.identifier.trim() || !loginForm.password) {
      setError("Please provide both email/phone and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiLogin({
        identifier: loginForm.identifier.trim(),
        password: loginForm.password,
        portal: "ecomm",
      });

      if (res.success) {
        completeAuthSuccess(res.user, res.accessToken, res.message || "Login successful! Welcome back.", res.refreshToken);
      } else {
        setError(res.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── 2. Handle Register Submission ────────────────────────────────────── */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !regForm.name.trim() ||
      !regForm.email.trim() ||
      !regForm.phone.trim() ||
      !regForm.password
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (regForm.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!regForm.securityAnswer.trim()) {
      setError("Please provide an answer for the selected security question.");
      return;
    }

    if (!regForm.terms) {
      setError("Please accept the Terms & Conditions to proceed.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: regForm.name.trim(),
        email: regForm.email.trim(),
        phone: regForm.phone.trim(),
        password: regForm.password,
        confirmPassword: regForm.confirmPassword,
        securityAnswers: [
          {
            questionId: regForm.questionId,
            answer: regForm.securityAnswer.trim(),
          },
        ],
      };

      const res = await apiRegister(payload);

      if (res.success && res.requiresOTPVerification) {
        setOtpData({
          identifier: res.identifier || res.email || regForm.email.trim(),
          otp: "",
        });
        setSuccess(res.message || "Verification code sent to your email.");
        setView("verify-otp");
      } else if (res.success && res.accessToken) {
        completeAuthSuccess(res.user, res.accessToken, "Registration complete! You are now logged in.", res.refreshToken);
      } else {
        setSuccess("Account registered! Please verify OTP.");
        setOtpData({
          identifier: regForm.email.trim(),
          otp: "",
        });
        setView("verify-otp");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please review your details.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── 3. Handle Registration OTP Verification ──────────────────────────── */
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otpData.otp.trim()) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiVerifyOtp({
        identifier: otpData.identifier,
        email: otpData.identifier,
        otp: otpData.otp.trim(),
      });

      if (res.success) {
        completeAuthSuccess(res.user, res.accessToken, res.message || "Email verified successfully. You are now logged in.", res.refreshToken);
      } else {
        setError(res.message || "OTP verification failed. Please try again.");
      }
    } catch (err) {
      if (err.code === "OTP_EXPIRED") {
        setError("OTP has expired. Please restart registration to receive a new code.");
      } else if (err.code === "ALREADY_VERIFIED") {
        setError("Account is already verified. Please sign in.");
        setTimeout(() => setView("login"), 1500);
      } else {
        setError(err.message || "Invalid OTP entered. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ─── 4. Forgot Password Flow Handlers ─────────────────────────────────── */
  
  // Step 1: Find User
  const handleForgotFindUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotData.identifier.trim()) {
      setError("Please enter your registered email or 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiForgotFindUser({ identifier: forgotData.identifier.trim() });
      if (res.success) {
        const userQuestion = res.question || (res.questions && res.questions[0]) || {
          id: "favorite_place",
          text: "What is your favorite place?",
        };
        setForgotData((prev) => ({
          ...prev,
          challengeToken: res.challengeToken || "",
          question: userQuestion,
          attemptsRemaining: res.maxAttempts || 3,
        }));
        setSuccess(res.message || "Account found! Please answer your security question.");
        setView("forgot-step2");
      } else {
        setError(res.message || "Could not find an account with the provided details.");
      }
    } catch (err) {
      setError(err.message || "Account lookup failed. Please verify your phone or email.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Security Answer
  const handleForgotVerifyAnswer = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotData.answer.trim()) {
      setError("Please enter your security answer.");
      return;
    }

    setLoading(true);
    try {
      const questionId = forgotData.question?.id || "favorite_place";
      const res = await apiForgotVerifyAnswers({
        challengeToken: forgotData.challengeToken,
        answers: [
          {
            questionId,
            answer: forgotData.answer.trim(),
          },
        ],
      });

      // A) Correct Answer
      if (res.success && res.resetToken) {
        setForgotData((prev) => ({
          ...prev,
          resetToken: res.resetToken,
        }));
        setSuccess(res.message || "Security answer verified! Now set your new password.");
        setView("forgot-step3");
        return;
      }

      // C) 3rd wrong answer -> fallback to Email OTP
      if (res.requiresOtpFallback) {
        setForgotData((prev) => ({
          ...prev,
          requiresOtpFallback: true,
          challengeToken: res.challengeToken || prev.challengeToken,
          emailHint: res.emailHint || "your email",
          attemptsRemaining: 0,
        }));
        setError(res.message || "Maximum attempts exceeded. An OTP has been sent to your registered email.");
        setView("forgot-step2b");
        return;
      }

      // B) Wrong answer (Attempt 1 or 2)
      if (res.code === "SECURITY_ANSWERS_INCORRECT" || !res.success) {
        const remaining = res.attemptsRemaining !== undefined ? res.attemptsRemaining : 1;
        setForgotData((prev) => ({
          ...prev,
          attemptsRemaining: remaining,
        }));
        setError(res.message || `Incorrect answer. ${remaining} attempt(s) remaining.`);
      }
    } catch (err) {
      if (err.attemptsRemaining !== undefined) {
        setForgotData((prev) => ({
          ...prev,
          attemptsRemaining: err.attemptsRemaining,
        }));
      }
      setError(err.message || "Failed to verify security answer.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2b: Verify OTP Fallback
  const handleForgotVerifyOtpFallback = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotData.fallbackOtp.trim()) {
      setError("Please enter the recovery OTP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiForgotVerifyOtpFallback({
        challengeToken: forgotData.challengeToken,
        otp: forgotData.fallbackOtp.trim(),
      });

      if (res.success && res.resetToken) {
        setForgotData((prev) => ({
          ...prev,
          resetToken: res.resetToken,
        }));
        setSuccess(res.message || "OTP verified! Please set your new password.");
        setView("forgot-step3");
      } else {
        setError(res.message || "Invalid OTP code.");
      }
    } catch (err) {
      setError(err.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleForgotResetDirect = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotData.newPassword || !forgotData.confirmPassword) {
      setError("Please fill in both new password fields.");
      return;
    }

    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (forgotData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiForgotResetDirect({
        resetToken: forgotData.resetToken,
        newPassword: forgotData.newPassword,
        confirmPassword: forgotData.confirmPassword,
      });

      if (res.success) {
        setSuccess(res.message || "Password reset successful! Logging you in...");
        
        // Auto-login with the newly set password
        try {
          const loginRes = await apiLogin({
            identifier: forgotData.identifier || res.phone,
            password: forgotData.newPassword,
            portal: "ecomm",
          });
          if (loginRes.success) {
            completeAuthSuccess(loginRes.user, loginRes.accessToken, "Password reset & signed in successfully! ✓");
            return;
          }
        } catch {
          // If auto-login fails, switch smoothly to login view
        }

        setTimeout(() => {
          setLoginForm((f) => ({
            ...f,
            identifier: forgotData.identifier,
            password: "",
          }));
          setView("login");
          setSuccess("Password reset successfully! Please sign in with your new password.");
        }, 1200);
      } else {
        setError(res.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(err.message || "Password reset failed. Token may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-md animate-modal-backdrop"
      onClick={(e) => {
        if (e.target === overlayRef.current) dispatch(closeAuthModal());
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Customer Authentication"
    >
      <div className="relative w-full max-w-[540px] max-h-[92vh] flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden animate-modal-card transform-gpu">
        {/* Ambient top gradient line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-amber-500 to-orange-400 z-10" />

        {/* Close Button */}
        <button
          onClick={() => dispatch(closeAuthModal())}
          aria-label="Close authentication modal"
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/80 flex items-center justify-center transition-all duration-200 hover:rotate-90 z-20 cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="pt-6 px-6 sm:px-8 pb-1 text-center flex-shrink-0">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center shadow-md shadow-accent/25 text-white">
              <Store size={20} strokeWidth={2.3} />
            </div>
            <span className="font-poppins font-bold text-xl text-slate-900 tracking-tight">
              {brandName}
            </span>
          </div>

          <h3 className="font-poppins text-lg sm:text-xl font-bold text-slate-900 mb-0.5">
            {view === "login" && "Sign In to Your Account"}
            {view === "register" && "Create Wholesale Account"}
            {view === "verify-otp" && "Verify Registration Email"}
            {view === "forgot-step1" && "Reset Your Password"}
            {view === "forgot-step2" && "Security Verification"}
            {view === "forgot-step2b" && "Email OTP Recovery"}
            {view === "forgot-step3" && "Create New Password"}
          </h3>

          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {view === "login" && "Access wholesale prices, order status & instant tracking"}
            {view === "register" && "Join verified retailers & get direct factory-wholesale pricing"}
            {view === "verify-otp" && `Enter the verification code sent to ${otpData.identifier || "your email"}`}
            {view === "forgot-step1" && "Enter your registered email or phone to initiate password reset"}
            {view === "forgot-step2" && "Answer your registered security question to verify identity"}
            {view === "forgot-step2b" && `Enter the fallback OTP code sent to ${forgotData.emailHint || "your email"}`}
            {view === "forgot-step3" && "Choose a strong new password for your wholesale account"}
          </p>
        </div>

        {/* Segmented Tab Switcher (Only visible for Login / Register tabs) */}
        {(view === "login" || view === "register") && (
          <div className="px-6 sm:px-8 pt-2.5 pb-1 flex-shrink-0">
            <div
              className="grid grid-cols-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 gap-1"
              role="tablist"
            >
              <button
                type="button"
                role="tab"
                aria-selected={view === "login"}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-poppins text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer",
                  view === "login"
                    ? "bg-accent text-white shadow-sm shadow-accent/30"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                )}
                onClick={() => {
                  setView("login");
                  dispatch(setAuthModalTab("login"));
                }}
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={view === "register"}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-poppins text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer",
                  view === "register"
                    ? "bg-accent text-white shadow-sm shadow-accent/30"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                )}
                onClick={() => {
                  setView("register");
                  dispatch(setAuthModalTab("register"));
                }}
              >
                <UserPlus size={14} />
                <span>Register</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 sm:px-8 py-3.5">
          {/* Feedback Alerts */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 mb-3 font-medium flex items-start gap-2 animate-fadeIn">
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl p-3 mb-3 font-medium flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{success}</div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* VIEW 1: SIGN IN FORM                                        */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {view === "login" && (
            <form onSubmit={handleLoginSubmit} noValidate className="space-y-1">
              <Field
                label="Email or Mobile Phone"
                id="login-identifier"
                type="text"
                icon={Mail}
                placeholder="ali@gmail.com or 9876543210"
                value={loginForm.identifier}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, identifier: e.target.value }))
                }
                required
                disabled={loading}
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
                disabled={loading}
              />

              <div className="flex items-center justify-between pt-1 pb-3 text-xs">
                <label className="flex items-center gap-2 text-slate-600 font-poppins cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="login-remember"
                    checked={loginForm.remember}
                    onChange={(e) =>
                      setLoginForm((f) => ({ ...f, remember: e.target.checked }))
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
                  onClick={() => {
                    setForgotData((prev) => ({
                      ...prev,
                      identifier: loginForm.identifier,
                    }));
                    setView("forgot-step1");
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <div className="text-center pt-3 font-poppins text-xs text-slate-500">
                New to {brandName}?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("register");
                    dispatch(setAuthModalTab("register"));
                  }}
                  className="font-bold text-accent hover:text-accent-hover hover:underline cursor-pointer bg-transparent border-0"
                >
                  Create an account
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* VIEW 2: REGISTER FORM                                       */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {view === "register" && (
            <form onSubmit={handleRegisterSubmit} noValidate className="space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 w-full min-w-0">
                <Field
                  label="Full Name"
                  id="reg-name"
                  icon={User}
                  placeholder="Ali Khan"
                  value={regForm.name}
                  onChange={(e) =>
                    setRegForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                  disabled={loading}
                />

                <Field
                  label="10-Digit Mobile Phone"
                  id="reg-phone"
                  type="tel"
                  icon={Phone}
                  placeholder="9876543210"
                  value={regForm.phone}
                  onChange={(e) =>
                    setRegForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  required
                  disabled={loading}
                />
              </div>

              <Field
                label="Email Address"
                id="reg-email"
                type="email"
                icon={Mail}
                placeholder="ali@gmail.com"
                value={regForm.email}
                onChange={(e) =>
                  setRegForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                disabled={loading}
              />

              {/* Security Question Selection */}
              <div className="flex flex-col gap-1 mb-3 w-full min-w-0">
                <div className="flex items-center justify-between min-w-0 w-full gap-1">
                  <label
                    htmlFor="reg-question"
                    className="font-poppins text-[11px] font-semibold text-slate-600 uppercase tracking-wider min-w-0 truncate"
                  >
                    Select Security Question
                  </label>
                  <span className="text-accent text-xs font-bold flex-shrink-0">*</span>
                </div>

                <div className="relative flex items-center bg-slate-50 hover:bg-white focus-within:bg-white border border-slate-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 rounded-xl transition-all duration-150 w-full min-w-0">
                  <span className="flex items-center justify-center pl-3 pr-2 text-slate-400 focus-within:text-accent flex-shrink-0">
                    <HelpCircle size={16} />
                  </span>
                  <select
                    id="reg-question"
                    value={regForm.questionId}
                    onChange={(e) =>
                      setRegForm((f) => ({ ...f, questionId: e.target.value }))
                    }
                    disabled={loading || questionsLoading}
                    className="flex-1 w-0 min-w-0 bg-transparent border-0 outline-none font-poppins text-xs sm:text-sm text-slate-900 py-2.5 pr-3 cursor-pointer"
                  >
                    {questions.map((q) => (
                      <option key={q.id} value={q.id} className="text-slate-800">
                        {q.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Security Question Answer */}
              <Field
                label="Your Security Answer"
                id="reg-security-answer"
                icon={KeyRound}
                placeholder="e.g. Lahore / Blue / Oxford High"
                value={regForm.securityAnswer}
                onChange={(e) =>
                  setRegForm((f) => ({ ...f, securityAnswer: e.target.value }))
                }
                required
                disabled={loading}
              />

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 w-full min-w-0">
                <PasswordField
                  label="Password"
                  id="reg-password"
                  placeholder="Min. 6 characters"
                  value={regForm.password}
                  onChange={(e) =>
                    setRegForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                  disabled={loading}
                />
                <PasswordField
                  label="Confirm Password"
                  id="reg-confirm"
                  placeholder="Repeat password"
                  value={regForm.confirmPassword}
                  onChange={(e) =>
                    setRegForm((f) => ({ ...f, confirmPassword: e.target.value }))
                  }
                  required
                  disabled={loading}
                />
              </div>

              {/* Terms checkbox */}
              <div className="pt-1 pb-3">
                <label className="flex items-center gap-2 text-xs text-slate-600 font-poppins cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="reg-terms"
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
                className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
                  onClick={() => {
                    setView("login");
                    dispatch(setAuthModalTab("login"));
                  }}
                  className="font-bold text-accent hover:text-accent-hover hover:underline cursor-pointer bg-transparent border-0"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* VIEW 3: VERIFY REGISTRATION OTP                             */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {view === "verify-otp" && (
            <form onSubmit={handleVerifyOtpSubmit} noValidate className="space-y-4 pt-1">
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/70 text-xs text-amber-800 text-center">
                <span className="font-semibold block mb-0.5">Check Your Inbox</span>
                We sent a 6-digit verification code to{" "}
                <strong className="font-bold text-slate-900">
                  {otpData.identifier || regForm.email}
                </strong>
              </div>

              <Field
                label="6-Digit Verification Code"
                id="reg-otp"
                type="text"
                icon={ShieldCheck}
                placeholder="482913"
                value={otpData.otp}
                onChange={(e) =>
                  setOtpData((f) => ({ ...f, otp: e.target.value.replace(/\D/g, "").slice(0, 6) }))
                }
                required
                autoFocus
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || otpData.otp.length < 4}
                className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Verifying Code…</span>
                  </>
                ) : (
                  <>
                    <span>Verify &amp; Log In</span>
                    <Check size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back to register</span>
                </button>

                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="font-bold text-accent hover:underline cursor-pointer"
                >
                  Sign in instead
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* VIEW 4: FORGOT PASSWORD - STEP 1 (FIND USER)                */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {view === "forgot-step1" && (
            <form onSubmit={handleForgotFindUser} noValidate className="space-y-3 pt-1">
              <Field
                label="Registered Email or 10-Digit Mobile"
                id="forgot-identifier"
                type="text"
                icon={Mail}
                placeholder="ali@gmail.com or 9876543210"
                value={forgotData.identifier}
                onChange={(e) =>
                  setForgotData((f) => ({ ...f, identifier: e.target.value }))
                }
                required
                autoFocus
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || !forgotData.identifier.trim()}
                className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Searching account…</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Security Question</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* VIEW 5: FORGOT PASSWORD - STEP 2 (ANSWER SECURITY QUESTION) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {view === "forgot-step2" && (
            <form onSubmit={handleForgotVerifyAnswer} noValidate className="space-y-3 pt-1">
              {/* Question Badge */}
              <div className="p-4 bg-orange-50/80 border border-orange-200/80 rounded-2xl">
                <span className="text-[10px] font-poppins font-bold uppercase tracking-wider text-orange-600 block mb-1">
                  Your Security Question
                </span>
                <p className="font-poppins font-semibold text-slate-900 text-sm">
                  {forgotData.question?.text || "What is your favorite place?"}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Max attempts: 3</span>
                  <span className={cn(
                    "font-bold",
                    forgotData.attemptsRemaining <= 1 ? "text-rose-600" : "text-amber-600"
                  )}>
                    {forgotData.attemptsRemaining} attempt(s) remaining
                  </span>
                </div>
              </div>

              <Field
                label="Your Security Answer"
                id="forgot-answer"
                icon={KeyRound}
                placeholder="Enter your exact answer"
                value={forgotData.answer}
                onChange={(e) =>
                  setForgotData((f) => ({ ...f, answer: e.target.value }))
                }
                required
                autoFocus
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || !forgotData.answer.trim()}
                className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Verifying Answer…</span>
                  </>
                ) : (
                  <>
                    <span>Verify Answer</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setView("forgot-step1")}
                  className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  <ArrowLeft size={13} />
                  <span>Choose another account</span>
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* VIEW 6: FORGOT PASSWORD - STEP 2B (EMAIL OTP FALLBACK)      */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {view === "forgot-step2b" && (
            <form onSubmit={handleForgotVerifyOtpFallback} noValidate className="space-y-3 pt-1">
              <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl text-xs text-rose-800">
                <span className="font-bold block mb-0.5">3 Failed Attempts Reached</span>
                As a security precaution, an OTP has been dispatched to your registered email{" "}
                <strong className="font-bold text-slate-900">
                  ({forgotData.emailHint || "registered email"})
                </strong>.
                Enter it for your final recovery attempt.
              </div>

              <Field
                label="Recovery OTP Code"
                id="forgot-otp-fallback"
                type="text"
                icon={ShieldCheck}
                placeholder="193847"
                value={forgotData.fallbackOtp}
                onChange={(e) =>
                  setForgotData((f) => ({
                    ...f,
                    fallbackOtp: e.target.value.replace(/\D/g, "").slice(0, 6),
                  }))
                }
                required
                autoFocus
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || forgotData.fallbackOtp.length < 4}
                className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Verifying Fallback Code…</span>
                  </>
                ) : (
                  <>
                    <span>Verify OTP &amp; Continue</span>
                    <Check size={16} />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  <ArrowLeft size={13} />
                  <span>Return to Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* VIEW 7: FORGOT PASSWORD - STEP 3 (SET NEW PASSWORD)         */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {view === "forgot-step3" && (
            <form onSubmit={handleForgotResetDirect} noValidate className="space-y-3 pt-1">
              <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs text-emerald-800 text-center">
                <CheckCircle2 size={16} className="inline mr-1 text-emerald-600" />
                Identity verified! Choose a new password for your account.
              </div>

              <PasswordField
                label="New Password"
                id="reset-new-password"
                placeholder="Min. 6 characters"
                value={forgotData.newPassword}
                onChange={(e) =>
                  setForgotData((f) => ({ ...f, newPassword: e.target.value }))
                }
                required
                disabled={loading}
              />

              <PasswordField
                label="Confirm New Password"
                id="reset-confirm-password"
                placeholder="Repeat new password"
                value={forgotData.confirmPassword}
                onChange={(e) =>
                  setForgotData((f) => ({
                    ...f,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Setting New Password…</span>
                  </>
                ) : (
                  <>
                    <span>Set Password &amp; Sign In</span>
                    <Check size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
