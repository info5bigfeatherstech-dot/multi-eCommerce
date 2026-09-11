import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getArchivedProducts,
  archiveProduct,
  restoreProduct,
  hardDeleteProduct,
  bulkRestoreProducts,
  bulkHardDeleteProducts,
} from "@/api/adminProducts";
import { toast } from "sonner";

export const ADMIN_ARCHIVED_PRODUCTS_KEY = ["admin", "products", "archived"];
export const ADMIN_PRODUCTS_KEY = ["admin", "products"];

/**
 * 1. Hook to fetch paginated and searchable archived products list
 */
export function useArchivedProductsQuery(params = {}) {
  const { page = 1, limit = 50, search = "" } = params;
  return useQuery({
    queryKey: [...ADMIN_ARCHIVED_PRODUCTS_KEY, { page, limit, search }],
    queryFn: () => getArchivedProducts({ page, limit, search }),
    staleTime: 30 * 1000,
  });
}

/**
 * 2. Hook to soft-delete/archive a product
 */
export function useArchiveProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug) => archiveProduct(slug),
    onSuccess: (data, slug) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_ARCHIVED_PRODUCTS_KEY });
      toast.success(data?.message || `Product "${slug}" archived successfully`);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to archive product");
    },
  });
}

/**
 * 3. Hook to restore an archived product back to active
 */
export function useRestoreProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug) => restoreProduct(slug),
    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_ARCHIVED_PRODUCTS_KEY });
      const previousData = queryClient.getQueriesData({ queryKey: ADMIN_ARCHIVED_PRODUCTS_KEY });

      queryClient.setQueriesData({ queryKey: ADMIN_ARCHIVED_PRODUCTS_KEY }, (old) => {
        if (!old) return old;
        const productsList = old.products || old.data || (Array.isArray(old) ? old : []);
        const updated = productsList.filter((p) => p.slug !== slug && p.id !== slug && p._id !== slug);
        if (Array.isArray(old)) return updated;
        return {
          ...old,
          products: updated,
          pagination: old.pagination
            ? { ...old.pagination, total: Math.max(0, (old.pagination.total || 0) - 1) }
            : old.pagination,
        };
      });

      return { previousData };
    },
    onError: (err, slug, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, value]) => {
          queryClient.setQueryData(key, value);
        });
      }
      toast.error(err?.message || `Failed to restore product "${slug}"`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ARCHIVED_PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
    },
    onSuccess: (data, slug) => {
      toast.success(data?.message || `Product "${slug}" restored to catalog`);
    },
  });
}

/**
 * 4. Hook to permanently wipe/hard delete a product from database
 */
export function useHardDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug) => hardDeleteProduct(slug),
    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_ARCHIVED_PRODUCTS_KEY });
      const previousData = queryClient.getQueriesData({ queryKey: ADMIN_ARCHIVED_PRODUCTS_KEY });

      queryClient.setQueriesData({ queryKey: ADMIN_ARCHIVED_PRODUCTS_KEY }, (old) => {
        if (!old) return old;
        const productsList = old.products || old.data || (Array.isArray(old) ? old : []);
        const updated = productsList.filter((p) => p.slug !== slug && p.id !== slug && p._id !== slug);
        if (Array.isArray(old)) return updated;
        return {
          ...old,
          products: updated,
          pagination: old.pagination
            ? { ...old.pagination, total: Math.max(0, (old.pagination.total || 0) - 1) }
            : old.pagination,
        };
      });

      return { previousData };
    },
    onError: (err, slug, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, value]) => {
          queryClient.setQueryData(key, value);
        });
      }
      toast.error(err?.message || `Failed to permanently delete product "${slug}"`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ARCHIVED_PRODUCTS_KEY });
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Product permanently deleted");
    },
  });
}

/**
 * 5. Hook to bulk restore selected archived products
 */
export function useBulkRestoreProductsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slugs) => bulkRestoreProducts(slugs),
    onSuccess: (data, slugs) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ARCHIVED_PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
      toast.success(`${slugs.length} product(s) restored to active catalog`);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to restore selected products");
    },
  });
}

/**
 * 6. Hook to bulk permanently delete selected archived products
 */
export function useBulkHardDeleteProductsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slugs) => bulkHardDeleteProducts(slugs),
    onSuccess: (results, slugs) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ARCHIVED_PRODUCTS_KEY });
      toast.success(`${slugs.length} product(s) permanently removed from vault`);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete selected products");
    },
  });
}
