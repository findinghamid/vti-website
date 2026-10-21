"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  ShoppingCart,
  Trash2,
  History,
  Sliders,
  LogOut,
  ArrowLeft,
  DollarSign,
  GraduationCap,
  UserCheck,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VtiLogo } from "@/components/ui/vti";

const ADMIN_LINKS = [
  { href: "/admin", label: "Operations Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Course Management", icon: ShieldCheck },
  { href: "/admin/faculty", label: "Faculty & Instructors", icon: GraduationCap },
  { href: "/admin/students", label: "Student Database & CSV", icon: UserCheck },
  { href: "/admin/finances", label: "Financials & Refunds", icon: RotateCcw },
  { href: "/admin/community", label: "WhatsApp & Announcements", icon: MessageSquare },
  { href: "/admin/payouts", label: "Instructor Payouts", icon: DollarSign },
  { href: "/admin/users", label: "User Governance", icon: Users },
];

export function AdminSidebar() {
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

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#55585B] hover:text-[#061D42] transition py-1 px-2 rounded-lg hover:bg-[#F3F4F8]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <h2 className="text-[11px] font-bold text-[#8A8C90] uppercase tracking-wider px-3.5 pt-3 pb-1">
            Admin Governance
          </h2>
        </div>

        <nav className="space-y-1">
          {ADMIN_LINKS.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer",
                  active
                    ? "bg-[#061D42] text-white shadow-xs font-bold"
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
