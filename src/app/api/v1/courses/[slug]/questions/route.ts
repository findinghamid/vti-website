import { NextRequest } from "next/server";
import { CommunityService } from "@/server/services/community.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId } = await getCartUserId();

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || undefined;
    const filter = (url.searchParams.get("filter") as "all" | "my" | "unanswered") || "all";

    const questions = await CommunityService.getCourseQuestions(slug, {
      search,
      filter,
      userId,
    });

    return apiSuccess({ questions });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId } = await getCartUserId();

    const body = await request.json();
    const { title, body: content, authorName } = body;

    if (!title || !content) {
      throw new ValidationError("title and body are required to create a question.");
    }

    const question = await CommunityService.createQuestion(
      userId,
      slug,
      title,
      content,
      authorName || "Student"
    );

    return apiSuccess(question);
  } catch (error) {
    return handleApiError(error);
  }
}
