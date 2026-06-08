import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const authMiddleware = withAuth(
  function middleware(req) {
    // 1. Generate a unique, random cryptographic nonce for this request
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

    // 2. Define the Content Security Policy with your external services whitelisted
    const cspHeader = `
      default-src 'self';

      script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
        process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""
      } https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com;

      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;

      img-src 'self' blob: data: https://res.cloudinary.com https://*.tile.openstreetmap.org https://unpkg.com;

      font-src 'self' https://fonts.gstatic.com;

      connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://api.resend.com;

      frame-src 'self' https://search.google.com;

      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `
      .replace(/\s{2,}/g, " ")
      .trim();

    // 3. Clone request headers and inject the nonce + CSP so Next.js components can read them
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", cspHeader);

    // 4. Pass the modified headers to the application routing system
    const response = NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });

    // 5. Explicitly apply the CSP header to the outgoing browser response
    response.headers.set("Content-Security-Policy", cspHeader);

    // 6. FIXES THE ALERT: Anti-Clickjacking for legacy/all browsers
    response.headers.set("X-Frame-Options", "DENY");

    // 7. BONUS FIXES: Resolves the other yellow flags in your scanner image
    response.headers.set("X-Content-Type-Options", "nosniff"); // Fixes "X-Content-Type-Options Header Missing"
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    ); // Fixes "Strict-Transport-Security Header Not Set"
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    ); // Extra browser hardening
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

// Configuration matcher updated to cover dashboard AND app entry points to ensure CSP coverage
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
};
