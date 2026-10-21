import { getCartUserId } from "@/server/auth/cart-session";
import { PayoutService } from "@/server/services/payout.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET() {
  try {
    const { userId } = await getCartUserId();

    const [balance, payouts] = await Promise.all([
      PayoutService.getInstructorBalance(userId),
      PayoutService.getInstructorPayouts(userId),
    ]);

    return apiSuccess({
      balance,
      payouts,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
