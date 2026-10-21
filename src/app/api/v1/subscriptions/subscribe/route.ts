import { NextRequest } from "next/server";
import { SubscriptionService } from "@/server/services/subscription.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getCartUserId();
    const body = await request.json();
    const { planSlug } = body;

    if (!planSlug || typeof planSlug !== "string") {
      throw new ValidationError("planSlug string is required (e.g. 'pro-monthly', 'pro-annual').");
    }

    const subscription = await SubscriptionService.subscribeToPlan(userId, planSlug);

    return apiSuccess({ subscription }, { message: `Subscribed to ${subscription.planName} successfully!` });
  } catch (error) {
    return handleApiError(error);
  }
}
