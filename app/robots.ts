import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  /* return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"] // Protect sensitive routes if any
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.auraluxuryproperties.com"}/sitemap.xml`
  }; */
  return {
    rules: [
      // Your default rules for Google and other search engines
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"]
      },
      // Your new targeted rules specifically for Yandex
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/*?sort=", // Prevents Yandex from wasting crawl budget on duplicate sorting pages
          "/*?session_id=" // Blocks session trackers
        ]
      }
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.auraluxuryproperties.com"}/sitemap.xml`
  };
}
