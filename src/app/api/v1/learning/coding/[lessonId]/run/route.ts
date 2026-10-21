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
      throw new ValidationError("lessonId is required to run coding exercise.");
    }

    const body = await request.json();
    const { code, language = "javascript" } = body;

    if (typeof code !== "string") {
      throw new ValidationError("code must be a string.");
    }

    const result = await AssessmentService.executeCodingExercise(userId, lessonId, code, language);
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
