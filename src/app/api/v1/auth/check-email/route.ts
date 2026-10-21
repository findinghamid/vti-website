import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, BadRequestError } from "@/server/api/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email || !email.includes("@")) {
      throw new BadRequestError("Valid email query parameter is required.");
    }

    const result = await AuthService.checkEmailExists(email);

    return apiSuccess({
      email: email.trim().toLowerCase(),
      exists: result.exists,
      name: result.name ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body?.email;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      throw new BadRequestError("Valid email field is required in request payload.");
    }

    const result = await AuthService.checkEmailExists(email);

    return apiSuccess({
      email: email.trim().toLowerCase(),
      exists: result.exists,
      name: result.name ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
