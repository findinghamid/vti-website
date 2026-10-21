"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MessageSquare, Users, PlayCircle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface InstructorBioCardProps {
  instructor: {
    id: string;
    name: string;
    avatarUrl: string | null;
    headline: string;
    bio: string;
    averageRating: number;
    totalStudents: number;
    totalReviews: number;
    coursesCount: number;
  };
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

export function InstructorBioCard({ instructor }: InstructorBioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const avatar = instructor.avatarUrl || "/assets/img/course/course-5-teacher-1.png";
  const slug = getFacultySlug(instructor);

  return (
    <section
      aria-labelledby="instructor-heading"
      className="bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xs space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2
          id="instructor-heading"
          className="text-xl sm:text-2xl font-black text-[#161821] dark:text-white font-heading tracking-tight"
        >
          Meet Your Instructor
        </h2>
        <span className="text-[11px] font-bold text-[#FF5B35] bg-[#FF5B35]/10 px-3 py-1 rounded-full uppercase tracking-wider">
          Verified Faculty
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Clickable Avatar with Faculty Link */}
        <Link
          href={`/faculty/${slug}`}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-[#FF5B35]/40 shadow-md bg-slate-100 hover:scale-105 hover:border-[#FF5B35] transition duration-200 group block"
          title={`View full profile of ${instructor.name}`}
        >
          <Image
            src={avatar}
            alt={instructor.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        </Link>

        {/* Info & Stats */}
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <Link
              href={`/faculty/${slug}`}
              className="text-xl font-bold text-[#161821] dark:text-white font-heading hover:text-[#FF5B35] transition duration-150 inline-block"
            >
              {instructor.name}
            </Link>
            <p className="text-xs sm:text-sm text-[#57595F] dark:text-slate-400 font-medium mt-0.5">
              {instructor.headline}
            </p>
          </div>

          {/* Metric Chips Grid */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F8FA] dark:bg-[#12151E] border border-[#EAEBED] dark:border-slate-800 font-bold text-[#161821] dark:text-white">
              <Star className="w-3.5 h-3.5 fill-[#FFC221] text-[#FFC221]" />
              <span>{instructor.averageRating.toFixed(1)} Instructor Rating</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F8FA] dark:bg-[#12151E] border border-[#EAEBED] dark:border-slate-800 text-[#57595F] dark:text-slate-300">
              <MessageSquare className="w-3.5 h-3.5 text-[#FF5B35]" />
              <span>{instructor.totalReviews.toLocaleString()} Reviews</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F8FA] dark:bg-[#12151E] border border-[#EAEBED] dark:border-slate-800 text-[#57595F] dark:text-slate-300">
              <Users className="w-3.5 h-3.5 text-[#09BD3C]" />
              <span>{instructor.totalStudents.toLocaleString()} Students</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F8FA] dark:bg-[#12151E] border border-[#EAEBED] dark:border-slate-800 text-[#57595F] dark:text-slate-300">
              <PlayCircle className="w-3.5 h-3.5 text-[#9A34EB]" />
              <span>{instructor.coursesCount} Courses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Body */}
      {instructor.bio && (
        <div className="pt-2 border-t border-[#EAEBED] dark:border-slate-800 text-xs sm:text-sm text-[#57595F] dark:text-slate-300 leading-relaxed">
          <p className={isExpanded ? "" : "line-clamp-3"}>
            {instructor.bio}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-[#FF5B35] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Read Full Biography</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <Link
              href={`/faculty/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#161821] dark:text-white hover:text-[#FF5B35] hover:underline"
            >
              <span>View Full Academic Profile & Credentials</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FFC221]" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
