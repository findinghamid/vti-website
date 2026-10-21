import { NextRequest } from "next/server";
import { CourseService } from "@/server/services/course.service";
import { apiSuccess } from "@/server/api/response";
import { BadRequestError, handleApiError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      throw new BadRequestError("Instructor ID is required");
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 4;

    const courses = await CourseService.getInstructorCourses(id, limit);
    return apiSuccess(courses);
  } catch (error) {
    return handleApiError(error);
  }
}
