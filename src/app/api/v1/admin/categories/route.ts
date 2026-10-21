import { NextRequest } from "next/server";
import { requirePermission, PERMISSIONS } from "@/server/auth/rbac";
import { TaxonomyService } from "@/server/services/taxonomy.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function POST(request: NextRequest) {
  try {
    await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
    const body = await request.json();
    const category = await TaxonomyService.createCategory(body);
    return apiSuccess({ category }, { message: "Category created successfully" }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
