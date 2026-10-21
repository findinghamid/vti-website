import { NextRequest } from "next/server";
import { TaxonomyService } from "@/server/services/taxonomy.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const category = await TaxonomyService.getCategoryBySlug(slug);
    return apiSuccess({ category });
  } catch (error) {
    return handleApiError(error);
  }
}
