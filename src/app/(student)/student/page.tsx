import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Award,
  Play,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Zap,
  ExternalLink,
  Trophy,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCartUserId } from "@/server/auth/cart-session";
import { EnrollmentService } from "@/server/services/enrollment.service";
import { OrderService } from "@/server/services/order.service";
import { CertificateService } from "@/server/services/certificate.service";

export const metadata = {
  title: "Student Dashboard | VTI Marketplace",
  description: "Track your enrolled courses, active learning progress, certificates, and invoices.",
};

export default async function StudentDashboardPage() {
  const { userId } = await getCartUserId();

  // Fetch student data concurrently
  const [enrollments, orders, certificates] = await Promise.all([
    EnrollmentService.getUserEnrollments(userId).catch(() => []),
    OrderService.getUserOrders(userId).catch(() => []),
    CertificateService.getUserCertificates(userId).catch(() => []),
  ]);

  const activeEnrollments = enrollments.filter(
    (e) => e.progressPct > 0 && e.progressPct < 100
  );
  const completedEnrollments = enrollments.filter((e) => e.progressPct === 100);
  const notStartedEnrollments = enrollments.filter((e) => e.progressPct === 0);

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#161821] tracking-tight">
            Learning Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#55585B] mt-1">
            Welcome back! Here is a summary of your academic progress and recent activities.
          </p>
        </div>
        <Link href="/courses">
          <Button className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-10 px-5 gap-2 rounded-xl shadow-xs cursor-pointer">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC221]" />
            <span>Discover More Courses</span>
          </Button>
        </Link>
      </div>

      {/* VTI Fact Stat Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled Courses */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs flex items-center justify-between hover:border-[#FF5B35]/40 transition">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-[#161821]">
              {enrollments.length}
            </h3>
            <p className="text-xs font-semibold text-[#55585B]">Enrolled Courses</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FF5B35]/10 text-[#FF5B35] flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs flex items-center justify-between hover:border-[#FFC221]/60 transition">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-[#161821]">
              {activeEnrollments.length + notStartedEnrollments.length}
            </h3>
            <p className="text-xs font-semibold text-[#55585B]">Active In Progress</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFC221]/15 text-[#FF9E00] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Courses */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs flex items-center justify-between hover:border-[#09BD3C]/40 transition">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-[#161821]">
              {completedEnrollments.length}
            </h3>
            <p className="text-xs font-semibold text-[#55585B]">Completed Courses</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#09BD3C]/10 text-[#09BD3C] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Certificates Earned */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs flex items-center justify-between hover:border-[#FF7162]/40 transition">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-[#161821]">
              {certificates.length}
            </h3>
            <p className="text-xs font-semibold text-[#55585B]">Official Certificates</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FF7162]/10 text-[#FF7162] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-[#161821]">Continue Learning</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FF5B35]/10 text-[#FF5B35]">
              {enrollments.length} Tracks
            </span>
          </div>
          <Link
            href="/student/learning"
            className="text-xs font-bold text-[#FF5B35] hover:text-[#E04824] flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#EAEBED] p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5B35]/10 text-[#FF5B35] flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#161821]">No courses enrolled yet</h4>
            <p className="text-xs text-[#55585B] max-w-sm mx-auto">
              Explore our marketplace of top software engineering, AI, and cloud architecture tracks to start learning today.
            </p>
            <div className="pt-2">
              <Link href="/courses">
                <Button className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-9 px-5 rounded-xl">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.slice(0, 3).map((enr) => {
              const course = enr.course || {
                id: enr.courseId,
                title: "Mastering Next.js 16 & TypeScript",
                slug: "mastering-nextjs-16",
                thumbnailUrl: null,
                totalDurationSec: 36000,
                totalLectures: 32,
                instructors: [{ name: "Dr. Farooq Khan", avatarUrl: null }],
              };
              const isDone = enr.progressPct === 100;

              return (
                <div
                  key={enr.id}
                  className="bg-white rounded-2xl border border-[#EAEBED] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full bg-[#161821] overflow-hidden">
                      {course.thumbnailUrl ? (
                        <Image
                          src={course.thumbnailUrl}
                          alt={course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 350px"
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1E2235] to-[#161821] flex items-center justify-center text-[#FF5B35] font-bold text-xs">
                          VTI Course
                        </div>
                      )}
                      <Link
                        href={`/learn/${course.slug}`}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <div className="w-10 h-10 rounded-full bg-white text-[#FF5B35] flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-200">
                          <Play className="w-4 h-4 fill-[#FF5B35] ml-0.5" />
                        </div>
                      </Link>

                      {isDone && (
                        <span className="absolute top-2.5 right-2.5 bg-[#09BD3C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-2">
                      <Link
                        href={`/learn/${course.slug}`}
                        className="block font-bold text-sm text-[#161821] hover:text-[#FF5B35] transition line-clamp-2"
                      >
                        {course.title}
                      </Link>
                      {course.instructors && course.instructors[0] && (
                        <p className="text-xs text-[#55585B] truncate">
                          By {course.instructors[0].name}
                        </p>
                      )}

                      {/* Progress */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#55585B] font-semibold">Progress</span>
                          <span className="font-extrabold text-[#161821]">{enr.progressPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#F3F4F8] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isDone ? "bg-[#09BD3C]" : "bg-[#FF5B35]"
                            }`}
                            style={{ width: `${enr.progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link href={`/learn/${course.slug}`} className="w-full block">
                      <Button
                        variant={isDone ? "outline" : "default"}
                        className={`w-full font-bold text-xs h-9 gap-1.5 rounded-xl ${
                          isDone
                            ? "border-[#EAEBED] text-[#161821] hover:bg-[#F3F4F8]"
                            : "bg-[#FF5B35] hover:bg-[#E04824] text-white"
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{enr.progressPct > 0 ? "Resume Course" : "Start Course"}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Purchases & Achievements 2-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Invoices / Orders */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAEBED]">
            <h3 className="font-black text-base text-[#161821] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#FF5B35]" />
              <span>Recent Invoices</span>
            </h3>
            <Link
              href="/student/orders"
              className="text-xs font-bold text-[#FF5B35] hover:underline"
            >
              All Invoices
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-[#55585B] py-4 text-center">
              No orders placed yet. Course receipts will appear here once purchased.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FA] border border-[#EAEBED] text-xs hover:border-[#FF5B35]/30 transition"
                >
                  <div className="space-y-0.5">
                    <p className="font-mono font-bold text-[#161821]">{order.orderNumber}</p>
                    <p className="text-[11px] text-[#55585B]">
                      {new Date(order.createdAt).toLocaleDateString()} • {order.items.length}{" "}
                      {order.items.length === 1 ? "course" : "courses"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-[#161821]">
                      {order.formattedTotal}
                    </span>
                    <Link href={`/checkout/success?orderId=${order.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] font-bold border-[#EAEBED] rounded-lg px-2.5 hover:bg-white"
                      >
                        Receipt
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Verified Certificates & Credentials */}
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAEBED]">
            <h3 className="font-black text-base text-[#161821] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFC221]" />
              <span>Certificates of Completion</span>
            </h3>
            <Link
              href="/student/certificates"
              className="text-xs font-bold text-[#FF5B35] hover:underline"
            >
              View Badges & XP
            </Link>
          </div>

          {certificates.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFC221]/15 text-[#FF9E00] flex items-center justify-center mx-auto">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-[#161821]">No certificates claimed yet</p>
              <p className="text-[11px] text-[#55585B] max-w-xs mx-auto">
                Finish 100% of any enrolled course to automatically unlock your verifiable Certificate of Completion.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.slice(0, 3).map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FA] border border-[#EAEBED] text-xs hover:border-[#FF5B35]/30 transition"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#161821] truncate max-w-[200px]">
                      {cert.courseSnapshot.title}
                    </p>
                    <p className="text-[11px] text-[#55585B] font-mono">
                      {cert.certificateNo}
                    </p>
                  </div>

                  <Link href={`/verify/${cert.certificateNo}`}>
                    <Button
                      size="sm"
                      className="h-7 text-[11px] font-bold bg-[#FF5B35] hover:bg-[#E04824] text-white rounded-lg px-2.5 gap-1"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section: Academic Scholars Leaderboard Preview */}
      <div className="bg-white rounded-2xl border border-[#EAEBED] p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAEBED]">
          <div className="space-y-0.5">
            <h3 className="font-black text-base text-[#161821] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFC221]" />
              <span>Theological Scholars Leaderboard</span>
            </h3>
            <p className="text-xs text-[#55585B]">
              Top students by quiz mastery, consecutive study streaks, and completed theological coursework.
            </p>
          </div>

          <Link href="/student/leaderboard">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold border-[#FF5B35]/40 text-[#FF5B35] hover:bg-[#FF5B35]/10 rounded-xl gap-1.5"
            >
              <span>View Full Leaderboard & Badges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-[#FFC221]/50 bg-[#FFFDF2] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFC221] text-[#161821] font-black text-xs flex items-center justify-center shrink-0">
              #1
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-[#161821] truncate">Jonathan Edwards Jr.</p>
              <p className="text-[10px] text-[#55585B]">1,850 XP • 6 Courses</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shrink-0">
              #2
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-[#161821] truncate">Hannah C. Rutherford</p>
              <p className="text-[10px] text-[#55585B]">1,620 XP • 5 Courses</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#D4A373]/40 bg-[#FFF8F2] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D4A373] text-white font-black text-xs flex items-center justify-center shrink-0">
              #3
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-[#161821] truncate">Samuel B. Kuyper</p>
              <p className="text-[10px] text-[#55585B]">1,390 XP • 4 Courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
