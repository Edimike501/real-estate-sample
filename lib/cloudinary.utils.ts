/**
 * Cloudinary transformation options
 */
export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: string; // e.g., 'fill', 'scale', 'thumb'
  quality?: string; // e.g., 'auto', 'auto:eco', '80'
  format?: string; // e.g., 'auto'
  aspectRatio?: string; // e.g., '3:4', '1:1'
  additionalTransformations?: string;
}

/**
 * Injects transformation parameters into a Cloudinary image URL.
 * Defaults to f_auto and q_auto for optimization.
 *
 * Example URL: https://res.cloudinary.com/demo/image/upload/v12345/sample.jpg
 * Becomes: https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_500/v12345/sample.jpg
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!url || !url.includes("cloudinary.com")) return url;

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    aspectRatio,
    additionalTransformations
  } = options;

  // Build transformation string
  const transformations: string[] = [];

  if (format) transformations.push(`f_${format}`);
  if (quality) transformations.push(`q_${quality}`);
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop && (width || height || aspectRatio))
    transformations.push(`c_${crop}`);
  if (aspectRatio) transformations.push(`ar_${aspectRatio}`);
  if (additionalTransformations)
    transformations.push(additionalTransformations);

  const transformationStr = transformations.join(",");

  // Cloudinary URLs usually have /upload/ followed by version or public_id
  // We want to insert transformations after /upload/
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;

  const preUpload = url.substring(0, uploadIndex + 8);
  const postUpload = url.substring(uploadIndex + 8);

  // If there are already transformations (e.g., v1234567 is not a transformation, but v prefixed numeric is a version)
  // We check if the next part is a transformation segment (not starting with v followed by numbers)
  // However, a simple insertion after /upload/ usually works fine as Cloudinary handles chained transformations.

  return `${preUpload}${transformationStr}/${postUpload}`;
}

/**
 * Extracts the public ID from a Cloudinary URL or returns the input if it's not a Cloudinary URL.
 * Also handles basic cleanup of the ID (removing version, extension).
 */
export function getPublicIdFromUrl(url: string) {
  if (!url) return "";

  // 1. Split by "/upload/" to separate the domain from the asset path
  const parts = url.split("/upload/");
  if (parts.length < 2) return url; // Return original if pattern not found

  // 2. Take the second part: "v1767181031/vicelamoda-pic16_ipzx0s.jpg"
  let path = parts[1];

  // 3. Remove version number (e.g., "v12345/") if it exists
  path = path.replace(/^v\d+\//, "");

  // 4. Remove the file extension (e.g., ".jpg", ".png")
  path = path.replace(/\.[^/.]+$/, "");

  return path;
}
