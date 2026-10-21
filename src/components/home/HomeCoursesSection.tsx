"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Sparkles, Layers, Video } from "lucide-react";
import { SectionHeading, VtiButton, VtiBadge, DecorativeUnderline } from "@/components/ui/vti";
import { VTI_COURSES, VtiCourseCatalogItem } from "@/server/services/vti-catalog";

interface HomeCoursesSectionProps {
  initialCourses?: VtiCourseCatalogItem[];
}

const FACULTY_TABS = [
  { id: "all", label: "All Upcoming Courses", urdu: "تمام کورسز" },
  { id: "cat-found", label: "Christian Foundation", urdu: "مسیحی بنیاد" },
  { id: "cat-interp", label: "Bible Interpretation", urdu: "بائبل تشریح" },
  { id: "cat-growth", label: "Spiritual Growth", urdu: "روحانی ترقی" },
  { id: "cat-apologetics", label: "Christian Apologetics", urdu: "مسیحی دفاعیات" },
];

export function HomeCoursesSection({ initialCourses }: HomeCoursesSectionProps) {
  const [activeTab, setActiveTab] = useState("all");
  const rawCourses = initialCourses && initialCourses.length > 0 ? initialCourses : VTI_COURSES;

  const displayedCourses = useMemo(() => {
    if (activeTab === "all") return rawCourses;
    return rawCourses.filter((c) => c.category.id === activeTab);
  }, [rawCourses, activeTab]);

  return (
    <section className="py-20 lg:py-24 bg-[#FAF9F6] border-b border-[#EAEBED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionHeading
              subtitle="Course Catalog"
              title={
                <span>
                  Upcoming Theological{" "}
                  <span className="vti-underline-container relative">
                    <span>Courses</span>
                    <DecorativeUnderline color="#C08C52" className="h-[12px] -bottom-1" />
                  </span>
                </span>
              }
            />
            <p className="mt-2 text-sm text-[#57595F] max-w-xl leading-relaxed">
              Tailored specifically for the Pakistani Christian community in Urdu. Rigorous,
              practical, and accessible for believers of all ages — 100% free tuition.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#EAEBED] shadow-xs self-start md:self-auto overflow-x-auto max-w-full">
            {FACULTY_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#061D42] text-white shadow-sm"
                      : "text-[#57595F] hover:text-[#061D42]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-[#C08C52] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCourses.map((course, idx) => {
            const instructor = course.instructors?.[0]?.instructor?.user;
            const instructorName = instructor?.name || "Dr. Junaid Javed, Ph.D.";
            const instructorAvatar =
              instructor?.avatarUrl || `/assets/img/teacher/teacher-${(idx % 3) + 1}.png`;
            const thumbnail =
              course.thumbnailUrl || `/assets/img/course/course-thumb-${(idx % 3) + 1}.jpg`;
            const progress = course.progressPercent || 70;

            return (
              <div
                key={course.id}
                className="group relative flex flex-col rounded-3xl bg-white border border-[#EAEBED] shadow-xs hover:shadow-xl hover:border-[#C08C52]/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1.5"
              >
                {/* Top Header: Instructor & Coming Soon Badge */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#EAEBED] bg-slate-100">
                      <Image
                        src={instructorAvatar}
                        alt={instructorName}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#061D42] truncate max-w-[160px]">
                      {instructorName}
                    </span>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider text-[#C08C52] bg-[#C08C52]/15 px-2.5 py-0.5 rounded-full border border-[#C08C52]/30">
                    Coming Soon
                  </span>
                </div>

                {/* Course Thumbnail with Video In-Production Effect */}
                <div className="relative aspect-video w-full px-5 overflow-hidden">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="block relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 group/thumb"
                  >
                    <Image
                      src={thumbnail}
                      alt={course.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover/thumb:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* In Production Overlay Badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-md text-[10px] font-bold">
                      <Video className="w-3 h-3 text-[#C08C52]" />
                      <span>Recording In Studio</span>
                    </div>

                    {/* Urdu Title Pill on image */}
                    {course.urduTitle && (
                      <span className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#061D42]/90 text-white font-urdu backdrop-blur-sm">
                        {course.urduTitle}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Category Tag */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-block text-[10px] font-extrabold text-[#C08C52] bg-[#C08C52]/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {course.category.name}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#09BD3C] bg-[#09BD3C]/10 px-2 py-0.5 rounded">
                        100% Free
                      </span>
                    </div>

                    {/* English Course Title */}
                    <h3 className="text-base sm:text-lg font-black text-[#061D42] group-hover:text-[#C08C52] transition-colors leading-snug mb-2">
                      <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                    </h3>

                    {/* Subtitle / Excerpt */}
                    <p className="text-xs text-[#57595F] line-clamp-2 leading-relaxed mb-4">
                      {course.subtitle || course.description}
                    </p>

                    {/* Development Progress Bar (Requested in Client PDF Guidelines) */}
                    <div className="space-y-1.5 bg-[#FAF9F6] p-3 rounded-2xl border border-[#EAEBED] mb-4">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-[#061D42] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#C08C52]" />
                          <span>Course Development</span>
                        </span>
                        <span className="text-[#C08C52] font-black">{progress}% Completed</span>
                      </div>
                      <div className="w-full bg-[#EAEBED] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#C08C52] to-[#D5A772] h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#57595F]">
                        Syllabus formulated • In studio video recording
                      </p>
                    </div>

                    {/* Course Meta: Lectures & Level */}
                    <div className="flex items-center gap-4 text-xs text-[#57595F] mb-2 font-medium">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#C08C52]" />
                        <span>{course.totalLectures} Modules</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C08C52]" />
                        <span>{Math.round(course.totalDurationSec / 3600)} Hours</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-[#EAEBED] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#57595F] block">
                        Tuition Status
                      </span>
                      <span className="text-sm font-black text-[#09BD3C]">Free / Open</span>
                    </div>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#061D42] hover:bg-[#0A2B5E] text-white text-xs font-bold transition shadow-xs"
                    >
                      <span>Preview Syllabus</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C08C52]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Upcoming Courses Banner */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#061D42] to-[#0A2B5E] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C08C52] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#C08C52]" />
              Production Roadmap
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              COURSES ARE COMING SOON
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              All 7 foundational courses are actively being recorded and translated in studio. Visit
              our dedicated Coming Soon launch portal to inspect production roadmaps and receive launch
              updates on WhatsApp.
            </p>
          </div>
          <Link
            href="/courses/coming-soon"
            className="px-6 py-3.5 rounded-2xl bg-[#C08C52] hover:bg-[#A9763D] text-white font-black text-xs transition shadow-md shrink-0 text-center"
          >
            Open Coming Soon Portal →
          </Link>
        </div>
      </div>
    </section>
  );
}
