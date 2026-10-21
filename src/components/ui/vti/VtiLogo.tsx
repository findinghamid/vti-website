import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface VtiLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  theme?: "light" | "dark";
  className?: string;
  href?: string;
  priority?: boolean;
}

export function VtiLogo({
  size = "md",
  showText = true,
  theme = "light",
  className = "",
  href = "/",
  priority = false,
}: VtiLogoProps) {
  const pixelSizes = {
    xs: 32,
    sm: 38,
    md: 46,
    lg: 56,
    xl: 72,
  }[size];

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative shrink-0 transition-transform duration-200 group-hover:scale-105">
        <Image
          src="/assets/img/logo/vti-logo-sm.webp"
          alt="Virtual Theological Institute Official Seal"
          width={pixelSizes}
          height={pixelSizes}
          priority={priority}
          className="rounded-full shadow-sm object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-black tracking-tight ${
                size === "xs"
                  ? "text-base"
                  : size === "sm"
                  ? "text-lg"
                  : size === "lg"
                  ? "text-2xl"
                  : size === "xl"
                  ? "text-3xl"
                  : "text-xl"
              } ${theme === "dark" ? "text-white" : "text-[#061D42]"}`}
            >
              VTI
            </span>
            <span
              className={`font-extrabold uppercase tracking-wider text-[11px] sm:text-xs text-[#C08C52]`}
            >
              Institute
            </span>
          </div>
          <span
            className={`font-medium tracking-tight mt-0.5 ${
              size === "xs" || size === "sm"
                ? "text-[10px]"
                : "text-[11px]"
            } ${theme === "dark" ? "text-slate-300" : "text-[#57595F]"}`}
          >
            Virtual Theological Institute
          </span>
          <span
            className={`font-bold tracking-wider text-[9px] uppercase mt-0.5 ${
              theme === "dark" ? "text-[#C08C52]" : "text-[#C08C52]"
            }`}
          >
            vti-edu.org
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
