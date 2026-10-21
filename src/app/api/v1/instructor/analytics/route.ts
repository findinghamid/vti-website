import { getCartUserId } from "@/server/auth/cart-session";
import { InstructorAnalyticsService } from "@/server/services/instructor-analytics.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET() {
  try {
    const { userId } = await getCartUserId();

    const [summary, courses, revenueSeries, recentEnrollments] = await Promise.all([
      InstructorAnalyticsService.getInstructorSummary(userId),
      InstructorAnalyticsService.getCoursePerformance(userId),
      InstructorAnalyticsService.getRevenueTimeSeries(userId, 30),
      InstructorAnalyticsService.getRecentEnrollments(userId, 10),
    ]);

    return apiSuccess({
      summary,
      courses,
      revenueSeries,
      recentEnrollments,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
