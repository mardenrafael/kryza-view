import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getSubdomain } from "@/lib/utils";
import { ErrorType } from "@/lib/error-types";

const PUBLIC_ROUTES = ["/login", "/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", pathname);

  console.log("Middleware triggered for path:", pathname);

  const isRootPath = pathname === "/";
  const isPublicPath = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const host = req.headers.get("host");
  const subdomain = getSubdomain(host);

  if (!subdomain) {
    const errorUrl = new URL("/error", req.url);
    errorUrl.searchParams.set("error", ErrorType.SUBDOMAIN_NOT_FOUND);

    console.log("No subdomain found, redirecting to error page.");
    return NextResponse.redirect(errorUrl);
  }

  if (isRootPath || isPublicPath) {
    console.log("Public route accessed, allowing access.");
    return NextResponse.next();
  }

  console.log("Private route accessed.");
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  console.log("Token", token);

  if (!token) {
    console.log("No token found, redirecting to login page.");
    return NextResponse.redirect(loginUrl);
  }

  console.log("Token.tenantId", token.tenantId);

  if (!token.tenantId) {
    console.log("No tenant found");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|api/tenant|error|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
