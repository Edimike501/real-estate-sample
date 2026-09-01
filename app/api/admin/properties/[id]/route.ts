import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const propertyUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  listingType: z.enum(["SALE", "RENTAL", "LAND", "DEVELOPMENT"]).optional(),
  status: z
    .enum(["AVAILABLE", "SOLD", "LET", "UNDER_OFFER", "COMING_SOON"])
    .optional(),
  city: z.string().min(2).optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  lga: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  bedrooms: z.number().int().nullable().optional(),
  bathrooms: z.number().int().nullable().optional(),
  toilets: z.number().int().nullable().optional(),
  sizeSqm: z.number().nullable().optional(),
  salePrice: z.number().nullable().optional(),
  rentalPrice: z.number().nullable().optional(),
  priceFrequency: z.enum(["ONE_OFF", "PER_MONTH", "PER_YEAR"]).nullable().optional(),
  availableFrom: z.preprocess(
    (val) => (val ? new Date(val as string) : null),
    z.date().nullable().optional()
  ),
  leaseTerm: z.string().nullable().optional(),
  serviceCharge: z.number().nullable().optional(),
  cautionFee: z.number().nullable().optional(),
  landSizeSqm: z.number().nullable().optional(),
  titleType: z.string().nullable().optional(),
  virtualTourUrl: z.string().nullable().optional(),
  estimatedCompletion: z.preprocess(
    (val) => (val ? new Date(val as string) : null),
    z.date().nullable().optional()
  ),
  zoningType: z.string().optional().nullable(),
  furnished: z.boolean().nullable().optional(),
  petsAllowed: z.boolean().nullable().optional(),
  negotiationStatus: z.enum(["FIXED", "NEGOTIABLE", "CONTACT_FOR_PRICE"]).optional(),
  yearBuilt: z.number().int().nullable().optional(),
  isFeatured: z.boolean().optional(),
  isPinned: z.boolean().optional()
});

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await context.params;
    const property = await prisma.property.findFirst({
      where: { id, deletedAt: null },
      include: {
        media: { orderBy: { order: "asc" } },
        inquiries: { orderBy: { createdAt: "desc" } }
      }
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("GET admin property by id error:", error);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const payload = propertyUpdateSchema.parse(body);

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: payload,
      include: {
        media: { orderBy: { order: "asc" } }
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.flatten() }, { status: 400 });
    }
    console.error("PATCH admin property error:", error);
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await context.params;
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Soft delete
    await prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE admin property error:", error);
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
