/**
 * Razorpay Payment Gateway Client Integration
 * Loads Razorpay script dynamically and manages the checkout modal lifecycle.
 */

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Dynamically load Razorpay SDK script if not already present on the page.
 * @returns {Promise<boolean>}
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Launch the Razorpay checkout modal.
 *
 * @param {Object} options
 * @param {Object} options.razorpayOrder - { id: string, amount: number (paise), currency: string }
 * @param {string} options.orderId - Internal order ID (e.g. "ORD-...")
 * @param {Object} [options.user] - Customer info for prefilling
 * @param {string} [options.keyId] - Razorpay Key ID
 * @param {Function} options.onPaymentSuccess - ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => void
 * @param {Function} [options.onPaymentDismiss] - () => void
 * @param {Function} [options.onError] - (error) => void
 */
export async function openRazorpayCheckout({
  razorpayOrder,
  orderId,
  user = {},
  keyId,
  onPaymentSuccess,
  onPaymentDismiss,
  onError,
}) {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      throw new Error("Razorpay payment gateway failed to load. Please check your internet connection.");
    }

    const resolvedKeyId =
      keyId ||
      import.meta.env?.VITE_RAZORPAY_KEY_ID ||
      "rzp_test_TJCuQuMjFKMgnW";

    if (!resolvedKeyId) {
      throw new Error("Razorpay Key ID is not configured.");
    }

    if (!razorpayOrder?.id || !razorpayOrder?.amount) {
      throw new Error("Invalid Razorpay order payload provided.");
    }

    const options = {
      key: resolvedKeyId,
      amount: razorpayOrder.amount, // in paise
      currency: razorpayOrder.currency || "INR",
      name: "ApexMart",
      description: `Payment for Order #${orderId}`,
      image: "/favicon.ico",
      order_id: razorpayOrder.id,
      prefill: {
        name: user?.name || user?.fullName || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      notes: {
        orderId,
      },
      theme: {
        color: "#ff6a38", // Brand accent color
      },
      handler: async function (response) {
        try {
          if (onPaymentSuccess) {
            await onPaymentSuccess(response);
          }
        } catch (err) {
          if (onError) onError(err);
        }
      },
      modal: {
        ondismiss: function () {
          if (onPaymentDismiss) onPaymentDismiss();
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (resp) {
      const err = new Error(resp.error?.description || "Payment failed or was declined by your bank.");
      err.details = resp.error;
      if (onError) onError(err);
    });

    rzp.open();
  } catch (error) {
    console.error("Razorpay checkout initialization error:", error);
    if (onError) onError(error);
  }
}

export default {
  loadRazorpayScript,
  openRazorpayCheckout,
};
