import { SettingService } from "@/server/services/setting.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET() {
  try {
    const settings = await SettingService.getPublicSettings();
    return apiSuccess({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}
