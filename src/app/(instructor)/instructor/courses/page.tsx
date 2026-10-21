"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Search, BookOpen, Users, DollarSign, ExternalLink, Edit3, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseStatus } from "@prisma/client";

interface InstructorCourseSummary {
  id: string;
  title: string;
  slug: string;
  status: CourseStatus;
  priceAmount: number;
  currency: string;
  thumbnailUrl: string | null;
  totalStudents: number;
  averageRating: number;
  totalSections: number;
  totalLectures: number;
  categoryName: string;
  updatedAt: string;
  isPrimary: boolean;
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<InstructorCourseSummary[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedStatus !== "ALL") params.set("status", selectedStatus);
        if (searchQuery.trim()) params.set("q", searchQuery.trim());

        const res = await fetch(`/api/v1/instructor/courses?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setCourses(json.data.courses || []);
          }
        }
      } catch (e) {
        console.error("Error loading instructor courses:", e);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadCourses();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedStatus, searchQuery]);

  const getStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.PUBLISHED:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#E8F8EE] text-[#09BD3C] border border-[#09BD3C]/20">
            Published
          </span>
        );
      case CourseStatus.UNDER_REVIEW:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFF6DF] text-[#8C6200] border border-[#FBEAC3]">
            Under Review
          </span>
        );
      case CourseStatus.ARCHIVED:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#F3F4F8] text-[#8A8C90] border border-[#EAEBED]">
            Archived
          </span>
        );
      case CourseStatus.DRAFT:
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#F3F4F8] text-[#55585B] border border-[#EAEBED]">
            Draft
          </span>
        );
    }
  };

  const formatPrice = (amountMinor: number, currency: string) => {
    if (amountMinor === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amountMinor / 100);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & New Course CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAEBED]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#161821] tracking-tight">
            Authoring Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#55585B] mt-1">
            Author, structure, configure pricing, and submit your courses for marketplace publication.
          </p>
        </div>
        <Link href="/instructor/courses/new">
          <Button className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs gap-2 cursor-pointer">
            <PlusCircle className="w-4 h-4" /> New Course
          </Button>
        </Link>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["ALL", "DRAFT", "UNDER_REVIEW", "PUBLISHED"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedStatus === status
                  ? "bg-[#FF5B35] text-white shadow-xs"
                  : "bg-white border border-[#EAEBED] text-[#55585B] hover:text-[#161821] hover:border-[#FF5B35]"
              }`}
            >
              {status === "ALL" ? "All Courses" : status.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8C90]" />
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-[#EAEBED] rounded-xl bg-white text-[#161821] focus:outline-none focus:border-[#FF5B35]"
          />
        </div>
      </div>

      {/* Courses Inventory List */}
      {loading ? (
        <div className="py-16 text-center text-[#8A8C90] text-sm bg-white rounded-2xl border border-[#EAEBED]">
          Loading course inventory...
        </div>
      ) : courses.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#EAEBED] rounded-2xl bg-white p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-[#8A8C90] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#161821]">No courses found</h3>
          <p className="text-xs text-[#55585B] mt-1 max-w-sm mx-auto">
            {searchQuery || selectedStatus !== "ALL"
              ? "No courses match your filter criteria. Try clearing the filter."
              : "You haven't created any courses yet. Start drafting your first course now!"}
          </p>
          <div className="mt-5">
            <Link href="/instructor/courses/new">
              <Button size="sm" className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-9 px-5 rounded-xl shadow-xs">
                Create Your First Course
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-[#EAEBED] rounded-2xl p-5 hover:border-[#FF5B35]/40 transition duration-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {getStatusBadge(c.status)}
                  <span className="text-xs text-[#55585B] font-semibold">{c.categoryName}</span>
                </div>

                <h3 className="text-base font-bold text-[#161821] line-clamp-1 hover:text-[#FF5B35] transition">
                  <Link href={`/instructor/courses/${c.id}/manage`}>{c.title}</Link>
                </h3>

                <div className="flex items-center gap-4 text-xs text-[#55585B] flex-wrap">
                  <span className="font-extrabold text-[#161821]">
                    {formatPrice(c.priceAmount, c.currency)}
                  </span>
                  <span>•</span>
                  <span>{c.totalSections} sections</span>
                  <span>•</span>
                  <span>{c.totalLectures} lectures</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#8A8C90]" /> {c.totalStudents.toLocaleString()} students
                  </span>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {c.status === CourseStatus.PUBLISHED && (
                  <Link href={`/courses/${c.slug}`} target="_blank">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs font-bold border-[#EAEBED] text-[#161821] hover:bg-[#F3F4F8] rounded-xl h-9"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Preview
                    </Button>
                  </Link>
                )}
                <Link href={`/instructor/courses/${c.id}/manage`}>
                  <Button
                    size="sm"
                    className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold gap-1.5 text-xs rounded-xl h-9 shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Manage Course
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
