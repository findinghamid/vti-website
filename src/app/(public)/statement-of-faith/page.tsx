import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import {
  ShieldCheck,
  BookOpen,
  Cross,
  Sparkles,
  Heart,
  Flame,
  Users,
  Compass,
  ArrowRight,
  Home,
  ChevronRight,
  Download,
} from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Statement of Faith | Virtual Theology Institute",
  description:
    "Official Statement of Faith of Virtual Theology Institute (VTI). Rooted in historic Christian orthodoxy, inerrant Scripture, and the sovereign grace of God.",
  canonical: "/statement-of-faith",
});

const DOCTRINAL_PILLARS = [
  {
    num: "01",
    title: "The Holy Trinity",
    urduTitle: "تثلیثِ اقدس",
    icon: Compass,
    content:
      "We believe in one eternal God, existing in three distinct persons: the Father, the Son, and the Holy Spirit, equal in power and glory. He is the Creator, Sustainer, and Ruler of all things visible and invisible.",
    scriptures: ["Deuteronomy 6:4", "Matthew 28:19", "2 Corinthians 13:14", "John 1:1-3"],
  },
  {
    num: "02",
    title: "The Inerrancy and Authority of Scripture",
    urduTitle: "کلامِ مقدس کی عصمت اور حتمی اختیار",
    icon: BookOpen,
    content:
      "We believe the Holy Bible (the 66 books of the Old and New Testaments) is the divinely inspired, trustworthy, and infallible Word of God. Written by human authors under the supernatural guidance of the Holy Spirit, it is entirely free from error in its original manuscripts and constitutes the supreme and final authority for all matters of Christian faith, doctrine, and living.",
    scriptures: ["2 Timothy 3:16-17", "2 Peter 1:20-21", "Psalm 119:105", "Isaiah 40:8"],
  },
  {
    num: "03",
    title: "The Person and Work of Jesus Christ",
    urduTitle: "یسوع مسیح کی ذات اور نجات بخش کام",
    icon: ShieldCheck,
    content:
      "We believe Jesus Christ is fully God and fully man, the eternal Son of God made flesh. He was conceived by the Holy Spirit, born of the Virgin Mary, lived a perfectly sinless life, performed miracles confirming His divine messiahship, died on the cross as a substitutionary sacrifice for the sins of humanity, rose bodily from the dead on the third day, ascended into heaven, and is currently seated at the right hand of the Father as our High Priest and Advocate until He returns in glory.",
    scriptures: ["John 1:14", "Philippians 2:5-11", "1 Corinthians 15:3-4", "Hebrews 4:14-16"],
  },
  {
    num: "04",
    title: "The Fall and Salvation by Grace",
    urduTitle: "انسان کا زوال اور فضل سے نجات",
    icon: Heart,
    content:
      "We believe that all humanity was created in the image of God but fell into sin through disobedience, resulting in spiritual death and total depravity. Human beings are entirely unable to save themselves by moral effort or good works. Salvation is solely a gift of God’s sovereign grace, received through personal faith and repentance in Jesus Christ, whose shed blood at Calvary cleanses from all sin and grants eternal life.",
    scriptures: ["Romans 3:23", "Ephesians 2:8-9", "Titus 3:5", "Romans 5:1-2"],
  },
  {
    num: "05",
    title: "The Ministry of the Holy Spirit",
    urduTitle: "روح القدس کی ہستی اور خدمت",
    icon: Flame,
    content:
      "We believe in the Holy Spirit, the third person of the Trinity, who convicts the world of sin, righteousness, and judgment. He regenerates repentant sinners, indwells every believer from the moment of salvation, seals them for the day of redemption, guides them into all truth, produces spiritual fruit, and endows believers with spiritual gifts for holy living and fruitful ministry.",
    scriptures: ["John 14:16-17", "John 16:7-14", "Galatians 5:22-23", "Acts 1:8"],
  },
  {
    num: "06",
    title: "The Church and the Ordinances",
    urduTitle: "کلیسا اور مقدّس آئین",
    icon: Users,
    content:
      "We believe the Church is the spiritual body and bride of Jesus Christ, composed of all redeemed believers across all ages, nations, and denominations. We uphold the two ordinances instituted by Christ: Water Baptism by immersion as an outward testimony of inward faith and identification with Christ's death and resurrection, and the Lord’s Supper (Holy Communion) observed in reverent remembrance of His broken body and shed blood until He comes.",
    scriptures: ["Matthew 28:19", "1 Corinthians 11:23-26", "Colossians 1:18", "Ephesians 4:4-6"],
  },
  {
    num: "07",
    title: "The Resurrection and the Second Coming",
    urduTitle: "مردوں کا جی اٹھنا اور مسیح کی آمدِ ثانی",
    icon: Sparkles,
    content:
      "We believe in the personal, bodily, and glorious return of our Lord Jesus Christ to judge the living and the dead. We believe in the bodily resurrection of both the righteous and the unrighteous: the redeemed to eternal blessedness and communion in the presence of God in the new heavens and new earth, and the unrepentant to eternal separation from God.",
    scriptures: ["1 Thessalonians 4:16-17", "Revelation 21:1-4", "Matthew 25:31-46", "Acts 1:11"],
  },
];

export default function StatementOfFaithPage() {
  return (
    <div className="w-full bg-[#F8F8FA] dark:bg-[#0A101D] min-h-screen pb-24">
      {/* 1. Breadcrumb Banner with institutional styling */}
      <section className="relative overflow-hidden bg-[#061D42] py-16 sm:py-20 text-white border-b border-[#C08C52]/20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Statement of Faith"
            fill
            sizes="100vw"
            className="object-cover opacity-15"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061D42] via-[#061D42]/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center sm:text-left">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-300 mb-6">
            <Link href="/" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <Home className="w-3.5 h-3.5 text-[#C08C52]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link href="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#C08C52] font-bold">Statement of Faith</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-[#C08C52] bg-[#C08C52]/20 border border-[#C08C52]/40 px-3.5 py-1.5 rounded-full mb-4">
              Historic Christian Orthodoxy
            </span>
            <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight leading-tight uppercase">
              STATEMENT OF FAITH
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
              Virtual Theology Institute is firmly rooted in the historic Christian faith, confessional Protestant orthodoxy, and the supreme authority of the inerrant Word of God.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Introduction Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-[#161821] rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EAEBED] dark:border-slate-800 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#061D42] dark:text-[#C08C52]">
                Non-Denominational & Confessional
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#161821] dark:text-white font-heading">
                Our Theological Foundation
              </h2>
              <p className="text-sm text-[#57595F] dark:text-slate-300 max-w-2xl leading-relaxed">
                As a non-denominational biblical institute serving the Pakistani Christian community and Urdu-speaking believers across the globe, VTI does not promote sectarian divisions. We unite under the historic consensus of evangelical orthodoxy.
              </p>
            </div>
            <a
              href="/Virtual%20Theology%20Institute/Documents/About%20Us%20and%20Statement%20of%20Faith%20(2).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#061D42] hover:bg-[#0A2B5E] text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-md transition"
            >
              <Download className="w-4 h-4 text-[#C08C52]" />
              <span>Download Official PDF</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. The Seven Pillars Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {DOCTRINAL_PILLARS.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="bg-white dark:bg-[#161821] rounded-3xl p-6 sm:p-10 border border-[#EAEBED] dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#061D42]/30 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#061D42]/10 dark:bg-[#C08C52]/20 text-[#061D42] dark:text-[#C08C52] flex items-center justify-center font-black font-heading text-lg shrink-0">
                      {pillar.num}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#C08C52] font-urdu block" dir="rtl">
                        {pillar.urduTitle}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#161821] dark:text-white font-heading">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#EAEBED] dark:border-slate-800 flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-[#C08C52]" />
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#57595F] dark:text-slate-300 leading-relaxed font-normal">
                  {pillar.content}
                </p>

                {/* Scripture Footnotes */}
                <div className="mt-6 pt-4 border-t border-[#EAEBED] dark:border-slate-800 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#061D42] dark:text-[#C08C52] mr-2">
                    Scripture Witness:
                  </span>
                  {pillar.scriptures.map((ref) => (
                    <span
                      key={ref}
                      className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[#161821] dark:text-slate-300 border border-[#EAEBED] dark:border-slate-700"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#061D42] to-[#0A2B5E] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-black font-heading">
              Ready to Study Sound Biblical Theology?
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Explore our tuition-free courses across systematic theology, hermeneutics, and Christian living.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/courses/coming-soon"
              className="px-6 py-3.5 rounded-xl bg-[#C08C52] hover:bg-[#A8753E] text-[#061D42] font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Upcoming Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition border border-white/20 flex items-center justify-center cursor-pointer"
            >
              <span>Contact Faculty</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
