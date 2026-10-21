import { cookies } from "next/headers";
import { getSessionFromCookies } from "@/server/auth/session";

export const GUEST_CART_COOKIE_NAME = "vti_guest_cart_id";

/**
 * Resolves the acting user or guest cart identifier for shopping cart operations.
 * If user is authenticated, returns their persistent user ID and optional guestId for merging.
 * If user is unauthenticated, retrieves or generates a guest cart identifier cookie or header.
 */
export async function getCartUserId(
  requestHeaders?: Headers
): Promise<{ userId: string; isGuest: boolean; guestId?: string }> {
  const cookieStore = await cookies();
  let guestId = cookieStore.get(GUEST_CART_COOKIE_NAME)?.value;

  if (!guestId && requestHeaders) {
    guestId = requestHeaders.get("x-guest-cart-id") || undefined;
  }

  try {
    const session = await getSessionFromCookies();
    if (session?.user) {
      return { userId: session.user.id, isGuest: false, guestId };
    }
  } catch {
    // DB or cookies error fallback
  }

  // Check guest cart identifier
  let activeGuestId = guestId;
  if (!activeGuestId) {
    activeGuestId = `guest_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`;
    try {
      cookieStore.set(GUEST_CART_COOKIE_NAME, activeGuestId, {
        httpOnly: false, // Accessible to client JavaScript for resilient header sync
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    } catch {
      // In read-only contexts or RSC where cookie setting is ignored
    }
  }

  return { userId: activeGuestId, isGuest: true, guestId: activeGuestId };
}
