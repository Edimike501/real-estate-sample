import { Prisma, PropertyStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDiasporaDisplayPrice, getExchangeRates } from "@/lib/currency";
import { prisma } from "@/lib/prisma";
import type { Property } from "@/types";
import { submitToIndexNow } from "@/lib/indexnow";

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
  address: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  bedrooms: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().int().nullable().optional()
  ),
  bathrooms: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().int().nullable().optional()
  ),
  toilets: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().int().nullable().optional()
  ),
  sizeSqm: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().nullable().optional()
  ),
  salePrice: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().nullable().optional()
  ),
  rentalPrice: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().nullable().optional()
  ),
  priceFrequency: z
    .enum(["ONE_OFF", "PER_MONTH", "PER_YEAR"])
    .nullable()
    .optional(),
  availableFrom: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined
        ? null
        : new Date(val as string),
    z.date().nullable().optional()
  ),
  leaseTerm: z.string().nullable().optional(),
  serviceCharge: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().nullable().optional()
  ),
  cautionFee: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().nullable().optional()
  ),
  landSizeSqm: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().nullable().optional()
  ),
  titleType: z.string().nullable().optional(),
  virtualTourUrl: z.string().nullable().optional(),
  duplicatedFrom: z.string().optional().nullable(),
  estimatedCompletion: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined
        ? null
        : new Date(val as string),
    z.date().nullable().optional()
  ),
  zoningType: z.string().optional().nullable(),
  furnished: z.boolean().optional().nullable(),
  petsAllowed: z.boolean().optional().nullable(),
  yearBuilt: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? null : Number(val),
    z.number().int().nullable().optional()
  )
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const ids = searchParams.get("ids");
    const selectParam = searchParams.get("select");
    const listingType = searchParams.get("listingType");
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const minPrice = Number(searchParams.get("minPrice") ?? 0);
    const maxPrice = Number(searchParams.get("maxPrice") ?? 0);
    const bedrooms = Number(searchParams.get("bedrooms") ?? 0);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const tab = searchParams.get("tab");
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 12);

    const where: Prisma.PropertyWhereInput = {};

    if (tab === "archived") {
      where.deletedAt = { not: null };
    } else {
      where.deletedAt = null;
    }

    if (ids) {
      where.id = { in: ids.split(",") };
    }

    if (selectParam === "id,title") {
      const properties = await prisma.property.findMany({
        where,
        select: { id: true, title: true },
        orderBy: { title: "asc" }
      });
      return NextResponse.json({ properties });
    }

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
          },
          _count: {
            select: { inquiries: true }
          }
        }
      }),
      prisma.property.count({ where })
    ]);

    const rates = await getExchangeRates();
    const targetCurrency = searchParams.get("currency");
    const propertiesWithDiaspora = properties.map((p) => ({
      ...p,
      diasporaPrice: getDiasporaDisplayPrice(
        p as unknown as Property,
        rates,
        targetCurrency
      )
    }));

    return NextResponse.json({
      properties: propertiesWithDiaspora,
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

    // Submit to IndexNow for search engine notification
    if (property.status === "AVAILABLE") {
      submitToIndexNow([`/properties/${property.slug}`]).catch(
        (error: unknown) => {
          console.error("Failed to submit to IndexNow:", error);
        }
      );
    }

    const rates = await getExchangeRates();
    const diasporaPrice = getDiasporaDisplayPrice(
      property as unknown as Property,
      rates
    );

    return NextResponse.json(
      {
        success: true,
        property: {
          ...property,
          diasporaPrice
        }
      },
      { status: 201 }
    );
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
