import React from "react";
import { getCartUserId } from "@/server/auth/cart-session";
import { InstructorAnalyticsService } from "@/server/services/instructor-analytics.service";
import { PayoutService } from "@/server/services/payout.service";
import { InstructorDashboardClient } from "@/components/instructor/InstructorDashboardClient";

export const metadata = {
  title: "Instructor Studio Dashboard | VTI Marketplace LMS",
  description: "Monitor real-time revenue analytics, student enrollment velocity, and course catalog performance.",
};

export default async function InstructorDashboardPage() {
  const { userId } = await getCartUserId();

  const [summary, courses, revenueSeries, recentEnrollments, balance] = await Promise.all([
    InstructorAnalyticsService.getInstructorSummary(userId),
    InstructorAnalyticsService.getCoursePerformance(userId),
    InstructorAnalyticsService.getRevenueTimeSeries(userId, 30),
    InstructorAnalyticsService.getRecentEnrollments(userId, 8),
    PayoutService.getInstructorBalance(userId),
  ]);

  return (
    <InstructorDashboardClient
      initialSummary={summary}
      initialCourses={courses}
      initialRevenueSeries={revenueSeries}
      initialRecentEnrollments={recentEnrollments}
      initialBalance={balance}
    />
  );
}
