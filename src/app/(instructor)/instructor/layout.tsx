import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, PlusCircle, BookOpen } from "lucide-react";
import { InstructorSidebar } from "@/components/layout/InstructorSidebar";
import { getSessionFromCookies } from "@/server/auth/session";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  const user = session?.user;
  const userName = user?.name || "Dr. Farooq Khan";
  const userEmail = user?.email || "instructor@vti.edu";
  const userAvatar = user?.avatarUrl || "/assets/img/dashboard/profile/dashboard-profile-2.jpg";

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161821] flex flex-col font-sans">
      {/* Top VTI Instructor Banner */}
      <section className="relative bg-[#161821] text-white overflow-hidden">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Instructor Profile Details */}
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#09BD3C] text-white">
                    Verified Instructor
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/70">
                  <div className="flex items-center gap-1 text-[#FFC221]">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-[#FFC221]" />
                      ))}
                    </div>
                    <span className="font-bold text-white ml-1">4.92</span>
                    <span className="text-white/60">(Instructor Rating)</span>
                  </div>
                  <span className="text-white/40">•</span>
                  <span className="truncate max-w-[200px] sm:max-w-none text-white/80">
                    {userEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Right Action Button */}
            <div>
              <Link
                href="/instructor/courses/new"
                className="inline-flex items-center gap-2 bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Course</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Instructor View */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-72 shrink-0">
            <InstructorSidebar />
          </div>
          <main className="flex-1 min-w-0 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
