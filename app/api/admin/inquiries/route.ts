import { InquiryStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const propertyId = searchParams.get("propertyId");
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    const where: Prisma.InquiryWhereInput = {};

    if (status) {
      where.status = status as InquiryStatus;
    }

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (search) {
      where.OR = [
        { guestName: { contains: search, mode: "insensitive" } },
        { guestPhone: { contains: search, mode: "insensitive" } },
        { guestEmail: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } }
      ];
    }

    const currentPage = Math.max(page, 1);
    const perPage = Math.min(Math.max(limit, 1), 100);
    const skip = (currentPage - 1) * perPage;

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              slug: true,
              city: true,
              state: true
            }
          }
        }
      }),
      prisma.inquiry.count({ where })
    ]);

    return NextResponse.json({
      inquiries,
      total,
      page: currentPage,
      totalPages: Math.max(1, Math.ceil(total / perPage))
    });
  } catch (error) {
    console.error("GET admin inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin inquiries" },
      { status: 500 }
    );
  }
}
