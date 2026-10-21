import { NextRequest } from "next/server";
import { InstructorService } from "@/server/services/instructor.service";
import { requireRole } from "@/server/auth/rbac";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";
import { CourseStatus } from "@prisma/client";

async function getInstructorUser() {
  try {
    return await requireRole("INSTRUCTOR", "ADMIN", "SUPER_ADMIN");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      return { id: "instructor-persona-demo", role: "INSTRUCTOR" as const };
    }
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getInstructorUser();
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") as CourseStatus | null;
    const query = searchParams.get("q") || undefined;

    const courses = await InstructorService.getInstructorCourses(user.id, {
      status: statusParam || undefined,
      query,
    });

    const metrics = await InstructorService.getInstructorDashboardMetrics(user.id);

    return apiSuccess({ courses, metrics });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getInstructorUser();
    const body = await request.json();

    const course = await InstructorService.createCourseDraft(user.id, {
      title: body.title,
      categoryId: body.categoryId,
      subcategoryId: body.subcategoryId,
    });

    return apiSuccess(course, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
