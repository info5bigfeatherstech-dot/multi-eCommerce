import { apiClient } from "./client.js";
import { normalizeApiError, downloadBlob } from "./helpers.js";

/**
 * Enterprise Order Management System (OMS) & Fulfillment API Service
 * Supports courier fulfillment integrations (Shiprocket, Shipmozo) and full order lifecycle.
 */

// ── Business Logic Gates & Normalization Helpers ──

/**
 * Payment Gate Verification:
 * An order can ONLY be confirmed or shipped if carrierPaymentReady is true:
 *  - Payment method is COD, OR
 *  - paymentStatus is 'paid', OR
 *  - splitMode is 'advance' and the advance payment is verified (amountPaidInr > 0).
 */
export function isCarrierPaymentReady(order) {
  if (!order) return false;

  const method = (order.paymentInfo?.method || order.paymentMethod || "").toLowerCase();
  const paymentStatus = (order.paymentStatus || "").toLowerCase();
  const splitMode = (order.paymentInfo?.splitMode || "").toLowerCase();
  const amountPaidInr = Number(order.paymentInfo?.amountPaidInr || 0);

  if (method.includes("cod") || method.includes("cash on delivery")) {
    return true;
  }
  if (paymentStatus === "paid") {
    return true;
  }
  if (splitMode === "advance" && amountPaidInr > 0) {
    return true;
  }

  return false;
}

/**
 * Modification Gate:
 * An order can only have its address or items edited while in 'pending' status.
 * Once confirmed or beyond, modifications are locked.
 */
export function canEditPendingOrder(order) {
  if (!order) return false;
  const status = (order.orderStatus || "").toLowerCase();
  return status === "pending";
}

/**
 * Maps OMS tab buckets to internal status categories
 */
export const BUCKET_STATUS_MAP = {
  new: { label: "Pending", statuses: ["pending"] },
  bill_sent: { label: "Confirmed", statuses: ["confirmed"] },
  ready_to_ship: { label: "Ready to Ship", statuses: ["ready_to_ship"] },
  ready_to_pick: { label: "Processing", statuses: ["processing"] },
  in_transit: { label: "In Transit", statuses: ["shipped", "out_for_delivery"] },
  completed: { label: "Delivered", statuses: ["delivered"] },
  rto: { label: "RTO", statuses: ["return_requested", "rto"] },
  others: { label: "Cancelled", statuses: ["cancelled", "payment_failed"] },
};

/**
 * Cleans order ID by removing leading '#' symbols and whitespace so it doesn't break URL paths as a fragment identifier.
 */
export function cleanOrderId(orderId) {
  if (!orderId) return "";
  return encodeURIComponent(String(orderId).replace(/^#+/, "").trim());
}

// ── 1. Operations & Summary Endpoints ──

/**
 * GET /admin/orders/summary?rangePreset=last30&from=&to=
 */
export async function getOrderSummary({ rangePreset = "last30", from = "", to = "" } = {}) {
  try {
    const params = { rangePreset };
    if (from) params.from = from;
    if (to) params.to = to;

    const response = await apiClient.get("/admin/orders/summary", { params });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * GET /admin/orders?bucket=new&page=1&limit=20&search=
 */
export async function getOrders({ bucket = "new", page = 1, limit = 20, search = "" } = {}) {
  try {
    const params = {
      bucket,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    };
    if (search?.trim()) params.search = search.trim();

    const response = await apiClient.get("/admin/orders", { params });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /admin/orders/auto-sync-statuses
 */
export async function autoSyncStatuses() {
  try {
    const response = await apiClient.post("/admin/orders/auto-sync-statuses");
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

// ── 2. Single Order Operations ──

/**
 * GET /orders/items/:orderId
 */
export async function getOrderItem(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.get(`/orders/items/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * GET /orders/items/:orderId/track
 */
export async function trackOrder(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.get(`/orders/items/${id}/track`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * GET /orders/admin/items/:orderId/invoice-html
 */
export async function getOrderInvoiceHtml(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.get(`/orders/admin/items/${id}/invoice-html`);
    return response.data?.html || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * GET /orders/admin/items/:orderId/address-intelligence
 */
export async function getOrderAddressIntelligence(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.get(`/orders/admin/items/${id}/address-intelligence`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /orders/admin/items/:orderId/edit-pending-address/preview
 */
export async function previewEditPendingAddress(orderId, addressData) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/edit-pending-address/preview`,
      addressData
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /orders/admin/items/:orderId/edit-pending-address
 */
export async function editPendingAddress(orderId, addressData) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/edit-pending-address`,
      addressData
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /orders/admin/items/:orderId/edit-pending/preview
 */
export async function previewEditPendingItems(orderId, itemsData) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/edit-pending/preview`,
      itemsData
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /orders/admin/items/:orderId/edit-pending
 */
export async function editPendingItems(orderId, itemsData) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/edit-pending`,
      itemsData
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

// ── 3. Fulfillment & Logistics Endpoints ──

/**
 * POST /orders/admin/items/:orderId/fulfillment/ensure-shipment
 */
export async function ensureShipment(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/fulfillment/ensure-shipment`
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /orders/admin/items/:orderId/fulfillment/assign-ship
 * @param {string} orderId
 * @param {Object} payload - { courierId, confirmSubstitute }
 */
export async function assignShipment(orderId, { courierId, confirmSubstitute = false } = {}) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/fulfillment/assign-ship`,
      { courierId, confirmSubstitute }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * GET /orders/admin/fulfillment/pickup-calendar?daysAhead=45
 */
export async function getPickupCalendar(daysAhead = 45) {
  try {
    const response = await apiClient.get("/orders/admin/fulfillment/pickup-calendar", {
      params: { daysAhead: Number(daysAhead) || 45 },
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /orders/admin/items/:orderId/fulfillment/schedule-pickup
 * @param {string} orderId
 * @param {Object} payload - { pickupDate }
 */
export async function schedulePickup(orderId, { pickupDate } = {}) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/fulfillment/schedule-pickup`,
      { pickupDate }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /orders/admin/items/:orderId/fulfillment/sync-shiprocket
 */
export async function syncShiprocket(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/fulfillment/sync-shiprocket`
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /orders/admin/items/:orderId/fulfillment/manifest
 */
export async function generateManifest(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/fulfillment/manifest`
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /orders/admin/items/:orderId/fulfillment/shipping-label
 */
export async function generateShippingLabel(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/fulfillment/shipping-label`
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * GET /orders/admin/items/:orderId/fulfillment/shipping-label-file (PDF stream)
 */
export async function downloadShippingLabelFile(orderId, filename) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.get(
      `/orders/admin/items/${id}/fulfillment/shipping-label-file`,
      {
        responseType: "blob",
        headers: { Accept: "application/pdf, */*" },
      }
    );
    const blob = new Blob([response.data], { type: "application/pdf" });
    const targetFilename = filename || `shipping_label_${id}.pdf`;
    downloadBlob(blob, targetFilename, "application/pdf");
    return blob;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * GET /orders/admin/items/:orderId/fulfillment/manifest-file (PDF stream)
 */
export async function downloadManifestFile(orderId, filename) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.get(
      `/orders/admin/items/${id}/fulfillment/manifest-file`,
      {
        responseType: "blob",
        headers: { Accept: "application/pdf, */*" },
      }
    );
    const blob = new Blob([response.data], { type: "application/pdf" });
    const targetFilename = filename || `manifest_${id}.pdf`;
    downloadBlob(blob, targetFilename, "application/pdf");
    return blob;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /orders/admin/items/:orderId/fulfillment/cancel-shipment
 */
export async function cancelShipment(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/fulfillment/cancel-shipment`
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * POST /orders/admin/items/:orderId/fulfillment/retry-pickup
 */
export async function retryPickup(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/items/${id}/fulfillment/retry-pickup`
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

// ── 4. Bulk Operations ──

export async function bulkConfirmOrders(orderIds) {
  try {
    const ids = Array.isArray(orderIds) ? orderIds : [orderIds];
    const response = await apiClient.post(
      "/orders/admin/items/bulk-approval/confirm",
      { orderIds: ids }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function bulkCancelOrders(orderIds, reason = "") {
  try {
    const ids = Array.isArray(orderIds) ? orderIds : [orderIds];
    const payload = { orderIds: ids };
    if (reason) payload.reason = reason;

    const response = await apiClient.post(
      "/orders/admin/items/bulk-approval/cancel",
      payload
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function bulkShipNow(orderIds) {
  try {
    const ids = Array.isArray(orderIds) ? orderIds : [orderIds];
    const response = await apiClient.post(
      "/orders/admin/items/bulk-fulfillment/ship-now",
      { orderIds: ids }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function bulkSchedulePickup(orderIds, pickupDate) {
  try {
    const ids = Array.isArray(orderIds) ? orderIds : [orderIds];
    const response = await apiClient.post(
      "/orders/admin/items/bulk-fulfillment/schedule-pickup",
      {
        orderIds: ids,
        pickupDate: pickupDate || new Date().toISOString().split("T")[0],
      }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function bulkSyncShiprocket(orderIds) {
  try {
    const ids = Array.isArray(orderIds) ? orderIds : [orderIds];
    const response = await apiClient.post(
      "/orders/admin/items/bulk-fulfillment/sync-shiprocket",
      { orderIds: ids }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

async function downloadDocumentZip(
  endpoint,
  orderIds,
  { concurrency = 4, filename = "documents.zip", autoDownload = true } = {}
) {
  try {
    const ids = Array.isArray(orderIds) ? orderIds : [orderIds];
    const response = await apiClient.post(
      endpoint,
      {
        orderIds: ids,
        concurrency: Number(concurrency) || 4,
      },
      {
        responseType: "blob",
        headers: {
          Accept: "application/zip, application/octet-stream, */*",
        },
      }
    );

    const blob = new Blob([response.data], { type: "application/zip" });
    if (autoDownload) {
      downloadBlob(blob, filename, "application/zip");
    }
    return blob;
  } catch (error) {
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        throw new Error(json.message || json.error || "Failed to download zip document.");
      } catch (parseErr) {
        // Fall back
      }
    }
    throw new Error(normalizeApiError(error));
  }
}

export async function bulkDownloadTaxInvoices(orderIds, options = {}) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const defaultFilename = `tax_invoices_${timestamp}.zip`;
  return downloadDocumentZip(
    "/orders/admin/items/bulk-documents/tax-invoices-zip",
    orderIds,
    { filename: options.filename || defaultFilename, ...options }
  );
}

export async function bulkDownloadShippingLabels(orderIds, options = {}) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const defaultFilename = `shipping_labels_${timestamp}.zip`;
  return downloadDocumentZip(
    "/orders/admin/items/bulk-documents/shipping-labels-zip",
    orderIds,
    { filename: options.filename || defaultFilename, ...options }
  );
}

export async function bulkDownloadManifests(orderIds, options = {}) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const defaultFilename = `manifests_${timestamp}.zip`;
  return downloadDocumentZip(
    "/orders/admin/items/bulk-documents/manifests-zip",
    orderIds,
    { filename: options.filename || defaultFilename, ...options }
  );
}

// ── 5. Returns & Refunds Endpoints ──

export async function getReturnRequests({ page = 1, status = "" } = {}) {
  try {
    const params = { page: Number(page) || 1 };
    if (status) params.status = status;
    const response = await apiClient.get("/orders/admin/returns/requests", { params });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function getReturnRequest(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.get(`/orders/admin/returns/requests/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function decideReturnRequest(orderId, { decision, decisionReason = "", customerRequest = "" }) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/returns/requests/${id}/decision`,
      { decision, decisionReason, customerRequest }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function refundReturnRequest(orderId, refundData = {}) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/returns/requests/${id}/refund`,
      refundData
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function getReturnChat(orderId) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.get(`/orders/admin/returns/requests/${id}/chat`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function sendReturnChat(orderId, message) {
  try {
    const id = cleanOrderId(orderId);
    const response = await apiClient.post(
      `/orders/admin/returns/requests/${id}/chat`,
      { message }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export default {
  isCarrierPaymentReady,
  canEditPendingOrder,
  BUCKET_STATUS_MAP,
  getOrderSummary,
  getOrders,
  autoSyncStatuses,
  getOrderItem,
  trackOrder,
  getOrderInvoiceHtml,
  getOrderAddressIntelligence,
  previewEditPendingAddress,
  editPendingAddress,
  previewEditPendingItems,
  editPendingItems,
  ensureShipment,
  assignShipment,
  getPickupCalendar,
  schedulePickup,
  syncShiprocket,
  generateManifest,
  generateShippingLabel,
  downloadShippingLabelFile,
  downloadManifestFile,
  cancelShipment,
  retryPickup,
  bulkConfirmOrders,
  bulkCancelOrders,
  bulkShipNow,
  bulkSchedulePickup,
  bulkSyncShiprocket,
  bulkDownloadTaxInvoices,
  bulkDownloadShippingLabels,
  bulkDownloadManifests,
  getReturnRequests,
  getReturnRequest,
  decideReturnRequest,
  refundReturnRequest,
  getReturnChat,
  sendReturnChat,
};
