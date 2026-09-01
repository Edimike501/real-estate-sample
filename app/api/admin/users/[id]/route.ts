import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types/enums";

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "VIEWER"]).optional(),
  isActive: z.boolean().optional()
});

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth([UserRole.SUPER_ADMIN]);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await context.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET admin user by id error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth([UserRole.SUPER_ADMIN]);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const payload = updateUserSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deactivating or demoting the last SUPER_ADMIN
    if (existing.role === "SUPER_ADMIN" && (payload.role !== "SUPER_ADMIN" || payload.isActive === false)) {
      const superAdminCount = await prisma.user.count({
        where: { role: "SUPER_ADMIN", isActive: true }
      });
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot modify or deactivate the sole active Super Admin." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: payload.name?.trim(),
        role: payload.role as UserRole | undefined,
        isActive: payload.isActive
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.flatten() }, { status: 400 });
    }
    console.error("PATCH admin user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth([UserRole.SUPER_ADMIN]);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await context.params;

    if (id === auth.user.id) {
      return NextResponse.json({ error: "You cannot delete your own user account" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existing.role === "SUPER_ADMIN") {
      const superAdminCount = await prisma.user.count({ where: { role: "SUPER_ADMIN" } });
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: "Cannot delete the sole Super Admin." }, { status: 400 });
      }
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE admin user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
