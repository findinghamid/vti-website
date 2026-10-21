"use client";

import React from "react";

interface MobileStickyBarProps {
  formattedPrice: string;
  formattedOriginalPrice: string | null;
  discountPercent: number | null;
  isFree: boolean;
  onEnrollClick?: () => void;
}

export function MobileStickyBar({
  formattedPrice,
  formattedOriginalPrice,
  discountPercent,
  isFree,
  onEnrollClick,
}: MobileStickyBarProps) {
  const handleClick = () => {
    if (onEnrollClick) {
      onEnrollClick();
    } else {
      const enrollBtn = document.getElementById("primary-enroll-btn");
      if (enrollBtn) {
        enrollBtn.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#161821] border-t border-[#EAEBED] dark:border-slate-800 px-5 py-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center justify-between">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#161821] dark:text-white font-heading">
            {isFree ? "Free" : formattedPrice}
          </span>
          {formattedOriginalPrice && !isFree && (
            <span className="text-xs text-[#57595F] line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>
        {discountPercent && !isFree && (
          <span className="text-[10px] font-extrabold text-[#09BD3C] bg-[#09BD3C]/10 px-2 py-0.5 rounded-full">
            -{discountPercent}% OFF
          </span>
        )}
      </div>

      <button
        onClick={handleClick}
        className="h-11 px-6 rounded-xl bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition cursor-pointer"
      >
        Enroll Free
      </button>
    </div>
  );
}
