import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/server";
import { TOKEN_COOKIE } from "@/lib/auth/token";
import { isPublicBrowsingPath } from "@/lib/auth/paths";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;
  const isAuthenticated = Boolean(payload);

  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/auth/google") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/contact") ||
    isPublicBrowsingPath(pathname);

  if (isPublicPath) {
    if (isAuthenticated) {
      // Only redirect away from auth pages (login/register/google callback).
      // The home page and browsing pages are public for everyone, logged in or not.
      const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/auth/google");

      if (isAuthPage) {
        return NextResponse.redirect(
          new URL(payload!.role === "admin" ? "/dashboard" : "/my-dashboard", request.url),
        );
      }
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminOnlyPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/products/new") ||
    (pathname.startsWith("/products/") && pathname.endsWith("/edit")) ||
    (pathname.startsWith("/users/") && pathname.endsWith("/edit")) ||
    (pathname.startsWith("/categories/") && pathname.endsWith("/edit"));

  if (isAdminOnlyPath && payload!.role !== "admin") {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
