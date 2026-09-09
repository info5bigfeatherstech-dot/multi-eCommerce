import { createSlice } from "@reduxjs/toolkit";

const initialOrders = [
  {
    id: "ORD-98401",
    date: "2026-09-09 08:45 AM",
    customer: {
      name: "Rameshwar Patel",
      businessName: "Patel Mega Superstore Pvt Ltd",
      gstNumber: "24AAECP2918K1Z5",
      phone: "+91 98251 44820",
      email: "ramesh@patelstore.in",
      city: "Ahmedabad",
      state: "Gujarat",
      address: "Plot 42, GIDC Phase 2, Vatva Industrial Estate",
      pincode: "382445",
    },
    items: [
      {
        id: "p1",
        name: "Electric Vegetable & Garlic Mini Chopper",
        qty: 120,
        unitPrice: 89,
        total: 10680,
      },
      {
        id: "p2",
        name: "Multi-Functional 6-in-1 Drain Basket",
        qty: 60,
        unitPrice: 79,
        total: 4740,
      },
    ],
    totalAmount: 15420,
    paymentMethod: "Prepaid UPI",
    paymentStatus: "Paid",
    orderStatus: "Confirmed",
    verificationStatus: "Verified",
    verificationNotes: "GST and warehouse address verified over phone call.",
    courierPartner: "Delhivery Surface",
    trackingNumber: "DEL-849102941",
    priority: "High",
  },
  {
    id: "ORD-98399",
    date: "2026-09-09 07:15 AM",
    customer: {
      name: "Sunil Sharma",
      businessName: "Sharma Wholesale Hub",
      gstNumber: "07AABCS1429B1Z2",
      phone: "+91 99110 52319",
      email: "sunil@sharmawholesalers.com",
      city: "New Delhi",
      state: "Delhi",
      address: "Shop 14, Sadar Bazar, Central Delhi",
      pincode: "110006",
    },
    items: [
      {
        id: "p3",
        name: "Foldable Silicone Electric Kettle 600ml",
        qty: 40,
        unitPrice: 349,
        total: 13960,
      },
      {
        id: "p4",
        name: "Smart LED Touch Temperature Bottle 500ml",
        qty: 100,
        unitPrice: 95,
        total: 9500,
      },
    ],
    totalAmount: 23460,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    verificationStatus: "Pending Verification",
    verificationNotes: "High-value COD order. Customer phone confirmation pending.",
    courierPartner: null,
    trackingNumber: null,
    priority: "Urgent",
  },
  {
    id: "ORD-98384",
    date: "2026-09-08 18:20 PM",
    customer: {
      name: "Pooja Deshmukh",
      businessName: "Aesthetic Living Mart",
      gstNumber: "27AALPD9012J1ZK",
      phone: "+91 98200 77123",
      email: "pooja@aestheticliving.co.in",
      city: "Pune",
      state: "Maharashtra",
      address: "Unit 3B, Phoenix Marketcity Commercial complex, Viman Nagar",
      pincode: "411014",
    },
    items: [
      {
        id: "p5",
        name: "Aroma Flame Humidifier & Diffuser",
        qty: 50,
        unitPrice: 280,
        total: 14000,
      },
      {
        id: "p6",
        name: "Nordic Ceramic Flower Vases Set of 3",
        qty: 25,
        unitPrice: 320,
        total: 8000,
      },
    ],
    totalAmount: 22000,
    paymentMethod: "Bank NEFT / RTGS",
    paymentStatus: "Paid",
    orderStatus: "Dispatched",
    verificationStatus: "Verified",
    verificationNotes: "NEFT verified by accounts desk. Handed over to BlueDart.",
    courierPartner: "BlueDart Express",
    trackingNumber: "BLU-772910382",
    priority: "Standard",
  },
  {
    id: "ORD-98371",
    date: "2026-09-08 14:10 PM",
    customer: {
      name: "Vikram Rathore",
      businessName: "Rathore Electronics & Retail",
      gstNumber: "08AAECR8819L1Z9",
      phone: "+91 94140 18274",
      email: "vikram@rathorestore.com",
      city: "Jaipur",
      state: "Rajasthan",
      address: "C-49, MI Road, Opp. City Palace",
      pincode: "302001",
    },
    items: [
      {
        id: "p7",
        name: "Rechargeable Motion Sensor LED Wardrobe Light",
        qty: 150,
        unitPrice: 85,
        total: 12750,
      },
      {
        id: "p8",
        name: "Mini Thermal Bluetooth Pocket Printer",
        qty: 30,
        unitPrice: 420,
        total: 12600,
      },
    ],
    totalAmount: 25350,
    paymentMethod: "Prepaid UPI",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    verificationStatus: "Verified",
    verificationNotes: "Delivered successfully with OTP confirmation.",
    courierPartner: "Delhivery Surface",
    trackingNumber: "DEL-198273940",
    priority: "Standard",
  },
  {
    id: "ORD-98350",
    date: "2026-09-08 11:30 AM",
    customer: {
      name: "Karthik Sundaram",
      businessName: "South India Retailers Syndicate",
      gstNumber: "33AABCS4412F1Z8",
      phone: "+91 98401 22910",
      email: "karthik@sundaramgroups.in",
      city: "Chennai",
      state: "Tamil Nadu",
      address: "No 77, T. Nagar Main Road",
      pincode: "600017",
    },
    items: [
      {
        id: "p9",
        name: "Vacuum Seal Multi-layer Food Containers 4-Pack",
        qty: 80,
        unitPrice: 199,
        total: 15920,
      },
    ],
    totalAmount: 15920,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Failed",
    orderStatus: "Cancelled",
    verificationStatus: "Flagged",
    verificationNotes: "Customer phone switched off on 3 attempts. Cancelled by fraud check.",
    courierPartner: null,
    trackingNumber: null,
    priority: "Low",
  },
  {
    id: "ORD-98342",
    date: "2026-09-07 19:40 PM",
    customer: {
      name: "Amitabh Sen",
      businessName: "Bengal Gifting & Utilities",
      gstNumber: "19AAGCS3391D1Z1",
      phone: "+91 98310 99482",
      email: "amitabh@bengalgifts.org",
      city: "Kolkata",
      state: "West Bengal",
      address: "12, Park Street, Camac Street Junction",
      pincode: "700016",
    },
    items: [
      {
        id: "p10",
        name: "Magnetic Luxury Chess & Board Games Set",
        qty: 45,
        unitPrice: 240,
        total: 10800,
      },
      {
        id: "p11",
        name: "Reusable Lint & Fur Remover Roller with Base",
        qty: 100,
        unitPrice: 48,
        total: 4800,
      },
    ],
    totalAmount: 15600,
    paymentMethod: "Prepaid UPI",
    paymentStatus: "Paid",
    orderStatus: "Confirmed",
    verificationStatus: "Verified",
    verificationNotes: "Approved for packing. Awaiting courier pickup.",
    courierPartner: "Ekart Logistics",
    trackingNumber: "EKT-449102839",
    priority: "High",
  },
  {
    id: "ORD-98315",
    date: "2026-09-07 16:05 PM",
    customer: {
      name: "Harish Gupta",
      businessName: "Gupta Traders & Sons",
      gstNumber: "09AABCG7721H1Z6",
      phone: "+91 94120 44921",
      email: "harish@guptatraders.in",
      city: "Kanpur",
      state: "Uttar Pradesh",
      address: "88/14, Naveen Market, Parade",
      pincode: "208001",
    },
    items: [
      {
        id: "p12",
        name: "Stainless Steel Insulated Oil Dispenser 1000ml",
        qty: 120,
        unitPrice: 99,
        total: 11880,
      },
    ],
    totalAmount: 11880,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    verificationStatus: "Pending Verification",
    verificationNotes: "New customer. Verification call scheduled for afternoon.",
    courierPartner: null,
    trackingNumber: null,
    priority: "Standard",
  },
];

const loadOrders = () => {
  try {
    const saved = localStorage.getItem("apexmart_admin_orders");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to read orders from localStorage:", e);
  }
  return initialOrders;
};

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState: {
    items: loadOrders(),
    selectedOrderId: null,
    filters: {
      status: "All",
      searchQuery: "",
      paymentMethod: "All",
      verificationStatus: "All",
    },
  },
  reducers: {
    updateOrderStatus: (state, action) => {
      const { orderId, newStatus, courierPartner, trackingNumber } = action.payload;
      const order = state.items.find((o) => o.id === orderId);
      if (order) {
        order.orderStatus = newStatus;
        if (courierPartner !== undefined) order.courierPartner = courierPartner;
        if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
        localStorage.setItem("apexmart_admin_orders", JSON.stringify(state.items));
      }
    },
    updateVerificationStatus: (state, action) => {
      const { orderId, verificationStatus, verificationNotes } = action.payload;
      const order = state.items.find((o) => o.id === orderId);
      if (order) {
        order.verificationStatus = verificationStatus;
        if (verificationNotes !== undefined) order.verificationNotes = verificationNotes;
        if (verificationStatus === "Verified" && order.orderStatus === "Pending") {
          order.orderStatus = "Confirmed";
        }
        localStorage.setItem("apexmart_admin_orders", JSON.stringify(state.items));
      }
    },
    setOrderFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetOrders: (state) => {
      state.items = initialOrders;
      localStorage.setItem("apexmart_admin_orders", JSON.stringify(initialOrders));
    },
  },
});

export const {
  updateOrderStatus,
  updateVerificationStatus,
  setOrderFilter,
  resetOrders,
} = adminOrdersSlice.actions;

export default adminOrdersSlice.reducer;
