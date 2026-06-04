import { NextRequest, NextResponse } from "next/server";

import { deletePropertyMedia } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const media = await prisma.propertyMedia.findUnique({
      where: { id },
      select: { id: true, publicId: true, mediaType: true },
    });

    if (!media) {
      return NextResponse.json({ success: false, error: "Media not found." }, { status: 404 });
    }

    await deletePropertyMedia(media.publicId, media.mediaType);
    await prisma.propertyMedia.delete({ where: { id: media.id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Media deletion failed", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete media.",
      },
      { status: 500 }
    );
  }
}
