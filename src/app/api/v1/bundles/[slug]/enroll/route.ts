import { NextRequest } from "next/server";
import { BundleService } from "@/server/services/bundle.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId } = await getCartUserId();

    const result = await BundleService.purchaseBundle(userId, slug);

    return apiSuccess({ result }, { message: `Successfully enrolled in bundle "${result.bundleTitle}"!` });
  } catch (error) {
    return handleApiError(error);
  }
}
