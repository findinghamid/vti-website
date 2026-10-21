import React from "react";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCategoriesSection } from "@/components/home/HomeCategoriesSection";
import { HomeCoursesSection } from "@/components/home/HomeCoursesSection";
import { HomeFeaturesSection } from "@/components/home/HomeFeaturesSection";
import { HomeInquiryForm } from "@/components/home/HomeInquiryForm";
import { HomeTestimonialsSection } from "@/components/home/HomeTestimonialsSection";
import { HomeBlogSection } from "@/components/home/HomeBlogSection";
import { getAllVtiCourses } from "@/server/services/vti-catalog";

export const revalidate = 3600; // Cache for 1 hour

export default async function HomePage() {
  const courses = getAllVtiCourses();

  return (
    <div className="w-full overflow-hidden">
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Top Categories / 4 Faculties */}
      <HomeCategoriesSection />

      {/* 3. Authentic VTI Courses with Progress Bars & Coming Soon Badges */}
      <HomeCoursesSection initialCourses={courses} />

      {/* 4. Platform Features & Value-Props */}
      <HomeFeaturesSection />

      {/* 5. Inquiries & Admissions */}
      <HomeInquiryForm />

      {/* 6. Convictions & Testimonials */}
      <HomeTestimonialsSection />

      {/* 7. Theological Articles & Outlines */}
      <HomeBlogSection />
    </div>
  );
}
