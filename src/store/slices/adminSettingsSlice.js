import { createSlice } from "@reduxjs/toolkit";

const initialGeneralSettings = {
  storeName: "Apex Retail & Wholesale Store",
  legalEntity: "Apex Commercial Enterprises Pvt. Ltd.",
  tagline: "India's Premier Multi-Category Wholesale & Retail Platform",
  supportEmail: "support@apexstore.in",
  supportPhone: "+91 1800 200 4567",
  address: "Tower B, Cyber City, DLF Phase 2",
  city: "Gurugram",
  state: "Haryana",
  pincode: "122002",
  country: "India",
  currency: "INR (₹)",
  timezone: "Asia/Kolkata (IST, UTC+5:30)",
  dateFormat: "DD/MM/YYYY",
  maintenanceMode: false,
  logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
};

const initialPaymentGateways = [
  {
    id: "razorpay",
    name: "Razorpay Payment Gateway",
    description: "Accept UPI, Credit/Debit Cards, NetBanking, and Wallets.",
    status: "Active",
    testMode: true,
    keyId: "rzp_test_98ABcDef123456",
    keySecret: "sec_9876543210abcdef",
    webhookSecret: "whsec_razorpay_998877",
  },
  {
    id: "cashfree",
    name: "Cashfree Payments",
    description: "Instant settlement & seamless auto-refunds via UPI & cards.",
    status: "Active",
    testMode: false,
    keyId: "cf_app_live_456789012",
    keySecret: "cf_sec_live_9988776655",
    webhookSecret: "cf_wh_live_112233",
  },
  {
    id: "stripe",
    name: "Stripe International",
    description: "Accept multi-currency credit cards for cross-border wholesale buyers.",
    status: "Inactive",
    testMode: true,
    keyId: "pk_test_51MzAbcDefGhi123",
    keySecret: "sk_test_51MzAbcDefGhi456",
    webhookSecret: "whsec_stripe_778899",
  },
  {
    id: "phonepe",
    name: "PhonePe PG & UPI Intent",
    description: "Zero transaction fee UPI QR code and Direct App Intent.",
    status: "Active",
    testMode: false,
    keyId: "PG_PHONEPE_MERCHANT_01",
    keySecret: "salt_key_phonepe_09876",
    webhookSecret: "phonepe_wh_sec_5544",
  },
];

const initialCodSettings = {
  enabled: true,
  minOrderValue: 299,
  maxOrderValue: 15000,
  convenienceFee: 49,
  requireOtpVerification: true,
  restrictHighRtoCustomers: true,
};

const initialShippingSettings = {
  freeShippingThreshold: 999,
  standardShippingFee: 79,
  expressShippingFee: 149,
  labelFormat: "4x6 Thermal",
  includeReturnAddress: true,
  includeBrandLogo: true,
  barcodeFormat: "Code 128",
  packingSlipNote: "Thank you for shopping with Apex Store! Handcrafted with pride in India.",
  deliveryTransitMetros: "2 - 3 Days",
  deliveryTransitRestOfIndia: "4 - 6 Days",
  deliveryTransitRemote: "7 - 9 Days",
  courierPartners: [
    { id: "bluedart", name: "BlueDart Express", status: "Active", accountNo: "BD-982104", priority: 1 },
    { id: "delhivery", name: "Delhivery Surface & Express", status: "Active", accountNo: "DEL-847291", priority: 2 },
    { id: "shiprocket", name: "Shiprocket Multi-Courier Aggregator", status: "Active", accountNo: "SR-334912", priority: 3 },
    { id: "dtdc", name: "DTDC Courier", status: "Inactive", accountNo: "DTDC-009182", priority: 4 },
  ],
};

const initialTaxGstSettings = {
  gstin: "07AAAAA0000A1Z5",
  panNumber: "AAAAA0000A",
  legalTradeName: "Apex Commercial Enterprises Pvt. Ltd.",
  stateJurisdiction: "07 - Delhi / Haryana",
  pricingModel: "inclusive", // 'inclusive' | 'exclusive'
  eWayBillThreshold: 50000,
  autoCalculateInterstateIgst: true,
  hsnSlabs: [
    { hsnCode: "HSN-0000", description: "Handicrafts & Khadi Handloom (Exempt)", gstRate: 0, cess: 0 },
    { hsnCode: "HSN-6204", description: "Apparel & Sarees (< ₹1,000 retail value)", gstRate: 5, cess: 0 },
    { hsnCode: "HSN-6911", description: "Ceramic Tableware & Home Furnishings", gstRate: 12, cess: 0 },
    { hsnCode: "HSN-8518", description: "Consumer Audio & Electronics", gstRate: 18, cess: 0 },
    { hsnCode: "HSN-3304", description: "Luxury Perfumes & High-End Cosmetics", gstRate: 28, cess: 0 },
  ],
};

const initialNotificationSettings = {
  emailProvider: "Amazon SES",
  emailSender: "orders@apexstore.in",
  smsProvider: "Twilio / Fast2SMS",
  smsSenderId: "APEXIN",
  whatsappProvider: "WhatsApp Cloud API",
  whatsappBusinessNumber: "+91 98765 43210",
  triggers: {
    orderPlaced: { email: true, sms: true, whatsapp: true, push: true },
    orderDispatched: { email: true, sms: true, whatsapp: true, push: true },
    outForDelivery: { email: false, sms: true, whatsapp: true, push: true },
    orderDelivered: { email: true, sms: true, whatsapp: true, push: true },
    refundApproved: { email: true, sms: true, whatsapp: true, push: true },
    abandonedCartRecovery: { email: true, sms: false, whatsapp: true, push: true },
  },
};

const initialIntegrations = [
  {
    id: "ga4",
    name: "Google Analytics 4 (GA4)",
    category: "Analytics",
    status: "Connected",
    trackingId: "G-98XYZ12345",
    lastSynced: "2026-09-09 10:30 AM",
  },
  {
    id: "meta-pixel",
    name: "Meta / Facebook Pixel",
    category: "Advertising",
    status: "Connected",
    trackingId: "PIXEL_849201948201",
    lastSynced: "2026-09-09 09:15 AM",
  },
  {
    id: "tally",
    name: "Tally Prime ERP Connector",
    category: "Accounting & GST",
    status: "Connected",
    trackingId: "TALLY_SYNC_PORT_9000",
    lastSynced: "2026-09-08 11:45 PM",
  },
  {
    id: "zoho",
    name: "Zoho Books & Inventory",
    category: "ERP & Invoicing",
    status: "Disconnected",
    trackingId: "ZOHO_ORG_89102",
    lastSynced: "Never",
  },
  {
    id: "whatsapp-cloud",
    name: "Meta WhatsApp Cloud API",
    category: "Messaging",
    status: "Connected",
    trackingId: "WABA_ID_9988221100",
    lastSynced: "2026-09-09 11:20 AM",
  },
  {
    id: "aws-s3",
    name: "AWS S3 Cloud Media Storage",
    category: "Storage & CDN",
    status: "Connected",
    trackingId: "s3://apex-ecommerce-media-prod",
    lastSynced: "2026-09-09 11:00 AM",
  },
];

const initialSecuritySettings = {
  twoFactorEnforcement: "allAdmins", // 'allAdmins' | 'superAdminOnly' | 'optional'
  passwordExpiryDays: 90,
  sessionTimeoutMinutes: 60,
  maxFailedLoginAttempts: 5,
  lockoutDurationMinutes: 30,
  ipWhitelistingEnabled: false,
  whitelistedIps: ["157.48.12.89", "49.36.182.204", "106.51.78.12"],
  apiTokens: [
    {
      id: "TOK-901",
      name: "Mobile App Storefront Client",
      tokenMasked: "apex_pat_98a7********************4b1c",
      createdDate: "2026-08-01",
      expiresDate: "2027-08-01",
      status: "Active",
    },
    {
      id: "TOK-902",
      name: "Warehouse Scanner PDA Token",
      tokenMasked: "apex_pat_77c2********************89f0",
      createdDate: "2026-07-15",
      expiresDate: "2027-07-15",
      status: "Active",
    },
  ],
};

const initialState = {
  general: initialGeneralSettings,
  payments: initialPaymentGateways,
  cod: initialCodSettings,
  shipping: initialShippingSettings,
  taxGst: initialTaxGstSettings,
  notifications: initialNotificationSettings,
  integrations: initialIntegrations,
  security: initialSecuritySettings,
};

export const adminSettingsSlice = createSlice({
  name: "adminSettings",
  initialState,
  reducers: {
    updateGeneralSettings: (state, action) => {
      state.general = { ...state.general, ...action.payload };
    },

    updatePaymentGateway: (state, action) => {
      const { gatewayId, config } = action.payload;
      const index = state.payments.findIndex((p) => p.id === gatewayId);
      if (index !== -1) {
        state.payments[index] = { ...state.payments[index], ...config };
      }
    },

    updateCodSettings: (state, action) => {
      state.cod = { ...state.cod, ...action.payload };
    },

    updateShippingSettings: (state, action) => {
      state.shipping = { ...state.shipping, ...action.payload };
    },

    updateCourierPartner: (state, action) => {
      const { courierId, config } = action.payload;
      const index = state.shipping.courierPartners.findIndex((c) => c.id === courierId);
      if (index !== -1) {
        state.shipping.courierPartners[index] = {
          ...state.shipping.courierPartners[index],
          ...config,
        };
      }
    },

    updateTaxGstSettings: (state, action) => {
      state.taxGst = { ...state.taxGst, ...action.payload };
    },

    updateNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },

    updateIntegration: (state, action) => {
      const { integrationId, config } = action.payload;
      const index = state.integrations.findIndex((i) => i.id === integrationId);
      if (index !== -1) {
        state.integrations[index] = { ...state.integrations[index], ...config };
      }
    },

    updateSecuritySettings: (state, action) => {
      state.security = { ...state.security, ...action.payload };
    },

    generateApiToken: (state, action) => {
      const newToken = {
        id: `TOK-${Math.floor(100 + Math.random() * 900)}`,
        name: action.payload.name,
        tokenMasked: `apex_pat_${Math.random().toString(36).substring(2, 6)}********************${Math.random().toString(36).substring(2, 6)}`,
        createdDate: new Date().toISOString().split("T")[0],
        expiresDate: "2027-09-09",
        status: "Active",
      };
      state.security.apiTokens.unshift(newToken);
    },

    revokeApiToken: (state, action) => {
      state.security.apiTokens = state.security.apiTokens.filter(
        (t) => t.id !== action.payload
      );
    },
  },
});

export const {
  updateGeneralSettings,
  updatePaymentGateway,
  updateCodSettings,
  updateShippingSettings,
  updateCourierPartner,
  updateTaxGstSettings,
  updateNotificationSettings,
  updateIntegration,
  updateSecuritySettings,
  generateApiToken,
  revokeApiToken,
} = adminSettingsSlice.actions;

export default adminSettingsSlice.reducer;
