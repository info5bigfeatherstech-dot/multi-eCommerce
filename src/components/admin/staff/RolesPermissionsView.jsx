import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  updateRolePermissions,
  createCustomRole,
} from "../../../store/slices/adminStaffSlice";
import {
  ShieldCheck,
  KeyRound,
  Plus,
  Save,
  CheckCircle2,
  Users,
  Lock,
  Sparkles,
  Info,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const MODULES = [
  { id: "orders", label: "Orders & Fulfillment", desc: "View customer orders, verify dispatch, export manifests" },
  { id: "products", label: "Products & Catalog", desc: "Manage product listings, categories, pricing, inventory" },
  { id: "returns", label: "Returns & RTO", desc: "Process return requests, manage refunds and failed deliveries" },
  { id: "marketing", label: "Marketing & Campaigns", desc: "Push notifications, WhatsApp messages, campaigns & coupons" },
  { id: "reviews", label: "Reviews & Moderation", desc: "Moderate reviews, approve/reject customer feedbacks, reply" },
  { id: "analytics", label: "Store Analytics", desc: "Sales reports, customer trends, product performance KPIs" },
  { id: "utilities", label: "Utilities & Tools", desc: "Coupons, loyalty program, notifications and gift cards" },
  { id: "staff", label: "Staff & RBAC Settings", desc: "Manage staff accounts, edit role matrices and view logs" },
];

const ACTIONS = [
  { key: "read", label: "Read / View" },
  { key: "create", label: "Create / Add" },
  { key: "update", label: "Edit / Update" },
  { key: "delete", label: "Delete / Moderate" },
  { key: "export", label: "Export CSV" },
];

const RolesPermissionsView = () => {
  const dispatch = useAppDispatch();
  const roles = useAppSelector((state) => state.adminStaff?.roles || []);

  const [selectedRoleId, setSelectedRoleId] = useState("role-store-manager");
  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  // Editable local permissions state for the currently selected role
  const [currentPermissions, setCurrentPermissions] = useState(
    selectedRole?.permissions || {}
  );

  // Synchronize when switching selected role
  const handleSelectRole = (role) => {
    setSelectedRoleId(role.id);
    setCurrentPermissions(role.permissions || {});
  };

  // Create Role Modal
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [cloneFromRoleId, setCloneFromRoleId] = useState(roles[0]?.id || "");

  const handleTogglePermission = (moduleId, actionKey) => {
    if (selectedRole?.id === "role-super-admin") {
      toast.info("Super Admin permissions cannot be restricted.");
      return;
    }

    setCurrentPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [actionKey]: !prev[moduleId]?.[actionKey],
      },
    }));
  };

  const handleSelectAllForModule = (moduleId, enable) => {
    if (selectedRole?.id === "role-super-admin") return;

    setCurrentPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        read: enable,
        create: enable,
        update: enable,
        delete: enable,
        export: enable,
      },
    }));
  };

  const handleSavePermissions = () => {
    if (!selectedRole) return;
    dispatch(
      updateRolePermissions({
        roleId: selectedRole.id,
        permissions: currentPermissions,
      })
    );
    toast.success(`Saved updated permissions for role "${selectedRole.name}"!`);
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const sourceRole = roles.find((r) => r.id === cloneFromRoleId);
    const clonedPerms = sourceRole
      ? JSON.parse(JSON.stringify(sourceRole.permissions))
      : {};

    const newRole = {
      name: newRoleName.trim(),
      description:
        newRoleDesc.trim() || `Custom access role for ${newRoleName.trim()}.`,
      permissions: clonedPerms,
    };

    dispatch(createCustomRole(newRole));
    toast.success(`Created new custom role "${newRole.name}"!`);
    setCreateRoleModalOpen(false);
    setNewRoleName("");
    setNewRoleDesc("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <KeyRound className="w-5 h-5 text-indigo-600" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Roles & Permissions
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Staff access and permissions control across store administrative capabilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateRoleModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            Create Custom Role
          </button>
          <button
            onClick={handleSavePermissions}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Permission Matrix
          </button>
        </div>
      </div>

      {/* Role Cards Horizontal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const isSelected = role.id === selectedRole?.id;
          return (
            <div
              key={role.id}
              onClick={() => handleSelectRole(role)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-indigo-50/40 border-indigo-500 shadow-sm ring-1 ring-indigo-500"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {role.name}
                    </h3>
                    {role.isSystem && (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{role.memberCount}</strong> active user{role.memberCount !== 1 ? "s" : ""}
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    isSelected ? "text-indigo-600" : "text-slate-400"
                  }`}
                >
                  {isSelected ? "Currently Editing" : "Click to Edit"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Role Permissions Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Matrix Header */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Permission Matrix for: <span className="text-indigo-600">{selectedRole?.name}</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle specific permissions to grant or revoke administrative capabilities for this role.
            </p>
          </div>

          {selectedRole?.id === "role-super-admin" && (
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <Lock className="w-3.5 h-3.5" />
              Super Admin possesses root authorization.
            </div>
          )}
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-white">
                <th className="py-3 px-4 w-1/3">Module & Description</th>
                {ACTIONS.map((action) => (
                  <th key={action.key} className="py-3 px-3 text-center">
                    {action.label}
                  </th>
                ))}
                <th className="py-3 px-4 text-right">Quick Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {MODULES.map((mod) => {
                const modPerms = currentPermissions[mod.id] || {};
                const allActive =
                  modPerms.read &&
                  modPerms.create &&
                  modPerms.update &&
                  modPerms.delete &&
                  modPerms.export;

                return (
                  <tr key={mod.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Module info */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs">
                        {mod.label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {mod.desc}
                      </div>
                    </td>

                    {/* Action Checkboxes */}
                    {ACTIONS.map((action) => (
                      <td key={action.key} className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={!!modPerms[action.key]}
                          disabled={selectedRole?.id === "role-super-admin"}
                          onChange={() =>
                            handleTogglePermission(mod.id, action.key)
                          }
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                        />
                      </td>
                    ))}

                    {/* Quick Toggle Column */}
                    <td className="py-3.5 px-4 text-right">
                      {selectedRole?.id !== "role-super-admin" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectAllForModule(mod.id, !allActive)
                          }
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          {allActive ? "Revoke All" : "Allow All"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer save prompt */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400" />
            Changes take effect immediately for active users on next request.
          </div>
          <button
            onClick={handleSavePermissions}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes for {selectedRole?.name}
          </button>
        </div>
      </div>

      {/* Create Custom Role Modal */}
      {createRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                  <KeyRound className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Create Custom RBAC Role
                </h3>
              </div>
              <button
                onClick={() => setCreateRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Finance Auditor, Vendor Coordinator"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Outline who this role is intended for and its scope..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clone Initial Permissions From
                </label>
                <select
                  value={cloneFromRoleId}
                  onChange={(e) => setCloneFromRoleId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateRoleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissionsView;
