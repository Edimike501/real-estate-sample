"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMedia, uploadMedia } from "@/lib/api/media.api";

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadMedia(formData),
    onSuccess: (data) => {
      if (data?.propertyId) {
        queryClient.invalidateQueries({
          queryKey: ["admin", "properties", data.propertyId]
        });
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
    }
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; propertyId?: string }) =>
      deleteMedia(payload.id),
    onSuccess: (_, variables) => {
      if (variables.propertyId) {
        queryClient.invalidateQueries({
          queryKey: ["admin", "properties", variables.propertyId]
        });
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
    }
  });
}
