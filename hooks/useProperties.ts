"use client";

import { useQuery } from "@tanstack/react-query";

import { type PropertiesResponse, type PropertyFilters } from "@/types";

function toQuery(filters: PropertyFilters, currency?: string | null): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  if (currency) {
    params.set("currency", currency);
  }
  return params.toString();
}

export function useProperties(
  filters: PropertyFilters,
  currency?: string | null
) {
  return useQuery({
    queryKey: ["properties", filters, currency],
    queryFn: async () => {
      const query = toQuery(filters, currency);
      const response = await fetch(
        `/api/properties${query ? `?${query}` : ""}`,
        {
          next: { revalidate: 3600 } // ISR: Revalidate data every hour safely
        }
      );
      if (!response.ok) {
        throw new Error("Failed to load properties");
      }
      return (await response.json()) as PropertiesResponse;
    }
  });
}
