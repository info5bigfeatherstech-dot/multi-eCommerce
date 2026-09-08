import React, { useState } from "react";
import { ShieldCheck, Save } from "lucide-react";
import { toast } from "sonner";

export const ProfileInfoTab = React.memo(function ProfileInfoTab({
  user,
  onUpdateProfile,
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "Rahul Sharma",
    businessName: user?.businessName || "Sharma Enterprises",
    phone: user?.phone || "+91 98765 43210",
    email: user?.email || "rahul.sharma@apexmart.in",
    gstin: "24AAACG1234F1Z5",
    panNumber: "AAACG1234F",
    businessType: "Wholesale Retailer / Distributor",
    city: "Ahmedabad, Gujarat",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile(formData);
      setIsSaving(false);
      toast.success("Business profile updated successfully! ✓");
    }, 600);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
      <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-poppins font-bold text-lg text-slate-900">
            Business &amp; Personal Details
          </h2>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Manage your wholesale entity details for tax invoices and vendor verification
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-poppins font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck size={14} /> GST Verified
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-poppins font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Person Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/15 rounded-xl font-poppins text-xs sm:text-sm text-slate-900 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-poppins font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Registered Business Name
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/15 rounded-xl font-poppins text-xs sm:text-sm text-slate-900 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-poppins font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address (Login ID)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/15 rounded-xl font-poppins text-xs sm:text-sm text-slate-900 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-poppins font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Contact Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/15 rounded-xl font-poppins text-xs sm:text-sm text-slate-900 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-poppins font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              GSTIN Number (For 100% Tax Credit)
            </label>
            <input
              type="text"
              value={formData.gstin}
              onChange={(e) => handleChange("gstin", e.target.value.toUpperCase())}
              className="w-full h-11 px-3.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/15 rounded-xl font-poppins text-xs sm:text-sm text-slate-900 uppercase outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-poppins font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Business Category
            </label>
            <select
              value={formData.businessType}
              onChange={(e) => handleChange("businessType", e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/15 rounded-xl font-poppins text-xs sm:text-sm text-slate-900 outline-none transition-all cursor-pointer"
            >
              <option>Wholesale Retailer / Distributor</option>
              <option>E-commerce Reseller</option>
              <option>Corporate Gifting Agency</option>
              <option>Supermarket / Departmental Store</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg transition-all duration-150 cursor-pointer disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Saving Changes…</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
});

export default ProfileInfoTab;
