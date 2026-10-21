"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryOption {
  id: string;
  name: string;
  subcategories: Array<{ id: string; name: string }>;
}

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/v1/categories");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setCategories(json.data.categories || []);
            if (json.data.categories && json.data.categories.length > 0) {
              setCategoryId(json.data.categories[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Failed loading categories:", err);
      }
    }
    loadCategories();
  }, []);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 5) {
      setError("Course title must be at least 5 characters long");
      return;
    }
    if (!categoryId) {
      setError("Please select a category for your course");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/v1/instructor/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          categoryId,
          subcategoryId: subcategoryId || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to create course");
      }

      // Redirect directly to the course authoring studio
      router.push(`/instructor/courses/${json.data.id}/manage`);
    } catch (err: any) {
      setError(err.message || "Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Back link */}
      <Link
        href="/instructor/courses"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#55585B] hover:text-[#0E101A] mb-6 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to courses
      </Link>

      <div className="bg-white border border-[#EAEBED] rounded-[24px] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 text-[#FF5B35] mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">New Course Draft</span>
        </div>

        <h1 className="text-2xl font-black text-[#0E101A] tracking-tight">
          How about a working title?
        </h1>
        <p className="text-xs sm:text-sm text-[#55585B] mt-1">
          It&apos;s okay if you can&apos;t think of a good title now. You can change it at any time in the course builder.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0E101A]">Course Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Learn Ethical Hacking From Scratch 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-4 py-2.5 border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5B35] focus:bg-white transition"
            />
            <p className="text-[11px] text-[#55585B]">At least 5 characters. Catchy, clear, and descriptive.</p>
          </div>

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0E101A]">Primary Category</label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubcategoryId("");
              }}
              className="w-full text-sm px-4 py-2.5 border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5B35] focus:bg-white transition font-medium"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Select (Optional) */}
          {selectedCategory && selectedCategory.subcategories.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0E101A]">Subcategory (Optional)</label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="w-full text-sm px-4 py-2.5 border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5B35] focus:bg-white transition font-medium"
              >
                <option value="">Select a subcategory...</option>
                {selectedCategory.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-[#EAEBED]">
            <Link href="/instructor/courses">
              <Button type="button" variant="ghost" size="sm" className="text-[#55585B] hover:text-[#0E101A]">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="bg-[#FF5B35] hover:bg-[#3b50df] text-white font-bold px-6 rounded-xl shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Draft...
                </>
              ) : (
                "Continue to Course Builder"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
