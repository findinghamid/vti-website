import { NextRequest } from "next/server";
import { LearningService } from "@/server/services/learning.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getCartUserId();
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      throw new ValidationError("lessonId query parameter is required.");
    }

    const notes = await LearningService.getNotes(userId, lessonId);
    return apiSuccess({ notes, count: notes.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getCartUserId();
    const body = await request.json();
    const { lessonId, timestampSec = 0, content } = body;

    if (!lessonId || !content) {
      throw new ValidationError("lessonId and content are required.");
    }

    const note = await LearningService.createNote(userId, lessonId, timestampSec, content);
    return apiSuccess(note, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
