import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStaffMembers,
  getStaffMemberById,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
  initiateStaffReset,
  verifyStaffReset,
  getStaffProfileMe,
  initiateOwnPasswordReset,
  verifyOwnPasswordReset,
} from "@/api/adminStaff";
import { toast } from "sonner";

export const ADMIN_STAFF_KEY = ["admin", "staff"];
export const ADMIN_STAFF_PROFILE_KEY = ["admin", "staff", "profile", "me"];

/**
 * 1. Hook to list staff members with pagination, search, and role filters
 */
export function useStaffMembersQuery(params = {}) {
  return useQuery({
    queryKey: [...ADMIN_STAFF_KEY, params],
    queryFn: () => getStaffMembers(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 2. Hook to fetch a single staff member by ID
 */
export function useStaffMemberDetailQuery(id) {
  return useQuery({
    queryKey: [...ADMIN_STAFF_KEY, "detail", id],
    queryFn: () => getStaffMemberById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * 3. Hook to create a new staff account
 */
export function useCreateStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createStaffMember(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STAFF_KEY });
      toast.success(data?.message || "Staff member created successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create staff member.");
    },
  });
}

/**
 * 4. Hook to update staff details, role, or active status
 */
export function useUpdateStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => updateStaffMember(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STAFF_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_STAFF_KEY, "detail", id] });
      toast.success(data?.message || "Staff member updated successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update staff member.");
    },
  });
}

/**
 * 5. Hook to delete / deactivate staff member
 */
export function useDeleteStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteStaffMember(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STAFF_KEY });
      toast.success(data?.message || "Staff member removed successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to remove staff member.");
    },
  });
}

/**
 * 6. Hook to initiate staff password/OTP reset
 */
export function useInitiateStaffResetMutation() {
  return useMutation({
    mutationFn: (id) => initiateStaffReset(id),
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset OTP dispatched to staff email!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to initiate staff password reset.");
    },
  });
}

/**
 * 7. Hook to verify staff OTP and set new password
 */
export function useVerifyStaffResetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, otp, newPassword }) =>
      verifyStaffReset(id, { otp, newPassword }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STAFF_KEY });
      toast.success(data?.message || "Staff password reset successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to verify OTP / reset staff password.");
    },
  });
}

/**
 * 8. Hook to fetch current logged-in staff profile
 */
export function useStaffProfileMeQuery() {
  return useQuery({
    queryKey: ADMIN_STAFF_PROFILE_KEY,
    queryFn: () => getStaffProfileMe(),
    staleTime: 60 * 1000,
  });
}

/**
 * 9. Hook to initiate self password reset
 */
export function useInitiateOwnPasswordResetMutation() {
  return useMutation({
    mutationFn: () => initiateOwnPasswordReset(),
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset OTP sent to your email!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to initiate password reset.");
    },
  });
}

/**
 * 10. Hook to verify self OTP and set new password
 */
export function useVerifyOwnPasswordResetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ otp, newPassword, confirmPassword }) =>
      verifyOwnPasswordReset({ otp, newPassword, confirmPassword }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STAFF_PROFILE_KEY });
      toast.success(data?.message || "Your password has been reset successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to reset password.");
    },
  });
}
