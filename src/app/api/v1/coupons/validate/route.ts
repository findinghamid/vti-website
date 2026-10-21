import { NextRequest } from "next/server";
import { CouponService } from "@/server/services/coupon.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotalMinor } = body;

    if (!code || typeof code !== "string") {
      throw new ValidationError("Valid coupon code string is required.");
    }

    if (typeof subtotalMinor !== "number" || subtotalMinor < 0) {
      throw new ValidationError("subtotalMinor must be a positive integer.");
    }

    const result = await CouponService.validateCoupon(code, subtotalMinor);
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
