import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { adminLogin } from "@/store/slices/adminAuthSlice";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Store,
  ArrowRight,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.adminAuth.isAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to admin orders
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/orders", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleFillDemo = () => {
    setEmail("admin@apexmart.com");
    setPassword("admin123");
    setErrorMessage("");
    toast.info("Filled demo credentials: admin@apexmart.com / admin123");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    setTimeout(() => {
      // Dummy verification
      const trimmedEmail = email.trim().toLowerCase();
      if (
        (trimmedEmail === "admin@apexmart.com" && password === "admin123") ||
        (trimmedEmail.includes("admin") && password.length >= 6)
      ) {
        dispatch(
          adminLogin({
            email: trimmedEmail,
            name: "Super Administrator",
            role: "Master Operations Head",
          })
        );
        toast.success("Welcome back, Master Admin!");
        navigate("/admin/orders", { replace: true });
      } else {
        setErrorMessage("Invalid credentials. Try admin@apexmart.com and admin123.");
        toast.error("Authentication failed. Please check credentials.");
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100/90 via-white to-slate-100 flex flex-col justify-between font-albert-sans text-slate-800 relative overflow-hidden">
      {/* Subtle Background Ambience */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-500/8 blur-[130px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur-md z-10 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent via-accent-400 to-accent-500 flex items-center justify-center text-white shadow-md">
            <Store className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-poppins font-black text-lg text-slate-900 tracking-tight">
              ApexMart <span className="text-accent text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/10 ml-1 border border-accent/20">ADMIN</span>
            </span>
          </div>
        </div>

        <Link
          to="/"
          className="text-xs font-poppins font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 bg-white shadow-2xs"
        >
          <span>Storefront</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main White Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl relative">
          
          {/* Badge & Title */}
          <div className="text-center mb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-accent text-xs font-poppins font-bold">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Restricted Administration Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-poppins font-black text-slate-900 tracking-tight">
              Sign In to Admin
            </h1>
            <p className="text-xs text-slate-500 font-inter">
              Access order management, dispatch verifications & wholesale reports
            </p>
          </div>

          {/* Quick 1-Click Demo Credentials Pill */}
          <div className="mb-6 p-3 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between gap-2">
            <div className="text-left">
              <p className="text-[11px] font-poppins font-bold text-accent">Demo Access Ready</p>
              <p className="text-[10px] text-slate-500 font-mono font-medium">admin@apexmart.com / admin123</p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-poppins font-bold text-white bg-accent hover:bg-accent-hover px-3 py-1.5 rounded-xl transition-all shadow-xs active:scale-95 whitespace-nowrap cursor-pointer"
            >
              Fill Demo
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-poppins font-semibold text-slate-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@apexmart.com"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white font-inter transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-poppins font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Default: admin123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white font-inter transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-inter">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-accent focus:ring-accent w-3.5 h-3.5"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[11px] text-accent hover:underline cursor-pointer font-medium">
                Need Help?
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-accent to-accent-600 hover:from-accent-hover hover:to-accent text-white font-poppins font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <span>Authenticating Admin...</span>
              ) : (
                <>
                  <span>Enter Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Wholesale Administrator Session</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-3 text-slate-400 text-[11px] font-inter border-t border-slate-200/60 bg-white/50">
        © 2026 ApexMart Wholesale Enterprise Solutions. All rights reserved.
      </footer>
    </div>
  );
}
