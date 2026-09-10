import { createSlice } from "@reduxjs/toolkit";

const initialProducts = [
  {
    id: "prod-101",
    name: "Commercial LED Floodlight 150W IP66 Waterproof",
    sku: "LGT-FLD-150W",
    category: "Electrical & Lighting",
    subCategory: "Commercial & Flood Lighting",
    brand: "LumiPro Industrial",
    mrp: 3200,
    price: 1650, // Base wholesale price
    tierPrices: {
      tier1: { min: 1, max: 9, price: 1650 },
      tier2: { min: 10, max: 49, price: 1480 },
      tier3: { min: 50, max: 999, price: 1320 },
    },
    moq: 2,
    stock: 148,
    lowStockThreshold: 25,
    binLocation: "Bay 2 / Rack A-12",
    weightKg: 2.8,
    dimensionsCm: "32 × 24 × 8",
    status: "Active", // Active, Draft, Archived
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    attributes: {
      wattage: "150W",
      voltage: "220-240V AC",
      ipRating: "IP66",
      warranty: "2 Years",
      material: "Die-Cast Aluminum",
    },
    shortDescription: "High lumen architectural floodlight for factory bays, warehouses, and outdoor perimeters.",
    dateAdded: "2026-08-15",
  },
  {
    id: "prod-102",
    name: "Heavy Duty Rotary Hammer Drill 800W SDS Plus",
    sku: "TLS-HAM-800W",
    category: "Hardware & Tools",
    subCategory: "Power Tools",
    brand: "TorqueMaster Pro",
    mrp: 6500,
    price: 3850,
    tierPrices: {
      tier1: { min: 1, max: 9, price: 3850 },
      tier2: { min: 10, max: 49, price: 3550 },
      tier3: { min: 50, max: 999, price: 3250 },
    },
    moq: 1,
    stock: 42,
    lowStockThreshold: 15,
    binLocation: "Bay 3 / Rack B-04",
    weightKg: 3.5,
    dimensionsCm: "38 × 26 × 10",
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80",
    attributes: {
      wattage: "800W",
      voltage: "220V AC",
      warranty: "1 Year",
      material: "Reinforced Composite & Steel",
    },
    shortDescription: "Industrial 3-mode rotary hammer drill with 26mm concrete drilling capacity.",
    dateAdded: "2026-08-18",
  },
  {
    id: "prod-103",
    name: "Monocrystalline Solar Panel 540W Tier-1 Bifacial",
    sku: "SOL-MONO-540W",
    category: "Solar & Renewable",
    subCategory: "Solar Panels & Modules",
    brand: "SunWatt Apex",
    mrp: 12500,
    price: 7200,
    tierPrices: {
      tier1: { min: 1, max: 9, price: 7200 },
      tier2: { min: 10, max: 49, price: 6800 },
      tier3: { min: 50, max: 999, price: 6400 },
    },
    moq: 4,
    stock: 18,
    lowStockThreshold: 20, // Low stock alert!
    binLocation: "Pallet Yard / Bay 4",
    weightKg: 28.5,
    dimensionsCm: "227 × 113 × 3.5",
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    attributes: {
      wattage: "540W",
      voltage: "49.8V Voc",
      ipRating: "IP68 Junction Box",
      warranty: "25 Years Output",
      material: "Anodized Aluminum & Tempered Glass",
    },
    shortDescription: "Tier-1 144-cell monocrystalline half-cut solar photovoltaic module for commercial rooftop and ground mount setups.",
    dateAdded: "2026-08-10",
  },
  {
    id: "prod-104",
    name: "Industrial Copper Cable 2.5 sq mm FR (90m Coil)",
    sku: "CAB-COP-2.5MM",
    category: "Electrical & Lighting",
    subCategory: "Wires & Industrial Cables",
    brand: "VoltShield Gold",
    mrp: 3200,
    price: 1890,
    tierPrices: {
      tier1: { min: 1, max: 9, price: 1890 },
      tier2: { min: 10, max: 49, price: 1720 },
      tier3: { min: 50, max: 999, price: 1590 },
    },
    moq: 5,
    stock: 310,
    lowStockThreshold: 50,
    binLocation: "Bay 1 / Rack C-02",
    weightKg: 3.2,
    dimensionsCm: "26 × 26 × 9",
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    attributes: {
      voltage: "1100V Grade",
      material: "99.97% Electrolytic Copper",
      warranty: "5 Years",
      certification: "IS:694 & CE Marked",
    },
    shortDescription: "Flame retardant electrolytic grade multi-strand flexible copper wire for commercial and residential electrical conduit.",
    dateAdded: "2026-08-05",
  },
  {
    id: "prod-105",
    name: "Submersible Borewell Pump 5HP Three Phase",
    sku: "PMP-SUB-5HP",
    category: "Machinery & Motors",
    subCategory: "Pumps & Water Solutions",
    brand: "HydroForce Heavy",
    mrp: 18500,
    price: 11500,
    tierPrices: {
      tier1: { min: 1, max: 9, price: 11500 },
      tier2: { min: 10, max: 49, price: 10800 },
      tier3: { min: 50, max: 999, price: 9950 },
    },
    moq: 1,
    stock: 6,
    lowStockThreshold: 10, // Low stock alert!
    binLocation: "Heavy Machinery Bay 6",
    weightKg: 34.0,
    dimensionsCm: "115 × 18 × 18",
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    attributes: {
      wattage: "3700W (5HP)",
      voltage: "415V 3-Phase",
      warranty: "2 Years",
      material: "Stainless Steel 304 Casing",
    },
    shortDescription: "High-head water filled submersible pump with copper rotor for agriculture and commercial groundwater extraction.",
    dateAdded: "2026-08-20",
  },
  {
    id: "prod-106",
    name: "Industrial Safety Helmet with Ratchet Suspension",
    sku: "SAF-HLM-VENT",
    category: "Safety & Security",
    subCategory: "Personal Protective Equipment",
    brand: "GuardianArmor",
    mrp: 450,
    price: 240,
    tierPrices: {
      tier1: { min: 1, max: 19, price: 240 },
      tier2: { min: 20, max: 99, price: 195 },
      tier3: { min: 100, max: 999, price: 165 },
    },
    moq: 10,
    stock: 0, // Out of stock!
    lowStockThreshold: 30,
    binLocation: "Bay 5 / Rack D-01",
    weightKg: 0.42,
    dimensionsCm: "28 × 22 × 16",
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    attributes: {
      material: "High-Density Polyethylene (HDPE)",
      certification: "IS:2925 & EN397",
      warranty: "1 Year",
    },
    shortDescription: "Vented construction safety hard hat with 6-point textile suspension and adjustable wheel ratchet.",
    dateAdded: "2026-08-22",
  },
];

const initialCategories = [
  {
    id: "cat-1",
    name: "Electrical & Lighting",
    slug: "electrical-lighting",
    icon: "Zap",
    description: "Industrial wires, switchgear, commercial LED lighting, and panel accessories.",
    productCount: 48,
    status: "Active",
    subCategories: [
      { id: "sub-101", name: "Commercial & Flood Lighting", slug: "commercial-flood-lighting", count: 18 },
      { id: "sub-102", name: "Wires & Industrial Cables", slug: "wires-industrial-cables", count: 14 },
      { id: "sub-103", name: "MCBs, DBs & Switchgear", slug: "mcbs-dbs-switchgear", count: 16 },
    ],
  },
  {
    id: "cat-2",
    name: "Hardware & Tools",
    slug: "hardware-tools",
    icon: "Wrench",
    description: "Power tools, pneumatic accessories, hand tool kits, and fasteners.",
    productCount: 36,
    status: "Active",
    subCategories: [
      { id: "sub-201", name: "Power Tools", slug: "power-tools", count: 15 },
      { id: "sub-202", name: "Hand Tool Sets", slug: "hand-tool-sets", count: 12 },
      { id: "sub-203", name: "Fasteners & Hardware", slug: "fasteners-hardware", count: 9 },
    ],
  },
  {
    id: "cat-3",
    name: "Solar & Renewable",
    slug: "solar-renewable",
    icon: "Sun",
    description: "Tier-1 solar modules, on-grid/off-grid inverters, and mounting structures.",
    productCount: 24,
    status: "Active",
    subCategories: [
      { id: "sub-301", name: "Solar Panels & Modules", slug: "solar-panels-modules", count: 10 },
      { id: "sub-302", name: "Solar Inverters & Batteries", slug: "solar-inverters-batteries", count: 8 },
      { id: "sub-303", name: "Mounting Rail Structures", slug: "mounting-rail-structures", count: 6 },
    ],
  },
  {
    id: "cat-4",
    name: "Machinery & Motors",
    slug: "machinery-motors",
    icon: "Cog",
    description: "Submersible water pumps, electric motors, air compressors, and welding machines.",
    productCount: 30,
    status: "Active",
    subCategories: [
      { id: "sub-401", name: "Pumps & Water Solutions", slug: "pumps-water-solutions", count: 12 },
      { id: "sub-402", name: "Electric Induction Motors", slug: "electric-induction-motors", count: 10 },
      { id: "sub-403", name: "Welding Equipment", slug: "welding-equipment", count: 8 },
    ],
  },
  {
    id: "cat-5",
    name: "Safety & Security",
    slug: "safety-security",
    icon: "ShieldAlert",
    description: "PPE protective equipment, safety shoes, CCTV surveillance, and fire safety.",
    productCount: 22,
    status: "Active",
    subCategories: [
      { id: "sub-501", name: "Personal Protective Equipment", slug: "ppe-equipment", count: 11 },
      { id: "sub-502", name: "Fire Fighting & Extinguishers", slug: "fire-safety", count: 6 },
      { id: "sub-503", name: "Industrial CCTV & Sensors", slug: "cctv-sensors", count: 5 },
    ],
  },
];

const initialAttributes = [
  {
    id: "attr-1",
    name: "Wattage / Power Rating",
    code: "wattage",
    category: "Electrical & Solar",
    inputType: "Select",
    values: ["10W", "20W", "50W", "100W", "150W", "200W", "540W", "800W", "3700W (5HP)"],
  },
  {
    id: "attr-2",
    name: "Operating Voltage",
    code: "voltage",
    category: "Electrical",
    inputType: "Select",
    values: ["12V DC", "24V DC", "220-240V AC", "415V 3-Phase", "1100V Grade"],
  },
  {
    id: "attr-3",
    name: "Ingress Protection (IP Rating)",
    code: "ipRating",
    category: "Physical & Durability",
    inputType: "Select",
    values: ["IP20 (Indoor)", "IP54", "IP65 (Weatherproof)", "IP66 (Jet Proof)", "IP67", "IP68 (Submersible)"],
  },
  {
    id: "attr-4",
    name: "Primary Material Construction",
    code: "material",
    category: "Physical",
    inputType: "Select",
    values: [
      "Die-Cast Aluminum",
      "99.97% Electrolytic Copper",
      "Stainless Steel 304",
      "Reinforced Composite & Steel",
      "High-Density Polyethylene (HDPE)",
      "Brass C360",
    ],
  },
  {
    id: "attr-5",
    name: "Standard Warranty Period",
    code: "warranty",
    category: "Commercial",
    inputType: "Select",
    values: ["6 Months", "1 Year", "2 Years", "3 Years", "5 Years", "25 Years Output"],
  },
  {
    id: "attr-6",
    name: "Regulatory Certification",
    code: "certification",
    category: "Compliance",
    inputType: "Select",
    values: ["BIS Certified", "CE Marked", "ISO 9001", "RoHS Compliant", "IS:694 Standard", "IS:2925 Standard"],
  },
];

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: initialProducts,
    categories: initialCategories,
    attributes: initialAttributes,
    inventoryLogs: [
      {
        id: "log-1",
        date: "2026-09-08 11:20",
        sku: "LGT-FLD-150W",
        change: "+50",
        type: "Inward Shipment",
        resultingStock: 148,
        adjustedBy: "Warehouse Incharge",
        notes: "Factory batch PO #8892 received at dock.",
      },
      {
        id: "log-2",
        date: "2026-09-07 16:45",
        sku: "SOL-MONO-540W",
        change: "-10",
        type: "Order Dispatched",
        resultingStock: 18,
        adjustedBy: "Fulfillment System",
        notes: "Allocated to Order #ORD-9026.",
      },
      {
        id: "log-3",
        date: "2026-09-05 14:10",
        sku: "SAF-HLM-VENT",
        change: "-30",
        type: "Damaged / Scrapped",
        resultingStock: 0,
        adjustedBy: "Rajesh QC",
        notes: "Water leakage damage in pallet row D-01.",
      },
    ],
  },
  reducers: {
    // 1. Products CRUD
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: `prod-${Date.now().toString().slice(-4)}`,
        dateAdded: new Date().toISOString().substring(0, 10),
        status: action.payload.status || "Active",
      };
      state.products.unshift(newProduct);
    },
    updateProduct: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.products.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...updates };
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    toggleProductStatus: (state, action) => {
      const product = state.products.find((p) => p.id === action.payload);
      if (product) {
        product.status = product.status === "Active" ? "Draft" : "Active";
      }
    },

    // 2. Inventory Stock Adjustment
    adjustStock: (state, action) => {
      const { id, adjustmentQty, reason, notes, adjustedBy } = action.payload;
      const product = state.products.find((p) => p.id === id);
      if (product) {
        const qtyNumber = Number(adjustmentQty);
        product.stock = Math.max(0, product.stock + qtyNumber);
        state.inventoryLogs.unshift({
          id: `log-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().replace("T", " ").substring(0, 16),
          sku: product.sku,
          change: qtyNumber >= 0 ? `+${qtyNumber}` : `${qtyNumber}`,
          type: reason || "Manual Audit",
          resultingStock: product.stock,
          adjustedBy: adjustedBy || "Admin Staff",
          notes: notes || "Manual stock adjustment.",
        });
      }
    },

    // 3. Category Management
    setCategories: (state, action) => {
      state.categories = action.payload || [];
    },
    addCategory: (state, action) => {
      const newCat = {
        ...action.payload,
        id: `cat-${Date.now().toString().slice(-4)}`,
        productCount: 0,
        status: "Active",
        subCategories: action.payload.subCategories || [],
      };
      state.categories.push(newCat);
    },
    addSubcategory: (state, action) => {
      const { categoryId, name, slug } = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      if (category) {
        category.subCategories.push({
          id: `sub-${Date.now().toString().slice(-4)}`,
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          count: 0,
        });
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
    },
    deleteSubcategory: (state, action) => {
      const { categoryId, subcategoryId } = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      if (category) {
        category.subCategories = category.subCategories.filter((s) => s.id !== subcategoryId);
      }
    },

    // 4. Attribute Management
    addAttribute: (state, action) => {
      const newAttr = {
        ...action.payload,
        id: `attr-${Date.now().toString().slice(-4)}`,
        code: action.payload.code || action.payload.name.toLowerCase().replace(/[^a-z0-9]+/g, ""),
        values: action.payload.values || [],
      };
      state.attributes.push(newAttr);
    },
    addAttributeValue: (state, action) => {
      const { attributeId, value } = action.payload;
      const attr = state.attributes.find((a) => a.id === attributeId);
      if (attr && value && !attr.values.includes(value)) {
        attr.values.push(value);
      }
    },
    removeAttributeValue: (state, action) => {
      const { attributeId, value } = action.payload;
      const attr = state.attributes.find((a) => a.id === attributeId);
      if (attr) {
        attr.values = attr.values.filter((v) => v !== value);
      }
    },
  },
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  adjustStock,
  setCategories,
  addCategory,
  addSubcategory,
  deleteCategory,
  deleteSubcategory,
  addAttribute,
  addAttributeValue,
  removeAttributeValue,
} = adminProductsSlice.actions;

export default adminProductsSlice.reducer;
