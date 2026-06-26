import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const payload = changePasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "User not found or inactive." },
        { status: 404 }
      );
    }

    const isValidPassword = await bcrypt.compare(payload.currentPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Incorrect current password." },
        { status: 400 }
      );
    }

    if (payload.currentPassword === payload.newPassword) {
      return NextResponse.json(
        { success: false, error: "New password cannot be the same as the current password." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to change password.",
      },
      { status: 500 }
    );
  }
}
