"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid,
  List,
  Search,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import { CourseCard, CourseCardData } from "./CourseCard";
import { CourseFilters } from "./CourseFilters";
import { CourseFilterDrawer } from "./CourseFilterDrawer";
import { SortDropdown } from "./SortDropdown";
import { EmptyState } from "@/components/shared/EmptyState";
import { VtiButton } from "@/components/ui/vti";

interface FacetData {
  categories: { name: string; slug: string; count: number }[];
  priceTypes: { free: number; paid: number };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface CourseCatalogViewProps {
  courses: CourseCardData[];
  pagination: PaginationData;
  facets: FacetData;
}

export function CourseCatalogView({
  courses,
  pagination,
  facets,
}: CourseCatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) {
      params.set("q", searchInput.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/courses?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <div className="w-full">
      {/* Top Controls Bar (VTI course-with-sidebar.html ) */}
      <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Search Bar & View Mode Toggle */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#EAEBED] dark:border-slate-800 bg-[#F8F8FA] dark:bg-[#12151E] text-xs sm:text-sm text-[#161821] dark:text-white placeholder:text-[#57595F] focus:outline-none focus:border-[#FF5B35]"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF5B35]">
              <Search className="w-4 h-4" />
            </div>
          </form>

          {/* View Mode Toggle Buttons */}
          <div className="hidden sm:flex items-center gap-1 bg-[#F8F8FA] dark:bg-[#12151E] p-1 rounded-xl border border-[#EAEBED] dark:border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#FF5B35] text-white shadow-xs"
                  : "text-[#57595F] hover:text-[#161821] dark:hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#FF5B35] text-white shadow-xs"
                  : "text-[#57595F] hover:text-[#161821] dark:hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Results count text */}
          <div className="text-xs font-semibold text-[#57595F] dark:text-slate-400 pl-2">
            Showing{" "}
            <span className="text-[#161821] dark:text-white font-bold font-mono">
              {courses.length}
            </span>{" "}
            of{" "}
            <span className="text-[#161821] dark:text-white font-bold font-mono">
              {pagination.total}
            </span>{" "}
            courses
          </div>
        </div>

        {/* Right: Mobile Filter Button & Sort Dropdown */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
          <CourseFilterDrawer facets={facets} />
          <SortDropdown />
        </div>
      </div>

      {/* Main Content Layout (Desktop 3-col sidebar + 9-col courses grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar (Desktop only) */}
        <div className="hidden lg:block lg:col-span-3">
          <CourseFilters facets={facets} />
        </div>

        {/* Right Column: Courses Grid / List */}
        <div className="lg:col-span-9 space-y-8">
          {courses.length > 0 ? (
            <>
              {/* Courses Grid or List */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-6"
                }
              >
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} viewMode={viewMode} />
                ))}
              </div>

              {/* VTI Pagination Bar () */}
              {pagination.totalPages > 1 && (
                <div className="pt-8 border-t border-[#EAEBED] dark:border-slate-800 flex items-center justify-center gap-2">
                  {/* Previous Button */}
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="w-10 h-10 rounded-xl border border-[#EAEBED] dark:border-slate-800 bg-white dark:bg-[#161821] text-[#161821] dark:text-white flex items-center justify-center hover:border-[#FF5B35] hover:text-[#FF5B35] disabled:opacity-40 disabled:cursor-not-allowed transition duration-150 cursor-pointer shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                    const isCurrent = p === pagination.page;
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-xs ${
                          isCurrent
                            ? "bg-[#FF5B35] text-white shadow-md shadow-orange-500/20"
                            : "bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 text-[#161821] dark:text-white hover:border-[#FF5B35] hover:text-[#FF5B35]"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="w-10 h-10 rounded-xl border border-[#EAEBED] dark:border-slate-800 bg-white dark:bg-[#161821] text-[#161821] dark:text-white flex items-center justify-center hover:border-[#FF5B35] hover:text-[#FF5B35] disabled:opacity-40 disabled:cursor-not-allowed transition duration-150 cursor-pointer shadow-xs"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-[#161821] rounded-3xl border border-[#EAEBED] dark:border-slate-800 p-12 text-center shadow-xs">
              <EmptyState
                icon={BookOpen}
                title="No Courses Match Your Criteria"
                description="Try adjusting your keywords, resetting your filters, or exploring a different category."
                actionLabel="Reset All Filters"
                actionHref="/courses"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
