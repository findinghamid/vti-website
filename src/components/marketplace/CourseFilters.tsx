"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Star, X, RotateCcw, Check, Sparkles } from "lucide-react";

interface FacetData {
  categories: { name: string; slug: string; count: number }[];
  priceTypes: { free: number; paid: number };
}

interface CourseFiltersProps {
  facets: FacetData;
}

const LEVELS = [
  { value: "ALL_LEVELS", label: "All Levels" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "EXPERT", label: "Expert" },
];

const RATINGS = [
  { value: "4.5", label: "4.5 & up" },
  { value: "4.0", label: "4.0 & up" },
  { value: "3.0", label: "3.0 & up" },
];

export function CourseFilters({ facets }: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "";
  const currentLevel = searchParams.get("level") ?? "";
  const currentPrice = searchParams.get("price") ?? "all";
  const currentRating = searchParams.get("rating") ?? "";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset pagination on filter change
    router.push(`/courses?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/courses");
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentLevel || (currentPrice && currentPrice !== "all") || currentRating
  );

  return (
    <aside className="w-full rounded-3xl bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 p-6 shadow-sm space-y-7">
      {/* Widget Header (VTI  header) */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EAEBED] dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FF5B35]/10 text-[#FF5B35] flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-base text-[#161821] dark:text-white font-heading">
            Filter Courses
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#FF7162] hover:text-red-600 transition duration-150 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Widget 1: Categories (VTI ) */}
      {facets.categories.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#161821] dark:text-slate-200 uppercase tracking-wider font-heading">
            Categories
          </h4>
          <div className="space-y-2">
            {facets.categories.map((cat) => {
              const isSelected = currentCategory === cat.slug;
              return (
                <button
                  type="button"
                  key={cat.slug}
                  onClick={() => updateParam("category", isSelected ? null : cat.slug)}
                  className={`w-full flex items-center justify-between text-xs font-semibold py-1.5 px-2.5 rounded-xl transition-all duration-150 text-left cursor-pointer ${
                    isSelected
                      ? "bg-[#FF5B35]/10 text-[#FF5B35] font-bold"
                      : "text-[#57595F] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#161821] dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? "bg-[#FF5B35] border-[#FF5B35] text-white"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 font-medium ${
                      isSelected
                        ? "bg-[#FF5B35] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-[#57595F] dark:text-slate-400"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Widget 2: Course Level */}
      <div className="space-y-3 pt-5 border-t border-[#EAEBED] dark:border-slate-800">
        <h4 className="text-xs font-bold text-[#161821] dark:text-slate-200 uppercase tracking-wider font-heading">
          Difficulty Level
        </h4>
        <div className="space-y-1.5">
          {LEVELS.map((lvl) => {
            const isSelected = (currentLevel || "ALL_LEVELS") === lvl.value;
            return (
              <button
                type="button"
                key={lvl.value}
                onClick={() =>
                  updateParam("level", lvl.value === "ALL_LEVELS" ? null : lvl.value)
                }
                className={`w-full flex items-center gap-2.5 text-xs font-semibold py-1.5 px-2.5 rounded-xl transition duration-150 text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#FF5B35]/10 text-[#FF5B35] font-bold"
                    : "text-[#57595F] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#161821] dark:hover:text-white"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                    isSelected
                      ? "border-[#FF5B35] bg-white dark:bg-[#161821]"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#FF5B35]" />}
                </span>
                <span>{lvl.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget 3: Tuition Status Guarantee */}
      <div className="space-y-3 pt-5 border-t border-[#EAEBED] dark:border-slate-800">
        <h4 className="text-xs font-bold text-[#161821] dark:text-slate-200 uppercase tracking-wider font-heading">
          Tuition Status
        </h4>
        <div className="p-3.5 rounded-2xl bg-[#09BD3C]/10 border border-[#09BD3C]/20 text-[#09BD3C] space-y-1">
          <div className="flex items-center gap-1.5 font-black text-xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>100% Free Tuition</span>
          </div>
          <p className="text-[11px] text-[#57595F] leading-tight">
            All courses are non-profit and completely free for every student.
          </p>
        </div>
      </div>

      {/* Widget 4: Ratings Filter */}
      <div className="space-y-3 pt-5 border-t border-[#EAEBED] dark:border-slate-800">
        <h4 className="text-xs font-bold text-[#161821] dark:text-slate-200 uppercase tracking-wider font-heading">
          Minimum Rating
        </h4>
        <div className="space-y-1.5">
          {RATINGS.map((r) => {
            const isSelected = currentRating === r.value;
            return (
              <button
                type="button"
                key={r.value}
                onClick={() => updateParam("rating", isSelected ? null : r.value)}
                className={`w-full flex items-center gap-2.5 text-xs font-semibold py-1.5 px-2.5 rounded-xl transition duration-150 text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#FF5B35]/10 text-[#FF5B35] font-bold"
                    : "text-[#57595F] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#161821] dark:hover:text-white"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                    isSelected
                      ? "bg-[#FF5B35] border-[#FF5B35] text-white"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <div className="flex items-center gap-1 text-[#FFC221]">
                  <Star className="w-3.5 h-3.5 fill-[#FFC221]" />
                </div>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
