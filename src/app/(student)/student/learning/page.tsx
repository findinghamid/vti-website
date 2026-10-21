"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Star,
  Award,
  Video,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnrollmentRecord } from "@/server/services/enrollment.service";

export default function StudentLearningPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "in_progress" | "completed">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await fetch("/api/v1/student/learning");
        const data = await res.json();
        if (data.success && data.data?.enrollments) {
          setEnrollments(data.data.enrollments);
        }
      } catch (e) {
        console.error("Failed fetching enrollments", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter((e) => {
    if (filter === "completed") return e.progressPct === 100;
    if (filter === "in_progress") return e.progressPct > 0 && e.progressPct < 100;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAEBED]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#161821] tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-xs sm:text-sm text-[#55585B] mt-1">
            Track your curriculum progress, resume video lectures, and earn verifiable certificates.
          </p>
        </div>
        <Link href="/courses">
          <Button className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-10 px-5 gap-2 rounded-xl shadow-xs cursor-pointer">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC221]" />
            <span>Browse Catalog</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs matching VTI  */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === "all"
              ? "bg-[#FF5B35] text-white shadow-xs"
              : "bg-white border border-[#EAEBED] text-[#55585B] hover:text-[#161821] hover:border-[#FF5B35]"
          }`}
        >
          All Courses ({enrollments.length})
        </button>
        <button
          onClick={() => setFilter("in_progress")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === "in_progress"
              ? "bg-[#FF5B35] text-white shadow-xs"
              : "bg-white border border-[#EAEBED] text-[#55585B] hover:text-[#161821] hover:border-[#FF5B35]"
          }`}
        >
          In Progress ({enrollments.filter((e) => e.progressPct > 0 && e.progressPct < 100).length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            filter === "completed"
              ? "bg-[#FF5B35] text-white shadow-xs"
              : "bg-white border border-[#EAEBED] text-[#55585B] hover:text-[#161821] hover:border-[#FF5B35]"
          }`}
        >
          Completed ({enrollments.filter((e) => e.progressPct === 100).length})
        </button>
      </div>

      {/* Grid or Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#EAEBED] bg-white p-4 space-y-3 animate-pulse"
            >
              <div className="aspect-video bg-[#F3F4F8] rounded-xl" />
              <div className="h-4 bg-[#F3F4F8] rounded w-3/4" />
              <div className="h-3 bg-[#F3F4F8] rounded w-1/2" />
              <div className="h-2 bg-[#F3F4F8] rounded w-full mt-4" />
            </div>
          ))}
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="rounded-3xl border border-[#EAEBED] bg-white p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FF5B35]/10 text-[#FF5B35] mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#161821]">
              {filter === "all"
                ? "No active course enrollments"
                : filter === "completed"
                ? "No completed courses yet"
                : "No courses currently in progress"}
            </h2>
            <p className="text-xs text-[#55585B] max-w-sm mx-auto">
              Explore our comprehensive software engineering and architecture courses to start your learning journey.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/courses">
              <Button className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs">
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enr) => {
            const course = enr.course || {
              id: enr.courseId,
              title: "Mastering Next.js 16 & TypeScript: Enterprise Architecture",
              slug: "mastering-nextjs-16-typescript-enterprise-architecture",
              thumbnailUrl: null,
              totalDurationSec: 54000,
              totalLectures: 48,
              instructors: [{ name: "Dr. Farooq Khan", avatarUrl: null }],
            };

            const isDone = enr.progressPct === 100;
            const completedLectures = Math.round(
              ((enr.progressPct || 0) / 100) * (course.totalLectures || 20)
            );

            return (
              <div
                key={enr.id}
                className="rounded-2xl border border-[#EAEBED] bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail with overlay play trigger */}
                  <div className="relative aspect-video w-full bg-[#161821] overflow-hidden">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 350px"
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1E2235] to-[#161821] flex items-center justify-center text-[#FF5B35] font-bold text-sm">
                        VTI Course
                      </div>
                    )}

                    <Link
                      href={`/learn/${course.slug}`}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-white text-[#FF5B35] flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-200">
                        <Play className="w-5 h-5 fill-[#FF5B35] ml-0.5" />
                      </div>
                    </Link>

                    {isDone && (
                      <span className="absolute top-2.5 right-2.5 bg-[#09BD3C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>

                  {/* Course Details matching VTI  */}
                  <div className="p-5 space-y-3">
                    {/* Stars */}
                    <div className="flex items-center gap-1.5 text-xs text-[#FFC221]">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-[#FFC221]" />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-[#8A8C90]">
                        (5.0 • 24 Reviews)
                      </span>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/learn/${course.slug}`}
                      className="block font-bold text-sm text-[#161821] hover:text-[#FF5B35] transition line-clamp-2 leading-snug"
                    >
                      {course.title}
                    </Link>

                    {/* Metadata Strip */}
                    <div className="flex items-center gap-4 text-xs text-[#55585B] pt-1">
                      <div className="flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-[#8A8C90]" />
                        <span>{course.totalLectures || 32} Lessons</span>
                      </div>
                      {course.instructors && course.instructors[0] && (
                        <div className="flex items-center gap-1 truncate">
                          <Users className="w-3.5 h-3.5 text-[#8A8C90]" />
                          <span className="truncate">{course.instructors[0].name}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar matching VTI */}
                    <div className="space-y-1.5 pt-2 border-t border-[#EAEBED]">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-[#55585B]">
                          {completedLectures}/{course.totalLectures || 20} Lectures
                        </span>
                        <span className="font-extrabold text-[#161821]">
                          {enr.progressPct}% Complete
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#F3F4F8] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isDone ? "bg-[#09BD3C]" : "bg-[#FF5B35]"
                          }`}
                          style={{ width: `${enr.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Action Button */}
                <div className="p-5 pt-0">
                  {isDone ? (
                    <div className="flex gap-2">
                      <Link href={`/student/certificates`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full font-bold text-xs h-10 border-[#09BD3C]/40 text-[#09BD3C] hover:bg-[#E8F8EE] rounded-xl flex items-center justify-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Certificate</span>
                        </Button>
                      </Link>
                      <Link href={`/learn/${course.slug}`} className="flex-1">
                        <Button
                          variant="default"
                          className="w-full font-bold text-xs h-10 bg-[#FF5B35] hover:bg-[#E04824] text-white rounded-xl flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Review</span>
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Link href={`/learn/${course.slug}`} className="w-full block">
                      <Button
                        className="w-full font-bold text-xs h-10 bg-[#FF5B35] hover:bg-[#E04824] text-white rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{enr.progressPct > 0 ? "Resume Learning" : "Start Course"}</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
