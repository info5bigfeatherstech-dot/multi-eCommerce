import { createSlice } from "@reduxjs/toolkit";

const initialSampleProducts = [
  {
    id: "DEMO-PRD-101",
    name: "Apex Ultra Wireless Noise-Cancelling Headphones",
    sku: "APX-WH-001",
    category: "Consumer Electronics",
    brand: "SoundForge",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
    retailPrice: 4999,
    wholesalePrice: 3299,
    wholesaleMinQty: 25,
    dropshipPrice: 3599,
    franchiseMargin: "24%",
    franchisePayout: 1200,
    stockQty: 840,
    stockStatus: "In Stock",
    supportedChannels: ["Retail", "Wholesale", "Dropshipping", "Franchise"],
    rating: 4.8,
    reviewsCount: 312,
    hsnCode: "85183000",
    gstRate: 18,
  },
  {
    id: "DEMO-PRD-102",
    name: "Organic Single-Estate Cold-Pressed Extra Virgin Olive Oil 1L",
    sku: "ORG-EVO-100",
    category: "FMCG & Gourmet",
    brand: "Verde Terra",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80",
    retailPrice: 1250,
    wholesalePrice: 780,
    wholesaleMinQty: 50,
    dropshipPrice: 890,
    franchiseMargin: "28%",
    franchisePayout: 350,
    stockQty: 1420,
    stockStatus: "In Stock",
    supportedChannels: ["Retail", "Wholesale", "Franchise"],
    rating: 4.9,
    reviewsCount: 184,
    hsnCode: "15091000",
    gstRate: 5,
  },
  {
    id: "DEMO-PRD-103",
    name: "Tailored Oxford Breathable Cotton Business Shirt",
    sku: "APP-OXF-003",
    category: "Fashion & Apparel",
    brand: "Monarch London",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80",
    retailPrice: 2199,
    wholesalePrice: 1100,
    wholesaleMinQty: 40,
    dropshipPrice: 1350,
    franchiseMargin: "35%",
    franchisePayout: 770,
    stockQty: 512,
    stockStatus: "In Stock",
    supportedChannels: ["Retail", "Wholesale", "Dropshipping", "Franchise"],
    rating: 4.7,
    reviewsCount: 95,
    hsnCode: "62052000",
    gstRate: 12,
  },
  {
    id: "DEMO-PRD-104",
    name: "Smart Precision Thermal Espresso Coffee Brewer",
    sku: "HOM-ESP-099",
    category: "Home & Appliances",
    brand: "BaristaPro",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=500&q=80",
    retailPrice: 18999,
    wholesalePrice: 13500,
    wholesaleMinQty: 10,
    dropshipPrice: 14800,
    franchiseMargin: "20%",
    franchisePayout: 3800,
    stockQty: 88,
    stockStatus: "Low Stock",
    supportedChannels: ["Retail", "Dropshipping", "Franchise"],
    rating: 4.9,
    reviewsCount: 420,
    hsnCode: "85167100",
    gstRate: 18,
  },
  {
    id: "DEMO-PRD-105",
    name: "Commercial Grade Heavy Duty Corrugated Packaging Box (Pack of 100)",
    sku: "B2B-BOX-100",
    category: "Industrial & B2B",
    brand: "PackShield Pro",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=500&q=80",
    retailPrice: 3500,
    wholesalePrice: 2100,
    wholesaleMinQty: 200,
    dropshipPrice: 2500,
    franchiseMargin: "18%",
    franchisePayout: 630,
    stockQty: 3200,
    stockStatus: "In Stock",
    supportedChannels: ["Wholesale", "Franchise"],
    rating: 4.6,
    reviewsCount: 78,
    hsnCode: "48191010",
    gstRate: 12,
  },
  {
    id: "DEMO-PRD-106",
    name: "Minimalist Ergonomic Matte White Ceramic Vase Set (3-Piece)",
    sku: "DEC-VAS-033",
    category: "Home & Living",
    brand: "Nordic Haven",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=500&q=80",
    retailPrice: 1850,
    wholesalePrice: 990,
    wholesaleMinQty: 30,
    dropshipPrice: 1190,
    franchiseMargin: "30%",
    franchisePayout: 555,
    stockQty: 290,
    stockStatus: "In Stock",
    supportedChannels: ["Retail", "Dropshipping", "Franchise"],
    rating: 4.8,
    reviewsCount: 142,
    hsnCode: "69139000",
    gstRate: 12,
  },
];

const initialSampleOrders = [
  {
    id: "ORD-DEMO-801",
    customer: "Vikram Malhotra",
    email: "vikram.m@gmail.com",
    phone: "+91 98201 44552",
    channel: "Retail (Prepaid)",
    totalAmount: 4999,
    itemsCount: 1,
    items: [
      { name: "Apex Ultra Wireless Headphones", sku: "APX-WH-001", qty: 1, price: 4999 }
    ],
    paymentMethod: "Razorpay (UPI Instant)",
    paymentStatus: "Paid",
    shippingCity: "Mumbai, Maharashtra",
    pincode: "400050",
    courier: "Delhivery Surface",
    awbNumber: "DLH-99210488",
    stage: "In Transit",
    stageIndex: 4,
    orderDate: "2026-09-08 14:32",
    riskScore: "Low (98/100 Safe)",
    history: [
      { time: "2026-09-08 14:32", event: "Order placed & prepaid via UPI" },
      { time: "2026-09-08 14:35", event: "AI Anti-Fraud Verification passed" },
      { time: "2026-09-08 15:10", event: "Auto-assigned Delhivery courier & AWB generated" },
      { time: "2026-09-08 16:45", event: "Packed at Bhiwandi Central Warehouse" },
      { time: "2026-09-09 08:20", event: "In Transit: Arrived at Kalina Distribution Hub" },
    ],
  },
  {
    id: "ORD-DEMO-802",
    customer: "Meera Krishnan",
    email: "meera.krish@outlook.com",
    phone: "+91 97401 88992",
    channel: "Retail (COD)",
    totalAmount: 3749,
    itemsCount: 2,
    items: [
      { name: "Organic Extra Virgin Olive Oil 1L", sku: "ORG-EVO-100", qty: 2, price: 1250 },
      { name: "Minimalist Ceramic Vase Set", sku: "DEC-VAS-033", qty: 1, price: 1249 }
    ],
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending COD Collection",
    shippingCity: "Bengaluru, Karnataka",
    pincode: "560034",
    courier: "Shiprocket Express",
    awbNumber: "SR-88401920",
    stage: "Courier Assigned",
    stageIndex: 2,
    orderDate: "2026-09-09 09:15",
    riskScore: "Verified (OTP Confirmed)",
    history: [
      { time: "2026-09-09 09:15", event: "COD order placed on storefront" },
      { time: "2026-09-09 09:16", event: "Automated WhatsApp OTP verified by customer" },
      { time: "2026-09-09 09:30", event: "Shiprocket Express AWB generated" },
    ],
  },
  {
    id: "ORD-DEMO-803",
    customer: "Apex Retailers Ltd (Wholesale)",
    email: "procurement@apexretail.in",
    phone: "+91 94140 33211",
    channel: "B2B Wholesale",
    totalAmount: 164950,
    itemsCount: 50,
    items: [
      { name: "Apex Ultra Wireless Headphones (Bulk Pack)", sku: "APX-WH-001", qty: 50, price: 3299 }
    ],
    paymentMethod: "NEFT / Bank Transfer",
    paymentStatus: "Invoice Approved (Net 30)",
    shippingCity: "Jaipur, Rajasthan",
    pincode: "302001",
    courier: "BlueDart Freight B2B",
    awbNumber: "BDT-1029384",
    stage: "Packing",
    stageIndex: 3,
    orderDate: "2026-09-07 11:00",
    riskScore: "Corporate KYC Verified",
    history: [
      { time: "2026-09-07 11:00", event: "B2B Purchase Order submitted" },
      { time: "2026-09-07 12:30", event: "GSTIN verified & Tax invoice generated" },
      { time: "2026-09-08 09:00", event: "BlueDart Pallet freight scheduled" },
      { time: "2026-09-09 10:15", event: "Warehouse pallet assembly in progress" },
    ],
  },
  {
    id: "ORD-DEMO-804",
    customer: "Karan Johar (Dropship Client via Store 'TechVibe')",
    email: "orders@techvibe.store",
    phone: "+91 98111 55670",
    channel: "Dropshipping",
    totalAmount: 14800,
    itemsCount: 1,
    items: [
      { name: "Smart Precision Thermal Espresso Brewer", sku: "HOM-ESP-099", qty: 1, price: 14800 }
    ],
    paymentMethod: "Reseller Pre-funded Wallet",
    paymentStatus: "Paid",
    shippingCity: "New Delhi, Delhi",
    pincode: "110016",
    courier: "Delhivery Express",
    awbNumber: "DLH-77441199",
    stage: "Delivered",
    stageIndex: 5,
    orderDate: "2026-09-06 18:20",
    riskScore: "Low Risk",
    history: [
      { time: "2026-09-06 18:20", event: "Auto-synced via Dropship Shopify API" },
      { time: "2026-09-06 18:21", event: "Dropshipper wallet debited ₹14,800" },
      { time: "2026-09-06 19:00", event: "White-label packing slip generated" },
      { time: "2026-09-07 09:30", event: "Picked up by Delhivery Express" },
      { time: "2026-09-08 17:40", event: "Delivered & digital POD captured" },
    ],
  },
  {
    id: "ORD-DEMO-805",
    customer: "Franchise Store #04 - Indiranagar",
    email: "indiranagar@franchise.network",
    phone: "+91 80 4112 3344",
    channel: "Physical Franchise",
    totalAmount: 85200,
    itemsCount: 75,
    items: [
      { name: "Tailored Oxford Cotton Shirts", sku: "APP-OXF-003", qty: 40, price: 1100 },
      { name: "Organic Extra Virgin Olive Oil 1L", sku: "ORG-EVO-100", qty: 35, price: 780 }
    ],
    paymentMethod: "Franchise Credit Line",
    paymentStatus: "Approved",
    shippingCity: "Bengaluru, Karnataka",
    pincode: "560038",
    courier: "Local City Hub Van",
    awbNumber: "HUB-BLR-004",
    stage: "Order Placed",
    stageIndex: 0,
    orderDate: "2026-09-09 11:30",
    riskScore: "Internal Franchise Account",
    history: [
      { time: "2026-09-09 11:30", event: "Store inventory replenishment requested" },
    ],
  },
];

const STAGES = [
  "Order Placed",
  "Verified",
  "Courier Assigned",
  "Packing",
  "In Transit",
  "Delivered",
];

const initialState = {
  activeMode: "unified", // 'unified' | 'retail' | 'wholesale' | 'dropshipping' | 'franchise'
  metrics: {
    totalRevenue: 28450000,
    totalOrders: 8420,
    retailShare: 42,
    wholesaleShare: 31,
    dropshipShare: 15,
    franchiseShare: 12,
    activeWholesaleBuyers: 320,
    activeDropshippers: 840,
    activeFranchiseOutlets: 48,
    antiRtoProtectionRate: 97.8,
    avgFulfillmentHours: 4.2,
  },
  sampleProducts: initialSampleProducts,
  sampleOrders: initialSampleOrders,
  sandboxes: {
    antiRtoResult: {
      pincode: "400050",
      city: "Mumbai, Bandra West",
      riskScore: 96,
      riskLevel: "Low Risk (Safe to Ship)",
      recommendation: "Immediate Dispatch via Prepaid or COD. High delivery confidence.",
      isSimulated: true,
    },
    courierComparison: [
      { name: "Delhivery Surface", rate: 64, eta: "2 Business Days", recommended: true, score: 9.4 },
      { name: "Shiprocket Air", rate: 89, eta: "Next Day Delivery", recommended: false, score: 9.1 },
      { name: "BlueDart Express", rate: 110, eta: "Next Day by 12 PM", recommended: false, score: 8.9 },
    ],
    marginCalculator: {
      mrp: 2999,
      retailCost: 1499,
      retailProfit: 1500,
      wholesalePrice: 1899,
      wholesaleMargin: "36.7%",
      dropshipPrice: 2099,
      dropshipProfit: 900,
      franchisePayout: 600,
    },
    whatsappPreview: {
      template: "Abandoned Cart Recovery",
      message: "Hi Priya! 👋 We noticed you left your Apex Wireless Headphones in your cart. Complete your order today and get an extra 10% OFF with code DEMO10: https://store.demo/cart",
      status: "Ready to Broadcast",
    },
  },
};

const adminDemoSlice = createSlice({
  name: "adminDemo",
  initialState,
  reducers: {
    setDemoMode: (state, action) => {
      state.activeMode = action.payload;
    },
    advanceOrderWorkflow: (state, action) => {
      const { orderId } = action.payload;
      const order = state.sampleOrders.find((o) => o.id === orderId);
      if (order && order.stageIndex < STAGES.length - 1) {
        order.stageIndex += 1;
        order.stage = STAGES[order.stageIndex];
        order.history.unshift({
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          event: `Status progressed to: ${order.stage}`,
        });
      }
    },
    simulateIncomingOrder: (state, action) => {
      const newOrder = {
        id: `ORD-DEMO-${Math.floor(100 + Math.random() * 900)}`,
        customer: action.payload?.customer || "Ananya Sharma",
        email: action.payload?.email || "ananya.s@gmail.com",
        phone: "+91 99300 22119",
        channel: action.payload?.channel || "Retail (Prepaid)",
        totalAmount: action.payload?.totalAmount || 4999,
        itemsCount: 1,
        items: [
          { name: "Apex Ultra Wireless Headphones", sku: "APX-WH-001", qty: 1, price: 4999 },
        ],
        paymentMethod: "UPI Instant",
        paymentStatus: "Paid",
        shippingCity: "Pune, Maharashtra",
        pincode: "411001",
        courier: "Delhivery Air",
        awbNumber: `DLH-${Math.floor(10000000 + Math.random() * 90000000)}`,
        stage: "Order Placed",
        stageIndex: 0,
        orderDate: "Just Now",
        riskScore: "Low (99/100 Safe)",
        history: [{ time: "Just Now", event: "Simulated order placed on storefront" }],
      };
      state.sampleOrders.unshift(newOrder);
      state.metrics.totalOrders += 1;
      state.metrics.totalRevenue += newOrder.totalAmount;
    },
    addSampleProduct: (state, action) => {
      state.sampleProducts.unshift({
        id: `DEMO-PRD-${Math.floor(200 + Math.random() * 800)}`,
        ...action.payload,
      });
    },
    runAntiRtoSimulation: (state, action) => {
      const { pincode, paymentType } = action.payload;
      const isCod = paymentType === "COD";
      const pinNum = parseInt(pincode, 10) || 400001;
      const isHighRisk = isCod && pinNum % 7 === 0;

      state.sandboxes.antiRtoResult = {
        pincode,
        city: pinNum > 500000 ? "Bengaluru, South Zone" : "Mumbai Metropolitan",
        riskScore: isHighRisk ? 38 : isCod ? 84 : 98,
        riskLevel: isHighRisk
          ? "High Risk (Potential RTO)"
          : isCod
          ? "Moderate Risk (OTP Recommended)"
          : "Low Risk (Safe)",
        recommendation: isHighRisk
          ? "Require mandatory WhatsApp OTP and ₹200 advance deposit before shipping."
          : isCod
          ? "Dispatch with standard automated SMS/WhatsApp verification."
          : "Prepaid order confirmed. Auto-allocate fastest courier without review.",
        isSimulated: true,
      };
    },
    runCourierAllocationSimulation: (state, action) => {
      const { weight } = action.payload;
      const baseWeight = parseFloat(weight) || 1.0;

      state.sandboxes.courierComparison = [
        {
          name: "Delhivery Surface",
          rate: Math.round(55 * baseWeight),
          eta: "2 Business Days",
          recommended: true,
          score: 9.4,
        },
        {
          name: "Shiprocket Express Air",
          rate: Math.round(85 * baseWeight),
          eta: "Next Day Delivery",
          recommended: false,
          score: 9.1,
        },
        {
          name: "BlueDart Priority",
          rate: Math.round(115 * baseWeight),
          eta: "Next Day 12 PM",
          recommended: false,
          score: 8.8,
        },
      ];
    },
    runMultiTierPricingSimulation: (state, action) => {
      const mrp = Number(action.payload) || 2999;
      const wholesalePrice = Math.round(mrp * 0.65);
      const dropshipPrice = Math.round(mrp * 0.72);
      const retailCost = Math.round(mrp * 0.45);
      const franchisePayout = Math.round(mrp * 0.2);

      state.sandboxes.marginCalculator = {
        mrp,
        retailCost,
        retailProfit: mrp - retailCost,
        wholesalePrice,
        wholesaleMargin: "35.0%",
        dropshipPrice,
        dropshipProfit: mrp - dropshipPrice,
        franchisePayout,
      };
    },
    resetDemoData: (state) => {
      state.sampleProducts = initialSampleProducts;
      state.sampleOrders = initialSampleOrders;
      state.activeMode = "unified";
      state.metrics = initialState.metrics;
    },
  },
});

export const {
  setDemoMode,
  advanceOrderWorkflow,
  simulateIncomingOrder,
  addSampleProduct,
  runAntiRtoSimulation,
  runCourierAllocationSimulation,
  runMultiTierPricingSimulation,
  resetDemoData,
} = adminDemoSlice.actions;

export default adminDemoSlice.reducer;
