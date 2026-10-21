import React from "react";

export interface VtiBadgeProps {
  variant?: "category" | "discount" | "bestseller" | "rating" | "level" | "outline" | "free" | "featured" | "gold" | "navy";
  className?: string;
  children: React.ReactNode;
}

export function VtiBadge({
  variant = "category",
  className = "",
  children,
}: VtiBadgeProps) {
  const baseStyles =
    "inline-flex items-center text-xs font-bold tracking-tight rounded-md select-none transition-colors";

  const variantStyles = {
    category:
      "bg-[#C08C52]/15 text-[#C08C52] px-2.5 py-0.5 border border-[#C08C52]/30",
    gold:
      "bg-[#C08C52]/15 text-[#C08C52] px-2.5 py-0.5 border border-[#C08C52]/30",
    navy:
      "bg-[#061D42]/10 text-[#061D42] px-2.5 py-0.5 border border-[#061D42]/20 font-bold",
    discount:
      "bg-[#0F9F55]/15 text-[#0F9F55] px-2 py-0.5 rounded-full font-black",
    bestseller:
      "bg-[#C08C52]/20 text-[#C08C52] px-2.5 py-0.5 border border-[#C08C52]/30 uppercase text-[10px] tracking-wider",
    free:
      "bg-[#09BD3C]/15 text-[#09BD3C] px-2.5 py-0.5 border border-[#09BD3C]/30 uppercase text-[11px] font-black tracking-wide",
    featured:
      "bg-[#061D42]/15 text-[#061D42] px-2.5 py-0.5 border border-[#061D42]/30 uppercase text-[10px] font-black tracking-wider",
    rating:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5",
    level:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 border border-slate-200 dark:border-slate-700",
    outline:
      "border border-[#EAEBED] text-[#57595F] dark:text-slate-400 px-2.5 py-0.5",
  }[variant];

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
}
