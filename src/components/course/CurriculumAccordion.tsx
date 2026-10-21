"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileText,
  HelpCircle,
  Lock,
  Play,
  Layers,
} from "lucide-react";
import { LessonType } from "@prisma/client";

export interface AccordionLesson {
  id: string;
  title: string;
  slug: string;
  type: LessonType;
  durationSec: number;
  formattedDuration: string;
  isPreview: boolean;
  sortOrder: number;
  mediaUrl: string | null;
}

export interface AccordionSection {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  totalDurationSec: number;
  formattedDuration: string;
  lecturesCount: number;
  lessons: AccordionLesson[];
}

interface CurriculumAccordionProps {
  sections: AccordionSection[];
  totalLectures: number;
  formattedDuration: string;
  onPreviewLesson: (lesson: AccordionLesson) => void;
}

export function CurriculumAccordion({
  sections,
  totalLectures,
  formattedDuration,
  onPreviewLesson,
}: CurriculumAccordionProps) {
  // Store set of open section IDs. Open the first section by default.
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(sections.length > 0 ? [sections[0].id] : [])
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allOpen = openSections.size === sections.length && sections.length > 0;

  const toggleAll = () => {
    if (allOpen) {
      setOpenSections(new Set());
    } else {
      setOpenSections(new Set(sections.map((s) => s.id)));
    }
  };

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case LessonType.ARTICLE:
        return <FileText className="w-4 h-4 text-[#FF7162] shrink-0" />;
      case LessonType.QUIZ:
        return <HelpCircle className="w-4 h-4 text-[#FFC221] shrink-0" />;
      case LessonType.VIDEO:
      default:
        return <PlayCircle className="w-4 h-4 text-[#FF5B35] shrink-0" />;
    }
  };

  return (
    <section aria-labelledby="curriculum-heading" className="space-y-4">
      {/* Header with summary stats and Expand All trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2
            id="curriculum-heading"
            className="text-xl sm:text-2xl font-black text-[#161821] dark:text-white font-heading tracking-tight"
          >
            Curriculum Content
          </h2>
          <p className="text-xs sm:text-sm text-[#57595F] dark:text-slate-400 mt-1">
            {sections.length} sections • {totalLectures} lectures • {formattedDuration} total length
          </p>
        </div>

        <button
          onClick={toggleAll}
          className="text-xs sm:text-sm font-bold text-[#FF5B35] hover:text-[#4359D9] transition duration-150 self-start sm:self-auto cursor-pointer"
        >
          {allOpen ? "Collapse All Sections" : "Expand All Sections"}
        </button>
      </div>

      {/* Accordion container */}
      <div className="border border-[#EAEBED] dark:border-slate-800 rounded-3xl overflow-hidden divide-y divide-[#EAEBED] dark:divide-slate-800 shadow-xs">
        {sections.map((section, sIdx) => {
          const isOpen = openSections.has(section.id);

          return (
            <div key={section.id} className="bg-white dark:bg-[#161821]">
              {/* Section Header Button */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-6 py-4.5 bg-[#F8F8FA] dark:bg-[#12151E] hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                      isOpen ? "bg-[#FF5B35] text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </div>
                  <span className="font-bold text-sm sm:text-base text-[#161821] dark:text-white font-heading">
                    {section.title}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#57595F] dark:text-slate-400 shrink-0 pl-3">
                  <span>{section.lecturesCount} lectures</span>
                  <span className="mx-1.5">•</span>
                  <span>{section.formattedDuration}</span>
                </div>
              </button>

              {/* Section Content: Lessons List */}
              {isOpen && (
                <div className="divide-y divide-[#EAEBED] dark:divide-slate-800/60 bg-white dark:bg-[#161821]">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="px-6 py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {getLessonIcon(lesson.type)}
                        <span className="truncate font-medium text-[#161821] dark:text-slate-200">
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5 shrink-0">
                        {lesson.isPreview ? (
                          <button
                            onClick={() => onPreviewLesson(lesson)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FF5B35] bg-[#FF5B35]/10 hover:bg-[#FF5B35] hover:text-white px-2.5 py-1 rounded-full transition duration-150 cursor-pointer"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Preview</span>
                          </button>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span className="text-xs text-[#57595F] dark:text-slate-400 font-mono">
                          {lesson.formattedDuration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
