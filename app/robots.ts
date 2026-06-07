import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"] // Protect sensitive routes if any
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.opolloluxuries.com"}/sitemap.xml`
  };
}
