import { createSlice } from "@reduxjs/toolkit";

const initialQueries = [
  {
    id: "STK-QRY-1001",
    productId: "PRD-ELC-001",
    productName: "Aura Noise-Cancelling Wireless Headphones",
    sku: "AURA-NC-WH-01",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
    customerName: "Rahul Deshmukh",
    customerEmail: "rahul.desh@gmail.com",
    customerPhone: "+91 98234 56789",
    channel: "WhatsApp Alert",
    requestedQuantity: 1,
    requestDate: "2026-09-08",
    status: "Pending", // 'Pending' | 'Notified' | 'Restocked' | 'Cancelled'
    potentialRevenue: 6999,
    priority: "High",
    notes: "Customer waiting for anniversary gift. Needs Black Matte edition.",
  },
  {
    id: "STK-QRY-1002",
    productId: "PRD-HOM-004",
    productName: "Nordic Ceramic Coffee Pour-Over Set",
    sku: "NORD-CP-04",
    productImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&q=80",
    customerName: "Ananya Sen",
    customerEmail: "ananya.sen@outlook.com",
    customerPhone: "+91 97481 22334",
    channel: "Email Notification",
    requestedQuantity: 2,
    requestDate: "2026-09-07",
    status: "Pending",
    potentialRevenue: 3798,
    priority: "Medium",
    notes: "Wants notification as soon as fresh kiln batch lands.",
  },
  {
    id: "STK-QRY-1003",
    productId: "PRD-FSH-008",
    productName: "Merino Wool Thermal Overcoat - Camel",
    sku: "MRN-CT-CAM-M",
    productImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80",
    customerName: "Tanmay Bhattacharya",
    customerEmail: "tanmay.b@venture.in",
    customerPhone: "+91 99300 44556",
    channel: "SMS Alert",
    requestedQuantity: 1,
    requestDate: "2026-09-06",
    status: "Notified",
    potentialRevenue: 8499,
    priority: "Urgent",
    notes: "Auto-notification sent via SMS batch. Customer viewed link.",
  },
  {
    id: "STK-QRY-1004",
    productId: "PRD-ELC-001",
    productName: "Aura Noise-Cancelling Wireless Headphones",
    sku: "AURA-NC-WH-01",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
    customerName: "Priyanka Iyer",
    customerEmail: "priyanka.i@techcorp.com",
    customerPhone: "+91 98199 88776",
    channel: "Email Notification",
    requestedQuantity: 3,
    requestDate: "2026-09-05",
    status: "Pending",
    potentialRevenue: 20997,
    priority: "High",
    notes: "Corporate onboarding gift requirement.",
  },
  {
    id: "STK-QRY-1005",
    productId: "PRD-BTY-012",
    productName: "Organic Rosehip & Bakuchiol Night Elixir",
    sku: "ROSE-BK-ELX-30",
    productImage: "https://images.unsplash.com/photo-1608248597359-543232f056ec?w=200&q=80",
    customerName: "Zoya Akhtar",
    customerEmail: "zoya.a@creativestudio.org",
    customerPhone: "+91 98711 00223",
    channel: "WhatsApp Alert",
    requestedQuantity: 1,
    requestDate: "2026-09-04",
    status: "Restocked",
    potentialRevenue: 1450,
    priority: "Low",
    notes: "Stock replenished on 08 Sep. Alert successfully delivered.",
  },
  {
    id: "STK-QRY-1006",
    productId: "PRD-SPT-005",
    productName: "Adjustable Carbon Fibre Trekking Poles",
    sku: "TRK-POL-CB-05",
    productImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&q=80",
    customerName: "Abhishek Rao",
    customerEmail: "abhi.rao90@expedition.co",
    customerPhone: "+91 99201 55667",
    channel: "SMS Alert",
    requestedQuantity: 2,
    requestDate: "2026-09-03",
    status: "Pending",
    potentialRevenue: 4998,
    priority: "Medium",
    notes: "Himalaya trek planning in October.",
  },
];

const initialProductDemands = [
  {
    productId: "PRD-ELC-001",
    productName: "Aura Noise-Cancelling Wireless Headphones",
    sku: "AURA-NC-WH-01",
    category: "Electronics",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
    totalRequests: 48,
    pendingWaitlist: 42,
    notifiedCount: 6,
    unitPrice: 6999,
    potentialDemandValue: 335952,
    supplierLeadTimeDays: 7,
    supplierName: "SonicWave Dynamics Ltd",
    restockPOStatus: "PO-7701 In Transit",
    expectedRestockDate: "2026-09-14",
  },
  {
    productId: "PRD-HOM-004",
    productName: "Nordic Ceramic Coffee Pour-Over Set",
    sku: "NORD-CP-04",
    category: "Home & Living",
    thumbnail: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&q=80",
    totalRequests: 24,
    pendingWaitlist: 19,
    notifiedCount: 5,
    unitPrice: 1899,
    potentialDemandValue: 45576,
    supplierLeadTimeDays: 12,
    supplierName: "ClayCraft Artisans Jaipur",
    restockPOStatus: "Drafting PO",
    expectedRestockDate: "2026-09-22",
  },
  {
    productId: "PRD-FSH-008",
    productName: "Merino Wool Thermal Overcoat - Camel",
    sku: "MRN-CT-CAM-M",
    category: "Fashion",
    thumbnail: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80",
    totalRequests: 31,
    pendingWaitlist: 21,
    notifiedCount: 10,
    unitPrice: 8499,
    potentialDemandValue: 263469,
    supplierLeadTimeDays: 10,
    supplierName: "Highland Loom Mills Ludhiana",
    restockPOStatus: "PO-7712 Confirmed",
    expectedRestockDate: "2026-09-18",
  },
  {
    productId: "PRD-SPT-005",
    productName: "Adjustable Carbon Fibre Trekking Poles",
    sku: "TRK-POL-CB-05",
    category: "Sports & Fitness",
    thumbnail: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&q=80",
    totalRequests: 16,
    pendingWaitlist: 14,
    notifiedCount: 2,
    unitPrice: 2499,
    potentialDemandValue: 39984,
    supplierLeadTimeDays: 5,
    supplierName: "Summit Peak Outdoor Equip",
    restockPOStatus: "Ready to Dispatch",
    expectedRestockDate: "2026-09-12",
  },
  {
    productId: "PRD-BTY-012",
    productName: "Organic Rosehip & Bakuchiol Night Elixir",
    sku: "ROSE-BK-ELX-30",
    category: "Beauty & Health",
    thumbnail: "https://images.unsplash.com/photo-1608248597359-543232f056ec?w=200&q=80",
    totalRequests: 19,
    pendingWaitlist: 3,
    notifiedCount: 16,
    unitPrice: 1450,
    potentialDemandValue: 27550,
    supplierLeadTimeDays: 4,
    supplierName: "PureBotanics Lab Mumbai",
    restockPOStatus: "Restocked",
    expectedRestockDate: "Completed",
  },
];

const initialState = {
  queries: initialQueries,
  productDemands: initialProductDemands,
  selectedStatus: "All",
  searchTerm: "",
};

export const adminStockQueriesSlice = createSlice({
  name: "adminStockQueries",
  initialState,
  reducers: {
    notifyCustomer: (state, action) => {
      const { id } = action.payload;
      const query = state.queries.find((q) => q.id === id);
      if (query) {
        query.status = "Notified";
      }
    },
    updateQueryStatus: (state, action) => {
      const { id, status } = action.payload;
      const query = state.queries.find((q) => q.id === id);
      if (query) {
        query.status = status;
      }
    },
    deleteQuery: (state, action) => {
      const id = action.payload;
      state.queries = state.queries.filter((q) => q.id !== id);
    },
    broadcastProductRestock: (state, action) => {
      const { productId } = action.payload;
      // Mark all queries for this product as Notified
      state.queries.forEach((q) => {
        if (q.productId === productId && q.status === "Pending") {
          q.status = "Notified";
        }
      });
      const prod = state.productDemands.find((p) => p.productId === productId);
      if (prod) {
        prod.notifiedCount += prod.pendingWaitlist;
        prod.pendingWaitlist = 0;
        prod.restockPOStatus = "Restocked";
      }
    },
    triggerSupplierPO: (state, action) => {
      const { productId, poCode } = action.payload;
      const prod = state.productDemands.find((p) => p.productId === productId);
      if (prod) {
        prod.restockPOStatus = poCode || "PO Generated";
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
  },
});

export const {
  notifyCustomer,
  updateQueryStatus,
  deleteQuery,
  broadcastProductRestock,
  triggerSupplierPO,
  setSearchTerm,
  setSelectedStatus,
} = adminStockQueriesSlice.actions;

export default adminStockQueriesSlice.reducer;
