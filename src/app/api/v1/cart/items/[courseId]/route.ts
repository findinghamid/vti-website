import { NextRequest } from "next/server";
import { CartService } from "@/server/services/cart.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await getCartUserId(request.headers);
    const { courseId } = await context.params;
    const { searchParams } = new URL(request.url);
    const couponCode = searchParams.get("coupon") || undefined;

    const cart = await CartService.removeFromCart(userId, courseId, couponCode);
    return apiSuccess(cart);
  } catch (error) {
    return handleApiError(error);
  }
}
