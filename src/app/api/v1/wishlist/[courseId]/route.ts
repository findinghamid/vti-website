import { NextRequest } from "next/server";
import { WishlistService } from "@/server/services/wishlist.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await getCartUserId();
    const { courseId } = await context.params;

    await WishlistService.removeFromWishlist(userId, courseId);
    return apiSuccess({ success: true, message: "Course removed from wishlist." });
  } catch (error) {
    return handleApiError(error);
  }
}
