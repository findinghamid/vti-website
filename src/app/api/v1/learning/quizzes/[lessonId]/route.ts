import { NextRequest } from "next/server";
import { AssessmentService } from "@/server/services/assessment.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    if (!lessonId) {
      throw new ValidationError("lessonId is required to fetch quiz.");
    }

    const quiz = await AssessmentService.getQuizByLessonId(lessonId);
    return apiSuccess(quiz);
  } catch (error) {
    return handleApiError(error);
  }
}
