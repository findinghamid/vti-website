"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Sparkles,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Flame,
  CheckCircle2,
  Code2,
  MessageSquare,
  ArrowRight,
  BookOpen,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificateRecord, GamificationProfile } from "@/server/services/certificate.service";

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [profile, setProfile] = useState<GamificationProfile>({
    totalPoints: 0,
    currentStreak: 1,
    badges: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [certRes, badgeRes] = await Promise.all([
        fetch("/api/v1/student/certificates"),
        fetch("/api/v1/student/badges"),
      ]);

      const certData = await certRes.json();
      const badgeData = await badgeRes.json();

      if (certData.success && certData.data?.certificates) {
        setCertificates(certData.data.certificates);
      }
      if (badgeData.success && badgeData.data) {
        setProfile(badgeData.data);
      }
    } catch (e) {
      console.error("Failed fetching student credentials", e);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-[#FFC221]" />;
      case "Code2":
        return <Code2 className="w-5 h-5 text-[#FF5B35]" />;
      case "MessageSquare":
        return <MessageSquare className="w-5 h-5 text-[#09BD3C]" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5 text-[#13B9FD]" />;
      default:
        return <Award className="w-5 h-5 text-[#FFC221]" />;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAEBED] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#161821] tracking-tight">
            Credentials & Achievements
          </h1>
          <p className="text-xs sm:text-sm text-[#55585B] mt-1">
            Official verifiable completion certificates, academic badges, and learning gamification progress.
          </p>
        </div>

        <Link href="/student/learning">
          <Button
            variant="outline"
            className="text-xs font-bold border-[#EAEBED] hover:bg-[#F3F4F8] text-[#161821] rounded-xl h-10 px-4"
          >
            Back to My Learning
          </Button>
        </Link>
      </div>

      {/* Gamification Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Certificates Earned */}
        <div className="p-5 rounded-2xl border border-[#EAEBED] bg-white shadow-xs flex items-center gap-4 hover:border-[#FFC221]/50 transition">
          <div className="w-12 h-12 rounded-xl bg-[#FFF6DF] border border-[#FBEAC3] flex items-center justify-center text-[#FFC221] shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#161821]">
              {certificates.length}
            </p>
            <p className="text-xs font-bold text-[#55585B] uppercase tracking-wider">
              Certificates Earned
            </p>
          </div>
        </div>

        {/* Achievement Points */}
        <div className="p-5 rounded-2xl border border-[#EAEBED] bg-white shadow-xs flex items-center gap-4 hover:border-[#FF5B35]/50 transition">
          <div className="w-12 h-12 rounded-xl bg-[#FF5B35]/10 border border-[#FF5B35]/20 flex items-center justify-center text-[#FF5B35] shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#161821]">
              {profile.totalPoints} XP
            </p>
            <p className="text-xs font-bold text-[#55585B] uppercase tracking-wider">
              Total XP Points
            </p>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="p-5 rounded-2xl border border-[#EAEBED] bg-white shadow-xs flex items-center gap-4 hover:border-[#FF7162]/50 transition">
          <div className="w-12 h-12 rounded-xl bg-[#FF7162]/10 border border-[#FF7162]/20 flex items-center justify-center text-[#FF7162] shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#161821]">
              {profile.currentStreak} Days
            </p>
            <p className="text-xs font-bold text-[#55585B] uppercase tracking-wider">
              Active Learning Streak
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Official Verified Certificates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#161821] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#09BD3C]" />
            <span>Official Certificates of Completion</span>
          </h2>
          <span className="text-xs font-bold text-[#55585B] px-2.5 py-0.5 rounded-full bg-[#F3F4F8]">
            {certificates.length} Issued
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-[#8A8C90] bg-white rounded-2xl border border-[#EAEBED]">
            Loading verified credentials...
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-[#EAEBED] bg-white text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FFF6DF] text-[#FFC221] flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#161821]">No certificates issued yet</h3>
            <p className="text-xs text-[#55585B] max-w-sm mx-auto">
              Complete 100% of any enrolled course curriculum to automatically claim your verified Certificate of Completion.
            </p>
            <div className="pt-2">
              <Link href="/student/learning">
                <Button className="text-xs font-bold bg-[#FF5B35] hover:bg-[#E04824] text-white rounded-xl h-10 px-6">
                  Resume Active Courses
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl border border-[#EAEBED] bg-white p-6 flex flex-col justify-between gap-5 hover:border-[#FF5B35]/40 shadow-xs hover:shadow-md transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#8C6200] bg-[#FFF6DF] px-2.5 py-1 rounded-md border border-[#FBEAC3]">
                      {cert.certificateNo}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#09BD3C] bg-[#E8F8EE] px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#161821] group-hover:text-[#FF5B35] transition leading-snug">
                    {cert.courseSnapshot.title}
                  </h3>

                  <p className="text-xs text-[#55585B]">
                    Lead Instructor:{" "}
                    <strong className="text-[#161821]">{cert.courseSnapshot.instructorName}</strong>
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAEBED] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#8A8C90]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Issued {new Date(cert.issuedAt).toLocaleDateString()}</span>
                  </div>

                  <Link href={`/verify/${cert.certificateNo}`}>
                    <Button
                      size="sm"
                      className="text-xs font-bold h-9 bg-[#FF5B35] hover:bg-[#E04824] text-white rounded-xl gap-1.5 px-4 shadow-xs"
                    >
                      <span>View Credential</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Student Gamification Badges */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-[#161821] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFC221]" />
          <span>Academic Badges & Milestones</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.badges.length === 0 ? (
            <div className="col-span-full p-8 rounded-2xl border border-dashed border-[#EAEBED] bg-white text-center text-xs text-[#8A8C90]">
              Complete lectures and quizzes to unlock achievements and earn XP!
            </div>
          ) : (
            profile.badges.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl border border-[#EAEBED] bg-white flex items-start gap-4 shadow-xs hover:border-[#FF5B35]/30 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] border border-[#EAEBED] flex items-center justify-center shrink-0">
                  {getBadgeIcon(b.icon)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#161821]">{b.title}</h4>
                    <span className="text-[10px] font-extrabold text-[#8C6200] bg-[#FFF6DF] px-2 py-0.5 rounded border border-[#FBEAC3]">
                      +{b.points} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-[#55585B] leading-relaxed">{b.description}</p>
                  <p className="text-[10px] text-[#8A8C90] pt-1">
                    Unlocked {new Date(b.awardedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
