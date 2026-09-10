import { apiClient } from "./client.js";
import { buildFormData, normalizeApiError } from "./helpers.js";

/**
 * Category Management Admin API Service
 */

/**
 * Recursively or flatly sort categories by their `order` property.
 * @param {Array} list
 * @returns {Array}
 */
function sortCategoriesByOrder(list) {
  if (!Array.isArray(list)) return [];
  const sorted = [...list].sort((a, b) => {
    const orderA = typeof a.order === "number" ? a.order : 0;
    const orderB = typeof b.order === "number" ? b.order : 0;
    return orderA - orderB;
  });

  return sorted.map((cat) => {
    if (Array.isArray(cat.children) && cat.children.length > 0) {
      return {
        ...cat,
        children: sortCategoriesByOrder(cat.children),
      };
    }
    return cat;
  });
}

/**
 * Normalizes backend categories response into a standardized list.
 * @param {any} data
 * @returns {Array}
 */
function normalizeCategoriesResponse(data) {
  if (!data) return [];
  if (Array.isArray(data)) return sortCategoriesByOrder(data);
  if (Array.isArray(data.categories)) return sortCategoriesByOrder(data.categories);
  if (Array.isArray(data.data)) return sortCategoriesByOrder(data.data);
  if (Array.isArray(data.items)) return sortCategoriesByOrder(data.items);
  return [];
}

/**
 * 1. Get All Categories
 * Endpoint: GET /categories/admin/categories
 * Returns full category tree/flat list. Normalizes response and sorts by `order`.
 * @returns {Promise<Array>}
 */
export async function getAllCategories() {
  try {
    const response = await apiClient.get("/categories/admin/categories");
    return normalizeCategoriesResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. Create Category
 * Endpoint: POST /categories/admin/categories
 * Payload: multipart/form-data
 * Fields: name (string, required), description, parent, status, order, image (file, max 5MB), bannerImage (file, max 20MB).
 * @param {Object|FormData} categoryData
 * @returns {Promise<Object>}
 */
export async function createCategory(categoryData) {
  try {
    const payload =
      categoryData instanceof FormData
        ? categoryData
        : buildFormData(categoryData);

    const response = await apiClient.post("/categories/admin/categories", payload, {
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
 * 3. Update Category
 * Endpoint: PUT /categories/admin/categories/:id
 * Payload: multipart/form-data
 * Fields: Same as create, plus optional clearImage: "true" and clearBannerImage: "true".
 * @param {string|number} id
 * @param {Object|FormData} categoryData
 * @returns {Promise<Object>}
 */
export async function updateCategory(id, categoryData) {
  try {
    const payload =
      categoryData instanceof FormData
        ? categoryData
        : buildFormData(categoryData);

    const response = await apiClient.put(`/categories/admin/categories/${id}`, payload, {
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
 * 4. Hard Delete Category
 * Endpoint: DELETE /categories/admin/categories/:id/hard
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function hardDeleteCategory(id) {
  try {
    const response = await apiClient.delete(`/categories/admin/categories/${id}/hard`);
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 5. Reorder Categories
 * Endpoint: POST /categories/admin/categories/reorder
 * Body: { "categories": [{ "id": "<id>", "order": 0 }] }
 * @param {Array<{ id: string|number, order: number }>} categoriesList
 * @returns {Promise<Object>}
 */
export async function reorderCategories(categoriesList) {
  try {
    const payload = Array.isArray(categoriesList)
      ? { categories: categoriesList }
      : categoriesList;

    const response = await apiClient.post("/categories/admin/categories/reorder", payload);
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 6. Toggle Visibility
 * Endpoint: PATCH /categories/admin/categories/:id/toggle-visibility
 * Body: { "isHidden": boolean }
 * @param {string|number} id
 * @param {boolean} isHidden
 * @returns {Promise<Object>}
 */
export async function toggleCategoryVisibility(id, isHidden) {
  try {
    const response = await apiClient.patch(
      `/categories/admin/categories/${id}/toggle-visibility`,
      { isHidden: Boolean(isHidden) }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 7. Toggle Moving Fast
 * Endpoint: PATCH /categories/admin/categories/:id/toggle-moving-fast
 * Body: { "showInMovingFast": boolean }
 * @param {string|number} id
 * @param {boolean} showInMovingFast
 * @returns {Promise<Object>}
 */
export async function toggleCategoryMovingFast(id, showInMovingFast) {
  try {
    const response = await apiClient.patch(
      `/categories/admin/categories/${id}/toggle-moving-fast`,
      { showInMovingFast: Boolean(showInMovingFast) }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  hardDeleteCategory,
  reorderCategories,
  toggleCategoryVisibility,
  toggleCategoryMovingFast,
};
