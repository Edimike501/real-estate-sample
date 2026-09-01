"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAdminProperty,
  deleteAdminProperty,
  duplicateAdminProperty,
  getAdminProperties,
  getAdminPropertyById,
  getPropertiesByIds,
  getPublicProperties,
  getPublicPropertyBySlug,
  updateAdminProperty
} from "@/lib/api/properties.api";
import { Property, PropertyFilters } from "@/types";

/* Public Properties Hooks */

export function usePublicProperties(
  filters: PropertyFilters,
  currency?: string | null
) {
  return useQuery({
    queryKey: ["properties", "public", filters, currency],
    queryFn: () => getPublicProperties(filters, currency),
    staleTime: 5 * 60 * 1000
  });
}

// Alias for backward compatibility
export const useProperties = usePublicProperties;

export function usePublicPropertyBySlug(slug: string) {
  return useQuery({
    queryKey: ["properties", "public", "slug", slug],
    queryFn: () => getPublicPropertyBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000
  });
}

export function useSavedProperties(ids: string[]) {
  return useQuery({
    queryKey: ["properties", "saved", ids],
    queryFn: () => getPropertiesByIds(ids),
    enabled: ids.length > 0,
    staleTime: 2 * 60 * 1000
  });
}

/* Admin Properties Hooks */

export function useAdminProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ["admin", "properties", filters],
    queryFn: () => getAdminProperties(filters),
    staleTime: 30 * 1000
  });
}

export function useAdminProperty(id: string) {
  return useQuery({
    queryKey: ["admin", "properties", id],
    queryFn: () => getAdminPropertyById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Property>) => createAdminProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    }
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) =>
      updateAdminProperty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "properties", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    }
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    }
  });
}

export function useDuplicateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => duplicateAdminProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    }
  });
}
