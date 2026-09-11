import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
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

export const CART_QUERY_KEY = ["cart"];

/**
 * 1. Hook to fetch Cart with caching
 */
export function useCartQuery() {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const data = await getCart();
      return data;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * 2. Hook to add item to Cart
 */
export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productSlug, variantId, quantity = 1, product }) => {
      return await addToCart({ productSlug, variantId, quantity, product });
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData(CART_QUERY_KEY);

      if (previousCart) {
        const optimistic = { ...previousCart };
        const existing = optimistic.items?.find(
          (i) => (i.slug === newItem.productSlug || i.id === newItem.product?.id) &&
            (!newItem.variantId || i.variantId === newItem.variantId)
        );
        if (existing) {
          existing.quantity += (newItem.quantity || 1);
        } else {
          optimistic.items = [
            ...(optimistic.items || []),
            {
              id: newItem.product?.id || newItem.productSlug,
              slug: newItem.productSlug,
              variantId: newItem.variantId,
              name: newItem.product?.name || newItem.productSlug,
              price: newItem.product?.price || 499,
              quantity: newItem.quantity || 1,
              imageUrl: newItem.product?.imageUrl || newItem.product?.images?.[0] || "",
            },
          ];
        }
        optimistic.totalCount = optimistic.items.reduce((s, i) => s + i.quantity, 0);
        optimistic.totalAmount = optimistic.items.reduce((s, i) => s + i.price * i.quantity, 0);
        queryClient.setQueryData(CART_QUERY_KEY, optimistic);
      }

      return { previousCart };
    },
    onError: (err, newItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
      toast.error("Failed to add item to cart.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * 3. Hook to update cart item quantity (supports debouncing)
 */
export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, variantId, quantity }) => {
      return await updateCartItem({ productId, variantId, quantity });
    },
    onMutate: async ({ productId, variantId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData(CART_QUERY_KEY);

      if (previousCart) {
        const optimistic = {
          ...previousCart,
          items: previousCart.items.map((item) => {
            if ((item.id === productId || item.slug === productId) && (!variantId || item.variantId === variantId)) {
              return { ...item, quantity };
            }
            return item;
          }).filter((i) => i.quantity > 0),
        };
        optimistic.totalCount = optimistic.items.reduce((s, i) => s + i.quantity, 0);
        optimistic.totalAmount = optimistic.items.reduce((s, i) => s + i.price * i.quantity, 0);
        queryClient.setQueryData(CART_QUERY_KEY, optimistic);
      }

      return { previousCart };
    },
    onError: (err, vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
      toast.error("Failed to update item quantity.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * 4. Hook to remove item from cart
 */
export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, variantId }) => {
      return await removeCartItem({ productId, variantId });
    },
    onMutate: async ({ productId, variantId }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData(CART_QUERY_KEY);

      if (previousCart) {
        const optimistic = {
          ...previousCart,
          items: previousCart.items.filter(
            (i) => !((i.id === productId || i.slug === productId) && (!variantId || i.variantId === variantId))
          ),
        };
        optimistic.totalCount = optimistic.items.reduce((s, i) => s + i.quantity, 0);
        optimistic.totalAmount = optimistic.items.reduce((s, i) => s + i.price * i.quantity, 0);
        queryClient.setQueryData(CART_QUERY_KEY, optimistic);
      }

      return { previousCart };
    },
    onError: (err, vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
      toast.error("Failed to remove item.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * 5. Hook to bulk remove items from cart
 */
export function useBulkRemoveCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ items }) => {
      return await bulkRemoveCartItems({ items });
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success(`Removed ${vars.items.length} item(s) from cart.`);
    },
    onError: () => {
      toast.error("Failed to remove selected items.");
    },
  });
}

/**
 * 6. Hook to clear entire cart
 */
export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await clearCart();
    },
    onSuccess: () => {
      queryClient.setQueryData(CART_QUERY_KEY, { items: [], totalCount: 0, totalAmount: 0 });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success("Cart cleared.");
    },
    onError: () => {
      toast.error("Failed to clear cart.");
    },
  });
}

/**
 * 7. Hook to merge guest cart upon sign-in
 */
export function useMergeCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ items } = {}) => {
      return await mergeCart({ items });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
