import React from "react";
import { DecorativeUnderline } from "./DecorativeUnderline";

export interface SectionHeadingProps {
  subtitle?: string;
  subtitleIcon?: React.ReactNode;
  title: React.ReactNode;
  highlightWord?: string;
  highlightColor?: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({
  subtitle,
  subtitleIcon,
  title,
  highlightWord,
  highlightColor = "#C08C52",
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  }[align];

  // Render title with optional highlight word underlined
  const renderTitle = () => {
    if (typeof title !== "string" || !highlightWord || !title.includes(highlightWord)) {
      return title;
    }

    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className="vti-underline-container VTI-underline-container relative">
          <span className="relative z-10">{highlightWord}</span>
          <DecorativeUnderline color={highlightColor} />
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={`flex flex-col max-w-3xl ${alignClass} ${className}`}>
      {subtitle && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#061D42]/10 text-[#061D42] border border-[#061D42]/20 mb-3">
          {subtitleIcon && <span className="shrink-0">{subtitleIcon}</span>}
          <span>{subtitle}</span>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#061D42] dark:text-white tracking-tight leading-[1.15]">
        {renderTitle()}
      </h2>

      {description && (
        <p className="mt-3.5 text-sm sm:text-base text-[#57595F] dark:text-slate-400 leading-relaxed font-normal">
          {description}
        </p>
      )}
    </div>
  );
}
