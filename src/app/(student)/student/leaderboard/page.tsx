import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaderboardService, LeaderboardEntry } from "@/server/services/leaderboard.service";

export const metadata = {
  title: "Scholars Leaderboard | Virtual Theological Institute",
  description: "Track top student performers, earned theological badges, quiz scores, and academic milestones.",
};

export default async function StudentLeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const currentCategory = category || "all";
  const scholars = await LeaderboardService.getTopScholars(currentCategory);

  const topThree = scholars.slice(0, 3);
  const remainingScholars = scholars.slice(3);

  const CATEGORIES = [
    { slug: "all", label: "All Disciplines" },
    { slug: "systematic", label: "Systematic Theology" },
    { slug: "languages", label: "Biblical Languages" },
    { slug: "history", label: "Church History" },
    { slug: "apologetics", label: "Apologetics & Ethics" },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAEBED] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/student"
              className="text-xs font-semibold text-[#8A8C90] hover:text-[#FF5B35] transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#161821] tracking-tight flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-[#FFC221]" />
            <span>Theological Scholars Leaderboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#55585B] mt-1">
            Honoring academic rigor, disciplined study streaks, and high assessment performance across the VTI student body.
          </p>
        </div>

        <Link href="/courses">
          <Button className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs cursor-pointer gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC221]" />
            <span>Enroll in New Course</span>
          </Button>
        </Link>
      </div>

      {/* Your Standing Spotlight Banner */}
      <div className="rounded-2xl border border-[#FFC221]/40 bg-gradient-to-r from-[#FFF9E6] via-white to-[#FFF4EC] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFC221] text-[#161821] flex items-center justify-center font-black text-xl shadow-md shrink-0">
            #4
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#B87A00]">
                Your Current Academic Rank
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8EE] text-[#09BD3C]">
                <TrendingUp className="w-3 h-3" /> Top 5% of Scholars
              </span>
            </div>
            <h3 className="text-lg font-black text-[#161821]">
              Alex Morgan • 950 Academic XP
            </h3>
            <p className="text-xs text-[#55585B]">
              3 Courses Completed • 21 Quizzes Passed (96.4% Avg) • 9-Day Consecutive Streak
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/student/certificates">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold border-[#EAEBED] hover:bg-white text-[#161821] rounded-xl h-9 px-4"
            >
              View My Badges
            </Button>
          </Link>
          <Link href="/student/learning">
            <Button
              size="sm"
              className="text-xs font-bold bg-[#FF5B35] hover:bg-[#E04824] text-white rounded-xl h-9 px-4"
            >
              Resume Study
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EAEBED]">
        {CATEGORIES.map((cat) => {
          const active = currentCategory === cat.slug;
          return (
            <Link
              key={cat.slug}
              href={`/student/leaderboard?category=${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                active
                  ? "bg-[#161821] text-white shadow-xs"
                  : "bg-white text-[#55585B] hover:text-[#161821] hover:bg-[#F3F4F8] border border-[#EAEBED]"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Top 3 Podium Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Rank 2 (Silver) */}
        {topThree[1] && (
          <div className="bg-white rounded-3xl border border-[#EAEBED] p-6 shadow-xs flex flex-col items-center text-center space-y-4 relative order-2 md:order-1 pt-10">
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-200 border-2 border-slate-300 text-slate-700 font-black text-sm flex items-center justify-center shadow-md">
              #2
            </div>
            <div className="relative w-20 h-20 rounded-full ring-4 ring-slate-300 overflow-hidden shadow-lg bg-slate-100">
              <Image
                src={topThree[1].avatarUrl}
                alt={topThree[1].name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-base text-[#161821]">{topThree[1].name}</h4>
              <p className="text-[11px] text-[#55585B] line-clamp-1">{topThree[1].focusTrack}</p>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs mt-1">
                {topThree[1].totalPoints.toLocaleString()} XP
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-2 border-t border-[#EAEBED] w-full justify-center">
              {topThree[1].badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-[#F8F9FA] border border-[#EAEBED] text-[10px] font-bold text-[#161821]"
                  title={b.title}
                >
                  {b.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rank 1 (Gold - Center & Elevated) */}
        {topThree[0] && (
          <div className="bg-gradient-to-b from-[#FFFDF2] to-white rounded-3xl border-2 border-[#FFC221] p-7 shadow-lg flex flex-col items-center text-center space-y-4 relative order-1 md:order-2 pt-12 md:-translate-y-2">
            <div className="absolute -top-5 w-11 h-11 rounded-full bg-[#FFC221] border-2 border-white text-[#161821] font-black text-base flex items-center justify-center shadow-xl">
              👑 1
            </div>
            <div className="relative w-24 h-24 rounded-full ring-4 ring-[#FFC221] ring-offset-2 overflow-hidden shadow-xl bg-slate-100">
              <Image
                src={topThree[0].avatarUrl}
                alt={topThree[0].name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B87A00] bg-[#FFF6DF] px-2.5 py-0.5 rounded-full border border-[#FBEAC3]">
                Top Theological Scholar
              </span>
              <h4 className="font-black text-lg text-[#161821]">{topThree[0].name}</h4>
              <p className="text-xs text-[#55585B] line-clamp-1">{topThree[0].focusTrack}</p>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#FFC221] text-[#161821] font-black text-sm mt-1 shadow-sm">
                {topThree[0].totalPoints.toLocaleString()} XP
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#EAEBED] w-full justify-center">
              {topThree[0].badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-[#FFF6DF] border border-[#FBEAC3] text-[10px] font-bold text-[#8C6200]"
                >
                  {b.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {topThree[2] && (
          <div className="bg-white rounded-3xl border border-[#EAEBED] p-6 shadow-xs flex flex-col items-center text-center space-y-4 relative order-3 pt-10">
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-[#E8C29D] border-2 border-[#D4A373] text-[#5C381E] font-black text-sm flex items-center justify-center shadow-md">
              #3
            </div>
            <div className="relative w-20 h-20 rounded-full ring-4 ring-[#E8C29D] overflow-hidden shadow-lg bg-slate-100">
              <Image
                src={topThree[2].avatarUrl}
                alt={topThree[2].name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-base text-[#161821]">{topThree[2].name}</h4>
              <p className="text-[11px] text-[#55585B] line-clamp-1">{topThree[2].focusTrack}</p>
              <div className="inline-block px-3 py-1 rounded-full bg-[#FBF0E4] text-[#8C5320] font-extrabold text-xs mt-1">
                {topThree[2].totalPoints.toLocaleString()} XP
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-2 border-t border-[#EAEBED] w-full justify-center">
              {topThree[2].badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-[#F8F9FA] border border-[#EAEBED] text-[10px] font-bold text-[#161821]"
                  title={b.title}
                >
                  {b.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Remaining Scholars Ranking Table */}
      <div className="bg-white rounded-2xl border border-[#EAEBED] overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#EAEBED] flex items-center justify-between">
          <h3 className="font-black text-base text-[#161821]">
            Global Scholar Standings
          </h3>
          <span className="text-xs text-[#55585B]">Updated Live from Learning Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAEBED] bg-[#FAF9F6] text-[#55585B] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3.5 px-5 text-center w-16">Rank</th>
                <th className="py-3.5 px-5">Scholar</th>
                <th className="py-3.5 px-5">Specialization Track</th>
                <th className="py-3.5 px-5 text-center">Courses</th>
                <th className="py-3.5 px-5 text-center">Quiz Average</th>
                <th className="py-3.5 px-5">Earned Badges</th>
                <th className="py-3.5 px-5 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEBED]">
              {scholars.map((s) => {
                const isUser = s.userId === "usr_student_demo";
                return (
                  <tr
                    key={s.userId}
                    className={`transition hover:bg-[#F8F9FA] ${
                      isUser ? "bg-[#FFF9E6] font-semibold" : ""
                    }`}
                  >
                    <td className="py-4 px-5 text-center font-black text-sm text-[#161821]">
                      {s.rank <= 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FFC221]/20 text-[#B87A00] font-black text-xs">
                          {s.rank}
                        </span>
                      ) : (
                        `#${s.rank}`
                      )}
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#EAEBED]">
                          <Image
                            src={s.avatarUrl}
                            alt={s.name}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#161821] flex items-center gap-1.5">
                            <span>{s.name}</span>
                            {isUser && (
                              <span className="text-[10px] font-extrabold text-[#FF5B35] bg-[#FF5B35]/10 px-2 py-0.2 rounded-full">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-[#8A8C90] flex items-center gap-1">
                            <Flame className="w-3 h-3 text-[#FF5B35]" />
                            <span>{s.currentStreak} Day Study Streak</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-[#55585B] max-w-[200px] truncate">
                      {s.focusTrack}
                    </td>

                    <td className="py-4 px-5 text-center font-bold text-[#161821]">
                      {s.coursesCompleted}
                    </td>

                    <td className="py-4 px-5 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-[#09BD3C] bg-[#E8F8EE] px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        {s.quizAveragePct}%
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1">
                        {s.badges.map((b, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-[#F3F4F8] text-[10px] font-semibold text-[#161821]"
                          >
                            {b.title}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-5 text-right font-black text-sm text-[#FF5B35]">
                      {s.totalPoints.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gamification Points & Badges Rules Guide */}
      <div className="rounded-2xl border border-[#EAEBED] bg-white p-6 space-y-4">
        <h3 className="font-black text-base text-[#161821] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFC221]" />
          <span>How Leaderboard XP & Badges Are Earned</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#55585B]">
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEBED] space-y-1">
            <h4 className="font-bold text-[#161821]">100% Course Completion</h4>
            <p className="leading-relaxed">Earn 150 XP and the "Course Champion" badge upon graduating from any curriculum.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEBED] space-y-1">
            <h4 className="font-bold text-[#161821]">Flawless Assessment</h4>
            <p className="leading-relaxed">Score 100% on any module quiz to earn 100 XP and the "Perfect Score" badge.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEBED] space-y-1">
            <h4 className="font-bold text-[#161821]">Intensive Study Sessions</h4>
            <p className="leading-relaxed">Complete 3 or more lessons in one day to unlock 75 XP and the "Quick Learner" badge.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAEBED] space-y-1">
            <h4 className="font-bold text-[#161821]">Exegetical & Language Work</h4>
            <p className="leading-relaxed">Complete biblical Greek or Hebrew coursework to earn the "Scripture Scholar" badge.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
