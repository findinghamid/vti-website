"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Heart,
  ShoppingBag,
  Settings,
  LogOut,
  ArrowLeft,
  Zap,
  Sparkles,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VtiLogo } from "@/components/ui/vti";

const LEARNING_LINKS = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/student/learning", label: "My Learning", icon: BookOpen },
  { href: "/student/leaderboard", label: "Scholars Leaderboard", icon: Trophy },
  { href: "/student/certificates", label: "Certificates & Badges", icon: Award },
  { href: "/student/subscription", label: "My Subscription", icon: Zap },
  { href: "/student/wishlist", label: "Wishlist", icon: Heart },
  { href: "/student/orders", label: "Purchase History", icon: ShoppingBag },
];

const ACCOUNT_LINKS = [
  { href: "/student/settings", label: "Account Settings", icon: Settings },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingOut(true);
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      try {
        localStorage.removeItem("vti_cached_user");
      } catch {}
      window.dispatchEvent(new CustomEvent("vti_user_updated", { detail: null }));
      router.push("/login");
      router.refresh();
    } catch {
      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs flex flex-col justify-between">
      <div className="space-y-6">
        <div className="pb-4 border-b border-[#EAEBED]">
          <VtiLogo size="sm" />
        </div>

        {/* Marketplace Return */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#55585B] hover:text-[#061D42] transition py-1 px-2 rounded-lg hover:bg-[#F3F4F8]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </Link>
        </div>

        {/* Section 1: Learning Hub */}
        <div>
          <h3 className="text-[11px] font-bold text-[#8A8C90] uppercase tracking-wider px-3 mb-2">
            Learning Portal
          </h3>
          <nav className="space-y-1">
            {LEARNING_LINKS.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer",
                    active
                      ? "bg-[#061D42] text-white shadow-sm font-bold"
                      : "text-[#55585B] hover:text-[#061D42] hover:bg-[#F3F4F8]"
                  )}
                >
                  <Icon className={cn("w-4 h-4", active ? "text-[#C08C52]" : "text-[#8A8C90]")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Account Settings */}
        <div>
          <h3 className="text-[11px] font-bold text-[#8A8C90] uppercase tracking-wider px-3 mb-2">
            Account & Security
          </h3>
          <nav className="space-y-1">
            {ACCOUNT_LINKS.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer",
                    active
                      ? "bg-[#061D42] text-white shadow-sm font-bold"
                      : "text-[#55585B] hover:text-[#061D42] hover:bg-[#F3F4F8]"
                  )}
                >
                  <Icon className={cn("w-4 h-4", active ? "text-[#C08C52]" : "text-[#8A8C90]")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Theological Programs Banner */}
        <div className="bg-[#FAF9F6] border border-[#EAEBED] rounded-2xl p-4 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#09BD3C]/15 text-[#09BD3C] font-bold">
              <Sparkles className="w-3 h-3 text-[#09BD3C]" /> 100% Free Tuition
            </span>
            <h4 className="text-xs font-bold text-[#061D42] leading-snug">
              Access All 8 Theological Faculties
            </h4>
            <div>
              <Link
                href="/courses"
                className="inline-flex items-center text-[11px] font-bold text-white bg-[#061D42] hover:bg-[#0A2B5E] px-3 py-1.5 rounded-lg shadow-xs transition"
              >
                Browse Free Courses
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-80 pointer-events-none translate-x-2 translate-y-2">
            <Image
              src="/assets/img/dashboard/icon/menu/menu-shape.png"
              alt=""
              width={90}
              height={90}
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="border-t border-[#EAEBED] pt-4 mt-6">
        <form onSubmit={handleLogout} action="/api/v1/auth/logout" method="POST">
          <button
            type="submit"
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-[#E93238] hover:bg-[#FFF2F2] rounded-xl transition cursor-pointer disabled:opacity-60"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
