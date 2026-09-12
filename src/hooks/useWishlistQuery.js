import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { setWishlistFromApi, removeFromWishlist, clearWishlist as clearReduxWishlist } from "@/store/slices/wishlistSlice";
import { setCartFromApi } from "@/store/slices/cartSlice";
import {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
  bulkRemoveWishlistItems,
  clearWishlist,
  mergeWishlist,
  moveWishlistToCart,
} from "@/api/storefrontWishlist";
import { getCart } from "@/api/storefrontCart";
import { CART_QUERY_KEY } from "./useCartQuery";
import { getEcommAccessToken } from "@/api/authStorage";
import { toast } from "sonner";

export const WISHLIST_QUERY_KEY = ["wishlist"];

/**
 * 1. Hook to fetch user's wishlist
 */
export function useWishlistQuery({ storefront = "ecomm" } = {}) {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: [...WISHLIST_QUERY_KEY, storefront],
    queryFn: async () => {
      const token = getEcommAccessToken();
      if (!token) return { items: [], totalCount: 0 };
      try {
        const data = await getWishlist({ storefront });
        if (data) {
          dispatch(setWishlistFromApi(data));
        }
        return data;
      } catch (err) {
        return { items: [], totalCount: 0 };
      }
    },
    staleTime: 30 * 1000,
  });
}

/**
 * 2. Hook to add product to wishlist
 */
export function useAddToWishlistMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ productSlug, variantId, product }) => {
      return await addToWishlist({ productSlug, variantId }, { storefront });
    },
    onSuccess: (data, vars) => {
      queryClient.setQueryData([...WISHLIST_QUERY_KEY, storefront], data);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      if (data) {
        dispatch(setWishlistFromApi(data));
      }
      toast.success(`Added "${vars.product?.name || vars.productSlug}" to Wishlist.`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add to wishlist.");
    },
  });
}

/**
 * 3. Hook to remove item from wishlist by slug
 */
export function useRemoveWishlistMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (slug) => {
      return await removeWishlistItem(slug, { storefront });
    },
    onSuccess: (data, slug) => {
      queryClient.setQueryData([...WISHLIST_QUERY_KEY, storefront], data);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      if (data) {
        dispatch(setWishlistFromApi(data));
      } else {
        dispatch(removeFromWishlist(slug));
      }
      toast.success("Removed from wishlist.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to remove from wishlist.");
    },
  });
}

/**
 * 4. Hook to bulk remove wishlist items by slugs
 */
export function useBulkRemoveWishlistMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ slugs }) => {
      return await bulkRemoveWishlistItems({ slugs }, { storefront });
    },
    onSuccess: (data, vars) => {
      queryClient.setQueryData([...WISHLIST_QUERY_KEY, storefront], data);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      if (data) {
        dispatch(setWishlistFromApi(data));
      }
      toast.success(`Removed ${vars.slugs.length} item(s) from wishlist.`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to remove selected items.");
    },
  });
}

/**
 * 5. Hook to clear entire wishlist
 */
export function useClearWishlistMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      return await clearWishlist({ storefront });
    },
    onSuccess: (data) => {
      const empty = { items: [], totalCount: 0 };
      queryClient.setQueryData([...WISHLIST_QUERY_KEY, storefront], empty);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      dispatch(clearReduxWishlist());
      toast.success("Wishlist cleared.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to clear wishlist.");
    },
  });
}

/**
 * 6. Hook to merge wishlist on sign-in
 */
export function useMergeWishlistMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ items, slugs } = {}) => {
      return await mergeWishlist({ items, slugs }, { storefront });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      try {
        const fresh = await getWishlist({ storefront });
        if (fresh) dispatch(setWishlistFromApi(fresh));
      } catch {}
    },
  });
}

/**
 * 7. Hook to move items from wishlist to cart
 */
export function useMoveWishlistToCartMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ moveAll = false, productIds = [] } = {}) => {
      return await moveWishlistToCart({ moveAll, productIds }, { storefront });
    },
    onSuccess: async (data, vars) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });

      // Refresh both wishlist and cart states
      try {
        const [freshWishlist, freshCart] = await Promise.all([
          getWishlist({ storefront }),
          getCart({ storefront }),
        ]);
        if (freshWishlist) dispatch(setWishlistFromApi(freshWishlist));
        if (freshCart) dispatch(setCartFromApi(freshCart));
      } catch {}

      toast.success(
        vars.moveAll
          ? "All wishlist items moved to your shopping bag!"
          : "Item moved to cart successfully!"
      );
    },
    onError: (err) => {
      toast.error(err.message || "Could not move items to cart.");
    },
  });
}
