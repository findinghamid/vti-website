import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Layers, ShieldCheck, HeartHandshake } from "lucide-react";
import { SectionHeading, DecorativeUnderline, VtiButton } from "@/components/ui/vti";
import { VTI_FACULTIES } from "@/server/services/vti-catalog";

interface CategoryDisplayItem {
  id: string;
  name: string;
  urduName: string;
  slug: string;
  subtitle: string;
  description: string;
  count: number;
  icon: string;
  bgColor: string;
  borderAccent: string;
}

const FACULTY_CARDS: CategoryDisplayItem[] = [
  {
    id: "cat-found",
    name: "Christian Foundation",
    urduName: "مسیحی بنیاد",
    slug: "christian-foundation",
    subtitle: "Core Orthodox Doctrines",
    description: "The nature of God, the Holy Trinity, Fall, Salvation, Baptism, Resurrection, and the Church.",
    count: 3,
    icon: "/assets/img/icon/category/cat-2-icon-1.svg",
    bgColor: "bg-[#061D42]/10 group-hover:bg-[#061D42]",
    borderAccent: "group-hover:border-[#061D42]",
  },
  {
    id: "cat-interp",
    name: "Bible Understanding & Interpretation",
    urduName: "بائبل کو سمجھنا اور تشریح",
    slug: "bible-understanding-and-interpretation",
    subtitle: "Hermeneutics & Exegesis",
    description: "Sound grammatical-historical hermeneutics, Old and New Testament narrative and exposition.",
    count: 1,
    icon: "/assets/img/icon/category/cat-2-icon-2.svg",
    bgColor: "bg-[#C08C52]/15 group-hover:bg-[#C08C52]",
    borderAccent: "group-hover:border-[#C08C52]",
  },
  {
    id: "cat-growth",
    name: "Spiritual Growth & Christian Living",
    urduName: "روحانی ترقی اور مسیحی زندگی",
    slug: "spiritual-growth-and-christian-living",
    subtitle: "Discipleship & Holy Living",
    description: "Prayer disciplines, sanctification, Christian ethics, moral decision-making, and comfort in Christ.",
    count: 2,
    icon: "/assets/img/icon/category/cat-2-icon-7.svg",
    bgColor: "bg-[#02AEED]/15 group-hover:bg-[#02AEED]",
    borderAccent: "group-hover:border-[#02AEED]",
  },
  {
    id: "cat-apologetics",
    name: "Christian Apologetics",
    urduName: "مسیحی دفاعیات",
    slug: "christian-apologetics",
    subtitle: "Defending Scripture & Faith",
    description: "The manuscript reliability, textual preservation, inerrancy, and divine authority of God's Word.",
    count: 1,
    icon: "/assets/img/icon/category/cat-2-icon-5.svg",
    bgColor: "bg-[#E93238]/10 group-hover:bg-[#E93238]",
    borderAccent: "group-hover:border-[#E93238]",
  },
];

export function HomeCategoriesSection() {
  return (
    <section className="py-20 lg:py-24 bg-[#FFFFFF] border-b border-[#EAEBED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <SectionHeading
            subtitle="Theological Faculties"
            title="Four Pillars of Faithful Urdu Bible Education"
            align="center"
          />
          <p className="text-sm sm:text-base text-[#57595F] leading-relaxed">
            Our curriculum is organized across four distinct academic faculties designed specifically
            for the Pakistani Christian community and Urdu-speaking believers worldwide — 100% free tuition.
          </p>
        </div>

        {/* 4 Faculties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FACULTY_CARDS.map((cat) => (
            <Link
              key={cat.id}
              href={`/courses?category=${cat.slug}`}
              className={`group relative flex flex-col justify-between p-6 rounded-3xl bg-[#FAF9F6] border border-[#EAEBED] shadow-xs hover:shadow-xl ${cat.borderAccent} transition-all duration-300 transform hover:-translate-y-1.5`}
            >
              <div>
                {/* Header: Icon & Urdu Name */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 shrink-0 rounded-2xl ${cat.bgColor} flex items-center justify-center transition-colors duration-300`}
                  >
                    <div className="relative w-7 h-7 group-hover:brightness-0 group-hover:invert transition duration-300">
                      <Image
                        src={cat.icon}
                        alt={cat.name}
                        fill
                        sizes="28px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#061D42] bg-white border border-[#EAEBED] px-2.5 py-1 rounded-full shadow-2xs">
                    {cat.count} {cat.count === 1 ? "Course" : "Courses"}
                  </span>
                </div>

                {/* Urdu Tag */}
                <div className="text-xs font-bold text-[#C08C52] font-urdu mb-1">
                  {cat.urduName}
                </div>

                {/* Title & Subtitle */}
                <h4 className="text-base sm:text-lg font-black text-[#061D42] group-hover:text-[#C08C52] transition duration-200 leading-snug">
                  {cat.name}
                </h4>
                <p className="text-[11px] font-bold text-[#57595F] uppercase tracking-wider mt-0.5">
                  {cat.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs text-[#57595F] mt-3 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Bottom CTA Arrow */}
              <div className="mt-5 pt-3 border-t border-[#EAEBED] flex items-center justify-between text-xs font-bold text-[#061D42] group-hover:text-[#C08C52] transition">
                <span>Explore Faculty</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>

        {/* Informational Assurance Banner */}
        <div className="mt-12 max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#061D42]/5 via-[#FAF9F6] to-[#C08C52]/10 border border-[#EAEBED] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#061D42] text-[#C08C52] flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C08C52]">
                Accessible & Practical
              </span>
              <h4 className="text-lg sm:text-xl font-black text-[#061D42] mt-0.5">
                Bible Education for Everyone, Everywhere
              </h4>
              <p className="text-xs sm:text-sm text-[#57595F] mt-0.5">
                Designed for individuals at all stages of faith, empowering believers to apply biblical principles daily.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <VtiButton href="/courses" variant="primary" size="md" showArrow>
              View All Courses
            </VtiButton>
          </div>
        </div>
      </div>
    </section>
  );
}
