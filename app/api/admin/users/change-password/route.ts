import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "New password must be at least 6 characters")
  })
  .refine((data) => data.oldPassword || data.currentPassword, {
    message: "Current password is required",
    path: ["currentPassword"]
  });

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const payload = changePasswordSchema.parse(body);

    const currentPasswordInput = (payload.currentPassword || payload.oldPassword)!;

    const user = await prisma.user.findUnique({
      where: { id: auth.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPasswordInput, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 400 }
      );
    }

    const newHashedPassword = await bcrypt.hash(payload.newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHashedPassword }
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
