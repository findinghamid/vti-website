import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Tag,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogService } from "@/server/services/blog.service";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BlogService.getPostBySlug(slug);
  if (!post) return { title: "Post Not Found | VTI Blog" };

  return {
    title: `${post.title} | VTI Tech Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BlogService.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BlogService.getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article className="bg-[#FAF9F6] text-[#161821] min-h-screen font-sans pb-24">
      {/* Top Breadcrumb & Article Header */}
      <section className="relative bg-[#161821] text-white py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Blog Banner"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-25 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161821]/95 via-[#161821]/80 to-[#161821]/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-white/70">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition">
              Blog
            </Link>
            <span>/</span>
            <span className="text-[#FFC221] truncate max-w-xs">{post.category}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Author Meta Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0 border border-white/20">
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{post.author.name}</p>
                <p className="text-[11px] text-white/70">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-white/70">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.publishedAt}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Article Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-10">
        {/* Hero Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#161821] shadow-xl border border-[#EAEBED]">
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl border border-[#EAEBED] p-8 sm:p-12 shadow-xs space-y-6">
          <div className="prose prose-slate max-w-none text-[#55585B] text-sm sm:text-base leading-relaxed space-y-4">
            {post.content.split("\n\n").map((para, i) => {
              const trimmed = para.trim();
              if (trimmed.startsWith("# ")) {
                return (
                  <h1
                    key={i}
                    className="text-2xl sm:text-3xl font-black text-[#161821] pt-4 pb-2 tracking-tight"
                  >
                    {trimmed.replace("# ", "")}
                  </h1>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-xl sm:text-2xl font-black text-[#161821] pt-4 pb-1 tracking-tight"
                  >
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="text-lg font-bold text-[#161821] pt-2"
                  >
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote
                    key={i}
                    className="p-5 my-4 rounded-2xl bg-[#FFF6DF] border-l-4 border-[#FFC221] text-[#161821] font-medium text-sm italic"
                  >
                    {trimmed.replace("> ", "")}
                  </blockquote>
                );
              }
              if (trimmed.startsWith("```")) {
                const codeContent = trimmed
                  .replace(/```[a-z]*\n?/g, "")
                  .trim();
                return (
                  <pre
                    key={i}
                    className="p-5 rounded-2xl bg-[#161821] text-[#EAEBED] font-mono text-xs overflow-x-auto my-4 shadow-xs"
                  >
                    <code>{codeContent}</code>
                  </pre>
                );
              }
              if (trimmed.startsWith("- ")) {
                const items = trimmed.split("\n- ");
                return (
                  <ul key={i} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    {items.map((it, idx) => (
                      <li key={idx}>{it.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags & Share Strip */}
          <div className="pt-8 border-t border-[#EAEBED] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#161821] flex items-center gap-1 mr-1">
                <Tag className="w-3.5 h-3.5 text-[#FF5B35]" /> Tags:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#F8F9FA] text-[#55585B] border border-[#EAEBED]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link href="/blog">
                <Button
                  variant="outline"
                  className="text-xs font-bold border-[#EAEBED] text-[#161821] hover:bg-[#F3F4F8] rounded-xl h-9 gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
                </Button>
              </Link>
            </div>
          </div>

          {/* Faculty Author Biography Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F6] border border-[#EAEBED] flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white shrink-0 border border-[#EAEBED] shadow-xs">
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="text-base font-black text-[#161821]">{post.author.name}</h4>
                <span className="text-[10px] font-bold text-[#FF5B35] bg-[#FF5B35]/10 px-2 py-0.5 rounded-full">
                  Lead Author
                </span>
              </div>
              <p className="text-xs font-semibold text-[#8A8C90]">{post.author.role}</p>
              <p className="text-xs text-[#55585B] leading-relaxed pt-1">
                Specializing in enterprise systems, cloud scalability, and distributed software engineering. Instructor and technical mentor at VTI Marketplace.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles Strip */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#161821]">Related Articles</h3>
            <Link
              href="/blog"
              className="text-xs font-bold text-[#FF5B35] hover:text-[#E04824] transition"
            >
              View All Stories
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rPost) => (
              <article
                key={rPost.slug}
                className="bg-white rounded-2xl border border-[#EAEBED] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-[#161821] overflow-hidden">
                    <Image
                      src={rPost.thumbnailUrl}
                      alt={rPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold text-[#FF5B35] uppercase tracking-wider">
                      {rPost.category}
                    </span>
                    <h5 className="text-sm font-bold text-[#161821] group-hover:text-[#FF5B35] transition line-clamp-2 leading-snug">
                      <Link href={`/blog/${rPost.slug}`}>{rPost.title}</Link>
                    </h5>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <span className="text-[11px] text-[#8A8C90]">{rPost.publishedAt}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
