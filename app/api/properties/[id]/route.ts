import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { deletePropertyMedia } from "@/lib/media";
import { prisma } from "@/lib/prisma";

const updatePropertySchema = z.object({
  slug: z.string().min(3).optional(),
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  listingType: z.enum(["SALE", "RENTAL", "LAND", "DEVELOPMENT"]).optional(),
  status: z
    .enum(["AVAILABLE", "SOLD", "LET", "UNDER_OFFER", "COMING_SOON"])
    .optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  country: z.string().min(2).optional(),
  address: z.string().optional(),
  landmark: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isFeatured: z.boolean().optional(),
  isPinned: z.boolean().optional()
});

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const property = await prisma.property.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        deletedAt: null
      },
      include: {
        media: {
          orderBy: { order: "asc" }
        }
      }
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, property });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch property."
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const payload = updatePropertySchema.parse(body);

    const property = await prisma.property.update({
      where: { id },
      data: payload
    });

    return NextResponse.json({ success: true, property });
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
          error instanceof Error ? error.message : "Failed to update property."
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const property = await prisma.property.findFirst({
      where: { id, deletedAt: null },
      include: {
        media: {
          select: { id: true, publicId: true, mediaType: true }
        }
      }
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found." },
        { status: 404 }
      );
    }

    await Promise.all(
      property.media.map((media) =>
        deletePropertyMedia(media.publicId, media.mediaType)
      )
    );

    await prisma.$transaction([
      prisma.propertyMedia.deleteMany({ where: { propertyId: property.id } }),
      prisma.property.update({
        where: { id: property.id },
        data: {
          deletedAt: new Date()
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete property."
      },
      { status: 500 }
    );
  }
}
