import { NextRequest } from "next/server";
import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  return handler(req, context);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  return handler(req, context);
}
