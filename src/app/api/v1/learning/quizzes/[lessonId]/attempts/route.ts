import { NextRequest } from "next/server";
import { AssessmentService } from "@/server/services/assessment.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const { userId } = await getCartUserId();

    if (!lessonId) {
      throw new ValidationError("lessonId is required to fetch past attempts.");
    }

    const attempts = await AssessmentService.getQuizAttempts(userId, lessonId);
    return apiSuccess({ attempts });
  } catch (error) {
    return handleApiError(error);
  }
}
