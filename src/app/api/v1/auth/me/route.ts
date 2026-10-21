import { getSessionFromCookies } from "@/server/auth/session";
import { AuthService } from "@/server/services/auth.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session || !session.user) {
      return apiSuccess({ user: null });
    }

    const authUser = session.user;

    try {
      // Fetch full user with profiles if database is connected
      const user = await prisma.user.findUnique({
        where: { id: authUser.id },
        include: {
          studentProfile: true,
          instructorProfile: true,
          permissions: {
            include: { permission: true },
          },
        },
      });

      if (user) {
        return apiSuccess({ user: AuthService.sanitizeUser(user) });
      }
    } catch {
      // Database offline, use session authenticated user
    }

    return apiSuccess({ user: AuthService.sanitizeUser(authUser) });
  } catch (error) {
    return handleApiError(error);
  }
}

