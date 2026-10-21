import { NextRequest } from "next/server";
import { LearningService } from "@/server/services/learning.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getCartUserId();
    const body = await request.json();
    const { lessonId, positionSec = 0, markComplete = false } = body;

    if (!lessonId) {
      throw new ValidationError("lessonId is required to update progress.");
    }

    const result = await LearningService.updateLessonProgress(
      userId,
      lessonId,
      positionSec,
      markComplete
    );

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
