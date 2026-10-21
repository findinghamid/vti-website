import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  GraduationCap,
  BookOpen,
  Award,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FacultyService } from "@/server/services/faculty.service";
import { VtiButton, VtiBadge } from "@/components/ui/vti";

export const metadata: Metadata = {
  title: "Faculty & Instructors | Virtual Theological Institute (VTI)",
  description:
    "Meet the qualified, pastoral Bible instructors and theological educators teaching accessible, non-denominational Urdu Bible courses at Virtual Theological Institute.",
  alternates: {
    canonical: "https://vti-edu.org/instructors",
  },
};

export default function FacultyDirectoryPage() {
  const facultyList = FacultyService.getAllFaculty();

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-14 sm:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#C08C52]/15 text-[#C08C52] border border-[#C08C52]/30 shadow-2xs">
            <GraduationCap className="w-4 h-4 text-[#C08C52]" />
            <span>Sound & Confessional Instructors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#061D42] tracking-tight leading-tight">
            Theological Instructors Directory
          </h1>
          <p className="text-sm sm:text-base text-[#57595F] leading-relaxed">
            Our instructors unite rigorous academic scholarship with passionate pastoral devotion to
            Christ and His Church, equipping believers across all walks of life with easy-to-understand
            Bible education in Urdu.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facultyList.map((faculty) => (
            <div
              key={faculty.id}
              className="group flex flex-col justify-between rounded-3xl bg-white border border-[#EAEBED] p-7 shadow-xs hover:shadow-2xl hover:border-[#C08C52]/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div>
                {/* Header: Circular Avatar with Gamified Gold Ring */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative w-18 h-18 rounded-2xl overflow-hidden bg-slate-900 border-2 border-[#C08C52] shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={faculty.avatarUrl}
                      alt={faculty.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#C08C52] bg-[#C08C52]/10 px-2 py-0.5 rounded-md">
                      {faculty.department}
                    </span>
                    <h3 className="text-base font-black text-[#061D42] group-hover:text-[#C08C52] transition leading-snug">
                      <Link href={`/faculty/${faculty.slug}`}>{faculty.name}</Link>
                    </h3>
                    <p className="text-xs font-semibold text-[#8A8C90]">
                      {faculty.credentials}
                    </p>
                  </div>
                </div>

                {/* Title / Position at VTI */}
                <p className="text-xs font-bold text-[#061D42] border-b border-[#EAEBED] pb-3 mb-3">
                  {faculty.title}
                </p>

                {/* Excerpt Bio */}
                <p className="text-xs text-[#57595F] line-clamp-3 leading-relaxed mb-4">
                  {faculty.bio}
                </p>

                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {faculty.expertise.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="text-[10px] font-bold bg-[#FAF9F6] text-[#57595F] border border-[#EAEBED] px-2 py-0.5 rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer: Courses Taught & Profile Link */}
              <div className="pt-4 border-t border-[#EAEBED] flex items-center justify-between">
                <span className="text-xs text-[#57595F] flex items-center gap-1.5 font-semibold">
                  <BookOpen className="w-3.5 h-3.5 text-[#C08C52]" />
                  <span>{faculty.coursesTaught.length} Courses</span>
                </span>
                <Link
                  href={`/faculty/${faculty.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#061D42] hover:text-[#C08C52] transition group-hover:translate-x-0.5"
                >
                  <span>View Instructor Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C08C52]" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Accreditation & Doctrinal Conviction Callout */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#061D42] to-[#0A2B5E] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C08C52] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#C08C52]" />
              Doctrinal & Ministerial Fidelity
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Every Instructor Affirms Historic Orthodoxy
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              All instructors at VTI joyfully affirm the total inerrancy of Scripture, the historic
              ecumenical creeds, the Trinity, and the supreme lordship of Jesus Christ.
            </p>
          </div>
          <Link
            href="/statement-of-faith"
            className="px-6 py-3 rounded-2xl bg-[#C08C52] hover:bg-[#A9763D] text-white font-extrabold text-xs transition shadow-md shrink-0"
          >
            Read Statement of Faith
          </Link>
        </div>
      </div>
    </main>
  );
}
