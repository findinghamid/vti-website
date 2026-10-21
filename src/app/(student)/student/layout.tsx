import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Sparkles, BookOpen, Compass } from "lucide-react";
import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { getSessionFromCookies } from "@/server/auth/session";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  const user = session?.user;
  const userName = user?.name || "Student Member";
  const userEmail = user?.email || "student@vti.edu";
  const userAvatar = user?.avatarUrl || "/assets/img/dashboard/profile/dashboard-profile-2.jpg";

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161821] flex flex-col font-sans">
      {/* Top VTI Dashboard Hero Banner */}
      <section className="relative bg-[#161821] text-white overflow-hidden">
        {/* Banner Background Image with soft gradient */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/dashboard/bg/dashboard-bg-1.jpg"
            alt="Dashboard Banner"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161821]/95 via-[#161821]/80 to-[#161821]/60" />
        </div>

        {/* Ambient Corner Shape */}
        <div className="absolute top-0 right-0 pointer-events-none opacity-30 z-0 hidden lg:block">
          <Image
            src="/assets/img/dashboard/bg/dashboard-bg-shape-1.jpg"
            alt=""
            width={260}
            height={160}
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        {/* Banner Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Student Profile Info */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-xl shrink-0 bg-white">
                <Image
                  src={userAvatar}
                  alt={userName}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {userName}
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FF5B35] text-white">
                    Student
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/70">
                  <div className="flex items-center gap-1 text-[#FFC221]">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-[#FFC221]" />
                      ))}
                    </div>
                    <span className="font-bold text-white ml-1">5.0</span>
                    <span className="text-white/60">(Active Learner)</span>
                  </div>
                  <span className="text-white/40">•</span>
                  <span className="truncate max-w-[200px] sm:max-w-none text-white/80">
                    {userEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Banner Right Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Catalog</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Student Portal Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <StudentSidebar />
          </div>

          {/* Right Page View */}
          <main className="flex-1 min-w-0 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
