"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  changePassword,
  createAdminUser,
  deleteAdminUser,
  getAdminUserById,
  getAdminUsers,
  getCurrentUser,
  updateAdminUser
} from "@/lib/api/users.api";

export function useAdminUsers(params?: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getAdminUsers(params),
    staleTime: 30 * 1000
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => getAdminUserById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => getCurrentUser(),
    staleTime: 5 * 60 * 1000
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string; role: string }) =>
      createAdminUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string;
      data: { name?: string; role?: string; isActive?: boolean };
    }) => updateAdminUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", variables.id] });
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    }
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { oldPassword?: string; currentPassword?: string; newPassword?: string }) =>
      changePassword(data)
  });
}
