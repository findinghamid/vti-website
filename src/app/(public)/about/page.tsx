import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import {
  ShieldCheck,
  Award,
  Users,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Compass,
  Scroll,
  Heart,
  Globe,
  Home,
  ChevronRight,
  Clock,
} from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "About Us | Virtual Theology Institute",
  description:
    "Learn about Virtual Theology Institute (VTI) — providing tuition-free, high-quality, non-denominational Urdu theological education rooted in historic biblical orthodoxy.",
  canonical: "/about",
});

const PILLARS_OF_STRENGTH = [
  {
    count: "100%",
    label: "Tuition-Free",
    sub: "Free theological education for all",
  },
  {
    count: "4",
    label: "Academic Faculties",
    sub: "Structured divisions of theological study",
  },
  {
    count: "Urdu",
    label: "Primary Medium",
    sub: "Contextual teaching for Pakistani believers",
  },
  {
    count: "Orthodox",
    label: "Historic Doctrine",
    sub: "Grounded in the inerrant Word of God",
  },
];

const CORE_VALUES = [
  {
    icon: BookOpen,
    title: "Biblical Authority",
    urduTitle: "بائبل کا حتمی اختیار",
    description:
      "We hold the Holy Bible as the inspired, infallible, and authoritative Word of God, serving as the supreme standard for faith and Christian living.",
  },
  {
    icon: ShieldCheck,
    title: "Free Access",
    urduTitle: "مفت رسائی",
    description:
      "Theological education should never be restricted by financial barriers. All VTI courses, lecture materials, and study syllabi are provided 100% free of charge.",
  },
  {
    icon: Globe,
    title: "Contextual Learning",
    urduTitle: "مقامی تناظر میں تعلیم",
    description:
      "Curriculum crafted specifically for the Pakistani and Urdu-speaking context, addressing real-life discipleship, cultural engagement, and local ministry realities.",
  },
  {
    icon: GraduationCap,
    title: "Excellence in Teaching",
    urduTitle: "معیاری تدریس",
    description:
      "Committed to sound doctrine, academic depth, and practical pastoral training that equips leaders to handle Scripture with reverent precision.",
  },
  {
    icon: Heart,
    title: "Unity in Christ",
    urduTitle: "مسیح میں اتحاد",
    description:
      "A non-denominational institute fostering spiritual unity among believers and congregations from diverse evangelical and historical Christian backgrounds.",
  },
];

const KEY_FACULTY = [
  {
    name: "Dr. Junaid Javed, Ph.D.",
    role: "Dean of Biblical Theology",
    specialty: "Systematic Theology, Bibliology & Trinitarian Studies",
    avatar: "/assets/img/avatars/scholar-dr-junaid.jpg",
  },
  {
    name: "Robin Sarfraz, M.Div.",
    role: "Academic Dean & Lecturer",
    specialty: "Old Testament Covenant History & Pastoral Ministry",
    avatar: "/assets/img/avatars/student-2.jpg",
  },
  {
    name: "Prof. David M. Vance, Ph.D.",
    role: "Senior Lecturer in Hermeneutics",
    specialty: "Biblical Exegesis & Manuscript Reliability",
    avatar: "/assets/img/teacher/teacher-3.png",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0A101D] text-[#161821] dark:text-slate-100 min-h-screen font-sans pb-24">
      {/* 1. Header Banner */}
      <section className="relative bg-[#061D42] text-white py-16 sm:py-24 overflow-hidden border-b border-[#C08C52]/20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="About VTI Banner"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061D42] via-[#061D42]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left space-y-4">
          <nav className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-300 mb-2">
            <Link href="/" className="hover:text-white flex items-center gap-1.5 transition">
              <Home className="w-3.5 h-3.5 text-[#C08C52]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#C08C52] font-bold">About VTI</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-[#C08C52] bg-[#C08C52]/20 border border-[#C08C52]/40 px-3.5 py-1.5 rounded-full mb-3">
              Bible Education for Everyone, Everywhere
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              About Virtual Theology Institute
            </h1>
            <p className="text-base sm:text-lg text-slate-200 mt-3 leading-relaxed">
              Virtual Theology Institute (VTI) is an online theological institute dedicated to providing quality Bible education to the Pakistani Christian community and Urdu-speaking believers worldwide — completely tuition-free.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Counter Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white dark:bg-[#161821] rounded-3xl border border-[#EAEBED] dark:border-slate-800 shadow-xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {PILLARS_OF_STRENGTH.map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#061D42] dark:text-[#C08C52]">
                {stat.count}
              </p>
              <h4 className="text-sm font-bold text-[#161821] dark:text-white">{stat.label}</h4>
              <p className="text-xs text-[#57595F] dark:text-slate-400">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#061D42] dark:text-[#C08C52] bg-[#061D42]/10 dark:bg-[#C08C52]/20 px-3.5 py-1.5 rounded-full border border-[#061D42]/20 dark:border-[#C08C52]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C08C52]" /> Our Mission & Vision
            </span>

            <h2 className="text-3xl sm:text-4xl font-black font-heading leading-tight text-[#161821] dark:text-white">
              Grounded in the Word. <br />
              Equipping the Body of Christ.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#57595F] dark:text-slate-300 leading-relaxed">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 space-y-1 shadow-xs">
                <h3 className="font-bold text-[#061D42] dark:text-[#C08C52] text-sm uppercase tracking-wider">
                  Our Mission
                </h3>
                <p>
                  To offer structured, high-quality, and non-denominational theological education in Urdu, completely free of charge, enabling pastors, leaders, and believers to deepen their faith and understanding of Scripture.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 space-y-1 shadow-xs">
                <h3 className="font-bold text-[#061D42] dark:text-[#C08C52] text-sm uppercase tracking-wider">
                  Our Vision
                </h3>
                <p>
                  To equip every believer with the knowledge of God’s Word, empowering them to live faithfully, serve effectively, and impact their communities for Christ.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/statement-of-faith"
                className="px-6 py-3 rounded-xl bg-[#061D42] hover:bg-[#0A2B5E] text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Read Statement of Faith</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C08C52]" />
              </Link>
              <Link
                href="/courses/coming-soon"
                className="px-6 py-3 rounded-xl bg-white dark:bg-[#161821] border border-[#EAEBED] dark:border-slate-800 text-[#061D42] dark:text-white hover:border-[#061D42] text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Clock className="w-3.5 h-3.5 text-[#C08C52]" />
                <span>Upcoming Courses</span>
              </Link>
            </div>
          </div>

          {/* Right Image / Visual Card */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#EAEBED] dark:border-slate-800 aspect-4/3 bg-slate-900">
              <Image
                src="/assets/img/course/christian-foundational-beliefs.webp"
                alt="VTI Bible Teaching"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061D42]/90 via-[#061D42]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-bold text-[#C08C52] uppercase tracking-wider">
                  Urdu Theological Education
                </span>
                <h4 className="text-lg font-bold">بائبل کی تعلیم سب کے لیے، ہر جگہ</h4>
                <p className="text-xs text-slate-200">
                  Accessible digital learning empowering pastors and churches across Pakistan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values Section */}
      <section className="bg-white dark:bg-[#111A2E] py-20 border-y border-[#EAEBED] dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#C08C52]">
              Guiding Convictions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-[#161821] dark:text-white">
              Our Core Values
            </h2>
            <p className="text-sm text-[#57595F] dark:text-slate-400">
              These fundamental principles guide our academic standards, curriculum development, and ministry philosophy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_VALUES.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAF9F6] dark:bg-[#161821] rounded-3xl p-7 border border-[#EAEBED] dark:border-slate-800 shadow-xs hover:shadow-md hover:border-[#061D42]/30 transition duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#061D42]/10 dark:bg-[#C08C52]/20 text-[#061D42] dark:text-[#C08C52] flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#C08C52] font-urdu block mb-0.5" dir="rtl">
                        {val.urduTitle}
                      </span>
                      <h3 className="text-lg font-bold text-[#161821] dark:text-white font-heading">
                        {val.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#57595F] dark:text-slate-400 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Statement of Faith Callout Card */}
            <div className="bg-gradient-to-br from-[#061D42] to-[#0A2B5E] text-white rounded-3xl p-7 flex flex-col justify-between shadow-md">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C08C52]/20 text-[#C08C52] flex items-center justify-center">
                  <Scroll className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-heading">
                  Confessional Orthodoxy
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Our teaching is doctrinally anchored in the historic confessions of Christian faith: the Trinity, bodily Resurrection, inerrant Scripture, and salvation by grace alone.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/statement-of-faith"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#C08C52] hover:bg-[#A8753E] text-[#061D42] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Read Statement of Faith</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Key Faculty & Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#C08C52]">
            Academic Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-[#161821] dark:text-white">
            Our Faculty & Instructors
          </h2>
          <p className="text-sm text-[#57595F] dark:text-slate-400">
            Dedicated servants of God bringing academic rigor, pastoral warmth, and deep love for God’s Word to Urdu Bible teaching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {KEY_FACULTY.map((fac, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#161821] rounded-3xl p-6 border border-[#EAEBED] dark:border-slate-800 shadow-sm text-center space-y-4 hover:shadow-lg transition"
            >
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[#C08C52] shadow-md bg-slate-100">
                <Image src={fac.avatar} alt={fac.name} fill sizes="112px" className="object-cover" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#161821] dark:text-white font-heading">
                  {fac.name}
                </h3>
                <p className="text-xs font-bold text-[#C08C52]">{fac.role}</p>
                <p className="text-xs text-[#57595F] dark:text-slate-400 pt-1 leading-relaxed">
                  {fac.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Go Gospel & Ministry Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#061D42] to-[#0A2B5E] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C08C52]">
              Worship & Music Arm
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading">
              Discover Go Gospel Ministry
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Explore VTI’s worship and gospel music wing, releasing monthly Urdu worship songs and Christian spiritual anthems for the global Church.
            </p>
          </div>
          <Link
            href="/go-gospel"
            className="px-6 py-3.5 rounded-xl bg-[#C08C52] hover:bg-[#A8753E] text-[#061D42] font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Visit Go Gospel Ministry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
