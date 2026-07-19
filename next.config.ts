import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security & Privacy Headers
          {
            key: "Content-Security-Policy",
            // This CSP allows your site to function while blocking the vulnerabilties you mentioned.
            // It explicitly whitelists Google Tag Manager, Analytics, and map tile servers.
            value: `default-src 'self';
               script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;
               img-src 'self' blob: data: https://res.cloudinary.com https://*.tile.openstreetmap.org https://unpkg.com;
               font-src 'self' https://fonts.gstatic.com;
               connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://api.resend.com;
               frame-src 'self' https://search.google.com;
               object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;`
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ];
  }, */
  poweredByHeader: false, // Enforces consistent URL patterns, eliminating the automatic 308 redirect mismatch
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  }
};

export default nextConfig;
