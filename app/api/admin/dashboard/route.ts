import { NextResponse } from "next/server";

import { requireAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.authorized) return auth.response;

  try {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const [
      totalProperties,
      featuredProperties,
      propertiesByType,
      propertiesByStatus,
      totalInquiries,
      newInquiries,
      inquiriesByStatus,
      totalUsers,
      recentInquiries,
      recentProperties,
      todayInquiries,
      todayInquiriesCount
    ] = await Promise.all([
      prisma.property.count({ where: { deletedAt: null } }),
      prisma.property.count({ where: { isFeatured: true, deletedAt: null } }),
      prisma.property.groupBy({
        by: ["listingType"],
        _count: { _all: true },
        where: { deletedAt: null }
      }),
      prisma.property.groupBy({
        by: ["status"],
        _count: { _all: true },
        where: { deletedAt: null }
      }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.inquiry.groupBy({
        by: ["status"],
        _count: { _all: true }
      }),
      prisma.user.count(),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          property: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }),
      prisma.property.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          media: {
            orderBy: { order: "asc" },
            take: 1
          }
        }
      }),
      prisma.inquiry.findMany({
        where: {
          createdAt: { gte: startOfDay }
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          property: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }),
      prisma.inquiry.count({
        where: {
          createdAt: { gte: startOfDay }
        }
      })
    ]);

    const typeCounts = propertiesByType.reduce(
      (acc, curr) => {
        acc[curr.listingType] = curr._count._all;
        return acc;
      },
      {} as Record<string, number>
    );

    const statusCounts = propertiesByStatus.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count._all;
        return acc;
      },
      {} as Record<string, number>
    );

    const inquiryStatusCounts = inquiriesByStatus.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count._all;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      totalProperties,
      featuredProperties,
      typeCounts,
      statusCounts,
      totalInquiries,
      newInquiries,
      inquiryStatusCounts,
      totalUsers,
      recentInquiries,
      recentProperties,
      todayInquiries,
      todayInquiriesCount
    });
  } catch (error) {
    console.error("Admin dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin dashboard statistics" },
      { status: 500 }
    );
  }
}
