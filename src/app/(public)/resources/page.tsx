"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  FileText,
  BookOpen,
  Languages,
  Scroll,
  Search,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { VtiButton } from "@/components/ui/vti";

interface ResourceItem {
  id: string;
  title: string;
  category: "languages" | "creeds" | "theology" | "ministry";
  description: string;
  fileFormat: string;
  fileSize: string;
  faculty: string;
  downloadUrl: string;
}

const RESOURCES: ResourceItem[] = [
  {
    id: "res-1",
    title: "Koine Greek Paradigm & Vocabulary Chart",
    category: "languages",
    description:
      "Comprehensive quick-reference chart featuring noun declensions (1st, 2nd, 3rd), active/middle/passive indicative verb paradigms, and the 300 most common NT Greek words.",
    fileFormat: "PDF Document",
    fileSize: "2.4 MB",
    faculty: "Faculty of Biblical Languages",
    downloadUrl: "#",
  },
  {
    id: "res-2",
    title: "Biblical Hebrew Alphabet & Vowel Pointing Guide",
    category: "languages",
    description:
      "Essential beginner handbook for reading the Masoretic text: 22 consonants, Niqqud vowel points, Dagesh rules, and basic strong verb conjugations.",
    fileFormat: "PDF Document",
    fileSize: "3.1 MB",
    faculty: "Faculty of Biblical Languages",
    downloadUrl: "#",
  },
  {
    id: "res-3",
    title: "The Four Ecumenical Creeds with Historical Commentary",
    category: "creeds",
    description:
      "Complete unabridged texts of the Apostles' Creed, Nicene-Constantinopolitan Creed (381 AD), Chalcedonian Definition (451 AD), and Athanasian Creed with Latin/Greek parallel references.",
    fileFormat: "PDF Document",
    fileSize: "1.8 MB",
    faculty: "Faculty of Church History",
    downloadUrl: "#",
  },
  {
    id: "res-4",
    title: "Foundations of Systematic Theology: Module Study Outlines",
    category: "theology",
    description:
      "Full lecture outlines covering divine revelation, the canon of Scripture, inerrancy, the Trinity, and divine sovereignty with extensive Scripture cross-references.",
    fileFormat: "PDF Document",
    fileSize: "4.2 MB",
    faculty: "Faculty of Systematic Theology",
    downloadUrl: "#",
  },
  {
    id: "res-5",
    title: "Expository Sermon Preparation & Exegesis Worksheet",
    category: "ministry",
    description:
      "A systematic 8-step pastoral preparation framework moving from grammatical-historical exegesis to homiletical structure, Christ-centered application, and illustration.",
    fileFormat: "PDF / Word Document",
    fileSize: "1.2 MB",
    faculty: "Faculty of Pastoral Ministry",
    downloadUrl: "#",
  },
  {
    id: "res-6",
    title: "Redemptive History Covenant Timeline & Bible Reading Plan",
    category: "theology",
    description:
      "Visual chart illustrating the biblical covenants (Adamic, Noahic, Abrahamic, Mosaic, Davidic, New) through biblical typology culminating in the life and cross of Christ.",
    fileFormat: "PDF High-Resolution Poster",
    fileSize: "5.6 MB",
    faculty: "Faculty of Biblical Hermeneutics",
    downloadUrl: "#",
  },
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = RESOURCES.filter((res) => {
    const matchesCategory =
      activeCategory === "all" || res.category === activeCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.faculty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#FAF9F6] text-[#161821] min-h-screen font-sans pb-24">
      {/* Header Banner */}
      <section className="relative bg-[#161821] text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Resources Banner"
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
            <span className="text-[#FFC221]">Study Resources & Syllabi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Theological Resources & Downloads
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Free downloadable study charts, biblical language paradigms, primary creeds, and preaching outlines to support your theological studies.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Downloads" },
              { id: "languages", label: "Biblical Languages" },
              { id: "creeds", label: "Historic Creeds" },
              { id: "theology", label: "Systematic Outlines" },
              { id: "ministry", label: "Pastoral Ministry" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#FF5B35] text-white shadow-sm"
                    : "bg-white text-[#57595F] border border-[#EAEBED] hover:border-[#FF5B35] hover:text-[#161821]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-3.5 pr-9 rounded-xl bg-white border border-[#EAEBED] text-xs font-medium text-[#161821] placeholder:text-[#57595F] focus:outline-none focus:border-[#FF5B35] transition"
            />
            <Search className="w-4 h-4 text-[#FF5B35] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="group p-6 rounded-3xl bg-white border border-[#EAEBED] shadow-xs hover:shadow-xl hover:border-[#FF5B35]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF5B35] bg-[#FF5B35]/10 px-2.5 py-0.5 rounded-md">
                    {res.faculty}
                  </span>
                  <span className="text-[11px] font-bold text-[#57595F]">
                    {res.fileSize}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-base sm:text-lg text-[#161821] leading-snug group-hover:text-[#FF5B35] transition duration-200 mb-2.5">
                  {res.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#57595F] leading-relaxed line-clamp-3">
                  {res.description}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-[#EAEBED] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#57595F] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#FF5B35]" />
                  {res.fileFormat}
                </span>

                <button
                  onClick={() => alert(`Starting download for ${res.title}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#FF5B35] hover:bg-[#E04824] shadow-xs transition duration-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
