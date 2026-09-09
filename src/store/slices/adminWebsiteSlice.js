import { createSlice } from "@reduxjs/toolkit";

const initialHomepageSections = [
  {
    id: "SEC-HERO",
    name: "Hero Banner & Carousel",
    description: "Top promotional slides with call-to-action buttons",
    type: "Hero Slider",
    enabled: true,
    order: 1,
    badgeText: "High Impact",
  },
  {
    id: "SEC-TRUST",
    name: "Trust Badges & Value Props",
    description: "Free Shipping, COD, Easy Returns, 24/7 Support guarantees",
    type: "Features Bar",
    enabled: true,
    order: 2,
    badgeText: "Conversion Lift",
  },
  {
    id: "SEC-CATEGORIES",
    name: "Featured Categories Grid",
    description: "Top 8 product category tiles with direct navigation",
    type: "Category Grid",
    enabled: true,
    order: 3,
    badgeText: "Navigation",
  },
  {
    id: "SEC-FLASH",
    name: "Limited Time Flash Deals",
    description: "Countdown timer with special discounted products",
    type: "Product Slider",
    enabled: true,
    order: 4,
    badgeText: "Urgency Driver",
  },
  {
    id: "SEC-TRENDING",
    name: "Trending & Best Selling Products",
    description: "Curated best-selling product showcase with quick add-to-cart",
    type: "Product Grid",
    enabled: true,
    order: 5,
    badgeText: "Revenue Core",
  },
  {
    id: "SEC-TESTIMONIALS",
    name: "Customer Reviews & Social Proof",
    description: "Verified buyer photo reviews and 5-star ratings",
    type: "Testimonials",
    enabled: false,
    order: 6,
    badgeText: "Social Proof",
  },
];

const initialPages = [
  {
    id: "PAG-01",
    title: "Dropshipping Partner Portal",
    slug: "/dropshipping",
    status: "Published",
    lastUpdated: "2026-09-08",
    viewsCount: 4850,
    isCore: true,
  },
  {
    id: "PAG-02",
    title: "Wholesale & Bulk Inquiry",
    slug: "/inquiry",
    status: "Published",
    lastUpdated: "2026-09-07",
    viewsCount: 3920,
    isCore: true,
  },
  {
    id: "PAG-03",
    title: "Contact Us & Support",
    slug: "/contact",
    status: "Published",
    lastUpdated: "2026-09-05",
    viewsCount: 6120,
    isCore: true,
  },
  {
    id: "PAG-04",
    title: "About Our Brand & Manufacturing",
    slug: "/about",
    status: "Published",
    lastUpdated: "2026-08-20",
    viewsCount: 2840,
    isCore: false,
  },
  {
    id: "PAG-05",
    title: "Shipping & Delivery Policy",
    slug: "/shipping-policy",
    status: "Published",
    lastUpdated: "2026-08-15",
    viewsCount: 5410,
    isCore: false,
  },
  {
    id: "PAG-06",
    title: "Returns & Refund Terms",
    slug: "/refund-policy",
    status: "Published",
    lastUpdated: "2026-08-15",
    viewsCount: 7890,
    isCore: false,
  },
  {
    id: "PAG-07",
    title: "Privacy Policy (GDPR & DPDP)",
    slug: "/privacy-policy",
    status: "Published",
    lastUpdated: "2026-07-10",
    viewsCount: 1420,
    isCore: false,
  },
];

const initialBanners = [
  {
    id: "BAN-01",
    title: "Grand Festive Extravaganza 2026",
    subtitle: "Up to 50% OFF Across Premium Collections",
    ctaText: "Shop Festive Drops",
    ctaLink: "/category/fashion",
    location: "Hero Main Carousel (Slide 1)",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
    status: "Active",
    clickCount: 14890,
  },
  {
    id: "BAN-02",
    title: "Next-Gen Audio & Smart Tech Launch",
    subtitle: "Experience Hi-Res Active Noise Cancellation",
    ctaText: "Explore Aura Series",
    ctaLink: "/category/electronics",
    location: "Hero Main Carousel (Slide 2)",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
    status: "Active",
    clickCount: 9420,
  },
  {
    id: "BAN-03",
    title: "Autumn Handcrafted Ceramic Homeware",
    subtitle: "Artisanal Studio Pottery & Kiln Creations",
    ctaText: "Discover Ceramics",
    ctaLink: "/category/home-kitchen",
    location: "Mid-Page Promotional Banner",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80",
    status: "Active",
    clickCount: 6240,
  },
  {
    id: "BAN-04",
    title: "Free Express Shipping On All Orders Above ₹499",
    subtitle: "Use Code FREESHIP At Checkout",
    ctaText: "Learn More",
    ctaLink: "/shipping-policy",
    location: "Top Sticky Announcement Bar",
    imageUrl: "",
    status: "Active",
    clickCount: 24100,
  },
];

const initialContent = {
  brandName: "IndiCraft Global",
  tagline: "India's Finest Multi-Category E-Commerce & B2B Distribution Hub",
  supportEmail: "support@indicraftstore.com",
  supportPhone: "+91 80 4567 8900",
  whatsappNumber: "+91 98200 11223",
  headquarters: "Level 4, Prestige Tech Park, Marathahalli-Sarjapur Ring Rd, Bengaluru, Karnataka 560103",
  workingHours: "Monday – Saturday: 9:00 AM – 8:00 PM IST",
  socialLinks: {
    instagram: "https://instagram.com/indicraft_global",
    facebook: "https://facebook.com/indicraftglobal",
    linkedin: "https://linkedin.com/company/indicraft",
    youtube: "https://youtube.com/@indicraftstore",
  },
  announcementBarText: "🎉 Grand Festive Sale Live! Extra 10% instant discount on UPI prepaid checkouts. Free Delivery across India.",
};

const initialSeoSettings = {
  defaultMetaTitle: "IndiCraft | Premium Multi-Category Shopping & Dropshipping",
  defaultMetaDescription: "Shop electronics, designer apparel, handcrafted homeware, and skincare. Enjoy instant COD, 48hr express delivery, and wholesale procurement rates.",
  keywords: "ecommerce, online shopping india, electronics, dropshipping india, wholesale supplier, craft ceramics, artisan fashion",
  canonicalDomain: "https://indicraftstore.com",
  ogImageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
  robotsIndex: true,
  googleAnalyticsId: "G-7X9942KLM1",
  metaPixelId: "884910294829102",
};

const initialState = {
  sections: initialHomepageSections,
  pages: initialPages,
  banners: initialBanners,
  content: initialContent,
  seo: initialSeoSettings,
};

export const adminWebsiteSlice = createSlice({
  name: "adminWebsite",
  initialState,
  reducers: {
    // Section Reducers
    toggleSection: (state, action) => {
      const section = state.sections.find((s) => s.id === action.payload);
      if (section) {
        section.enabled = !section.enabled;
      }
    },
    reorderSections: (state, action) => {
      state.sections = action.payload;
    },

    // Page Reducers
    updatePageStatus: (state, action) => {
      const { id, status } = action.payload;
      const page = state.pages.find((p) => p.id === id);
      if (page) {
        page.status = status;
        page.lastUpdated = new Date().toISOString().split("T")[0];
      }
    },
    addNewPage: (state, action) => {
      state.pages.push(action.payload);
    },
    deletePage: (state, action) => {
      state.pages = state.pages.filter((p) => p.id !== action.payload);
    },

    // Banner Reducers
    toggleBannerStatus: (state, action) => {
      const banner = state.banners.find((b) => b.id === action.payload);
      if (banner) {
        banner.status = banner.status === "Active" ? "Paused" : "Active";
      }
    },
    addNewBanner: (state, action) => {
      state.banners.unshift(action.payload);
    },
    deleteBanner: (state, action) => {
      state.banners = state.banners.filter((b) => b.id !== action.payload);
    },

    // Content Reducer
    updateWebsiteContent: (state, action) => {
      state.content = { ...state.content, ...action.payload };
    },

    // SEO Reducer
    updateSeoSettings: (state, action) => {
      state.seo = { ...state.seo, ...action.payload };
    },
  },
});

export const {
  toggleSection,
  reorderSections,
  updatePageStatus,
  addNewPage,
  deletePage,
  toggleBannerStatus,
  addNewBanner,
  deleteBanner,
  updateWebsiteContent,
  updateSeoSettings,
} = adminWebsiteSlice.actions;

export default adminWebsiteSlice.reducer;
