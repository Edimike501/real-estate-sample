import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { sendInquiryNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { buildWhatsAppLink, buildWhatsAppMessage } from "@/lib/whatsapp";
import { InquirySource } from "@/types/enums";

const createInquirySchema = z.object({
  guestName: z.string().min(2),
  guestPhone: z.string().min(7),
  guestEmail: z.string().email().optional(),
  propertyId: z.string().optional(),
  source: z.nativeEnum(InquirySource),
  message: z.string().optional(),
});

const updateInquirySchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "FOLLOW_UP", "CLOSED", "SPAM"]),
  adminNotes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const today = searchParams.get("today");
    const propertyId = searchParams.get("propertyId");

    const where: Prisma.InquiryWhereInput = {};

    if (today === "true") {
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      where.createdAt = { gte: startOfDay };
    }

    if (propertyId) {
      where.propertyId = propertyId;
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({ success: true, inquiries });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch inquiries.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = createInquirySchema.parse(body);

    const property = payload.propertyId
      ? await prisma.property.findUnique({
          where: { id: payload.propertyId },
          select: { title: true, city: true, state: true, slug: true },
        })
      : null;

    const propertyLocation = property ? `${property.city}, ${property.state}` : undefined;
    const propertyUrl = property
      ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/properties/${property.slug}`
      : undefined;

    const whatsappMessage = buildWhatsAppMessage({
      guestName: payload.guestName,
      guestPhone: payload.guestPhone,
      propertyTitle: property?.title,
      propertyLocation,
      propertyUrl,
      source: payload.source,
      customMessage: payload.message,
    });

    const inquiry = await prisma.inquiry.create({
      data: {
        guestName: payload.guestName,
        guestPhone: payload.guestPhone,
        guestEmail: payload.guestEmail,
        propertyId: payload.propertyId,
        source: payload.source,
        message: payload.message,
        whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
        whatsappMessage,
      },
    });

    void sendInquiryNotification({
      guestName: payload.guestName,
      guestPhone: payload.guestPhone,
      guestEmail: payload.guestEmail,
      propertyTitle: property?.title,
      propertyLocation,
      message: payload.message,
      source: payload.source,
    });

    return NextResponse.json({
      success: true,
      whatsappUrl: buildWhatsAppLink({
        guestName: payload.guestName,
        guestPhone: payload.guestPhone,
        propertyTitle: property?.title,
        propertyLocation,
        propertyUrl,
        source: payload.source,
        customMessage: payload.message,
      }),
      inquiryId: inquiry.id,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create inquiry.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = z
      .object({
        id: z.string().min(1),
      })
      .merge(updateInquirySchema)
      .parse(body);

    const inquiry = await prisma.inquiry.update({
      where: { id: payload.id },
      data: {
        status: payload.status,
        adminNotes: payload.adminNotes,
      },
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
