"use client";

import { useQuery } from "@tanstack/react-query";

import { type PropertiesResponse, type PropertyFilters } from "@/types";

function toQuery(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  return params.toString();
}

export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const query = toQuery(filters);
      const response = await fetch(`/api/properties${query ? `?${query}` : ""}`);
      if (!response.ok) {
        throw new Error("Failed to load properties");
      }
      return (await response.json()) as PropertiesResponse;
    },
  });
}
