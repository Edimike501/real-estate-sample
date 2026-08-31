import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export type UploadResult = {
  url: string;
  thumbnailUrl?: string;
  publicId: string;
};

type PropertyMediaType = "IMAGE" | "VIDEO" | "TOUR";

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export async function uploadPropertyMedia(
  buffer: Buffer,
  fileName: string,
  propertyId: string,
  mediaType: PropertyMediaType = "IMAGE"
): Promise<UploadResult> {
  if (mediaType !== "IMAGE") {
    return uploadPropertyVideo(buffer, fileName, propertyId, mediaType);
  }

  const [compressed, thumbnail] = await Promise.all([
    sharp(buffer)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true })
      .toBuffer(),
    sharp(buffer)
      .rotate()
      .resize({ width: 600, height: 400, fit: "cover" })
      .jpeg({ quality: 75 })
      .toBuffer()
  ]);

  const safeBaseName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  const uniqueBaseName = `${safeBaseName || "property-media"}-${Date.now()}`;

  if (!hasCloudinaryConfig()) {
    return saveLocalPropertyMedia(
      compressed,
      thumbnail,
      uniqueBaseName,
      propertyId
    );
  }

  const folder = `aura-luxury/properties/${propertyId}`;
  const [main, thumb] = await Promise.all([
    uploadBuffer(compressed, `${folder}/${uniqueBaseName}`),
    uploadBuffer(thumbnail, `${folder}/thumbs/${uniqueBaseName}`)
  ]);

  return {
    url: main.secure_url,
    thumbnailUrl: thumb.secure_url,
    publicId: main.public_id
  };
}

export async function deletePropertyMedia(
  publicId: string,
  mediaType: PropertyMediaType = "IMAGE"
): Promise<void> {
  if (!publicId) return;

  if (publicId.startsWith("local:")) {
    await deleteLocalPropertyMedia(publicId);
    return;
  }

  const resourceType = mediaType === "IMAGE" ? "image" : "video";
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

  if (mediaType === "IMAGE") {
    const thumbnailPublicId = getThumbnailPublicId(publicId);
    if (thumbnailPublicId) {
      await cloudinary.uploader.destroy(thumbnailPublicId, { resource_type: "image" });
    }
  }
}

async function uploadPropertyVideo(
  buffer: Buffer,
  fileName: string,
  propertyId: string,
  mediaType: Exclude<PropertyMediaType, "IMAGE">
): Promise<UploadResult> {
  const safeBaseName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  const uniqueBaseName = `${safeBaseName || "property-video"}-${Date.now()}`;

  if (!hasCloudinaryConfig()) {
    return saveLocalPropertyVideo(buffer, fileName, uniqueBaseName, propertyId, mediaType);
  }

  const folder = `aura-luxury/properties/${propertyId}/${mediaType === "TOUR" ? "tours" : "videos"}`;
  const upload = await uploadBuffer(buffer, `${folder}/${uniqueBaseName}`, "video");

  return {
    url: upload.secure_url,
    publicId: upload.public_id
  };
}

async function saveLocalPropertyMedia(
  compressed: Buffer,
  thumbnail: Buffer,
  baseName: string,
  propertyId: string
): Promise<UploadResult> {
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "properties",
    propertyId
  );
  const thumbDir = path.join(uploadDir, "thumbs");
  await Promise.all([
    mkdir(uploadDir, { recursive: true }),
    mkdir(thumbDir, { recursive: true })
  ]);

  const imageName = `${baseName}.jpg`;
  await Promise.all([
    writeFile(path.join(uploadDir, imageName), compressed),
    writeFile(path.join(thumbDir, imageName), thumbnail)
  ]);

  const url = `/uploads/properties/${propertyId}/${imageName}`;
  return {
    url,
    thumbnailUrl: `/uploads/properties/${propertyId}/thumbs/${imageName}`,
    publicId: `local:${url}`
  };
}

async function saveLocalPropertyVideo(
  buffer: Buffer,
  fileName: string,
  baseName: string,
  propertyId: string,
  mediaType: Exclude<PropertyMediaType, "IMAGE">
): Promise<UploadResult> {
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "properties",
    propertyId,
    mediaType === "TOUR" ? "tours" : "videos"
  );
  await mkdir(uploadDir, { recursive: true });

  const extension = path.extname(fileName).toLowerCase() || ".mp4";
  const videoName = `${baseName}${extension}`;
  await writeFile(path.join(uploadDir, videoName), buffer);

  const url = `/uploads/properties/${propertyId}/${mediaType === "TOUR" ? "tours" : "videos"}/${videoName}`;
  return {
    url,
    publicId: `local:${url}`
  };
}

async function deleteLocalPropertyMedia(publicId: string): Promise<void> {
  const relativeUrl = publicId.replace(/^local:/, "");
  if (!relativeUrl.startsWith("/uploads/properties/")) return;

  await unlink(path.join(process.cwd(), "public", relativeUrl)).catch(() => undefined);

  if (!relativeUrl.includes("/thumbs/")) {
    const parsed = path.parse(relativeUrl);
    const thumbUrl = path.join(parsed.dir, "thumbs", parsed.base);
    await unlink(path.join(process.cwd(), "public", thumbUrl)).catch(() => undefined);
  }
}

function getThumbnailPublicId(publicId: string): string | null {
  const lastSlash = publicId.lastIndexOf("/");
  if (lastSlash === -1) return null;
  return `${publicId.slice(0, lastSlash)}/thumbs/${publicId.slice(lastSlash + 1)}`;
}

function uploadBuffer(
  buffer: Buffer,
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { public_id: publicId, resource_type: resourceType },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id
          });
        }
      )
      .end(buffer);
  });
}
