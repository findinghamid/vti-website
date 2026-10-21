import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, BookOpen, Users, Clock, Play } from "lucide-react";
import { formatMinorUnits, formatDuration } from "@/lib/utils";

export interface CourseCardData {
  id: string;
  title: string;
  urduTitle?: string | null;
  slug: string;
  subtitle?: string | null;
  thumbnailUrl?: string | null;
  level: string;
  priceAmount: number;
  discountAmount?: number | null;
  currency: string;
  averageRating: string | number;
  totalReviews: number;
  totalStudents: number;
  totalDurationSec: number;
  totalLectures: number;
  progressPercent?: number;
  isComingSoon?: boolean;
  category?: { name: string; slug: string } | null;
  instructors?: {
    instructor: {
      user: { name: string; avatarUrl?: string | null };
    };
  }[];
}

export interface CourseCardProps {
  course: CourseCardData;
  viewMode?: "grid" | "list";
}

export function CourseCard({ course, viewMode = "grid" }: CourseCardProps) {
  const ratingNum =
    typeof course.averageRating === "number"
      ? course.averageRating
      : parseFloat(String(course.averageRating) || "4.8");
  const instructor = course.instructors?.[0]?.instructor?.user;
  const instructorName = instructor?.name || "Lead Instructor";
  const instructorAvatar = instructor?.avatarUrl || "/assets/img/teacher/teacher-1.png";
  const isFree = course.priceAmount === 0;
  const thumbnail = course.thumbnailUrl || "/assets/img/course/course-thumb-1.jpg";

  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col md:flex-row items-center rounded-3xl bg-white border border-[#EAEBED] shadow-sm hover:shadow-xl hover:border-[#061D42]/30 transition-all duration-300 overflow-hidden p-5 gap-6">
        {/* Left: Thumbnail */}
        <div className="relative aspect-video w-full md:w-72 shrink-0 rounded-2xl overflow-hidden bg-slate-900">
          <Link href={`/courses/${course.slug}`} className="block relative w-full h-full">
            <Image
              src={thumbnail}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#061D42]/85 text-white backdrop-blur-xs">
              {course.level.replace("_", " ")}
            </span>
          </Link>
        </div>

        {/* Right: Content */}
        <div className="flex-1 w-full min-w-0 flex flex-col justify-between py-1">
          <div>
            {/* Top row: Category tag & Instructor */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                {course.category && (
                  <span className="inline-block text-[11px] font-bold text-[#061D42] bg-[#061D42]/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {course.category.name}
                  </span>
                )}
                <span className="text-[11px] font-extrabold text-[#C08C52] bg-[#C08C52]/15 border border-[#C08C52]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  COMING SOON
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-100 border border-[#EAEBED]">
                  <Image src={instructorAvatar} alt={instructorName} fill sizes="24px" className="object-cover" />
                </div>
                <span className="text-xs font-semibold text-[#161821]">
                  {instructorName}
                </span>
              </div>
            </div>

            {/* Urdu Title if available */}
            {course.urduTitle && (
              <div className="text-sm font-semibold text-[#061D42] dark:text-[#C08C52] font-urdu mb-0.5" dir="rtl">
                {course.urduTitle}
              </div>
            )}

            {/* Course Title */}
            <h3 className="text-lg font-bold text-[#161821] font-heading leading-snug group-hover:text-[#061D42] transition duration-200 line-clamp-1">
              <Link href={`/courses/${course.slug}`}>{course.title}</Link>
            </h3>

            {/* Subtitle / Excerpt */}
            {course.subtitle && (
              <p className="mt-1 text-xs text-[#57595F] line-clamp-2 leading-relaxed">
                {course.subtitle}
              </p>
            )}

            {/* Development Progress Bar */}
            <div className="mt-3 mb-2 max-w-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] text-[#57595F] font-medium">
                <span>Preparation Progress</span>
                <span className="font-bold text-[#061D42]">{course.progressPercent || 75}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#061D42] to-[#C08C52] rounded-full"
                  style={{ width: `${course.progressPercent || 75}%` }}
                />
              </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-5 text-xs text-[#57595F] mt-2">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#C08C52]" />
                {course.totalLectures || 24} Lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C08C52]" />
                {course.totalDurationSec > 0 ? formatDuration(course.totalDurationSec) : "In Production"}
              </span>
            </div>
          </div>

          {/* Bottom Bar: Status & Button */}
          <div className="mt-4 pt-3 border-t border-[#EAEBED] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#09BD3C] bg-[#09BD3C]/10 px-2.5 py-1 rounded-md">
                100% Free Tuition
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`/courses/${course.slug}`}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#061D42] hover:bg-[#0A2B5E] shadow-xs transition-all duration-200 flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-[#C08C52]" />
                <span>Preview Course / Coming Soon</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid View ( from index-2.html & course-with-sidebar.html)
  return (
    <div className="group relative flex flex-col rounded-3xl bg-white border border-[#EAEBED] shadow-sm hover:shadow-2xl hover:border-[#061D42]/30 transition-all duration-300 overflow-hidden transform hover:-translate-y-1.5">
      {/* Top Instructor Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#EAEBED] bg-slate-100">
            <Image src={instructorAvatar} alt={instructorName} fill sizes="32px" className="object-cover" />
          </div>
          <span className="text-xs font-bold text-[#161821]">
            {instructorName}
          </span>
        </div>

        <span className="text-[11px] font-extrabold text-[#C08C52] bg-[#C08C52]/15 border border-[#C08C52]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          COMING SOON
        </span>
      </div>

      {/* Course Thumbnail */}
      <div className="relative aspect-video w-full px-5 overflow-hidden">
        <Link href={`/courses/${course.slug}`} className="block relative w-full h-full rounded-2xl overflow-hidden bg-slate-800">
          <Image
            src={thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

          {/* Level Pill Overlay */}
          <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#061D42]/85 text-white backdrop-blur-xs">
            {course.level.replace("_", " ")}
          </span>
        </Link>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          {course.category && (
            <div className="mb-2">
              <span className="inline-block text-[11px] font-bold text-[#061D42] bg-[#061D42]/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                {course.category.name}
              </span>
            </div>
          )}

          {/* Urdu Title if available */}
          {course.urduTitle && (
            <div className="text-sm font-semibold text-[#061D42] dark:text-[#C08C52] font-urdu mb-1" dir="rtl">
              {course.urduTitle}
            </div>
          )}

          {/* Course Title */}
          <h4 className="text-base font-bold text-[#161821] font-heading line-clamp-2 leading-snug group-hover:text-[#061D42] transition duration-200">
            <Link href={`/courses/${course.slug}`}>{course.title}</Link>
          </h4>

          {/* Course Meta: Lessons & Duration */}
          <div className="flex items-center gap-4 text-xs text-[#57595F] mt-3">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#C08C52]" />
              {course.totalLectures || 24} Lessons
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C08C52]" />
              {course.totalDurationSec > 0 ? formatDuration(course.totalDurationSec) : "In Production"}
            </span>
          </div>

          {/* Development Progress Bar */}
          <div className="mt-4 mb-2 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-[#57595F] font-medium">
              <span>Preparation Progress</span>
              <span className="font-bold text-[#061D42]">{course.progressPercent || 75}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#061D42] to-[#C08C52] rounded-full"
                style={{ width: `${course.progressPercent || 75}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status & Pricing Row */}
        <div className="mt-4 pt-3 border-t border-[#EAEBED] flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#09BD3C] bg-[#09BD3C]/10 px-2.5 py-0.5 rounded-full">
            100% Free Tuition
          </span>
          <span className="text-xs text-[#57595F] font-medium">
            Ministry Endowed
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <Link
            href={`/courses/${course.slug}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#061D42] hover:bg-[#0A2B5E] shadow-xs transition-all duration-200"
          >
            <Clock className="w-3.5 h-3.5 text-[#C08C52]" />
            <span>Preview Course / Coming Soon</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
