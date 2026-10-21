"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FormattedCourseDetail } from "@/server/services/course.service";
import { CourseHero } from "./CourseHero";
import { StickyEnrollCard } from "./StickyEnrollCard";
import { MobileStickyBar } from "./MobileStickyBar";
import { LearningOutcomes } from "./LearningOutcomes";
import { CurriculumAccordion, AccordionLesson } from "./CurriculumAccordion";
import { InstructorBioCard } from "./InstructorBioCard";
import { ReviewsSummary } from "./ReviewsSummary";
import { VideoPreviewModal } from "./VideoPreviewModal";
import { CheckCircle2, Sparkles, BookOpen } from "lucide-react";

interface CourseLandingClientProps {
  course: FormattedCourseDetail;
}

export function CourseLandingClient({ course }: CourseLandingClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);
  const [previewLessonTitle, setPreviewLessonTitle] = useState<string>("");

  const primaryInstructor = course.instructors.find((i) => i.isPrimary) || course.instructors[0];

  // Find first previewable lesson for default course preview
  const firstPreviewLesson = course.sections
    .flatMap((s) => s.lessons)
    .find((l) => l.isPreview);

  const handleOpenCourseTrailer = () => {
    setPreviewMediaUrl(course.previewVideoUrl || firstPreviewLesson?.mediaUrl || null);
    setPreviewLessonTitle(course.title);
    setModalOpen(true);
  };

  const handleOpenLessonPreview = (lesson: AccordionLesson) => {
    setPreviewMediaUrl(lesson.mediaUrl || course.previewVideoUrl || null);
    setPreviewLessonTitle(lesson.title);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA] dark:bg-[#0A101D] pb-24">
      {/* 1. VTI Details-3 Hero Banner */}
      <CourseHero
        title={course.title}
        subtitle={course.subtitle}
        category={course.category}
        subcategory={course.subcategory}
        topic={course.topic}
        level={course.level}
        language={course.language}
        averageRating={course.averageRating}
        totalReviews={course.totalReviews}
        totalStudents={course.totalStudents}
        publishedAt={course.publishedAt}
        instructors={course.instructors}
      />

      {/* 2. Main Content Grid (Left details, Right sticky widget) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          {/* Main Column */}
          <div className="w-full lg:w-8/12 xl:w-7/12 space-y-10 pb-16 lg:pb-0">
            {/* Mobile Card Preview (Visible only on mobile before scrolling) */}
            <div className="lg:hidden">
              <StickyEnrollCard
                courseId={course.id}
                slug={course.slug}
                courseTitle={course.title}
                thumbnailUrl={course.thumbnailUrl}
                formattedPrice={course.formattedPrice}
                formattedOriginalPrice={course.formattedOriginalPrice}
                discountPercent={course.discountPercent}
                isFree={course.isFree}
                formattedDuration={course.formattedDuration}
                totalArticles={course.totalArticles}
                totalResources={course.totalResources}
                progressPercent={course.progressPercent}
                isComingSoon={course.isComingSoon}
                onPreviewClick={handleOpenCourseTrailer}
              />
            </div>

            {/* What You'll Learn (Outcomes) */}
            <LearningOutcomes outcomes={course.learningOutcomes} />

            {/* Explore Related Topics Chips */}
            <section aria-labelledby="topics-heading" className="space-y-3">
              <h2
                id="topics-heading"
                className="text-base font-bold text-[#161821] dark:text-white font-heading"
              >
                Explore Related Specializations
              </h2>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/courses?category=${course.category.slug}`}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 text-[#FF5B35] hover:border-[#FF5B35] transition duration-150 shadow-2xs"
                >
                  {course.category.name}
                </Link>
                {course.subcategory && (
                  <Link
                    href={`/courses?category=${course.category.slug}&subcategory=${course.subcategory.slug}`}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 text-[#57595F] dark:text-slate-300 hover:text-[#FF5B35] hover:border-[#FF5B35] transition duration-150 shadow-2xs"
                  >
                    {course.subcategory.name}
                  </Link>
                )}
                {course.topic && (
                  <Link
                    href={`/courses?q=${encodeURIComponent(course.topic.name)}`}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 text-[#57595F] dark:text-slate-300 hover:text-[#FF5B35] hover:border-[#FF5B35] transition duration-150 shadow-2xs"
                  >
                    {course.topic.name}
                  </Link>
                )}
              </div>
            </section>

            {/* Curriculum Accordion */}
            <CurriculumAccordion
              sections={course.sections}
              totalLectures={course.totalLectures}
              formattedDuration={course.formattedDuration}
              onPreviewLesson={handleOpenLessonPreview}
            />

            {/* Course Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <section
                aria-labelledby="requirements-heading"
                className="bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xs space-y-4"
              >
                <h2
                  id="requirements-heading"
                  className="text-xl sm:text-2xl font-black text-[#161821] dark:text-white font-heading tracking-tight"
                >
                  Prerequisites & Requirements
                </h2>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#57595F] dark:text-slate-300">
                  {course.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B35] mt-2 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Full Course Description */}
            {course.description && (
              <section
                aria-labelledby="description-heading"
                className="bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xs space-y-4"
              >
                <h2
                  id="description-heading"
                  className="text-xl sm:text-2xl font-black text-[#161821] dark:text-white font-heading tracking-tight"
                >
                  About this Course
                </h2>
                <div className="text-xs sm:text-sm text-[#57595F] dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {course.description}
                </div>
              </section>
            )}

            {/* Who this course is for */}
            {course.intendedLearners && course.intendedLearners.length > 0 && (
              <section
                aria-labelledby="audience-heading"
                className="bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xs space-y-4"
              >
                <h2
                  id="audience-heading"
                  className="text-xl sm:text-2xl font-black text-[#161821] dark:text-white font-heading tracking-tight"
                >
                  Target Audience
                </h2>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#57595F] dark:text-slate-300">
                  {course.intendedLearners.map((learner, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#09BD3C] mt-0.5 shrink-0" />
                      <span>{learner}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Instructor Showcase */}
            {course.instructors && course.instructors.length > 0 ? (
              <div className="space-y-6">
                {course.instructors.map((inst) => (
                  <InstructorBioCard key={inst.id} instructor={inst} />
                ))}
              </div>
            ) : primaryInstructor ? (
              <InstructorBioCard instructor={primaryInstructor} />
            ) : null}

            {/* Student Feedback & Reviews */}
            <ReviewsSummary
              averageRating={course.averageRating}
              totalReviews={course.totalReviews}
              ratingBreakdown={course.ratingBreakdown}
              featuredReviews={course.featuredReviews}
            />
          </div>

          {/* Right Column: Sticky Enroll Card (Desktop) */}
          <div className="hidden lg:block lg:w-4/12 xl:w-5/12">
            <StickyEnrollCard
              courseId={course.id}
              slug={course.slug}
              courseTitle={course.title}
              thumbnailUrl={course.thumbnailUrl}
              formattedPrice={course.formattedPrice}
              formattedOriginalPrice={course.formattedOriginalPrice}
              discountPercent={course.discountPercent}
              isFree={course.isFree}
              formattedDuration={course.formattedDuration}
              totalArticles={course.totalArticles}
              totalResources={course.totalResources}
              progressPercent={course.progressPercent}
              isComingSoon={course.isComingSoon}
              onPreviewClick={handleOpenCourseTrailer}
            />
          </div>
        </div>
      </main>

      {/* 3. Mobile Sticky Bottom Enrollment Bar */}
      <MobileStickyBar
        formattedPrice={course.formattedPrice}
        formattedOriginalPrice={course.formattedOriginalPrice}
        discountPercent={course.discountPercent}
        isFree={course.isFree}
        onEnrollClick={handleOpenCourseTrailer}
      />

      {/* 4. Video Trailer Preview Modal */}
      <VideoPreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={previewMediaUrl}
        lessonTitle={previewLessonTitle}
        courseTitle={course.title}
      />
    </div>
  );
}
