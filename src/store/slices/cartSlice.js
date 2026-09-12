import { createSlice } from "@reduxjs/toolkit";

const GUEST_CART_KEY = "apexmart_guest_cart";

// Load initial cart from localStorage if available
function loadInitialCart() {
  if (typeof window === "undefined") {
    return {
      items: [],
      totalCount: 0,
      totalAmount: 0,
      totalOriginalAmount: 0,
      totalDiscount: 0,
      totalDiscountPercentage: 0,
    };
  }
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.items)) {
        return {
          items: parsed.items,
          totalCount: parsed.totalCount || parsed.items.reduce((s, i) => s + (i.quantity || 1), 0),
          totalAmount: parsed.totalAmount || parsed.items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0),
          totalOriginalAmount: parsed.totalOriginalAmount || parsed.totalAmount || 0,
          totalDiscount: parsed.totalDiscount || 0,
          totalDiscountPercentage: parsed.totalDiscountPercentage || 0,
        };
      }
    }
  } catch (e) {
    console.error("Failed reading guest cart from storage:", e);
  }

  return {
    items: [],
    totalCount: 0,
    totalAmount: 0,
    totalOriginalAmount: 0,
    totalDiscount: 0,
    totalDiscountPercentage: 0,
  };
}

function saveGuestCart(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      GUEST_CART_KEY,
      JSON.stringify({
        items: state.items,
        totalCount: state.totalCount,
        totalAmount: state.totalAmount,
        totalOriginalAmount: state.totalOriginalAmount,
        totalDiscount: state.totalDiscount,
        totalDiscountPercentage: state.totalDiscountPercentage,
      })
    );
  } catch (e) {
    console.error("Failed saving guest cart:", e);
  }
}

const initialState = loadInitialCart();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartFromApi: (state, action) => {
      const apiCart = action.payload?.cart || action.payload || {};
      const rawItems = Array.isArray(apiCart.items) ? apiCart.items : [];

      state.items = rawItems.map((line) => {
        const product = line.product || {};
        const variant = product.variants?.find((v) => v._id === line.variantId) || {};
        const unitPrice =
          line.price?.current ??
          line.price?.sale ??
          variant.finalPrice ??
          variant.price?.sale ??
          line.price?.base ??
          product.price ??
          0;

        return {
          id: line._id || line.productId || product._id,
          lineId: line._id,
          productId: line.productId || product._id,
          variantId: line.variantId,
          slug: product.slug,
          name: product.name || line.name || "Product",
          price: unitPrice,
          originalPrice: line.price?.base || variant.price?.base || unitPrice,
          quantity: line.quantity || 1,
          imageUrl: variant.images?.[0] || product.images?.[0] || line.imageUrl || "",
          total: line.total || unitPrice * (line.quantity || 1),
          discountPercentage: line.price?.discountPercentage || variant.price?.discountPercentage || 0,
          sku: variant.sku || "",
        };
      });

      state.totalCount = state.items.reduce((s, i) => s + i.quantity, 0);
      state.totalAmount = apiCart.totalAmount ?? state.items.reduce((s, i) => s + i.price * i.quantity, 0);
      state.totalOriginalAmount = apiCart.totalOriginalAmount ?? state.totalAmount;
      state.totalDiscount = apiCart.totalDiscount ?? 0;
      state.totalDiscountPercentage = apiCart.totalDiscountPercentage ?? 0;

      saveGuestCart(state);
    },

    addItem: (state, action) => {
      const payload = action.payload || {};
      const variantId =
        payload.variantId ||
        payload.variant?._id ||
        payload.variants?.[0]?._id ||
        payload.defaultVariantId ||
        "6a8e72d3e556a1a6d944daee";
      const productId =
        (payload._id && typeof payload._id === "string" && payload._id.length === 24)
          ? payload._id
          : (payload.productId && typeof payload.productId === "string" && payload.productId.length === 24)
          ? payload.productId
          : (typeof payload.id === "string" && payload.id.length === 24)
          ? payload.id
          : "6a8e72d3e556a1a6d944daed";
      const id = `${productId}_${variantId}`;

      const existing = state.items.find(
        (i) =>
          i.id === id ||
          (i.productId === productId && i.variantId === variantId) ||
          (payload.id && (i.id === payload.id || i.productId === payload.id)) ||
          (payload.slug && i.slug && i.slug === payload.slug)
      );

      const addQty = payload.quantity || 1;
      const price = payload.price || 0;

      if (existing) {
        existing.quantity += addQty;
        if (!existing.variantId) existing.variantId = variantId;
        if (!existing.productId || existing.productId.length !== 24) existing.productId = productId;
      } else {
        state.items.push({
          id,
          lineId: payload.lineId || id,
          productId,
          variantId,
          slug: payload.slug || payload.productSlug || "",
          name: payload.name || payload.title || "Product",
          price,
          quantity: addQty,
          imageUrl: payload.imageUrl || payload.image || "",
        });
      }

      state.totalCount += addQty;
      state.totalAmount += price * addQty;
      state.totalOriginalAmount = state.totalAmount;
      saveGuestCart(state);
    },

    decrementItem: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id || i.productId === id || i.lineId === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          state.totalCount -= 1;
          state.totalAmount -= item.price;
        } else {
          const index = state.items.findIndex((i) => i.id === id || i.productId === id || i.lineId === id);
          if (index !== -1) {
            state.totalCount -= item.quantity;
            state.totalAmount -= item.price * item.quantity;
            state.items.splice(index, 1);
          }
        }
        saveGuestCart(state);
      }
    },

    removeItem: (state, action) => {
      const id = action.payload;
      const index = state.items.findIndex((i) => i.id === id || i.productId === id || i.lineId === id);
      if (index !== -1) {
        const item = state.items[index];
        state.totalCount -= item.quantity;
        state.totalAmount -= item.price * item.quantity;
        state.items.splice(index, 1);
        saveGuestCart(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.totalAmount = 0;
      state.totalOriginalAmount = 0;
      state.totalDiscount = 0;
      state.totalDiscountPercentage = 0;
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(GUEST_CART_KEY);
        } catch {}
      }
    },
  },
});

export const { setCartFromApi, addItem, decrementItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
