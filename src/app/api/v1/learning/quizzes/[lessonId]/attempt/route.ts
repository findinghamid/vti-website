import { NextRequest } from "next/server";
import { AssessmentService } from "@/server/services/assessment.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const { userId } = await getCartUserId();

    if (!lessonId) {
      throw new ValidationError("lessonId is required to submit attempt.");
    }

    const body = await request.json();
    const { answers } = body;

    if (!Array.isArray(answers)) {
      throw new ValidationError("answers array is required.");
    }

    const result = await AssessmentService.submitQuizAttempt(userId, lessonId, answers);
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
