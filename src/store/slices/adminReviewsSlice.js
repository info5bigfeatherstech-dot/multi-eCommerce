import { createSlice } from "@reduxjs/toolkit";

const initialProductReviews = [
  {
    id: "REV-101",
    sku: "APX-FSH-001",
    productName: "Pure Handloom Chanderi Silk Saree",
    category: "Fashion & Apparel",
    reviewerName: "Ananya Deshmukh",
    city: "Pune, Maharashtra",
    rating: 5,
    title: "Stunning weave quality and rich zari border!",
    comment:
      "Ordered 15 pieces for our bridal boutique. Fabric drape is sensational and color matching is 100% accurate to the catalog.",
    verifiedPurchase: true,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
    ],
    status: "Approved",
    createdAt: "2026-09-07",
    merchantReply:
      "Thank you Ananya! We take pride in our handloom heritage and appreciate your wholesale partnership.",
  },
  {
    id: "REV-102",
    sku: "APX-ELC-002",
    productName: "Aura Pro Wireless ANC Earbuds (Gen 2)",
    category: "Electronics & Audio",
    reviewerName: "Karthik Sundaram",
    city: "Chennai, Tamil Nadu",
    rating: 5,
    title: "Best ANC earbuds under ₹3,000 in India",
    comment:
      "Active Noise Cancellation cuts metro commute noise completely. Battery easily lasts 7 hours on single charge.",
    verifiedPurchase: true,
    images: [],
    status: "Approved",
    createdAt: "2026-09-06",
    merchantReply: null,
  },
  {
    id: "REV-103",
    sku: "APX-HOM-003",
    productName: "Handcrafted Studio Ceramic Dinnerware (Set of 6)",
    category: "Home & Living",
    reviewerName: "Meenakshi Iyer",
    city: "Bengaluru, Karnataka",
    rating: 4,
    title: "Heavy artisanal feel, microwave safe",
    comment:
      "Arrived in bulletproof thermocol packaging. Gorgeous speckled glaze. One bowl had minor kiln mark, but adds to handmade charm.",
    verifiedPurchase: true,
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80",
    ],
    status: "Approved",
    createdAt: "2026-09-05",
    merchantReply: null,
  },
  {
    id: "REV-104",
    sku: "APX-BEA-004",
    productName: "Organic Rosehip & Kumkumadi Glow Elixir 30ml",
    category: "Beauty & Wellness",
    reviewerName: "Priyanka Nair",
    city: "Kochi, Kerala",
    rating: 5,
    title: "Authentic cold-pressed saffron aroma",
    comment:
      "Visible reduction in morning dullness within two weeks of use. Lightweight and non-greasy absorption.",
    verifiedPurchase: true,
    images: [],
    status: "Approved",
    createdAt: "2026-09-04",
    merchantReply: null,
  },
  {
    id: "REV-105",
    sku: "APX-FSH-005",
    productName: "Embroidered Heritage Pashmina Shawl",
    category: "Fashion & Apparel",
    reviewerName: "Rohan Kapoor",
    city: "Amritsar, Punjab",
    rating: 5,
    title: "Ultra soft, verified cashmere wool feel",
    comment:
      "Gifted to my mother. She loved the intricate needlework. Certificate of craft origin included in the box was a great touch.",
    verifiedPurchase: true,
    images: [],
    status: "Pending",
    createdAt: "2026-09-08",
    merchantReply: null,
  },
  {
    id: "REV-106",
    sku: "APX-ELC-002",
    productName: "Aura Pro Wireless ANC Earbuds (Gen 2)",
    category: "Electronics & Audio",
    reviewerName: "Vikram Sethi",
    city: "New Delhi, Delhi NCR",
    rating: 2,
    title: "Right earbud latency during gaming",
    comment:
      "Music audio quality is great but when playing Battlegrounds Mobile there is a 200ms audio delay. Need firmware update.",
    verifiedPurchase: true,
    images: [],
    status: "Pending",
    createdAt: "2026-09-08",
    merchantReply: null,
  },
  {
    id: "REV-107",
    sku: "APX-HOM-006",
    productName: "Aromatic Pure Soy Wax Jar Candle Set (4 Pack)",
    category: "Home & Living",
    reviewerName: "Deepa Menon",
    city: "Mumbai, Maharashtra",
    rating: 5,
    title: "Lavender and vanilla scents fill entire living room",
    comment:
      "Smokeless clean burn. Jars can be reused as planters afterwards. Premium aesthetic!",
    verifiedPurchase: true,
    images: [],
    status: "Pending",
    createdAt: "2026-09-07",
    merchantReply: null,
  },
];

const initialCustomerFeedback = [
  {
    id: "CFB-01",
    customerName: "Sanjay Singhania",
    orderId: "ORD-9481",
    city: "Jaipur, Rajasthan",
    npsScore: 10,
    sentiment: "Promoter",
    deliveryRating: 5,
    supportRating: 5,
    feedbackText:
      "Dispatched within 4 hours of wholesale order confirmation. BlueDart courier arrived the next afternoon in pristine pallet wrap.",
    createdAt: "2026-09-07",
  },
  {
    id: "CFB-02",
    customerName: "Lavanya Natarajan",
    orderId: "ORD-9420",
    city: "Bengaluru, Karnataka",
    npsScore: 9,
    sentiment: "Promoter",
    deliveryRating: 5,
    supportRating: 5,
    feedbackText:
      "WhatsApp automated dispatch updates kept me updated throughout. Checkout UPI discount applied instantly.",
    createdAt: "2026-09-06",
  },
  {
    id: "CFB-03",
    customerName: "Harish Gujral",
    orderId: "ORD-9390",
    city: "Gurugram, Haryana",
    npsScore: 7,
    sentiment: "Passive",
    deliveryRating: 4,
    supportRating: 4,
    feedbackText:
      "Good products overall. The shipping box had slight dent on one corner, though interior bubble wrap prevented any damage.",
    createdAt: "2026-09-05",
  },
  {
    id: "CFB-04",
    customerName: "Aakash Banerjee",
    orderId: "ORD-9285",
    city: "Kolkata, West Bengal",
    npsScore: 4,
    sentiment: "Detractor",
    deliveryRating: 2,
    supportRating: 3,
    feedbackText:
      "Courier delayed delivery by 2 days citing local festival holiday. Customer support did expedite once contacted.",
    createdAt: "2026-09-04",
  },
];

const initialState = {
  productReviews: initialProductReviews,
  customerFeedback: initialCustomerFeedback,
};

export const adminReviewsSlice = createSlice({
  name: "adminReviews",
  initialState,
  reducers: {
    approveReview: (state, action) => {
      const rev = state.productReviews.find((r) => r.id === action.payload);
      if (rev) {
        rev.status = "Approved";
      }
    },
    rejectReview: (state, action) => {
      const rev = state.productReviews.find((r) => r.id === action.payload);
      if (rev) {
        rev.status = "Rejected";
      }
    },
    replyToReview: (state, action) => {
      const { id, reply } = action.payload;
      const rev = state.productReviews.find((r) => r.id === id);
      if (rev) {
        rev.merchantReply = reply;
      }
    },
    batchApprovePending: (state) => {
      state.productReviews.forEach((r) => {
        if (r.status === "Pending") {
          r.status = "Approved";
        }
      });
    },
    addProductReview: (state, action) => {
      state.productReviews.unshift(action.payload);
    },
    addCustomerFeedback: (state, action) => {
      state.customerFeedback.unshift(action.payload);
    },
  },
});

export const {
  approveReview,
  rejectReview,
  replyToReview,
  batchApprovePending,
  addProductReview,
  addCustomerFeedback,
} = adminReviewsSlice.actions;

export default adminReviewsSlice.reducer;
