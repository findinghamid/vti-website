import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/server/services/auth.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";
import { getSessionFromCookies, SESSION_COOKIE_NAME } from "@/server/auth/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");

    if (token) {
      await AuthService.logout(token, session?.user?.id, ipAddress);
      cookieStore.delete(SESSION_COOKIE_NAME);
    }

    const acceptHeader = request.headers.get("accept") || "";
    const contentType = request.headers.get("content-type") || "";
    const secFetchMode = request.headers.get("sec-fetch-mode") || "";

    // If standard browser form post or navigation, redirect to login page
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      acceptHeader.includes("text/html") ||
      secFetchMode === "navigate"
    ) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl, 303);
    }

    return apiSuccess({ loggedOut: true }, { message: "Logged out successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
