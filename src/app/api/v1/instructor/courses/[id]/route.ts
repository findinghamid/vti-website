import { NextRequest } from "next/server";
import { InstructorService } from "@/server/services/instructor.service";
import { requireRole } from "@/server/auth/rbac";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, NotFoundError } from "@/server/api/errors";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getInstructorUser();
    const { id } = await params;
    if (!id) throw new NotFoundError("Course ID is required");

    const course = await InstructorService.getCourseForEdit(user.id, id);
    const audit = InstructorService.evaluatePrePublishReadiness(course);

    return apiSuccess({ course, audit });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getInstructorUser();
    const { id } = await params;
    if (!id) throw new NotFoundError("Course ID is required");

    const body = await request.json();
    const updated = await InstructorService.updateCourseDraft(user.id, id, body);
    const audit = InstructorService.evaluatePrePublishReadiness(updated);

    return apiSuccess({ course: updated, audit });
  } catch (error) {
    return handleApiError(error);
  }
}
