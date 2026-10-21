import { NextRequest } from "next/server";
import { CartService } from "@/server/services/cart.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function POST(request: NextRequest) {
  try {
    const { userId, isGuest } = await getCartUserId(request.headers);
    const body = await request.json();

    const courseIdentifier = body.courseId || body.slug;
    if (!courseIdentifier) {
      throw new ValidationError("courseId or slug is required to add an item to the cart.");
    }

    const couponCode = body.couponCode || undefined;
    const cart = await CartService.addToCart(userId, courseIdentifier, couponCode);

    const response = apiSuccess(cart, undefined, 201);
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
