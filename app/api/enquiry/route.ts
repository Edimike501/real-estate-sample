import { prisma } from "@/lib/prisma";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import { InquirySource } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface EnquiryPayload {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  propertyId: string;
  source: InquirySource;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: EnquiryPayload = await req.json();

    const { guestName, guestPhone, guestEmail, propertyId, source, message } =
      body;

    // Validate required fields
    if (!guestName || !guestPhone || !propertyId) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["guestName", "guestPhone", "propertyId"]
        },
        { status: 400 }
      );
    }

    // Optional: Validate property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found", propertyId },
        { status: 404 }
      );
    }

    const propertyLocation = property ? `${property.city}, ${property.state}` : undefined;
    const propertyUrl = property
      ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/properties/${property.slug}`
      : undefined;

    const whatsappMessage = buildWhatsAppMessage({
      guestName,
      guestPhone,
      propertyTitle: property.title,
      propertyLocation,
      propertyUrl,
      source: source as unknown as import("@/types/enums").InquirySource,
      customMessage: message
    });

    // Create enquiry record
    const enquiry = await prisma.inquiry.create({
      data: {
        guestName,
        guestPhone,
        guestEmail: guestEmail || null,
        source: source as InquirySource,
        message: message || "",
        propertyId,
        whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
        whatsappMessage
      },
      select: {
        id: true,
        guestName: true,
        guestPhone: true,
        guestEmail: true,
        source: true,
        message: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry received successfully",
      enquiry
    });
  } catch (error) {
    console.error("Error creating enquiry:", error);

    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
