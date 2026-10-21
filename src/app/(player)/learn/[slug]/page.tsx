import { redirect } from "next/navigation";
import { LearningService } from "@/server/services/learning.service";
import { getCartUserId } from "@/server/auth/cart-session";

interface LearnPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LearnRedirectPage({ params }: LearnPageProps) {
  const { slug } = await params;
  const { userId } = await getCartUserId();

  try {
    const context = await LearningService.getCoursePlayerContext(userId, slug);
    if (context.currentLesson) {
      redirect(`/learn/${slug}/lecture/${context.currentLesson.id}`);
    }
  } catch (error) {
    // If not enrolled or error, redirect back to course landing page
    redirect(`/courses/${slug}`);
  }

  redirect(`/courses/${slug}`);
}
