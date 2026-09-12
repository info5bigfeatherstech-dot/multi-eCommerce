import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";

/**
 * Admin marketing labels (Today's Deal, On Sale, custom collections).
 * Backend: /api/admin/product-labels + PUT /api/admin/products/updateFlags
 */

function unwrap(response) {
  return response?.data?.data || response?.data || {};
}

function normalizeLabel(raw) {
  if (!raw || typeof raw !== "object") return null;
  const slug = String(raw.slug || "").trim();
  const storefronts = Array.isArray(raw.storefronts)
    ? raw.storefronts.map((s) => String(s || "").toLowerCase()).filter(Boolean)
    : ["ecomm", "wholesale"];
  return {
    ...raw,
    id: raw._id || raw.id || slug,
    name: String(raw.name || "").trim(),
    slug,
    pagePath: String(raw.pagePath || "").trim() || (slug ? `/TagProducts/${slug}` : ""),
    description: String(raw.description || ""),
    isActive: raw.isActive !== false,
    showInNav: raw.showInNav !== false,
    sortOrder: Number.isFinite(Number(raw.sortOrder)) ? Number(raw.sortOrder) : 0,
    storefronts: storefronts.length ? storefronts : ["ecomm", "wholesale"],
    isSystem: Boolean(raw.isSystem),
    productCount: Number(raw.productCount) || 0,
  };
}

function normalizeLabels(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.labels)
      ? payload.labels
      : Array.isArray(payload?.data)
        ? payload.data
        : [];
  return list.map(normalizeLabel).filter(Boolean);
}

export async function getAdminProductLabels({ activeOnly = false } = {}) {
  try {
    const query = activeOnly ? "?activeOnly=true" : "";
    const response = await apiClient.get(`/admin/product-labels${query}`);
    const data = unwrap(response);
    return {
      labels: normalizeLabels(data),
      count: Number(data.count) || normalizeLabels(data).length,
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function getAdminProductLabel(idOrSlug) {
  try {
    const key = String(idOrSlug || "").trim();
    if (!key) throw new Error("Label id or slug is required");
    const response = await apiClient.get(`/admin/product-labels/${encodeURIComponent(key)}`);
    const data = unwrap(response);
    const label = normalizeLabel(data.label || data);
    if (!label) throw new Error("Label not found");
    return label;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function createAdminProductLabel(payload) {
  try {
    const response = await apiClient.post("/admin/product-labels", payload);
    const data = unwrap(response);
    return {
      label: normalizeLabel(data.label || data),
      message: data.message || "Label created successfully",
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function updateAdminProductLabel(idOrSlug, payload) {
  try {
    const key = String(idOrSlug || "").trim();
    if (!key) throw new Error("Label id or slug is required");
    const response = await apiClient.put(
      `/admin/product-labels/${encodeURIComponent(key)}`,
      payload
    );
    const data = unwrap(response);
    return {
      label: normalizeLabel(data.label || data),
      slugMigrated: Boolean(data.slugMigrated),
      message: data.message || "Label updated successfully",
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function deleteAdminProductLabel(idOrSlug) {
  try {
    const key = String(idOrSlug || "").trim();
    if (!key) throw new Error("Label id or slug is required");
    const response = await apiClient.delete(`/admin/product-labels/${encodeURIComponent(key)}`);
    return unwrap(response);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * Assign or remove a label on one or more products (by product slug).
 */
export async function assignProductsToLabel({ slugs, flagType, value }) {
  try {
    const productSlugs = Array.isArray(slugs)
      ? [...new Set(slugs.map((s) => String(s || "").trim()).filter(Boolean))]
      : [];
    if (!productSlugs.length) throw new Error("Select at least one product");
    const labelSlug = String(flagType || "").trim();
    if (!labelSlug) throw new Error("Label slug is required");

    const response = await apiClient.put("/admin/products/updateFlags", {
      slugs: productSlugs,
      flagType: labelSlug,
      value: Boolean(value),
    });
    return unwrap(response);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export { normalizeLabel, normalizeLabels };
