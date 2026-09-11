import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
  bulkRemoveWishlistItems,
  clearWishlist,
  mergeWishlist,
  moveWishlistToCart,
} from "@/api/storefrontWishlist";
import { CART_QUERY_KEY } from "./useCartQuery";
import { toast } from "sonner";

export const WISHLIST_QUERY_KEY = ["wishlist"];

/**
 * 1. Hook to fetch user's wishlist
 */
export function useWishlistQuery() {
  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: async () => {
      return await getWishlist();
    },
    staleTime: 30 * 1000,
  });
}

/**
 * 2. Hook to add product to wishlist
 */
export function useAddToWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productSlug, variantId, product }) => {
      return await addToWishlist({ productSlug, variantId, product });
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success(`Added "${vars.product?.name || vars.productSlug}" to Wishlist.`);
    },
    onError: () => {
      toast.error("Failed to add to wishlist.");
    },
  });
}

/**
 * 3. Hook to remove item from wishlist by slug
 */
export function useRemoveWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug) => {
      return await removeWishlistItem(slug);
    },
    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previous = queryClient.getQueryData(WISHLIST_QUERY_KEY);
      if (previous) {
        queryClient.setQueryData(WISHLIST_QUERY_KEY, {
          ...previous,
          items: previous.items?.filter((i) => i.slug !== slug && i.id !== slug) || [],
          totalCount: Math.max(0, (previous.totalCount || 1) - 1),
        });
      }
      return { previous };
    },
    onError: (err, slug, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(WISHLIST_QUERY_KEY, ctx.previous);
      }
      toast.error("Failed to remove from wishlist.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });
}

/**
 * 4. Hook to bulk remove wishlist items by slugs
 */
export function useBulkRemoveWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slugs }) => {
      return await bulkRemoveWishlistItems({ slugs });
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success(`Removed ${vars.slugs.length} item(s) from wishlist.`);
    },
    onError: () => {
      toast.error("Failed to remove selected items.");
    },
  });
}

/**
 * 5. Hook to clear entire wishlist
 */
export function useClearWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await clearWishlist();
    },
    onSuccess: () => {
      queryClient.setQueryData(WISHLIST_QUERY_KEY, { items: [], totalCount: 0 });
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success("Wishlist cleared.");
    },
    onError: () => {
      toast.error("Failed to clear wishlist.");
    },
  });
}

/**
 * 6. Hook to merge wishlist on sign-in
 */
export function useMergeWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ items, slugs } = {}) => {
      return await mergeWishlist({ items, slugs });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });
}

/**
 * 7. Hook to move items from wishlist to cart
 */
export function useMoveWishlistToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ moveAll = false, productIds = [] } = {}) => {
      return await moveWishlistToCart({ moveAll, productIds });
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success(
        vars.moveAll
          ? "All wishlist items moved to your shopping bag!"
          : "Item moved to cart successfully!"
      );
    },
    onError: () => {
      toast.error("Could not move items to cart.");
    },
  });
}
