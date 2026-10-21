import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LearningService } from "@/server/services/learning.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { CoursePlayerClient } from "@/components/player/CoursePlayerClient";

interface LecturePageProps {
  params: Promise<{ slug: string; lessonId: string }>;
}

export async function generateMetadata({ params }: LecturePageProps): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const { userId } = await getCartUserId();

  try {
    const context = await LearningService.getCoursePlayerContext(userId, slug, lessonId);
    return {
      title: `${context.currentLesson.title} | ${context.course.title}`,
      description: `Watch lecture ${context.currentLesson.title} on VTI Marketplace LMS`,
    };
  } catch {
    return {
      title: "Course Lecture | VTI Marketplace LMS",
    };
  }
}

export default async function LecturePage({ params }: LecturePageProps) {
  const { slug, lessonId } = await params;
  const { userId } = await getCartUserId();

  try {
    const playerContext = await LearningService.getCoursePlayerContext(userId, slug, lessonId);
    return <CoursePlayerClient initialContext={playerContext} />;
  } catch (error: any) {
    if (error.statusCode === 403) {
      redirect(`/courses/${slug}`);
    }
    notFound();
  }
}
