import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TaxonomyService } from "@/server/services/taxonomy.service";
import { CourseSearchService } from "@/server/services/search.service";
import { CourseCard, CourseCardData } from "@/components/marketplace/CourseCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ArrowLeft, BookOpen } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  let category;
  try {
    category = await TaxonomyService.getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  const { courses, pagination } = await CourseSearchService.searchCourses({
    categorySlug: slug,
    limit: 12,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Courses
      </Link>

      <div className="mb-8 pb-6 border-b border-border">
        <h1 className="text-3xl font-black text-foreground">{category.name} Courses</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Master in-demand skills in {category.name} from industry leading educators.
        </p>

        {/* Subcategory Chips */}
        {category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/courses?subcategory=${sub.slug}`}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary hover:bg-primary hover:text-white transition cursor-pointer"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course as unknown as CourseCardData} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={`No Courses in ${category.name} Yet`}
          description="Courses in this category are currently under authoring in the Instructor Studio."
          actionLabel="Explore Other Courses"
          actionHref="/courses"
        />
      )}
    </div>
  );
}
