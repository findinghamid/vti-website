"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare } from "lucide-react";

interface ReviewsSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    star5Percent: number;
    star4Percent: number;
    star3Percent: number;
    star2Percent: number;
    star1Percent: number;
  };
  featuredReviews: Array<{
    id: string;
    userName: string;
    userAvatar: string | null;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

export function ReviewsSummary({
  averageRating,
  totalReviews,
  ratingBreakdown,
  featuredReviews,
}: ReviewsSummaryProps) {
  const [helpfulMap, setHelpfulMap] = useState<Record<string, "yes" | "no">>({});

  const bars = [
    { stars: 5, percent: ratingBreakdown.star5Percent },
    { stars: 4, percent: ratingBreakdown.star4Percent },
    { stars: 3, percent: ratingBreakdown.star3Percent },
    { stars: 2, percent: ratingBreakdown.star2Percent },
    { stars: 1, percent: ratingBreakdown.star1Percent },
  ];

  const handleHelpful = (reviewId: string, val: "yes" | "no") => {
    setHelpfulMap((prev) => ({ ...prev, [reviewId]: val }));
  };

  return (
    <section aria-labelledby="feedback-heading" className="space-y-8">
      <div>
        <h2
          id="feedback-heading"
          className="text-xl sm:text-2xl font-black text-[#161821] dark:text-white font-heading tracking-tight"
        >
          Student Feedback & Ratings
        </h2>
        <p className="text-xs sm:text-sm text-[#57595F] dark:text-slate-400 mt-1">
          Real feedback from engineers and students who completed this curriculum.
        </p>
      </div>

      {/* Aggregate Rating Score & Bars (VTI ) */}
      <div className="bg-[#F8F8FA] dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 rounded-3xl p-7 sm:p-8 flex flex-col sm:flex-row items-center gap-8 shadow-xs">
        {/* Score block */}
        <div className="flex flex-col items-center justify-center text-center shrink-0 px-6 py-2">
          <span className="text-5xl sm:text-6xl font-black text-[#161821] dark:text-white font-heading tracking-tight">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex items-center text-[#FFC221] mt-2 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(averageRating)
                    ? "fill-[#FFC221]"
                    : "fill-[#FFC221]/30 text-[#FFC221]/50"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-[#FF5B35] mt-1.5 uppercase tracking-wider">
            {totalReviews} Total Reviews
          </span>
        </div>

        {/* Progress bars block */}
        <div className="flex-1 w-full space-y-2.5">
          {bars.map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3 text-xs text-[#57595F] dark:text-slate-400">
              <div className="flex items-center gap-1 w-14 shrink-0 font-bold text-[#161821] dark:text-white">
                <span>{bar.stars}</span>
                <Star className="w-3 h-3 fill-[#FFC221] text-[#FFC221]" />
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#FFC221] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${bar.percent}%` }}
                />
              </div>

              <span className="text-xs font-mono font-semibold w-10 text-right shrink-0">
                {bar.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Reviews List */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-[#161821] dark:text-white font-heading">
          Featured Student Reviews
        </h3>

        <div className="divide-y divide-[#EAEBED] dark:divide-slate-800">
          {featuredReviews.map((rev, idx) => {
            const formattedDate = new Date(rev.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const fallbackAvatar =
              rev.userAvatar || `/assets/img/course/details/user${idx > 0 ? `-${(idx % 3) + 1}` : ""}.png`;

            return (
              <div key={rev.id} className="py-5 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-[#EAEBED] dark:border-slate-700 shrink-0">
                      <Image
                        src={fallbackAvatar}
                        alt={rev.userName}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#161821] dark:text-white leading-tight">
                          {rev.userName}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#09BD3C] bg-[#09BD3C]/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Student
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-[#FFC221]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? "fill-[#FFC221]" : "text-slate-200 dark:text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#57595F] dark:text-slate-400">
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#57595F] dark:text-slate-300 leading-relaxed pl-13">
                  {rev.comment}
                </p>

                <div className="flex items-center gap-4 text-xs text-[#57595F] dark:text-slate-400 pt-1 pl-13">
                  <span>Helpful review?</span>
                  <button
                    onClick={() => handleHelpful(rev.id, "yes")}
                    className={`flex items-center gap-1 transition cursor-pointer ${
                      helpfulMap[rev.id] === "yes"
                        ? "text-[#FF5B35] font-bold"
                        : "hover:text-[#161821] dark:hover:text-white"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleHelpful(rev.id, "no")}
                    className={`flex items-center gap-1 transition cursor-pointer ${
                      helpfulMap[rev.id] === "no"
                        ? "text-rose-600 font-bold"
                        : "hover:text-[#161821] dark:hover:text-white"
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>No</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
