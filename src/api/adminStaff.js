import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * Valid Staff Roles
 */
export const VALID_STAFF_ROLES = [
  "admin",
  "product_manager",
  "order_manager",
  "marketing_manager",
];

/**
 * 1. GET /api/admin/staff
 * List all staff members with pagination & search
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {string} [params.search=""]
 * @param {string} [params.role=""]
 * @returns {Promise<Object>}
 */
export async function getStaffMembers({
  page = 1,
  limit = 20,
  search = "",
  role = "",
} = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (role && role !== "all" && role !== "All") params.set("role", role);

    const response = await apiClient.get(`${ENDPOINTS.STAFF.LIST}?${params.toString()}`);
    const resData = response.data;
    const staffList = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.staff || [];
    const total = resData?.pagination?.total ?? resData?.total ?? staffList.length;

    return {
      staff: staffList,
      total,
      pagination: resData?.pagination || { page, limit, total },
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. GET /api/admin/staff/:id
 * Get staff details by staff ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getStaffMemberById(id) {
  try {
    const response = await apiClient.get(ENDPOINTS.STAFF.DETAIL(id));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 3. POST /api/admin/staff
 * Create a new staff account
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} payload.role - Must be one of VALID_STAFF_ROLES
 * @param {string} payload.password
 * @param {Object} [payload.permissions]
 * @returns {Promise<Object>}
 */
export async function createStaffMember({
  name,
  email,
  phone,
  role,
  password,
  permissions = {},
}) {
  try {
    const response = await apiClient.post(ENDPOINTS.STAFF.CREATE, {
      name,
      email,
      phone,
      role,
      password,
      permissions,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 4. PUT /api/admin/staff/:id
 * Update staff details, role, or active status
 * @param {string} id
 * @param {Object} payload
 * @param {string} [payload.name]
 * @param {string} [payload.phone]
 * @param {string} [payload.role]
 * @param {boolean} [payload.isActive]
 * @param {Object} [payload.permissions]
 * @returns {Promise<Object>}
 */
export async function updateStaffMember(id, {
  name,
  phone,
  role,
  isActive,
  permissions,
}) {
  try {
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (phone !== undefined) payload.phone = phone;
    if (role !== undefined) payload.role = role;
    if (isActive !== undefined) payload.isActive = isActive;
    if (permissions !== undefined) payload.permissions = permissions;

    const response = await apiClient.put(ENDPOINTS.STAFF.UPDATE(id), payload);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 5. DELETE /api/admin/staff/:id
 * Remove / deactivate staff member
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function deleteStaffMember(id) {
  try {
    const response = await apiClient.delete(ENDPOINTS.STAFF.DELETE(id));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 6. POST /api/admin/staff/:id/initiate-reset
 * Trigger OTP/password reset for staff
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function initiateStaffReset(id) {
  try {
    const response = await apiClient.post(ENDPOINTS.STAFF.INITIATE_RESET(id));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 7. POST /api/admin/staff/:id/verify-reset
 * Verify OTP and set new password for staff
 * @param {string} id
 * @param {Object} payload
 * @param {string} payload.otp
 * @param {string} payload.newPassword
 * @returns {Promise<Object>}
 */
export async function verifyStaffReset(id, { otp, newPassword }) {
  try {
    const response = await apiClient.post(ENDPOINTS.STAFF.VERIFY_RESET(id), {
      otp,
      newPassword,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 8. GET /api/admin/staff/profile/me
 * Fetch currently logged-in staff profile
 * @returns {Promise<Object>}
 */
export async function getStaffProfileMe() {
  try {
    const response = await apiClient.get(ENDPOINTS.STAFF.PROFILE_ME);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 9. POST /api/admin/staff/profile/me/initiate-password-reset
 * Initiate password reset for own profile (Sends OTP to current staff email)
 * @returns {Promise<Object>}
 */
export async function initiateOwnPasswordReset() {
  try {
    const response = await apiClient.post(
      ENDPOINTS.STAFF.PROFILE_INITIATE_PASSWORD_RESET
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 10. POST /api/admin/staff/profile/me/verify-password-reset
 * Verify OTP and reset own password
 * @param {Object} payload
 * @param {string} payload.otp
 * @param {string} payload.newPassword
 * @param {string} payload.confirmPassword
 * @returns {Promise<Object>}
 */
export async function verifyOwnPasswordReset({
  otp,
  newPassword,
  confirmPassword,
}) {
  try {
    const response = await apiClient.post(
      ENDPOINTS.STAFF.PROFILE_VERIFY_PASSWORD_RESET,
      { otp, newPassword, confirmPassword }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}
