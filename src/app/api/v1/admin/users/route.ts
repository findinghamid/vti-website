import { NextRequest } from "next/server";
import { AdminOperationsService } from "@/server/services/admin-operations.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";
import { UserRole, UserStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || undefined;
    const role = (searchParams.get("role") as UserRole) || undefined;
    const status = (searchParams.get("status") as UserStatus) || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await AdminOperationsService.getUsersList({
      query,
      role,
      status,
      page,
      limit,
    });

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
