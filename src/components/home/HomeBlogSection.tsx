import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Tag, Sparkles } from "lucide-react";
import { SectionHeading, VtiButton } from "@/components/ui/vti";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  image: string;
  excerpt?: string;
}

const FEATURED_POST: BlogPost = {
  id: "blog-1",
  title: "The Unfailing Authority of Scripture: Sola Scriptura and the Church Today",
  slug: "authority-of-scripture-sola-scriptura",
  category: "Systematic Theology",
  date: "September 15, 2026",
  image: "/assets/img/hero/home-12/blog/blog-thumb-1.jpg",
  excerpt:
    "An examination of the historic Christian doctrine of biblical authority, inerrancy, and how the ecumenical creeds safeguard the gospel message against contemporary theological drifts.",
};

const SIDE_POSTS: BlogPost[] = [
  {
    id: "blog-2",
    title: "The Importance of Koine Greek in Expository Preaching",
    slug: "importance-of-koine-greek-expository-preaching",
    category: "Biblical Languages",
    date: "September 10, 2026",
    image: "/assets/img/hero/home-12/blog/blog-thumb-2.jpg",
  },
  {
    id: "blog-3",
    title: "The Early Church & The Nicene Creed (325 AD): Defending the Deity of Christ",
    slug: "early-church-council-of-nicaea",
    category: "Church History",
    date: "September 05, 2026",
    image: "/assets/img/hero/home-12/blog/blog-thumb-3.jpg",
  },
  {
    id: "blog-4",
    title: "Defending the Resurrection: Historical Evidences for the Empty Tomb",
    slug: "defending-the-resurrection-historical-evidences",
    category: "Apologetics",
    date: "August 28, 2026",
    image: "/assets/img/hero/home-12/blog/blog-thumb-4.jpg",
  },
];

export function HomeBlogSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <SectionHeading
              subtitle="Theological Papers & Articles"
              title="Insights from Seminary Faculty"
            />
            <p className="mt-2 text-sm text-[#57595F] max-w-lg">
              Scholarly commentary, exegetical briefs, and pastoral reflections grounded in historic Christian orthodoxy.
            </p>
          </div>

          <div className="self-start sm:self-auto shrink-0">
            <VtiButton href="/blog" variant="border" size="md" showArrow>
              View All Articles
            </VtiButton>
          </div>
        </div>

        {/* 2-Column Blog Layout (index-12.html: 1 Featured + 3 Horizontal) - STRICTLY NO BUTTERFLIES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 1 Featured Large Card () */}
          <div className="lg:col-span-6">
            <div className="group relative flex flex-col rounded-3xl bg-[#F8F8FA] border border-[#EAEBED] shadow-sm hover:shadow-xl hover:border-[#FF5B35]/30 transition-all duration-300 overflow-hidden">
              {/* Featured Image */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
                <Link href={`/blog/${FEATURED_POST.slug}`} className="block relative w-full h-full">
                  <Image
                    src={FEATURED_POST.image}
                    alt={FEATURED_POST.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
                </Link>
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-[#57595F] mb-3">
                    <span className="text-[#FF5B35] bg-[#FF5B35]/10 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px]">
                      {FEATURED_POST.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {FEATURED_POST.date}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#161821] font-heading leading-tight group-hover:text-[#FF5B35] transition duration-200">
                    <Link href={`/blog/${FEATURED_POST.slug}`}>
                      {FEATURED_POST.title}
                    </Link>
                  </h3>

                  <p className="mt-3 text-sm text-[#57595F] leading-relaxed line-clamp-3">
                    {FEATURED_POST.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EAEBED]">
                  <Link
                    href={`/blog/${FEATURED_POST.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5B35] group-hover:text-[#4359D9] transition duration-200"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Horizontal Cards () */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {SIDE_POSTS.map((post) => (
              <div
                key={post.id}
                className="group relative flex flex-col sm:flex-row items-center p-4 sm:p-5 rounded-3xl bg-[#F8F8FA] border border-[#EAEBED] shadow-xs hover:shadow-lg hover:border-[#FF5B35]/30 hover:bg-white transition-all duration-300 gap-5"
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-44 h-36 rounded-2xl overflow-hidden bg-slate-900 shrink-0">
                  <Link href={`/blog/${post.slug}`} className="block relative w-full h-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-[#57595F] mb-2">
                      <span className="text-[#09BD3C] bg-[#09BD3C]/10 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px]">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#161821] font-heading leading-snug line-clamp-2 group-hover:text-[#FF5B35] transition duration-200">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h4>
                  </div>

                  <div className="mt-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5B35] group-hover:text-[#4359D9] transition duration-200"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
