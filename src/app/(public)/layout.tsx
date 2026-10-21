import React from "react";
import { getSessionFromCookies } from "@/server/auth/session";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  const currentUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <PublicNavbar currentUser={currentUser} />
      <MobileNav currentUser={currentUser} />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <PublicFooter />
    </div>
  );
}
