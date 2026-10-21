import { NextRequest } from "next/server";
import { BundleService } from "@/server/services/bundle.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";
import { getSessionFromCookies } from "@/server/auth/session";

export async function GET() {
  try {
    const bundles = await BundleService.getAllBundles();
    return apiSuccess({ bundles });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    const adminUserId = session?.user?.id || "usr_admin_01";

    const body = await request.json();
    const { title, slug, description, priceAmount, courseIds, thumbnailUrl } = body;

    if (!title || !slug || !priceAmount || !courseIds) {
      throw new ValidationError("title, slug, priceAmount, and courseIds are required.");
    }

    const bundle = await BundleService.createBundle(adminUserId, {
      title,
      slug,
      description,
      priceAmount,
      courseIds,
      thumbnailUrl,
    });

    return apiSuccess({ bundle }, { message: "Course bundle created successfully." });
  } catch (error) {
    return handleApiError(error);
  }
}
