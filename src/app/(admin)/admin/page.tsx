import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  BookCheck,
  ShoppingBag,
  ArrowRight,
  DollarSign,
  TrendingUp,
  CreditCard,
  History,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminOperationsService } from "@/server/services/admin-operations.service";

export const metadata = {
  title: "Admin Operations & Governance | VTI Marketplace LMS",
  description: "Platform oversight, course moderation, instructor payouts, and system audit governance.",
};

export default async function AdminPage() {
  const overview = await AdminOperationsService.getPlatformOverview();

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAEBED]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#161821] tracking-tight">
              Admin Governance & Operations
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFF6DF] text-[#8C6200] border border-[#FBEAC3]">
              Operations Center
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#55585B] mt-1">
            Real-time platform financial oversight, content moderation, instructor payout execution, and user management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/courses">
            <Button size="sm" className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs gap-2 cursor-pointer">
              <BookCheck className="w-4 h-4" /> Moderation Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Financial & User KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Platform GMV */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs space-y-2 hover:border-[#FF5B35]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#8A8C90] uppercase tracking-wider">
              Platform GMV
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FF5B35]/10 text-[#FF5B35] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#161821]">
            ${(overview.grossMerchandiseValueMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#55585B]">
            Net margin (30%): ${(overview.platformNetRevenueMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Registered Students */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs space-y-2 hover:border-[#09BD3C]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#8A8C90] uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#09BD3C]/10 text-[#09BD3C] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#161821]">
            {overview.studentsCount.toLocaleString()}
          </div>
          <div className="text-xs text-[#55585B]">
            Across {overview.publishedCourses} published tracks
          </div>
        </div>

        {/* Instructors */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs space-y-2 hover:border-[#FFC221]/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#8A8C90] uppercase tracking-wider">
              Active Instructors
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FFF6DF] border border-[#FBEAC3] text-[#FFC221] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#161821]">
            {overview.instructorsCount}
          </div>
          <div className="text-xs text-[#55585B]">
            {overview.totalCourses} total courses in catalog
          </div>
        </div>

        {/* Total Catalog Size */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs space-y-2 hover:border-[#FF7162]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#8A8C90] uppercase tracking-wider">
              Course Catalog
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FF7162]/10 text-[#FF7162] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#161821]">
            {overview.publishedCourses}
          </div>
          <div className="text-xs text-[#55585B]">
            {overview.draftCourses} Drafts • {overview.pendingReviewCoursesCount} In Review
          </div>
        </div>
      </div>

      {/* Operational Queues Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-[#161821]">Operational Action Queues</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Course Moderation Queue */}
          <div className="bg-white border border-[#EAEBED] rounded-2xl p-6 shadow-xs space-y-3 hover:border-[#FFC221]/50 transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#161821]">Course Moderation</span>
              <BookCheck className="w-5 h-5 text-[#FF9E00]" />
            </div>
            <div className="text-3xl font-black text-[#161821]">
              {overview.pendingReviewCoursesCount}
            </div>
            <p className="text-xs text-[#55585B]">
              Courses submitted by instructors awaiting quality compliance approval
            </p>
            <div className="pt-3 border-t border-[#EAEBED]">
              <Link
                href="/admin/courses"
                className="text-xs font-bold text-[#FF5B35] hover:underline inline-flex items-center gap-1"
              >
                Inspect moderation queue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Instructor Payout Approvals */}
          <div className="bg-white border border-[#EAEBED] rounded-2xl p-6 shadow-xs space-y-3 hover:border-[#FF5B35]/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#161821]">Pending Payouts</span>
              <CreditCard className="w-5 h-5 text-[#FF5B35]" />
            </div>
            <div className="text-3xl font-black text-[#161821]">
              {overview.pendingPayoutsCount}
            </div>
            <p className="text-xs text-[#55585B]">
              Instructor withdrawal requests eligible for settlement execution
            </p>
            <div className="pt-3 border-t border-[#EAEBED]">
              <Link
                href="/admin/payouts"
                className="text-xs font-bold text-[#FF5B35] hover:underline inline-flex items-center gap-1"
              >
                Review payout requests <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Deletion Queue */}
          <div className="bg-white border border-[#EAEBED] rounded-2xl p-6 shadow-xs space-y-3 hover:border-[#FF7162]/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#161821]">Two-Person Deletions</span>
              <ShieldAlert className="w-5 h-5 text-[#FF7162]" />
            </div>
            <div className="text-3xl font-black text-[#161821]">
              {overview.pendingDeletionsCount}
            </div>
            <p className="text-xs text-[#55585B]">
              Sensitive entity deletion requests requiring Super Admin authorization
            </p>
            <div className="pt-3 border-t border-[#EAEBED]">
              <Link
                href="/admin/courses"
                className="text-xs font-bold text-[#FF5B35] hover:underline inline-flex items-center gap-1"
              >
                View deletion queue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links / Governance Directory */}
      <div className="bg-white border border-[#EAEBED] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-black text-[#161821]">Operations Quick Directory</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="p-4 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] hover:border-[#FF5B35]/40 hover:bg-white transition group"
          >
            <Users className="w-5 h-5 text-[#FF5B35] mb-2" />
            <div className="font-bold text-sm text-[#161821] group-hover:text-[#FF5B35]">
              User Management
            </div>
            <p className="text-xs text-[#55585B] mt-1">
              Search, suspend, or activate student and instructor accounts.
            </p>
          </Link>

          <Link
            href="/admin/courses"
            className="p-4 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] hover:border-[#FF5B35]/40 hover:bg-white transition group"
          >
            <BookCheck className="w-5 h-5 text-[#FF9E00] mb-2" />
            <div className="font-bold text-sm text-[#161821] group-hover:text-[#FF5B35]">
              Course Moderation
            </div>
            <p className="text-xs text-[#55585B] mt-1">
              Inspect curriculum and approve new course submissions.
            </p>
          </Link>

          <Link
            href="/admin/payouts"
            className="p-4 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] hover:border-[#FF5B35]/40 hover:bg-white transition group"
          >
            <CreditCard className="w-5 h-5 text-[#FF5B35] mb-2" />
            <div className="font-bold text-sm text-[#161821] group-hover:text-[#FF5B35]">
              Instructor Payouts
            </div>
            <p className="text-xs text-[#55585B] mt-1">
              Approve bank transfers and track settlement reference IDs.
            </p>
          </Link>

          <Link
            href="/courses"
            className="p-4 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] hover:border-[#FF5B35]/40 hover:bg-white transition group"
          >
            <History className="w-5 h-5 text-[#09BD3C] mb-2" />
            <div className="font-bold text-sm text-[#161821] group-hover:text-[#FF5B35]">
              Live Catalog
            </div>
            <p className="text-xs text-[#55585B] mt-1">
              Browse public courses as seen by prospective students.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
