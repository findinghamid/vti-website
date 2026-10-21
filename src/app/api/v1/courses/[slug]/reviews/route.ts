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
    const url = new URL(request.url);
    const ratingParam = url.searchParams.get("rating");
    const rating = ratingParam ? parseInt(ratingParam, 10) : undefined;
    const search = url.searchParams.get("search") || undefined;

    const result = await CommunityService.getCourseReviews(slug, {
      rating,
      search,
    });

    return apiSuccess(result);
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
    const { rating, comment, userName } = body;

    if (rating === undefined || !comment) {
      throw new ValidationError("rating (1-5) and comment are required.");
    }

    const result = await CommunityService.upsertReview(
      userId,
      slug,
      Number(rating),
      comment,
      userName || "Student"
    );

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
