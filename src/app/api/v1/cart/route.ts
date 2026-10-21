import { NextRequest } from "next/server";
import { CartService } from "@/server/services/cart.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET(request: NextRequest) {
  try {
    const { userId, isGuest, guestId } = await getCartUserId(request.headers);
    const { searchParams } = new URL(request.url);
    const couponCode = searchParams.get("coupon") || undefined;

    // Merge guest cart if newly logged in
    if (!isGuest && guestId && guestId !== userId) {
      await CartService.mergeGuestCart(userId, guestId);
    }

    const cart = await CartService.getCart(userId, couponCode);
    const response = apiSuccess(cart);
    if (isGuest && userId) {
      response.cookies.set("vti_guest_cart_id", userId, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await getCartUserId(request.headers);
    const cart = await CartService.clearCart(userId);
    return apiSuccess(cart);
  } catch (error) {
    return handleApiError(error);
  }
}
