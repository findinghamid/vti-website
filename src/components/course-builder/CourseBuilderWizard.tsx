"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  Clock,
  DollarSign,
  Layers,
  Users,
  Compass,
  ListChecks,
  ChevronRight,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseStatus, CourseLevel, LessonType } from "@prisma/client";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  BuilderStep,
  setActiveStep,
  setAutosaveStatus,
  markDirty,
} from "@/store/slices/courseBuilderSlice";

interface LessonDraft {
  id: string;
  title: string;
  type: LessonType;
  durationSec: number;
  isPreview: boolean;
  sortOrder: number;
  mediaUrl: string | null;
}

interface SectionDraft {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  lessons: LessonDraft[];
}

interface CourseDraftData {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  categoryId: string;
  subcategoryId: string | null;
  topicId: string | null;
  level: CourseLevel;
  language: string;
  thumbnailUrl: string | null;
  previewVideoUrl: string | null;
  priceAmount: number;
  discountAmount: number | null;
  currency: string;
  status: CourseStatus;
  learningOutcomes: string[];
  requirements: string[];
  intendedLearners: string[];
  sections: SectionDraft[];
}

interface PrePublishAudit {
  isValid: boolean;
  score: number;
  checks: Array<{
    code: string;
    label: string;
    passed: boolean;
    recommendation: string;
  }>;
}

interface CourseBuilderWizardProps {
  initialCourse: CourseDraftData;
  initialAudit: PrePublishAudit;
}

export function CourseBuilderWizard({ initialCourse, initialAudit }: CourseBuilderWizardProps) {
  const dispatch = useAppDispatch();
  const { activeStep, autosaveStatus, lastSavedAt } = useAppSelector((state) => state.courseBuilder);

  const [course, setCourse] = useState<CourseDraftData>(initialCourse);
  const [audit, setAudit] = useState<PrePublishAudit>(initialAudit);
  const [categories, setCategories] = useState<any[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [activeSectionForLesson, setActiveSectionForLesson] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonType, setNewLessonType] = useState<LessonType>(LessonType.VIDEO);
  const [newLessonDuration, setNewLessonDuration] = useState("300");
  const [newLessonPreview, setNewLessonPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load categories for selector
  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch("/api/v1/categories");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setCategories(json.data.categories || []);
          }
        }
      } catch (e) {
        console.error("Failed loading categories:", e);
      }
    }
    loadCats();
  }, []);

  // Debounced Autosave
  const triggerAutosave = useCallback(
    async (updatedData: Partial<CourseDraftData>) => {
      dispatch(setAutosaveStatus("saving"));
      try {
        const res = await fetch(`/api/v1/instructor/courses/${course.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            dispatch(setAutosaveStatus("saved"));
            if (json.data.audit) setAudit(json.data.audit);
          }
        } else {
          dispatch(setAutosaveStatus("error"));
        }
      } catch {
        dispatch(setAutosaveStatus("error"));
      }
    },
    [course.id, dispatch]
  );

  const handleFieldChange = (field: keyof CourseDraftData, value: any) => {
    setCourse((prev) => {
      const updated = { ...prev, [field]: value };
      dispatch(markDirty(true));
      triggerAutosave({ [field]: value });
      return updated;
    });
  };

  // Section Management
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    try {
      const res = await fetch(`/api/v1/instructor/courses/${course.id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newSectionTitle.trim() }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setCourse((prev) => ({
            ...prev,
            sections: [...prev.sections, { ...json.data, lessons: [] }],
          }));
          setNewSectionTitle("");
          // re-fetch audit
          refreshAudit();
        }
      }
    } catch (e) {
      console.error("Failed adding section:", e);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const res = await fetch(`/api/v1/instructor/courses/${course.id}/sections/${sectionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCourse((prev) => ({
          ...prev,
          sections: prev.sections.filter((s) => s.id !== sectionId),
        }));
        refreshAudit();
      }
    } catch (e) {
      console.error("Failed deleting section:", e);
    }
  };

  // Lesson Management
  const handleAddLesson = async (sectionId: string) => {
    if (!newLessonTitle.trim()) return;

    try {
      const res = await fetch(`/api/v1/instructor/courses/${course.id}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId,
          title: newLessonTitle.trim(),
          type: newLessonType,
          durationSec: parseInt(newLessonDuration, 10) || 300,
          isPreview: newLessonPreview,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setCourse((prev) => ({
            ...prev,
            sections: prev.sections.map((sec) =>
              sec.id === sectionId
                ? { ...sec, lessons: [...sec.lessons, json.data] }
                : sec
            ),
          }));
          setNewLessonTitle("");
          setActiveSectionForLesson(null);
          refreshAudit();
        }
      }
    } catch (e) {
      console.error("Failed adding lesson:", e);
    }
  };

  const handleDeleteLesson = async (sectionId: string, lessonId: string) => {
    try {
      const res = await fetch(`/api/v1/instructor/courses/${course.id}/lessons/${lessonId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCourse((prev) => ({
          ...prev,
          sections: prev.sections.map((sec) =>
            sec.id === sectionId
              ? { ...sec, lessons: sec.lessons.filter((l) => l.id !== lessonId) }
              : sec
          ),
        }));
        refreshAudit();
      }
    } catch (e) {
      console.error("Failed deleting lesson:", e);
    }
  };

  const refreshAudit = async () => {
    try {
      const res = await fetch(`/api/v1/instructor/courses/${course.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data?.audit) setAudit(json.data.audit);
      }
    } catch (e) {
      console.error("Failed refreshing audit:", e);
    }
  };

  // Submit for Review
  const handleSubmitForReview = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      const res = await fetch(`/api/v1/instructor/courses/${course.id}/submit`, {
        method: "POST",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Course does not satisfy pre-publish quality requirements.");
      }

      setSubmitSuccess(true);
      setCourse((prev) => ({ ...prev, status: CourseStatus.UNDER_REVIEW }));
      if (json.data?.audit) setAudit(json.data.audit);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const steps: Array<{ id: BuilderStep; label: string; icon: any }> = [
    { id: "learners", label: "Intended Learners", icon: Users },
    { id: "basics", label: "Course Landing Page", icon: Compass },
    { id: "curriculum", label: "Curriculum", icon: Layers },
    { id: "pricing", label: "Pricing & Promotions", icon: DollarSign },
    { id: "review", label: "Review & Publish", icon: ListChecks },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Bar: Title, Status, Autosave, and Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/instructor/courses"
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Back to courses"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 line-clamp-1">
                {course.title}
              </h1>
              <Badge
                className={
                  course.status === CourseStatus.PUBLISHED
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : course.status === CourseStatus.UNDER_REVIEW
                    ? "bg-amber-50 text-amber-700 border-amber-300"
                    : "bg-slate-100 text-slate-700 border-slate-300"
                }
              >
                {course.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              {autosaveStatus === "saving" && (
                <span className="flex items-center gap-1 text-orange-600">
                  <Loader2 className="w-3 h-3 animate-spin" /> Autosaving changes...
                </span>
              )}
              {autosaveStatus === "saved" && (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Saved {lastSavedAt && `at ${lastSavedAt}`}
                </span>
              )}
              {autosaveStatus === "error" && (
                <span className="flex items-center gap-1 text-rose-600 font-medium">
                  <AlertCircle className="w-3 h-3" /> Autosave failed
                </span>
              )}
              {autosaveStatus === "idle" && <span>Draft mode</span>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link href={`/courses/${course.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-slate-700 border-slate-300">
              <Eye className="w-3.5 h-3.5" /> Public Preview
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={() => dispatch(setActiveStep("review"))}
            className="bg-orange-600 hover:bg-indigo-700 text-white font-bold gap-1.5 text-xs shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Review Readiness ({audit.score}%)
          </Button>
        </div>
      </div>

      {/* 2. Main Studio Grid: Left Steps Navigation, Right Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Steps */}
        <nav aria-label="Builder Steps" className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm divide-y divide-slate-100">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Course Builder Stages
          </div>
          <div className="pt-2 space-y-1">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = activeStep === s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => dispatch(setActiveStep(s.id))}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition text-left ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200/80"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive ? "bg-orange-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span>{s.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-orange-600" : "text-slate-300"}`} />
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right Stage Panel Content */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* STAGE 1: INTENDED LEARNERS */}
          {activeStep === "learners" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Intended Learners</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  The following descriptions will be publicly visible on your Course Landing Page to help prospective students decide if this course is right for them.
                </p>
              </div>

              {/* What will students learn? */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  What will students learn in your course? (Minimum 3)
                </label>
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => {
                        const updated = [...course.learningOutcomes];
                        updated[idx] = e.target.value;
                        handleFieldChange("learningOutcomes", updated);
                      }}
                      placeholder={`e.g. Master React component lifecycles and modern state management (${idx + 1})`}
                      className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = course.learningOutcomes.filter((_, i) => i !== idx);
                        handleFieldChange("learningOutcomes", updated);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFieldChange("learningOutcomes", [...course.learningOutcomes, ""])}
                  className="text-xs border-dashed border-indigo-300 text-indigo-700 hover:bg-indigo-50 gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add more to your response
                </Button>
              </div>

              {/* Requirements */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  What are the requirements or prerequisites? (Minimum 1)
                </label>
                {course.requirements.map((req, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => {
                        const updated = [...course.requirements];
                        updated[idx] = e.target.value;
                        handleFieldChange("requirements", updated);
                      }}
                      placeholder="e.g. Basic understanding of JavaScript and HTML"
                      className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = course.requirements.filter((_, i) => i !== idx);
                        handleFieldChange("requirements", updated);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFieldChange("requirements", [...course.requirements, ""])}
                  className="text-xs border-dashed border-indigo-300 text-indigo-700 hover:bg-indigo-50 gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add requirement
                </Button>
              </div>

              {/* Intended audience */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Who is this course for? (Target Learners)
                </label>
                {course.intendedLearners.map((learner, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={learner}
                      onChange={(e) => {
                        const updated = [...course.intendedLearners];
                        updated[idx] = e.target.value;
                        handleFieldChange("intendedLearners", updated);
                      }}
                      placeholder="e.g. Web developers looking to level up their architecture skills"
                      className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = course.intendedLearners.filter((_, i) => i !== idx);
                        handleFieldChange("intendedLearners", updated);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFieldChange("intendedLearners", [...course.intendedLearners, ""])}
                  className="text-xs border-dashed border-indigo-300 text-indigo-700 hover:bg-indigo-50 gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add target learner profile
                </Button>
              </div>
            </div>
          )}

          {/* STAGE 2: COURSE LANDING PAGE DETAILS */}
          {activeStep === "basics" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Course Landing Page</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Your course landing page is crucial to your success on the VTI Marketplace. Make it compelling and informative.
                </p>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Course Title</label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="w-full text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Course Subtitle</label>
                  <input
                    type="text"
                    value={course.subtitle || ""}
                    onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                    placeholder="Insert your course subtitle (catchy one-liner summary)"
                    className="w-full text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Course Description</label>
                  <textarea
                    rows={6}
                    value={course.description || ""}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="Provide a comprehensive breakdown of what students will accomplish in this course..."
                    className="w-full text-xs px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-sans leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400">Minimum 50 characters required for publication.</p>
                </div>
              </div>

              {/* Classification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Category</label>
                  <select
                    value={course.categoryId}
                    onChange={(e) => handleFieldChange("categoryId", e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Difficulty Level</label>
                  <select
                    value={course.level}
                    onChange={(e) => handleFieldChange("level", e.target.value as CourseLevel)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="ALL_LEVELS">All Levels</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Language</label>
                  <select
                    value={course.language}
                    onChange={(e) => handleFieldChange("language", e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="German">German</option>
                    <option value="French">French</option>
                    <option value="Urdu">Urdu</option>
                  </select>
                </div>
              </div>

              {/* Media URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Course Thumbnail URL</label>
                  <input
                    type="url"
                    value={course.thumbnailUrl || ""}
                    onChange={(e) => handleFieldChange("thumbnailUrl", e.target.value)}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Preview Trailer Video URL</label>
                  <input
                    type="url"
                    value={course.previewVideoUrl || ""}
                    onChange={(e) => handleFieldChange("previewVideoUrl", e.target.value)}
                    placeholder="https://example.com/trailer.mp4"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: CURRICULUM BUILDER */}
          {activeStep === "curriculum" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Curriculum Structure</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Organize your course into clear sequential modules (sections) and individual lectures (video, article, or quiz).
                </p>
              </div>

              {/* Sections List */}
              <div className="space-y-4">
                {course.sections.map((section, sIndex) => (
                  <div key={section.id} className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-xs">
                    {/* Section Header */}
                    <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                          Section {sIndex + 1}:
                        </span>
                        <span className="text-sm font-bold text-slate-900">{section.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSection(section.id)}
                          className="h-7 px-2 text-slate-400 hover:text-rose-600 hover:bg-slate-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Lessons within section */}
                    <div className="p-4 space-y-2 bg-white">
                      {section.lessons.map((lesson, lIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-200 text-xs bg-slate-50/50"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.type === LessonType.VIDEO ? (
                              <Video className="w-4 h-4 text-orange-500" />
                            ) : lesson.type === LessonType.ARTICLE ? (
                              <FileText className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <HelpCircle className="w-4 h-4 text-amber-500" />
                            )}
                            <span className="font-medium text-slate-800">
                              {lIndex + 1}. {lesson.title}
                            </span>
                            {lesson.isPreview && (
                              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px] py-0 px-1.5">
                                Preview Enabled
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 font-mono">
                              {Math.floor(lesson.durationSec / 60)}m
                            </span>
                            <button
                              onClick={() => handleDeleteLesson(section.id, lesson.id)}
                              className="text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Lecture trigger or form */}
                      {activeSectionForLesson === section.id ? (
                        <div className="p-4 border border-indigo-200 bg-indigo-50/40 rounded-xl space-y-3 mt-3">
                          <h4 className="text-xs font-bold text-slate-900">Add New Lecture</h4>
                          <input
                            type="text"
                            placeholder="Lecture title"
                            value={newLessonTitle}
                            onChange={(e) => setNewLessonTitle(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                          />
                          <div className="flex items-center gap-4 flex-wrap text-xs">
                            <label className="flex items-center gap-1.5 font-medium text-slate-700">
                              Type:
                              <select
                                value={newLessonType}
                                onChange={(e) => setNewLessonType(e.target.value as LessonType)}
                                className="border border-slate-300 rounded px-2 py-1 bg-white"
                              >
                                <option value="VIDEO">Video</option>
                                <option value="ARTICLE">Article</option>
                                <option value="QUIZ">Quiz</option>
                              </select>
                            </label>

                            <label className="flex items-center gap-1.5 font-medium text-slate-700">
                              Duration (sec):
                              <input
                                type="number"
                                value={newLessonDuration}
                                onChange={(e) => setNewLessonDuration(e.target.value)}
                                className="w-16 border border-slate-300 rounded px-2 py-1 bg-white text-center"
                              />
                            </label>

                            <label className="flex items-center gap-1.5 font-medium text-slate-700">
                              <input
                                type="checkbox"
                                checked={newLessonPreview}
                                onChange={(e) => setNewLessonPreview(e.target.checked)}
                                className="rounded text-orange-600"
                              />
                              Free Preview Lecture
                            </label>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <Button size="sm" onClick={() => handleAddLesson(section.id)} className="bg-orange-600 text-white text-xs h-8">
                              Save Lecture
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveSectionForLesson(null)}
                              className="text-xs h-8"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveSectionForLesson(section.id);
                            setNewLessonTitle("");
                          }}
                          className="mt-2 text-xs text-indigo-700 hover:bg-indigo-50 gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Lecture to Section
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Section Form */}
                <form onSubmit={handleAddSection} className="p-4 border-2 border-dashed border-slate-200 rounded-xl flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter new section title (e.g. Module 2: State Management with Redux Toolkit)..."
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  />
                  <Button type="submit" disabled={!newSectionTitle.trim()} className="bg-slate-900 text-white text-xs shrink-0">
                    Add Section
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* STAGE 4: PRICING & PROMOTIONS */}
          {activeStep === "pricing" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Pricing & Promotions</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Set the base price for your course. Monetary figures are recorded in server-authoritative integer minor units.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                {/* Price Amount */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">
                    Course Base Price (in USD $)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={(course.priceAmount / 100).toFixed(2)}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        handleFieldChange("priceAmount", Math.round(val * 100));
                      }}
                      className="w-full text-base font-bold pl-8 pr-4 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Set to $0.00 to offer this course as Free.</p>
                </div>

                {/* Promotional Discount */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">
                    Promotional Discount Amount ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={((course.discountAmount || 0) / 100).toFixed(2)}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        handleFieldChange("discountAmount", val > 0 ? Math.round(val * 100) : null);
                      }}
                      className="w-full text-base font-bold pl-8 pr-4 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Optional discount deduction applied at checkout.</p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 5: REVIEW & PUBLISH */}
          {activeStep === "review" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Pre-Publish Quality Audit</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Our quality review ensures that every published course meets commercial standards for student satisfaction.
                </p>
              </div>

              {/* Success Notification */}
              {submitSuccess && (
                <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Course Submitted for Review!</h4>
                    <p className="text-xs mt-1 text-emerald-700">
                      Your course has been placed in the moderation queue. Our operations team will review your curriculum and notify you once it goes live on the marketplace.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Notification */}
              {submitError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Score Progress Bar */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Readiness Score</span>
                  <span className="text-indigo-700 text-base">{audit.score}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      audit.score === 100
                        ? "bg-emerald-500"
                        : audit.score >= 70
                        ? "bg-orange-600"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${audit.score}%` }}
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {audit.checks.map((check) => (
                  <div key={check.code} className="p-4 flex items-start gap-3.5">
                    {check.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <h4
                        className={`text-xs font-bold ${
                          check.passed ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {check.label}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {check.passed ? "Requirement satisfied." : check.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Big Submit Button */}
              <div className="pt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {audit.isValid
                    ? "All checks passed! You are ready to submit your course."
                    : "Resolve the missing items above to enable submission."}
                </p>

                <Button
                  onClick={handleSubmitForReview}
                  disabled={!audit.isValid || submitting || course.status === CourseStatus.UNDER_REVIEW}
                  className="bg-orange-600 hover:bg-indigo-700 text-white font-bold px-8 h-12 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                    </>
                  ) : course.status === CourseStatus.UNDER_REVIEW ? (
                    "Submitted Under Review"
                  ) : (
                    "Submit Course For Review"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
