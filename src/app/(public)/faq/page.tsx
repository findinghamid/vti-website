"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Search,
  HelpCircle,
  Mail,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Award,
  Sparkles,
} from "lucide-react";
import { VtiButton } from "@/components/ui/vti";

interface FAQItem {
  id: string;
  category: "admissions" | "academics" | "certificates" | "faith";
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "admissions",
    question: "Why are all courses at VTI 100% free?",
    answer:
      "The Virtual Theological Institute is fully funded through non-profit endowment gifts and generous Christian donors who believe biblical and theological education should never be hindered by tuition debt. Our mission is to equip pastors, missionaries, church planters, and believers globally without financial barrier.",
  },
  {
    id: "faq-2",
    category: "admissions",
    question: "What are the admission requirements to begin studying?",
    answer:
      "VTI welcomes any dedicated Christian believer, ministry leader, or inquirer seeking to deepen their understanding of God's Word. There are no prior degree prerequisites for certificate courses. You can create a free student account and begin learning immediately with one-click enrollment.",
  },
  {
    id: "faq-3",
    category: "academics",
    question: "How are the courses structured and evaluated?",
    answer:
      "Each course is composed of sequential multimedia lecture modules, required Scripture and primary source readings, downloadable study outlines, and objective module comprehension quizzes. Students proceed at their own self-paced schedule with lifetime access.",
  },
  {
    id: "faq-4",
    category: "certificates",
    question: "Do I receive a certificate upon finishing a course?",
    answer:
      "Yes. When you complete 100% of course lectures and pass the final evaluation quiz with an 80% or higher score, an official Certificate of Completion is issued with a unique cryptographic verification number and public verification URL on vti-edu.org.",
  },
  {
    id: "faq-5",
    category: "certificates",
    question: "Can these certificates be verified by my church or ministry board?",
    answer:
      "Absolutely. Anyone can visit our public verification portal at vti-edu.org/verify/[certificateNo] to verify the student's name, course completed, issue date, and faculty accreditation signature.",
  },
  {
    id: "faq-6",
    category: "faith",
    question: "What is VTI's doctrinal stance and Statement of Faith?",
    answer:
      "VTI affirms historic Christian orthodoxy as expressed in the Nicene and Apostles' Creeds. We uphold the divine inspiration, inerrancy, and supreme authority of Scripture, the Triune nature of God, the full deity and humanity of Christ, substitutionary atonement, salvation by grace alone through faith alone in Christ alone, and the bodily resurrection.",
  },
  {
    id: "faq-7",
    category: "academics",
    question: "Can I take courses while serving in full-time pastoral ministry?",
    answer:
      "Yes! Our curriculum is specifically designed for bi-vocational pastors, elders, missionaries, and active church leaders. Because there are no mandatory live attendance requirements or rigid deadlines, you study according to your ministry calendar.",
  },
  {
    id: "faq-8",
    category: "faith",
    question: "Which Bible translations are used throughout the curriculum?",
    answer:
      "Our faculty primarily teach using formal-equivalence translations such as the English Standard Version (ESV), New American Standard Bible (NASB), and King James Version (KJV), while continually referencing the original Hebrew Masoretic Text and Nestle-Aland Greek New Testament.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#FAF9F6] text-[#161821] min-h-screen font-sans pb-24">
      {/* 1. VTI Breadcrumb & Header Banner */}
      <section className="relative bg-[#161821] text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="FAQ Banner"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161821]/95 via-[#161821]/80 to-[#161821]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-white/70">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFC221]">Frequently Asked Questions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our free tuition model, academic accreditation, doctrinal convictions, and student learning experience.
          </p>
        </div>
      </section>

      {/* 2. Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {[
            { id: "all", label: "All Questions" },
            { id: "admissions", label: "Admissions & Tuition" },
            { id: "academics", label: "Academic Curriculum" },
            { id: "certificates", label: "Certificates & Verification" },
            { id: "faith", label: "Statement of Faith" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#FF5B35] text-white shadow-md shadow-orange-500/20"
                  : "bg-white text-[#57595F] border border-[#EAEBED] hover:border-[#FF5B35] hover:text-[#161821]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 2-Column Grid: Left Contact Box + Right Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Search & Direct Advisory Box */}
          <div className="lg:col-span-4 space-y-6">
            {/* Search Box */}
            <div className="p-6 rounded-3xl bg-white border border-[#EAEBED] shadow-xs">
              <h3 className="font-extrabold text-sm text-[#161821] uppercase tracking-wider mb-3">
                Search Questions
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Keywords (e.g. tuition, greek)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 rounded-xl bg-[#F8F8FA] border border-[#EAEBED] text-xs font-medium text-[#161821] placeholder:text-[#57595F] focus:outline-none focus:border-[#FF5B35] focus:bg-white transition"
                />
                <Search className="w-4 h-4 text-[#FF5B35] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Direct Faculty Support Card */}
            <div className="p-7 rounded-3xl bg-[#FFFBF2] border border-[#FFC221]/40 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5B35] text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-lg text-[#161821]">
                  Still Have Questions?
                </h4>
                <p className="text-xs text-[#57595F] mt-1.5 leading-relaxed">
                  Our academic deans and student admissions advisors are here to guide your ministerial calling.
                </p>
              </div>

              <div className="pt-2 border-t border-[#FFC221]/30 space-y-2 text-xs font-semibold text-[#161821]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FF5B35]" />
                  <a
                    href="mailto:admissions@vti-edu.org"
                    className="hover:text-[#FF5B35] transition"
                  >
                    admissions@vti-edu.org
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <VtiButton href="/contact" variant="primary" size="md" className="w-full">
                  Contact Admissions
                </VtiButton>
              </div>
            </div>

            {/* Value Badges */}
            <div className="p-6 rounded-3xl bg-white border border-[#EAEBED] shadow-xs space-y-3.5">
              <div className="flex items-center gap-3 text-xs font-bold text-[#161821]">
                <div className="w-8 h-8 rounded-xl bg-[#09BD3C]/10 text-[#09BD3C] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>100% Free Tuition Endowed</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-[#161821]">
                <div className="w-8 h-8 rounded-xl bg-[#2950FF]/10 text-[#2950FF] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span>Verifiable Digital Certificates</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-[#161821]">
                <div className="w-8 h-8 rounded-xl bg-[#FF5B35]/10 text-[#FF5B35] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span>Confessionally Orthodox Curriculum</span>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-8 space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#EAEBED] space-y-3">
                <p className="font-bold text-[#161821]">No questions matched your query.</p>
                <p className="text-xs text-[#57595F]">Try searching for other terms or reset the filters.</p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                  className="mt-2 text-xs font-bold text-[#FF5B35] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl transition-all duration-200 border ${
                      isOpen
                        ? "bg-white border-[#FF5B35] shadow-lg shadow-orange-500/5"
                        : "bg-white border-[#EAEBED] hover:border-[#FF5B35]/40"
                    }`}
                  >
                    <button
                      onClick={() => setExpandedId(isOpen ? null : faq.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-extrabold text-sm sm:text-base text-[#161821]">
                        {faq.question}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center transition-all ${
                          isOpen
                            ? "bg-[#FF5B35] text-white rotate-180"
                            : "bg-[#F8F8FA] text-[#57595F]"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#57595F] leading-relaxed border-t border-[#EAEBED]/60 animate-in fade-in duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
