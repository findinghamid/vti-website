"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, ShoppingBag, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { VtiButton } from "@/components/ui/vti";

export function CartDrawer() {
  const { items, itemCount, breakdown, isDrawerOpen, closeDrawer, removeFromCart, isLoading } =
    useCart();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  // Calculate bonus progress threshold (e.g. $50 threshold)
  const totalAmountDollars = breakdown ? breakdown.totalMinor / 100 : 0;
  const targetThreshold = 50;
  const progressPercent = Math.min(100, Math.round((totalAmountDollars / targetThreshold) * 100));
  const isGoalReached = totalAmountDollars >= targetThreshold;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-white border-l border-[#EAEBED] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* 1. Header (VTI cartmini__top) */}
          <div className="px-6 py-5 border-b border-[#EAEBED] flex items-center justify-between bg-[#F8F8FA]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF5B35]/10 flex items-center justify-center text-[#FF5B35]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#161821]">
                Shopping Cart ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-[#57595F] hover:text-[#161821] hover:bg-slate-200 transition cursor-pointer"
              title="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Bonus Milestone Bar (VTI cartmini__shipping) */}
          <div className="px-6 py-3.5 bg-[#FFFBF2] border-b border-[#EAEBED]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#161821] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5B35]" />
                {isGoalReached ? (
                  <span className="text-[#09BD3C] font-bold">Bonus Exercise Sandbox Unlocked!</span>
                ) : (
                  <span>
                    Add <strong>${Math.max(0, targetThreshold - totalAmountDollars).toFixed(2)}</strong> more for bonus sandbox
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-[#FF5B35]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#FF5B35] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 3. Items List (VTI cartmini__widget) */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FF5B35]/10 flex items-center justify-center text-[#FF5B35]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-[#161821] text-base">
                    Your Cart is empty
                  </p>
                  <p className="text-xs text-[#57595F] max-w-xs leading-relaxed">
                    Explore high-impact courses taught by industry veterans and build your portfolio.
                  </p>
                </div>
                <Link href="/courses" onClick={closeDrawer}>
                  <VtiButton variant="primary" size="md" showArrow>
                    Explore Courses
                  </VtiButton>
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-[#EAEBED] bg-white hover:border-[#FF5B35]/40 transition group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FF5B35]/20 to-slate-200 flex items-center justify-center text-[#161821] font-bold text-xs">
                        VTI
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/courses/${item.slug}`}
                        onClick={closeDrawer}
                        className="text-xs font-bold text-[#161821] line-clamp-1 hover:text-[#FF5B35] transition"
                      >
                        {item.title}
                      </Link>
                      {item.instructors.length > 0 && (
                        <p className="text-[11px] text-[#57595F] truncate mt-0.5">
                          By {item.instructors[0].name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#EAEBED]/60">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-sm text-[#161821]">
                          {item.formattedPrice}
                        </span>
                        {item.formattedOriginalPrice && (
                          <span className="text-[11px] text-[#57595F] line-through">
                            {item.formattedOriginalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.courseId)}
                        disabled={isLoading}
                        className="p-1 rounded text-[#57595F] hover:text-[#FF4D4F] hover:bg-red-50 transition cursor-pointer"
                        title="Remove course from cart"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 4. Subtotal & Checkout Summary (VTI cartmini__checkout) */}
          {items.length > 0 && breakdown && (
            <div className="px-6 py-5 border-t border-[#EAEBED] bg-[#F8F8FA] space-y-3.5">
              <div className="space-y-1.5 text-xs font-medium text-[#57595F]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#161821]">
                    {breakdown.formattedSubtotal}
                  </span>
                </div>

                {breakdown.promotionalDiscountMinor > 0 && (
                  <div className="flex justify-between text-[#09BD3C] font-semibold">
                    <span>Special Savings</span>
                    <span>-{breakdown.formattedPromotionalDiscount}</span>
                  </div>
                )}

                {breakdown.couponDiscountMinor > 0 && (
                  <div className="flex justify-between text-[#09BD3C] font-semibold">
                    <span>Coupon ({breakdown.appliedCoupon?.code})</span>
                    <span>-{breakdown.formattedCouponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-extrabold text-[#161821] pt-2 border-t border-[#EAEBED]">
                  <span>Total Amount:</span>
                  <span className="text-base text-[#FF5B35]">{breakdown.formattedTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link href="/checkout" onClick={closeDrawer} className="w-full block">
                  <VtiButton variant="primary" size="md" className="w-full" showArrow>
                    Proceed to Checkout
                  </VtiButton>
                </Link>

                <Link href="/cart" onClick={closeDrawer} className="w-full block">
                  <VtiButton variant="border" size="md" className="w-full">
                    View Shopping Cart
                  </VtiButton>
                </Link>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#57595F] border-t border-[#EAEBED]/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#09BD3C]" />
                <span>Encrypted 256-bit checkout • Money-Back Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
