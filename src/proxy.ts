import { NextResponse, type NextRequest } from "next/server";
import { RateLimiter } from "@/server/security/rate-limiter";

const SESSION_COOKIE_NAME = "vti_session";

// Route prefixes that require authentication
const PROTECTED_PREFIXES = ["/student", "/instructor", "/admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. Rate Limiting for Sensitive Endpoints
  if (pathname.startsWith("/api/v1/auth/login") || pathname.startsWith("/api/v1/auth/signup")) {
    const rateCheck = RateLimiter.check(`auth:${ip}`, 20, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "TOO_MANY_REQUESTS",
            message: "Too many authentication attempts. Please try again later.",
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateCheck.resetSec.toString(),
            "X-RateLimit-Limit": rateCheck.limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  }

  // 2. Authentication Route Protection
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required to access this endpoint",
          },
        },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Response with OWASP Security Headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/student/:path*",
    "/instructor/:path*",
    "/admin/:path*",
    "/api/v1/auth/:path*",
    "/api/v1/student/:path*",
    "/api/v1/instructor/:path*",
    "/api/v1/admin/:path*",
  ],
};
