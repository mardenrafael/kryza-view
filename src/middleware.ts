import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getSubdomain } from "@/lib/utils";
import { ErrorType } from "@/lib/error-types";
import { createLoggerContext } from "@/lib/logger";

const PUBLIC_ROUTES = ["/login", "/signup", "/uploads"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requestId = crypto.randomUUID();
  const log = createLoggerContext(requestId);
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  const isRootPath = pathname === "/";
  const isPublicPath = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  log.info({ pathname, requestId }, "Request received");

  const host = req.headers.get("host");
  const subdomain = getSubdomain(host);

  if (!subdomain) {
    const errorUrl = new URL("/error", req.url);
    errorUrl.searchParams.set("error", ErrorType.SUBDOMAIN_NOT_FOUND);

    log.warn(
      { subdomain, requestId },
      "No subdomain found, redirecting to error page."
    );
    return setRequestIdOnResponseHeaders(
      NextResponse.redirect(errorUrl),
      requestId
    );
  }

  if (isRootPath || isPublicPath) {
    log.info(
      { pathname, requestId },
      "Public route or root path accessed, allowinraccess."
    );
    return setRequestIdOnResponseHeaders(NextResponse.next(), requestId);
  }

  log.info(
    { pathname, requestId },
    "Private route accessed, checking authentication."
  );
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  log.debug(token, "Token retrieved");

  if (!token) {
    log.warn("No token found, redirecting to login page.");
    return setRequestIdOnResponseHeaders(
      NextResponse.redirect(loginUrl),
      requestId
    );
  }

  log.debug({ tenantId: token.tenantId }, "Token.tenantId");

  if (!token.tenantId) {
    log.warn("No tenant found");
    return setRequestIdOnResponseHeaders(
      NextResponse.redirect(loginUrl),
      requestId
    );
  }

  return setRequestIdOnResponseHeaders(NextResponse.next(), requestId);
}

function setRequestIdOnResponseHeaders(
  res: NextResponse,
  requestId: string
): NextResponse {
  res.headers.set("x-request-id", requestId);
  return res;
}

export const config = {
  matcher: [
    "/((?!api/auth|api/tenant|error|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
