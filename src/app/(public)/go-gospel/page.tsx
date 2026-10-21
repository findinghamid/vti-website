import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import {
  Music,
  Play,
  Headphones,
  Sparkles,
  Calendar,
  Share2,
  ExternalLink,
  Heart,
  Volume2,
  BookOpen,
  ArrowRight,
  Home,
  ChevronRight,
  Radio,
} from "lucide-react";

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export const metadata: Metadata = constructMetadata({
  title: "Go Gospel | Worship & Music Ministry | VTI",
  description:
    "Go Gospel is the worship and music arm of Virtual Theology Institute (VTI), producing monthly Christ-centered Urdu worship songs and gospel releases for the global Church.",
  canonical: "/go-gospel",
});

const RELEASES = [
  {
    id: "rel-1",
    title: "Hamd-o-Sana (حمد و ثنا)",
    englishTitle: "Praise & Adoration",
    artist: "Go Gospel Collective ft. VTI Worship Team",
    month: "Current Release",
    genre: "Urdu Contemporary Worship",
    description:
      "A reverent celebration of God’s holiness, sovereignty, and unending mercies, grounded in Psalm 103.",
    thumbnail: "/assets/img/course/christian-foundational-beliefs.webp",
    youtubeUrl: "https://www.youtube.com/@GoGospelOfficial",
  },
  {
    id: "rel-2",
    title: "Masih Mera Chupan Gah (مسیح میرا چھپن گاہ)",
    englishTitle: "Christ My Hiding Place",
    artist: "Go Gospel Music",
    month: "Monthly Release",
    genre: "Acoustic Urdu Gospel",
    description:
      "A meditative prayer declaring that Christ alone is our refuge and eternal fortress in times of persecution and distress.",
    thumbnail: "/assets/img/course/course-thumb-1.jpg",
    youtubeUrl: "https://www.youtube.com/@GoGospelOfficial",
  },
  {
    id: "rel-3",
    title: "Kalam Tera Noor Hai (کلام تیرا نور ہے)",
    englishTitle: "Thy Word is a Light",
    artist: "Go Gospel Collective",
    month: "Monthly Release",
    genre: "Scripture Song / Psalmody",
    description:
      "Set to Psalm 119:105, celebrating the inerrant Word of God as an unwavering lamp unto our feet in contemporary darkness.",
    thumbnail: "/assets/img/course/principles-reading-understanding-bible.webp",
    youtubeUrl: "https://www.youtube.com/@GoGospelOfficial",
  },
];

const MINISTRY_PILLARS = [
  {
    icon: BookOpen,
    title: "Doctrinally Sound Lyrics",
    urduTitle: "بائبلی کلام پر مبنی نغمات",
    desc: "Every Go Gospel song is thoroughly reviewed by VTI theological faculty to ensure lyricism is deeply rooted in Scripture, Christ's atonement, and sound theology.",
  },
  {
    icon: Music,
    title: "Urdu Musical Heritage",
    urduTitle: "اردو موسیقی کا حسن",
    desc: "Honoring the beauty of eastern melodies and Urdu poetry while synthesizing with contemporary instrumentation to engage the youth and traditional congregations alike.",
  },
  {
    icon: Radio,
    title: "Monthly Release Commitment",
    urduTitle: "ماہانہ نغمات کا تسلسل",
    desc: "Go Gospel is committed to releasing a brand-new worship song or anthem every month to continually enrich church worship services and personal devotions.",
  },
  {
    icon: Heart,
    title: "100% Free Kingdom Ministry",
    urduTitle: "مکمل طور پر بلا معاوضہ خدمت",
    desc: "Like VTI courses, all Go Gospel audio tracks, chord charts, and music videos are provided freely to blessing churches without copyright paywalls.",
  },
];

export default function GoGospelPage() {
  return (
    <div className="w-full bg-[#F8F8FA] dark:bg-[#0A101D] min-h-screen pb-24">
      {/* 1. Breadcrumb Banner */}
      <section className="relative overflow-hidden bg-[#061D42] py-16 sm:py-24 text-white border-b border-[#C08C52]/20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Go Gospel Banner"
            fill
            sizes="100vw"
            className="object-cover opacity-15"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061D42] via-[#061D42]/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center sm:text-left">
          <nav className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-300 mb-6">
            <Link href="/" className="hover:text-white flex items-center gap-1.5 transition">
              <Home className="w-3.5 h-3.5 text-[#C08C52]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#C08C52] font-bold">Go Gospel Ministry</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C08C52]/20 border border-[#C08C52]/40 text-[#C08C52] text-xs font-black uppercase tracking-widest">
              <Music className="w-3.5 h-3.5 text-[#C08C52]" />
              <span>VTI Worship & Music Arm</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight leading-tight uppercase">
              GO GOSPEL
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
              Releasing sound biblical worship in Urdu, month after month. Go Gospel is dedicated to lifting the name of Jesus through reverent, Christ-centered music that feeds the soul and equips the Church.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <a
                href="https://www.youtube.com/@GoGospelOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#E62117] hover:bg-[#c9180f] text-white font-extrabold text-xs transition shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <YoutubeIcon className="w-4 h-4 fill-white" />
                <span>Subscribe on YouTube</span>
              </a>
              <Link
                href="/courses/coming-soon"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Study Biblical Theology</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C08C52]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Release Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white dark:bg-[#161821] rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#EAEBED] dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Release Visual */}
            <div className="lg:col-span-5 relative aspect-square sm:aspect-video lg:aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-[#EAEBED] dark:border-slate-800 shadow-md">
              <Image
                src="/assets/img/course/christian-foundational-beliefs.webp"
                alt="Latest Go Gospel Release"
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061D42]/90 via-black/30 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#C08C52] text-[#061D42] shadow-sm">
                  Monthly Feature
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href="https://www.youtube.com/@GoGospelOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-[#C08C52] text-[#061D42] flex items-center justify-center shadow-xl hover:scale-110 transition duration-300 cursor-pointer"
                  title="Watch on YouTube"
                >
                  <Play className="w-7 h-7 fill-[#061D42] ml-1" />
                </a>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] text-[#C08C52] font-semibold block">Monthly Song Release</span>
                <h3 className="text-lg font-bold font-heading">Hamd-o-Sana (حمد و ثنا)</h3>
              </div>
            </div>

            {/* Right: Release Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#09BD3C] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#09BD3C]">
                  Official Monthly Song Release
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-[#161821] dark:text-white font-heading">
                Hamd-o-Sana — حمد و ثنا
              </h2>

              <p className="text-sm text-[#57595F] dark:text-slate-300 leading-relaxed">
                Written and composed by the Go Gospel Music team, “Hamd-o-Sana” is a reverent call to praise rooted in Psalm 103:1 — <em>“Barkat de ae meri jaan Khudawand ko, aur jo kuch mujh mein hai uske quddoos naam ko.”</em> Produced with acoustic guitars, eastern flute, and rich vocal harmonies.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#EAEBED] dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-[#061D42] dark:text-[#C08C52] uppercase tracking-wider block">
                  Lyrics Preview (اردو بول)
                </span>
                <p className="text-sm font-urdu text-[#161821] dark:text-slate-200 leading-relaxed" dir="rtl">
                  حمد و ثنا ہو تیری، اے میرے قدوس خداوند <br />
                  تو ہی ہے میری چٹان، تو ہی ہے میرا سہارا
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="https://www.youtube.com/@GoGospelOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#061D42] hover:bg-[#0A2B5E] text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <YoutubeIcon className="w-4 h-4 text-[#E62117]" />
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="https://chat.whatsapp.com/invite/vti-theology-cohort"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span>Request Lyrics & Chords</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Monthly Releases Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#C08C52]">
              Monthly Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#161821] dark:text-white font-heading">
              Recent Worship Releases
            </h2>
            <p className="text-sm text-[#57595F] dark:text-slate-400 mt-1">
              Listen to the latest gospel tracks produced by Virtual Theology Institute’s music ministry.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@GoGospelOfficial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#061D42] dark:text-[#C08C52] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Visit YouTube Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {RELEASES.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#161821] rounded-3xl border border-[#EAEBED] dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#061D42]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#061D42]/90 text-white backdrop-blur-xs">
                    {item.genre}
                  </span>
                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#C08C52] text-[#061D42] flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-200">
                      <Play className="w-5 h-5 fill-[#061D42] ml-0.5" />
                    </div>
                  </a>
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-[11px] font-bold text-[#C08C52] uppercase tracking-wider block">
                    {item.month}
                  </span>
                  <h3 className="text-lg font-bold text-[#161821] dark:text-white font-heading">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#57595F] dark:text-slate-400 font-semibold">
                    {item.artist}
                  </p>
                  <p className="text-xs text-[#57595F] dark:text-slate-400 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#EAEBED] dark:border-slate-800 flex items-center justify-between">
                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#061D42] hover:bg-[#0A2B5E] transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <YoutubeIcon className="w-4 h-4 text-[#E62117]" />
                    <span>Listen on YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Ministry Philosophy Pillars */}
      <section className="bg-white dark:bg-[#111A2E] py-20 border-y border-[#EAEBED] dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#C08C52]">
              Ministry Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-[#161821] dark:text-white">
              Why We Create Worship Music
            </h2>
            <p className="text-sm text-[#57595F] dark:text-slate-400">
              Theology and doxology belong together. What we study in biblical doctrine must overflow into reverent praise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MINISTRY_PILLARS.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAF9F6] dark:bg-[#161821] rounded-2xl p-6 border border-[#EAEBED] dark:border-slate-800 shadow-xs hover:border-[#061D42]/30 transition duration-200 space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#061D42]/10 dark:bg-[#C08C52]/20 text-[#061D42] dark:text-[#C08C52] flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#C08C52] font-urdu block mb-0.5" dir="rtl">
                      {pillar.urduTitle}
                    </span>
                    <h3 className="text-base font-bold text-[#161821] dark:text-white font-heading">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#57595F] dark:text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-gradient-to-r from-[#061D42] to-[#0A2B5E] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C08C52]">
              Join the Movement
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading">
              Support & Share Go Gospel Worship
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Subscribe to the official Go Gospel YouTube channel to receive notifications for our monthly releases, acoustic worship sessions, and chord charts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://www.youtube.com/@GoGospelOfficial"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#E62117] hover:bg-[#c9180f] text-white font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <YoutubeIcon className="w-4 h-4 fill-white" />
              <span>Subscribe on YouTube</span>
            </a>
            <Link
              href="/courses"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition border border-white/20 flex items-center justify-center cursor-pointer"
            >
              <span>Explore VTI Courses</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
