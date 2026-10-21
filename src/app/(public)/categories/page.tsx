import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ArrowRight,
  GraduationCap,
  Layers,
  Sparkles,
  Scroll,
  ShieldCheck,
  Award,
} from "lucide-react";
import { VtiButton } from "@/components/ui/vti";

export const metadata = {
  title: "Academic Faculties & Divisions | Virtual Theological Institute (VTI)",
  description:
    "Explore the 8 Theological Faculties of VTI: Systematic Theology, Biblical Studies, Biblical Languages, Church History, Pastoral Ministry, and Apologetics.",
};

interface FacultyItem {
  id: string;
  name: string;
  slug: string;
  dean: string;
  description: string;
  courseCount: number;
  highlightCourses: string[];
  iconBg: string;
}

const FACULTIES: FacultyItem[] = [
  {
    id: "fac-1",
    name: "Faculty of Systematic Theology",
    slug: "systematic-theology",
    dean: "Dr. David Sterling, Th.D.",
    description:
      "A comprehensive, confessionally grounded study of the doctrine of Scripture (Bibliology), Theology Proper, Christology, Pneumatology, Soteriology, and Eschatology.",
    courseCount: 12,
    highlightCourses: [
      "Foundations of Systematic Theology",
      "The Doctrine of the Trinity",
      "Soteriology: The Doctrine of Salvation",
    ],
    iconBg: "bg-[#FF5B35]/10 text-[#FF5B35]",
  },
  {
    id: "fac-2",
    name: "Faculty of Biblical Hermeneutics & Exegesis",
    slug: "biblical-studies",
    dean: "Dr. Sarah Machen, Ph.D.",
    description:
      "Equipping students with grammatical-historical hermeneutics, redemptive-historical covenant theology, and sound exegetical principles to rightly divide the Word.",
    courseCount: 16,
    highlightCourses: [
      "Biblical Hermeneutics & Principles of Exegesis",
      "Old Testament Survey: Law & Prophets",
      "New Testament Survey: Gospels & Epistles",
    ],
    iconBg: "bg-[#09BD3C]/10 text-[#09BD3C]",
  },
  {
    id: "fac-3",
    name: "Faculty of Biblical Languages",
    slug: "biblical-languages",
    dean: "Dr. Sarah Machen, Ph.D.",
    description:
      "Original language mastery in Koine Greek and Classical Hebrew to enable firsthand translation, syntactical analysis, and textual criticism of Scripture.",
    courseCount: 8,
    highlightCourses: [
      "Biblical Greek Grammar & Syntax",
      "Biblical Hebrew Elements & Vocab",
      "Greek Exegetical Reading: Galatians & Romans",
    ],
    iconBg: "bg-[#2950FF]/10 text-[#2950FF]",
  },
  {
    id: "fac-4",
    name: "Faculty of Church History",
    slug: "church-history",
    dean: "Rev. Dr. Samuel Rutherford, D.Min.",
    description:
      "Tracing the providential work of God through the Apostolic Fathers, Ecumenical Councils, Medieval monasticism, the Protestant Reformation, and global awakenings.",
    courseCount: 10,
    highlightCourses: [
      "The Early Church to the Nicene Council",
      "The 16th-Century Protestant Reformation",
      "Puritan Theology & Modern Church Movements",
    ],
    iconBg: "bg-[#9A34EB]/10 text-[#9A34EB]",
  },
  {
    id: "fac-5",
    name: "Faculty of Christian Apologetics & Philosophy",
    slug: "apologetics",
    dean: "Prof. Marcus Aurelius Hodge, Th.M.",
    description:
      "Defending the historic Christian faith against philosophical skepticism, secular worldviews, moral relativism, and scientism with gentleness and respect.",
    courseCount: 7,
    highlightCourses: [
      "Christian Apologetics in a Secular Age",
      "Historical Evidences for the Resurrection",
      "Presuppositional & Classical Apologetics",
    ],
    iconBg: "bg-[#FF7162]/10 text-[#FF7162]",
  },
  {
    id: "fac-6",
    name: "Faculty of Pastoral Ministry & Homiletics",
    slug: "pastoral-ministry",
    dean: "Rev. Thomas Cranmer",
    description:
      "Preparing shepherd-pastors for expository preaching, pastoral counseling, church governance, elder leadership, and compassionate congregation care.",
    courseCount: 11,
    highlightCourses: [
      "Expository Preaching: Text to Sermon",
      "Pastoral Care & Counseling in Trials",
      "Biblical Church Eldership & Governance",
    ],
    iconBg: "bg-[#FF5B35]/10 text-[#FF5B35]",
  },
  {
    id: "fac-7",
    name: "Faculty of Spiritual Formation & Christian Ethics",
    slug: "ethics-spirituality",
    dean: "Dr. David Sterling, Th.D.",
    description:
      "Cultivating personal holiness, prayer, mortification of sin, and applying biblical law and ethics to contemporary societal dilemmas.",
    courseCount: 9,
    highlightCourses: [
      "Spiritual Disciplines for the Christian Life",
      "Christian Ethics in the Marketplace",
      "Historic Devotional Classics & Prayer",
    ],
    iconBg: "bg-[#FFC221]/15 text-[#FF8A00]",
  },
  {
    id: "fac-8",
    name: "Faculty of Missions & Global Church Planting",
    slug: "missions-evangelism",
    dean: "Hannah Edwards",
    description:
      "Fulfilling the Great Commission through cross-cultural missions, contextualized evangelism, pioneer church planting, and theological education abroad.",
    courseCount: 6,
    highlightCourses: [
      "Biblical Foundations of World Missions",
      "Cross-Cultural Ministry & Discipleship",
      "Pioneer Church Planting Dynamics",
    ],
    iconBg: "bg-[#09BD3C]/10 text-[#09BD3C]",
  },
];

export default function CategoriesPage() {
  return (
    <div className="bg-[#FAF9F6] text-[#161821] min-h-screen font-sans pb-24">
      {/* 1. Header Banner */}
      <section className="relative bg-[#161821] text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Faculties Banner"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161821]/95 via-[#161821]/80 to-[#161821]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-white/70">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFC221]">Academic Faculties</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Academic Faculties & Disciplines
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Rigorous, biblically faithful faculties curated by seminary scholars to equip the global Church. All courses are 100% tuition-free.
          </p>
        </div>
      </section>

      {/* 2. Faculties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FACULTIES.map((fac) => (
            <div
              key={fac.id}
              className="group p-8 rounded-3xl bg-white border border-[#EAEBED] shadow-xs hover:shadow-xl hover:border-[#FF5B35]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${fac.iconBg} flex items-center justify-center font-bold`}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#FF5B35] bg-[#FF5B35]/10 px-3 py-1 rounded-full">
                    {fac.courseCount} Free Courses
                  </span>
                </div>

                {/* Faculty Title */}
                <h2 className="text-xl sm:text-2xl font-black text-[#161821] group-hover:text-[#FF5B35] transition duration-200 mb-2">
                  <Link href={`/courses?category=${fac.slug}`}>{fac.name}</Link>
                </h2>

                <p className="text-xs font-bold text-[#57595F] mb-3">
                  Dean: <span className="text-[#161821]">{fac.dean}</span>
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#57595F] leading-relaxed mb-6">
                  {fac.description}
                </p>

                {/* Sample Syllabus / Highlights */}
                <div className="space-y-2 mb-6 bg-[#F8F8FA] p-4 rounded-2xl border border-[#EAEBED]/70">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#57595F] block">
                    Curriculum Highlights:
                  </span>
                  {fac.highlightCourses.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#161821]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B35]" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#EAEBED] flex items-center justify-between">
                <Link
                  href={`/courses?category=${fac.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#FF5B35] group-hover:translate-x-1 transition-transform duration-200"
                >
                  <span>Explore Faculty Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <span className="text-[11px] font-black uppercase text-[#09BD3C] bg-[#09BD3C]/10 px-2 py-0.5 rounded">
                  100% Free Tuition
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
