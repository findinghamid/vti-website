import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Shield, BookOpen, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Terms of Use & Academic Honor Code | Virtual Theological Institute (VTI)",
  description:
    "Review VTI's Academic Honor Code, free educational licensing terms, and student standards.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#FAF9F6] text-[#161821] min-h-screen font-sans pb-24">
      {/* Header Banner */}
      <section className="relative bg-[#161821] text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Terms Banner"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161821]/95 via-[#161821]/80 to-[#161821]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-white/70">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFC221]">Legal & Governance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Terms of Use & Academic Honor Code
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
            Our shared standards of integrity, theological scholarship, and Christian fellowship.
          </p>
        </div>
      </section>

      {/* Main Content Box */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="bg-white rounded-3xl border border-[#EAEBED] shadow-xs p-8 sm:p-12 space-y-8 text-sm text-[#57595F] leading-relaxed">
          <div>
            <span className="text-xs font-bold text-[#FF5B35] uppercase tracking-wider block mb-1">
              Effective Date: September 2026
            </span>
            <h2 className="text-2xl font-black text-[#161821] mb-4">
              1. The VTI Academic Honor Code
            </h2>
            <p className="mb-3">
              As followers of Jesus Christ pursuing theological and biblical studies, students are expected to uphold the highest standards of integrity in all academic work:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Honesty in Assessments:</strong> All evaluation quizzes and modular tests must be completed by the registered student without unapproved collaborative cheating or automated answer scrapers.</li>
              <li><strong>Plagiarism Prohibition:</strong> Written reflections, essays, and discussion contributions must cite Scripture and primary historical sources properly without intellectual theft.</li>
              <li><strong>Reverence and Mutual Respect:</strong> Interactions in student forums and comments must reflect Christlike humility, edification, and charitable theological discourse.</li>
            </ul>
          </div>

          <div className="border-t border-[#EAEBED] pt-6">
            <h2 className="text-xl font-bold text-[#161821] mb-3">
              2. 100% Free Educational License
            </h2>
            <p>
              All video lectures, audio recordings, lecture notes, syllabi, and reading materials provided on vti-edu.org are the intellectual property of the Virtual Theological Institute and its faculty. Materials are licensed freely for personal study, church small groups, and non-commercial ministerial training. Commercial resale or redistribution is strictly prohibited.
            </p>
          </div>

          <div className="border-t border-[#EAEBED] pt-6">
            <h2 className="text-xl font-bold text-[#161821] mb-3">
              3. Certificates of Completion
            </h2>
            <p>
              Certificates issued by VTI certify that the enrolled student has completed the prescribed curriculum and achieved satisfactory quiz evaluations. While widely recognized by church elder boards, missions agencies, and ministry leaders, certificates do not constitute regional state licensure.
            </p>
          </div>

          <div className="border-t border-[#EAEBED] pt-6">
            <h2 className="text-xl font-bold text-[#161821] mb-3">
              4. Code of Conduct & Account Governance
            </h2>
            <p>
              VTI reserves the right to suspend or revoke student access if an account is found to engage in malicious behavior, hate speech, spam, or systematic violation of the Academic Honor Code.
            </p>
          </div>

          <div className="border-t border-[#EAEBED] pt-6">
            <h2 className="text-xl font-bold text-[#161821] mb-3">
              5. Contacting Academic Governance
            </h2>
            <p>
              For questions concerning the Academic Honor Code, transfer credits, or church group licensing, please contact the Office of the Registrar at <a href="mailto:registrar@vti-edu.org" className="text-[#FF5B35] font-bold underline">registrar@vti-edu.org</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
