import { MediaType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { uploadPropertyMedia } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UploadPayload = {
  propertyId: string;
  altText?: string;
  order?: string;
  mediaType: MediaType;
};

function getAllowedPrefix(mediaType: MediaType) {
  return mediaType === MediaType.IMAGE ? "image/" : "video/";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const propertyId = String(formData.get("propertyId") ?? "");
    const altText = String(formData.get("altText") ?? "");
    const order = Number(formData.get("order") ?? "0");
    const rawMediaType = String(formData.get("mediaType") ?? MediaType.IMAGE);
    const mediaType = Object.values(MediaType).includes(rawMediaType as MediaType)
      ? (rawMediaType as MediaType)
      : MediaType.IMAGE;

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "File is required." }, { status: 400 });
    }

    if (!file.type.startsWith(getAllowedPrefix(mediaType))) {
      return NextResponse.json(
        { success: false, error: mediaType === MediaType.IMAGE ? "Choose an image file." : "Choose a video file." },
        { status: 400 }
      );
    }

    const payload: UploadPayload = { propertyId, altText, order: String(order), mediaType };
    if (!payload.propertyId) {
      return NextResponse.json({ success: false, error: "propertyId is required." }, { status: 400 });
    }

    const existing = await prisma.property.findUnique({
      where: { id: payload.propertyId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Property not found." }, { status: 404 });
    }

    if (payload.mediaType === MediaType.TOUR) {
      const existingTour = await prisma.propertyMedia.findFirst({
        where: { propertyId: payload.propertyId, mediaType: MediaType.TOUR },
        select: { id: true },
      });

      if (existingTour) {
        return NextResponse.json(
          { success: false, error: "Remove the existing tour video before uploading another one." },
          { status: 409 }
        );
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadPropertyMedia(buffer, file.name, payload.propertyId, payload.mediaType);

    const media = await prisma.propertyMedia.create({
      data: {
        propertyId: payload.propertyId,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl ?? null,
        publicId: uploadResult.publicId,
        mediaType: payload.mediaType,
        altText: payload.altText || null,
        order: Number.isFinite(order) ? order : 0,
      },
      select: {
        id: true,
        propertyId: true,
        url: true,
        thumbnailUrl: true,
        publicId: true,
        mediaType: true,
        altText: true,
        order: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      ...media,
    });
  } catch (error: unknown) {
    console.error("Media upload failed", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload media.",
      },
      { status: 500 }
    );
  }
}
