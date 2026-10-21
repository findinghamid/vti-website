import React from "react";
import Link from "next/link";
import { BundleService } from "@/server/services/bundle.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Sparkles, CheckCircle2, ArrowRight, Star } from "lucide-react";

export const metadata = {
  title: "Curated Course Bundles | VTI Marketplace LMS",
  description: "Accelerate your career with bundled learning tracks. Save up to 38% on multi-course bundles.",
};

export default async function BundlesPage() {
  const bundles = await BundleService.getAllBundles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> High-Value Curated Bundles
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
          Complete Skill Tracks. <span className="text-violet-600 dark:text-violet-400">Bundled Savings.</span>
        </h1>
        <p className="text-base text-muted-foreground">
          Hand-curated course collections designed by industry cloud architects. Learn end-to-end architectures and save up to 40% compared to standalone purchases.
        </p>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {bundles.map((bundle) => (
          <Card
            key={bundle.id}
            className="border-border hover:border-violet-400/80 transition-all duration-200 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Header with image & savings tag */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                {bundle.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bundle.thumbnailUrl}
                    alt={bundle.title}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                    SAVE {bundle.savingsPercent}%
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-300">
                    <Layers className="w-4 h-4" />
                    <span>{bundle.coursesCount} Complete Courses Included</span>
                  </div>
                  <h2 className="text-xl font-black text-white mt-1 line-clamp-1">
                    {bundle.title}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <CardContent className="p-6 space-y-5">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {bundle.description}
                </p>

                {/* Included Courses Preview */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Included in this Track:
                  </span>
                  <div className="space-y-2">
                    {bundle.courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-2.5 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-foreground truncate">
                            {course.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-muted-foreground shrink-0">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{course.averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>

            {/* Footer Pricing & CTA */}
            <div className="p-6 pt-0 border-t border-border mt-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-foreground">
                    ${(bundle.bundlePriceMinor / 100).toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through font-semibold">
                    ${(bundle.totalStandalonePriceMinor / 100).toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  You save ${(bundle.savingsMinor / 100).toFixed(2)} USD
                </div>
              </div>

              <Link href={`/bundles/${bundle.slug}`}>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs gap-1.5 px-4 shadow-sm">
                  View Bundle <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
