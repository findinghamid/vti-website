"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Search,
  Award,
  CheckCircle2,
  Lock,
  FileCheck,
  ArrowRight,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { VtiButton } from "@/components/ui/vti";

export default function CertificateVerificationSearchPage() {
  const router = useRouter();
  const [certNumber, setCertNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = certNumber.trim();
    if (!trimmed) {
      setError("Please enter a valid certificate identification number.");
      return;
    }
    setError(null);
    router.push(`/verify/${encodeURIComponent(trimmed)}`);
  };

  const sampleCertificates = [
    {
      id: "VTI-2026-TH-4821",
      course: "Foundations of Systematic Theology",
      student: "Marcus Sterling",
      date: "August 2026",
    },
    {
      id: "VTI-2026-GK-7193",
      course: "Beginning New Testament Greek",
      student: "Sarah Jenkins",
      date: "September 2026",
    },
    {
      id: "VTI-2026-CH-9042",
      course: "Church History & Historic Creeds",
      student: "David Vance",
      date: "September 2026",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#FF5B35]/10 text-[#FF5B35] border border-[#FF5B35]/20">
            <ShieldCheck className="w-4 h-4 text-[#FF5B35]" />
            <span>Official Credential Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#161821] tracking-tight leading-tight">
            Verify Academic Credentials
          </h1>
          <p className="text-sm sm:text-base text-[#57595F] leading-relaxed">
            Every completion certificate issued by the Virtual Theological Institute (VTI) is cryptographically signed and stored in our central registry. Enter a certificate serial number below to verify its authenticity.
          </p>
        </div>

        {/* Verification Search Card */}
        <div className="bg-white rounded-3xl border-2 border-[#EAEBED] shadow-xl p-6 sm:p-10 space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <label className="block text-xs font-extrabold text-[#161821] uppercase tracking-wider">
              Certificate Serial Number / Credential ID
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-[#8A8C90] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. VTI-2026-TH-4821 or your 16-digit ID"
                  value={certNumber}
                  onChange={(e) => {
                    setCertNumber(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-13 pl-12 pr-4 rounded-2xl border-2 border-[#EAEBED] bg-white text-sm font-semibold text-[#161821] placeholder:text-[#8A8C90] focus:border-[#FF5B35] focus:outline-none transition shadow-2xs"
                />
              </div>
              <button
                type="submit"
                className="h-13 px-8 rounded-2xl bg-[#FF5B35] hover:bg-[#E04824] text-white font-extrabold text-sm transition-all duration-200 shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Verify Credential</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-600 font-semibold mt-1">
                {error}
              </p>
            )}
            <p className="text-[11px] text-[#8A8C90]">
              The certificate ID is located at the bottom-center of the digital certificate PDF and print documents.
            </p>
          </form>

          {/* Verification Protocol Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#EAEBED]">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF9F6]">
              <div className="w-8 h-8 rounded-xl bg-[#09BD3C]/10 text-[#09BD3C] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#161821]">Tamper-Proof</h4>
                <p className="text-[11px] text-[#57595F] mt-0.5">Permanent SHA-256 record verification</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF9F6]">
              <div className="w-8 h-8 rounded-xl bg-[#FF5B35]/10 text-[#FF5B35] flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#161821]">Curriculum Standards</h4>
                <p className="text-[11px] text-[#57595F] mt-0.5">Satisfies 100% of theological competencies</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF9F6]">
              <div className="w-8 h-8 rounded-xl bg-[#2950FF]/10 text-[#2950FF] flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#161821]">Ecclesiastical Validity</h4>
                <p className="text-[11px] text-[#57595F] mt-0.5">Recognized by churches and ministries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Verified Records */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#161821]">
            Recent Sample Verified Records
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sampleCertificates.map((sample) => (
              <Link
                key={sample.id}
                href={`/verify/${sample.id}`}
                className="group block p-4 rounded-2xl bg-white border border-[#EAEBED] hover:border-[#FF5B35]/50 shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between text-xs text-[#8A8C90] mb-2">
                  <span className="font-mono font-bold text-[#FF5B35]">{sample.id}</span>
                  <span>{sample.date}</span>
                </div>
                <h4 className="text-xs font-bold text-[#161821] group-hover:text-[#FF5B35] transition line-clamp-1">
                  {sample.course}
                </h4>
                <p className="text-[11px] text-[#57595F] mt-1">
                  Awarded to: <span className="font-semibold text-[#161821]">{sample.student}</span>
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Church & Ministry Help Callout */}
        <div className="p-6 rounded-3xl bg-[#FFF6DF] border border-[#FBEAC3] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-extrabold text-[#161821]">Are you a Church Elder or Mission Board?</h4>
            <p className="text-xs text-[#57595F]">
              Need bulk verification or official transcripts for ministry candidates? Contact our academic registry directly.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-[#161821] hover:bg-[#FF5B35] text-white text-xs font-bold transition shadow-xs shrink-0"
          >
            Contact Academic Registry
          </Link>
        </div>
      </div>
    </main>
  );
}
