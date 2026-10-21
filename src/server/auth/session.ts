import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "vti_session";
export const SESSION_EXPIRY_DAYS = 7;

interface FallbackSession {
  id: string;
  userId: string;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  user: any;
}

// In-memory fallback session store attached to globalThis for cross-chunk / cross-worker persistence
const globalForSessions = globalThis as unknown as {
  fallbackSessions?: Map<string, FallbackSession>;
};

export const fallbackSessions =
  globalForSessions.fallbackSessions ?? (globalForSessions.fallbackSessions = new Map<string, FallbackSession>());

/**
 * Updates user data across active fallback sessions for a user ID
 */
export function updateSessionUser(
  userId: string,
  updates: { name?: string; avatarUrl?: string | null; email?: string }
) {
  for (const session of fallbackSessions.values()) {
    if (session.userId === userId || session.user?.id === userId) {
      if (updates.name !== undefined) session.user.name = updates.name;
      if (updates.avatarUrl !== undefined) session.user.avatarUrl = updates.avatarUrl;
      if (updates.email !== undefined) session.user.email = updates.email;
    }
  }
}

/**
 * Generate a cryptographically secure random session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Create a new session in the database or fallback store
 */
export async function createSession(
  userId: string,
  ipAddress?: string | null,
  userAgent?: string | null,
  userObject?: any
) {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  try {
    const session = await prisma.session.create({
      data: {
        userId,
        token,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
        expiresAt,
      },
      include: {
        user: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return session;
  } catch {
    // Database offline fallback session
    const fallbackUser = userObject || {
      id: userId,
      name: "Demo Student",
      email: "student@vti.edu",
      role: "STUDENT",
      status: "ACTIVE",
      avatarUrl: null,
      permissions: [],
      createdAt: new Date(),
    };

    const session: FallbackSession = {
      id: `sess_${token.slice(0, 12)}`,
      userId,
      token,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
      expiresAt,
      user: fallbackUser,
    };
    fallbackSessions.set(token, session);
    return session as any;
  }
}

/**
 * Validate session token against database and check expiration
 */
export async function validateSession(token: string) {
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (session) {
      if (session.expiresAt < new Date()) {
        await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
        return null;
      }

      if (session.user.status !== "ACTIVE" || session.user.deletedAt) {
        return null;
      }

      return session;
    }
  } catch {
    // Database query failed, check in-memory fallback
  }

  const memSession = fallbackSessions.get(token);
  if (memSession) {
    if (memSession.expiresAt < new Date()) {
      fallbackSessions.delete(token);
      return null;
    }
    if (memSession.user.status !== "ACTIVE" || memSession.user.deletedAt) {
      return null;
    }
    return memSession as any;
  }

  return null;
}

/**
 * Revoke/delete a session token
 */
export async function revokeSession(token: string) {
  if (!token) return;
  fallbackSessions.delete(token);
  try {
    await prisma.session.delete({ where: { token } });
  } catch {}
}

/**
 * Get active session from incoming request cookies
 */
export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  return validateSession(token);
}

/**
 * Helper to configure HTTP-only session cookie options
 */
export function getSessionCookieOptions(expiresAt: Date) {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}
