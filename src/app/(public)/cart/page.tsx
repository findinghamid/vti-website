"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Heart,
  Tag,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { VtiButton, VtiBadge, SectionHeading } from "@/components/ui/vti";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    breakdown,
    appliedCouponCode,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    isLoading,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponStatus, setCouponStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    setCouponStatus({ type: null, message: "" });
    const result = await applyCoupon(inputCoupon);
    if (result.success) {
      setCouponStatus({ type: "success", message: result.message });
      setInputCoupon("");
    } else {
      setCouponStatus({ type: "error", message: result.message });
    }
  };

  const handleQuickApplyCoupon = async (code: string) => {
    setCouponStatus({ type: null, message: "" });
    const result = await applyCoupon(code);
    if (result.success) {
      setCouponStatus({ type: "success", message: result.message });
    } else {
      setCouponStatus({ type: "error", message: result.message });
    }
  };

  const handleSaveToWishlist = async (courseId: string) => {
    try {
      const res = await fetch("/api/v1/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (data.success) {
        await removeFromCart(courseId);
        setActionMessage("Course moved to your wishlist!");
        setTimeout(() => setActionMessage(null), 3500);
      }
    } catch {
      setActionMessage("Could not move to wishlist.");
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  // Bonus milestone calculation ($50 threshold)
  const totalAmountDollars = breakdown ? breakdown.totalMinor / 100 : 0;
  const targetThreshold = 50;
  const progressPercent = Math.min(100, Math.round((totalAmountDollars / targetThreshold) * 100));
  const isGoalReached = totalAmountDollars >= targetThreshold;

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* 1. VTI Breadcrumb Area () */}
      <section className="relative py-16 bg-[#161821] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Breadcrumb Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Breadcrumb links */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-[#FF5B35]">Shopping Cart</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white">
              My Shopping Cart
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-md">
              Review selected tracks, apply promotional coupons, and proceed to instant enrollment.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Cart Content Area (VTI ) */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Action Message Alert */}
          {actionMessage && (
            <div className="mb-8 p-4 rounded-2xl bg-[#09BD3C]/10 border border-[#09BD3C]/30 text-[#09BD3C] flex items-center gap-3 text-sm font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          {items.length === 0 ? (
            /* Empty Cart View */
            <div className="py-16 max-w-md mx-auto text-center space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-[#FF5B35]/10 text-[#FF5B35] flex items-center justify-center mx-auto shadow-sm">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#161821]">
                Your Cart is Currently Empty
              </h2>
              <p className="text-sm text-[#57595F] leading-relaxed">
                You haven&apos;t added any courses to your shopping cart yet. Explore our verified engineering curriculums to get started.
              </p>
              <div className="pt-2">
                <VtiButton href="/courses" variant="primary" size="lg" showArrow>
                  Explore Course Catalog
                </VtiButton>
              </div>
            </div>
          ) : (
            /* Active Cart Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Cart Items Table (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="rounded-3xl border border-[#EAEBED] bg-white shadow-xs overflow-hidden">
                  {/* Table Header (hidden on mobile) */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-[#F8F8FA] border-b border-[#EAEBED] text-xs font-bold uppercase tracking-wider text-[#57595F]">
                    <div className="col-span-6">Course Product</div>
                    <div className="col-span-3 text-center">Price</div>
                    <div className="col-span-3 text-right">Actions</div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-[#EAEBED]">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:items-center hover:bg-slate-50/50 transition duration-150"
                      >
                        {/* Course Product Details (Col-6) */}
                        <div className="sm:col-span-6 flex items-center gap-4">
                          <div className="relative w-24 h-18 sm:w-28 sm:h-20 rounded-2xl overflow-hidden bg-slate-900 shrink-0">
                            {item.thumbnailUrl ? (
                              <Image
                                src={item.thumbnailUrl}
                                alt={item.title}
                                fill
                                sizes="(max-width: 640px) 96px, 112px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#FF5B35] to-indigo-900 flex items-center justify-center text-white font-bold text-xs">
                                VTI
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/courses/${item.slug}`}
                              className="text-sm font-bold text-[#161821] hover:text-[#FF5B35] transition duration-150 font-heading line-clamp-2 leading-snug"
                            >
                              {item.title}
                            </Link>
                            {item.instructors && item.instructors.length > 0 && (
                              <p className="text-xs text-[#57595F] mt-1 truncate">
                                Instructor: <strong className="text-[#161821] font-semibold">{item.instructors[0].name}</strong>
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#FF5B35]/10 text-[#FF5B35] px-2 py-0.5 rounded">
                                Lifetime Access
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price (Col-3) */}
                        <div className="sm:col-span-3 sm:text-center flex sm:flex-col items-baseline sm:items-center justify-between sm:justify-center gap-1.5">
                          <span className="text-xs text-[#57595F] sm:hidden font-medium">Price:</span>
                          <div className="flex items-baseline gap-2">
                            {item.formattedOriginalPrice && (
                              <span className="text-xs text-[#57595F] line-through">
                                {item.formattedOriginalPrice}
                              </span>
                            )}
                            <span className="text-base sm:text-lg font-black text-[#161821] font-heading">
                              {item.formattedPrice}
                            </span>
                          </div>
                        </div>

                        {/* Actions (Col-3) */}
                        <div className="sm:col-span-3 flex items-center justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAEBED]">
                          <button
                            type="button"
                            onClick={() => handleSaveToWishlist(item.courseId)}
                            className="p-2 rounded-xl text-[#57595F] hover:text-[#FF7162] hover:bg-[#FF7162]/10 transition cursor-pointer"
                            title="Move to Wishlist"
                          >
                            <Heart className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.courseId)}
                            disabled={isLoading}
                            className="p-2 rounded-xl text-[#57595F] hover:text-[#FF4D4F] hover:bg-[#FF4D4F]/10 transition cursor-pointer"
                            title="Remove Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Table Footer: Clear Cart Action */}
                  <div className="px-6 py-4 bg-[#F8F8FA] border-t border-[#EAEBED] flex items-center justify-between">
                    <Link
                      href="/courses"
                      className="text-xs font-bold text-[#FF5B35] hover:underline"
                    >
                      ← Continue Browsing Courses
                    </Link>

                    <button
                      type="button"
                      onClick={() => clearCart()}
                      disabled={isLoading}
                      className="text-xs font-bold text-[#FF4D4F] hover:underline cursor-pointer"
                    >
                      Clear All Items
                    </button>
                  </div>
                </div>

                {/* Coupon Code Section (VTI ) */}
                <div className="rounded-3xl border border-[#EAEBED] bg-white p-6 sm:p-8 shadow-xs">
                  <h3 className="text-base font-bold font-heading text-[#161821] mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#FF5B35]" />
                    <span>Apply Promotional Coupon</span>
                  </h3>
                  <p className="text-xs text-[#57595F] mb-4">
                    Have an enterprise voucher or student discount code? Enter it below.
                  </p>

                  <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-3 max-w-md">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10, VTI25"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      className="flex-1 h-12 px-4 rounded-2xl bg-[#F8F8FA] border border-[#EAEBED] text-sm font-semibold uppercase placeholder:normal-case placeholder:text-[#57595F] text-[#161821] focus:outline-none focus:border-[#FF5B35]"
                    />
                    <VtiButton type="submit" variant="primary" size="md">
                      Apply Code
                    </VtiButton>
                  </form>

                  {/* Coupon feedback alerts */}
                  {couponStatus.type && (
                    <div
                      className={`mt-4 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                        couponStatus.type === "success"
                          ? "bg-[#09BD3C]/10 text-[#09BD3C] border border-[#09BD3C]/20"
                          : "bg-[#FF4D4F]/10 text-[#FF4D4F] border border-[#FF4D4F]/20"
                      }`}
                    >
                      {couponStatus.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{couponStatus.message}</span>
                    </div>
                  )}

                  {/* Applied Coupon Pill */}
                  {appliedCouponCode && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#09BD3C]/10 border border-[#09BD3C]/20 text-[#09BD3C] text-xs font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Applied: {appliedCouponCode}</span>
                      <button
                        type="button"
                        onClick={() => removeCoupon()}
                        className="ml-1 text-slate-500 hover:text-red-500 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Quick-apply chips */}
                  <div className="mt-4 pt-4 border-t border-[#EAEBED] flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#57595F]">Available Codes:</span>
                    <button
                      type="button"
                      onClick={() => handleQuickApplyCoupon("WELCOME10")}
                      className="px-2.5 py-1 rounded-lg bg-[#FF5B35]/10 hover:bg-[#FF5B35]/20 text-[#FF5B35] font-mono text-xs font-bold transition cursor-pointer"
                    >
                      WELCOME10 (-10%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickApplyCoupon("VTI25")}
                      className="px-2.5 py-1 rounded-lg bg-[#FF5B35]/10 hover:bg-[#FF5B35]/20 text-[#FF5B35] font-mono text-xs font-bold transition cursor-pointer"
                    >
                      VTI25 (-25%)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout Summary (4 cols) (VTI ) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-3xl border border-[#EAEBED] bg-[#FAF9F6] p-6 sm:p-8 shadow-sm space-y-5">
                  <h3 className="text-lg font-black font-heading text-[#161821] pb-3 border-b border-[#EAEBED]">
                    Order Summary
                  </h3>

                  {/* Bonus Exercise Progress Bar */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EAEBED] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#161821]">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF5B35]" />
                        <span>Bonus Sandbox Access</span>
                      </span>
                      <span className="text-[#FF5B35]">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-[#FF5B35] rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#57595F]">
                      {isGoalReached ? (
                        <span className="text-[#09BD3C] font-bold">Free bonus coding sandbox unlocked!</span>
                      ) : (
                        `Add $${Math.max(0, targetThreshold - totalAmountDollars).toFixed(2)} more to unlock complimentary sandbox.`
                      )}
                    </p>
                  </div>

                  {/* Breakdown Numbers */}
                  {breakdown && (
                    <div className="space-y-3 text-xs font-semibold text-[#57595F]">
                      <div className="flex justify-between">
                        <span>Course Subtotal ({itemCount} {itemCount === 1 ? "course" : "courses"})</span>
                        <span className="text-[#161821] font-bold">{breakdown.formattedSubtotal}</span>
                      </div>

                      {breakdown.promotionalDiscountMinor > 0 && (
                        <div className="flex justify-between text-[#09BD3C]">
                          <span>Catalog Discount</span>
                          <span>-{breakdown.formattedPromotionalDiscount}</span>
                        </div>
                      )}

                      {breakdown.couponDiscountMinor > 0 && (
                        <div className="flex justify-between text-[#09BD3C]">
                          <span>Voucher Discount</span>
                          <span>-{breakdown.formattedCouponDiscount}</span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-[#EAEBED] flex justify-between items-baseline">
                        <span className="text-sm font-bold text-[#161821]">Grand Total:</span>
                        <span className="text-2xl font-black text-[#FF5B35] font-heading">
                          {breakdown.formattedTotal}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action CTA */}
                  <div className="pt-2">
                    <VtiButton
                      href="/checkout"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      showArrow
                    >
                      Proceed to Checkout
                    </VtiButton>
                  </div>

                  {/* Trust guarantees */}
                  <div className="pt-4 border-t border-[#EAEBED] space-y-2 text-xs text-[#57595F]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#09BD3C] shrink-0" />
                      <span>30-Day Money-Back Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#FF5B35] shrink-0" />
                      <span>256-Bit SSL Encrypted Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#FFC221] shrink-0" />
                      <span>Instant Sandbox & Syllabus Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
