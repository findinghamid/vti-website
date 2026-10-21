import { NextRequest } from "next/server";
import { LearningService } from "@/server/services/learning.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await getCartUserId();
    const { slug } = await context.params;
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lesson") || undefined;

    const playerContext = await LearningService.getCoursePlayerContext(userId, slug, lessonId);
    return apiSuccess(playerContext);
  } catch (error) {
    return handleApiError(error);
  }
}
