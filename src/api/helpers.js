/**
 * API Helpers & Utilities
 * Provides multipart FormData builders, error normalization, and blob download utilities.
 */

/**
 * Normalizes error responses from Axios or network errors into clean, readable strings.
 * @param {any} error
 * @returns {string}
 */
export function normalizeApiError(error) {
  if (!error) return "An unexpected error occurred.";

  if (typeof error === "string") return error;

  // Backend structured error responses
  const data = error.response?.data;
  if (data) {
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) {
      return typeof data.error === "string" ? data.error : data.error.message || JSON.stringify(data.error);
    }
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map((e) => (typeof e === "string" ? e : e.message || e.msg)).join(", ");
    }
    if (data.detail) return data.detail;
  }

  // Axios network error
  if (error.message) {
    if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";
    if (error.message === "Network Error") return "Network error. Please check your internet connection.";
    return error.message;
  }

  return "Request failed. Please try again.";
}

/**
 * Checks if a value is a File or Blob instance.
 * @param {any} val
 * @returns {boolean}
 */
function isFileOrBlob(val) {
  if (typeof window === "undefined") return false;
  return val instanceof File || val instanceof Blob;
}

/**
 * Builds a FormData instance from a JavaScript object.
 * Supports:
 * - Direct file attachments
 * - Fields that need to be JSON-stringified (like `variants`, `shipping`, `soldInfo`, `attributes`)
 * - Array of files with dynamic key indices (e.g. `variantImages_0`, `images`)
 * - String booleans / numbers
 * 
 * @param {Record<string, any>} data - Source object
 * @param {Object} [options]
 * @param {string[]} [options.jsonKeys=[]] - List of keys that MUST be serialized using JSON.stringify
 * @returns {FormData}
 */
export function buildFormData(data = {}, options = {}) {
  const formData = new FormData();
  if (!data || typeof data !== "object") return formData;

  const jsonKeySet = new Set(options.jsonKeys || []);

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // 1. Specified JSON Keys: Always serialize to JSON string if not already a string
    if (jsonKeySet.has(key)) {
      if (typeof value === "string") {
        formData.append(key, value);
      } else {
        formData.append(key, JSON.stringify(value));
      }
      return;
    }

    // 2. Binary Files / Blobs
    if (isFileOrBlob(value)) {
      formData.append(key, value);
      return;
    }

    // 3. Arrays of Files or Values
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item === undefined || item === null) return;
        if (isFileOrBlob(item)) {
          // If images array, append under same key or indexed key based on server contract
          formData.append(key, item);
        } else if (typeof item === "object") {
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        } else {
          formData.append(key, String(item));
        }
      });
      return;
    }

    // 4. Objects that might be non-file (fallback to JSON string if object)
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    // 5. Booleans, numbers, strings
    formData.append(key, String(value));
  });

  return formData;
}

/**
 * Triggers a browser file download for a Blob response (e.g., zip, pdf, csv).
 * @param {Blob|ArrayBuffer} blobData
 * @param {string} defaultFilename
 * @param {string} [mimeType="application/zip"]
 */
export function downloadBlob(blobData, defaultFilename = "download.zip", mimeType = "application/zip") {
  if (typeof window === "undefined") return;

  const blob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: mimeType });
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.setAttribute("download", defaultFilename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  }, 200);
}

export default {
  normalizeApiError,
  buildFormData,
  downloadBlob,
};
