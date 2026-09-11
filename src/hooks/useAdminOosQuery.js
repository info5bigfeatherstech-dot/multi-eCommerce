import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOosInquiries,
  updateOosInquiryStatus,
  createStorefrontOosInquiry,
} from "@/api/adminOos";
import { toast } from "sonner";

export const ADMIN_OOS_KEY = ["admin", "oos-inquiries"];

/**
 * 1. Hook to list out-of-stock customer inquiries
 */
export function useOosInquiriesQuery(params = {}) {
  return useQuery({
    queryKey: [...ADMIN_OOS_KEY, params],
    queryFn: () => getOosInquiries(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 2. Hook to update status and admin note of an OOS inquiry
 */
export function useUpdateOosInquiryStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, adminNote }) =>
      updateOosInquiryStatus(id, { status, adminNote }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_OOS_KEY });
      toast.success(data?.message || "Inquiry status updated successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update inquiry status.");
    },
  });
}

/**
 * 3. Hook for storefront customers to subscribe to back-in-stock alerts
 */
export function useCreateStorefrontOosInquiryMutation() {
  return useMutation({
    mutationFn: (payload) => createStorefrontOosInquiry(payload),
    onSuccess: (data) => {
      toast.success(
        data?.message || "We will notify you immediately once this item is back in stock!"
      );
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to submit restock alert request.");
    },
  });
}
