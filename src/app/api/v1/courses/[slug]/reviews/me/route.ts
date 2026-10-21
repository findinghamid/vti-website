import { NextRequest } from "next/server";
import { CommunityService } from "@/server/services/community.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId } = await getCartUserId();

    const review = await CommunityService.getUserReview(userId, slug);
    return apiSuccess({ review });
  } catch (error) {
    return handleApiError(error);
  }
}
