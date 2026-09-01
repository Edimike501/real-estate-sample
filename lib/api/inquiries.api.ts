import { fetcher } from "./fetcher";

import { Inquiry, InquiryCreateRequest, InquiryCreateResponse } from "@/types";

export type AdminInquiriesResponse = {
  inquiries: Inquiry[];
  total: number;
  page: number;
  totalPages: number;
};

export async function submitPublicInquiry(
  data: InquiryCreateRequest
): Promise<InquiryCreateResponse> {
  return fetcher<InquiryCreateResponse>("/api/inquiries", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function getAdminInquiries(filters?: {
  status?: string;
  search?: string;
  propertyId?: string;
  page?: number;
  limit?: number;
}): Promise<AdminInquiriesResponse> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        params.set(key, String(val));
      }
    });
  }
  const query = params.toString();
  return fetcher<AdminInquiriesResponse>(
    `/api/admin/inquiries${query ? `?${query}` : ""}`
  );
}

export async function getAdminInquiryById(id: string): Promise<Inquiry> {
  return fetcher<Inquiry>(`/api/admin/inquiries/${id}`);
}

export async function updateAdminInquiryStatus(
  id: string,
  status: string,
  adminNotes?: string
): Promise<Inquiry> {
  return fetcher<Inquiry>(`/api/admin/inquiries/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status, adminNotes })
  });
}

export async function deleteAdminInquiry(id: string): Promise<{ success: boolean }> {
  return fetcher<{ success: boolean }>(`/api/admin/inquiries/${id}`, {
    method: "DELETE"
  });
}
