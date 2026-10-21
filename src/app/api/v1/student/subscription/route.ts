import { SubscriptionService } from "@/server/services/subscription.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET() {
  try {
    const { userId } = await getCartUserId();
    const subscription = await SubscriptionService.getUserActiveSubscription(userId);

    return apiSuccess({ subscription });
  } catch (error) {
    return handleApiError(error);
  }
}
