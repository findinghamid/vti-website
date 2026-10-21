import { NextRequest } from "next/server";
import { CertificateService } from "@/server/services/certificate.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateNo: string }> }
) {
  try {
    const { certificateNo } = await params;

    if (!certificateNo) {
      throw new ValidationError("certificateNo is required for verification.");
    }

    const result = await CertificateService.getCertificateByNumber(certificateNo);
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
