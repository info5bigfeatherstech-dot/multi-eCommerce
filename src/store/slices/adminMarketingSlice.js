import { createSlice } from "@reduxjs/toolkit";

const initialCampaigns = [
  {
    id: "CMP-101",
    name: "Festive Mega B2B Wholesale Bonanza",
    objective: "Wholesale Bulk Orders",
    channels: ["WhatsApp", "Email", "Web Banner"],
    budget: 150000,
    spend: 92400,
    revenueGenerated: 580000,
    roas: 6.27,
    status: "Active",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
  },
  {
    id: "CMP-102",
    name: "Electronics Flash Drop & App Push Blast",
    objective: "Consumer Retail Sales",
    channels: ["Push Notification", "WhatsApp", "SMS"],
    budget: 80000,
    spend: 64000,
    revenueGenerated: 312000,
    roas: 4.88,
    status: "Active",
    startDate: "2026-09-05",
    endDate: "2026-09-15",
  },
  {
    id: "CMP-103",
    name: "Dropshipper Onboarding & Zero-Deposit Drive",
    objective: "Partner Acquisition",
    channels: ["Email", "LinkedIn Ads", "Web"],
    budget: 60000,
    spend: 38500,
    revenueGenerated: 194000,
    roas: 5.04,
    status: "Active",
    startDate: "2026-08-20",
    endDate: "2026-09-25",
  },
  {
    id: "CMP-104",
    name: "Cart Abandonment Auto-Recovery Flow",
    objective: "Remarketing & Checkout Lift",
    channels: ["WhatsApp", "Push Notification", "SMS"],
    budget: 40000,
    spend: 28900,
    revenueGenerated: 168000,
    roas: 5.81,
    status: "Active",
    startDate: "2026-08-01",
    endDate: "2026-10-31",
  },
  {
    id: "CMP-105",
    name: "Monsoon Handloom Clearance Push",
    objective: "Dead Stock Clearance",
    channels: ["Email", "Push Notification"],
    budget: 50000,
    spend: 50000,
    revenueGenerated: 185000,
    roas: 3.70,
    status: "Completed",
    startDate: "2026-07-15",
    endDate: "2026-08-15",
  },
];

const initialPushNotifications = [
  {
    id: "PSH-01",
    title: "⚡ Flash 40% Off Active Now!",
    message: "Top wireless audio and kitchen ceramic sets on instant discount. Free express shipping above ₹499.",
    segment: "All Registered Shoppers",
    sentCount: 38400,
    clickRate: 6.8,
    deepLink: "/category/electronics",
    status: "Sent",
    sentAt: "2026-09-08 11:30 AM",
  },
  {
    id: "PSH-02",
    title: "🛒 Items in your bag are selling out fast!",
    message: "Complete your checkout now and get an extra 10% instant discount with code PREPAID10.",
    segment: "Cart Abandoners (24h)",
    sentCount: 4120,
    clickRate: 14.2,
    deepLink: "/checkout",
    status: "Sent",
    sentAt: "2026-09-07 07:15 PM",
  },
  {
    id: "PSH-03",
    title: "📦 Wholesale Stock Restocked: 5000+ Units",
    message: "Fresh industrial motor supplies and silk garments arrived in warehouse. Reserve bulk tiers now.",
    segment: "Wholesale Buyers Network",
    sentCount: 1850,
    clickRate: 11.5,
    deepLink: "/admin/ecommerce/wholesale",
    status: "Sent",
    sentAt: "2026-09-06 09:00 AM",
  },
  {
    id: "PSH-04",
    title: "🎁 Weekend Festive Surprise Revealed",
    message: "Unlock secret VIP prices across apparel and home decor collections starting tonight at 8 PM.",
    segment: "VIP Tier Customers",
    sentCount: 6200,
    clickRate: 0,
    deepLink: "/category/fashion",
    status: "Scheduled",
    sentAt: "2026-09-12 08:00 PM",
  },
];

const initialWhatsAppCampaigns = [
  {
    id: "WA-01",
    campaignName: "Bulk Procurement Catalog Dispatch",
    templateName: "b2b_wholesale_catalog_v2",
    recipientSegment: "Verified Wholesale Buyers",
    recipientCount: 2450,
    deliveredCount: 2415,
    readCount: 2050,
    repliesCount: 380,
    status: "Completed",
    sentAt: "2026-09-08",
  },
  {
    id: "WA-02",
    campaignName: "Prepaid Discount UPI Incentive",
    templateName: "prepaid_checkout_offer",
    recipientSegment: "COD Order Placing Customers",
    recipientCount: 5200,
    deliveredCount: 5120,
    readCount: 4280,
    repliesCount: 640,
    status: "Completed",
    sentAt: "2026-09-07",
  },
  {
    id: "WA-03",
    campaignName: "Festival Season Early Bird Preview",
    templateName: "festive_vip_early_bird",
    recipientSegment: "All Active Opt-in Numbers",
    recipientCount: 14800,
    deliveredCount: 14610,
    readCount: 11920,
    repliesCount: 1420,
    status: "Active Broadcast",
    sentAt: "2026-09-06",
  },
  {
    id: "WA-04",
    campaignName: "Dropshipper Top-up Balance Reminder",
    templateName: "dropship_wallet_refill",
    recipientSegment: "Dropshippers with Low Balance",
    recipientCount: 48,
    deliveredCount: 48,
    readCount: 46,
    repliesCount: 34,
    status: "Completed",
    sentAt: "2026-09-05",
  },
];

const initialEmailSmsCampaigns = [
  {
    id: "EMS-01",
    type: "Email",
    campaignName: "ApexMart Wholesale September Digest",
    subjectLine: "Exclusive Volume Pricing & GST Tax Invoicing Updates",
    targetAudience: "Wholesale & B2B Inquiries",
    recipientsCount: 8400,
    deliveredRate: 99.1,
    openRate: 34.8,
    clickRate: 8.2,
    status: "Sent",
    sentAt: "2026-09-08",
  },
  {
    id: "EMS-02",
    type: "SMS",
    campaignName: "Flash Weekend Free Shipping Alert",
    senderHeader: "APXMRT",
    targetAudience: "All Retail Shoppers",
    recipientsCount: 22000,
    deliveredRate: 98.4,
    openRate: 94.0,
    clickRate: 5.4,
    status: "Sent",
    sentAt: "2026-09-06",
  },
  {
    id: "EMS-03",
    type: "Email",
    campaignName: "Dropship Automation Toolkit V2 Released",
    subjectLine: "Automate your Shopify & WooCommerce store dispatches with ApexMart",
    targetAudience: "Dropshipping Partner Database",
    recipientsCount: 3200,
    deliveredRate: 98.8,
    openRate: 41.2,
    clickRate: 12.6,
    status: "Sent",
    sentAt: "2026-09-04",
  },
  {
    id: "EMS-04",
    type: "SMS",
    campaignName: "Cart Reminder with 10% Extra Code",
    senderHeader: "APXMRT",
    targetAudience: "Abandoned Cart Users",
    recipientsCount: 4800,
    deliveredRate: 97.9,
    openRate: 96.0,
    clickRate: 11.2,
    status: "Active Flow",
    sentAt: "2026-09-02",
  },
];

const initialState = {
  campaigns: initialCampaigns,
  pushNotifications: initialPushNotifications,
  whatsappCampaigns: initialWhatsAppCampaigns,
  emailSmsCampaigns: initialEmailSmsCampaigns,
};

export const adminMarketingSlice = createSlice({
  name: "adminMarketing",
  initialState,
  reducers: {
    // Campaign Reducers
    addCampaign: (state, action) => {
      state.campaigns.unshift(action.payload);
    },
    toggleCampaignStatus: (state, action) => {
      const cmp = state.campaigns.find((c) => c.id === action.payload);
      if (cmp) {
        cmp.status = cmp.status === "Active" ? "Paused" : "Active";
      }
    },

    // Push Notification Reducers
    addPushNotification: (state, action) => {
      state.pushNotifications.unshift(action.payload);
    },

    // WhatsApp Reducers
    addWhatsAppBroadcast: (state, action) => {
      state.whatsappCampaigns.unshift(action.payload);
    },

    // Email/SMS Reducers
    addEmailSmsCampaign: (state, action) => {
      state.emailSmsCampaigns.unshift(action.payload);
    },
  },
});

export const {
  addCampaign,
  toggleCampaignStatus,
  addPushNotification,
  addWhatsAppBroadcast,
  addEmailSmsCampaign,
} = adminMarketingSlice.actions;

export default adminMarketingSlice.reducer;
