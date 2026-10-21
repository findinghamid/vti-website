import { NextRequest } from "next/server";
import { OrderService } from "@/server/services/order.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, NotFoundError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getCartUserId();
    const { id } = await context.params;

    const order = await OrderService.getOrderById(id, userId);
    if (!order) {
      throw new NotFoundError("Order");
    }

    return apiSuccess(order);
  } catch (error) {
    return handleApiError(error);
  }
}
