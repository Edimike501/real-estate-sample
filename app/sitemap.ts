import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.opolloluxuries.com";

  // Base routes
  const routes = ["", "/properties", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8
  }));

  // Dynamic property routes
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const properties = await prisma.property.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true }
    });

    propertyRoutes = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.slug}`,
      lastModified: property.updatedAt.toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.7
    }));
  } catch (error) {
    // Fallback to static routes only on error
    console.error("Failed to fetch properties for sitemap:", error);
  }

  return [...routes, ...propertyRoutes];
}
