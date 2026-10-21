"use client";

import React, { useState, useEffect } from "react";
import { Star, X, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  onReviewSubmitted?: (newRating: number) => void;
}

export function CourseReviewModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  onReviewSubmitted,
}: CourseReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchExistingReview();
    }
  }, [isOpen, courseId]);

  const fetchExistingReview = async () => {
    setSuccess(false);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/v1/courses/${courseId}/reviews/me`);
      const data = await res.json();
      if (data.success && data.data?.review) {
        setRating(data.data.review.rating);
        setComment(data.data.review.comment);
      }
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 5) {
      setErrorMsg("Please write at least 5 characters for your review.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/v1/courses/${courseId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        if (onReviewSubmitted) {
          onReviewSubmitted(rating);
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMsg(data.error?.message || "Failed submitting review.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Failed submitting review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Student Course Review
            </span>
          </div>
          <h2 className="text-base font-bold text-white truncate max-w-sm">{courseTitle}</h2>
          <p className="text-xs text-slate-400 mt-1">
            How would you rate this course and learning experience?
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Review Submitted!</h3>
            <p className="text-xs text-slate-400">
              Thank you for helping other students with your feedback.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-900 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            {/* Star Rating Picker */}
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-300">
                {(hoverRating || rating) === 5
                  ? "⭐⭐⭐⭐⭐ Amazing, highly recommended!"
                  : (hoverRating || rating) === 4
                  ? "⭐⭐⭐⭐ Good, learned a lot!"
                  : (hoverRating || rating) === 3
                  ? "⭐⭐⭐ Average, could be improved"
                  : (hoverRating || rating) === 2
                  ? "⭐⭐ Poor, did not meet expectations"
                  : "⭐ Terrible"}
              </span>
            </div>

            {/* Written Review */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Detailed Feedback (min 5 characters)
              </label>
              <textarea
                rows={4}
                placeholder="What did you love about this course? How were the explanations, labs, and architecture patterns?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs border-slate-800 hover:bg-slate-800 text-slate-400 h-9"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={submitting || comment.trim().length < 5}
                size="sm"
                className="text-xs font-bold bg-orange-600 hover:bg-indigo-700 text-white h-9 px-5"
              >
                {submitting ? "Saving..." : "Submit Review"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
