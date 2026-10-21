import { NextRequest } from "next/server";
import { OrderService } from "@/server/services/order.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET() {
  try {
    const { userId } = await getCartUserId();
    const orders = await OrderService.getUserOrders(userId);
    return apiSuccess({ orders, count: orders.length });
  } catch (error) {
    return handleApiError(error);
  }
}
