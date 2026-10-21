import { NextRequest } from "next/server";
import { getCartUserId } from "@/server/auth/cart-session";
import { PayoutService } from "@/server/services/payout.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getCartUserId();
    const body = await request.json();
    const { amountMinor, payoutMethod, destinationDetails, notes } = body;

    if (!amountMinor || typeof amountMinor !== "number") {
      throw new ValidationError("Valid amountMinor in integer cents is required.");
    }

    if (!payoutMethod || typeof payoutMethod !== "string") {
      throw new ValidationError("payoutMethod is required (e.g. STRIPE_CONNECT, PAYPAL, BANK_WIRE).");
    }

    const payout = await PayoutService.requestPayout(
      userId,
      amountMinor,
      payoutMethod,
      destinationDetails || {},
      notes
    );

    return apiSuccess({ payout }, { message: "Payout request submitted successfully." });
  } catch (error) {
    return handleApiError(error);
  }
}
