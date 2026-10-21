import { SubscriptionService } from "@/server/services/subscription.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET() {
  try {
    const plans = await SubscriptionService.getSubscriptionPlans();
    return apiSuccess({ plans });
  } catch (error) {
    return handleApiError(error);
  }
}
