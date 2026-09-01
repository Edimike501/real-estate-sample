"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminDashboardStats } from "@/lib/api";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => getAdminDashboardStats(),
    staleTime: 60 * 1000 // 1 minute stale time for admin dashboard
  });
}
