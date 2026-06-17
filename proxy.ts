import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const authMiddleware = withAuth(
  function middleware(req) {
    // 1. Bypass all middleware logic for search engine crawlers
    const userAgent = req.headers.get("user-agent") || "";
    const isSearchBot = /googlebot|bingbot|yandexbot|duckduckbot|slurp/i.test(
      userAgent
    );

    if (isSearchBot) {
      return NextResponse.next();
    }

    // 2. Generate a unique cryptographic nonce for this request
    // const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

    // 3. Define the Content Security Policy
    const cspHeader = `
      default-src 'self';

      script-src 'self' 'unsafe-inline' ${
        process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""
      } https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://mc.yandex.ru https://yastatic.net;

      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;

      img-src 'self' blob: data: https://res.cloudinary.com https://*.tile.openstreetmap.org https://unpkg.com;

      font-src 'self' https://fonts.gstatic.com;

      connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://api.resend.com https://mc.yandex.ru;

      frame-src 'self' https://search.google.com;

      child-src 'self' blob:;


      object-src 'none';
      base-uri 'self';
      form-action 'self';

      frame-ancestors 'self' https://metrika.yandex.ru https://*.webvisor.com;
      ${process.env.NODE_ENV === "production" ? "upgrade-insecure-requests;" : ""}
    `
      .replace(/\s{2,}/g, " ")
      .trim();

    // 4. Inject nonce + CSP into request headers so Next.js components can read them
    const requestHeaders = new Headers(req.headers);
    // requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", cspHeader);

    // 5. Forward the modified headers into the routing system
    const response = NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });

    // 6. Apply CSP and all security headers to the outgoing browser response
    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith("/admin/dashboard/users")) {
          return token?.role === "SUPER_ADMIN";
        }
        if (pathname.startsWith("/admin/dashboard")) {
          return (
            token?.role === "SUPER_ADMIN" ||
            token?.role === "ADMIN" ||
            token?.role === "VIEWER"
          );
        }
        return true;
      }
    }
  }
);

export default authMiddleware;
export { authMiddleware as proxy };

// Excludes API, Next.js internals, favicon, sitemap, robots, and all static
// public file extensions from running through the middleware entirely
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|woff2|css|js)$).*)"
  ]
};
