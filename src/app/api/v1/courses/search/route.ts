import { NextRequest } from "next/server";
import { CourseSearchService } from "@/server/services/search.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";
import { CourseLevel } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") ?? undefined;
    const categorySlug = searchParams.get("category") ?? undefined;
    const subcategorySlug = searchParams.get("subcategory") ?? undefined;
    const topicSlug = searchParams.get("topic") ?? undefined;
    const level = (searchParams.get("level") as CourseLevel) ?? undefined;
    const priceType = (searchParams.get("price") as "all" | "free" | "paid") ?? undefined;
    const minRating = searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : undefined;
    const language = searchParams.get("language") ?? undefined;
    const sort = (searchParams.get("sort") as any) ?? "relevance";
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 12;

    const result = await CourseSearchService.searchCourses({
      query,
      categorySlug,
      subcategorySlug,
      topicSlug,
      level,
      priceType,
      minRating,
      language,
      sort,
      page,
      limit,
    });

    return apiSuccess(result.courses, {
      pagination: result.pagination,
      facets: result.facets,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
