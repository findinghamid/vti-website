import { NextRequest } from "next/server";
import { requirePermission, PERMISSIONS } from "@/server/auth/rbac";
import { DeletionService } from "@/server/services/deletion.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";
import { DeletionStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    await requirePermission(PERMISSIONS.DELETIONS_REQUEST);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as DeletionStatus | undefined;
    const entityType = searchParams.get("entityType") ?? undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const result = await DeletionService.listRequests({
      status,
      entityType,
      page,
      limit,
    });

    return apiSuccess(result.requests, { pagination: result.pagination });
  } catch (error) {
    return handleApiError(error);
  }
}
