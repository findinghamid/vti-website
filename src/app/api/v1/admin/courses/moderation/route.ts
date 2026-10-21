import { AdminOperationsService } from "@/server/services/admin-operations.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET() {
  try {
    const queue = await AdminOperationsService.getModerationQueue();
    return apiSuccess({ queue });
  } catch (error) {
    return handleApiError(error);
  }
}
