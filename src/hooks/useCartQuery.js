import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { setCartFromApi, clearCart as clearReduxCart } from "@/store/slices/cartSlice";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  bulkRemoveCartItems,
  clearCart,
  mergeCart,
} from "@/api/storefrontCart";
import { toast } from "sonner";

import { getEcommAccessToken, clearEcommAccessToken } from "@/api/authStorage";

export const CART_QUERY_KEY = ["cart"];

/**
 * 1. Hook to fetch Cart with caching and Redux synchronization
 * Only calls server when customer access token exists; falls back to guest cart otherwise.
 */
export function useCartQuery({ storefront = "ecomm", enabled = true } = {}) {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: [...CART_QUERY_KEY, storefront],
    queryFn: async () => {
      const token = getEcommAccessToken();
      if (!token) {
        return null;
      }
      try {
        const data = await getCart({ storefront });
        if (data) {
          dispatch(setCartFromApi(data));
        }
        return data;
      } catch (err) {
        if (err.message?.includes("TOKEN_EXPIRED") || err.message?.includes("expired")) {
          clearEcommAccessToken();
          return null;
        }
        throw err;
      }
    },
    enabled,
    retry: false,
    staleTime: 30 * 1000,
  });
}

/**
 * 2. Hook to add item to Cart
 */
export function useAddToCartMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ productSlug, variantId, quantity = 1, productId }) => {
      return await addToCart({ productSlug, variantId, quantity, productId }, { storefront });
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData([...CART_QUERY_KEY, storefront], updatedCart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      if (updatedCart) {
        dispatch(setCartFromApi(updatedCart));
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add item to cart.");
    },
  });
}

/**
 * 3. Hook to update cart item quantity (supports debouncing)
 */
export function useUpdateCartItemMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ productId, variantId, quantity, productSlug }) => {
      if (!productId || !variantId) return null;
      try {
        return await updateCartItem({ productId, variantId, quantity }, { storefront });
      } catch (err) {
        // If server says item not in cart, automatically add it
        if (err.message?.includes("not in cart") || err.message?.includes("not found") || err.message?.includes("404")) {
          return await addToCart({ productId, variantId, quantity, productSlug }, { storefront });
        }
        throw err;
      }
    },
    onSuccess: (updatedCart) => {
      if (!updatedCart) return;
      queryClient.setQueryData([...CART_QUERY_KEY, storefront], updatedCart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      dispatch(setCartFromApi(updatedCart));
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update item quantity.");
    },
  });
}

/**
 * 4. Hook to remove item from cart
 */
export function useRemoveCartItemMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ productId, variantId }) => {
      if (!productId || !variantId) return null;
      try {
        return await removeCartItem({ productId, variantId }, { storefront });
      } catch (err) {
        if (err.message?.includes("not in cart") || err.message?.includes("not found") || err.message?.includes("404")) {
          return null;
        }
        throw err;
      }
    },
    onSuccess: (updatedCart) => {
      if (!updatedCart) return;
      queryClient.setQueryData([...CART_QUERY_KEY, storefront], updatedCart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      dispatch(setCartFromApi(updatedCart));
    },
    onError: (err) => {
      toast.error(err.message || "Failed to remove item.");
    },
  });
}

/**
 * 5. Hook to bulk remove items from cart
 */
export function useBulkRemoveCartMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ items }) => {
      return await bulkRemoveCartItems({ items }, { storefront });
    },
    onSuccess: (updatedCart, vars) => {
      queryClient.setQueryData([...CART_QUERY_KEY, storefront], updatedCart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      if (updatedCart) {
        dispatch(setCartFromApi(updatedCart));
      }
      toast.success(`Removed ${vars.items.length} item(s) from cart.`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to remove selected items.");
    },
  });
}

/**
 * 6. Hook to clear entire cart
 */
export function useClearCartMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      return await clearCart({ storefront });
    },
    onSuccess: (response) => {
      const emptyCart = response.cart || { items: [], totalCount: 0, totalAmount: 0 };
      queryClient.setQueryData([...CART_QUERY_KEY, storefront], emptyCart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      dispatch(clearReduxCart());
      toast.success("Cart cleared successfully.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to clear cart.");
    },
  });
}

/**
 * 7. Hook to merge guest cart upon sign-in
 */
export function useMergeCartMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ items } = {}) => {
      return await mergeCart({ items }, { storefront });
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData([...CART_QUERY_KEY, storefront], updatedCart);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      if (updatedCart) {
        dispatch(setCartFromApi(updatedCart));
      }
    },
  });
}

export default {
  useCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useBulkRemoveCartMutation,
  useClearCartMutation,
  useMergeCartMutation,
};
