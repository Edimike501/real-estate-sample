import { prisma } from "@/lib/prisma";
import type { Property } from "@/types";

/**
 * Fetch a property by slug with all related media
 * @param slug - The property slug
 * @returns Property with media or null if not found
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  return prisma.property.findFirst({
    where: {
      slug,
      deletedAt: null,
    },
    include: {
      media: {
        orderBy: { order: "asc" },
      },
    },
  });
}

/**
 * Format price for display in OG description
 * Converts numeric price to string with currency and frequency if applicable
 */
function formatPrice(
  price: number | undefined | null,
  priceFrequency?: string | null
): string | null {
  if (!price) return null;

  const formatted = price >= 1000000 
    ? `₦${(price / 1000000).toFixed(1)}M` 
    : price >= 1000 
    ? `₦${(price / 1000).toFixed(0)}k` 
    : `₦${price}`;

  if (priceFrequency === "PER_MONTH") return `${formatted}/month`;
  if (priceFrequency === "PER_YEAR") return `${formatted}/year`;
  
  return formatted;
}

/**
 * Build OG description from property specs
 * Format: "₦50M • 3bd 2ba • Victoria Island, Lagos"
 */
export function buildPropertyDescription(property: Property): string {
  const parts: string[] = [];

  // Add price if available
  const priceStr = property.salePrice 
    ? formatPrice(property.salePrice)
    : property.rentalPrice
    ? formatPrice(property.rentalPrice, property.priceFrequency)
    : null;

  if (priceStr) parts.push(priceStr);

  // Add bedrooms and bathrooms if available
  const specs: string[] = [];
  if (property.bedrooms) specs.push(`${property.bedrooms}bd`);
  if (property.bathrooms) specs.push(`${property.bathrooms}ba`);
  if (specs.length > 0) parts.push(specs.join(" "));

  // Add location
  if (property.city || property.state) {
    const location = [property.city, property.state].filter(Boolean).join(", ");
    parts.push(location);
  }

  return parts.join(" • ");
}

/**
 * Optimize Cloudinary URL for OG image dimensions (1200x630)
 * Transform: insert /c_fill,w_1200,h_630/ after cloud name and before public_id
 */
export function optimizeCloudinaryUrl(url: string): string {
  // Pattern: https://res.cloudinary.com/{cloudname}/image/upload/{options}/{public_id}
  const cloudinaryRegex = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload)\//;
  
  if (!cloudinaryRegex.test(url)) {
    return url; // Not a Cloudinary URL, return as-is
  }

  // Check if optimization is already applied
  if (url.includes("/c_fill,w_1200,h_630/")) {
    return url;
  }

  // Insert optimization params after /upload/
  return url.replace(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload)\//,
    "$1/c_fill,w_1200,h_630/"
  );
}
