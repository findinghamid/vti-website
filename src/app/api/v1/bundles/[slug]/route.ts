import { NextRequest } from "next/server";
import { BundleService } from "@/server/services/bundle.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, NotFoundError } from "@/server/api/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const bundle = await BundleService.getBundleBySlug(slug);

    if (!bundle) {
      throw new NotFoundError(`Course bundle with slug "${slug}" not found.`);
    }

    return apiSuccess({ bundle });
  } catch (error) {
    return handleApiError(error);
  }
}
