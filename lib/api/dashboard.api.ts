import { fetcher } from "./fetcher";

export type AdminDashboardStats = {
  totalProperties: number;
  featuredProperties: number;
  typeCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  totalInquiries: number;
  newInquiries: number;
  inquiryStatusCounts: Record<string, number>;
  totalUsers: number;
  recentInquiries: Array<{
    id: string;
    guestName: string;
    guestPhone: string;
    createdAt: string;
    property?: {
      id: string;
      title: string;
    } | null;
  }>;
  recentProperties: Array<{
    id: string;
    title: string;
    city: string;
    state: string;
    status: string;
    createdAt: string;
    media?: Array<{
      id: string;
      url: string;
      thumbnailUrl?: string | null;
      mediaType: string;
    }>;
  }>;
  todayInquiries: Array<{
    id: string;
    guestName: string;
    createdAt: string;
    property?: {
      id: string;
      title: string;
    } | null;
  }>;
  todayInquiriesCount: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  return fetcher<AdminDashboardStats>("/api/admin/dashboard");
}
