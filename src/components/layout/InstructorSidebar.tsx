"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookPlus,
  DollarSign,
  PlusCircle,
  LogOut,
  ArrowLeft,
  Sparkles,
  BarChart3,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VtiLogo } from "@/components/ui/vti";

const INSTRUCTOR_LINKS = [
  { href: "/instructor/dashboard", label: "Dashboard & Revenue", icon: LayoutDashboard },
  { href: "/instructor/courses", label: "My Courses", icon: BookPlus },
  { href: "/instructor/payouts", label: "Earnings & Payouts", icon: DollarSign },
];

export function InstructorSidebar() {
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
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </Link>
          <h2 className="text-[11px] font-bold text-[#8A8C90] uppercase tracking-wider px-3.5 pt-3 pb-1">
            Instructor Studio
          </h2>
        </div>

        <nav className="space-y-1">
          {INSTRUCTOR_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer",
                  isActive
                    ? "bg-[#061D42] text-white shadow-sm font-bold"
                    : "text-[#55585B] hover:text-[#061D42] hover:bg-[#F3F4F8]"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-[#C08C52]" : "text-[#8A8C90]")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Authoring Promo Box */}
        <div className="bg-[#FAF9F6] border border-[#EAEBED] rounded-2xl p-4 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#09BD3C]/15 text-[#09BD3C] font-bold">
              <Sparkles className="w-3 h-3 text-[#09BD3C]" /> Author Hub
            </span>
            <h4 className="text-xs font-bold text-[#061D42] leading-snug">
              Draft & Publish New Curriculum
            </h4>
            <div>
              <Link
                href="/instructor/courses/new"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#061D42] hover:bg-[#0A2B5E] px-3 py-1.5 rounded-lg shadow-xs transition"
              >
                <PlusCircle className="w-3 h-3" />
                <span>New Course</span>
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
