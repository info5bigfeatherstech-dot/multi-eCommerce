import { createSlice } from "@reduxjs/toolkit";

const initialAnalyticsData = {
  selectedPeriod: "last30days", // "today", "last7days", "last30days", "quarter", "year"

  // Overview KPIs by period
  kpis: {
    last30days: {
      grossRevenue: 4850000,
      netProfit: 1140000,
      netMarginRate: 23.5,
      totalOrders: 284,
      aov: 17077,
      activeBuyers: 142,
      conversionRate: 3.42,
      previousGrossRevenue: 4120000,
      growthRate: 17.7,
    },
    last7days: {
      grossRevenue: 1240000,
      netProfit: 295000,
      netMarginRate: 23.8,
      totalOrders: 72,
      aov: 17222,
      activeBuyers: 58,
      conversionRate: 3.55,
      previousGrossRevenue: 1080000,
      growthRate: 14.8,
    },
    today: {
      grossRevenue: 185000,
      netProfit: 44000,
      netMarginRate: 23.7,
      totalOrders: 11,
      aov: 16818,
      activeBuyers: 11,
      conversionRate: 3.8,
      previousGrossRevenue: 160000,
      growthRate: 15.6,
    },
    quarter: {
      grossRevenue: 13900000,
      netProfit: 3260000,
      netMarginRate: 23.4,
      totalOrders: 810,
      aov: 17160,
      activeBuyers: 320,
      conversionRate: 3.38,
      previousGrossRevenue: 11800000,
      growthRate: 17.8,
    },
    year: {
      grossRevenue: 52400000,
      netProfit: 12100000,
      netMarginRate: 23.1,
      totalOrders: 3120,
      aov: 16795,
      activeBuyers: 680,
      conversionRate: 3.25,
      previousGrossRevenue: 43500000,
      growthRate: 20.4,
    },
  },

  // 6-Month Monthly Trend
  monthlyTrend: [
    { month: "Apr 2026", revenue: 3600000, profit: 820000, orders: 210 },
    { month: "May 2026", revenue: 3950000, profit: 910000, orders: 232 },
    { month: "Jun 2026", revenue: 4120000, profit: 960000, orders: 245 },
    { month: "Jul 2026", revenue: 4450000, profit: 1040000, orders: 260 },
    { month: "Aug 2026", revenue: 4680000, profit: 1090000, orders: 274 },
    { month: "Sep 2026 (MTD)", revenue: 4850000, profit: 1140000, orders: 284 },
  ],

  // Channel Breakdown
  channels: [
    { name: "Direct Wholesale Portal", share: 62, revenue: 3007000, orders: 176 },
    { name: "B2B Dropshipping Network", share: 23, revenue: 1115500, orders: 65 },
    { name: "Bulk Custom Inquiries", share: 15, revenue: 727500, orders: 43 },
  ],

  // Sales Financial Statement
  salesFinancials: {
    grossSales: 5120000,
    tradeDiscounts: 270000,
    netSales: 4850000,
    gstTaxCollected: 873000, // 18% avg GST
    shippingFreightIncome: 142000,
    totalGrossReceivables: 5865000,
  },

  // Payment Mode Breakdown
  paymentModes: [
    { mode: "Prepaid UPI / Net Banking", count: 128, amount: 2182500, share: 45 },
    { mode: "Bank NEFT / RTGS Wire", count: 74, amount: 1552000, share: 32 },
    { mode: "B2B Net-30 Credit", count: 32, amount: 679000, share: 14 },
    { mode: "Cash on Delivery (COD)", count: 50, amount: 436500, share: 9 },
  ],

  // Regional State Leaderboard
  stateSales: [
    { state: "Maharashtra", orders: 68, revenue: 1220000, growth: "+22%", share: 25.1 },
    { state: "Gujarat", orders: 54, revenue: 980000, growth: "+18%", share: 20.2 },
    { state: "Delhi NCR", orders: 48, revenue: 860000, growth: "+15%", share: 17.7 },
    { state: "Karnataka", orders: 36, revenue: 640000, growth: "+12%", share: 13.2 },
    { state: "Rajasthan", orders: 28, revenue: 490000, growth: "+9%", share: 10.1 },
    { state: "Other States", orders: 50, revenue: 660000, growth: "+14%", share: 13.7 },
  ],

  // Hourly Peak Demand
  peakHours: [
    { hour: "10 AM - 12 PM", label: "Morning Peak (Opening Trades)", orders: 84, intensity: 95 },
    { hour: "12 PM - 2 PM", label: "Midday Dispatch Cutoff", orders: 66, intensity: 75 },
    { hour: "2 PM - 4 PM", label: "Afternoon Settlement", orders: 42, intensity: 48 },
    { hour: "4 PM - 7 PM", label: "Evening Wholesale Re-orders", orders: 74, intensity: 84 },
    { hour: "7 PM - 10 PM", label: "Night Catalog Planning", orders: 18, intensity: 20 },
  ],

  // Product Analytics Data
  topProducts: [
    {
      sku: "LGT-FLD-150W",
      name: "Commercial LED Floodlight 150W IP66",
      category: "Electrical & Lighting",
      unitsSold: 420,
      revenue: 693000,
      margin: 28.5,
      stock: 148,
      velocity: "High (14 units/day)",
    },
    {
      sku: "SOL-MONO-540W",
      name: "Monocrystalline Solar Panel 540W Tier-1",
      category: "Solar & Renewable",
      unitsSold: 94,
      revenue: 676800,
      margin: 22.0,
      stock: 18,
      velocity: "Fast (3.1 units/day)",
    },
    {
      sku: "PMP-SUB-5HP",
      name: "Submersible Borewell Pump 5HP Three Phase",
      category: "Machinery & Motors",
      unitsSold: 52,
      revenue: 598000,
      margin: 26.2,
      stock: 6,
      velocity: "Medium (1.7 units/day)",
    },
    {
      sku: "CAB-COP-2.5MM",
      name: "Industrial Copper Cable 2.5 sq mm FR (90m)",
      category: "Electrical & Lighting",
      unitsSold: 280,
      revenue: 529200,
      margin: 19.8,
      stock: 310,
      velocity: "Very High (9.3 units/day)",
    },
    {
      sku: "TLS-HAM-800W",
      name: "Heavy Duty Rotary Hammer Drill 800W",
      category: "Hardware & Tools",
      unitsSold: 110,
      revenue: 423500,
      margin: 24.5,
      stock: 42,
      velocity: "Medium (3.6 units/day)",
    },
  ],

  // Category Revenue Share
  categoryShares: [
    { category: "Electrical & Lighting", revenue: 1746000, percentage: 36, margin: 25.2 },
    { category: "Solar & Renewable", revenue: 1212500, percentage: 25, margin: 22.8 },
    { category: "Machinery & Motors", revenue: 921500, percentage: 19, margin: 26.4 },
    { category: "Hardware & Tools", revenue: 679000, percentage: 14, margin: 24.0 },
    { category: "Safety & Security", revenue: 291000, percentage: 6, margin: 28.1 },
  ],

  // Dead Stock Watchlist
  deadStock: [
    {
      sku: "SAF-HLM-VENT",
      name: "Industrial Safety Helmet Vented (HDPE)",
      category: "Safety & Security",
      daysWithoutSale: 42,
      inventoryValue: 0,
      stock: 0,
      recommendation: "Replenish immediately or de-list",
    },
    {
      sku: "TLS-WCH-PIPE",
      name: "Heavy Duty 18-inch Pipe Wrench Cast Iron",
      category: "Hardware & Tools",
      daysWithoutSale: 35,
      inventoryValue: 48000,
      stock: 40,
      recommendation: "Run flash volume discount to clear stock",
    },
    {
      sku: "MCB-4P-63A",
      name: "Four Pole 63A Industrial Isolator Switch",
      category: "Electrical & Lighting",
      daysWithoutSale: 31,
      inventoryValue: 36000,
      stock: 30,
      recommendation: "Bundle with sub-distribution panel kit",
    },
  ],

  // Customer Analytics Data
  customerSegments: [
    { segment: "VIP Distributor Accounts", count: 24, revenue: 2425000, share: 50, avgSpend: 101041 },
    { segment: "Regular Retail Partners", count: 86, revenue: 1697500, share: 35, avgSpend: 19738 },
    { segment: "New First-Time Buyers", count: 32, revenue: 727500, share: 15, avgSpend: 22734 },
  ],

  // Top Customer Accounts Leaderboard
  topCustomers: [
    {
      id: "CUST-101",
      name: "Rajesh Sharma",
      company: "Apex Electricals & Hardware Ltd",
      city: "Ahmedabad",
      state: "Gujarat",
      ordersCount: 14,
      totalSpend: 462000,
      aov: 33000,
      paymentReliability: "100% On-Time",
      tier: "VIP Platinum",
    },
    {
      id: "CUST-102",
      name: "Suresh Gupta",
      company: "Gupta Electricals & Hardware",
      city: "Patna",
      state: "Bihar",
      ordersCount: 8,
      totalSpend: 284000,
      aov: 35500,
      paymentReliability: "92% On-Time",
      tier: "VIP Gold",
    },
    {
      id: "CUST-103",
      name: "Vikram Chauhan",
      company: "Chauhan Tools & Machinery",
      city: "Kanpur",
      state: "Uttar Pradesh",
      ordersCount: 7,
      totalSpend: 245000,
      aov: 35000,
      paymentReliability: "95% On-Time",
      tier: "VIP Gold",
    },
    {
      id: "CUST-104",
      name: "Anita Deshmukh",
      company: "Pooja Solar & Clean Energy",
      city: "Nagpur",
      state: "Maharashtra",
      ordersCount: 5,
      totalSpend: 210000,
      aov: 42000,
      paymentReliability: "100% On-Time",
      tier: "VIP Gold",
    },
    {
      id: "CUST-105",
      name: "Manoj Agarwal",
      company: "Balaji Agro Hardware",
      city: "Jaipur",
      state: "Rajasthan",
      ordersCount: 6,
      totalSpend: 198000,
      aov: 33000,
      paymentReliability: "94% On-Time",
      tier: "Silver Partner",
    },
  ],

  customerMetrics: {
    repeatPurchaseRate: 64.8,
    avgReorderIntervalDays: 16.5,
    customerLifetimeValue: 142000,
    churnRate: 4.2,
  },
};

const adminAnalyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState: initialAnalyticsData,
  reducers: {
    setAnalyticsPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
  },
});

export const { setAnalyticsPeriod } = adminAnalyticsSlice.actions;

export default adminAnalyticsSlice.reducer;
