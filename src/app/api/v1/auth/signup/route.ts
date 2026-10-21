import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SignupSchema } from "@/server/auth/schema";
import { AuthService } from "@/server/services/auth.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from "@/server/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = SignupSchema.parse(body);

    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");

    const { user, session } = await AuthService.registerStudent(validated, ipAddress, userAgent);

    // Set HTTP-only secure cookie
    const cookieStore = await cookies();
    const cookieOptions = getSessionCookieOptions(session.expiresAt);
    cookieStore.set(SESSION_COOKIE_NAME, session.token, cookieOptions);

    return apiSuccess({ user }, { message: "Account created successfully" }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
