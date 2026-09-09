import { createSlice } from "@reduxjs/toolkit";

const initialRetailProducts = [
  {
    id: "RET-101",
    sku: "APX-FSH-001",
    name: "Pure Handloom Chanderi Silk Saree",
    category: "Fashion & Apparel",
    mrp: 3499,
    baseCost: 1250,
    sellingPrice: 2199,
    channelStatus: "Active",
    badge: "Bestseller",
    sales30Days: 342,
  },
  {
    id: "RET-102",
    sku: "APX-ELC-002",
    name: "Aura Pro Wireless ANC Earbuds (Gen 2)",
    category: "Electronics & Audio",
    mrp: 4999,
    baseCost: 1600,
    sellingPrice: 2899,
    channelStatus: "Active",
    badge: "Hot Deal",
    sales30Days: 520,
  },
  {
    id: "RET-103",
    sku: "APX-HOM-003",
    name: "Handcrafted Studio Ceramic Dinnerware (Set of 6)",
    category: "Home & Living",
    mrp: 2999,
    baseCost: 980,
    sellingPrice: 1849,
    channelStatus: "Active",
    badge: "Trending",
    sales30Days: 185,
  },
  {
    id: "RET-104",
    sku: "APX-BEA-004",
    name: "Organic Rosehip & Kumkumadi Glow Elixir 30ml",
    category: "Beauty & Wellness",
    mrp: 1499,
    baseCost: 380,
    sellingPrice: 899,
    channelStatus: "Active",
    badge: "High Margin",
    sales30Days: 410,
  },
  {
    id: "RET-105",
    sku: "APX-FSH-005",
    name: "Embroidered Heritage Pashmina Shawl",
    category: "Fashion & Apparel",
    mrp: 5999,
    baseCost: 2200,
    sellingPrice: 4299,
    channelStatus: "Paused",
    badge: "Seasonal",
    sales30Days: 64,
  },
  {
    id: "RET-106",
    sku: "APX-HOM-006",
    name: "Aromatic Pure Soy Wax Jar Candle Set (4 Pack)",
    category: "Home & Living",
    mrp: 1299,
    baseCost: 390,
    sellingPrice: 799,
    channelStatus: "Active",
    badge: "Gift Special",
    sales30Days: 290,
  },
];

const initialWholesaleTiers = [
  {
    id: "TIER-01",
    tierName: "Bronze Wholesale",
    minUnits: 10,
    maxUnits: 50,
    discountRate: 25,
    minOrderValue: 15000,
    activeBuyersCount: 142,
  },
  {
    id: "TIER-02",
    tierName: "Silver Wholesale",
    minUnits: 51,
    maxUnits: 200,
    discountRate: 35,
    minOrderValue: 50000,
    activeBuyersCount: 88,
  },
  {
    id: "TIER-03",
    tierName: "Gold Enterprise Bulk",
    minUnits: 201,
    maxUnits: 1000,
    discountRate: 45,
    minOrderValue: 150000,
    activeBuyersCount: 36,
  },
  {
    id: "TIER-04",
    tierName: "Platinum Master Distributor",
    minUnits: 1001,
    maxUnits: 10000,
    discountRate: 52,
    minOrderValue: 500000,
    activeBuyersCount: 14,
  },
];

const initialWholesaleAccounts = [
  {
    id: "WACC-01",
    companyName: "Bharat Retailers Consortium Pvt Ltd",
    contactPerson: "Rajesh Singhania",
    email: "procurement@bharatretailers.in",
    phone: "+91 98201 44550",
    city: "Mumbai, Maharashtra",
    gstin: "27AABCB1234F1ZP",
    assignedTier: "Gold Enterprise Bulk",
    creditLimit: 1000000,
    outstandingDue: 240000,
    paymentTerms: "Net-30",
    status: "Active",
  },
  {
    id: "WACC-02",
    companyName: "Deccan Mart Wholesale Network",
    contactPerson: "Kavitha Reddy",
    email: "supplies@deccanmart.com",
    phone: "+91 94402 11980",
    city: "Hyderabad, Telangana",
    gstin: "36AABCD5678G1ZQ",
    assignedTier: "Silver Wholesale",
    creditLimit: 500000,
    outstandingDue: 85000,
    paymentTerms: "Net-15",
    status: "Active",
  },
  {
    id: "WACC-03",
    companyName: "Northland Lifestyle Stores LLP",
    contactPerson: "Vikram Malhotra",
    email: "accounts@northlandstores.in",
    phone: "+91 98110 33441",
    city: "New Delhi, Delhi NCR",
    gstin: "07AAECN9988H1ZR",
    assignedTier: "Platinum Master Distributor",
    creditLimit: 2500000,
    outstandingDue: 610000,
    paymentTerms: "Net-45",
    status: "Active",
  },
  {
    id: "WACC-04",
    companyName: "Marwar Handicrafts & General Trading",
    contactPerson: "Gopal Sharma",
    email: "marwartrading@gmail.com",
    phone: "+91 94140 77662",
    city: "Jaipur, Rajasthan",
    gstin: "08AABCM3322K1ZS",
    assignedTier: "Bronze Wholesale",
    creditLimit: 200000,
    outstandingDue: 0,
    paymentTerms: "Prepaid UPI / RTGS",
    status: "Active",
  },
  {
    id: "WACC-05",
    companyName: "Eastern Bengal Mercantile Co.",
    contactPerson: "Anirban Mukherjee",
    email: "info@easternmercantile.org",
    phone: "+91 98300 22119",
    city: "Kolkata, West Bengal",
    gstin: "19AABCE7744J1ZT",
    assignedTier: "Silver Wholesale",
    creditLimit: 400000,
    outstandingDue: 395000,
    paymentTerms: "Net-30",
    status: "Under Review",
  },
];

const initialDropshippers = [
  {
    id: "DROP-01",
    storeName: "UrbanChic Essentials",
    ownerName: "Pooja Verma",
    platform: "Shopify Store",
    email: "support@urbanchicessentials.in",
    phone: "+91 98710 44221",
    activeOrders: 42,
    totalDelivered: 1240,
    walletBalance: 48500,
    customBrandingSlip: true,
    status: "Active",
  },
  {
    id: "DROP-02",
    storeName: "SonicGadgets India",
    ownerName: "Arjun Nambiar",
    platform: "WooCommerce",
    email: "partner@sonicgadgets.com",
    phone: "+91 98450 66330",
    activeOrders: 68,
    totalDelivered: 2890,
    walletBalance: 92400,
    customBrandingSlip: true,
    status: "Active",
  },
  {
    id: "DROP-03",
    storeName: "Vedic Living Boutique",
    ownerName: "Smita Deshpande",
    platform: "Custom API",
    email: "smita@vedicliving.store",
    phone: "+91 98220 55887",
    activeOrders: 19,
    totalDelivered: 680,
    walletBalance: 18200,
    customBrandingSlip: true,
    status: "Active",
  },
  {
    id: "DROP-04",
    storeName: "QuickBazaar Express",
    ownerName: "Farhan Siddiqui",
    platform: "Shopify Store",
    email: "farhan@quickbazaar.in",
    phone: "+91 97110 88229",
    activeOrders: 8,
    totalDelivered: 310,
    walletBalance: -4500,
    customBrandingSlip: false,
    status: "Low Balance",
  },
];

const initialVirtualFranchises = [
  {
    id: "VFR-01",
    partnerName: "ApexMart Bangalore Central",
    operator: "Siddharth Rao",
    domain: "bengaluru.apexmart.in",
    coverageCity: "Bengaluru, Karnataka",
    commissionRate: 15,
    gmvGenerated: 1840000,
    commissionEarned: 276000,
    payoutStatus: "Settled",
    activeCustomers: 1420,
    status: "Active",
  },
  {
    id: "VFR-02",
    partnerName: "ApexMart Pune Metro Hub",
    operator: "Neha Joshi",
    domain: "pune.apexmart.in",
    coverageCity: "Pune, Maharashtra",
    commissionRate: 14,
    gmvGenerated: 1290000,
    commissionEarned: 180600,
    payoutStatus: "Pending Payout",
    activeCustomers: 980,
    status: "Active",
  },
  {
    id: "VFR-03",
    partnerName: "ApexMart Ahmedabad Express",
    operator: "Bhavin Patel",
    domain: "ahmedabad.apexmart.in",
    coverageCity: "Ahmedabad, Gujarat",
    commissionRate: 16,
    gmvGenerated: 2150000,
    commissionEarned: 344000,
    payoutStatus: "Settled",
    activeCustomers: 1850,
    status: "Active",
  },
  {
    id: "VFR-04",
    partnerName: "ApexMart Lucknow Heritage",
    operator: "Syed Imran",
    domain: "lucknow.apexmart.in",
    coverageCity: "Lucknow, Uttar Pradesh",
    commissionRate: 15,
    gmvGenerated: 640000,
    commissionEarned: 96000,
    payoutStatus: "Pending Payout",
    activeCustomers: 490,
    status: "Active",
  },
];

const initialPhysicalFranchises = [
  {
    id: "PFR-01",
    outletCode: "APX-OUT-001",
    outletName: "ApexMart Flagship Experience Store",
    city: "Indiranagar, Bengaluru",
    state: "Karnataka",
    pinCode: "560038",
    storeSizeSqft: 2800,
    storeManager: "Kiran Kumar",
    contactPhone: "+91 80 2520 1199",
    monthlyRoyaltyRate: 5,
    lastMonthRevenue: 1480000,
    inventoryStockUnits: 8450,
    status: "Operational",
  },
  {
    id: "PFR-02",
    outletCode: "APX-OUT-002",
    outletName: "ApexMart City Centre Store",
    city: "Bandra West, Mumbai",
    state: "Maharashtra",
    pinCode: "400050",
    storeSizeSqft: 2200,
    storeManager: "Sameer Merchant",
    contactPhone: "+91 22 2640 4455",
    monthlyRoyaltyRate: 5,
    lastMonthRevenue: 1890000,
    inventoryStockUnits: 9620,
    status: "Operational",
  },
  {
    id: "PFR-03",
    outletCode: "APX-OUT-003",
    outletName: "ApexMart Cyber Hub Outlet",
    city: "DLF CyberCity, Gurugram",
    state: "Haryana",
    pinCode: "122002",
    storeSizeSqft: 1950,
    storeManager: "Ritu Chawla",
    contactPhone: "+91 124 411 9900",
    monthlyRoyaltyRate: 5,
    lastMonthRevenue: 1320000,
    inventoryStockUnits: 6800,
    status: "Operational",
  },
  {
    id: "PFR-04",
    outletCode: "APX-OUT-004",
    outletName: "ApexMart Salt Lake Hub",
    city: "Sector V, Salt Lake, Kolkata",
    state: "West Bengal",
    pinCode: "700091",
    storeSizeSqft: 1600,
    storeManager: "Debanjan Sen",
    contactPhone: "+91 33 2357 8822",
    monthlyRoyaltyRate: 4.5,
    lastMonthRevenue: 890000,
    inventoryStockUnits: 5120,
    status: "Renovation",
  },
  {
    id: "PFR-05",
    outletCode: "APX-OUT-005",
    outletName: "ApexMart Jubilee Hills Galleria",
    city: "Jubilee Hills, Hyderabad",
    state: "Telangana",
    pinCode: "500033",
    storeSizeSqft: 3100,
    storeManager: "Pradeep Varma",
    contactPhone: "+91 40 2355 7766",
    monthlyRoyaltyRate: 5,
    lastMonthRevenue: 0,
    inventoryStockUnits: 4200,
    status: "Under Setup",
  },
];

const initialState = {
  retailProducts: initialRetailProducts,
  wholesaleTiers: initialWholesaleTiers,
  wholesaleAccounts: initialWholesaleAccounts,
  dropshippers: initialDropshippers,
  virtualFranchises: initialVirtualFranchises,
  physicalFranchises: initialPhysicalFranchises,
};

export const adminEcommerceSlice = createSlice({
  name: "adminEcommerce",
  initialState,
  reducers: {
    // Retail Reducers
    updateRetailPrice: (state, action) => {
      const { id, sellingPrice, mrp } = action.payload;
      const prod = state.retailProducts.find((p) => p.id === id);
      if (prod) {
        if (sellingPrice !== undefined) prod.sellingPrice = Number(sellingPrice);
        if (mrp !== undefined) prod.mrp = Number(mrp);
      }
    },
    toggleRetailStatus: (state, action) => {
      const prod = state.retailProducts.find((p) => p.id === action.payload);
      if (prod) {
        prod.channelStatus = prod.channelStatus === "Active" ? "Paused" : "Active";
      }
    },
    addRetailProduct: (state, action) => {
      state.retailProducts.unshift(action.payload);
    },

    // Wholesale Reducers
    updateWholesaleTier: (state, action) => {
      const { id, discountRate, minOrderValue } = action.payload;
      const tier = state.wholesaleTiers.find((t) => t.id === id);
      if (tier) {
        if (discountRate !== undefined) tier.discountRate = Number(discountRate);
        if (minOrderValue !== undefined) tier.minOrderValue = Number(minOrderValue);
      }
    },
    addWholesaleAccount: (state, action) => {
      state.wholesaleAccounts.unshift(action.payload);
    },
    updateAccountCreditLimit: (state, action) => {
      const { id, creditLimit, status } = action.payload;
      const acc = state.wholesaleAccounts.find((a) => a.id === id);
      if (acc) {
        if (creditLimit !== undefined) acc.creditLimit = Number(creditLimit);
        if (status) acc.status = status;
      }
    },

    // Dropshipping Reducers
    toggleDropshipperStatus: (state, action) => {
      const drop = state.dropshippers.find((d) => d.id === action.payload);
      if (drop) {
        drop.status = drop.status === "Active" ? "Paused" : "Active";
      }
    },
    toggleCustomBrandingSlip: (state, action) => {
      const drop = state.dropshippers.find((d) => d.id === action.payload);
      if (drop) {
        drop.customBrandingSlip = !drop.customBrandingSlip;
      }
    },
    addDropshipper: (state, action) => {
      state.dropshippers.unshift(action.payload);
    },
    topUpDropshipWallet: (state, action) => {
      const { id, amount } = action.payload;
      const drop = state.dropshippers.find((d) => d.id === id);
      if (drop) {
        drop.walletBalance += Number(amount);
        if (drop.walletBalance > 0 && drop.status === "Low Balance") {
          drop.status = "Active";
        }
      }
    },

    // Virtual Franchise Reducers
    addVirtualFranchise: (state, action) => {
      state.virtualFranchises.unshift(action.payload);
    },
    toggleVirtualFranchiseStatus: (state, action) => {
      const vfr = state.virtualFranchises.find((v) => v.id === action.payload);
      if (vfr) {
        vfr.status = vfr.status === "Active" ? "Paused" : "Active";
      }
    },
    settleVirtualPayout: (state, action) => {
      const vfr = state.virtualFranchises.find((v) => v.id === action.payload);
      if (vfr) {
        vfr.payoutStatus = "Settled";
      }
    },

    // Physical Franchise Reducers
    addPhysicalFranchise: (state, action) => {
      state.physicalFranchises.unshift(action.payload);
    },
    updateOutletStatus: (state, action) => {
      const { id, status } = action.payload;
      const outlet = state.physicalFranchises.find((o) => o.id === id);
      if (outlet) {
        outlet.status = status;
      }
    },
  },
});

export const {
  updateRetailPrice,
  toggleRetailStatus,
  addRetailProduct,
  updateWholesaleTier,
  addWholesaleAccount,
  updateAccountCreditLimit,
  toggleDropshipperStatus,
  toggleCustomBrandingSlip,
  addDropshipper,
  topUpDropshipWallet,
  addVirtualFranchise,
  toggleVirtualFranchiseStatus,
  settleVirtualPayout,
  addPhysicalFranchise,
  updateOutletStatus,
} = adminEcommerceSlice.actions;

export default adminEcommerceSlice.reducer;
