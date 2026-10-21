import { NextRequest } from "next/server";
import { OrderService } from "@/server/services/order.service";
import { CartService } from "@/server/services/cart.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function POST(request: NextRequest) {
  try {
    const { userId, isGuest, guestId } = await getCartUserId();
    const body = await request.json().catch(() => ({}));

    // If authenticated after adding to guest cart, merge guest items
    if (!isGuest && guestId && guestId !== userId) {
      await CartService.mergeGuestCart(userId, guestId);
    }

    const result = await OrderService.createOrderFromCart(userId, {
      paymentProvider: body.paymentProvider || "MOCK",
      couponCode: body.couponCode,
      billingEmail: body.billingEmail,
      billingName: body.billingName,
    });

    return apiSuccess(result, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
