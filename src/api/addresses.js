import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * Address CRUD API Module (Ecomm & Wholesale)
 * Handles address listing, creation, partial updates, deletion, default address toggling,
 * and client-side courier length validation (<= 190 characters).
 */

/**
 * Courier Address Calculation Rule:
 * line1 = houseNumber, building, floor, addressLine1
 * line2 = addressLine2, area, landmark
 * Combined length of line1 + line2 must be <= 190 characters,
 * or API returns COURIER_ADDRESS_TOO_LONG.
 *
 * @param {Object} address
 * @returns {{ line1: string, line2: string, combinedLength: number, maxLength: number, isTooLong: boolean, remaining: number }}
 */
export function calculateCourierLengths(address = {}) {
  const line1Parts = [
    address.houseNumber?.trim(),
    address.building?.trim(),
    address.floor ? `Floor ${address.floor}`.trim() : null,
    address.addressLine1?.trim(),
  ].filter(Boolean);

  const line2Parts = [
    address.addressLine2?.trim(),
    address.area?.trim(),
    address.landmark?.trim(),
  ].filter(Boolean);

  const line1 = line1Parts.join(", ");
  const line2 = line2Parts.join(", ");
  const combinedLength = line1.length + line2.length;
  const maxLength = 190;

  return {
    line1,
    line2,
    combinedLength,
    maxLength,
    isTooLong: combinedLength > maxLength,
    remaining: Math.max(0, maxLength - combinedLength),
  };
}

/**
 * Validate address fields client-side before sending to server.
 * Ensures fast feedback and matches server-side rules.
 *
 * @param {Object} address
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateAddress(address = {}) {
  const errors = {};

  if (!address.fullName || !address.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  // 10-digit Indian phone number
  const cleanPhone = (address.phone || "").replace(/\D/g, "");
  if (!cleanPhone) {
    errors.phone = "Phone number is required.";
  } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    errors.phone = "Phone must be a valid 10-digit Indian mobile number.";
  }

  if (!address.houseNumber || !address.houseNumber.trim()) {
    errors.houseNumber = "House / Flat / Shop number is required.";
  }

  const line1 = (address.addressLine1 || "").trim();
  if (!line1) {
    errors.addressLine1 = "Address Line 1 is required.";
  } else if (line1.length < 10) {
    errors.addressLine1 = "Address Line 1 must be at least 10 characters.";
  } else if (line1.length > 120) {
    errors.addressLine1 = "Address Line 1 cannot exceed 120 characters.";
  }

  if (!address.city || !address.city.trim()) {
    errors.city = "City is required.";
  }

  if (!address.state || !address.state.trim()) {
    errors.state = "State is required.";
  }

  const cleanPin = (address.postalCode || "").replace(/\D/g, "");
  if (!cleanPin) {
    errors.postalCode = "Postal PIN code is required.";
  } else if (!/^\d{6}$/.test(cleanPin)) {
    errors.postalCode = "PIN code must be exactly 6 digits.";
  }

  // Courier length rule check
  const courier = calculateCourierLengths(address);
  if (courier.isTooLong) {
    errors.courierLength = `Combined courier address length (${courier.combinedLength} chars) exceeds the maximum limit of 190 characters.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 1. List Addresses
 * GET /api/addresses
 * Scope defaults to 'ecomm'.
 *
 * Returns:
 * {
 *   success: true,
 *   count: number,
 *   scope: "ecomm",
 *   defaultAddress: { ... } | null,
 *   addresses: [ ... non-default addresses ... ]
 * }
 *
 * @param {{ storefront?: string }} [options]
 */
export async function getAddresses({ storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.get(ENDPOINTS.ADDRESSES.LIST, {
      headers: {
        "x-storefront": storefront,
      },
    });

    const data = response.data || {};
    const defaultAddress = data.defaultAddress || null;
    const addresses = Array.isArray(data.addresses) ? data.addresses : [];
    const count = typeof data.count === "number" ? data.count : (defaultAddress ? 1 : 0) + addresses.length;

    // Combined helper list with default first
    const allAddresses = defaultAddress ? [defaultAddress, ...addresses] : addresses;

    return {
      success: true,
      count,
      scope: data.scope || storefront,
      defaultAddress,
      addresses,
      allAddresses,
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. Create Address
 * POST /api/addresses
 *
 * Handles both 201 (Created) and 200 (Duplicate detected).
 * Duplicate create returns 200 with existing address; treated gracefully.
 *
 * @param {Object} addressData
 * @param {{ storefront?: string }} [options]
 */
export async function createAddress(addressData, { storefront = "ecomm" } = {}) {
  try {
    // Sanitize phone and postalCode
    const payload = {
      ...addressData,
      phone: addressData.phone ? String(addressData.phone).replace(/\D/g, "").slice(-10) : "",
      postalCode: addressData.postalCode ? String(addressData.postalCode).replace(/\D/g, "").slice(0, 6) : "",
      country: addressData.country || "India",
      addressType: addressData.addressType || "home",
      isDefault: Boolean(addressData.isDefault),
      isGift: Boolean(addressData.isGift),
      deliveryInstructions: addressData.deliveryInstructions || "",
    };

    const response = await apiClient.post(ENDPOINTS.ADDRESSES.CREATE, payload, {
      headers: {
        "x-storefront": storefront,
      },
    });

    const isDuplicate = response.status === 200 && response.data?.message?.includes("already exists");

    return {
      success: true,
      isDuplicate,
      message: response.data?.message || (isDuplicate ? "Address already exists" : "Address added successfully"),
      address: response.data?.address || response.data?.data || null,
    };
  } catch (error) {
    const norm = normalizeApiError(error);
    const backendErrors = error.response?.data?.errors;
    const errObj = new Error(norm);
    errObj.code = error.response?.data?.code;
    errObj.errors = backendErrors;
    throw errObj;
  }
}

/**
 * 3. Update Address
 * PUT /api/addresses/:id
 * Partial updates allowed. Cannot change userId / storefront (stripped if sent).
 *
 * @param {string} id
 * @param {Object} partialData
 * @param {{ storefront?: string }} [options]
 */
export async function updateAddress(id, partialData, { storefront = "ecomm" } = {}) {
  if (!id) throw new Error("Address ID is required for update.");

  try {
    // Strip forbidden fields
    const { userId, storefront: _sf, _id, createdAt, updatedAt, ...cleanPayload } = partialData;

    if (cleanPayload.phone) {
      cleanPayload.phone = String(cleanPayload.phone).replace(/\D/g, "").slice(-10);
    }
    if (cleanPayload.postalCode) {
      cleanPayload.postalCode = String(cleanPayload.postalCode).replace(/\D/g, "").slice(0, 6);
    }

    const response = await apiClient.put(ENDPOINTS.ADDRESSES.UPDATE(id), cleanPayload, {
      headers: {
        "x-storefront": storefront,
      },
    });

    return {
      success: true,
      message: response.data?.message || "Address updated successfully",
      address: response.data?.address || response.data?.data || null,
    };
  } catch (error) {
    const norm = normalizeApiError(error);
    const errObj = new Error(norm);
    errObj.code = error.response?.data?.code;
    errObj.status = error.response?.status;
    throw errObj;
  }
}

/**
 * 4. Set Address As Default
 * PUT /api/addresses/:id with { isDefault: true }
 * Server clears other defaults automatically.
 *
 * @param {string} id
 * @param {{ storefront?: string }} [options]
 */
export async function setAddressAsDefault(id, { storefront = "ecomm" } = {}) {
  return updateAddress(id, { isDefault: true }, { storefront });
}

/**
 * 5. Delete Address
 * DELETE /api/addresses/:id
 * Server automatically promotes newest remaining address to default if deleted was default.
 *
 * @param {string} id
 * @param {{ storefront?: string }} [options]
 */
export async function deleteAddress(id, { storefront = "ecomm" } = {}) {
  if (!id) throw new Error("Address ID is required for deletion.");

  try {
    const response = await apiClient.delete(ENDPOINTS.ADDRESSES.DELETE(id), {
      headers: {
        "x-storefront": storefront,
      },
    });

    return {
      success: true,
      message: response.data?.message || "Address deleted successfully",
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export default {
  calculateCourierLengths,
  validateAddress,
  getAddresses,
  createAddress,
  updateAddress,
  setAddressAsDefault,
  deleteAddress,
};
