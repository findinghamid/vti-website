import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface VtiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "border" | "round" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  showArrow?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function VtiButton({
  variant = "primary",
  size = "md",
  href,
  showArrow = false,
  icon,
  className = "",
  children,
  ...props
}: VtiButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-5 py-2.5 rounded-xl gap-2",
    lg: "text-base px-7 py-3.5 rounded-xl gap-2.5",
  }[size];

  const variantStyles = {
    primary:
      "bg-[#061D42] hover:bg-[#0A2B5E] text-white shadow-sm hover:shadow-md hover:shadow-blue-950/20 active:translate-y-0.5 focus:ring-[#061D42]",
    secondary:
      "bg-[#C08C52] hover:bg-[#A9763D] text-white shadow-sm hover:shadow-md hover:shadow-amber-900/15 active:translate-y-0.5 focus:ring-[#C08C52]",
    gold:
      "bg-[#C08C52] hover:bg-[#A9763D] text-white shadow-sm hover:shadow-md hover:shadow-amber-900/15 active:translate-y-0.5 focus:ring-[#C08C52]",
    border:
      "border-2 border-[#EAEBED] hover:border-[#C08C52] bg-transparent text-[#061D42] dark:text-white hover:text-[#C08C52] hover:bg-[#C08C52]/5 active:translate-y-0.5 focus:ring-[#061D42]",
    round:
      "rounded-full bg-[#061D42] hover:bg-[#0A2B5E] text-white pl-6 pr-2 py-2 shadow-sm hover:shadow-md active:translate-y-0.5 focus:ring-[#061D42]",
    ghost:
      "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-[#57595F] dark:text-slate-300 hover:text-[#061D42] dark:hover:text-white focus:ring-slate-300",
    danger:
      "bg-[#E93238] hover:bg-red-700 text-white shadow-sm hover:shadow-md active:translate-y-0.5 focus:ring-[#E93238]",
  }[variant];

  const combinedClasses = `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`;

  const content = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {showArrow && (
        <span
          className={`shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
            variant === "round"
              ? "w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ml-2"
              : ""
          }`}
        >
          <ArrowRight className="w-4 h-4 ml-1 inline-block" />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`group ${combinedClasses}`}>
        {content}
      </Link>
    );
  }

  return (
    <button className={`group ${combinedClasses}`} {...props}>
      {content}
    </button>
  );
}
