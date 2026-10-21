import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  Users,
  Mail,
  ShieldCheck,
  BookOpen,
  Music,
  Video,
  MessageCircle,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Leadership & Team | Virtual Theological Institute (VTI)",
  description:
    "Meet the leadership, academic coordinators, and ministry servants behind Virtual Theological Institute (VTI) — providing non-denominational Urdu Bible education for everyone, everywhere.",
  alternates: {
    canonical: "https://vti-edu.org/team",
  },
  openGraph: {
    title: "Our Leadership & Team | Virtual Theological Institute (VTI)",
    description:
      "Meet the leadership, academic coordinators, and ministry servants behind Virtual Theological Institute (VTI).",
    url: "https://vti-edu.org/team",
    siteName: "Virtual Theological Institute",
    locale: "en_US",
    type: "website",
  },
};

interface TeamMember {
  id: string;
  name: string;
  urduName?: string;
  role: string;
  department: string;
  image: string;
  email: string;
  bio: string;
  keyResponsibilities: string[];
  icon: React.ElementType;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "junaid-javed",
    name: "Dr. Junaid Javed, Ph.D.",
    urduName: "ڈاکٹر جنید جاوید",
    role: "Founder & Academic Dean",
    department: "Academic Leadership & Governance",
    image: "/assets/img/leadership/leadership-thumb-1.jpg",
    email: "junaid.javed@vti-edu.org",
    bio: "Theological educator and author devoted to advancing sound biblical literacy across Pakistan and the Urdu-speaking diaspora. Oversees institutional vision, curricular fidelity, and doctrinal integrity.",
    keyResponsibilities: [
      "Theological syllabus and doctrinal review",
      "Authoring foundational theology course lectures",
      "Strategic academic partnerships worldwide",
    ],
    icon: GraduationCap,
  },
  {
    id: "robin-sarfraz",
    name: "Robin Sarfraz, M.Div.",
    urduName: "روبن سرفراز",
    role: "Executive Director & Ministry Coordinator",
    department: "Operations & Ministry Outreach",
    image: "/assets/img/leadership/leadership-thumb-2.jpg",
    email: "robin.sarfraz@vti-edu.org",
    bio: "Experienced pastoral leader directing day-to-day operations, pastoral liaisons, community engagement, and coordinating the Go Gospel worship and music initiatives.",
    keyResponsibilities: [
      "Executive administration and institutional operations",
      "Go Gospel worship releases and lyric theological oversight",
      "Student pastoral care and church liaisons",
    ],
    icon: Users,
  },
  {
    id: "academic-coordinator",
    name: "Academic Programs Coordinator",
    urduName: "اکیڈمک پروگرام کوآرڈینیٹر",
    role: "Curriculum & Syllabus Lead",
    department: "Curriculum Development",
    image: "/assets/img/leadership/leadership-thumb-3.jpg",
    email: "curriculum@vti-edu.org",
    bio: "Coordinates the structuring of 14-module course syllabi, Urdu study guides, transcript verification, and assessment benchmarks across all four academic faculties.",
    keyResponsibilities: [
      "Module layout and reading guide compilation",
      "Urdu theological vocabulary translation review",
      "Faculty lecture schedule synchronization",
    ],
    icon: BookOpen,
  },
  {
    id: "gospel-director",
    name: "Go Gospel Music & Worship Lead",
    urduName: "گو گوسپل میوزک ڈائریکٹر",
    role: "Sacred Music & Audio Production Lead",
    department: "Go Gospel Ministry",
    image: "/assets/img/leadership/leadership-thumb-4.jpg",
    email: "gospel@vti-edu.org",
    bio: "Serves as creative producer for Go Gospel's monthly worship song releases, collaborating with Christian vocalists, poets, and musicians to nurture faith through Christ-exalting praise.",
    keyResponsibilities: [
      "Monthly worship music production and recording",
      "Theological review of Urdu hymns and lyrics",
      "YouTube release pipeline and acoustic arrangements",
    ],
    icon: Music,
  },
  {
    id: "media-production",
    name: "Studio Video & Media Production Lead",
    urduName: "میڈیا پروڈکشن لیڈ",
    role: "Video Recording & Post-Production Lead",
    department: "Media Studio",
    image: "/assets/img/leadership/leadership-thumb-5.jpg",
    email: "media@vti-edu.org",
    bio: "Directs in-studio multi-camera video recording, high-definition streaming mastering, motion graphics, and Urdu subtitling for upcoming online courses.",
    keyResponsibilities: [
      "Studio recording of theological lecture series",
      "Video editing, audio mastering, and color grading",
      "Course video streaming optimization and CDN delivery",
    ],
    icon: Video,
  },
  {
    id: "community-liaison",
    name: "Student Cohort & Community Liaison",
    urduName: "اسٹوڈنٹ سپورٹ اور کمیونٹی کوآرڈینیٹر",
    role: "Community Outreach & WhatsApp Support",
    department: "Student Experience",
    image: "/assets/img/leadership/leadership-thumb-6.jpg",
    email: "support@vti-edu.org",
    bio: "Supports enrolled students with onboarding, facilitates peer discussion cohorts across official WhatsApp study groups, and ensures learners have guidance at every step.",
    keyResponsibilities: [
      "Direct WhatsApp cohort facilitation and student helpdesk",
      "Guidance for first-time online learners of all age groups",
      "Course release announcements and community notifications",
    ],
    icon: MessageCircle,
  },
];

export default function TeamPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vti-edu.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Team",
        item: "https://vti-edu.org/team",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Breadcrumb Area */}
      <section className="relative bg-[#061D42] text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C08C52_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#C08C52]/20 text-[#C08C52] border border-[#C08C52]/30">
            <Users className="w-4 h-4 text-[#C08C52]" />
            <span>Leadership & Operations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            The Team Behind VTI
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Meet the faithful leaders, scholars, and ministry servants committed to making
            reverent, orthodox Bible education accessible to the Pakistani Christian community and
            believers worldwide.
          </p>
          <p className="text-xs font-semibold text-[#C08C52] tracking-wide pt-1">
            &ldquo;Bible Education for Everyone, Everywhere&rdquo; • ہر ایک کے لیے، ہر جگہ بائبل کی تعلیم
          </p>
        </div>
      </section>

      {/* Leadership Directory Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Introduction */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061D42]">
              Dedicated to Sound Doctrine & Community Service
            </h2>
            <p className="text-xs sm:text-sm text-[#57595F] leading-relaxed">
              VTI is a non-denominational initiative serving young adults, men, and women from all
              walks of life. Our administration works collaboratively across academic oversight,
              video production, community care, and sacred worship.
            </p>
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => {
              const Icon = member.icon;
              return (
                <div
                  key={member.id}
                  className="group bg-white rounded-3xl border border-[#EAEBED] p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-[#C08C52]/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Photo and Department */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-900 border-2 border-[#C08C52] shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#C08C52] bg-[#C08C52]/10 px-2.5 py-0.5 rounded-full">
                          {member.department}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-[#061D42] group-hover:text-[#C08C52] transition leading-snug truncate">
                          {member.name}
                        </h3>
                        {member.urduName && (
                          <p className="text-xs font-bold text-[#57595F] font-urdu">
                            {member.urduName}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-[#57595F] leading-tight">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#57595F] leading-relaxed mb-4 border-t border-[#EAEBED] pt-3">
                      {member.bio}
                    </p>

                    {/* Key Responsibilities */}
                    <div className="space-y-2 mb-6">
                      <p className="text-[11px] font-black uppercase tracking-wider text-[#061D42] flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-[#C08C52]" />
                        <span>Core Focus Areas:</span>
                      </p>
                      <ul className="space-y-1.5">
                        {member.keyResponsibilities.map((resp, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-[#57595F] flex items-start gap-2 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C08C52] mt-1.5 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer: Email Link */}
                  <div className="pt-4 border-t border-[#EAEBED] flex items-center justify-between">
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#061D42] hover:text-[#C08C52] transition"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#C08C52]" />
                      <span className="truncate max-w-[190px]">{member.email}</span>
                    </a>
                    <span className="text-[10px] font-extrabold text-[#09BD3C] bg-[#09BD3C]/10 px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Doctrinal Foundation & Collaboration Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#061D42] to-[#0A2B5E] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C08C52] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C08C52]" />
                Historic Confessional Unity
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Collaborating with Faithful Bible Instructors
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Our leadership partners with qualified, experienced Bible teachers who share a
                fervent commitment to equipping the community with sound doctrine, practical
                discipleship, and Christ-centered worship.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/statement-of-faith"
                className="px-5 py-3 rounded-2xl bg-[#C08C52] hover:bg-[#A9763D] text-white font-extrabold text-xs transition shadow-md text-center"
              >
                Statement of Faith
              </Link>
              <Link
                href="/contact"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition border border-white/20 text-center flex items-center justify-center gap-1.5"
              >
                <span>Contact Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
