import { fetcher } from "./fetcher";

import { PropertiesResponse, Property, PropertyFilters } from "@/types";

function buildQueryParams(filters: Record<string, unknown>, extraParams?: Record<string, string | null | undefined>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value);
      }
    });
  }
  return params.toString();
}

/* Public API Functions */

export async function getPublicProperties(
  filters: PropertyFilters,
  currency?: string | null
): Promise<PropertiesResponse> {
  const query = buildQueryParams(filters as Record<string, unknown>, { currency });
  return fetcher<PropertiesResponse>(`/api/properties${query ? `?${query}` : ""}`);
}

export async function getPublicPropertyBySlug(slug: string): Promise<Property> {
  return fetcher<Property>(`/api/properties/${slug}`);
}

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  if (!ids.length) return [];
  const response = await fetcher<{ properties: Property[] }>(`/api/properties?ids=${ids.join(",")}`);
  return response.properties || [];
}

/* Admin API Functions */

export async function getAdminProperties(
  filters: PropertyFilters
): Promise<PropertiesResponse> {
  const query = buildQueryParams(filters as Record<string, unknown>);
  return fetcher<PropertiesResponse>(`/api/admin/properties${query ? `?${query}` : ""}`);
}

export async function getAdminPropertyById(id: string): Promise<Property> {
  return fetcher<Property>(`/api/admin/properties/${id}`);
}

export async function createAdminProperty(data: Partial<Property>): Promise<Property> {
  return fetcher<Property>("/api/admin/properties", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateAdminProperty(
  id: string,
  data: Partial<Property>
): Promise<Property> {
  return fetcher<Property>(`/api/admin/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export async function deleteAdminProperty(id: string): Promise<{ success: boolean }> {
  return fetcher<{ success: boolean }>(`/api/admin/properties/${id}`, {
    method: "DELETE"
  });
}

export async function duplicateAdminProperty(id: string): Promise<Property> {
  return fetcher<Property>(`/api/admin/properties/${id}/duplicate`, {
    method: "POST"
  });
}
