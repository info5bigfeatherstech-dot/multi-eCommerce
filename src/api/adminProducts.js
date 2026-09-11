import { apiClient } from "./client.js";
import { buildFormData, normalizeApiError, downloadBlob } from "./helpers.js";

/**
 * Product Management, Variants & Archived Products Admin API Service
 */

// Keys that must always be serialized into JSON strings when building FormData
const PRODUCT_JSON_KEYS = [
  "shipping",
  "soldInfo",
  "variants",
  "attributes",
  "price",
  "inventory",
  "tierPrices",
  "channelVisibility",
];

/**
 * 1. Get All Products (Paginated & Filtered)
 * Endpoint: GET /admin/products/all?page=1&limit=50&search=&status=&category=
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=50]
 * @param {string} [params.search=""]
 * @param {string} [params.status=""]
 * @param {string} [params.category=""]
 * @returns {Promise<Object>}
 */
export async function getAllProducts({
  page = 1,
  limit = 50,
  search = "",
  status = "",
  category = "",
  ...rest
} = {}) {
  try {
    const query = new URLSearchParams();
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (category) query.set("category", category);

    Object.entries(rest).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        query.set(k, String(v));
      }
    });

    try {
      const response = await apiClient.get(`/admin/products/all?${query.toString()}`);
      return response.data?.data || response.data;
    } catch (adminErr) {
      const isAuthErr =
        adminErr?.response?.status === 401 ||
        adminErr?.response?.status === 403 ||
        adminErr?.response?.data?.code === "MISSING_AUTH_HEADER" ||
        adminErr?.message?.includes("401");

      if (isAuthErr) {
        // Fall back to live public products catalog endpoint so live database products are displayed
        if (search) {
          const searchResp = await apiClient.get(
            `/products/search?q=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
          );
          return searchResp.data?.data || searchResp.data;
        }
        const fallbackResp = await apiClient.get(`/products/all?${query.toString()}`);
        return fallbackResp.data?.data || fallbackResp.data;
      }
      throw adminErr;
    }
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. Get Product by Slug
 * Endpoint: GET /admin/products/:slug
 * @param {string} slug
 * @returns {Promise<Object>}
 */
export async function getProductBySlug(slug) {
  try {
    const response = await apiClient.get(`/admin/products/${encodeURIComponent(slug)}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 3. Create Product
 * Endpoint: POST /admin/products
 * Payload: multipart/form-data
 * Fields:
 *  - Text: name, title, description, category, brand, status ('draft'|'active'), isFeatured ('true'|'false'), hsnCode, gstRate
 *  - JSON Strings: shipping, soldInfo, variants (array of variant objects)
 *  - Files: images (product images), variantImages_0, etc.
 * @param {Object|FormData} productData
 * @returns {Promise<Object>}
 */
export async function createProduct(productData) {
  try {
    const payload =
      productData instanceof FormData
        ? productData
        : buildFormData(productData, { jsonKeys: PRODUCT_JSON_KEYS });

    const response = await apiClient.post("/admin/products", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 4. Update Product Details
 * Endpoint: PUT /admin/products/:slug
 * Payload: multipart/form-data (name, title, description, category, brand, status, gstRate, shipping JSON, attributes JSON, images, etc.)
 * @param {string} slug
 * @param {Object|FormData} productData
 * @returns {Promise<Object>}
 */
export async function updateProduct(slug, productData) {
  try {
    const payload =
      productData instanceof FormData
        ? productData
        : buildFormData(productData, { jsonKeys: PRODUCT_JSON_KEYS });

    const response = await apiClient.put(
      `/admin/products/${encodeURIComponent(slug)}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 5. Add Variant to Existing Product
 * Endpoint: POST /admin/products/:slug/variants
 * Payload: multipart/form-data (productCode, price JSON, inventory JSON, attributes JSON, variantImages files)
 * @param {string} slug
 * @param {Object|FormData} variantData
 * @returns {Promise<Object>}
 */
export async function addVariant(slug, variantData) {
  try {
    const payload =
      variantData instanceof FormData
        ? variantData
        : buildFormData(variantData, { jsonKeys: PRODUCT_JSON_KEYS });

    const response = await apiClient.post(
      `/admin/products/${encodeURIComponent(slug)}/variants`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 6. Update Existing Variant
 * Endpoint: PUT /admin/products/:slug with productCode in FormData along with updated price, inventory, etc.
 * @param {string} slug
 * @param {Object|FormData} variantData - Must contain productCode
 * @returns {Promise<Object>}
 */
export async function updateVariant(slug, variantData) {
  try {
    const payload =
      variantData instanceof FormData
        ? variantData
        : buildFormData(variantData, { jsonKeys: PRODUCT_JSON_KEYS });

    const response = await apiClient.put(
      `/admin/products/${encodeURIComponent(slug)}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 7. Delete Variant
 * Endpoint: DELETE /admin/products/:slug/variants
 * Body: { "productCode": "<productCode>" }
 * @param {string} slug
 * @param {string} productCode
 * @returns {Promise<Object>}
 */
export async function deleteVariant(slug, productCode) {
  try {
    const response = await apiClient.delete(
      `/admin/products/${encodeURIComponent(slug)}/variants`,
      {
        data: { productCode },
      }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 8. Bulk Update Product Status
 * Endpoint: PATCH /admin/products/bulk-status
 * Body: { "slugs": ["slug-1", "slug-2"], "channelStatus": { "ecomm": "active" } }
 * @param {Object} params
 * @param {string[]} params.slugs
 * @param {Record<string, string>} [params.channelStatus={ ecomm: "active" }]
 * @returns {Promise<Object>}
 */
export async function bulkUpdateProductStatus({ slugs, channelStatus = { ecomm: "active" } }) {
  try {
    const response = await apiClient.patch("/admin/products/bulk-status", {
      slugs,
      channelStatus,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 9. Bulk Update Product Flags (e.g., featured, trending)
 * Endpoint: PUT /admin/products/updateFlags
 * Body: { "slugs": ["slug-1"], "flagType": "trending", "value": true }
 * @param {Object} params
 * @param {string[]} params.slugs
 * @param {string} params.flagType - 'featured' | 'trending' | etc.
 * @param {boolean} params.value
 * @returns {Promise<Object>}
 */
export async function bulkUpdateProductFlags({ slugs, flagType, value }) {
  try {
    const response = await apiClient.put("/admin/products/updateFlags", {
      slugs,
      flagType,
      value: Boolean(value),
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/* ==========================================================================
   C. ARCHIVED PRODUCTS
   ========================================================================== */

/**
 * 10. List Archived Products
 * Endpoint: GET /admin/products/archived?page=1&limit=50&search=
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=50]
 * @param {string} [params.search=""]
 * @returns {Promise<Object>}
 */
export async function getArchivedProducts({ page = 1, limit = 50, search = "" } = {}) {
  try {
    const query = new URLSearchParams();
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));
    if (search) query.set("search", search);

    const response = await apiClient.get(
      `/admin/products/archived?${query.toString()}`
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 11. Archive Product (Soft Delete)
 * Endpoint: DELETE /admin/products/:slug
 * @param {string} slug
 * @returns {Promise<Object>}
 */
export async function archiveProduct(slug) {
  try {
    const response = await apiClient.delete(`/admin/products/${encodeURIComponent(slug)}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 12. Restore Archived Product
 * Endpoint: PATCH /admin/products/restore/:slug
 * @param {string} slug
 * @returns {Promise<Object>}
 */
export async function restoreProduct(slug) {
  try {
    const response = await apiClient.patch(
      `/admin/products/restore/${encodeURIComponent(slug)}`
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 13. Hard Delete Product (Permanent)
 * Endpoint: DELETE /admin/products/hard/:slug
 * @param {string} slug
 * @returns {Promise<Object>}
 */
export async function hardDeleteProduct(slug) {
  try {
    const response = await apiClient.delete(
      `/admin/products/hard/${encodeURIComponent(slug)}`
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 14. Bulk Restore Archived Products
 * Endpoint: PATCH /admin/products/bulk-status with { channelStatus: { ecomm: "active" } }
 * @param {string[]} slugs
 * @returns {Promise<Object>}
 */
export async function bulkRestoreProducts(slugs) {
  return bulkUpdateProductStatus({
    slugs,
    channelStatus: { ecomm: "active" },
  });
}

/**
 * 15. Bulk Hard Delete Archived Products
 * Endpoint: DELETE /admin/products/hard/:slug
 * @param {string[]} slugs
 * @returns {Promise<Object[]>}
 */
export async function bulkHardDeleteProducts(slugs) {
  const results = await Promise.allSettled(
    slugs.map((slug) => hardDeleteProduct(slug))
  );
  return results;
}

/**
 * 14. Download Bulk Upload Excel/CSV Template
 * Endpoint: GET /admin/products/bulk-upload-template
 * @returns {Promise<void>} Triggers browser download
 */
export async function downloadBulkUploadTemplate() {
  try {
    const response = await apiClient.get("/admin/products/bulk-upload-template", {
      responseType: "blob",
    });
    downloadBlob(
      response.data,
      "OWB-bulkUploadFormat-ForNewProducts.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 15. Preview Bulk Upload (CSV or ZIP+CSV)
 * Endpoint: POST /admin/products/preview-csv
 * @param {Object} files
 * @param {File} files.csvFile - CSV or Excel file
 * @param {File} [files.imagesZip] - Optional ZIP file of images
 * @returns {Promise<Object>}
 */
export async function previewBulkUpload({ csvFile, imagesZip, onUploadProgress } = {}) {
  try {
    const formData = new FormData();
    if (csvFile) formData.append("csvFile", csvFile);
    if (imagesZip) formData.append("imagesZip", imagesZip);

    const response = await apiClient.post("/admin/products/preview-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2-minute timeout for large files
      onUploadProgress: onUploadProgress
        ? (progressEvent) => {
            const pct = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            onUploadProgress(pct);
          }
        : undefined,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 16. Import Products from CSV (No ZIP)
 * Endpoint: POST /admin/products/import-csv
 * @param {File} csvFile
 * @returns {Promise<Object>}
 */
export async function importProductsFromCSV(csvFile, onUploadProgress) {
  try {
    const formData = new FormData();
    if (csvFile) formData.append("csvFile", csvFile);

    const response = await apiClient.post("/admin/products/import-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2-minute timeout for large imports
      onUploadProgress: onUploadProgress
        ? (progressEvent) => {
            const pct = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            onUploadProgress(pct);
          }
        : undefined,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 17. Bulk Upload New Products With Images (CSV + ZIP)
 * Endpoint: POST /admin/products/bulk-new-products
 * @param {Object} files
 * @param {File} files.csvFile
 * @param {File} files.imagesZip
 * @returns {Promise<Object>}
 */
export async function bulkUploadNewProductsWithImages({ csvFile, imagesZip, onUploadProgress } = {}) {
  try {
    const formData = new FormData();
    if (csvFile) formData.append("csvFile", csvFile);
    if (imagesZip) formData.append("imagesZip", imagesZip);

    const response = await apiClient.post("/admin/products/bulk-new-products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 300000, // 5-minute timeout for CSV + ZIP uploads
      onUploadProgress: onUploadProgress
        ? (progressEvent) => {
            const pct = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            onUploadProgress(pct);
          }
        : undefined,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 18. Export Products CSV
 * Endpoint: GET /admin/products/export-csv
 * @returns {Promise<void>}
 */
export async function exportProductsCSV() {
  try {
    const response = await apiClient.get("/admin/products/export-csv", {
      responseType: "blob",
    });
    downloadBlob(
      response.data,
      `products-export-${new Date().toISOString().split("T")[0]}.csv`,
      "text/csv"
    );
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export default {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  bulkUpdateProductStatus,
  bulkUpdateProductFlags,
  getArchivedProducts,
  archiveProduct,
  restoreProduct,
  hardDeleteProduct,
  downloadBulkUploadTemplate,
  previewBulkUpload,
  importProductsFromCSV,
  bulkUploadNewProductsWithImages,
  exportProductsCSV,
};
