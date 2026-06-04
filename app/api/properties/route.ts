import { Prisma, PropertyStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const propertyCreateSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  description: z.string().min(10),
  listingType: z.enum(["SALE", "RENTAL", "LAND", "DEVELOPMENT"]),
  status: z
    .enum(["AVAILABLE", "SOLD", "LET", "UNDER_OFFER", "COMING_SOON"])
    .optional(),
  city: z.string().min(2),
  state: z.string().default("Lagos"),
  country: z.string().default("Nigeria"),
  address: z.string().optional(),
  landmark: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const listingType = searchParams.get("listingType");
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const minPrice = Number(searchParams.get("minPrice") ?? 0);
    const maxPrice = Number(searchParams.get("maxPrice") ?? 0);
    const bedrooms = Number(searchParams.get("bedrooms") ?? 0);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 12);

    const where: Prisma.PropertyWhereInput = {
      deletedAt: null
    };

    if (listingType)
      where.listingType = listingType as Prisma.EnumListingTypeFilter["equals"];
    if (state) where.state = { contains: state, mode: "insensitive" };
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (status) where.status = status as PropertyStatus;
    if (featured !== null) where.isFeatured = featured === "true";
    if (Number.isFinite(bedrooms) && bedrooms > 0)
      where.bedrooms = { gte: bedrooms };

    if (
      (Number.isFinite(minPrice) && minPrice > 0) ||
      (Number.isFinite(maxPrice) && maxPrice > 0)
    ) {
      where.OR = [
        {
          salePrice: {
            gte:
              Number.isFinite(minPrice) && minPrice > 0 ? minPrice : undefined,
            lte:
              Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : undefined
          }
        },
        {
          rentalPrice: {
            gte:
              Number.isFinite(minPrice) && minPrice > 0 ? minPrice : undefined,
            lte:
              Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : undefined
          }
        }
      ];
    }

    if (search) {
      where.AND = [
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { landmark: { contains: search, mode: "insensitive" } }
          ]
        }
      ];
    }

    const currentPage = Math.max(page, 1);
    const perPage = Math.min(Math.max(limit, 1), 50);
    const skip = (currentPage - 1) * perPage;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy: [
          { isPinned: "desc" },
          { isFeatured: "desc" },
          { createdAt: "desc" }
        ],
        skip,
        take: perPage,
        include: {
          media: {
            orderBy: { order: "asc" }
          }
        }
      }),
      prisma.property.count({ where })
    ]);

    return NextResponse.json({
      properties,
      total,
      page: currentPage,
      totalPages: Math.max(1, Math.ceil(total / perPage))
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch properties."
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = propertyCreateSchema.parse(body);

    const property = await prisma.property.create({
      data: {
        ...payload,
        status: payload.status ?? "AVAILABLE"
      }
    });

    return NextResponse.json({ success: true, property }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create property."
      },
      { status: 500 }
    );
  }
}
