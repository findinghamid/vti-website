import { NextRequest } from "next/server";
import { requirePermission, PERMISSIONS } from "@/server/auth/rbac";
import { DeletionRequestSchema } from "@/server/auth/schema";
import { DeletionService } from "@/server/services/deletion.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function POST(request: NextRequest) {
  try {
    // Only users with deletions.request permission (Admins & Super Admins) can request deletion
    const user = await requirePermission(PERMISSIONS.DELETIONS_REQUEST);

    const body = await request.json();
    const validated = DeletionRequestSchema.parse(body);
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");

    const deletionRequest = await DeletionService.createRequest(user.id, validated, ipAddress);

    return apiSuccess({ deletionRequest }, { message: "Deletion request submitted for Super Admin review" }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
