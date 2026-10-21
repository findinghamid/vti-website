import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseService } from "@/server/services/course.service";
import { CourseLandingClient } from "@/components/course/CourseLandingClient";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await CourseService.getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found | VTI Marketplace",
      description: "The requested course could not be located.",
    };
  }

  return {
    title: `${course.title} | VTI Marketplace`,
    description: course.subtitle || course.description?.slice(0, 160) || "Online course on VTI Marketplace",
    openGraph: {
      title: course.title,
      description: course.subtitle || "Master new skills with VTI Marketplace",
      type: "website",
      images: course.thumbnailUrl ? [{ url: course.thumbnailUrl }] : [],
    },
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await CourseService.getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CourseLandingClient course={course} />;
}
