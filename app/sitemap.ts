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

  // Note: If you fetch dynamic properties from a database later,
  // you can fetch them here and map them to additional entries.

  return [...routes];
}
