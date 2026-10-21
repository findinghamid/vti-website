import { NextRequest } from "next/server";
import { EnrollmentService } from "@/server/services/enrollment.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET() {
  try {
    const { userId } = await getCartUserId();
    const enrollments = await EnrollmentService.getUserEnrollments(userId);
    return apiSuccess({ enrollments, count: enrollments.length });
  } catch (error) {
    return handleApiError(error);
  }
}
