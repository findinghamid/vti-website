"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Star,
  BookOpen,
  Users,
  Sparkles,
  Play,
  GraduationCap,
} from "lucide-react";
import { VtiButton, VtiBadge, DecorativeUnderline } from "@/components/ui/vti";

export function HomeHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFBF2] via-[#FAF9F6] to-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#EAEBED]">
      {/* Decorative background curve */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none -z-0">
        <svg
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          <path
            d="M200 600C350 650 820 790 460 560C100 330 480 400 740 460C1000 520 190 -40 70 90C-50 220 490 430 480 50"
            stroke="#C08C52"
            strokeWidth="80"
            strokeLinecap="round"
            opacity="0.12"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Subtitle Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#061D42]/10 text-[#061D42] border border-[#061D42]/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C08C52]" />
              <span>100% Free Christian Theological Education</span>
            </div>

            {/* Headline with Signature Curved Underline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#061D42] tracking-tight leading-[1.12]">
              Deep Biblical Truth.{" "}
              <span className="VTI-underline-container relative">
                <span className="relative z-10 text-[#C08C52]">Free</span>
                <DecorativeUnderline color="#C08C52" className="h-[14px] -bottom-1" />
              </span>{" "}
              For The Global Church.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#57595F] max-w-xl leading-relaxed">
              Equipping pastors, church leaders, and dedicated believers through rigorous, 
              confessionally orthodox theological courses, biblical languages, and pastoral training—completely tuition-free.
            </p>

            {/* Search Input Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative flex items-center shadow-md shadow-[#061D42]/5 rounded-2xl bg-white border-2 border-[#EAEBED] focus-within:border-[#061D42] transition duration-200 p-1.5">
                <div className="pl-3 text-[#061D42]">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search theology, Greek, church history, doctrines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 px-3 text-sm font-semibold text-[#161821] bg-transparent placeholder:text-[#57595F] focus:outline-none"
                />
                <VtiButton type="submit" variant="primary" size="md">
                  Search
                </VtiButton>
              </div>
            </form>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <VtiButton href="/courses" variant="primary" size="lg" showArrow>
                Explore Free Courses
              </VtiButton>
              <VtiButton href="/categories" variant="border" size="lg">
                Browse Faculties
              </VtiButton>
            </div>

            {/* Social Proof & Metrics */}
            <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-8 border-t border-[#EAEBED] w-full max-w-lg">
              {/* Student Community Avatar Stack */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <div className="relative w-9 h-9 rounded-full ring-2 ring-white overflow-hidden shadow-xs shrink-0">
                    <Image
                      src="/assets/img/avatars/student-1.jpg"
                      alt="VTI Student"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-9 h-9 rounded-full ring-2 ring-white overflow-hidden shadow-xs shrink-0">
                    <Image
                      src="/assets/img/avatars/student-2.jpg"
                      alt="VTI Student"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-9 h-9 rounded-full ring-2 ring-white overflow-hidden shadow-xs shrink-0">
                    <Image
                      src="/assets/img/avatars/scholar-dr-junaid.jpg"
                      alt="VTI Faculty"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-9 h-9 rounded-full ring-2 ring-white overflow-hidden shadow-xs shrink-0">
                    <Image
                      src="/assets/img/avatars/student-3.jpg"
                      alt="VTI Student"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-[#161821] leading-tight">5,000+ Enrolled Learners</p>
                  <p className="text-[#57595F] flex items-center gap-1 font-semibold">
                    <span className="text-[#FFB21D] font-bold">★★★★★</span> 4.9/5 Student Rating
                  </p>
                </div>
              </div>

              {/* Core Theological Program Stat */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#061D42]/10 text-[#061D42] flex items-center justify-center font-black shrink-0">
                  <GraduationCap className="w-5 h-5 text-[#C08C52]" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-[#161821] leading-tight">4 Theological Faculties</p>
                  <p className="text-[#09BD3C] font-bold">100% Free Tuition</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Course Preview Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl border-2 border-[#EAEBED] shadow-2xl p-5 relative transition-all duration-300 hover:shadow-[#061D42]/10 hover:border-[#061D42]/40">
              {/* Teacher row & 100% Free badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#EAEBED] shadow-xs shrink-0">
                    <Image
                      src="/assets/img/avatars/scholar-dr-junaid.jpg"
                      alt="Dr. Junaid Javed, Ph.D."
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-extrabold text-[#161821]">
                    Dr. Junaid Javed, Ph.D.
                  </span>
                </div>
                <VtiBadge variant="free">100% Free Tuition</VtiBadge>
              </div>

              {/* Thumbnail Container */}
              <Link
                href="/courses/christian-foundational-beliefs"
                className="block relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-4 group cursor-pointer shadow-md"
              >
                <Image
                  src="/assets/img/hero/hero-study.jpg"
                  alt="Christian Foundational Beliefs"
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Overlay Text */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="font-mono text-[10px] text-[#C08C52] uppercase tracking-wider block font-bold">
                    Faculty of Christian Foundation • مسیحی بنیاد
                  </span>
                  <h4 className="font-extrabold text-white text-sm sm:text-base leading-tight drop-shadow-sm font-heading">
                    Christian Foundational Beliefs
                  </h4>
                </div>

                {/* Floating Play Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                  <div className="w-12 h-12 rounded-full bg-white/95 text-[#061D42] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-current text-[#061D42]" />
                  </div>
                </div>

                <div className="absolute top-3 left-3">
                  <VtiBadge variant="featured">Flagship Course</VtiBadge>
                </div>
              </Link>

              {/* Metadata Row */}
              <div className="flex items-center gap-4 text-xs font-semibold text-[#57595F] mb-3">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#C08C52]" />
                  <span>14 Modules</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#C08C52]" />
                  <span>Open Enrollment</span>
                </span>
              </div>

              {/* Course Title */}
              <h3 className="font-extrabold text-base text-[#161821] leading-snug mb-3 hover:text-[#061D42] transition">
                <Link href="/courses/christian-foundational-beliefs">
                  Christian Foundational Beliefs: Core Biblical Doctrines
                </Link>
              </h3>

              {/* Rating & Pricing */}
              <div className="flex items-center justify-between pt-3 border-t border-[#EAEBED] mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-[#161821]">5.0</span>
                  <div className="flex text-[#FFB21D]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#57595F]">(Scholarly Faculty)</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-[#09BD3C]">FREE</span>
                </div>
              </div>

              {/* Card Action */}
              <Link href="/courses/christian-foundational-beliefs" className="block w-full">
                <VtiButton variant="primary" size="md" className="w-full">
                  Explore Free Course
                </VtiButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
