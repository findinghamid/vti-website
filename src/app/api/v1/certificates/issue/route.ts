import { NextRequest } from "next/server";
import { CertificateService } from "@/server/services/certificate.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getCartUserId();
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      throw new ValidationError("courseId is required to issue a certificate.");
    }

    const certificate = await CertificateService.issueCertificate(userId, courseId);
    return apiSuccess({ certificate });
  } catch (error) {
    return handleApiError(error);
  }
}
