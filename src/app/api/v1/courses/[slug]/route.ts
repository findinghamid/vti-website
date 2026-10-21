import { NextRequest } from "next/server";
import { CourseService } from "@/server/services/course.service";
import { apiSuccess } from "@/server/api/response";
import { NotFoundError, handleApiError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      throw new NotFoundError("Course slug is required");
    }

    const course = await CourseService.getCourseBySlug(slug);
    if (!course) {
      throw new NotFoundError(`Course with slug '${slug}' not found`);
    }

    return apiSuccess(course);
  } catch (error) {
    return handleApiError(error);
  }
}
