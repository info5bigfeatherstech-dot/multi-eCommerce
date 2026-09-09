import { createSlice } from "@reduxjs/toolkit";

const initialArchivedProducts = [
  {
    id: "ARC-PRD-101",
    sku: "ELEC-WCH-009",
    name: "Aura Smartwatch Gen 1 (Discontinued)",
    category: "Electronics",
    originalPrice: 4999,
    archiveDate: "2026-05-12",
    archivedBy: "Sarah Jenkins (Senior Catalog Mgr)",
    reason: "Supplier End of Life",
    stockAtArchive: 0,
    totalHistoricalSales: 840,
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
    tags: ["Legacy", "No Warranty", "Gen 1"],
  },
  {
    id: "ARC-PRD-102",
    sku: "HOME-BLN-033",
    name: "Ceramic Minimalist Table Lamp (Ivory)",
    category: "Home & Kitchen",
    originalPrice: 1899,
    archiveDate: "2026-06-20",
    archivedBy: "Admin System (Auto-Archive)",
    reason: "Seasonal Line Replaced",
    stockAtArchive: 4,
    totalHistoricalSales: 412,
    thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&q=80",
    tags: ["Spring 2025", "Home Decor"],
  },
  {
    id: "ARC-PRD-103",
    sku: "FASH-SNK-088",
    name: "Urban Glide Knit Sneakers - Cobalt Edition",
    category: "Fashion & Apparel",
    originalPrice: 3499,
    archiveDate: "2026-07-04",
    archivedBy: "Rajesh Kumar (Inventory Head)",
    reason: "Manufacturer Contract Expired",
    stockAtArchive: 0,
    totalHistoricalSales: 1250,
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
    tags: ["Footwear", "Limited Batch"],
  },
  {
    id: "ARC-PRD-104",
    sku: "BEAUTY-SRM-014",
    name: "Botanical Vitamin C Brightening Serum 30ml",
    category: "Beauty & Health",
    originalPrice: 899,
    archiveDate: "2026-07-18",
    archivedBy: "Quality Compliance Team",
    reason: "Formula Reformulation / Recall",
    stockAtArchive: 12,
    totalHistoricalSales: 2190,
    thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80",
    tags: ["Formula V1", "Recalled"],
  },
  {
    id: "ARC-PRD-105",
    sku: "SPORTS-MAT-055",
    name: "EcoCork 6mm High-Grip Yoga Mat",
    category: "Sports & Fitness",
    originalPrice: 2299,
    archiveDate: "2026-08-01",
    archivedBy: "Admin System (Auto-Archive)",
    reason: "Merged with Pro Series SKU",
    stockAtArchive: 0,
    totalHistoricalSales: 630,
    thumbnail: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200&q=80",
    tags: ["Fitness", "Merged"],
  },
];

const initialArchivedOrders = [
  {
    id: "ARC-ORD-9012",
    orderNumber: "ORD-2025-08192",
    customerName: "Vikas Sharma",
    customerEmail: "vikas.s@example.com",
    orderDate: "2025-11-14",
    archiveDate: "2026-05-15",
    totalAmount: 4999,
    paymentMethod: "UPI (PhonePe)",
    fulfillmentStatus: "Delivered & Settled",
    archiveReason: "Retention Policy (>180 Days)",
    itemCount: 2,
    itemsSummary: "1x Aura Smartwatch Gen 1, 1x Silicone Strap",
    destinationCity: "Bengaluru, Karnataka",
  },
  {
    id: "ARC-ORD-9013",
    orderNumber: "ORD-2025-09410",
    customerName: "Pooja Malhotra",
    customerEmail: "pooja.m@example.com",
    orderDate: "2025-11-28",
    archiveDate: "2026-05-30",
    totalAmount: 1899,
    paymentMethod: "Credit Card (HDFC)",
    fulfillmentStatus: "Delivered & Settled",
    archiveReason: "Retention Policy (>180 Days)",
    itemCount: 1,
    itemsSummary: "1x Ceramic Minimalist Table Lamp",
    destinationCity: "Mumbai, Maharashtra",
  },
  {
    id: "ARC-ORD-9014",
    orderNumber: "ORD-2025-10221",
    customerName: "Rohan Verma",
    customerEmail: "rohan.v99@example.com",
    orderDate: "2025-12-05",
    archiveDate: "2026-06-10",
    totalAmount: 6998,
    paymentMethod: "NetBanking (SBI)",
    fulfillmentStatus: "Returned & Refunded",
    archiveReason: "Audit Completed & Closed Case",
    itemCount: 2,
    itemsSummary: "2x Urban Glide Knit Sneakers",
    destinationCity: "Delhi NCR",
  },
  {
    id: "ARC-ORD-9015",
    orderNumber: "ORD-2025-11409",
    customerName: "Deepak Patel",
    customerEmail: "deepak.patel@example.com",
    orderDate: "2025-12-19",
    archiveDate: "2026-06-25",
    totalAmount: 899,
    paymentMethod: "Cash on Delivery",
    fulfillmentStatus: "RTO Closed & Inventory Restocked",
    archiveReason: "RTO Closed Case",
    itemCount: 1,
    itemsSummary: "1x Botanical Vitamin C Serum",
    destinationCity: "Ahmedabad, Gujarat",
  },
  {
    id: "ARC-ORD-9016",
    orderNumber: "ORD-2026-00341",
    customerName: "Meera Krishnan",
    customerEmail: "meera.k@example.com",
    orderDate: "2026-01-11",
    archiveDate: "2026-07-15",
    totalAmount: 2299,
    paymentMethod: "UPI (GooglePay)",
    fulfillmentStatus: "Delivered & Settled",
    archiveReason: "Retention Policy (>180 Days)",
    itemCount: 1,
    itemsSummary: "1x EcoCork High-Grip Yoga Mat",
    destinationCity: "Chennai, Tamil Nadu",
  },
];

const initialArchivedCustomers = [
  {
    id: "ARC-CUST-501",
    name: "Arjun Nambiar",
    email: "arjun.n@legacyuser.org",
    phone: "+91 98450 11223",
    totalHistoricalOrders: 6,
    lifetimeValue: 18450,
    joinedDate: "2024-03-15",
    archiveDate: "2026-04-10",
    reason: "Account Deletion Request (GDPR/DPDP)",
    status: "Anonymized & Frozen",
    city: "Kochi, Kerala",
  },
  {
    id: "ARC-CUST-502",
    name: "Kavita Singhania",
    email: "kavita.s@biznet.in",
    phone: "+91 97112 33445",
    totalHistoricalOrders: 2,
    lifetimeValue: 3800,
    joinedDate: "2024-08-20",
    archiveDate: "2026-05-18",
    reason: "Inactivity (>365 Days Without Login)",
    status: "Dormant Archive",
    city: "Jaipur, Rajasthan",
  },
  {
    id: "ARC-CUST-503",
    name: "Sunil G. / Sunil Gupta (Merged)",
    email: "sunil.temp99@mailhost.com",
    phone: "+91 98200 44556",
    totalHistoricalOrders: 1,
    lifetimeValue: 1299,
    joinedDate: "2025-01-05",
    archiveDate: "2026-06-02",
    reason: "Duplicate Profile Merged with Primary Account",
    status: "Merged Record",
    city: "Pune, Maharashtra",
  },
  {
    id: "ARC-CUST-504",
    name: "Tanya Kapoor",
    email: "tanya.k.old@domain.com",
    phone: "+91 99887 66554",
    totalHistoricalOrders: 11,
    lifetimeValue: 34200,
    joinedDate: "2023-11-10",
    archiveDate: "2026-07-12",
    reason: "Corporate Account Restructuring",
    status: "Cold Vault Archived",
    city: "Hyderabad, Telangana",
  },
];

const initialOtherArchivedData = {
  coupons: [
    {
      id: "ARC-CPN-01",
      code: "FESTIVE50_2025",
      type: "Percentage",
      value: "50% OFF",
      totalRedemptions: 4850,
      expiredDate: "2025-11-30",
      archivedDate: "2026-01-10",
      reason: "Campaign Expired & Budget Fully Utilized",
    },
    {
      id: "ARC-CPN-02",
      code: "WELCOME100_LEGACY",
      type: "Flat Amount",
      value: "₹100 OFF",
      totalRedemptions: 12400,
      expiredDate: "2025-12-31",
      archivedDate: "2026-02-15",
      reason: "Replaced by Dynamic Welcome Flow",
    },
    {
      id: "ARC-CPN-03",
      code: "FLASH_MIDNIGHT_25",
      type: "Percentage",
      value: "25% OFF",
      totalRedemptions: 890,
      expiredDate: "2026-02-01",
      archivedDate: "2026-03-01",
      reason: "One-day Weekend Promotion Ended",
    },
  ],
  auditLogs: [
    {
      id: "ARC-LOG-101",
      actor: "SuperAdmin (admin@store.com)",
      eventType: "Bulk Product Price Override",
      module: "Catalog",
      timestamp: "2025-10-14 18:32:10",
      archivedDate: "2026-04-15",
      details: "Updated base selling price for 120 festive SKU items.",
    },
    {
      id: "ARC-LOG-102",
      actor: "Gateway Webhook (Razorpay)",
      eventType: "API Key Rotation Settlement",
      module: "Payment Gateway",
      timestamp: "2025-12-01 02:00:00",
      archivedDate: "2026-06-01",
      details: "Legacy RSA keys revoked; transferred to SHA-256 HMAC tokens.",
    },
    {
      id: "ARC-LOG-103",
      actor: "Compliance Officer",
      eventType: "Customer Consent Record Export",
      module: "Privacy & GDPR",
      timestamp: "2026-01-20 11:15:44",
      archivedDate: "2026-07-21",
      details: "Regulatory archive generated for Q4 audits.",
    },
  ],
  vendorLogs: [
    {
      id: "ARC-VND-01",
      vendor: "Apex Logistics India Pvt Ltd",
      agreementCode: "APX-SLA-2024-V2",
      validityPeriod: "Jan 2024 - Dec 2025",
      archivedDate: "2026-01-05",
      reason: "SLA Renewed with Tier-1 FastTrack Agreement",
    },
    {
      id: "ARC-VND-02",
      vendor: "Zenith Packaging Solutions",
      agreementCode: "ZNT-BOX-2023",
      validityPeriod: "Jul 2023 - Jun 2025",
      archivedDate: "2025-07-15",
      reason: "Contract Terminated due to eco-friendly supplier transition",
    },
  ],
  retentionPolicies: {
    autoArchiveOrdersAfterDays: 180,
    autoArchiveDiscontinuedProducts: true,
    autoArchiveDormantCustomersDays: 365,
    purgeAuditLogsAfterDays: 730,
    coldStorageBackupEnabled: true,
  },
};

const initialState = {
  products: initialArchivedProducts,
  orders: initialArchivedOrders,
  customers: initialArchivedCustomers,
  otherData: initialOtherArchivedData,
  searchQuery: "",
  selectedCategory: "All",
  selectedPeriod: "All",
};

export const adminArchivedSlice = createSlice({
  name: "adminArchived",
  initialState,
  reducers: {
    restoreProduct: (state, action) => {
      const id = action.payload;
      state.products = state.products.filter((p) => p.id !== id);
    },
    deleteProductPermanently: (state, action) => {
      const id = action.payload;
      state.products = state.products.filter((p) => p.id !== id);
    },
    batchRestoreProducts: (state, action) => {
      const ids = action.payload;
      state.products = state.products.filter((p) => !ids.includes(p.id));
    },
    batchDeleteProducts: (state, action) => {
      const ids = action.payload;
      state.products = state.products.filter((p) => !ids.includes(p.id));
    },

    restoreOrder: (state, action) => {
      const id = action.payload;
      state.orders = state.orders.filter((o) => o.id !== id);
    },
    deleteOrderPermanently: (state, action) => {
      const id = action.payload;
      state.orders = state.orders.filter((o) => o.id !== id);
    },

    restoreCustomer: (state, action) => {
      const id = action.payload;
      state.customers = state.customers.filter((c) => c.id !== id);
    },
    deleteCustomerPermanently: (state, action) => {
      const id = action.payload;
      state.customers = state.customers.filter((c) => c.id !== id);
    },

    deleteOtherItem: (state, action) => {
      const { group, id } = action.payload;
      if (state.otherData[group]) {
        state.otherData[group] = state.otherData[group].filter((item) => item.id !== id);
      }
    },
    updateRetentionPolicies: (state, action) => {
      state.otherData.retentionPolicies = {
        ...state.otherData.retentionPolicies,
        ...action.payload,
      };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const {
  restoreProduct,
  deleteProductPermanently,
  batchRestoreProducts,
  batchDeleteProducts,
  restoreOrder,
  deleteOrderPermanently,
  restoreCustomer,
  deleteCustomerPermanently,
  deleteOtherItem,
  updateRetentionPolicies,
  setSearchQuery,
  setSelectedCategory,
} = adminArchivedSlice.actions;

export default adminArchivedSlice.reducer;
