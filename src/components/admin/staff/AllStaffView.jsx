import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  toggleStaffStatus,
  deleteStaffMember,
  updateStaffMember,
} from "../../../store/slices/adminStaffSlice";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Building,
  MoreVertical,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";

const AllStaffView = () => {
  const dispatch = useAppDispatch();
  const staffMembers = useAppSelector(
    (state) => state.adminStaff?.staffMembers || []
  );
  const roles = useAppSelector((state) => state.adminStaff?.roles || []);

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Metrics
  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter((s) => s.status === "Active").length;
  const suspendedStaff = staffMembers.filter((s) => s.status === "Suspended").length;
  const invitedStaff = staffMembers.filter((s) => s.status === "Invited").length;
  const twoFactorCount = staffMembers.filter((s) => s.twoFactorEnabled).length;
  const twoFactorRate = totalStaff > 0 ? Math.round((twoFactorCount / totalStaff) * 100) : 0;

  // Departments list derived
  const departments = useMemo(() => {
    const set = new Set(staffMembers.map((s) => s.department));
    return Array.from(set);
  }, [staffMembers]);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffMembers.filter((staff) => {
      if (departmentFilter !== "all" && staff.department !== departmentFilter) return false;
      if (roleFilter !== "all" && staff.role !== roleFilter) return false;
      if (statusFilter !== "all" && staff.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = staff.name.toLowerCase().includes(query);
        const matchEmail = staff.email.toLowerCase().includes(query);
        const matchId = staff.id.toLowerCase().includes(query);
        const matchPhone = staff.phone.toLowerCase().includes(query);
        const matchRole = staff.role.toLowerCase().includes(query);
        return matchName || matchEmail || matchId || matchPhone || matchRole;
      }
      return true;
    });
  }, [staffMembers, departmentFilter, roleFilter, statusFilter, searchQuery]);

  // Handlers
  const handleToggleStatus = (id, name, currentStatus) => {
    dispatch(toggleStaffStatus(id));
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    if (nextStatus === "Suspended") {
      toast.error(`Account for ${name} has been suspended.`);
    } else {
      toast.success(`Account for ${name} has been reactivated.`);
    }
  };

  const handleDeleteStaff = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete staff member ${name}?`)) {
      dispatch(deleteStaffMember(id));
      toast.success(`Removed ${name} from staff directory.`);
    }
  };

  const openEditModal = (staff) => {
    setEditingStaff({ ...staff });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingStaff) return;

    dispatch(updateStaffMember(editingStaff));
    toast.success(`Updated staff details for ${editingStaff.name}`);
    setEditModalOpen(false);
    setEditingStaff(null);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Staff ID",
      "Full Name",
      "Official Email",
      "Phone",
      "Role",
      "Department",
      "Designation",
      "Status",
      "2FA Enabled",
      "Last Login",
      "Date Joined",
    ];

    const rows = filteredStaff.map((s) => [
      s.id,
      `"${s.name}"`,
      s.email,
      `"${s.phone}"`,
      `"${s.role}"`,
      `"${s.department}"`,
      `"${s.designation}"`,
      s.status,
      s.twoFactorEnabled ? "Yes" : "No",
      `"${s.lastLogin}"`,
      s.dateJoined,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `staff_directory_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Staff directory exported to CSV!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Users className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              All Staff Members
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage all staff members, department roles, credentials, and access statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Directory
          </button>
          <Link
            to="/admin/staff/add"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add Staff Member
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Staff */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Team Size
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {totalStaff} Members
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across {departments.length} departments
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Active Accounts
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {activeStaff}
            </div>
            <div className="text-xs text-emerald-700 mt-1 font-medium">
              Operational portal credentials
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* 2FA Adoption */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              2FA Security Adoption
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {twoFactorRate}%
            </div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">
              {twoFactorCount} of {totalStaff} members enforced
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Pending & Suspended */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Attention Required
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {suspendedStaff}
              </span>
              <span className="text-xs text-rose-600 font-medium">Suspended</span>
              <span className="text-xs text-slate-300">|</span>
              <span className="text-2xl font-bold text-slate-900">
                {invitedStaff}
              </span>
              <span className="text-xs text-amber-600 font-medium">Invited</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Pending onboarding or review
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, code, role..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Department */}
            <div className="min-w-[170px]">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <SelectValue placeholder="All Departments" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Role */}
            <div className="min-w-[150px]">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <SelectValue placeholder="All Roles" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.name}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="min-w-[140px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <SelectValue placeholder="All Statuses" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Invited">Invited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredStaff.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">
              No staff members match the selected filters
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to see all team records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Role & Department</th>
                  <th className="py-3 px-4">2FA & Security</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Staff Member */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {staff.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              {staff.id}
                            </span>
                            <span>{staff.designation}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{staff.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{staff.phone}</span>
                      </div>
                    </td>

                    {/* Role & Department */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            staff.role === "Super Admin"
                              ? "bg-purple-100 text-purple-800"
                              : staff.role === "Store Manager"
                              ? "bg-blue-100 text-blue-800"
                              : staff.role === "Catalog Manager"
                              ? "bg-amber-100 text-amber-800"
                              : staff.role === "Customer Support Lead"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {staff.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {staff.department}
                      </div>
                    </td>

                    {/* 2FA & Security */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {staff.twoFactorEnabled ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            2FA Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Disabled
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last: {staff.lastLogin}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {staff.status === "Active" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      )}
                      {staff.status === "Suspended" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3 h-3" />
                          Suspended
                        </span>
                      )}
                      {staff.status === "Invited" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Invited
                        </span>
                      )}
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle Suspend/Activate */}
                        <button
                          onClick={() =>
                            handleToggleStatus(staff.id, staff.name, staff.status)
                          }
                          title={
                            staff.status === "Active"
                              ? "Suspend Account Access"
                              : "Activate Account"
                          }
                          className={`p-1.5 rounded-md border transition-colors ${
                            staff.status === "Active"
                              ? "text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200"
                              : "text-emerald-600 hover:bg-emerald-50 border-slate-200 hover:border-emerald-200"
                          }`}
                        >
                          {staff.status === "Active" ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Edit Staff */}
                        <button
                          onClick={() => openEditModal(staff)}
                          title="Edit Staff Member"
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md border border-slate-200 hover:border-indigo-200 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Staff */}
                        {staff.role !== "Super Admin" && (
                          <button
                            onClick={() => handleDeleteStaff(staff.id, staff.name)}
                            title="Delete Staff Member"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md border border-slate-200 hover:border-rose-200 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Staff Modal */}
      {editModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                  <Edit2 className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Staff Profile
                </h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editingStaff.name}
                    onChange={(e) =>
                      setEditingStaff({ ...editingStaff, name: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee Code
                  </label>
                  <input
                    type="text"
                    value={editingStaff.id}
                    disabled
                    className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) =>
                      setEditingStaff({ ...editingStaff, email: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editingStaff.phone}
                    onChange={(e) =>
                      setEditingStaff({ ...editingStaff, phone: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Role
                  </label>
                  <Select
                    value={editingStaff.role}
                    onValueChange={(val) =>
                      setEditingStaff({ ...editingStaff, role: val })
                    }
                  >
                    <SelectTrigger className="h-9 text-xs border-slate-200">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.name}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editingStaff.department}
                    onChange={(e) =>
                      setEditingStaff({ ...editingStaff, department: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designation / Title
                </label>
                <input
                  type="text"
                  value={editingStaff.designation}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, designation: e.target.value })
                  }
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Two-Factor Authentication (2FA)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Require OTP verification on login
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={editingStaff.twoFactorEnabled}
                  onChange={(e) =>
                    setEditingStaff({
                      ...editingStaff,
                      twoFactorEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStaffView;
