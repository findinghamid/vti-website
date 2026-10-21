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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    const user = await getInstructorUser();
    const { id, sectionId } = await params;
    if (!id || !sectionId) throw new NotFoundError("Course ID and Section ID are required");

    const result = await InstructorService.deleteSection(user.id, id, sectionId);
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
