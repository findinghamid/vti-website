import { NextRequest } from "next/server";
import { getSessionFromCookies } from "@/server/auth/session";
import { getCartUserId } from "@/server/auth/cart-session";
import { EnrollmentService } from "@/server/services/enrollment.service";
import { CourseService } from "@/server/services/course.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError, NotFoundError } from "@/server/api/errors";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { courseId, slug } = body as { courseId?: string; slug?: string };

    if (!courseId && !slug) {
      throw new ValidationError("Either courseId or slug is required for enrollment");
    }

    // Determine the active user (either logged-in session or active client cookie id)
    const session = await getSessionFromCookies();
    let userId = session?.user?.id;

    if (!userId) {
      const cartUser = await getCartUserId();
      userId = cartUser.userId;
    }

    // Resolve course
    let targetCourseId = courseId;
    let targetSlug = slug;

    if (slug && !courseId) {
      const course = await CourseService.getCourseBySlug(slug);
      if (!course) {
        throw new NotFoundError(`Theological course with slug "${slug}" not found`);
      }
      targetCourseId = course.id;
      targetSlug = course.slug;
    } else if (courseId && !slug) {
      try {
        const course = await prisma.course.findUnique({
          where: { id: courseId },
          select: { id: true, slug: true },
        });
        if (course) {
          targetCourseId = course.id;
          targetSlug = course.slug;
        }
      } catch {
        // Fallback
      }
    }

    if (!targetCourseId) {
      throw new NotFoundError("Course could not be resolved");
    }

    // Check if already enrolled
    const isAlreadyEnrolled = await EnrollmentService.isEnrolled(userId, targetCourseId);
    if (!isAlreadyEnrolled) {
      await EnrollmentService.provisionEnrollments(userId, [targetCourseId]);
    }

    return apiSuccess({
      enrolled: true,
      alreadyEnrolled: isAlreadyEnrolled,
      courseId: targetCourseId,
      slug: targetSlug,
      redirectUrl: targetSlug ? `/learn/${targetSlug}` : "/student/learning",
      message: isAlreadyEnrolled
        ? "You are already enrolled in this course."
        : "Successfully enrolled in this free theological course!",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
