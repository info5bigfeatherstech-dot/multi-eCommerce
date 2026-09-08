import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const ProfilePreferencesTab = React.memo(function ProfilePreferencesTab() {
  const [alerts, setAlerts] = useState({
    whatsapp: true,
    emailInvoices: true,
    flashDeals: false,
    stockArrival: true,
  });

  const toggle = (key) => {
    setAlerts((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      toast.success("Preferences updated.");
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
      <div className="border-b border-slate-100 pb-4 mb-4">
        <h2 className="font-poppins font-bold text-lg text-slate-900">
          Wholesale Alerts &amp; Notifications
        </h2>
        <p className="text-xs text-slate-500 font-inter mt-0.5">
          Configure how you receive dispatch updates, GST invoices, and flash sale discounts
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            key: "whatsapp",
            title: "WhatsApp Cargo & Dispatch Tracking",
            desc: "Receive immediate consignment docket and delivery OTP via WhatsApp",
          },
          {
            key: "emailInvoices",
            title: "Automatic Tax Invoice Delivery",
            desc: "Email signed GST invoice instantly upon order confirmation",
          },
          {
            key: "stockArrival",
            title: "Just Arrived Wholesale Alerts",
            desc: "Priority notifications when top wholesale inventory is replenished",
          },
          {
            key: "flashDeals",
            title: "Mega Clearance & Deal Updates",
            desc: "Daily wholesale flash sale and bulk tier discount notifications",
          },
        ].map((item) => (
          <div
            key={item.key}
            onClick={() => toggle(item.key)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 transition-colors cursor-pointer"
          >
            <div className="pr-4">
              <p className="font-poppins font-bold text-xs sm:text-sm text-slate-900">
                {item.title}
              </p>
              <p className="text-[11px] text-slate-500 font-inter mt-0.5">
                {item.desc}
              </p>
            </div>
            <div
              className={cn(
                "w-10 h-6 rounded-full transition-colors relative flex items-center px-1 flex-shrink-0",
                alerts[item.key] ? "bg-accent" : "bg-slate-300"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                  alerts[item.key] ? "translate-x-4" : "translate-x-0"
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ProfilePreferencesTab;
