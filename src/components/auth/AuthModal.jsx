import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closeAuthModal,
  setAuthModalTab,
} from "@/store/slices/uiSlice";
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
} from "lucide-react";

/* ─── tiny reusable input ─────────────────────────────────────────────────── */
function Field({ label, id, type = "text", icon: Icon, placeholder, value, onChange, extra }) {
  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <div className="auth-input-wrap">
        <span className="auth-icon">
          <Icon size={16} />
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
          className="auth-input"
        />
        {extra}
      </div>
    </div>
  );
}

/* ─── password field with eye toggle ─────────────────────────────────────── */
function PasswordField({ label, id, placeholder, value, onChange }) {
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
      extra={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="auth-eye"
          tabIndex={-1}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      }
    />
  );
}

/* ─── main modal ──────────────────────────────────────────────────────────── */
export default function AuthModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.isAuthModalOpen);
  const tab = useAppSelector((s) => s.ui.authModalTab);

  /* form state */
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const overlayRef = useRef(null);

  /* close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => { if (e.key === "Escape") dispatch(closeAuthModal()); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isOpen, dispatch]);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* reset on tab change */
  useEffect(() => { setSuccess(""); }, [tab]);

  if (!isOpen) return null;

  /* dummy submit handlers */
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Welcome back! You are logged in. ✓");
    }, 1400);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Account created successfully! ✓");
    }, 1600);
  };

  return (
    <>
      {/* ── Styles injected once ─────────────────────────────────────────── */}
      <style>{`
        .auth-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          background: rgba(5, 10, 30, 0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 16px;
          animation: authFadeIn 0.22s ease;
        }
        @keyframes authFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .auth-card {
          position: relative;
          width: 100%; max-width: 440px;
          background: linear-gradient(145deg, #0f172a 0%, #111827 60%, #0a1628 100%);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset;
          overflow: hidden;
          animation: authSlideUp 0.28s cubic-bezier(.22,1,.36,1);
        }
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        /* glow accent line */
        .auth-card::before {
          content:'';
          position: absolute; top: 0; left: 10%; right: 10%; height: 2px;
          background: linear-gradient(90deg, transparent, #f97316, #fb923c, transparent);
          border-radius: 999px;
        }
        .auth-header {
          padding: 28px 28px 0;
          text-align: center;
        }
        .auth-brand {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 18px;
        }
        .auth-brand-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #f97316, #fb923c);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(249,115,22,0.45);
        }
        .auth-brand-name {
          font-family: 'Poppins', sans-serif;
          font-weight: 800; font-size: 18px; color: #fff;
          letter-spacing: -0.4px;
        }
        .auth-brand-name span { color: #f97316; }
        /* close */
        .auth-close {
          position: absolute; top: 16px; right: 16px;
          width: 32px; height: 32px; border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: #94a3b8; cursor: pointer; transition: all .2s;
        }
        .auth-close:hover { background: rgba(255,255,255,0.12); color: #fff; }
        /* tab strip */
        .auth-tabs {
          display: grid; grid-template-columns: 1fr 1fr;
          margin: 0 28px 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 4px; gap: 4px;
        }
        .auth-tab {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 9px; border-radius: 9px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px; font-weight: 600;
          color: #64748b; cursor: pointer; border: none;
          background: transparent; transition: all .22s;
        }
        .auth-tab.active {
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: #fff;
          box-shadow: 0 3px 12px rgba(249,115,22,0.38);
        }
        .auth-tab:not(.active):hover { color: #cbd5e1; background: rgba(255,255,255,0.05); }
        /* body */
        .auth-body { padding: 22px 28px 28px; }
        /* field */
        .auth-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .auth-label {
          font-family: 'Poppins', sans-serif;
          font-size: 11px; font-weight: 600;
          color: #94a3b8; letter-spacing: .5px; text-transform: uppercase;
        }
        .auth-input-wrap {
          position: relative; display: flex; align-items: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px; transition: border-color .2s, box-shadow .2s;
        }
        .auth-input-wrap:focus-within {
          border-color: rgba(249,115,22,0.55);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
        }
        .auth-icon {
          display: flex; align-items: center; justify-content: center;
          padding: 0 11px; color: #64748b; flex-shrink: 0;
        }
        .auth-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px; color: #e2e8f0;
          padding: 11px 12px 11px 0;
        }
        .auth-input::placeholder { color: #475569; }
        .auth-eye {
          padding: 0 12px; background: transparent; border: none;
          color: #64748b; cursor: pointer; display: flex; align-items: center;
          transition: color .2s;
        }
        .auth-eye:hover { color: #f97316; }
        /* row */
        .auth-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px;
        }
        .auth-check-label {
          display: flex; align-items: center; gap: 7px;
          font-family: 'Poppins', sans-serif;
          font-size: 12px; color: #94a3b8; cursor: pointer;
        }
        .auth-check-label input[type="checkbox"] { accent-color: #f97316; width: 14px; height: 14px; }
        .auth-forgot {
          font-family: 'Poppins', sans-serif;
          font-size: 12px; color: #f97316; text-decoration: none;
          background: none; border: none; cursor: pointer; padding: 0;
          transition: color .2s;
        }
        .auth-forgot:hover { color: #fb923c; }
        /* submit btn */
        .auth-submit {
          width: 100%; padding: 12.5px;
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: #fff; border: none; border-radius: 11px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          cursor: pointer; transition: all .22s;
          box-shadow: 0 4px 18px rgba(249,115,22,0.4);
          letter-spacing: .2px;
        }
        .auth-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #ea6c0e, #f97316);
          box-shadow: 0 6px 24px rgba(249,115,22,0.55);
          transform: translateY(-1px);
        }
        .auth-submit:disabled { opacity: .65; cursor: not-allowed; }
        /* divider */
        .auth-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 16px 0;
        }
        .auth-divider span {
          flex: 1; height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .auth-divider p {
          font-family: 'Poppins', sans-serif;
          font-size: 11px; color: #475569; white-space: nowrap;
        }
        /* switch link */
        .auth-switch {
          text-align: center; margin-top: 14px;
          font-family: 'Poppins', sans-serif;
          font-size: 12.5px; color: #64748b;
        }
        .auth-switch button {
          color: #f97316; background: none; border: none;
          font-family: 'Poppins', sans-serif;
          font-size: 12.5px; font-weight: 700;
          cursor: pointer; padding: 0 2px;
          transition: color .2s;
        }
        .auth-switch button:hover { color: #fb923c; }
        /* success banner */
        .auth-success {
          background: linear-gradient(135deg, rgba(34,197,94,.15), rgba(16,185,129,.1));
          border: 1px solid rgba(34,197,94,.3);
          border-radius: 10px; padding: 11px 14px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px; color: #4ade80;
          text-align: center; margin-bottom: 14px;
          animation: authFadeIn 0.3s ease;
        }
        /* spinner */
        .auth-spinner {
          width: 17px; height: 17px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        /* badges strip */
        .auth-badges {
          display: flex; align-items: center; justify-content: center; gap: 18px;
          padding: 12px 28px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .auth-badge {
          display: flex; align-items: center; gap: 5px;
          font-family: 'Poppins', sans-serif;
          font-size: 10px; font-weight: 600; color: #475569;
        }
        .auth-badge svg { color: #f97316; }
      `}</style>

      {/* overlay – click outside to close */}
      <div
        ref={overlayRef}
        className="auth-overlay"
        onClick={(e) => { if (e.target === overlayRef.current) dispatch(closeAuthModal()); }}
        role="dialog"
        aria-modal="true"
        aria-label="Authentication"
      >
        <div className="auth-card">
          {/* close btn */}
          <button className="auth-close" onClick={() => dispatch(closeAuthModal())} aria-label="Close">
            <X size={15} />
          </button>

          {/* brand */}
          <div className="auth-header">
            <div className="auth-brand">
              <div className="auth-brand-icon">
                <Store size={20} color="#fff" strokeWidth={2.2} />
              </div>
              <span className="auth-brand-name">
                Fab<span>Uniqo</span>
              </span>
            </div>
          </div>

          {/* tab strip */}
          <div style={{ padding: "0 28px 6px" }}>
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === "login" ? "active" : ""}`}
                onClick={() => dispatch(setAuthModalTab("login"))}
              >
                <LogIn size={14} />
                Sign In
              </button>
              <button
                className={`auth-tab ${tab === "register" ? "active" : ""}`}
                onClick={() => dispatch(setAuthModalTab("register"))}
              >
                <UserPlus size={14} />
                Register
              </button>
            </div>
          </div>

          {/* ── LOGIN FORM ─────────────────────────────────────────────── */}
          {tab === "login" && (
            <div className="auth-body">
              {success && <div className="auth-success">{success}</div>}
              <form onSubmit={handleLogin} noValidate>
                <Field
                  label="Email / Phone"
                  id="login-email"
                  type="email"
                  icon={Mail}
                  placeholder="you@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                />
                <PasswordField
                  label="Password"
                  id="login-password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                />

                <div className="auth-row">
                  <label className="auth-check-label">
                    <input type="checkbox" id="remember-me" />
                    Remember me
                  </label>
                  <button type="button" className="auth-forgot">Forgot password?</button>
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? (
                    <><div className="auth-spinner" /> Signing in…</>
                  ) : (
                    <>Sign In <ArrowRight size={15} /></>
                  )}
                </button>
              </form>

              <div className="auth-switch">
                New to FabUniqo?{" "}
                <button onClick={() => dispatch(setAuthModalTab("register"))}>
                  Create account
                </button>
              </div>
            </div>
          )}

          {/* ── REGISTER FORM ──────────────────────────────────────────── */}
          {tab === "register" && (
            <div className="auth-body">
              {success && <div className="auth-success">{success}</div>}
              <form onSubmit={handleRegister} noValidate>
                <Field
                  label="Full Name / Business Name"
                  id="reg-name"
                  icon={User}
                  placeholder="Raj Traders / Priya Enterprises"
                  value={regForm.name}
                  onChange={(e) => setRegForm((f) => ({ ...f, name: e.target.value }))}
                />
                <Field
                  label="Phone Number"
                  id="reg-phone"
                  type="tel"
                  icon={Phone}
                  placeholder="+91 98765 43210"
                  value={regForm.phone}
                  onChange={(e) => setRegForm((f) => ({ ...f, phone: e.target.value }))}
                />
                <Field
                  label="Email Address"
                  id="reg-email"
                  type="email"
                  icon={Mail}
                  placeholder="you@business.com"
                  value={regForm.email}
                  onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                />
                <PasswordField
                  label="Password"
                  id="reg-password"
                  placeholder="Min. 8 characters"
                  value={regForm.password}
                  onChange={(e) => setRegForm((f) => ({ ...f, password: e.target.value }))}
                />
                <PasswordField
                  label="Confirm Password"
                  id="reg-confirm"
                  placeholder="Repeat password"
                  value={regForm.confirm}
                  onChange={(e) => setRegForm((f) => ({ ...f, confirm: e.target.value }))}
                />

                <div style={{ marginBottom: 18 }}>
                  <label className="auth-check-label">
                    <input type="checkbox" id="terms" />
                    I agree to the{" "}
                    <span style={{ color: "#f97316", cursor: "pointer" }}>Terms &amp; Conditions</span>
                  </label>
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? (
                    <><div className="auth-spinner" /> Creating account…</>
                  ) : (
                    <>Create Account <Sparkles size={14} /></>
                  )}
                </button>
              </form>

              <div className="auth-switch">
                Already have an account?{" "}
                <button onClick={() => dispatch(setAuthModalTab("login"))}>
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* trust badges */}
          <div className="auth-badges">
            <div className="auth-badge">
              <ShieldCheck size={12} />
              Secure Login
            </div>
            <div className="auth-badge">
              <Lock size={12} />
              256-bit SSL
            </div>
            <div className="auth-badge">
              <Sparkles size={12} />
              Wholesale Access
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
