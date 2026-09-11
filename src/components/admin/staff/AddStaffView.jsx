import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addStaffMember } from "../../../store/slices/adminStaffSlice";
import { useCreateStaffMutation } from "@/hooks/useAdminStaffQuery";
import {
  UserPlus,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/Select";

const MODULES = [
  { id: "orders", label: "Orders & Fulfillment" },
  { id: "products", label: "Products & Catalog" },
  { id: "returns", label: "Returns & RTO" },
  { id: "marketing", label: "Marketing & Campaigns" },
  { id: "reviews", label: "Reviews & Moderation" },
  { id: "analytics", label: "Store Analytics" },
  { id: "utilities", label: "Utilities & Coupons" },
  { id: "staff", label: "Staff & RBAC Settings" },
];

const ROLE_MAPPING = {
  "Super Admin": "admin",
  admin: "admin",
  "Catalog Manager": "product_manager",
  product_manager: "product_manager",
  "Store Manager": "order_manager",
  order_manager: "order_manager",
  "Marketing Specialist": "marketing_manager",
  marketing_manager: "marketing_manager",
  "Customer Support Lead": "order_manager",
  "Inventory Specialist": "product_manager",
};

const AddStaffView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const createMutation = useCreateStaffMutation();
  const roles = useAppSelector((state) => state.adminStaff?.roles || []);
  const staffMembers = useAppSelector(
    (state) => state.adminStaff?.staffMembers || []
  );

  const nextStaffId = `STF-${String(staffMembers.length + 1).padStart(3, "0")}`;

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [employeeId, setEmployeeId] = useState(nextStaffId);
  const [department, setDepartment] = useState("Store Operations");
  const [designation, setDesignation] = useState("");
  const [selectedRoleName, setSelectedRoleName] = useState("Store Manager");

  // Credential Settings
  const [authMethod, setAuthMethod] = useState("invite"); // 'invite' | 'password'
  const [tempPassword, setTempPassword] = useState("Welcome@2026");
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [require2FA, setRequire2FA] = useState(true);

  // Custom Permissions Toggle
  const [showPermissionOverrides, setShowPermissionOverrides] = useState(false);
  const [customPermissions, setCustomPermissions] = useState({
    orders: { read: true, create: true, update: true, delete: false },
    products: { read: true, create: true, update: true, delete: false },
    returns: { read: true, create: true, update: true, delete: false },
    marketing: { read: true, create: true, update: true, delete: false },
    reviews: { read: true, create: false, update: true, delete: false },
    analytics: { read: true, create: false, update: false, delete: false },
    utilities: { read: true, create: true, update: true, delete: false },
    staff: { read: false, create: false, update: false, delete: false },
  });

  const selectedRoleObj = roles.find((r) => r.name === selectedRoleName);

  const handleTogglePermission = (moduleId, actionKey) => {
    setCustomPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [actionKey]: !prev[moduleId]?.[actionKey],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !designation.trim()) {
      toast.error("Please fill in all required staff details.");
      return;
    }

    const validRole = ROLE_MAPPING[selectedRoleName] || "order_manager";

    const newStaff = {
      id: employeeId || nextStaffId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: selectedRoleName,
      department: department.trim(),
      designation: designation.trim(),
      status: authMethod === "invite" ? "Invited" : "Active",
      twoFactorEnabled: require2FA,
      dateJoined: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
      avatar: `https://images.unsplash.com/photo-${1534528741775 + (staffMembers.length * 1000)}?auto=format&fit=crop&w=200&q=80`,
    };

    createMutation.mutate(
      {
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        role: validRole,
        password: tempPassword,
        permissions: customPermissions,
      },
      {
        onSettled: () => {
          dispatch(addStaffMember(newStaff));
          toast.success(
            authMethod === "invite"
              ? `Invitation email sent to ${newStaff.email}!`
              : `Staff member ${newStaff.name} created successfully!`
          );
          navigate("/admin/staff/all");
        },
      }
    );
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/staff/all"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-indigo-600" />
              Add New Staff Member
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Provision administrative credentials, role assignments, and access policies.
            </p>
          </div>
        </div>

        <Link
          to="/admin/staff/all"
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
                <UserPlus className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                1. Personal & Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employee Code / ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Work Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@apexstore.in"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Role & Department Assignment */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                <KeyRound className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                2. Role & Department Assignment
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned RBAC Role <span className="text-rose-500">*</span>
                </label>
                <Select value={selectedRoleName} onValueChange={setSelectedRoleName}>
                  <SelectTrigger className="w-full text-xs bg-slate-50 border-slate-200 focus:bg-white">
                    <SelectValue placeholder="Select RBAC Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.name}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Determines base capabilities across store modules.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department <span className="text-rose-500">*</span>
                </label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="w-full text-xs bg-slate-50 border-slate-200 focus:bg-white">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Store Operations">Store Operations</SelectItem>
                    <SelectItem value="Product & Merchandising">Product & Merchandising</SelectItem>
                    <SelectItem value="Customer Experience">Customer Experience</SelectItem>
                    <SelectItem value="Warehouse & Logistics">Warehouse & Logistics</SelectItem>
                    <SelectItem value="Growth & Marketing">Growth & Marketing</SelectItem>
                    <SelectItem value="Executive & IT">Executive & IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designation / Business Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Operations Officer, Inventory Analyst"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Credentials & Security Policy */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
                <Lock className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                3. Access Credentials & Security Policies
              </h2>
            </div>

            <div className="space-y-3">
              {/* Radio options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setAuthMethod("invite")}
                  className={`p-3 rounded-lg border cursor-pointer flex items-start gap-3 transition-colors ${
                    authMethod === "invite"
                      ? "border-indigo-500 bg-indigo-50/20"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="authMethod"
                    checked={authMethod === "invite"}
                    onChange={() => setAuthMethod("invite")}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      Send Email Invitation
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Sends a secure onboarding link for the user to set their password.
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => setAuthMethod("password")}
                  className={`p-3 rounded-lg border cursor-pointer flex items-start gap-3 transition-colors ${
                    authMethod === "password"
                      ? "border-indigo-500 bg-indigo-50/20"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="authMethod"
                    checked={authMethod === "password"}
                    onChange={() => setAuthMethod("password")}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      Set Temporary Password
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Create initial credentials to share directly with the employee.
                    </div>
                  </div>
                </label>
              </div>

              {authMethod === "password" && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Temporary Password
                  </label>
                  <input
                    type="text"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    required
                  />
                </div>
              )}

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Require Two-Factor Authentication (2FA)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Mandates OTP verification on each portal sign-in.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={require2FA}
                    onChange={(e) => setRequire2FA(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Force Password Reset on First Login
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Requires creating a new private password upon initial login.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={forcePasswordChange}
                    onChange={(e) => setForcePasswordChange(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Optional Granular Permission Overrides */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPermissionOverrides(!showPermissionOverrides)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Granular Permission Overrides (Optional)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fine-tune specific module read, write, or delete capabilities for this user.
                  </p>
                </div>
              </div>
              {showPermissionOverrides ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showPermissionOverrides && (
              <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-200">
                      <th className="py-2 px-3">Module</th>
                      <th className="py-2 px-3 text-center">Read</th>
                      <th className="py-2 px-3 text-center">Create</th>
                      <th className="py-2 px-3 text-center">Edit</th>
                      <th className="py-2 px-3 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {MODULES.map((mod) => (
                      <tr key={mod.id} className="hover:bg-white transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-800">
                          {mod.label}
                        </td>
                        {["read", "create", "update", "delete"].map((actionKey) => (
                          <td key={actionKey} className="py-2 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={!!customPermissions[mod.id]?.[actionKey]}
                              onChange={() => handleTogglePermission(mod.id, actionKey)}
                              className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Role Summary & Submit (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Selected Role Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Assigned Role Summary
              </h3>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-sm font-bold text-indigo-700">
                {selectedRoleObj?.name || selectedRoleName}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedRoleObj?.description ||
                  "Standard role access across store administrative workflows."}
              </p>
            </div>

            <div className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span>Existing Members:</span>
                <strong className="text-slate-800 font-semibold">
                  {selectedRoleObj?.memberCount || 0}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Role Type:</span>
                <span className="font-semibold text-slate-700">
                  {selectedRoleObj?.isSystem ? "System Standard" : "Custom Defined"}
                </span>
              </div>
            </div>
          </div>

          {/* Compliance & Security Box */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Info className="w-4 h-4 text-indigo-600" />
              Security Protocol
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>All actions taken by this account are logged to the security audit trail.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Accounts can be instantly suspended by Super Admins at any time.</span>
              </li>
            </ul>
          </div>

          {/* Submit Actions */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create Staff Account
            </button>

            <Link
              to="/admin/staff/all"
              className="w-full block text-center py-2 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              Cancel & Return
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStaffView;
