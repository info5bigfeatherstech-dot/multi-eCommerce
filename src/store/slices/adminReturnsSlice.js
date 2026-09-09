import { createSlice } from "@reduxjs/toolkit";

const initialReturns = [
  {
    id: "RET-8109",
    orderId: "ORD-98399",
    requestDate: "2026-09-09 09:15 AM",
    customer: {
      name: "Sunil Sharma",
      businessName: "Sharma Wholesale Hub",
      phone: "+91 99110 52319",
      email: "sunil@sharmawholesalers.com",
      city: "New Delhi",
      state: "Delhi",
      address: "Shop 14, Sadar Bazar, Central Delhi",
      pincode: "110006",
    },
    item: {
      name: "Foldable Silicone Electric Kettle 600ml",
      qty: 15,
      unitPrice: 349,
      totalAmount: 5235,
      sku: "KT-SIL-600",
    },
    reasonCategory: "Defective Lot",
    reasonDetails: "Heating element not turning on in 15 units out of the 40 unit carton received.",
    proofImage: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80",
    returnStatus: "Requested", // Requested, Pickup Scheduled, Reverse In-Transit, QC Pending, QC Passed, QC Failed, Rejected
    stage: 1, // 1: Request, 2: Pickup, 3: In Transit, 4: QC, 5: Refunded
    reverseCourier: null,
    reverseAwb: null,
    qcDisposition: null, // Restock, Liquidate, Discard
    qcNotes: null,
    refundStatus: "Pending", // Pending, Approved, Processing, Refunded, Rejected
    refundAmount: 5235,
    payoutMethod: "Original Payment (UPI)",
    payoutUtr: null,
  },
  {
    id: "RET-8102",
    orderId: "ORD-98401",
    requestDate: "2026-09-08 16:40 PM",
    customer: {
      name: "Rameshwar Patel",
      businessName: "Patel Mega Superstore Pvt Ltd",
      phone: "+91 98251 44820",
      email: "ramesh@patelstore.in",
      city: "Ahmedabad",
      state: "Gujarat",
      address: "Plot 42, GIDC Phase 2, Vatva Industrial Estate",
      pincode: "382445",
    },
    item: {
      name: "Multi-Functional 6-in-1 Drain Basket",
      qty: 20,
      unitPrice: 79,
      totalAmount: 1580,
      sku: "DRN-BSK-6IN1",
    },
    reasonCategory: "Transit Damage",
    reasonDetails: "Outer carton crushed during delivery; plastic strainers cracked.",
    proofImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    returnStatus: "Pickup Scheduled",
    stage: 2,
    reverseCourier: "Delhivery Reverse Logistics",
    reverseAwb: "DEL-REV-9018239",
    qcDisposition: null,
    qcNotes: null,
    refundStatus: "Approved",
    refundAmount: 1580,
    payoutMethod: "Bank NEFT",
    payoutUtr: null,
  },
  {
    id: "RET-8095",
    orderId: "ORD-98384",
    requestDate: "2026-09-08 11:20 AM",
    customer: {
      name: "Pooja Deshmukh",
      businessName: "Aesthetic Living Mart",
      phone: "+91 98200 77123",
      email: "pooja@aestheticliving.co.in",
      city: "Pune",
      state: "Maharashtra",
      address: "Unit 3B, Phoenix Marketcity Commercial complex, Viman Nagar",
      pincode: "411014",
    },
    item: {
      name: "Aroma Flame Humidifier & Diffuser",
      qty: 10,
      unitPrice: 280,
      totalAmount: 2800,
      sku: "ARM-FLM-BLK",
    },
    reasonCategory: "Incorrect Variant Sent",
    reasonDetails: "Received White shell variant instead of Black ordered in invoice.",
    proofImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80",
    returnStatus: "Reverse In-Transit",
    stage: 3,
    reverseCourier: "BlueDart Return Express",
    reverseAwb: "BLU-REV-8831920",
    qcDisposition: null,
    qcNotes: null,
    refundStatus: "Approved",
    refundAmount: 2800,
    payoutMethod: "Original Payment (NEFT)",
    payoutUtr: null,
  },
  {
    id: "RET-8088",
    orderId: "ORD-98342",
    requestDate: "2026-09-07 15:10 PM",
    customer: {
      name: "Amitabh Sen",
      businessName: "Bengal Gifting & Utilities",
      phone: "+91 98310 99482",
      email: "amitabh@bengalgifts.org",
      city: "Kolkata",
      state: "West Bengal",
      address: "12, Park Street, Camac Street Junction",
      pincode: "700016",
    },
    item: {
      name: "Magnetic Luxury Chess & Board Games Set",
      qty: 12,
      unitPrice: 240,
      totalAmount: 2880,
      sku: "GM-CHS-MAG",
    },
    reasonCategory: "Missing Pieces / Packaging Defect",
    reasonDetails: "Four sets had missing magnetic pawns inside sealed boxes.",
    proofImage: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=400&q=80",
    returnStatus: "QC Pending",
    stage: 4,
    reverseCourier: "Ekart Reverse",
    reverseAwb: "EKT-REV-1192847",
    qcDisposition: null,
    qcNotes: "Package received at Bhiwandi warehouse dock #4. Awaiting QC officer verification.",
    refundStatus: "Pending",
    refundAmount: 2880,
    payoutMethod: "Instant UPI Payout",
    payoutUtr: null,
  },
  {
    id: "RET-8071",
    orderId: "ORD-98371",
    requestDate: "2026-09-06 18:30 PM",
    customer: {
      name: "Vikram Rathore",
      businessName: "Rathore Electronics & Retail",
      phone: "+91 94140 18274",
      email: "vikram@rathorestore.com",
      city: "Jaipur",
      state: "Rajasthan",
      address: "C-49, MI Road, Opp. City Palace",
      pincode: "302001",
    },
    item: {
      name: "Rechargeable Motion Sensor LED Wardrobe Light",
      qty: 25,
      unitPrice: 85,
      totalAmount: 2125,
      sku: "LED-MOT-WHT",
    },
    reasonCategory: "Customer Surplus / Exchange",
    reasonDetails: "Customer requested return of overstocked units in unopened original packaging.",
    proofImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80",
    returnStatus: "QC Passed",
    stage: 4,
    reverseCourier: "Delhivery Reverse",
    reverseAwb: "DEL-REV-4482019",
    qcDisposition: "Restock to Active Inventory",
    qcNotes: "Factory seal intact. Units tested 100% operational. Approved for full refund.",
    refundStatus: "Processing",
    refundAmount: 2125,
    payoutMethod: "Instant UPI Payout",
    payoutUtr: null,
  },
  {
    id: "RET-8064",
    orderId: "ORD-98350",
    requestDate: "2026-09-05 14:00 PM",
    customer: {
      name: "Karthik Sundaram",
      businessName: "South India Retailers Syndicate",
      phone: "+91 98401 22910",
      email: "karthik@sundaramgroups.in",
      city: "Chennai",
      state: "Tamil Nadu",
      address: "No 77, T. Nagar Main Road",
      pincode: "600017",
    },
    item: {
      name: "Vacuum Seal Multi-layer Food Containers 4-Pack",
      qty: 30,
      unitPrice: 199,
      totalAmount: 5970,
      sku: "KIT-VAC-CONT",
    },
    reasonCategory: "Used Product / Broken Seal",
    reasonDetails: "Claimed factory defective, but items were returned stained and without retail cartons.",
    proofImage: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80",
    returnStatus: "QC Failed",
    stage: 4,
    reverseCourier: "BlueDart Return",
    reverseAwb: "BLU-REV-1092837",
    qcDisposition: "Discard / Reject",
    qcNotes: "Rejected by QC Team. Used condition violation of B2B Wholesale Return Policy.",
    refundStatus: "Rejected",
    refundAmount: 5970,
    payoutMethod: "Bank NEFT",
    payoutUtr: null,
  },
  {
    id: "RET-8050",
    orderId: "ORD-98315",
    requestDate: "2026-09-04 10:15 AM",
    customer: {
      name: "Harish Gupta",
      businessName: "Gupta Traders & Sons",
      phone: "+91 94120 44921",
      email: "harish@guptatraders.in",
      city: "Kanpur",
      state: "Uttar Pradesh",
      address: "88/14, Naveen Market, Parade",
      pincode: "208001",
    },
    item: {
      name: "Stainless Steel Insulated Oil Dispenser 1000ml",
      qty: 20,
      unitPrice: 99,
      totalAmount: 1980,
      sku: "KIT-OIL-1000",
    },
    reasonCategory: "Manufacturing Defect",
    reasonDetails: "Leaking spout nozzle on testing batch.",
    proofImage: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80",
    returnStatus: "QC Passed",
    stage: 5,
    reverseCourier: "Delhivery Reverse",
    reverseAwb: "DEL-REV-3918290",
    qcDisposition: "Write-off to Manufacturer Warranty",
    qcNotes: "Passed inspection for vendor claim.",
    refundStatus: "Refunded",
    refundAmount: 1980,
    payoutMethod: "Instant UPI Payout",
    payoutUtr: "UPI-ICICI-260909184029",
  },
];

const loadReturns = () => {
  try {
    const saved = localStorage.getItem("apexmart_admin_returns");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load returns from storage:", e);
  }
  return initialReturns;
};

const adminReturnsSlice = createSlice({
  name: "adminReturns",
  initialState: {
    items: loadReturns(),
    filters: {
      status: "All",
      refundStatus: "All",
      searchQuery: "",
    },
  },
  reducers: {
    approveReturnRequest: (state, action) => {
      const { returnId, courier, awb } = action.payload;
      const ret = state.items.find((r) => r.id === returnId);
      if (ret) {
        ret.returnStatus = "Pickup Scheduled";
        ret.stage = 2;
        ret.reverseCourier = courier || "Delhivery Reverse Logistics";
        ret.reverseAwb = awb || `AWB-REV-${Math.floor(1000000 + Math.random() * 9000000)}`;
        ret.refundStatus = "Approved";
        localStorage.setItem("apexmart_admin_returns", JSON.stringify(state.items));
      }
    },
    rejectReturnRequest: (state, action) => {
      const { returnId, reason } = action.payload;
      const ret = state.items.find((r) => r.id === returnId);
      if (ret) {
        ret.returnStatus = "Rejected";
        ret.refundStatus = "Rejected";
        ret.qcNotes = `REJECTED: ${reason || "Does not meet wholesale return criteria"}`;
        localStorage.setItem("apexmart_admin_returns", JSON.stringify(state.items));
      }
    },
    updateReturnStage: (state, action) => {
      const { returnId, stage, returnStatus } = action.payload;
      const ret = state.items.find((r) => r.id === returnId);
      if (ret) {
        ret.stage = stage;
        ret.returnStatus = returnStatus;
        localStorage.setItem("apexmart_admin_returns", JSON.stringify(state.items));
      }
    },
    updateQCStatus: (state, action) => {
      const { returnId, isPassed, disposition, qcNotes } = action.payload;
      const ret = state.items.find((r) => r.id === returnId);
      if (ret) {
        ret.returnStatus = isPassed ? "QC Passed" : "QC Failed";
        ret.qcDisposition = disposition;
        ret.qcNotes = qcNotes;
        if (isPassed) {
          ret.stage = 4;
          ret.refundStatus = "Processing";
        } else {
          ret.refundStatus = "Rejected";
        }
        localStorage.setItem("apexmart_admin_returns", JSON.stringify(state.items));
      }
    },
    processRefund: (state, action) => {
      const { returnId, payoutMethod, utr } = action.payload;
      const ret = state.items.find((r) => r.id === returnId);
      if (ret) {
        ret.refundStatus = "Refunded";
        ret.stage = 5;
        if (payoutMethod) ret.payoutMethod = payoutMethod;
        ret.payoutUtr = utr || `UTR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        localStorage.setItem("apexmart_admin_returns", JSON.stringify(state.items));
      }
    },
    resetReturns: (state) => {
      state.items = initialReturns;
      localStorage.setItem("apexmart_admin_returns", JSON.stringify(initialReturns));
    },
  },
});

export const {
  approveReturnRequest,
  rejectReturnRequest,
  updateReturnStage,
  updateQCStatus,
  processRefund,
  resetReturns,
} = adminReturnsSlice.actions;

export default adminReturnsSlice.reducer;
