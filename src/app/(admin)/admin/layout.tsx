import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Users } from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { getSessionFromCookies } from "@/server/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  const user = session?.user;
  const userName = user?.name || "Operations Administrator";
  const userEmail = user?.email || "admin@vti.edu";

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161821] flex flex-col font-sans">
      {/* Top Admin Governance Header Banner */}
      <section className="relative bg-[#161821] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/dashboard/bg/dashboard-bg-1.jpg"
            alt="Dashboard Banner"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161821]/95 via-[#161821]/80 to-[#161821]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFC221]/15 border border-[#FFC221]/30 flex items-center justify-center text-[#FFC221] shrink-0 shadow-lg">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Admin Governance
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFC221] text-[#161821]">
                    SUPER ADMIN
                  </span>
                </div>
                <p className="text-xs text-white/70">
                  {userName} • {userEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/courses"
                className="inline-flex items-center gap-2 bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition"
              >
                <span>Course Moderation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Admin View */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-72 shrink-0">
            <AdminSidebar />
          </div>
          <main className="flex-1 min-w-0 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
