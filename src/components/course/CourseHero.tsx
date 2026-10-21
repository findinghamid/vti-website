"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Globe, Clock, ChevronRight, Award, ShieldCheck, Home } from "lucide-react";

interface CourseHeroProps {
  title: string;
  subtitle: string | null;
  category: { id: string; name: string; slug: string };
  subcategory?: { id: string; name: string; slug: string } | null;
  topic?: { id: string; name: string; slug: string } | null;
  level: string;
  language: string;
  averageRating: number;
  totalReviews: number;
  totalStudents: number;
  publishedAt: string | null;
  instructors: Array<{
    id: string;
    isPrimary: boolean;
    name: string;
    headline: string;
    avatarUrl?: string | null;
  }>;
}

function getFacultySlug(inst: { id: string; name: string }) {
  const n = inst.name.toLowerCase();
  if (n.includes("hastings")) return "dr-andrew-hastings";
  if (n.includes("alden")) return "dr-rebecca-alden";
  if (n.includes("vance")) return "prof-david-vance";
  if (n.includes("adebayo")) return "dr-marcus-adebayo";
  if (n.includes("rostova")) return "dr-elena-rostova";
  if (n.includes("wright")) return "rev-samuel-wright";
  return inst.id || "dr-andrew-hastings";
}

export function CourseHero({
  title,
  subtitle,
  category,
  subcategory,
  topic,
  level,
  language,
  averageRating,
  totalReviews,
  totalStudents,
  publishedAt,
  instructors,
}: CourseHeroProps) {
  const primaryInstructor = instructors.find((i) => i.isPrimary) || instructors[0];
  const instructorAvatar =
    primaryInstructor?.avatarUrl || "/assets/img/course/course-5-teacher-1.png";
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "September 2026";

  return (
    <section className="relative overflow-hidden bg-[#161821] text-white pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-slate-800">
      {/* Background with VTI details3 image & dark overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/img/breadcrumb/breadcrumb-bg-3.jpg"
          alt="Course Banner Background"
          fill
          sizes="100vw"
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#161821] via-[#161821]/90 to-[#161821]/70" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:w-8/12 xl:w-7/12 space-y-6">
          {/* Breadcrumb Navigation (course-details-3.html ) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-300 flex-wrap">
            <Link href="/" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <Home className="w-3.5 h-3.5 text-[#FF5B35]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link href="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link
              href={`/courses?category=${category.slug}`}
              className="text-[#FF5B35] hover:underline font-bold"
            >
              {category.name}
            </Link>
            {subcategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400">{subcategory.name}</span>
              </>
            )}
          </nav>

          {/* Course Title with Outfit Typography () */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight leading-tight">
            {title}
          </h1>

          {/* Subtitle / Excerpt */}
          {subtitle && (
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}

          {/* VTI Course Meta Ribbon */}
          <div className="pt-2 flex flex-wrap items-center gap-6 sm:gap-8 border-t border-white/10 text-xs text-slate-300">
            {/* Gamified Clickable Instructor Badges (Supporting Multi-Instructor Row) */}
            {instructors && instructors.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center -space-x-2 sm:space-x-3">
                  {instructors.map((inst) => {
                    const slug = getFacultySlug(inst);
                    const avatar = inst.avatarUrl || "/assets/img/course/course-5-teacher-1.png";

                    return (
                      <div key={inst.id} className="relative group">
                        <Link
                          href={`/faculty/${slug}`}
                          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/10 transition duration-200"
                          title={`View ${inst.name}'s Academic Profile`}
                        >
                          {/* Gamified Contributor Avatar with Golden/Brand Ring */}
                          <div className="relative w-11 h-11 rounded-full ring-2 ring-[#FF5B35] ring-offset-2 ring-offset-[#161821] group-hover:ring-4 group-hover:scale-105 transition-all duration-300 shrink-0 bg-slate-800 shadow-lg shadow-orange-500/20">
                            <Image
                              src={avatar}
                              alt={inst.name}
                              fill
                              sizes="44px"
                              className="object-cover rounded-full"
                            />
                            {/* Verified Badge Icon */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#09BD3C] text-white flex items-center justify-center border-2 border-[#161821] shadow-xs">
                              <ShieldCheck className="w-2.5 h-2.5" />
                            </div>
                          </div>

                          {/* Instructor Name & Title */}
                          <div className="text-left hidden sm:block pr-2">
                            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-[#FF5B35] transition">
                              Faculty Instructor
                            </span>
                            <span className="font-bold text-white text-sm group-hover:text-[#FF5B35] transition truncate max-w-[160px] block">
                              {inst.name}
                            </span>
                          </div>
                        </Link>

                        {/* Interactive Tooltip Card on Hover */}
                        <div className="absolute left-0 bottom-full mb-3 hidden group-hover:flex flex-col w-64 p-3.5 rounded-2xl bg-[#1E222D] border border-white/15 shadow-2xl text-slate-200 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#FF5B35]">
                              <Image
                                src={avatar}
                                alt={inst.name}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-white truncate">{inst.name}</p>
                              <span className="text-[10px] text-[#09BD3C] font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Verified Faculty
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                            {inst.headline || "Theological Professor & Biblical Scholar at VTI"}
                          </p>
                          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-[#FF5B35]">
                            <span>View Full Academic Profile</span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Chip */}
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Category
              </span>
              <span className="font-bold text-[#FF5B35] text-sm">
                {category.name}
              </span>
            </div>

            {/* Last Updated */}
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Last Updated
              </span>
              <span className="font-semibold text-white text-sm">
                {formattedDate}
              </span>
            </div>

            {/* Star Rating & Reviews */}
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Rating
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex items-center text-[#FFC221]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(averageRating)
                          ? "fill-[#FFC221]"
                          : "fill-[#FFC221]/30 text-[#FFC221]/50"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-white text-sm">{averageRating.toFixed(1)}</span>
                <span className="text-slate-400 text-xs">({totalReviews})</span>
              </div>
            </div>
          </div>

          {/* Secondary Badges: Level & Language & Free Tuition */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#09BD3C]/20 text-[#09BD3C] border border-[#09BD3C]/30 font-bold uppercase tracking-wider text-[10px]">
              100% Free Tuition
            </span>
            <span className="px-3 py-1 rounded-full bg-[#FF5B35]/20 text-[#FF5B35] border border-[#FF5B35]/30 font-bold uppercase tracking-wider text-[10px]">
              {level.replace("_", " ")}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15 font-semibold text-[11px] flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-[#FF5B35]" />
              {language}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#FFC221]/20 text-[#FFC221] border border-[#FFC221]/30 font-bold text-[10px] flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>Verifiable Certificate</span>
            </span>
            {totalStudents >= 500 && (
              <span className="px-3 py-1 rounded-full bg-[#FFC221]/20 text-[#FFC221] border border-[#FFC221]/30 font-bold uppercase tracking-wider text-[10px]">
                🔥 Popular Choice
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
