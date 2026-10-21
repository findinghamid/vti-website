"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ModerationCourseItem } from "@/server/services/admin-operations.service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BookCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  X,
  Layers,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface AdminCoursesModerationClientProps {
  initialQueue: ModerationCourseItem[];
}

export function AdminCoursesModerationClient({
  initialQueue,
}: AdminCoursesModerationClientProps) {
  const [queue, setQueue] = useState<ModerationCourseItem[]>(initialQueue);
  const [selectedCourse, setSelectedCourse] = useState<ModerationCourseItem | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [actionType, setActionType] = useState<"APPROVE" | "REQUEST_CHANGES" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const reloadQueue = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/v1/admin/courses/moderation");
      const data = await res.json();
      if (data.success && data.data?.queue) {
        setQueue(data.data.queue);
      }
    } catch {
      // Ignore
    } finally {
      setRefreshing(false);
    }
  };

  const handleDecision = async (courseId: string, decision: "APPROVE" | "REQUEST_CHANGES") => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/admin/courses/${courseId}/moderation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          feedback: feedback.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to submit moderation decision.");
      }

      setSuccessMsg(
        decision === "APPROVE"
          ? "🎉 Course approved and published to marketplace!"
          : "⚠️ Revisions requested. Course returned to draft with feedback."
      );

      // Remove course from queue
      setQueue((prev) => prev.filter((c) => c.id !== courseId));

      setTimeout(() => {
        setSelectedCourse(null);
        setActionType(null);
        setFeedback("");
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAEBED]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0E101A]">Course Moderation Queue</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF6DF] text-[#D97706] border border-[#FFC221]/30">
              {queue.length} Pending Review
            </span>
          </div>
          <p className="text-sm text-[#55585B] mt-1">
            Review instructor submissions, evaluate curriculum completeness, and enforce content guidelines.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={reloadQueue}
          disabled={refreshing}
          className="gap-1.5 text-xs font-bold border-[#EAEBED] text-[#0E101A] hover:bg-[#FAF9F6] rounded-xl"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh Queue
        </Button>
      </div>

      {/* Notice & Guidelines */}
      <div className="bg-[#FFFDF5] border border-[#FFC221]/30 rounded-2xl p-4 text-xs text-[#92400E] flex items-start gap-3 shadow-xs">
        <Sparkles className="w-4 h-4 shrink-0 text-[#FFC221] mt-0.5" />
        <div>
          <span className="font-bold">Compliance Standard:</span> Courses must contain at least 1 section, complete lesson descriptions, and valid pricing. Approving a course immediately makes it publicly searchable and purchase-enabled on the marketplace.
        </div>
      </div>

      {/* Queue List */}
      {queue.length === 0 ? (
        <div className="bg-white border border-[#EAEBED] rounded-[20px] p-16 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#09BD3C]/10 text-[#09BD3C] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0E101A]">All Clear! No Courses Pending Review</h3>
          <p className="text-xs text-[#55585B] max-w-md mx-auto">
            Every course submission has been processed. New instructor submissions will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {queue.map((course) => (
            <Card key={course.id} className="border-[#EAEBED] hover:border-[#FF5B35]/40 transition shadow-xs rounded-[20px] bg-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF6DF] text-[#D97706] border border-[#FFC221]/30">
                        {course.status.replace("_", " ")}
                      </span>
                      {course.categoryName && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF5B35]/10 text-[#FF5B35] border border-[#FF5B35]/20">
                          {course.categoryName}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF9F6] text-[#55585B] border border-[#EAEBED]">
                        {course.level}
                      </span>
                      <span className="text-xs font-black text-[#FF5B35] ml-auto lg:ml-2">
                        ${(course.priceMinor / 100).toFixed(2)} USD
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0E101A] hover:text-[#FF5B35] transition">
                      {course.title}
                    </h3>

                    {course.subtitle && (
                      <p className="text-xs text-[#55585B] line-clamp-2">
                        {course.subtitle}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#55585B] pt-1">
                      <div>
                        Instructor: <strong className="text-[#0E101A]">{course.instructorName}</strong> ({course.instructorEmail})
                      </div>
                      <div className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#55585B]" />
                        <span>{course.sectionsCount} sections • {course.lessonsCount} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#55585B]" />
                        <span>Submitted {new Date(course.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#EAEBED]">
                    <Link href={`/courses/${course.slug}`} target="_blank">
                      <Button variant="outline" size="sm" className="gap-1 text-xs font-bold border-[#EAEBED] text-[#0E101A] hover:bg-[#FAF9F6] rounded-xl">
                        Preview <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course);
                        setActionType("REQUEST_CHANGES");
                      }}
                      className="text-xs font-bold text-[#D97706] border-[#FFC221]/50 hover:bg-[#FFF6DF] rounded-xl"
                    >
                      Request Changes
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course);
                        setActionType("APPROVE");
                      }}
                      className="bg-[#09BD3C] hover:bg-[#08a835] text-white font-bold text-xs gap-1.5 shadow-sm rounded-xl"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Decision Confirmation Modal */}
      {selectedCourse && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#EAEBED] w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#EAEBED] bg-[#FAF9F6]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    actionType === "APPROVE"
                      ? "bg-[#09BD3C]/10 text-[#09BD3C]"
                      : "bg-[#FFF6DF] text-[#D97706]"
                  }`}
                >
                  {actionType === "APPROVE" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0E101A]">
                    {actionType === "APPROVE" ? "Approve Course Publication" : "Request Course Revisions"}
                  </h2>
                  <p className="text-xs text-[#55585B] truncate max-w-xs">
                    {selectedCourse.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCourse(null);
                  setActionType(null);
                }}
                className="text-[#55585B] hover:text-[#0E101A] p-1.5 rounded-lg hover:bg-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs">
                  {successMsg}
                </div>
              )}

              <p className="text-xs text-[#55585B]">
                {actionType === "APPROVE"
                  ? "This course will become immediately live in marketplace search, catalog pages, and cart checkout."
                  : "Please provide actionable feedback for the instructor explaining why the course is being returned to draft."}
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0E101A]">
                  {actionType === "APPROVE" ? "Reviewer Note (Optional)" : "Required Revision Feedback"}
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={
                    actionType === "APPROVE"
                      ? "e.g. Excellent curriculum structure, approved."
                      : "e.g. Section 2 is missing video resources. Please add video uploads for lessons 5 and 6."
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5B35] focus:bg-white transition"
                  required={actionType === "REQUEST_CHANGES"}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAEBED]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCourse(null);
                    setActionType(null);
                  }}
                  disabled={loading}
                  className="rounded-xl border-[#EAEBED] text-[#55585B] hover:text-[#0E101A] text-xs font-bold"
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleDecision(selectedCourse.id, actionType)}
                  disabled={loading || !!successMsg || (actionType === "REQUEST_CHANGES" && !feedback.trim())}
                  className={
                    actionType === "APPROVE"
                      ? "bg-[#09BD3C] hover:bg-[#08a835] text-white font-bold text-xs rounded-xl shadow-xs"
                      : "bg-[#D97706] hover:bg-[#b45309] text-white font-bold text-xs rounded-xl shadow-xs"
                  }
                >
                  {loading
                    ? "Submitting..."
                    : actionType === "APPROVE"
                    ? "Confirm & Publish Live"
                    : "Send Feedback to Instructor"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
