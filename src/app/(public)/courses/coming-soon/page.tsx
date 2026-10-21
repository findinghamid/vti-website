import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { VTI_COURSES, VTI_FACULTIES } from "@/server/services/vti-catalog";
import {
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Bell,
  ArrowRight,
  ShieldCheck,
  Video,
  Layers,
  GraduationCap,
  MessageCircle,
  Home,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Courses Are Coming Soon | Virtual Theology Institute",
  description:
    "Our tuition-free Urdu theological courses are currently in studio recording and preparation. Explore upcoming courses across all 4 faculties.",
  canonical: "/courses/coming-soon",
});

export default function CoursesComingSoonPage() {
  return (
    <div className="w-full bg-[#F8F8FA] dark:bg-[#0A101D] min-h-screen pb-24">
      {/* 1. Breadcrumb Banner with institutional styling */}
      <section className="relative overflow-hidden bg-[#061D42] py-16 sm:py-20 text-white border-b border-[#C08C52]/20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Courses Coming Soon"
            fill
            sizes="100vw"
            className="object-cover opacity-15"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061D42] via-[#061D42]/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center sm:text-left">
          {/* Breadcrumb Links */}
          <nav className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-300 mb-6">
            <Link href="/" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <Home className="w-3.5 h-3.5 text-[#C08C52]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link href="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#C08C52] font-bold">Coming Soon</span>
          </nav>

          {/* Prominent Coming Soon Heading */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C08C52]/20 border border-[#C08C52]/40 text-[#C08C52] text-xs font-black uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-[#C08C52] animate-pulse" />
              <span>Academic Curriculum in Production</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight leading-tight uppercase">
              COURSES ARE COMING SOON
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
              Virtual Theology Institute is actively preparing high-definition Urdu video lectures, comprehensive study syllabi, and academic assessments for our upcoming courses. All courses will be delivered 100% tuition-free upon release.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Launch Notification & Milestone Tracker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-[#161821] rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EAEBED] dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Explanation */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-[#C08C52]">
                Stay Informed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#161821] dark:text-white font-heading">
                Be the First to Know When Enrollment Opens
              </h2>
              <p className="text-sm text-[#57595F] dark:text-slate-300 leading-relaxed">
                Enter your email address below to receive launch announcements, syllabus previews, and early access invitations the moment our recording studio completes course production.
              </p>

              {/* Email Subscription Form */}
              <form className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl border border-[#EAEBED] dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[#161821] dark:text-white text-sm focus:outline-hidden focus:border-[#061D42]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#061D42] hover:bg-[#0A2B5E] text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
                >
                  <Bell className="w-4 h-4 text-[#C08C52]" />
                  <span>Notify Me at Launch</span>
                </button>
              </form>

              <div className="flex items-center gap-2 text-xs text-[#57595F] dark:text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#09BD3C]" />
                <span>Zero spam. No credit card required. Purely theological updates.</span>
              </div>
            </div>

            {/* Right: Production Pipeline */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 border border-[#EAEBED] dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#061D42] dark:text-[#C08C52]">
                Course Production Roadmap
              </h3>
              <ul className="space-y-3.5 text-xs text-[#57595F] dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#161821] dark:text-white block">Step 1: Theological Curriculum Outlines</strong>
                    All 14 doctrinal chapters and hermeneutical outlines approved by faculty.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#161821] dark:text-white block">Step 2: Urdu Translation & Scriptural Cross-Referencing</strong>
                    Van Dyck Urdu Bible references and student study guides finalized.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#C08C52]/20 border border-[#C08C52] text-[#C08C52] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C08C52] animate-ping" />
                  </div>
                  <div>
                    <strong className="text-[#061D42] dark:text-[#C08C52] block">Step 3: Studio Recording & Video Editing (In Progress)</strong>
                    High-definition lecture recording and Urdu voiceover mastering underway.
                  </div>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                  <div>
                    <strong className="block text-slate-400">Step 4: Public Launch & Free Enrollment</strong>
                    Courses go live on the VTI LMS with full assessment quizzes and certificates.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Academic Faculties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#C08C52]">
            Academic Structure
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#161821] dark:text-white font-heading">
            Our Four Foundational Faculties
          </h2>
          <p className="text-sm text-[#57595F] dark:text-slate-400 leading-relaxed">
            All upcoming courses are categorized into four specialized biblical divisions designed for thorough theological formation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VTI_FACULTIES.map((faculty) => (
            <div
              key={faculty.id}
              className="bg-white dark:bg-[#161821] rounded-2xl p-6 border border-[#EAEBED] dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#061D42]/40 transition duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#061D42]/10 text-[#061D42] dark:bg-[#C08C52]/20 dark:text-[#C08C52] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#C08C52] font-urdu mb-0.5" dir="rtl">
                    {faculty.urduName}
                  </div>
                  <h3 className="text-base font-bold text-[#161821] dark:text-white font-heading">
                    {faculty.name}
                  </h3>
                </div>
                <p className="text-xs text-[#57595F] dark:text-slate-400 leading-relaxed">
                  {faculty.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#EAEBED] dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#061D42] dark:text-slate-300">
                  {faculty.count} {faculty.count === 1 ? "Course" : "Courses"} in Prep
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#C08C52]/15 text-[#C08C52] font-bold text-[10px]">
                  Coming Soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Upcoming Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#C08C52]">
              Course Catalog Preview
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#161821] dark:text-white font-heading">
              Upcoming Courses in Production
            </h2>
            <p className="text-sm text-[#57595F] dark:text-slate-400 mt-1">
              Explore the 7 foundational courses being developed for VTI learners.
            </p>
          </div>
          <Link
            href="/courses"
            className="text-xs font-bold text-[#061D42] dark:text-[#C08C52] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VTI_COURSES.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-[#161821] rounded-3xl border border-[#EAEBED] dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#061D42]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Course Thumbnail with Coming Soon Badge */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />

                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#C08C52] text-[#061D42] shadow-md">
                    Coming Soon
                  </span>

                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#061D42]/90 text-white backdrop-blur-xs">
                    {course.category.name}
                  </span>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-3">
                  {/* Urdu Title */}
                  <div className="text-sm font-semibold text-[#061D42] dark:text-[#C08C52] font-urdu" dir="rtl">
                    {course.urduTitle}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#161821] dark:text-white font-heading line-clamp-2 leading-snug">
                    <Link href={`/courses/${course.slug}`} className="hover:text-[#061D42] dark:hover:text-[#C08C52] transition">
                      {course.title}
                    </Link>
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs text-[#57595F] dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {course.subtitle}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-[#57595F] dark:text-slate-400 pt-2">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#C08C52]" />
                      {course.totalLectures} Lessons
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C08C52]" />
                      Studio Recording
                    </span>
                  </div>

                  {/* Preparation Progress Bar */}
                  <div className="pt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#57595F] dark:text-slate-400 font-medium">
                      <span>Development Progress</span>
                      <span className="font-bold text-[#061D42] dark:text-[#C08C52]">{course.progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#061D42] to-[#C08C52] rounded-full"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#EAEBED] dark:border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-[#09BD3C] bg-[#09BD3C]/10 px-2.5 py-1 rounded-md">
                    100% Free Tuition
                  </span>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-[#061D42] hover:bg-[#0A2B5E] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="w-3 h-3 text-[#C08C52]" />
                    <span>Preview Overview</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Ministry Community Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-gradient-to-r from-[#061D42] to-[#0A2B5E] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-[#C08C52]">
              Student Fellowship
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading leading-tight">
              Connect With the VTI Student Community
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              While courses are in preparation, join our student WhatsApp study cohort for weekly devotionals, prayer fellowship, and scripture discussions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="https://chat.whatsapp.com/invite/vti-theology-cohort"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Join WhatsApp Cohort</span>
            </a>
            <Link
              href="/go-gospel"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer border border-white/20"
            >
              <span>Explore Go Gospel Music</span>
              <ArrowRight className="w-4 h-4 text-[#C08C52]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
