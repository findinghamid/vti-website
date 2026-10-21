import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  Download,
  Copy,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  BookOpen,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { CertificateService, CertificateRecord } from "@/server/services/certificate.service";
import { Button } from "@/components/ui/button";
import { VerifyCertificateActions } from "./VerifyCertificateActions";

interface VerifyPageProps {
  params: Promise<{ certificateNo: string }>;
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { certificateNo } = await params;
  const result = await CertificateService.getCertificateByNumber(certificateNo);

  if (!result.certificate) {
    return {
      title: "Credential Verification | Virtual Theological Institute (VTI)",
      description: "Verify the authenticity of Virtual Theological Institute (VTI) completion certificates.",
    };
  }

  const { studentSnapshot, courseSnapshot } = result.certificate;
  return {
    title: `Verified Certificate: ${studentSnapshot.name} - ${courseSnapshot.title} | VTI`,
    description: `Official completion certificate issued to ${studentSnapshot.name} for completing ${courseSnapshot.title}. Verified by Virtual Theological Institute (vti-edu.org).`,
    openGraph: {
      title: `Verified Certificate: ${studentSnapshot.name}`,
      description: `Completed ${courseSnapshot.title} on Virtual Theological Institute (VTI).`,
    },
  };
}

export default async function CertificateVerificationPage({ params }: VerifyPageProps) {
  const { certificateNo } = await params;
  const result = await CertificateService.getCertificateByNumber(certificateNo);

  if (result.status === "NOT_FOUND" || !result.certificate) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center space-y-4">
          <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
          <h1 className="text-xl font-bold text-white">Certificate Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The credential ID <code className="text-amber-400 font-mono px-1.5 py-0.5 rounded bg-slate-950">{certificateNo}</code> does not match any certificate issued in our records. Please check the serial number and try again.
          </p>
          <div className="pt-2">
            <Link href="/courses">
              <Button className="w-full text-xs font-bold bg-orange-600 hover:bg-indigo-700 text-white">
                Explore Verified Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cert = result.certificate;
  const isRevoked = result.status === "REVOKED";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Verification Status Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/student/learning"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            {isRevoked ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-900 px-3 py-1.5 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span>Credential Revoked</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-3 py-1.5 rounded-full shadow-lg shadow-emerald-950/40">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Official Credential • Active</span>
              </span>
            )}
          </div>
        </div>

        {/* Ornate Digital Certificate Card */}
        <div className="relative rounded-3xl border-4 border-amber-600/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-14 shadow-2xl overflow-hidden print:border-black print:bg-white print:text-black">
          {/* Watermark Crest Background */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-white" />
          </div>

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-500/60" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-500/60" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-500/60" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-500/60" />

          <div className="relative z-10 text-center space-y-8">
            {/* Header / Seal */}
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 mb-2">
                <Award className="w-8 h-8" />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400 font-bold">
                Virtual Theological Institute (VTI)
              </p>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-white print:text-black font-serif">
                Certificate of Completion
              </h1>
            </div>

            {/* Recipient Statement */}
            <div className="space-y-2 max-w-xl mx-auto">
              <p className="text-xs sm:text-sm text-slate-400 font-serif italic">
                This is to officially certify that
              </p>
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-300 font-serif tracking-wide py-2 border-b border-slate-800 max-w-md mx-auto print:text-black">
                {cert.studentSnapshot.name}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-serif italic pt-2">
                has successfully completed all lectures, hands-on architectural assessments, and project requirements for
              </p>
              <h2 className="text-lg sm:text-2xl font-bold text-white leading-tight pt-2 print:text-black">
                {cert.courseSnapshot.title}
              </h2>
            </div>

            {/* Curriculum Stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-12 py-3 border-y border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{cert.courseSnapshot.formattedDuration} Coursework</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>{cert.courseSnapshot.totalLectures} Technical Lectures</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Issued {new Date(cert.issuedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Signatures & Serial Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 items-end text-left">
              <div className="space-y-1 border-t border-slate-800 pt-3">
                <p className="font-serif italic text-sm text-amber-200">
                  {cert.courseSnapshot.instructorName}
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Lead Instructor & Curriculum Architect
                </p>
              </div>

              <div className="space-y-1 sm:text-right border-t border-slate-800 pt-3">
                <p className="text-[11px] font-mono text-slate-400">
                  Credential ID: <strong className="text-amber-400 font-bold">{cert.certificateNo}</strong>
                </p>
                <p className="text-[10px] text-slate-500">
                  Verify at: https://vti.edu{cert.verificationUrl}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Actions Component (Client Interactive) */}
        <VerifyCertificateActions cert={cert} />
      </div>
    </div>
  );
}
