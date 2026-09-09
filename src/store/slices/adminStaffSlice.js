import { createSlice } from "@reduxjs/toolkit";

const initialStaffMembers = [
  {
    id: "STF-001",
    name: "Vikramaditya Rao",
    email: "vikram.rao@apexstore.in",
    phone: "+91 98450 12345",
    role: "Super Admin",
    department: "Executive & IT",
    designation: "Head of Digital Operations",
    status: "Active",
    twoFactorEnabled: true,
    lastLogin: "2026-09-09 10:45 AM",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    dateJoined: "2024-01-15",
  },
  {
    id: "STF-002",
    name: "Neha Sharma",
    email: "neha.sharma@apexstore.in",
    phone: "+91 99123 45678",
    role: "Store Manager",
    department: "Store Operations",
    designation: "Senior Operations Lead",
    status: "Active",
    twoFactorEnabled: true,
    lastLogin: "2026-09-09 09:20 AM",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    dateJoined: "2024-06-10",
  },
  {
    id: "STF-003",
    name: "Arjun Verma",
    email: "arjun.v@apexstore.in",
    phone: "+91 97890 23456",
    role: "Catalog Manager",
    department: "Product & Merchandising",
    designation: "Catalog & Pricing Specialist",
    status: "Active",
    twoFactorEnabled: false,
    lastLogin: "2026-09-08 04:15 PM",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    dateJoined: "2024-11-01",
  },
  {
    id: "STF-004",
    name: "Pooja Hegde",
    email: "pooja.h@apexstore.in",
    phone: "+91 98234 56789",
    role: "Customer Support Lead",
    department: "Customer Experience",
    designation: "Support & Grievance Officer",
    status: "Active",
    twoFactorEnabled: true,
    lastLogin: "2026-09-09 11:05 AM",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    dateJoined: "2025-02-18",
  },
  {
    id: "STF-005",
    name: "Sameer Kulkarni",
    email: "sameer.k@apexstore.in",
    phone: "+91 98765 43210",
    role: "Inventory Specialist",
    department: "Warehouse & Logistics",
    designation: "Fulfillment Coordinator",
    status: "Active",
    twoFactorEnabled: false,
    lastLogin: "2026-09-07 06:40 PM",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    dateJoined: "2025-04-12",
  },
  {
    id: "STF-006",
    name: "Divya Krishnan",
    email: "divya.k@apexstore.in",
    phone: "+91 97456 12389",
    role: "Marketing Specialist",
    department: "Growth & Marketing",
    designation: "Campaign & Push Strategist",
    status: "Invited",
    twoFactorEnabled: false,
    lastLogin: "Never",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    dateJoined: "2026-09-08",
  },
  {
    id: "STF-007",
    name: "Karan Johar",
    email: "karan.temp@apexstore.in",
    phone: "+91 98111 22334",
    role: "Store Manager",
    department: "Store Operations",
    designation: "Contract Field Manager",
    status: "Suspended",
    twoFactorEnabled: false,
    lastLogin: "2026-08-28 01:10 PM",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    dateJoined: "2025-08-01",
  },
];

const initialRoles = [
  {
    id: "role-super-admin",
    name: "Super Admin",
    description: "Unrestricted access across all financial, catalog, staff, and system modules.",
    isSystem: true,
    memberCount: 1,
    permissions: {
      orders: { read: true, create: true, update: true, delete: true, export: true },
      products: { read: true, create: true, update: true, delete: true, export: true },
      returns: { read: true, create: true, update: true, delete: true, export: true },
      marketing: { read: true, create: true, update: true, delete: true, export: true },
      reviews: { read: true, create: true, update: true, delete: true, export: true },
      analytics: { read: true, create: true, update: true, delete: true, export: true },
      utilities: { read: true, create: true, update: true, delete: true, export: true },
      staff: { read: true, create: true, update: true, delete: true, export: true },
    },
  },
  {
    id: "role-store-manager",
    name: "Store Manager",
    description: "Manages orders, inventory fulfillment, promotions, and customer inquiries.",
    isSystem: true,
    memberCount: 2,
    permissions: {
      orders: { read: true, create: true, update: true, delete: false, export: true },
      products: { read: true, create: true, update: true, delete: false, export: true },
      returns: { read: true, create: true, update: true, delete: false, export: true },
      marketing: { read: true, create: true, update: true, delete: false, export: true },
      reviews: { read: true, create: false, update: true, delete: false, export: true },
      analytics: { read: true, create: false, update: false, delete: false, export: true },
      utilities: { read: true, create: true, update: true, delete: false, export: false },
      staff: { read: true, create: false, update: false, delete: false, export: false },
    },
  },
  {
    id: "role-catalog-manager",
    name: "Catalog Manager",
    description: "Controls product listings, categories, attributes, pricing, and stock quotas.",
    isSystem: true,
    memberCount: 1,
    permissions: {
      orders: { read: true, create: false, update: false, delete: false, export: false },
      products: { read: true, create: true, update: true, delete: true, export: true },
      returns: { read: false, create: false, update: false, delete: false, export: false },
      marketing: { read: false, create: false, update: false, delete: false, export: false },
      reviews: { read: true, create: false, update: true, delete: false, export: true },
      analytics: { read: true, create: false, update: false, delete: false, export: false },
      utilities: { read: false, create: false, update: false, delete: false, export: false },
      staff: { read: false, create: false, update: false, delete: false, export: false },
    },
  },
  {
    id: "role-support-lead",
    name: "Customer Support Lead",
    description: "Handles customer inquiries, return claims, review replies, and stock queries.",
    isSystem: true,
    memberCount: 1,
    permissions: {
      orders: { read: true, create: false, update: true, delete: false, export: false },
      products: { read: true, create: false, update: false, delete: false, export: false },
      returns: { read: true, create: true, update: true, delete: false, export: true },
      marketing: { read: false, create: false, update: false, delete: false, export: false },
      reviews: { read: true, create: true, update: true, delete: false, export: true },
      analytics: { read: false, create: false, update: false, delete: false, export: false },
      utilities: { read: true, create: false, update: false, delete: false, export: false },
      staff: { read: false, create: false, update: false, delete: false, export: false },
    },
  },
  {
    id: "role-inventory-specialist",
    name: "Inventory Specialist",
    description: "Updates warehouse quantities, tracks RTO shipments, and marks delivery handoffs.",
    isSystem: true,
    memberCount: 1,
    permissions: {
      orders: { read: true, create: false, update: true, delete: false, export: true },
      products: { read: true, create: false, update: true, delete: false, export: true },
      returns: { read: true, create: false, update: true, delete: false, export: false },
      marketing: { read: false, create: false, update: false, delete: false, export: false },
      reviews: { read: false, create: false, update: false, delete: false, export: false },
      analytics: { read: false, create: false, update: false, delete: false, export: false },
      utilities: { read: false, create: false, update: false, delete: false, export: false },
      staff: { read: false, create: false, update: false, delete: false, export: false },
    },
  },
  {
    id: "role-marketing-specialist",
    name: "Marketing Specialist",
    description: "Creates coupons, sets up push notifications, WhatsApp broadcasts, and campaign tracking.",
    isSystem: false,
    memberCount: 1,
    permissions: {
      orders: { read: true, create: false, update: false, delete: false, export: false },
      products: { read: true, create: false, update: false, delete: false, export: false },
      returns: { read: false, create: false, update: false, delete: false, export: false },
      marketing: { read: true, create: true, update: true, delete: true, export: true },
      reviews: { read: true, create: false, update: false, delete: false, export: false },
      analytics: { read: true, create: false, update: false, delete: false, export: true },
      utilities: { read: true, create: true, update: true, delete: false, export: true },
      staff: { read: false, create: false, update: false, delete: false, export: false },
    },
  },
];

const initialActivityLogs = [
  {
    id: "LOG-5819",
    staffId: "STF-001",
    staffName: "Vikramaditya Rao",
    role: "Super Admin",
    action: "Updated Role Permissions",
    module: "Roles & Permissions",
    details: "Granted export capability on Analytics to Store Manager role.",
    ipAddress: "157.48.12.89",
    location: "Mumbai, India",
    severity: "Warning",
    timestamp: "2026-09-09 11:22:15",
  },
  {
    id: "LOG-5818",
    staffId: "STF-002",
    staffName: "Neha Sharma",
    role: "Store Manager",
    action: "Order Status Changed",
    module: "Orders",
    details: "Order ORD-9481 transitioned from Confirmed to Dispatched with courier AWB #781923.",
    ipAddress: "49.36.182.204",
    location: "New Delhi, India",
    severity: "Info",
    timestamp: "2026-09-09 10:14:02",
  },
  {
    id: "LOG-5817",
    staffId: "STF-004",
    staffName: "Pooja Hegde",
    role: "Customer Support Lead",
    action: "Merchant Reply Posted",
    module: "Reviews",
    details: "Responded to 5-star customer review on Pure Handloom Chanderi Silk Saree (REV-101).",
    ipAddress: "106.51.78.12",
    location: "Bengaluru, India",
    severity: "Info",
    timestamp: "2026-09-09 09:45:30",
  },
  {
    id: "LOG-5816",
    staffId: "STF-003",
    staffName: "Arjun Verma",
    role: "Catalog Manager",
    action: "Product Price Adjusted",
    module: "Products",
    details: "Updated SKU APX-HOM-003 retail price from ₹4,200 to ₹3,899 with 10% promotional tag.",
    ipAddress: "122.161.45.67",
    location: "Pune, India",
    severity: "Warning",
    timestamp: "2026-09-08 16:30:11",
  },
  {
    id: "LOG-5815",
    staffId: "STF-001",
    staffName: "Vikramaditya Rao",
    role: "Super Admin",
    action: "Staff Invitation Sent",
    module: "Staff",
    details: "Invited Divya Krishnan (divya.k@apexstore.in) as Marketing Specialist.",
    ipAddress: "157.48.12.89",
    location: "Mumbai, India",
    severity: "Info",
    timestamp: "2026-09-08 14:10:00",
  },
  {
    id: "LOG-5814",
    staffId: "STF-007",
    staffName: "Karan Johar",
    role: "Store Manager",
    action: "Failed Login Attempt (Account Suspended)",
    module: "Auth & Security",
    details: "Attempted authentication from unauthorized IP 185.220.101.5. Triggered automatic block.",
    ipAddress: "185.220.101.5",
    location: "Frankfurt, Germany",
    severity: "Critical",
    timestamp: "2026-09-08 11:05:44",
  },
];

const initialState = {
  staffMembers: initialStaffMembers,
  roles: initialRoles,
  activityLogs: initialActivityLogs,
};

export const adminStaffSlice = createSlice({
  name: "adminStaff",
  initialState,
  reducers: {
    addStaffMember: (state, action) => {
      const newStaff = {
        ...action.payload,
        id: action.payload.id || `STF-${String(state.staffMembers.length + 1).padStart(3, "0")}`,
        dateJoined: action.payload.dateJoined || new Date().toISOString().split("T")[0],
        lastLogin: "Never",
        avatar:
          action.payload.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      };
      state.staffMembers.unshift(newStaff);

      // Increment memberCount on the assigned role
      const roleObj = state.roles.find((r) => r.name === newStaff.role);
      if (roleObj) {
        roleObj.memberCount++;
      }

      // Log activity
      state.activityLogs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        staffId: "STF-001",
        staffName: "Super Admin",
        role: "Super Admin",
        action: "Staff Member Created",
        module: "Staff",
        details: `Created account for ${newStaff.name} (${newStaff.email}) as ${newStaff.role}.`,
        ipAddress: "127.0.0.1",
        location: "Admin Portal",
        severity: "Info",
        timestamp: new Date().toLocaleString(),
      });
    },

    updateStaffMember: (state, action) => {
      const index = state.staffMembers.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        const oldRole = state.staffMembers[index].role;
        const newRole = action.payload.role;

        if (oldRole !== newRole) {
          const oldRoleObj = state.roles.find((r) => r.name === oldRole);
          if (oldRoleObj && oldRoleObj.memberCount > 0) oldRoleObj.memberCount--;
          const newRoleObj = state.roles.find((r) => r.name === newRole);
          if (newRoleObj) newRoleObj.memberCount++;
        }

        state.staffMembers[index] = { ...state.staffMembers[index], ...action.payload };
      }
    },

    toggleStaffStatus: (state, action) => {
      const staff = state.staffMembers.find((s) => s.id === action.payload);
      if (staff) {
        const previousStatus = staff.status;
        staff.status = staff.status === "Active" ? "Suspended" : "Active";

        state.activityLogs.unshift({
          id: `LOG-${Date.now().toString().slice(-4)}`,
          staffId: "STF-001",
          staffName: "Super Admin",
          role: "Super Admin",
          action: "Staff Status Toggled",
          module: "Staff",
          details: `Changed status of ${staff.name} from ${previousStatus} to ${staff.status}.`,
          ipAddress: "127.0.0.1",
          location: "Admin Portal",
          severity: staff.status === "Suspended" ? "Warning" : "Info",
          timestamp: new Date().toLocaleString(),
        });
      }
    },

    deleteStaffMember: (state, action) => {
      const staff = state.staffMembers.find((s) => s.id === action.payload);
      if (staff) {
        const roleObj = state.roles.find((r) => r.name === staff.role);
        if (roleObj && roleObj.memberCount > 0) roleObj.memberCount--;

        state.staffMembers = state.staffMembers.filter((s) => s.id !== action.payload);

        state.activityLogs.unshift({
          id: `LOG-${Date.now().toString().slice(-4)}`,
          staffId: "STF-001",
          staffName: "Super Admin",
          role: "Super Admin",
          action: "Staff Member Deleted",
          module: "Staff",
          details: `Removed staff member ${staff.name} (${staff.id}) from the system.`,
          ipAddress: "127.0.0.1",
          location: "Admin Portal",
          severity: "Critical",
          timestamp: new Date().toLocaleString(),
        });
      }
    },

    updateRolePermissions: (state, action) => {
      const { roleId, permissions } = action.payload;
      const role = state.roles.find((r) => r.id === roleId);
      if (role) {
        role.permissions = permissions;

        state.activityLogs.unshift({
          id: `LOG-${Date.now().toString().slice(-4)}`,
          staffId: "STF-001",
          staffName: "Super Admin",
          role: "Super Admin",
          action: "Updated Role Permissions",
          module: "Roles & Permissions",
          details: `Modified module permissions for role ${role.name}.`,
          ipAddress: "127.0.0.1",
          location: "Admin Portal",
          severity: "Warning",
          timestamp: new Date().toLocaleString(),
        });
      }
    },

    createCustomRole: (state, action) => {
      const newRole = {
        ...action.payload,
        id: `role-${action.payload.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        isSystem: false,
        memberCount: 0,
      };
      state.roles.push(newRole);

      state.activityLogs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        staffId: "STF-001",
        staffName: "Super Admin",
        role: "Super Admin",
        action: "Custom Role Created",
        module: "Roles & Permissions",
        details: `Created new RBAC role "${newRole.name}".`,
        ipAddress: "127.0.0.1",
        location: "Admin Portal",
        severity: "Info",
        timestamp: new Date().toLocaleString(),
      });
    },

    logStaffActivity: (state, action) => {
      state.activityLogs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString(),
        ipAddress: "127.0.0.1",
        location: "Admin Portal",
        severity: "Info",
        ...action.payload,
      });
    },
  },
});

export const {
  addStaffMember,
  updateStaffMember,
  toggleStaffStatus,
  deleteStaffMember,
  updateRolePermissions,
  createCustomRole,
  logStaffActivity,
} = adminStaffSlice.actions;

export default adminStaffSlice.reducer;
