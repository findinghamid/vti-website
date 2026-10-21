"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { WishlistItemDetail } from "@/server/services/wishlist.service";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItemDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const { openDrawer, refreshCart } = useCart();

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/wishlist");
      const data = await res.json();
      if (data.success && data.data?.items) {
        setItems(data.data.items);
      }
    } catch (e) {
      console.error("Failed fetching wishlist", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (courseId: string) => {
    try {
      setItems((prev) => prev.filter((i) => i.courseId !== courseId));
      await fetch(`/api/v1/wishlist/${courseId}`, { method: "DELETE" });
      setNotification("Removed course from your wishlist.");
      setTimeout(() => setNotification(null), 3000);
    } catch {
      fetchWishlist();
    }
  };

  const handleMoveToCart = async (courseId: string) => {
    try {
      const res = await fetch("/api/v1/wishlist/move-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();

      if (data.success) {
        setItems((prev) => prev.filter((i) => i.courseId !== courseId));
        setNotification(data.data?.message || "Course moved to cart!");
        setTimeout(() => setNotification(null), 3500);
        await refreshCart();
        openDrawer();
      }
    } catch {
      setNotification("Failed to move course to cart.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#EAEBED]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#161821] tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[#55585B] mt-1">
            {items.length} {items.length === 1 ? "course" : "courses"} saved to purchase later.
          </p>
        </div>

        <Link href="/courses">
          <Button
            variant="outline"
            className="font-bold text-xs gap-1.5 border-[#EAEBED] hover:bg-[#F3F4F8] text-[#161821] rounded-xl h-10 px-4"
          >
            <span>Explore More Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 rounded-xl bg-[#E8F8EE] border border-[#09BD3C]/20 text-[#09BD3C] flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Wishlist Grid or Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#EAEBED] bg-white p-4 space-y-3 animate-pulse"
            >
              <div className="aspect-video bg-[#F3F4F8] rounded-xl" />
              <div className="h-4 bg-[#F3F4F8] rounded w-3/4" />
              <div className="h-3 bg-[#F3F4F8] rounded w-1/2" />
              <div className="h-8 bg-[#F3F4F8] rounded w-full mt-4" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-[#EAEBED] bg-white p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FFF2F2] text-[#FF4A55] mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#161821]">Your wishlist is empty</h2>
            <p className="text-xs text-[#55585B] max-w-sm mx-auto">
              Explore our marketplace catalog and click the wishlist heart on any course you want to save for later.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/courses">
              <Button className="font-bold text-xs h-10 px-6 bg-[#FF5B35] hover:bg-[#E04824] text-white rounded-xl shadow-xs">
                Discover Courses
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ id, courseId, course }) => (
            <div
              key={id}
              className="rounded-2xl border border-[#EAEBED] bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video w-full bg-[#161821] overflow-hidden">
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 350px"
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E2235] to-[#161821] flex items-center justify-center text-[#FF5B35] font-bold text-sm">
                      VTI Course
                    </div>
                  )}

                  <button
                    onClick={() => handleRemove(courseId)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/50 text-white/90 hover:text-[#FF4A55] hover:bg-black/80 flex items-center justify-center transition cursor-pointer backdrop-blur-xs"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F3F4F8] text-[#55585B]">
                    {course.level.replace("_", " ")}
                  </span>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="block font-bold text-sm text-[#161821] hover:text-[#FF5B35] transition line-clamp-2 leading-snug"
                  >
                    {course.title}
                  </Link>

                  {course.instructors.length > 0 && (
                    <p className="text-xs text-[#55585B] truncate">
                      By {course.instructors[0].name}
                    </p>
                  )}

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-black text-[#161821]">
                      {course.formattedPrice}
                    </span>
                    {course.formattedOriginalPrice && (
                      <span className="text-xs text-[#8A8C90] line-through">
                        {course.formattedOriginalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="p-5 pt-0">
                <Button
                  onClick={() => handleMoveToCart(courseId)}
                  className="w-full font-bold text-xs h-10 flex items-center justify-center gap-2 bg-[#FF5B35] hover:bg-[#E04824] text-white rounded-xl shadow-xs cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Move to Cart</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
