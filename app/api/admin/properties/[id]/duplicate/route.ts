import { PropertyStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await context.params;

    const original = await prisma.property.findFirst({
      where: { id, deletedAt: null }
    });

    if (!original) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    const baseSlug = `${original.slug}-copy`;
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.property.findUnique({
        where: { slug: uniqueSlug }
      });
      if (!existing) break;
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const {
      id: _id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      slug: _slug,
      title: _title,
      status: _status,
      isFeatured: _isFeatured,
      isPinned: _isPinned,
      deletedAt: _deletedAt,
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
        duplicatedFrom: original.id
      }
    });

    return NextResponse.json(duplicatedProperty);
  } catch (error: unknown) {
    console.error("Duplicate property error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to duplicate property." },
      { status: 500 }
    );
  }
}
