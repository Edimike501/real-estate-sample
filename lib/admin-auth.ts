import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types/enums";

export type AuthenticatedAdmin = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
};

export type AdminAuthResult =
  | { authorized: true; user: AuthenticatedAdmin }
  | { authorized: false; response: NextResponse };

/**
 * Server guard function for admin API routes.
 * Checks next-auth session and verifies the user exists, is active, and possesses an allowed role.
 */
export async function requireAdminAuth(
  allowedRoles: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER]
): Promise<AdminAuthResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.email) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized access. Please log in." },
        { status: 401 }
      )
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true
    }
  });

  if (!user || !user.isActive) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Account inactive or unauthorized." },
        { status: 403 }
      )
    };
  }

  const role = user.role as UserRole;
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Forbidden. Insufficient permissions for this resource." },
        { status: 403 }
      )
    };
  }

  return {
    authorized: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role
    }
  };
}
