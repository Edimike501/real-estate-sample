import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const updateInquirySchema = z.object({
  guestName: z.string().min(2).optional(),
  guestPhone: z.string().min(7).optional(),
  guestEmail: z.string().email().optional(),
  source: z.enum(["PROPERTY_PAGE", "CONTACT_FORM", "WHATSAPP_FLOAT", "FEATURED_CARD"]).optional(),
  message: z.string().optional(),
  status: z.enum(["NEW", "CONTACTED", "FOLLOW_UP", "CLOSED", "SPAM"]).optional(),
  adminNotes: z.string().optional(),
});

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            city: true,
            state: true,
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Inquiry not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch inquiry.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const payload = updateInquirySchema.parse(body);

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: payload,
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update inquiry.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.inquiry.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete inquiry.",
      },
      { status: 500 }
    );
  }
}
