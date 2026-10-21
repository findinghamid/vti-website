import { NextRequest } from "next/server";
import { CertificateService } from "@/server/services/certificate.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getCartUserId();
    const certificates = await CertificateService.getUserCertificates(userId);
    return apiSuccess({ certificates });
  } catch (error) {
    return handleApiError(error);
  }
}
