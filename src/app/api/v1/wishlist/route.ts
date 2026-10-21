import { NextRequest } from "next/server";
import { WishlistService } from "@/server/services/wishlist.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function GET() {
  try {
    const { userId } = await getCartUserId();
    const items = await WishlistService.getWishlist(userId);
    return apiSuccess({ items, count: items.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getCartUserId();
    const body = await request.json();

    const courseIdentifier = body.courseId || body.slug;
    if (!courseIdentifier) {
      throw new ValidationError("courseId or slug is required to update wishlist.");
    }

    const result = await WishlistService.toggleWishlist(userId, courseIdentifier);
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
