import { NextRequest } from "next/server";
import { requireAuth } from "@/server/auth/rbac";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError, UnauthorizedError } from "@/server/api/errors";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, validatePasswordStrength } from "@/server/auth/password";
import { AuthService } from "@/server/services/auth.service";
import { updateSessionUser } from "@/server/auth/session";

export async function GET() {
  try {
    const authUser = await requireAuth();

    try {
      const user = await prisma.user.findUnique({
        where: { id: authUser.id },
        include: { studentProfile: true },
      });

      if (user) {
        return apiSuccess({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            role: user.role,
            bio: user.studentProfile?.headline || "",
            phone: "",
            createdAt: user.createdAt,
          },
        });
      }
    } catch {
      // Offline fallback
    }

    return apiSuccess({
      user: {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        avatarUrl: authUser.avatarUrl,
        role: authUser.role,
        bio: "",
        phone: "",
        createdAt: authUser.createdAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await requireAuth();
    const body = await req.json();
    const { name, bio, phone, avatarUrl, currentPassword, newPassword } = body;

    const trimmedName = name ? name.trim() : undefined;
    const finalAvatar = avatarUrl !== undefined ? avatarUrl : undefined;

    try {
      const user = await prisma.user.findUnique({
        where: { id: authUser.id },
        include: { studentProfile: true },
      });

      if (!user) {
        throw new UnauthorizedError("User not found.");
      }

      // Password update
      if (newPassword) {
        if (!currentPassword) {
          throw new ValidationError("Current password is required to set a new password.");
        }

        const isValid = await verifyPassword(currentPassword, user.passwordHash);
        if (!isValid) {
          throw new ValidationError("Incorrect current password.");
        }

        const strength = validatePasswordStrength(newPassword);
        if (!strength.isValid) {
          throw new ValidationError(strength.message || "New password does not meet requirements.");
        }

        const newHash = await hashPassword(newPassword);
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: newHash },
        });
      }

      // Profile details update
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: trimmedName || user.name,
          avatarUrl: finalAvatar !== undefined ? finalAvatar : user.avatarUrl,
          studentProfile: {
            upsert: {
              create: {
                headline: bio || null,
              },
              update: {
                headline: bio || null,
              },
            },
          },
        },
        include: { studentProfile: true },
      });

      // Synchronize in-memory active sessions & auth fallback stores
      updateSessionUser(authUser.id, {
        name: updatedUser.name,
        avatarUrl: updatedUser.avatarUrl,
      });
      AuthService.updateMemoryUser(authUser.id, {
        name: updatedUser.name,
        avatarUrl: updatedUser.avatarUrl,
      });

      return apiSuccess({
        message: "Settings updated successfully!",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatarUrl: updatedUser.avatarUrl,
          role: updatedUser.role,
          bio: updatedUser.studentProfile?.headline || "",
          phone: phone || "",
        },
      });
    } catch (e: any) {
      if (e instanceof ValidationError || e instanceof UnauthorizedError) {
        throw e;
      }
      // Offline fallback: persist into active session & memory users
      const resolvedName = trimmedName || authUser.name;
      const resolvedAvatar = finalAvatar !== undefined ? finalAvatar : authUser.avatarUrl;

      updateSessionUser(authUser.id, {
        name: resolvedName,
        avatarUrl: resolvedAvatar,
      });
      AuthService.updateMemoryUser(authUser.id, {
        name: resolvedName,
        avatarUrl: resolvedAvatar,
      });

      return apiSuccess({
        message: "Settings updated successfully!",
        user: {
          id: authUser.id,
          name: resolvedName,
          email: authUser.email,
          avatarUrl: resolvedAvatar,
          role: authUser.role,
          bio: bio || "",
          phone: phone || "",
        },
      });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
