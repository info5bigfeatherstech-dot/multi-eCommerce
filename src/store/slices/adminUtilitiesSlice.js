import { createSlice } from "@reduxjs/toolkit";

const initialCoupons = [
  {
    id: "CPN-01",
    code: "FESTIVE25",
    type: "Percentage",
    discount: 25,
    minSpend: 1999,
    maxDiscount: 1000,
    timesUsed: 1420,
    maxUsage: 5000,
    startDate: "2026-09-01",
    endDate: "2026-10-15",
    status: "Active", // 'Active' | 'Paused' | 'Expired'
    revenueGenerated: 1845000,
  },
  {
    id: "CPN-02",
    code: "WELCOME100",
    type: "Flat",
    discount: 100,
    minSpend: 599,
    maxDiscount: 100,
    timesUsed: 6240,
    maxUsage: 10000,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "Active",
    revenueGenerated: 4210000,
  },
  {
    id: "CPN-03",
    code: "VIPFREESHIP",
    type: "Free Shipping",
    discount: 99,
    minSpend: 999,
    maxDiscount: 99,
    timesUsed: 890,
    maxUsage: 2000,
    startDate: "2026-08-15",
    endDate: "2026-09-30",
    status: "Active",
    revenueGenerated: 1240000,
  },
  {
    id: "CPN-04",
    code: "FLASH50_MIDNIGHT",
    type: "Percentage",
    discount: 50,
    minSpend: 2999,
    maxDiscount: 2000,
    timesUsed: 350,
    maxUsage: 500,
    startDate: "2026-09-05",
    endDate: "2026-09-06",
    status: "Expired",
    revenueGenerated: 890000,
  },
];

const initialLoyaltyTiers = [
  {
    id: "TIER-BRONZE",
    name: "Bronze Insider",
    minSpendAnnual: 0,
    pointsMultiplier: "1x (1 pt per ₹100)",
    activeMembers: 14200,
    perks: ["Standard Member Offers", "Points Redemption at Checkout"],
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    id: "TIER-SILVER",
    name: "Silver Prestige",
    minSpendAnnual: 10000,
    pointsMultiplier: "1.5x (1.5 pts per ₹100)",
    activeMembers: 4650,
    perks: ["5% Birthday Discount Voucher", "Free Shipping above ₹499", "Early Access to Sales"],
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
  },
  {
    id: "TIER-GOLD",
    name: "Gold Executive",
    minSpendAnnual: 25000,
    pointsMultiplier: "2x (2 pts per ₹100)",
    activeMembers: 1820,
    perks: ["Free Express Shipping on All Orders", "Dedicated WhatsApp Concierge", "Surprise Anniversary Box"],
    badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  {
    id: "TIER-PLATINUM",
    name: "Diamond Elite Club",
    minSpendAnnual: 50000,
    pointsMultiplier: "3x (3 pts per ₹100)",
    activeMembers: 410,
    perks: ["Zero Delivery Fees Forever", "Priority Dispatch within 2 Hours", "Quarterly Luxury Gift Hampers", "Dedicated Relationship Manager"],
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
  },
];

const initialNotifications = [
  {
    id: "NTF-101",
    title: "Mega Festive Sale Teaser Broadcast",
    channel: "WhatsApp & SMS",
    targetAudience: "All Registered Customers (21,080)",
    status: "Delivered",
    openRate: "88.4%",
    clickRate: "34.2%",
    sentDate: "2026-09-08 10:30",
    message: "🎉 Grand Festive Days are live! Enjoy up to 50% OFF + Extra 10% on prepaid orders. Shop top festive drops now: bit.ly/festive-deal",
  },
  {
    id: "NTF-102",
    title: "Abandoned Cart Recovery Flow (1hr Delay)",
    channel: "Automated Email & WhatsApp",
    targetAudience: "Cart Dropouts > ₹1,499",
    status: "Active Trigger",
    openRate: "72.1%",
    clickRate: "28.5%",
    sentDate: "Continuous Flow",
    message: "Hey there! You left items in your cart. Complete checkout in next 2 hours to get free express shipping!",
  },
  {
    id: "NTF-103",
    title: "Post-Dispatch Real-Time Tracking Link",
    channel: "Automated SMS",
    targetAudience: "Dispatched Order Customers",
    status: "Active Trigger",
    openRate: "96.0%",
    clickRate: "61.2%",
    sentDate: "Continuous Flow",
    message: "Your order #{order_id} has been dispatched with BlueDart! Track live location here: track.delhivery.com/{awb}",
  },
  {
    id: "NTF-104",
    title: "VIP Diamond Exclusive Preview Invite",
    channel: "Email Newsletter",
    targetAudience: "Diamond Elite Club (410 Members)",
    status: "Delivered",
    openRate: "91.5%",
    clickRate: "52.8%",
    sentDate: "2026-09-04 18:00",
    message: "Exclusive invitation to our Autumn Luxury Trunk Show. Pre-book your bespoke selections before public launch.",
  },
];

const initialGiftCards = [
  {
    id: "GC-2026-901",
    code: "GIFT-7821-9943-2026",
    recipientName: "Kavita Singhania",
    recipientEmail: "kavita.s@biznet.in",
    senderName: "Aakash Singhania",
    initialAmount: 5000,
    balanceRemaining: 3250,
    expiryDate: "2027-09-01",
    status: "Active", // 'Active' | 'Redeemed' | 'Expired'
    issuedDate: "2026-09-01",
    theme: "Festive Celebration",
  },
  {
    id: "GC-2026-902",
    code: "GIFT-1120-8844-5512",
    recipientName: "Rohan Verma",
    recipientEmail: "rohan.v99@example.com",
    senderName: "Pooja Malhotra",
    initialAmount: 2500,
    balanceRemaining: 0,
    expiryDate: "2027-08-15",
    status: "Redeemed",
    issuedDate: "2026-08-15",
    theme: "Birthday Surprise",
  },
  {
    id: "GC-2026-903",
    code: "GIFT-6655-3321-7788",
    recipientName: "Ananya Sen",
    recipientEmail: "ananya.sen@outlook.com",
    senderName: "TechCorp Corporate Rewards",
    initialAmount: 10000,
    balanceRemaining: 10000,
    expiryDate: "2027-09-08",
    status: "Active",
    issuedDate: "2026-09-08",
    theme: "Corporate Milestone",
  },
  {
    id: "GC-2026-904",
    code: "GIFT-3344-9900-1122",
    recipientName: "Vikram Malhotra",
    recipientEmail: "vikram.m@gmail.com",
    senderName: "Self Purchase",
    initialAmount: 1500,
    balanceRemaining: 0,
    expiryDate: "2026-09-01",
    status: "Expired",
    issuedDate: "2025-09-01",
    theme: "Standard Gift Card",
  },
];

const initialState = {
  coupons: initialCoupons,
  loyaltyTiers: initialLoyaltyTiers,
  notifications: initialNotifications,
  giftCards: initialGiftCards,
};

export const adminUtilitiesSlice = createSlice({
  name: "adminUtilities",
  initialState,
  reducers: {
    // Coupon Reducers
    addCoupon: (state, action) => {
      state.coupons.unshift(action.payload);
    },
    toggleCouponStatus: (state, action) => {
      const coupon = state.coupons.find((c) => c.id === action.payload);
      if (coupon) {
        coupon.status = coupon.status === "Active" ? "Paused" : "Active";
      }
    },
    deleteCoupon: (state, action) => {
      state.coupons = state.coupons.filter((c) => c.id !== action.payload);
    },

    // Gift Card Reducers
    issueGiftCard: (state, action) => {
      state.giftCards.unshift(action.payload);
    },
    deactivateGiftCard: (state, action) => {
      const card = state.giftCards.find((g) => g.id === action.payload);
      if (card) {
        card.status = "Expired";
      }
    },

    // Notification Reducers
    createBroadcastNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },

    // Loyalty Reducers
    updateTierPerks: (state, action) => {
      const { tierId, perks } = action.payload;
      const tier = state.loyaltyTiers.find((t) => t.id === tierId);
      if (tier) {
        tier.perks = perks;
      }
    },
  },
});

export const {
  addCoupon,
  toggleCouponStatus,
  deleteCoupon,
  issueGiftCard,
  deactivateGiftCard,
  createBroadcastNotification,
  deleteNotification,
  updateTierPerks,
} = adminUtilitiesSlice.actions;

export default adminUtilitiesSlice.reducer;
