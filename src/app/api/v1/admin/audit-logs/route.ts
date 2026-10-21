import { NextRequest } from "next/server";
import { requirePermission, PERMISSIONS } from "@/server/auth/rbac";
import { AuditService } from "@/server/services/audit.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET(request: NextRequest) {
  try {
    await requirePermission(PERMISSIONS.AUDIT_VIEW);

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") ?? undefined;
    const entity = searchParams.get("entity") ?? undefined;
    const userId = searchParams.get("userId") ?? undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const result = await AuditService.listLogs({
      action,
      entity,
      userId,
      page,
      limit,
    });

    return apiSuccess(result.logs, { pagination: result.pagination });
  } catch (error) {
    return handleApiError(error);
  }
}
