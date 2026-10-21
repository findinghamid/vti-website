import { NextRequest } from "next/server";
import { LearningService } from "@/server/services/learning.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ noteId: string }> }
) {
  try {
    const { userId } = await getCartUserId();
    const { noteId } = await context.params;

    await LearningService.deleteNote(userId, noteId);
    return apiSuccess({ success: true, message: "Note deleted." });
  } catch (error) {
    return handleApiError(error);
  }
}
