import { NextRequest } from "next/server";
import { requirePermission, PERMISSIONS } from "@/server/auth/rbac";
import { SettingService } from "@/server/services/setting.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
    const settings = await prisma.siteSetting.findMany();
    return apiSuccess({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return handleApiError(new Error("Invalid settings payload"));
    }

    const updated = await SettingService.updateBulkSettings(body);
    return apiSuccess({ updatedCount: updated.length }, { message: "Platform settings updated successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
