import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CourseSearchService } from "@/server/services/search.service";
import { CourseCatalogView } from "@/components/marketplace/CourseCatalogView";
import { CourseCardData } from "@/components/marketplace/CourseCard";
import { CourseLevel } from "@prisma/client";
import { Home, ChevronRight } from "lucide-react";

interface CoursesPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    subcategory?: string;
    topic?: string;
    level?: string;
    price?: "all" | "free" | "paid";
    rating?: string;
    sort?: any;
    page?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedParams = await searchParams;

  const query = resolvedParams.q ?? undefined;
  const categorySlug = resolvedParams.category ?? undefined;
  const subcategorySlug = resolvedParams.subcategory ?? undefined;
  const topicSlug = resolvedParams.topic ?? undefined;
  const level = (resolvedParams.level as CourseLevel) ?? undefined;
  const priceType = resolvedParams.price ?? undefined;
  const minRating = resolvedParams.rating ? parseFloat(resolvedParams.rating) : undefined;
  const sort = resolvedParams.sort ?? "relevance";
  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;

  const { courses, pagination, facets } = await CourseSearchService.searchCourses({
    query,
    categorySlug,
    subcategorySlug,
    topicSlug,
    level,
    priceType,
    minRating,
    sort,
    page,
    limit: 12,
  });

  return (
    <div className="w-full pb-20 bg-[#F8F8FA] dark:bg-[#0A101D] min-h-screen">
      {/* 1. VTI Breadcrumb Banner (course-with-sidebar.html ) */}
      <section className="relative overflow-hidden bg-[#161821] py-14 sm:py-18 text-white mb-10 border-b border-slate-800">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Course Catalog Breadcrumb"
            fill
            sizes="100vw"
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161821] via-[#161821]/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation List */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-4">
            <Link href="/" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <Home className="w-3.5 h-3.5 text-[#FF5B35]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#FF5B35] font-bold">Courses</span>
            {categorySlug && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-white capitalize">{categorySlug.replace("-", " ")}</span>
              </>
            )}
          </nav>

          {/* Banner Title */}
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-tight">
            {query ? `Results for "${query}"` : "Explore Free Theological Courses"}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Study systematic theology, biblical exegesis, original Greek & Hebrew, and pastoral ministry with academic rigor—100% tuition-free.
          </p>
        </div>
      </section>

      {/* 2. Course Catalog Controls & Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-slate-500">Loading catalog...</div>}>
          <CourseCatalogView
            courses={courses as unknown as CourseCardData[]}
            pagination={pagination}
            facets={facets}
          />
        </Suspense>
      </div>
    </div>
  );
}
