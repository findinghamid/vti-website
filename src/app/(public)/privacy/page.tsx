import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Virtual Theological Institute (VTI)",
  description:
    "Learn how VTI protects student records, learning progress, and personal data as a non-profit educational institution.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAF9F6] text-[#161821] min-h-screen font-sans pb-24">
      {/* Header Banner */}
      <section className="relative bg-[#161821] text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Privacy Banner"
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
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
            Our non-profit commitment to safeguarding student data, learning records, and academic privacy.
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
              1. Non-Profit Educational Commitment
            </h2>
            <p>
              Virtual Theological Institute (&ldquo;VTI&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) operates as a non-profit educational ministry dedicated to offering 100% free theological education. We do not sell, rent, monetize, or trade student personal information to any commercial advertisers or third-party marketing companies.
            </p>
          </div>

          <div className="border-t border-[#EAEBED] pt-6">
            <h2 className="text-xl font-bold text-[#161821] mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              To administer courses and issue verifiable academic credentials, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account Credentials:</strong> Full name, email address, and encrypted password.</li>
              <li><strong>Academic Progress:</strong> Lecture completion timestamps, quiz scores, enrolled courses, and certificate generation IDs.</li>
              <li><strong>Inquiry Details:</strong> Information voluntarily submitted via academic advisory contact forms.</li>
            </ul>
          </div>

          <div className="border-t border-[#EAEBED] pt-6">
            <h2 className="text-xl font-bold text-[#161821] mb-3">
              3. Purpose of Data Use
            </h2>
            <p className="mb-3">We use student data solely for:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Providing self-paced lecture delivery and progress tracking in the student dashboard.</li>
              <li>Verifying student course completions on our public certificate verification registry.</li>
              <li>Providing technical assistance and answering academic inquiries.</li>
            </ul>
          </div>

          <div className="border-t border-[#EAEBED] pt-6">
            <h2 className="text-xl font-bold text-[#161821] mb-3">
              4. Data Security and Encryption
            </h2>
            <p>
              All traffic to vti-edu.org is encrypted via industry-standard Transport Layer Security (TLS/HTTPS). User passwords are cryptographically salted and hashed using bcrypt. Access to database systems is strictly restricted to authorized system administrators.
            </p>
          </div>

          <div className="border-t border-[#EAEBED] pt-6">
            <h2 className="text-xl font-bold text-[#161821] mb-3">
              5. Student Rights & Account Deletion
            </h2>
            <p>
              You maintain full ownership of your student account. At any time, you may request the full export or permanent deletion of your account and learning records by emailing <a href="mailto:privacy@vti-edu.org" className="text-[#FF5B35] font-bold underline">privacy@vti-edu.org</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
