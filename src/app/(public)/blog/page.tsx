import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Tag,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { BlogService } from "@/server/services/blog.service";

export const metadata = {
  title: "Theological Papers & Articles | Virtual Theological Institute (VTI)",
  description:
    "Explore scholarly essays on Systematic Theology, Biblical Hermeneutics, Church History, and Pastoral Ministry from VTI seminary faculty.",
};

export default function BlogListingPage() {
  const posts = BlogService.getAllPosts();
  const featured = BlogService.getFeaturedPost();
  const categories = BlogService.getCategories();
  const recentPosts = BlogService.getRecentPosts(4);
  const tags = BlogService.getAllTags();

  return (
    <div className="bg-[#FAF9F6] text-[#161821] min-h-screen font-sans pb-20">
      {/* VTI Breadcrumb & Header Banner */}
      <section className="relative bg-[#161821] text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Blog Banner"
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
            <span className="text-[#FFC221]">Faculty Papers & Articles</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Theological Insights & Biblical Studies
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
            Discover in-depth exegetical papers, historical theology briefs, and pastoral reflections grounded in God&apos;s holy Word.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Featured Story Hero Banner matching  */}
        {featured && (
          <div className="bg-white rounded-3xl border border-[#EAEBED] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 mb-14 group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[320px] bg-[#161821] overflow-hidden">
                <Image
                  src={featured.thumbnailUrl}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#FF5B35] text-white shadow-sm">
                    {featured.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6200] bg-[#FFF6DF] px-3 py-1 rounded-full border border-[#FBEAC3]">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC221]" /> Editor&apos;s Featured Pick
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-black text-[#161821] group-hover:text-[#FF5B35] transition leading-tight">
                    <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#55585B] line-clamp-3 leading-relaxed">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAEBED] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#F3F4F8] shrink-0 border border-[#EAEBED]">
                      <Image
                        src={featured.author.avatarUrl}
                        alt={featured.author.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#161821]">{featured.author.name}</p>
                      <p className="text-[11px] text-[#8A8C90]">{featured.publishedAt}</p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5B35] hover:text-[#E04824] transition"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Content Layout (Articles + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Articles Stream (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAEBED]">
              <h3 className="text-xl font-black text-[#161821]">Latest Articles</h3>
              <span className="text-xs font-bold text-[#55585B]">
                Showing {posts.length} stories
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-[#EAEBED] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] w-full bg-[#161821] overflow-hidden">
                      <Image
                        src={post.thumbnailUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-[#161821] shadow-xs">
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-[11px] text-[#8A8C90]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{post.publishedAt}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#161821] group-hover:text-[#FF5B35] transition line-clamp-2 leading-snug">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h4>

                      <p className="text-xs text-[#55585B] line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Author Bar */}
                  <div className="p-6 pt-0 border-t border-[#EAEBED] mt-4 flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden bg-[#F3F4F8] shrink-0 border border-[#EAEBED]">
                        <Image
                          src={post.author.avatarUrl}
                          alt={post.author.name}
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#161821] truncate max-w-[130px]">
                        {post.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-[#FF5B35] hover:text-[#E04824] flex items-center gap-1 transition"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Sidebar (4 cols) matching VTI sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Search Widget */}
            <div className="bg-white rounded-2xl border border-[#EAEBED] p-6 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-[#161821]">Search Stories</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles & topics..."
                  className="w-full h-11 pl-4 pr-10 text-xs font-medium text-[#161821] bg-[#F8F9FA] border border-[#EAEBED] rounded-xl focus:border-[#FF5B35] focus:bg-white focus:outline-none transition"
                />
                <Search className="w-4 h-4 text-[#8A8C90] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white rounded-2xl border border-[#EAEBED] p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-[#161821] pb-3 border-b border-[#EAEBED]">
                Explore Categories
              </h4>
              <ul className="space-y-2 text-xs">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={`/blog?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg text-[#55585B] hover:text-[#FF5B35] hover:bg-[#F8F9FA] font-medium transition"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] font-bold text-[#8A8C90] bg-[#F3F4F8] px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-white rounded-2xl border border-[#EAEBED] p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-[#161821] pb-3 border-b border-[#EAEBED]">
                Recent Stories
              </h4>
              <div className="space-y-4">
                {recentPosts.map((rPost) => (
                  <div key={rPost.slug} className="flex gap-3 group">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#161821] shrink-0">
                      <Image
                        src={rPost.thumbnailUrl}
                        alt={rPost.title}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-[#8A8C90]">
                        {rPost.publishedAt}
                      </span>
                      <h5 className="text-xs font-bold text-[#161821] group-hover:text-[#FF5B35] transition line-clamp-2 leading-snug">
                        <Link href={`/blog/${rPost.slug}`}>{rPost.title}</Link>
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Cloud Widget */}
            <div className="bg-white rounded-2xl border border-[#EAEBED] p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-[#161821] pb-3 border-b border-[#EAEBED]">
                Popular Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-[11px] font-semibold text-[#55585B] bg-[#F8F9FA] hover:bg-[#FF5B35] hover:text-white px-3 py-1.5 rounded-lg border border-[#EAEBED] transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
