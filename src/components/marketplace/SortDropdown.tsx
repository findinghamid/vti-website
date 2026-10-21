"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "relevance", label: "Short by: Relevance" },
  { value: "popular-desc", label: "Short by: Popularity" },
  { value: "rating-desc", label: "Short by: Highest Rated" },
  { value: "newest", label: "Short by: Newest" },
  { value: "price-asc", label: "Short by: Price: Low to High" },
  { value: "price-desc", label: "Short by: Price: High to Low" },
];

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "relevance";

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="appearance-none h-11 pl-4 pr-10 rounded-xl border border-[#EAEBED] dark:border-slate-800 bg-white dark:bg-[#161821] text-xs sm:text-sm font-semibold text-[#161821] dark:text-white focus:outline-none focus:border-[#FF5B35] focus:ring-1 focus:ring-[#FF5B35] transition duration-200 cursor-pointer shadow-xs"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#161821] py-1">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 text-[#57595F] dark:text-slate-400">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}
