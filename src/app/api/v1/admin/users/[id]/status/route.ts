import { NextRequest } from "next/server";
import { AdminOperationsService } from "@/server/services/admin-operations.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";
import { getSessionFromCookies } from "@/server/auth/session";
import { UserStatus } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionFromCookies();
    const adminUserId = session?.user?.id || "usr_admin_01";

    const body = await request.json();
    const { status, reason } = body;

    if (!status || (status !== "ACTIVE" && status !== "SUSPENDED")) {
      throw new ValidationError("Valid target status ('ACTIVE' or 'SUSPENDED') is required.");
    }

    const result = await AdminOperationsService.setUserStatus(
      id,
      adminUserId,
      status as UserStatus,
      reason
    );

    return apiSuccess({ result }, { message: `User status changed to ${status}.` });
  } catch (error) {
    return handleApiError(error);
  }
}
