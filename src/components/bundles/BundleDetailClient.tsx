"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BundleItem } from "@/server/services/bundle.service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Star,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface BundleDetailClientProps {
  bundle: BundleItem;
}

export function BundleDetailClient({ bundle }: BundleDetailClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleEnroll = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/bundles/${bundle.slug}/enroll`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to purchase bundle.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/student/learning");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/bundles" className="hover:text-foreground">Bundles</Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-xs">{bundle.title}</span>
      </div>

      {/* Main Layout Grid: Left Content (2 cols), Right Checkout Box (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Details & Member Courses */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Save {bundle.savingsPercent}% with this Collection
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {bundle.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {bundle.description}
            </p>
          </div>

          {/* Included Courses Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Included Courses ({bundle.coursesCount})
              </h2>
              <span className="text-xs font-semibold text-muted-foreground">
                All course updates & lifetime access included
              </span>
            </div>

            <div className="space-y-4">
              {bundle.courses.map((course, idx) => (
                <Card key={course.id} className="border-border hover:border-violet-300 transition overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-violet-600/10 text-violet-600 font-black text-sm flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition line-clamp-1"
                        >
                          {course.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>Instructor: <strong className="text-foreground">{course.instructorName}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-bold text-foreground">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {course.averageRating.toFixed(1)}
                          </span>
                          <span>•</span>
                          <span>{course.level}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                      <span className="text-xs text-muted-foreground">Standalone price:</span>
                      <span className="font-bold text-sm text-foreground">
                        ${(course.priceAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Value Guarantee */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-border rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> VTI Commercial Bundle Guarantee
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Lifetime access to all included courses
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verifiable completion certificates for each course
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Full sandbox coding exercises & quizzes
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Direct instructor Q&A access
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Pricing Summary Box */}
        <div>
          <Card className="border-violet-300 dark:border-violet-800 shadow-xl rounded-2xl sticky top-8 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-orange-600 p-6 text-white text-center">
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                Instant Multi-Course Enrollment
              </span>
              <div className="flex items-baseline justify-center gap-2 mt-2">
                <span className="text-4xl font-black">
                  ${(bundle.bundlePriceMinor / 100).toFixed(2)}
                </span>
                <span className="text-sm line-through opacity-75">
                  ${(bundle.totalStandalonePriceMinor / 100).toFixed(2)}
                </span>
              </div>
              <div className="text-xs font-bold text-emerald-300 mt-1">
                Save ${(bundle.savingsMinor / 100).toFixed(2)} USD ({bundle.savingsPercent}% OFF)
              </div>
            </div>

            <CardContent className="p-6 space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Enrolled! Redirecting to student dashboard...</span>
                </div>
              )}

              <div className="space-y-2 text-xs divide-y divide-border">
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Individual courses total:</span>
                  <span className="font-semibold text-foreground">
                    ${(bundle.totalStandalonePriceMinor / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Bundle discount savings:</span>
                  <span>-${(bundle.savingsMinor / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-black text-foreground">
                  <span>Total Due Today:</span>
                  <span className="text-violet-600 dark:text-violet-400">
                    ${(bundle.bundlePriceMinor / 100).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <Button
                onClick={handleEnroll}
                disabled={loading || success}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm h-12 shadow-lg shadow-violet-500/25"
              >
                {loading
                  ? "Processing Enrollment..."
                  : `Enroll in All ${bundle.coursesCount} Courses Now`}
              </Button>

              <p className="text-[11px] text-center text-muted-foreground">
                One-time payment • Immediate access to all member courses
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
