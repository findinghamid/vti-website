import { NextRequest } from "next/server";
import { requirePermission, PERMISSIONS } from "@/server/auth/rbac";
import { DeletionDecisionSchema } from "@/server/auth/schema";
import { DeletionService } from "@/server/services/deletion.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Strictly requires DELETIONS_APPROVE permission (Super Admin)
    const reviewer = await requirePermission(PERMISSIONS.DELETIONS_APPROVE);

    const body = await request.json();
    const validated = DeletionDecisionSchema.parse(body);
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");

    const decision = await DeletionService.decideRequest(reviewer.id, id, validated, ipAddress);

    return apiSuccess({ decision }, { message: `Deletion request ${validated.decision.toLowerCase()} successfully` });
  } catch (error) {
    return handleApiError(error);
  }
}
