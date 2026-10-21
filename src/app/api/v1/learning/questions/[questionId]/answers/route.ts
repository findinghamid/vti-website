import { NextRequest } from "next/server";
import { CommunityService } from "@/server/services/community.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;
    const { userId } = await getCartUserId();

    const body = await request.json();
    const { body: answerBody, authorName } = body;

    if (!questionId) {
      throw new ValidationError("questionId is required.");
    }

    if (!answerBody) {
      throw new ValidationError("body is required to post an answer.");
    }

    const answer = await CommunityService.createAnswer(
      userId,
      questionId,
      answerBody,
      authorName || "Participant"
    );

    return apiSuccess(answer);
  } catch (error) {
    return handleApiError(error);
  }
}
