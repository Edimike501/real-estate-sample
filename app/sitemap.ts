import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Force sanitize the baseUrl so it NEVER ends with a trailing slash
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.auraluxuryproperties.com";
  const baseUrl = rawBaseUrl.replace(/\/$/, "");

  // 2. Clear explicit base routes mappings
  const baseRoutes = [
    {
      url: `${baseUrl}/`, // Explicit root domain slash (Standard XML Requirement)
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/properties`, // Clean canonical route (No trailing slash)
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/contact`, // Clean canonical route (No trailing slash)
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.8
    }
  ];

  // 3. Dynamic property routes pipeline
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const properties = await prisma.property.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true }
    });

    propertyRoutes = properties.map((property) => ({
      // Clean, un-slashed parent container path mapping
      url: `${baseUrl}/properties/${property.slug}`,
      lastModified: property.updatedAt.toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.9
    }));
  } catch (error) {
    // Graceful fallback to static core routes on DB connection failures
    console.error("Failed to fetch properties for sitemap:", error);
  }

  return [...baseRoutes, ...propertyRoutes];
}
