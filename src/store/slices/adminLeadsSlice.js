import { createSlice } from "@reduxjs/toolkit";

const initialLeads = [
  {
    id: "LED-CUST-201",
    type: "Customer",
    name: "Vikram Malhotra",
    email: "vikram.m@gmail.com",
    phone: "+91 98201 11223",
    city: "Mumbai, Maharashtra",
    interest: "Custom Bulk Order for Corporate Diwali Hampers",
    estimatedValue: 45000,
    status: "New", // 'New' | 'Contacted' | 'In Negotiation' | 'Converted' | 'Dropped'
    priority: "High",
    source: "Storefront Contact Form",
    date: "2026-09-08",
    assignedTo: "Karan Johar (Sales Exec)",
    notes: "Requires sample kit delivered to BKC office before 15th Sep.",
  },
  {
    id: "LED-WHL-301",
    type: "Wholesale",
    name: "Rajesh Singhania",
    company: "Singhania Retail Distributors LLP",
    email: "rajesh@singhaniagroup.in",
    phone: "+91 97112 44556",
    city: "New Delhi, Delhi",
    interest: "Bulk Distribution of Electronics & Smart Gadgets",
    estimatedValue: 650000,
    requestedVolume: "1,200 Units / Month",
    gstNumber: "07AAAAA0000A1Z5",
    status: "In Negotiation",
    priority: "Urgent",
    source: "Inquiry Page (Bulk Quote)",
    date: "2026-09-07",
    assignedTo: "Pooja Hegde (B2B Lead)",
    notes: "Discounts discussed at 38% margin. Tier-1 warehouse credit check cleared.",
  },
  {
    id: "LED-DRP-401",
    type: "Dropshipping",
    name: "Amitabh Sen",
    company: "TrendWave E-Com Solutions",
    email: "amitabh@trendwave.store",
    phone: "+91 98450 77889",
    city: "Bengaluru, Karnataka",
    interest: "Shopify Store Automated Blind Dispatch Integration",
    storeUrl: "https://trendwave.store",
    estimatedOrdersPerMonth: "400 - 600 Orders",
    niche: "Home Decor & Lifestyle",
    status: "Contacted",
    priority: "High",
    source: "Dropshipping Page Application",
    date: "2026-09-06",
    assignedTo: "Siddharth Roy (Partner Ops)",
    notes: "Requires custom packing slip branding and API webhook integration.",
  },
  {
    id: "LED-FRN-501",
    type: "Franchise",
    name: "Dr. Sunita Deshmukh",
    company: "Deshmukh Healthcare & Lifestyle Ventures",
    email: "sunita.d@dhventures.co.in",
    phone: "+91 99220 99887",
    city: "Pune, Maharashtra",
    interest: "Exclusive Flagship Franchise Store (Koregaon Park)",
    investmentBudget: "₹35 Lakhs - ₹50 Lakhs",
    propertyStatus: "Owned Commercial Space (1,450 sq. ft.)",
    status: "In Negotiation",
    priority: "Urgent",
    source: "Franchise Expansion Portal",
    date: "2026-09-05",
    assignedTo: "Rameshwar Rao (VP Expansion)",
    notes: "Floor plans submitted. In-person site inspection scheduled for this Friday.",
  },
  {
    id: "LED-CUST-202",
    type: "Customer",
    name: "Meera Nambiar",
    email: "meera.nambiar@yahoo.co.in",
    phone: "+91 98470 33445",
    city: "Kochi, Kerala",
    interest: "Personalized Ceramic Dinnerware 24-piece Set",
    estimatedValue: 18500,
    status: "Contacted",
    priority: "Medium",
    source: "WhatsApp Direct Click",
    date: "2026-09-04",
    assignedTo: "Sneha Nair (Customer Support)",
    notes: "Requested catalog PDF with custom engraving color palettes.",
  },
  {
    id: "LED-WHL-302",
    type: "Wholesale",
    name: "Harishchandra Patel",
    company: "Gujarat SuperBazaar Mart",
    email: "procurement@gujaratsuperbazaar.com",
    phone: "+91 98250 66778",
    city: "Ahmedabad, Gujarat",
    interest: "Kitchenware & Tableware Monthly Consignment",
    estimatedValue: 320000,
    requestedVolume: "500 Sets / Month",
    gstNumber: "24AAACG1234F1Z8",
    status: "New",
    priority: "High",
    source: "Inquiry Page (Bulk Quote)",
    date: "2026-09-03",
    assignedTo: "Pooja Hegde (B2B Lead)",
    notes: "Requires FOB pricing for Sarkhej godown delivery.",
  },
  {
    id: "LED-DRP-402",
    type: "Dropshipping",
    name: "Rohan Verma",
    company: "Zenith Retail Hub",
    email: "rohan@zenithhub.in",
    phone: "+91 99100 22334",
    city: "Jaipur, Rajasthan",
    interest: "Social Commerce Reselling via Instagram & Meesho",
    storeUrl: "https://instagram.com/zenith_curations",
    estimatedOrdersPerMonth: "150 - 250 Orders",
    niche: "Fashion Accessories & Jewellery",
    status: "Converted",
    priority: "Medium",
    source: "Dropshipping Registration Flow",
    date: "2026-09-02",
    assignedTo: "Siddharth Roy (Partner Ops)",
    notes: "Approved for Tier-2 blind shipping. API credentials delivered.",
  },
  {
    id: "LED-FRN-502",
    type: "Franchise",
    name: "Gurpreet Singh Bindra",
    company: "Bindra Retail Enterprise",
    email: "bindra.retail@gmail.com",
    phone: "+91 98140 55667",
    city: "Chandigarh, Punjab",
    interest: "High Street Retail Outlet (Sector 17 Market)",
    investmentBudget: "₹25 Lakhs - ₹35 Lakhs",
    propertyStatus: "Leased Space (1,100 sq. ft. prime frontage)",
    status: "New",
    priority: "High",
    source: "Franchise Partnership Form",
    date: "2026-09-01",
    assignedTo: "Rameshwar Rao (VP Expansion)",
    notes: "Submitted bank solvency statement and preliminary franchise ROI query.",
  },
];

const initialState = {
  leads: initialLeads,
  selectedType: "All",
  selectedStatus: "All",
  searchTerm: "",
};

export const adminLeadsSlice = createSlice({
  name: "adminLeads",
  initialState,
  reducers: {
    updateLeadStatus: (state, action) => {
      const { id, status } = action.payload;
      const lead = state.leads.find((l) => l.id === id);
      if (lead) {
        lead.status = status;
      }
    },
    assignLead: (state, action) => {
      const { id, assignedTo } = action.payload;
      const lead = state.leads.find((l) => l.id === id);
      if (lead) {
        lead.assignedTo = assignedTo;
      }
    },
    updateLeadNotes: (state, action) => {
      const { id, notes } = action.payload;
      const lead = state.leads.find((l) => l.id === id);
      if (lead) {
        lead.notes = notes;
      }
    },
    deleteLead: (state, action) => {
      const id = action.payload;
      state.leads = state.leads.filter((l) => l.id !== id);
    },
    addNewLead: (state, action) => {
      state.leads.unshift(action.payload);
    },
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const {
  updateLeadStatus,
  assignLead,
  updateLeadNotes,
  deleteLead,
  addNewLead,
  setSelectedType,
  setSelectedStatus,
  setSearchTerm,
} = adminLeadsSlice.actions;

export default adminLeadsSlice.reducer;
