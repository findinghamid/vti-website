import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  GraduationCap,
  BookOpen,
  Award,
  Mail,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Star,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { FacultyService } from "@/server/services/faculty.service";

interface FacultyProfileProps {
  params: Promise<{ slug?: string; id?: string }>;
}

export async function generateMetadata({ params }: FacultyProfileProps): Promise<Metadata> {
  const resolved = await params;
  const lookup = resolved.slug || resolved.id || "";
  const faculty = FacultyService.getFacultyBySlug(lookup);

  if (!faculty) {
    return {
      title: "Faculty Profile | Virtual Theological Institute (VTI)",
    };
  }

  return {
    title: `${faculty.name} (${faculty.credentials}) | Faculty Profile | VTI`,
    description: `${faculty.title} at Virtual Theological Institute. ${faculty.bio.slice(0, 160)}...`,
  };
}

export default async function FacultyProfileDetailPage({ params }: FacultyProfileProps) {
  const resolved = await params;
  const lookup = resolved.slug || resolved.id || "";
  const faculty = FacultyService.getFacultyBySlug(lookup);

  if (!faculty) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-12 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/instructors"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#57595F] hover:text-[#C08C52] transition py-1.5 px-3 rounded-xl bg-white border border-[#EAEBED] shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Instructors</span>
          </Link>
        </div>

        {/* Profile Hero Header Card */}
        <div className="bg-white rounded-3xl border border-[#EAEBED] shadow-xl p-8 sm:p-12 overflow-hidden relative">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left: Professional Photo with Gamified Golden Ring & Badge */}
            <div className="relative shrink-0">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden bg-slate-900 border-4 border-[#C08C52] shadow-2xl">
                <Image
                  src={faculty.avatarUrl}
                  alt={faculty.name}
                  fill
                  sizes="(max-width: 640px) 160px, 192px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#061D42] text-white text-[10px] font-black uppercase tracking-wider border-2 border-white shadow-md whitespace-nowrap">
                Verified Instructor
              </div>
            </div>

            {/* Right: Instructor Details & Credentials */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="space-y-1.5">
                <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#C08C52] bg-[#C08C52]/10 px-3 py-1 rounded-full">
                  {faculty.department}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#061D42] tracking-tight">
                  {faculty.name}, <span className="text-[#C08C52]">{faculty.credentials}</span>
                </h1>
                <p className="text-base sm:text-lg font-bold text-[#57595F]">
                  {faculty.title}
                </p>
              </div>

              {/* Bio Statement */}
              <p className="text-sm sm:text-base text-[#57595F] leading-relaxed max-w-3xl">
                {faculty.bio}
              </p>

              {/* Contact & Social Links */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs">
                <a
                  href={`mailto:${faculty.email}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAEBED] hover:border-[#C08C52] hover:text-[#C08C52] text-[#061D42] font-bold transition"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C08C52]" />
                  <span>{faculty.email}</span>
                </a>
                {faculty.socialLinks.linkedin && (
                  <a
                    href={faculty.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAEBED] hover:border-[#C08C52] hover:text-[#C08C52] text-[#061D42] font-bold transition"
                  >
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {faculty.socialLinks.website && (
                  <a
                    href={faculty.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAEBED] hover:border-[#C08C52] hover:text-[#C08C52] text-[#061D42] font-bold transition"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#09BD3C]" />
                    <span>Institute Portal</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout: Qualifications & Teaching Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (7 cols): Teaching Philosophy & Areas of Expertise */}
          <div className="lg:col-span-7 space-y-8">
            {/* Teaching Philosophy */}
            <div className="bg-white rounded-3xl border border-[#EAEBED] p-7 sm:p-9 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-[#061D42] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C08C52]" />
                <span>Teaching Philosophy & Convictions</span>
              </h2>
              <blockquote className="border-l-4 border-[#C08C52] pl-4 italic text-sm text-[#57595F] leading-relaxed">
                &ldquo;{faculty.teachingPhilosophy}&rdquo;
              </blockquote>
            </div>

            {/* Areas of Expertise */}
            <div className="bg-white rounded-3xl border border-[#EAEBED] p-7 sm:p-9 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-[#061D42] uppercase tracking-wider flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C08C52]" />
                <span>Areas of Specialization & Ministry</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {faculty.expertise.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF9F6] border border-[#EAEBED]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0" />
                    <span className="text-xs font-bold text-[#061D42]">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notable Publications */}
            {faculty.publications.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#EAEBED] p-7 sm:p-9 shadow-xs space-y-4">
                <h2 className="text-lg font-black text-[#061D42] uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#C08C52]" />
                  <span>Key Writings & Publications</span>
                </h2>
                <ul className="space-y-2.5 text-xs text-[#57595F]">
                  {faculty.publications.map((pub, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#C08C52] font-black">•</span>
                      <span className="font-semibold text-[#061D42]">{pub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Educational Background & Qualifications */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl border border-[#EAEBED] p-7 sm:p-9 shadow-xs space-y-5">
              <h2 className="text-lg font-black text-[#061D42] uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#C08C52]" />
                <span>Degrees & Qualifications</span>
              </h2>
              <div className="space-y-4">
                {faculty.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAEBED] space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs text-[#C08C52] font-black">
                      <span>{edu.year}</span>
                      <span className="text-[10px] text-[#8A8C90] uppercase tracking-wider">Conferred</span>
                    </div>
                    <h3 className="text-xs font-extrabold text-[#061D42]">
                      {edu.degree}
                    </h3>
                    <p className="text-[11px] text-[#57595F] font-semibold">
                      {edu.institution}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ministry & Mentorship Advisory Box */}
            <div className="p-7 rounded-3xl bg-[#FAF9F6] border border-[#C08C52]/30 space-y-3">
              <h3 className="text-sm font-black text-[#061D42] uppercase tracking-wider">
                Student Learning Guidance
              </h3>
              <p className="text-xs text-[#57595F] leading-relaxed">
                Enrolled students can submit reading questions and theological inquiries directly to {faculty.name} through official study cohorts and WhatsApp groups.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C08C52] hover:underline"
              >
                <span>Contact Academic Admissions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Courses Taught by This Instructor */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C08C52]">
                Curriculum
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#061D42]">
                Courses Taught by {faculty.name}
              </h2>
            </div>
            <Link
              href="/courses"
              className="text-xs font-bold text-[#C08C52] hover:underline flex items-center gap-1"
            >
              <span>Explore Entire Course Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faculty.coursesTaught.map((course) => (
              <div
                key={course.slug}
                className="group p-6 rounded-3xl bg-white border border-[#EAEBED] shadow-xs hover:shadow-xl hover:border-[#C08C52]/40 transition duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#09BD3C]/10 text-[#09BD3C] border border-[#09BD3C]/20">
                      100% Free Tuition
                    </span>
                    <span className="text-xs font-bold text-[#C08C52]">
                      Coming Soon
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-[#061D42] group-hover:text-[#C08C52] transition leading-snug">
                    <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                  </h3>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EAEBED] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#57595F]">
                    {course.level} Level
                  </span>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#061D42] hover:text-[#C08C52] transition group-hover:translate-x-0.5"
                  >
                    <span>View Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C08C52]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
