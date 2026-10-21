import { NextRequest } from "next/server";
import { CommunityService } from "@/server/services/community.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;
    const { userId } = await getCartUserId();

    if (!questionId) {
      throw new ValidationError("questionId is required.");
    }

    const isAnswered = await CommunityService.toggleQuestionAnswered(userId, questionId);
    return apiSuccess({ isAnswered });
  } catch (error) {
    return handleApiError(error);
  }
}
