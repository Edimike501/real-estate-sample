"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteAdminInquiry,
  getAdminInquiries,
  getAdminInquiryById,
  submitPublicInquiry,
  updateAdminInquiryStatus
} from "@/lib/api/inquiries.api";
import { InquiryCreateRequest } from "@/types";

/* Public Inquiry Hooks */

export function useSubmitInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InquiryCreateRequest) => submitPublicInquiry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    }
  });
}

/* Admin Inquiry Hooks */

export function useAdminInquiries(filters?: {
  status?: string;
  search?: string;
  propertyId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["admin", "inquiries", filters],
    queryFn: () => getAdminInquiries(filters),
    staleTime: 30 * 1000
  });
}

export function useAdminInquiry(id: string) {
  return useQuery({
    queryKey: ["admin", "inquiries", id],
    queryFn: () => getAdminInquiryById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000
  });
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      adminNotes
    }: {
      id: string;
      status: string;
      adminNotes?: string;
    }) => updateAdminInquiryStatus(id, status, adminNotes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "inquiries", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    }
  });
}

export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    }
  });
}
