import { NextRequest } from "next/server";
import { CommunityService } from "@/server/services/community.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;

    if (!questionId) {
      throw new ValidationError("questionId is required.");
    }

    const thread = await CommunityService.getQuestionThread(questionId);
    return apiSuccess(thread);
  } catch (error) {
    return handleApiError(error);
  }
}
