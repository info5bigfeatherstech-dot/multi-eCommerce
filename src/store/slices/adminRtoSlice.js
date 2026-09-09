import { createSlice } from "@reduxjs/toolkit";

const initialRtoData = [
  {
    id: "RTO-8091",
    orderId: "ORD-9021",
    orderDate: "2026-08-28",
    rtoDate: "2026-09-02",
    buyer: {
      name: "Suresh Gupta",
      businessName: "Gupta Electricals & Hardware",
      phone: "+91 98234 11209",
      email: "guptaelectricals@gmail.com",
      city: "Patna",
      state: "Bihar",
      pincode: "800001",
      address: "Shop 14, New Market, Station Road, Patna",
    },
    items: [
      {
        id: "p1",
        name: "Commercial LED Floodlight 150W IP66",
        sku: "LGT-FLD-150W",
        quantity: 12,
        unitPrice: 1650,
        total: 19800,
      },
    ],
    orderValue: 19800,
    paymentMode: "Cash on Delivery",
    forwardCourier: "Delhivery Surface",
    forwardAwb: "DLHV-778912301",
    reverseCourier: "Delhivery Reverse",
    reverseAwb: "DLHV-REV-991201",
    forwardFreight: 850,
    reverseFreight: 920,
    rtoStatus: "Delivery Failed", // Delivery Failed, In-Transit to Origin, Warehouse Received, Re-attempted, Closed
    rtoReason: "Customer Unavailable",
    rtoStage: "NDR Open", // NDR Open, Re-attempt Scheduled, RTS In-Transit, Dock Received, Restocked
    courierRemark: "Receiver not available at premises after 3 calls. Gate locked.",
    deliveryAttempts: [
      {
        attemptNumber: 1,
        date: "2026-08-31 14:22",
        status: "Failed",
        reason: "Customer phone unreachable",
        agentName: "Ramesh Singh (Delhivery)",
      },
      {
        attemptNumber: 2,
        date: "2026-09-01 16:45",
        status: "Failed",
        reason: "Door locked, premises closed",
        agentName: "Ramesh Singh (Delhivery)",
      },
      {
        attemptNumber: 3,
        date: "2026-09-02 11:30",
        status: "Failed",
        reason: "Customer not available",
        agentName: "Ramesh Singh (Delhivery)",
      },
    ],
    verification: {
      status: "Pending Verification", // Pending Verification, Fake Attempt Confirmed, Genuine Rejection, Dispute Raised
      customerContacted: false,
      customerFeedback: null,
      disputeTicketId: null,
      disputeRaisedDate: null,
      internalNotes: "Buyer has a high RTO history in Bihar region. Verify if calls were really made.",
    },
    warehouseStockIn: {
      receivedDate: null,
      condition: null, // Pristine, Packaging Damaged, Defective/Opened, Destroyed
      restockLocation: null,
      inspectedBy: null,
      stockNotes: null,
    },
  },
  {
    id: "RTO-8092",
    orderId: "ORD-9024",
    orderDate: "2026-08-27",
    rtoDate: "2026-09-01",
    buyer: {
      name: "Vikram Chauhan",
      businessName: "Chauhan Tools & Machinery",
      phone: "+91 99102 44321",
      email: "chauhan.tools@rediffmail.com",
      city: "Kanpur",
      state: "Uttar Pradesh",
      pincode: "208001",
      address: "Plot 88, Fazalganj Industrial Area, Kanpur",
    },
    items: [
      {
        id: "p2",
        name: "Heavy Duty Rotary Hammer Drill 800W",
        sku: "TLS-HAM-800W",
        quantity: 8,
        unitPrice: 3850,
        total: 30800,
      },
    ],
    orderValue: 30800,
    paymentMode: "Cash on Delivery",
    forwardCourier: "BlueDart Express",
    forwardAwb: "BLUD-88290124",
    reverseCourier: "BlueDart Surface",
    reverseAwb: "BLUD-REV-44109",
    forwardFreight: 1100,
    reverseFreight: 1100,
    rtoStatus: "In-Transit to Origin",
    rtoReason: "Fake Attempt Suspected",
    rtoStage: "RTS In-Transit",
    courierRemark: "Address incomplete / unable to locate consignee premises",
    deliveryAttempts: [
      {
        attemptNumber: 1,
        date: "2026-08-30 18:10",
        status: "Failed",
        reason: "Address not found",
        agentName: "Sunil K (BlueDart)",
      },
    ],
    verification: {
      status: "Fake Attempt Confirmed",
      customerContacted: true,
      customerFeedback: "Customer stated warehouse is on main road and agent never contacted or visited.",
      disputeTicketId: "DISP-BLU-9092",
      disputeRaisedDate: "2026-09-01",
      internalNotes: "Raised freight penalty dispute with BlueDart Ops manager. Seeking 100% two-way freight credit.",
    },
    warehouseStockIn: {
      receivedDate: null,
      condition: null,
      restockLocation: null,
      inspectedBy: null,
      stockNotes: null,
    },
  },
  {
    id: "RTO-8093",
    orderId: "ORD-9026",
    orderDate: "2026-08-25",
    rtoDate: "2026-08-30",
    buyer: {
      name: "Anita Deshmukh",
      businessName: "Pooja Solar & Clean Energy",
      phone: "+91 97654 32188",
      email: "pooja.solar@yahoo.com",
      city: "Nagpur",
      state: "Maharashtra",
      pincode: "440010",
      address: "12 MIDC Hingna Road, Near Water Tank, Nagpur",
    },
    items: [
      {
        id: "p3",
        name: "Monocrystalline Solar Panel 540W Tier-1",
        sku: "SOL-MONO-540W",
        quantity: 10,
        unitPrice: 7200,
        total: 72000,
      },
    ],
    orderValue: 72000,
    paymentMode: "Prepaid UPI",
    forwardCourier: "Ekart Logistics",
    forwardAwb: "EKRT-99881122",
    reverseCourier: "Ekart Surface",
    reverseAwb: "EKRT-REV-773322",
    forwardFreight: 2400,
    reverseFreight: 2400,
    rtoStatus: "Warehouse Received",
    rtoReason: "Buyer Cancelled - Project Delayed",
    rtoStage: "Restocked",
    courierRemark: "Consignee refused package stating client order was postponed.",
    deliveryAttempts: [
      {
        attemptNumber: 1,
        date: "2026-08-29 13:15",
        status: "Refused",
        reason: "Buyer refused delivery",
        agentName: "Deepak Yadav (Ekart)",
      },
    ],
    verification: {
      status: "Genuine Rejection",
      customerContacted: true,
      customerFeedback: "Buyer confirmed they declined delivery because the installation project was delayed by 2 months.",
      disputeTicketId: null,
      disputeRaisedDate: null,
      internalNotes: "Prepaid order. Forward and reverse freight deducted before refund voucher generation.",
    },
    warehouseStockIn: {
      receivedDate: "2026-09-04",
      condition: "Pristine",
      restockLocation: "Bay 4 - Solar Heavy Pallet 02",
      inspectedBy: "Rajesh QC Head",
      stockNotes: "Factory strapping intact. No transit cracks. 10 units restocked to primary inventory.",
    },
  },
  {
    id: "RTO-8094",
    orderId: "ORD-9029",
    orderDate: "2026-08-29",
    rtoDate: "2026-09-03",
    buyer: {
      name: "Karan Johar",
      businessName: "Karan Electric Hub",
      phone: "+91 98450 77123",
      email: "karan.electrichub@gmail.com",
      city: "Ludhiana",
      state: "Punjab",
      pincode: "141003",
      address: "Shop 4, Industrial Area B, Ludhiana",
    },
    items: [
      {
        id: "p4",
        name: "Industrial Copper Cable 2.5 sq mm (90m Roll)",
        sku: "CAB-COP-2.5MM",
        quantity: 20,
        unitPrice: 1890,
        total: 37800,
      },
    ],
    orderValue: 37800,
    paymentMode: "Cash on Delivery",
    forwardCourier: "DTDC Express",
    forwardAwb: "DTDC-44229988",
    reverseCourier: null,
    reverseAwb: null,
    forwardFreight: 950,
    reverseFreight: 0,
    rtoStatus: "Re-attempted",
    rtoReason: "Consignee Requested Reschedule",
    rtoStage: "Re-attempt Scheduled",
    courierRemark: "Consignee out of station until Friday. Requested delivery on Saturday.",
    deliveryAttempts: [
      {
        attemptNumber: 1,
        date: "2026-09-02 15:40",
        status: "Rescheduled",
        reason: "Customer requested future date",
        agentName: "Harpreet Singh (DTDC)",
      },
    ],
    verification: {
      status: "Genuine Rejection",
      customerContacted: true,
      customerFeedback: "Customer was attending a trade expo in Delhi. Confirmed he will receive on Saturday morning with cash ready.",
      disputeTicketId: null,
      disputeRaisedDate: null,
      internalNotes: "Delivery re-attempt successfully requested with DTDC Hub manager for Saturday 11 AM.",
    },
    warehouseStockIn: {
      receivedDate: null,
      condition: null,
      restockLocation: null,
      inspectedBy: null,
      stockNotes: null,
    },
  },
  {
    id: "RTO-8095",
    orderId: "ORD-9033",
    orderDate: "2026-08-24",
    rtoDate: "2026-08-29",
    buyer: {
      name: "Manoj Agarwal",
      businessName: "Balaji Agro Hardware",
      phone: "+91 94140 22901",
      email: "balajiagro@rediffmail.com",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302013",
      address: "Near Mandi Gate, Vishwakarma Industrial Area, Jaipur",
    },
    items: [
      {
        id: "p5",
        name: "Submersible Borewell Pump 5HP",
        sku: "PMP-SUB-5HP",
        quantity: 4,
        unitPrice: 11500,
        total: 46000,
      },
    ],
    orderValue: 46000,
    paymentMode: "Cash on Delivery",
    forwardCourier: "Delhivery Surface",
    forwardAwb: "DLHV-66554433",
    reverseCourier: "Delhivery Reverse",
    reverseAwb: "DLHV-REV-332211",
    forwardFreight: 1800,
    reverseFreight: 1800,
    rtoStatus: "Warehouse Received",
    rtoReason: "Customer Refused - Transit Carton Damaged",
    rtoStage: "Dock Received",
    courierRemark: "Outer box tore during transit, customer refused delivery due to water stains.",
    deliveryAttempts: [
      {
        attemptNumber: 1,
        date: "2026-08-28 12:10",
        status: "Refused",
        reason: "Package damaged",
        agentName: "Mahesh Kumar (Delhivery)",
      },
    ],
    verification: {
      status: "Genuine Rejection",
      customerContacted: true,
      customerFeedback: "Buyer verified outer wooden crate had collapsed and motor casing had scuffs.",
      disputeTicketId: "DISP-DLH-5541",
      disputeRaisedDate: "2026-08-30",
      internalNotes: "Transit damage insurance claim filed with Delhivery for ₹12,000 repackaging and repair expense.",
    },
    warehouseStockIn: {
      receivedDate: "2026-09-03",
      condition: "Packaging Damaged",
      restockLocation: "Refurbishment Workshop B-04",
      inspectedBy: "Deepak QC Tech",
      stockNotes: "Tested motors electrically. All 4 motors passed insulation and winding test. Sent for crate repacking.",
    },
  },
];

const adminRtoSlice = createSlice({
  name: "adminRto",
  initialState: {
    items: initialRtoData,
    filterStatus: "All",
    searchQuery: "",
  },
  reducers: {
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    // Action 1: Re-attempt delivery with new instructions
    reattemptDelivery: (state, action) => {
      const { rtoId, alternatePhone, alternateAddress, newDeliveryDate, notes } = action.payload;
      const target = state.items.find((item) => item.id === rtoId);
      if (target) {
        target.rtoStatus = "Re-attempted";
        target.rtoStage = "Re-attempt Scheduled";
        if (alternatePhone) target.buyer.phone = alternatePhone;
        if (alternateAddress) target.buyer.address = alternateAddress;
        target.deliveryAttempts.push({
          attemptNumber: target.deliveryAttempts.length + 1,
          date: new Date().toISOString().replace("T", " ").substring(0, 16),
          status: "Scheduled",
          reason: `Re-attempt requested for ${newDeliveryDate || "next working day"}. Notes: ${notes || "No notes"}`,
          agentName: "Courier Re-attempt Queue",
        });
        target.verification.internalNotes = (target.verification.internalNotes ? target.verification.internalNotes + " | " : "") +
          `Delivery re-attempt scheduled on ${new Date().toLocaleDateString("en-IN")}.`;
      }
    },
    // Action 2: Initiate RTS (Return to Seller / Origin)
    initiateRTS: (state, action) => {
      const { rtoId, reverseCourier, reverseAwb, reverseFreight } = action.payload;
      const target = state.items.find((item) => item.id === rtoId);
      if (target) {
        target.rtoStatus = "In-Transit to Origin";
        target.rtoStage = "RTS In-Transit";
        target.reverseCourier = reverseCourier || target.forwardCourier;
        target.reverseAwb = reverseAwb || `RTS-${Math.floor(100000 + Math.random() * 900000)}`;
        if (reverseFreight) target.reverseFreight = Number(reverseFreight);
        target.verification.internalNotes = (target.verification.internalNotes ? target.verification.internalNotes + " | " : "") +
          `RTS initiated via ${target.reverseCourier} AWB #${target.reverseAwb}.`;
      }
    },
    // Action 3: Warehouse Dock Stock-in
    warehouseStockIn: (state, action) => {
      const { rtoId, condition, restockLocation, inspectedBy, stockNotes } = action.payload;
      const target = state.items.find((item) => item.id === rtoId);
      if (target) {
        target.rtoStatus = "Warehouse Received";
        target.rtoStage = condition === "Pristine" ? "Restocked" : "Dock Received";
        target.warehouseStockIn = {
          receivedDate: new Date().toISOString().substring(0, 10),
          condition: condition || "Pristine",
          restockLocation: restockLocation || "General Warehouse Pallet",
          inspectedBy: inspectedBy || "Warehouse Staff",
          stockNotes: stockNotes || "Inspected on dock entry.",
        };
      }
    },
    // Action 4: Verify RTO / NDR reason
    verifyRtoReason: (state, action) => {
      const { rtoId, status, customerContacted, customerFeedback, internalNotes } = action.payload;
      const target = state.items.find((item) => item.id === rtoId);
      if (target) {
        target.verification.status = status;
        target.verification.customerContacted = customerContacted ?? true;
        if (customerFeedback !== undefined) target.verification.customerFeedback = customerFeedback;
        if (internalNotes) {
          target.verification.internalNotes = (target.verification.internalNotes ? target.verification.internalNotes + " | " : "") + internalNotes;
        }
      }
    },
    // Action 5: Raise Courier Dispute for Fake Attempts
    raiseCourierDispute: (state, action) => {
      const { rtoId, disputeCategory, disputeNotes } = action.payload;
      const target = state.items.find((item) => item.id === rtoId);
      if (target) {
        const ticketId = `DISP-${target.forwardCourier.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        target.verification.status = "Dispute Raised";
        target.verification.disputeTicketId = ticketId;
        target.verification.disputeRaisedDate = new Date().toISOString().substring(0, 10);
        target.verification.internalNotes = (target.verification.internalNotes ? target.verification.internalNotes + " | " : "") +
          `Dispute #${ticketId} lodged: ${disputeCategory}. ${disputeNotes || ""}`;
      }
    },
    // Action 6: Bulk Initiate RTS
    bulkInitiateRTS: (state, action) => {
      const rtoIds = action.payload;
      state.items.forEach((item) => {
        if (rtoIds.includes(item.id) && item.rtoStatus === "Delivery Failed") {
          item.rtoStatus = "In-Transit to Origin";
          item.rtoStage = "RTS In-Transit";
          item.reverseCourier = item.forwardCourier;
          item.reverseAwb = `RTS-${Math.floor(100000 + Math.random() * 900000)}`;
          item.reverseFreight = item.forwardFreight;
        }
      });
    },
    // Action 7: Close RTO
    closeRtoCase: (state, action) => {
      const { rtoId, resolutionNotes } = action.payload;
      const target = state.items.find((item) => item.id === rtoId);
      if (target) {
        target.rtoStatus = "Closed";
        target.verification.internalNotes = (target.verification.internalNotes ? target.verification.internalNotes + " | " : "") +
          `Case closed: ${resolutionNotes || "Resolved"}`;
      }
    },
  },
});

export const {
  setFilterStatus,
  setSearchQuery,
  reattemptDelivery,
  initiateRTS,
  warehouseStockIn,
  verifyRtoReason,
  raiseCourierDispute,
  bulkInitiateRTS,
  closeRtoCase,
} = adminRtoSlice.actions;

export default adminRtoSlice.reducer;
