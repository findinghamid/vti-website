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
      throw new ValidationError("lessonId is required to fetch coding exercise.");
    }

    const exercise = await AssessmentService.getCodingExercise(lessonId);
    return apiSuccess(exercise);
  } catch (error) {
    return handleApiError(error);
  }
}
