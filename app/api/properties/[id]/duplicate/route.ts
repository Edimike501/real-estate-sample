import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PropertyStatus } from "@prisma/client";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const original = await prisma.property.findFirst({
      where: { id, deletedAt: null },
    });

    if (!original) {
      return NextResponse.json(
        { success: false, error: "Property not found." },
        { status: 404 }
      );
    }

    // Generate unique slug
    let baseSlug = `${original.slug}-copy`;
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.property.findUnique({
        where: { slug: uniqueSlug },
      });
      if (!existing) break;
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Exclude relations and meta fields that shouldn't be duplicated or need overrides
    const {
      id: _,
      createdAt: _c,
      updatedAt: _u,
      slug: _s,
      title: _t,
      status: _st,
      isFeatured: _f,
      isPinned: _p,
      deletedAt: _d,
      ...restOfFields
    } = original;

    const duplicatedProperty = await prisma.property.create({
      data: {
        ...restOfFields,
        title: `${original.title} (Copy)`,
        slug: uniqueSlug,
        status: PropertyStatus.COMING_SOON,
        isFeatured: false,
        isPinned: false,
        duplicatedFrom: original.id,
      },
    });

    return NextResponse.json({
      success: true,
      property: duplicatedProperty,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to duplicate property.",
      },
      { status: 500 }
    );
  }
}
