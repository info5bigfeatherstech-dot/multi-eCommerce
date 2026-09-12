import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAddresses,
  createAddress,
  updateAddress,
  setAddressAsDefault,
  deleteAddress,
} from "@/api/addresses";
import { toast } from "sonner";

export const ADDRESSES_QUERY_KEY = ["addresses"];

/**
 * 1. Hook to fetch customer's addresses
 * Handles storefront scoping (default: 'ecomm')
 *
 * @param {{ storefront?: string, enabled?: boolean }} [options]
 */
export function useAddressesQuery({ storefront = "ecomm", enabled = true } = {}) {
  return useQuery({
    queryKey: [...ADDRESSES_QUERY_KEY, storefront],
    queryFn: async () => {
      const data = await getAddresses({ storefront });
      return data;
    },
    enabled,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * 2. Hook to create a new address
 * Handles both 201 Created and 200 Duplicate Detected
 */
export function useCreateAddressMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressData) => {
      return await createAddress(addressData, { storefront });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      if (res.isDuplicate) {
        toast.info("This delivery address is already in your saved list.");
      } else {
        toast.success(res.message || "New delivery address added successfully! ✓");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save address.");
    },
  });
}

/**
 * 3. Hook to update an existing address
 */
export function useUpdateAddressMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await updateAddress(id, data, { storefront });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      toast.success(res.message || "Delivery address updated successfully! ✓");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update address.");
    },
  });
}

/**
 * 4. Hook to set an address as primary default
 */
export function useSetDefaultAddressMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await setAddressAsDefault(id, { storefront });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      toast.success("Default delivery destination updated.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to set default address.");
    },
  });
}

/**
 * 5. Hook to delete an address
 */
export function useDeleteAddressMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await deleteAddress(id, { storefront });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      toast.success(res.message || "Address deleted successfully.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete address.");
    },
  });
}

export default {
  useAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
};
