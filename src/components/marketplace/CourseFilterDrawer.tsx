"use client";

import React, { useState } from "react";
import { Filter, X } from "lucide-react";
import { CourseFilters } from "./CourseFilters";

interface FacetData {
  categories: { name: string; slug: string; count: number }[];
  priceTypes: { free: number; paid: number };
}

interface CourseFilterDrawerProps {
  facets: FacetData;
}

export function CourseFilterDrawer({ facets }: CourseFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Trigger Button (VTI ) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex md:hidden items-center gap-2 py-2 px-3.5 rounded-xl border border-[#EAEBED] dark:border-slate-800 bg-white dark:bg-[#161821] text-xs font-bold text-[#161821] dark:text-white shadow-xs cursor-pointer hover:border-[#FF5B35] transition duration-150"
      >
        <Filter className="w-3.5 h-3.5 text-[#FF5B35]" />
        <span>Filters</span>
      </button>

      {/* Slide-over backdrop & drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-[#161821] p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAEBED] dark:border-slate-800 mb-6">
                <div className="flex items-center gap-2 font-bold text-base text-[#161821] dark:text-white font-heading">
                  <Filter className="w-4 h-4 text-[#FF5B35]" />
                  <span>Filters</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Course Filters */}
              <CourseFilters facets={facets} />
            </div>

            <div className="pt-6 border-t border-[#EAEBED] dark:border-slate-800 mt-6">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 rounded-xl bg-[#FF5B35] text-white text-xs font-bold hover:bg-[#E04824] transition duration-150 text-center cursor-pointer shadow-md shadow-orange-500/20"
              >
                Apply Filters & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
