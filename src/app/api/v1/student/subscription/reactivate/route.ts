import { SubscriptionService } from "@/server/services/subscription.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function POST() {
  try {
    const { userId } = await getCartUserId();
    const subscription = await SubscriptionService.reactivateSubscription(userId);

    return apiSuccess({ subscription }, { message: "Subscription reactivated successfully!" });
  } catch (error) {
    return handleApiError(error);
  }
}
