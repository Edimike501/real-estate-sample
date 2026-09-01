import { MediaType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireAdminAuth } from "@/lib/admin-auth";
import { uploadPropertyMedia } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function getAllowedPrefix(mediaType: MediaType) {
  return mediaType === MediaType.IMAGE ? "image/" : "video/";
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) return auth.response;

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
      return NextResponse.json(
        { error: "File is required." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith(getAllowedPrefix(mediaType))) {
      return NextResponse.json(
        {
          error:
            mediaType === MediaType.IMAGE
              ? "Choose an image file."
              : "Choose a video file."
        },
        { status: 400 }
      );
    }

    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId is required." },
        { status: 400 }
      );
    }

    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true }
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Property not found." },
        { status: 404 }
      );
    }

    if (mediaType === MediaType.TOUR) {
      const existingTour = await prisma.propertyMedia.findFirst({
        where: { propertyId, mediaType: MediaType.TOUR },
        select: { id: true }
      });

      if (existingTour) {
        return NextResponse.json(
          {
            error: "Remove the existing tour video before uploading another one."
          },
          { status: 409 }
        );
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadPropertyMedia(
      buffer,
      file.name,
      propertyId,
      mediaType
    );

    const media = await prisma.propertyMedia.create({
      data: {
        propertyId,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl ?? null,
        publicId: uploadResult.publicId,
        mediaType,
        altText: altText || null,
        order: Number.isFinite(order) ? order : 0
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
        createdAt: true
      }
    });

    return NextResponse.json(media);
  } catch (error: unknown) {
    console.error("Admin media upload failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload media." },
      { status: 500 }
    );
  }
}
