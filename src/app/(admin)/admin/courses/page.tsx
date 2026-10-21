import React from "react";
import { AdminOperationsService } from "@/server/services/admin-operations.service";
import { AdminCoursesModerationClient } from "@/components/admin/AdminCoursesModerationClient";

export const metadata = {
  title: "Course Moderation Queue | Admin Governance",
  description: "Review instructor course submissions and publish approved courses to the marketplace.",
};

export default async function AdminCoursesPage() {
  const queue = await AdminOperationsService.getModerationQueue();

  return <AdminCoursesModerationClient initialQueue={queue} />;
}
