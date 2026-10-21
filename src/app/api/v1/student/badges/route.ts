import { NextRequest } from "next/server";
import { CertificateService } from "@/server/services/certificate.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getCartUserId();
    const profile = await CertificateService.getUserBadges(userId);
    return apiSuccess(profile);
  } catch (error) {
    return handleApiError(error);
  }
}
