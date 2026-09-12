import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";

/**
 * Public Storefront Product Labels & Filtered Products Service
 * Endpoints:
 * - GET /api/product-labels
 * - GET /api/product-labels/:slug
 * - GET /api/products/all?tags=:slug
 */

function unwrap(response) {
  return response?.data?.data || response?.data || {};
}

function normalizeStorefrontLabel(raw) {
  if (!raw || typeof raw !== "object") return null;
  const slug = String(raw.slug || "").trim();
  const storefronts = Array.isArray(raw.storefronts)
    ? raw.storefronts.map((s) => String(s || "").toLowerCase()).filter(Boolean)
    : ["ecomm", "wholesale"];

  return {
    _id: raw._id || raw.id || slug,
    id: raw._id || raw.id || slug,
    name: String(raw.name || "").trim(),
    slug,
    pagePath: String(raw.pagePath || "").trim() || (slug ? `/TagProducts/${slug}` : ""),
    description: String(raw.description || ""),
    sortOrder: Number.isFinite(Number(raw.sortOrder)) ? Number(raw.sortOrder) : 0,
    storefronts: storefronts.length ? storefronts : ["ecomm", "wholesale"],
    showInNav: raw.showInNav !== false,
    isActive: raw.isActive !== false,
    productCount: Number(raw.productCount) || 0,
  };
}

/**
 * 1. Get Storefront Marketing Labels for Navigation / Homepage
 * @param {Object} [options]
 * @param {boolean} [options.showInNavOnly=true] - Defaults to true (only showInNav: true labels)
 * @param {string} [options.storefront="ecomm"] - Header x-storefront ('ecomm' | 'wholesale')
 * @returns {Promise<{ success: boolean, storefront: string, count: number, labels: Array }>}
 */
export async function getStorefrontLabels({
  showInNavOnly = true,
  storefront = "ecomm",
} = {}) {
  try {
    const params = new URLSearchParams();
    if (!showInNavOnly) {
      params.set("showInNavOnly", "false");
    }
    const query = params.toString() ? `?${params.toString()}` : "";

    const response = await apiClient.get(`/product-labels${query}`, {
      headers: {
        "x-storefront": storefront,
      },
    });

    const data = unwrap(response);
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data.labels)
      ? data.labels
      : Array.isArray(data.data)
      ? data.data
      : [];

    const labels = rawList.map(normalizeStorefrontLabel).filter(Boolean);

    // Sort by sortOrder ascending
    labels.sort((a, b) => a.sortOrder - b.sortOrder);

    return {
      success: true,
      storefront: data.storefront || storefront,
      count: typeof data.count === "number" ? data.count : labels.length,
      labels,
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. Get Single Storefront Label by Slug
 * Inactive / wrong storefront returns 404 LABEL_NOT_FOUND
 * @param {string} slug - e.g. "rakhis-sale" or "today-arrival"
 * @param {Object} [options]
 * @param {string} [options.storefront="ecomm"]
 * @returns {Promise<{ success: boolean, storefront: string, label: Object }>}
 */
export async function getStorefrontLabelBySlug(slug, { storefront = "ecomm" } = {}) {
  const cleanSlug = String(slug || "").trim();
  if (!cleanSlug) {
    throw new Error("Label slug is required");
  }

  try {
    const response = await apiClient.get(`/product-labels/${encodeURIComponent(cleanSlug)}`, {
      headers: {
        "x-storefront": storefront,
      },
    });

    const data = unwrap(response);
    const rawLabel = data.label || data;
    const label = normalizeStorefrontLabel(rawLabel);

    if (!label) {
      throw new Error("Label not found");
    }

    return {
      success: true,
      storefront: data.storefront || storefront,
      label,
    };
  } catch (error) {
    const status = error?.response?.status;
    const errCode = error?.response?.data?.code || error?.response?.data?.error;
    if (status === 404 || errCode === "LABEL_NOT_FOUND") {
      const notFoundErr = new Error("Collection label not found or inactive.");
      notFoundErr.isNotFound = true;
      notFoundErr.code = "LABEL_NOT_FOUND";
      throw notFoundErr;
    }
    throw new Error(normalizeApiError(error));
  }
}

/**
 * Normalizes raw product object from API for Storefront presentation
 */
export function normalizeStorefrontProduct(raw) {
  if (!raw || typeof raw !== "object") return null;

  const v0 = Array.isArray(raw.variants) && raw.variants[0] ? raw.variants[0] : null;
  const imageUrl =
    raw.imageUrl ||
    (Array.isArray(raw.images) && raw.images[0]?.url) ||
    (Array.isArray(raw.images) && typeof raw.images[0] === "string" && raw.images[0]) ||
    v0?.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

  const price = Number(
    raw.price?.sellingPrice ??
    raw.price?.wholesalePrice ??
    raw.price?.b2bPrice ??
    raw.price ??
    raw.sellingPrice ??
    raw.basePrice ??
    raw.wholesalePrice ??
    0
  );

  const originalPrice = Number(
    raw.price?.mrp ??
    raw.mrp ??
    raw.originalPrice ??
    (price > 0 ? Math.round(price * 1.35) : 0)
  );

  const discountVal =
    originalPrice > price && price > 0
      ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`
      : raw.discount || "";

  const tags = Array.isArray(raw.tags)
    ? raw.tags
    : Array.isArray(raw.appliedTags)
    ? raw.appliedTags
    : [];

  return {
    _id: raw._id || raw.id || raw.slug,
    id: raw._id || raw.id || raw.slug,
    name: String(raw.name || raw.title || "Wholesale Product").trim(),
    slug: String(raw.slug || "").trim(),
    category: String(raw.category?.name || raw.category || "General"),
    description: String(raw.description || ""),
    price,
    originalPrice,
    mrp: originalPrice,
    discount: discountVal,
    imageUrl,
    images: Array.isArray(raw.images) ? raw.images : [imageUrl],
    rating: Number(raw.rating) || 4.8,
    reviewCount: Number(raw.reviewCount ?? raw.reviewsCount ?? raw.reviews?.length) || 32,
    moq: Number(raw.moq ?? raw.minOrderQuantity) || 1,
    inStock: raw.inStock !== false && (raw.inventory?.totalQuantity ?? raw.stock ?? 1) > 0,
    inventory: raw.inventory || { totalQuantity: 50 },
    tierPrices: raw.tierPrices || null,
    tags,
    appliedTags: tags,
    brand: raw.brand || "ApexMart Wholesale",
    isSale: tags.includes("on-sale") || tags.includes("mega-sale") || Boolean(raw.isSale),
    isNew: tags.includes("today-arrival") || tags.includes("just-arrived") || Boolean(raw.isNew),
  };
}

/**
 * 3. Fetch Products for a given Tag / Label
 * Endpoint: GET /api/products/all?tags=:slug&page=1&limit=12
 * @param {string|string[]} tags - e.g. "rakhis-sale" or ["on-sale", "rakhis-sale"]
 * @param {Object} [options]
 * @param {number} [options.page=1]
 * @param {number} [options.limit=12]
 * @param {string} [options.search=""]
 * @param {string} [options.category=""]
 * @param {string} [options.sort=""]
 * @param {string} [options.storefront="ecomm"]
 * @returns {Promise<{ products: Array, totalProducts: number, totalPages: number, page: number, limit: number, appliedTags: string[] }>}
 */
export async function getStorefrontProductsByTag(
  tags,
  {
    page = 1,
    limit = 12,
    search = "",
    category = "",
    sort = "",
    storefront = "ecomm",
  } = {}
) {
  try {
    const rawTagStr = Array.isArray(tags) ? tags.filter(Boolean).join(",") : String(tags || "").trim();
    // Normalize e.g. "on_sale" -> "on-sale"
    const normalizedTags = rawTagStr
      .split(",")
      .map((t) => t.trim().toLowerCase().replace(/_/g, "-"))
      .filter(Boolean)
      .join(",");

    const params = new URLSearchParams();
    if (normalizedTags) params.set("tags", normalizedTags);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    if (search) params.set("search", search.trim());
    if (category && category !== "all") params.set("category", category);
    if (sort) params.set("sort", sort);

    let data;
    try {
      // Primary public products catalog with tags
      const response = await apiClient.get(`/products/all?${params.toString()}`, {
        headers: { "x-storefront": storefront },
      });
      data = unwrap(response);
    } catch (err) {
      // Fallback: If search keyword is set, try /products/search
      if (search) {
        const searchResp = await apiClient.get(
          `/products/search?q=${encodeURIComponent(search)}&tags=${encodeURIComponent(normalizedTags)}&page=${page}&limit=${limit}`,
          { headers: { "x-storefront": storefront } }
        );
        data = unwrap(searchResp);
      } else {
        throw err;
      }
    }

    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data.products)
      ? data.products
      : Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.data)
      ? data.data
      : [];

    const products = rawList.map(normalizeStorefrontProduct).filter(Boolean);

    const totalProducts =
      typeof data.totalProducts === "number"
        ? data.totalProducts
        : typeof data.pagination?.total === "number"
        ? data.pagination.total
        : typeof data.total === "number"
        ? data.total
        : typeof data.count === "number"
        ? data.count
        : products.length;

    const totalPages =
      typeof data.totalPages === "number"
        ? data.totalPages
        : typeof data.pagination?.totalPages === "number"
        ? data.pagination.totalPages
        : totalProducts > 0
        ? Math.ceil(totalProducts / limit)
        : 1;

    return {
      products,
      totalProducts,
      totalPages,
      page: Number(page) || 1,
      limit: Number(limit) || 12,
      appliedTags: normalizedTags ? normalizedTags.split(",") : [],
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}
