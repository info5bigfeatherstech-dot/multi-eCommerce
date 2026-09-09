import { createSlice } from "@reduxjs/toolkit";

const initialTickets = [
  {
    id: "TCK-101",
    customerName: "Radhika Apte",
    customerEmail: "radhika.a@gmail.com",
    customerPhone: "+91 98200 45678",
    orderId: "ORD-9481",
    subject: "Package arrived with damaged outer box seal",
    category: "Delivery & Packaging",
    priority: "High",
    status: "Open",
    channel: "Web Portal",
    assignedAgent: "Pooja Hegde",
    createdAt: "2026-09-09 09:30 AM",
    messages: [
      {
        id: "msg-1",
        author: "Radhika Apte",
        senderType: "customer",
        text: "The courier delivered the silk saree order this morning, but the outer security tape was torn. Need assurance on whether items were tampered.",
        timestamp: "2026-09-09 09:30 AM",
      },
    ],
  },
  {
    id: "TCK-102",
    customerName: "Kunal Singhal",
    customerEmail: "kunal.s@yahoo.com",
    customerPhone: "+91 99100 11223",
    orderId: "ORD-9420",
    subject: "Firmware update latency inquiry for Earbuds",
    category: "Product Technical Support",
    priority: "Medium",
    status: "In Progress",
    channel: "Email",
    assignedAgent: "Sameer Kulkarni",
    createdAt: "2026-09-08 03:15 PM",
    messages: [
      {
        id: "msg-1",
        author: "Kunal Singhal",
        senderType: "customer",
        text: "Are there any patch notes for the Gen 2 ANC Earbuds? There seems to be an intermittent audio delay during gaming mode.",
        timestamp: "2026-09-08 03:15 PM",
      },
      {
        id: "msg-2",
        author: "Sameer Kulkarni",
        senderType: "agent",
        text: "Hello Kunal, our electronics engineering team has confirmed that OTA firmware v1.4 addressing gaming mode latency is scheduled for deployment this Friday.",
        timestamp: "2026-09-08 04:30 PM",
      },
    ],
  },
  {
    id: "TCK-103",
    customerName: "Meera Nambiar",
    customerEmail: "meera.nambiar@gmail.com",
    customerPhone: "+91 98470 99887",
    orderId: "ORD-9390",
    subject: "Refund status for returned ceramic bowl set",
    category: "Refunds & Payments",
    priority: "Urgent",
    status: "Open",
    channel: "WhatsApp",
    assignedAgent: "Pooja Hegde",
    createdAt: "2026-09-09 10:15 AM",
    messages: [
      {
        id: "msg-1",
        author: "Meera Nambiar",
        senderType: "customer",
        text: "Courier picked up the ceramic set 3 days ago. BlueDart tracking marks it delivered to warehouse. When will ₹3,899 refund hit my HDFC account?",
        timestamp: "2026-09-09 10:15 AM",
      },
    ],
  },
  {
    id: "TCK-104",
    customerName: "Gaurav Malhotra",
    customerEmail: "gaurav.m@outlook.com",
    customerPhone: "+91 97110 33445",
    orderId: "ORD-9285",
    subject: "Wholesale invoice GST credit note request",
    category: "Billing & Invoicing",
    priority: "Low",
    status: "Resolved",
    channel: "Web Portal",
    assignedAgent: "Vikramaditya Rao",
    createdAt: "2026-09-07 11:20 AM",
    messages: [
      {
        id: "msg-1",
        author: "Gaurav Malhotra",
        senderType: "customer",
        text: "Please regenerate Tax Invoice with GSTIN 07AAAAA0000A1Z5 for our bulk purchase.",
        timestamp: "2026-09-07 11:20 AM",
      },
      {
        id: "msg-2",
        author: "Vikramaditya Rao",
        senderType: "agent",
        text: "Updated GST B2B invoice #INV-2026-9285 has been generated and dispatched to your registered billing email.",
        timestamp: "2026-09-07 01:10 PM",
      },
    ],
  },
  {
    id: "TCK-105",
    customerName: "Ayesha Siddiqui",
    customerEmail: "ayesha.s@gmail.com",
    customerPhone: "+91 99880 77665",
    orderId: "ORD-9110",
    subject: "Incorrect candle fragrance received",
    category: "Product & Fulfillment",
    priority: "Medium",
    status: "Closed",
    channel: "Phone",
    assignedAgent: "Neha Sharma",
    createdAt: "2026-09-05 02:00 PM",
    messages: [
      {
        id: "msg-1",
        author: "Ayesha Siddiqui",
        senderType: "customer",
        text: "Ordered Jasmine Vanilla candle set, but package contained Sandalwood Rose.",
        timestamp: "2026-09-05 02:00 PM",
      },
      {
        id: "msg-2",
        author: "Neha Sharma",
        senderType: "agent",
        text: "We apologized for the fulfillment error and dispatched replacement pack at zero charge. Tracking confirmed customer receipt.",
        timestamp: "2026-09-06 11:00 AM",
      },
    ],
  },
];

const initialQueries = [
  {
    id: "QRY-201",
    customerName: "Sunita Reddy",
    contact: "sunita.r@gmail.com",
    channel: "Contact Us Form",
    topic: "Bulk Saree Customization",
    question:
      "Do you provide custom blouse piece stitching and fall-pico services if we order 25 Chanderi Silk sarees for family wedding?",
    status: "Unanswered",
    createdAt: "2026-09-09 10:45 AM",
    reply: null,
  },
  {
    id: "QRY-202",
    customerName: "Farhan Akhtar",
    contact: "+91 98211 44556",
    channel: "WhatsApp",
    topic: "Delivery Timeframe to Srinagar",
    question:
      "What is the estimated express air shipping transit time to Srinagar (190001) for the Pashmina shawls?",
    status: "Replied",
    createdAt: "2026-09-08 05:20 PM",
    reply:
      "Express air dispatch takes 48-72 business hours via BlueDart Air to Srinagar. Full tracking link provided upon order.",
  },
  {
    id: "QRY-203",
    customerName: "Pooja Trivedi",
    contact: "pooja.t@yahoo.co.in",
    channel: "Web Portal",
    topic: "Hypoallergenic Ingredients Verification",
    question:
      "Is the Kumkumadi Elixir 100% free of artificial fragrance and mineral oils? Suitable for sensitive rosacea-prone skin?",
    status: "Replied",
    createdAt: "2026-09-08 01:10 PM",
    reply:
      "Yes, 100% pure cold-pressed goat milk and Kashmiri saffron base with zero parabens, phthalates, or added synthetic perfume.",
  },
  {
    id: "QRY-204",
    customerName: "Dinesh Karthik",
    contact: "+91 97000 88776",
    channel: "WhatsApp",
    topic: "COD Availability in Tier-3 PIN Codes",
    question:
      "Is Cash on Delivery available for PIN code 845401 (Motihari, Bihar) for dinnerware set?",
    status: "Unanswered",
    createdAt: "2026-09-09 11:10 AM",
    reply: null,
  },
];

const initialComplaints = [
  {
    id: "CMP-301",
    customerName: "Aakash Banerjee",
    customerContact: "aakash.b@gmail.com",
    orderId: "ORD-9285",
    complaintType: "Courier SLA Breach",
    severity: "High",
    status: "Under Investigation",
    assignedLead: "Pooja Hegde",
    reportedDate: "2026-09-08",
    description:
      "Delivery was delayed by 4 business days causing missed corporate anniversary event. Courier claimed recipient unavailable without actual call attempt.",
    rootCause: "Local 3PL last-mile franchise backlog during festive weekend.",
    resolution: null,
    compensationOffered: "₹500 Store Wallet Credit + Apology Letter",
  },
  {
    id: "CMP-302",
    customerName: "Shweta Tiwari",
    customerContact: "shweta.t@rediffmail.com",
    orderId: "ORD-9190",
    complaintType: "Packaging Defect",
    severity: "Medium",
    status: "Resolved",
    assignedLead: "Sameer Kulkarni",
    reportedDate: "2026-09-06",
    description:
      "Two ceramic quarter plates had hairline cracks on rim due to insufficient bubble cushioning inside master carton.",
    rootCause: "Secondary warehouse packing line ran out of double-wall corrugated wraps.",
    resolution: "Immediate express dispatch of 2 replacement plates + 15% discount coupon.",
    compensationOffered: "Replaced damaged units & issued 15% OFF coupon.",
  },
  {
    id: "CMP-303",
    customerName: "Mohanlal Viswanathan",
    customerContact: "mohanlal.v@gmail.com",
    orderId: "ORD-9055",
    complaintType: "Payment Deduction Glitch",
    severity: "High",
    status: "Resolved",
    assignedLead: "Vikramaditya Rao",
    reportedDate: "2026-09-04",
    description:
      "UPI payment deducted twice (₹7,998 total) during gateway timeout on checkout. Only one order confirmed.",
    rootCause: "Razorpay webhook timeout during peak server load.",
    resolution: "Auto-reversed secondary transaction via payment gateway within 24 hours.",
    compensationOffered: "Full refund of ₹3,999 processed to source VPA.",
  },
];

const initialState = {
  tickets: initialTickets,
  queries: initialQueries,
  complaints: initialComplaints,
};

export const adminSupportSlice = createSlice({
  name: "adminSupport",
  initialState,
  reducers: {
    createTicket: (state, action) => {
      const newTicket = {
        ...action.payload,
        id: action.payload.id || `TCK-${Math.floor(100 + Math.random() * 900)}`,
        status: action.payload.status || "Open",
        createdAt: new Date().toLocaleString(),
        messages: [
          {
            id: `msg-${Date.now()}`,
            author: action.payload.customerName,
            senderType: "customer",
            text: action.payload.initialMessage || action.payload.subject,
            timestamp: new Date().toLocaleString(),
          },
        ],
      };
      state.tickets.unshift(newTicket);
    },

    updateTicketStatus: (state, action) => {
      const { id, status } = action.payload;
      const ticket = state.tickets.find((t) => t.id === id);
      if (ticket) {
        ticket.status = status;
      }
    },

    assignTicketAgent: (state, action) => {
      const { id, agent } = action.payload;
      const ticket = state.tickets.find((t) => t.id === id);
      if (ticket) {
        ticket.assignedAgent = agent;
      }
    },

    replyToTicket: (state, action) => {
      const { id, text, author } = action.payload;
      const ticket = state.tickets.find((t) => t.id === id);
      if (ticket) {
        ticket.messages.push({
          id: `msg-${Date.now()}`,
          author: author || "Support Specialist",
          senderType: "agent",
          text,
          timestamp: new Date().toLocaleString(),
        });
        if (ticket.status === "Open") {
          ticket.status = "In Progress";
        }
      }
    },

    replyToQuery: (state, action) => {
      const { id, replyText } = action.payload;
      const query = state.queries.find((q) => q.id === id);
      if (query) {
        query.reply = replyText;
        query.status = "Replied";
      }
    },

    convertQueryToTicket: (state, action) => {
      const query = state.queries.find((q) => q.id === action.payload);
      if (query) {
        const newTicket = {
          id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
          customerName: query.customerName,
          customerEmail: query.contact.includes("@") ? query.contact : "customer@store.in",
          customerPhone: query.contact.startsWith("+") ? query.contact : "+91 99999 00000",
          orderId: "General Inquiry",
          subject: query.topic,
          category: "General Query Conversion",
          priority: "Medium",
          status: "Open",
          channel: query.channel,
          assignedAgent: "Pooja Hegde",
          createdAt: new Date().toLocaleString(),
          messages: [
            {
              id: `msg-${Date.now()}`,
              author: query.customerName,
              senderType: "customer",
              text: query.question,
              timestamp: query.createdAt,
            },
          ],
        };
        state.tickets.unshift(newTicket);
        query.status = "Replied";
        query.reply = `Converted into official support ticket #${newTicket.id}. Assigned to support desk.`;
      }
    },

    createComplaint: (state, action) => {
      const newComplaint = {
        ...action.payload,
        id: action.payload.id || `CMP-${Math.floor(300 + Math.random() * 900)}`,
        status: action.payload.status || "Under Investigation",
        reportedDate: new Date().toISOString().split("T")[0],
      };
      state.complaints.unshift(newComplaint);
    },

    updateComplaintStatus: (state, action) => {
      const { id, status, resolution, rootCause, compensationOffered } = action.payload;
      const complaint = state.complaints.find((c) => c.id === id);
      if (complaint) {
        if (status) complaint.status = status;
        if (resolution) complaint.resolution = resolution;
        if (rootCause) complaint.rootCause = rootCause;
        if (compensationOffered) complaint.compensationOffered = compensationOffered;
      }
    },
  },
});

export const {
  createTicket,
  updateTicketStatus,
  assignTicketAgent,
  replyToTicket,
  replyToQuery,
  convertQueryToTicket,
  createComplaint,
  updateComplaintStatus,
} = adminSupportSlice.actions;

export default adminSupportSlice.reducer;
