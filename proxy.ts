import { withAuth } from "next-auth/middleware";

const authMiddleware = withAuth(
  function proxy() {
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith("/admin/dashboard/users")) {
          return token?.role === "SUPER_ADMIN";
        }
        if (pathname.startsWith("/admin/dashboard")) {
          return token?.role === "SUPER_ADMIN" || token?.role === "ADMIN" || token?.role === "VIEWER";
        }
        return true;
      },
    },
  }
);

export default authMiddleware;
export { authMiddleware as proxy };

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
