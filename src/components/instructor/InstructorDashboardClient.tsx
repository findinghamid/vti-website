"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  InstructorSummaryKPI,
  CoursePerformanceItem,
  RevenueTimeSeriesPoint,
  RecentEnrollmentItem,
} from "@/server/services/instructor-analytics.service";
import { InstructorBalanceInfo } from "@/server/services/payout.service";
import { RevenueTrendChart } from "@/components/analytics/RevenueTrendChart";
import { WithdrawalModal } from "@/components/instructor/WithdrawalModal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  BookOpen,
  Star,
  PlusCircle,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Award,
  MessageSquare,
} from "lucide-react";

interface InstructorDashboardClientProps {
  initialSummary: InstructorSummaryKPI;
  initialCourses: CoursePerformanceItem[];
  initialRevenueSeries: RevenueTimeSeriesPoint[];
  initialRecentEnrollments: RecentEnrollmentItem[];
  initialBalance: InstructorBalanceInfo;
}

export function InstructorDashboardClient({
  initialSummary,
  initialCourses,
  initialRevenueSeries,
  initialRecentEnrollments,
  initialBalance,
}: InstructorDashboardClientProps) {
  const [summary] = useState<InstructorSummaryKPI>(initialSummary);
  const [courses] = useState<CoursePerformanceItem[]>(initialCourses);
  const [revenueSeries] = useState<RevenueTimeSeriesPoint[]>(initialRevenueSeries);
  const [recentEnrollments] = useState<RecentEnrollmentItem[]>(initialRecentEnrollments);
  const [balance, setBalance] = useState<InstructorBalanceInfo>(initialBalance);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);

  const refreshBalance = async () => {
    try {
      const res = await fetch("/api/v1/instructor/payouts");
      const data = await res.json();
      if (data.success && data.data?.balance) {
        setBalance(data.data.balance);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAEBED]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#161821] tracking-tight">
              Instructor Studio
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#E8F8EE] text-[#09BD3C] border border-[#09BD3C]/20">
              Verified Partner
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#55585B] mt-1">
            Performance analytics, revenue velocity, and catalog operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWithdrawModalOpen(true)}
            className="border-[#EAEBED] text-[#161821] hover:bg-[#F3F4F8] gap-1.5 font-bold text-xs h-10 px-4 rounded-xl cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#FF5B35]" /> Request Payout
          </Button>

          <Link href="/instructor/courses/new">
            <Button
              size="sm"
              className="bg-[#FF5B35] hover:bg-[#E04824] text-white gap-2 font-bold text-xs h-10 px-5 rounded-xl shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs hover:border-[#FF5B35]/40 transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#8A8C90] uppercase tracking-wider">
              Lifetime Earnings
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FF5B35]/10 text-[#FF5B35] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#161821]">
            ${(summary.totalEarningsMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#09BD3C]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{summary.earningsGrowthPct}%</span>
            <span className="text-[#8A8C90] font-normal">vs last month</span>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs hover:border-[#09BD3C]/40 transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#8A8C90] uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#09BD3C]/10 text-[#09BD3C] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#161821]">
            {summary.totalStudents.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF5B35]">
            <Users className="w-3.5 h-3.5" />
            <span>+{summary.studentGrowthPct}%</span>
            <span className="text-[#8A8C90] font-normal">new enrollments</span>
          </div>
        </div>

        {/* Course Catalog */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs hover:border-[#FFC221]/50 transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#8A8C90] uppercase tracking-wider">
              Active Courses
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FFF6DF] border border-[#FBEAC3] text-[#FFC221] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#161821]">
            {summary.activeCoursesCount}
          </div>
          <p className="text-xs text-[#55585B]">
            {summary.activeCoursesCount} Published • {summary.totalCoursesCount - summary.activeCoursesCount} Drafts
          </p>
        </div>

        {/* Rating & Reviews */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs hover:border-[#FF7162]/40 transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#8A8C90] uppercase tracking-wider">
              Faculty Rating
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FF7162]/10 text-[#FF7162] flex items-center justify-center">
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <div className="text-2xl sm:text-3xl font-black text-[#161821]">
              {summary.averageRating.toFixed(2)}
            </div>
            <span className="text-xs text-[#8A8C90] font-semibold">/ 5.0</span>
          </div>
          <p className="text-xs text-[#55585B]">
            {summary.totalReviews.toLocaleString()} verified student reviews
          </p>
        </div>
      </div>

      {/* Secondary Highlights Row: Available Balance + Completion + Q&A */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Available Balance Quick Card */}
        <div className="bg-gradient-to-br from-[#FF5B35] to-[#E04824] rounded-2xl p-6 text-white shadow-md shadow-[#FF5B35]/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-90">
                Available For Payout
              </span>
              <span className="text-[10px] font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full">
                Cleared
              </span>
            </div>
            <div className="text-3xl font-black mt-2">
              ${(balance.availableMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs opacity-80 mt-1">
              Pending in transit: ${(balance.pendingMinor / 100).toFixed(2)}
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between gap-3 border-t border-white/20 mt-4">
            <Link
              href="/instructor/payouts"
              className="text-xs font-bold hover:underline inline-flex items-center gap-1 opacity-90 hover:opacity-100"
            >
              Payout ledger <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Button
              size="sm"
              onClick={() => setIsWithdrawModalOpen(true)}
              className="bg-white text-[#FF5B35] hover:bg-slate-100 font-extrabold text-xs px-4 h-8 rounded-xl cursor-pointer"
            >
              Withdraw
            </Button>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="bg-white border border-[#EAEBED] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#8A8C90] uppercase tracking-wider">
                Student Completion Rate
              </span>
              <Award className="w-4 h-4 text-[#09BD3C]" />
            </div>
            <div className="text-3xl font-black text-[#161821] mt-2">
              {summary.averageCompletionRatePct}%
            </div>
            <p className="text-xs text-[#55585B] mt-1">
              Top 15% marketplace retention benchmark
            </p>
          </div>
          <div className="w-full bg-[#F3F4F8] rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-[#09BD3C] h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, summary.averageCompletionRatePct)}%` }}
            />
          </div>
        </div>

        {/* Q&A Responsiveness Card */}
        <div className="bg-white border border-[#EAEBED] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#8A8C90] uppercase tracking-wider">
                Q&A Resolution Rate
              </span>
              <MessageSquare className="w-4 h-4 text-[#FF5B35]" />
            </div>
            <div className="text-3xl font-black text-[#161821] mt-2">
              {summary.qaResponseRatePct}%
            </div>
            <p className="text-xs text-[#55585B] mt-1">
              Average instructor response time: &lt; 4 hours
            </p>
          </div>
          <div className="w-full bg-[#F3F4F8] rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-[#FF5B35] h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, summary.qaResponseRatePct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 30-Day Revenue Trend Chart */}
      <RevenueTrendChart data={revenueSeries} />

      {/* Grid: Course Performance Table + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Performance Breakdown (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#161821]">Course Performance</h2>
              <p className="text-xs text-[#55585B]">
                Revenue, enrollment, and engagement breakdown by published track
              </p>
            </div>
            <Link
              href="/instructor/courses"
              className="text-xs font-bold text-[#FF5B35] hover:underline inline-flex items-center gap-1"
            >
              All courses <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-[#EAEBED] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] text-[10px] font-extrabold text-[#8A8C90] border-b border-[#EAEBED] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Course Title</th>
                    <th className="py-3.5 px-4">Enrolled</th>
                    <th className="py-3.5 px-4">Net Revenue</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEBED]">
                  {courses.map((course) => (
                    <tr key={course.courseId} className="hover:bg-[#FAF9F6] transition">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#161821] line-clamp-1 max-w-xs">
                          {course.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              course.status === "PUBLISHED"
                                ? "bg-[#E8F8EE] text-[#09BD3C]"
                                : "bg-[#FFF6DF] text-[#8C6200]"
                            }`}
                          >
                            {course.status}
                          </span>
                          <span className="text-[11px] text-[#55585B] font-semibold">
                            ${(course.priceMinor / 100).toFixed(2)}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-bold text-[#161821]">
                        {course.enrolledStudents.toLocaleString()}
                        <div className="text-[10px] font-normal text-[#8A8C90]">
                          {course.completionRatePct}% completion
                        </div>
                      </td>

                      <td className="py-4 px-4 font-black text-[#FF5B35]">
                        ${(course.revenueMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 font-bold text-[#161821]">
                          <Star className="w-3.5 h-3.5 fill-[#FFC221] text-[#FFC221]" />
                          <span>{course.averageRating.toFixed(1)}</span>
                        </div>
                        <div className="text-[10px] text-[#8A8C90]">
                          {course.reviewsCount} reviews
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <Link href={`/instructor/courses/${course.courseId}/manage`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-bold border-[#EAEBED] hover:bg-[#F3F4F8] rounded-lg gap-1"
                          >
                            Edit <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Student Enrollments (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#161821]">Live Registrations</h2>
              <p className="text-xs text-[#55585B]">Recent student enrollments</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#09BD3C] animate-pulse" />
          </div>

          <div className="bg-white border border-[#EAEBED] rounded-2xl p-4 shadow-xs divide-y divide-[#EAEBED]">
            {recentEnrollments.map((enr) => (
              <div key={enr.id} className="py-3 first:pt-1 last:pb-1 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF5B35] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {enr.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="font-bold text-xs text-[#161821] truncate">
                      {enr.studentName}
                    </span>
                    <span className="text-[11px] font-black text-[#09BD3C]">
                      +${(enr.amountMinor / 100).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#55585B] truncate mt-0.5">
                    {enr.courseTitle}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-[#8A8C90] mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(enr.enrolledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableMinor={balance.availableMinor}
        onSuccess={refreshBalance}
      />
    </div>
  );
}
