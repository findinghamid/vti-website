import { NextRequest } from "next/server";
import { PayoutService } from "@/server/services/payout.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";
import { PayoutStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") as PayoutStatus | null;

    const payouts = await PayoutService.getAllPayouts(statusParam || undefined);
    return apiSuccess({ payouts });
  } catch (error) {
    return handleApiError(error);
  }
}
