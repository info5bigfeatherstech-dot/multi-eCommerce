import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const ProfileSecurityTab = React.memo(function ProfileSecurityTab() {
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [show, setShow] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass) {
      toast.error("Please enter both current and new password.");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setPasswords({ current: "", newPass: "", confirm: "" });
      toast.success("Account password changed successfully! ✓");
    }, 700);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-8">
      <div>
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="font-poppins font-bold text-lg text-slate-900">
            Login &amp; Security Credentials
          </h2>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Keep your wholesale buyer account protected with high-security credentials
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="max-w-lg space-y-4">
          <div>
            <label className="block text-xs font-poppins font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <div className="relative flex items-center">
              <input
                type={show.current ? "text" : "password"}
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                placeholder="Enter current password"
                className="w-full h-11 px-3.5 pr-10 bg-slate-50 focus:bg-white border border-slate-200 focus:border-accent rounded-xl text-xs sm:text-sm font-poppins outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                className="absolute right-3 text-slate-400 hover:text-accent cursor-pointer"
              >
                {show.current ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-poppins font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={show.newPass ? "text" : "password"}
                  value={passwords.newPass}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPass: e.target.value })
                  }
                  placeholder="Min. 8 characters"
                  className="w-full h-11 px-3.5 pr-10 bg-slate-50 focus:bg-white border border-slate-200 focus:border-accent rounded-xl text-xs sm:text-sm font-poppins outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, newPass: !s.newPass }))}
                  className="absolute right-3 text-slate-400 hover:text-accent cursor-pointer"
                >
                  {show.newPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-poppins font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={show.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  placeholder="Repeat new password"
                  className="w-full h-11 px-3.5 pr-10 bg-slate-50 focus:bg-white border border-slate-200 focus:border-accent rounded-xl text-xs sm:text-sm font-poppins outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                  className="absolute right-3 text-slate-400 hover:text-accent cursor-pointer"
                >
                  {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-70"
            >
              {isUpdating ? "Updating Password…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Active Sessions */}
      <div className="pt-6 border-t border-slate-100">
        <h3 className="font-poppins font-bold text-sm text-slate-900 mb-2">
          Active Session Details
        </h3>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-poppins font-bold text-slate-900">
                Current Web Device
              </p>
              <p className="text-[11px] text-slate-500 font-inter">
                Last active: Just now • Chrome on Windows
              </p>
            </div>
          </div>
          <span className="text-[10px] font-poppins font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Active Now
          </span>
        </div>
      </div>
    </div>
  );
});

export default ProfileSecurityTab;
