import { Metadata } from "next";
import { notFound } from "next/navigation";
import { InstructorService } from "@/server/services/instructor.service";
import { CourseBuilderWizard } from "@/components/course-builder/CourseBuilderWizard";

interface CourseManagePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CourseManagePageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Manage Course | Instructor Studio | VTI Marketplace`,
    description: `Author curriculum, configure pricing, and manage course settings.`,
  };
}

export default async function CourseManagePage({ params }: CourseManagePageProps) {
  const { id } = await params;
  if (!id) notFound();

  // In Next.js App Router server component, load course data
  // In dev / demo, resolves to instructor-persona-demo or authenticated session
  const defaultInstructorId = "instructor-persona-demo";
  const course = await InstructorService.getCourseForEdit(defaultInstructorId, id);
  if (!course) notFound();

  const audit = InstructorService.evaluatePrePublishReadiness(course);

  // Normalize data for CourseBuilderWizard
  const normalizedCourse = {
    id: course.id,
    title: course.title,
    slug: course.slug || "course-draft",
    subtitle: course.subtitle || null,
    description: course.description || null,
    categoryId: course.categoryId || "",
    subcategoryId: course.subcategoryId || null,
    topicId: course.topicId || null,
    level: course.level || ("ALL_LEVELS" as const),
    language: course.language || "English",
    thumbnailUrl: course.thumbnailUrl || null,
    previewVideoUrl: course.previewVideoUrl || null,
    priceAmount: course.priceAmount ?? 0,
    discountAmount: course.discountAmount || null,
    currency: course.currency || "USD",
    status: course.status || ("DRAFT" as const),
    learningOutcomes: course.learningOutcomes || [],
    requirements: course.requirements || [],
    intendedLearners: course.intendedLearners || [],
    sections: (course.sections || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description || null,
      sortOrder: s.sortOrder || 1,
      lessons: (s.lessons || []).map((l: any) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        durationSec: l.durationSec || 0,
        isPreview: Boolean(l.isPreview),
        sortOrder: l.sortOrder || 1,
        mediaUrl: l.mediaUrl || null,
      })),
    })),
  };

  return <CourseBuilderWizard initialCourse={normalizedCourse} initialAudit={audit} />;
}
