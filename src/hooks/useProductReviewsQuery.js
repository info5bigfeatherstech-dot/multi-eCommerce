import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminProductReviews,
  updateReviewStatus,
  lookupProductVariant,
  getGeneratedReviews,
  getGeneratedReviewById,
  createGeneratedReview,
  updateGeneratedReview,
  deleteGeneratedReview,
  getPublicProductReviews,
  getPublicProductReviewSummary,
  getMyProductReview,
  checkReviewEligibility,
  submitProductReview,
} from "@/api/adminReviews";
import { toast } from "sonner";

export const ADMIN_REVIEWS_KEY = ["admin", "product-reviews"];
export const GENERATED_REVIEWS_KEY = ["admin", "product-reviews", "generated"];
export const PUBLIC_REVIEWS_KEY = ["public", "product-reviews"];

/**
 * 1. Admin Product Reviews Hook
 */
export function useAdminProductReviewsQuery(params = {}) {
  return useQuery({
    queryKey: [...ADMIN_REVIEWS_KEY, params],
    queryFn: () => getAdminProductReviews(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 2. Update Review Status (toggle visibility)
 */
export function useUpdateReviewStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => updateReviewStatus(id, { isActive }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_REVIEWS_KEY });
      toast.success(data?.message || "Review status updated successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update review status.");
    },
  });
}

/**
 * 3. Variant Lookup by SKU/Variant Code
 */
export function useProductVariantLookupQuery(code) {
  return useQuery({
    queryKey: ["admin", "products", "variant", code],
    queryFn: () => lookupProductVariant(code),
    enabled: Boolean(code),
    staleTime: 60 * 1000,
  });
}

/**
 * 4. Admin Generated / Seeded Reviews List Hook
 */
export function useGeneratedReviewsQuery(params = {}) {
  return useQuery({
    queryKey: [...GENERATED_REVIEWS_KEY, params],
    queryFn: () => getGeneratedReviews(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 5. Single Generated Review Detail Hook
 */
export function useGeneratedReviewDetailQuery(id) {
  return useQuery({
    queryKey: [...GENERATED_REVIEWS_KEY, "detail", id],
    queryFn: () => getGeneratedReviewById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * 6. Create Generated Review Mutation
 */
export function useCreateGeneratedReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createGeneratedReview(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GENERATED_REVIEWS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY });
      toast.success(data?.message || "Seeded review created successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create seeded review.");
    },
  });
}

/**
 * 7. Update Generated Review Mutation
 */
export function useUpdateGeneratedReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => updateGeneratedReview(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: GENERATED_REVIEWS_KEY });
      queryClient.invalidateQueries({ queryKey: [...GENERATED_REVIEWS_KEY, "detail", id] });
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY });
      toast.success(data?.message || "Review updated successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update review.");
    },
  });
}

/**
 * 8. Delete Generated Review Mutation
 */
export function useDeleteGeneratedReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteGeneratedReview(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GENERATED_REVIEWS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY });
      toast.success(data?.message || "Seeded review deleted successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete review.");
    },
  });
}

/**
 * 9. Public Storefront Product Reviews Hook
 */
export function usePublicProductReviewsQuery(productId, params = {}) {
  return useQuery({
    queryKey: [...PUBLIC_REVIEWS_KEY, productId, params],
    queryFn: () => getPublicProductReviews(productId, params),
    enabled: Boolean(productId),
    staleTime: 30 * 1000,
  });
}

/**
 * 10. Public Storefront Product Review Summary Hook
 */
export function usePublicProductReviewSummaryQuery(productId) {
  return useQuery({
    queryKey: [...PUBLIC_REVIEWS_KEY, "summary", productId],
    queryFn: () => getPublicProductReviewSummary(productId),
    enabled: Boolean(productId),
    staleTime: 60 * 1000,
  });
}

/**
 * 11. Customer's Own Review Hook
 */
export function useMyProductReviewQuery(productId) {
  return useQuery({
    queryKey: [...PUBLIC_REVIEWS_KEY, "mine", productId],
    queryFn: () => getMyProductReview(productId),
    enabled: Boolean(productId),
    staleTime: 30 * 1000,
  });
}

/**
 * 12. Review Eligibility Check Hook
 */
export function useReviewEligibilityQuery(productId) {
  return useQuery({
    queryKey: [...PUBLIC_REVIEWS_KEY, "eligibility", productId],
    queryFn: () => checkReviewEligibility(productId),
    enabled: Boolean(productId),
    staleTime: 60 * 1000,
  });
}

/**
 * 13. Submit Product Review Mutation (Customer Storefront)
 */
export function useSubmitProductReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => submitProductReview(payload),
    onSuccess: (data, { productId }) => {
      queryClient.invalidateQueries({ queryKey: [...PUBLIC_REVIEWS_KEY, productId] });
      queryClient.invalidateQueries({ queryKey: [...PUBLIC_REVIEWS_KEY, "summary", productId] });
      queryClient.invalidateQueries({ queryKey: [...PUBLIC_REVIEWS_KEY, "mine", productId] });
      toast.success(data?.message || "Thank you! Your review has been submitted.");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to submit review.");
    },
  });
}
