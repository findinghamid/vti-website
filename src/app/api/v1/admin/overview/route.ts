import { AdminOperationsService } from "@/server/services/admin-operations.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";
import { getSessionFromCookies } from "@/server/auth/session";

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    // Allow admin access or demo read
    const overview = await AdminOperationsService.getPlatformOverview();
    return apiSuccess({ overview });
  } catch (error) {
    return handleApiError(error);
  }
}
