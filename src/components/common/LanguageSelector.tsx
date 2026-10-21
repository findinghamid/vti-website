"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";

interface LanguageSelectorProps {
  variant?: "topbar" | "footer" | "mobile";
  className?: string;
}

export function LanguageSelector({ variant = "topbar", className = "" }: LanguageSelectorProps) {
  const { currentLang, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Upward dropdown for footer, downward for topbar and mobile
  const isUpward = variant === "footer";

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      {variant === "topbar" && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#EAEBED] bg-white hover:border-[#C08C52] text-[#061D42] hover:text-[#C08C52] transition-colors text-xs font-bold cursor-pointer shadow-2xs"
          aria-label="Select language"
          title="Change language / زبان تبدیل کریں"
        >
          <Globe className="w-3.5 h-3.5 text-[#C08C52]" />
          <span>{currentLang}</span>
          <ChevronDown
            className={`w-3 h-3 text-[#57595F] transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {variant === "footer" && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#061D42] hover:text-[#C08C52] transition px-3 py-1.5 rounded-lg border border-[#EAEBED] bg-white cursor-pointer shadow-2xs"
          aria-label="Select language"
        >
          <Globe className="w-3.5 h-3.5 text-[#C08C52]" />
          <span>{currentLang}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#57595F] transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {variant === "mobile" && (
        <div className="w-full">
          <div className="text-[10px] font-extrabold text-[#57595F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#C08C52]" />
            <span>Select Platform Language / زبان</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((lang) => {
              const active = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                    active
                      ? "bg-[#061D42] text-white border-[#061D42] shadow-xs"
                      : "bg-[#F8F8FA] text-[#061D42] border-[#EAEBED] hover:border-[#C08C52]"
                  }`}
                >
                  <span className={lang.code === "UR" ? "font-urdu text-[13px]" : ""}>
                    {lang.nativeLabel}
                  </span>
                  <span className="text-[10px] opacity-75 uppercase">({lang.code})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Dropdown for Topbar & Footer */}
      {variant !== "mobile" && open && (
        <div
          className={`absolute ${
            isUpward ? "bottom-full mb-2 right-0" : "top-full mt-2 right-0"
          } w-44 bg-white rounded-2xl shadow-2xl border border-[#EAEBED] p-1.5 z-50 text-xs animate-in fade-in zoom-in-95`}
        >
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#57595F] border-b border-[#EAEBED] mb-1">
            Choose Language / زبان
          </div>
          <div className="space-y-0.5">
            {LANGUAGES.map((lang) => {
              const active = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    changeLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    active
                      ? "bg-[#061D42] text-white font-black shadow-xs"
                      : "text-[#061D42] hover:bg-[#F8F8FA] hover:text-[#C08C52] font-semibold"
                  }`}
                >
                  <span className={lang.code === "UR" ? "font-urdu text-[13px]" : ""}>
                    {lang.label}
                  </span>
                  {active && <Check className="w-3.5 h-3.5 text-[#C08C52]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
