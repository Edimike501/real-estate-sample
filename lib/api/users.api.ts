import { fetcher } from "./fetcher";

import { User } from "@/types";

export type AdminUsersResponse = {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
};

export async function getAdminUsers(params?: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<AdminUsersResponse> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        queryParams.set(key, String(val));
      }
    });
  }
  const query = queryParams.toString();
  return fetcher<AdminUsersResponse>(`/api/admin/users${query ? `?${query}` : ""}`);
}

export async function getAdminUserById(id: string): Promise<User> {
  return fetcher<User>(`/api/admin/users/${id}`);
}

export async function getCurrentUser(): Promise<User> {
  return fetcher<User>("/api/me");
}

export async function createAdminUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<User> {
  return fetcher<User>("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateAdminUser(
  id: string,
  data: { name?: string; role?: string; isActive?: boolean }
): Promise<User> {
  return fetcher<User>(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export async function deleteAdminUser(id: string): Promise<{ success: boolean }> {
  return fetcher<{ success: boolean }>(`/api/admin/users/${id}`, {
    method: "DELETE"
  });
}

export async function changePassword(data: {
  currentPassword?: string;
  oldPassword?: string;
  newPassword?: string;
}): Promise<{ message: string }> {
  return fetcher<{ message: string }>("/api/admin/users/change-password", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
