import { NextRequest } from "next/server";
import { AdminOperationsService } from "@/server/services/admin-operations.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";
import { getSessionFromCookies } from "@/server/auth/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionFromCookies();
    const adminUserId = session?.user?.id || "usr_admin_01";

    const body = await request.json();
    const { decision, feedback } = body;

    if (!decision || (decision !== "APPROVE" && decision !== "REQUEST_CHANGES")) {
      throw new ValidationError("Valid decision ('APPROVE' or 'REQUEST_CHANGES') is required.");
    }

    const result = await AdminOperationsService.moderateCourse(
      id,
      adminUserId,
      decision,
      feedback
    );

    return apiSuccess({ result }, { message: result.message });
  } catch (error) {
    return handleApiError(error);
  }
}
