"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Clock, Bell, CheckCircle2, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string | null;
  lessonTitle: string;
  courseTitle?: string;
  isFree?: boolean;
  formattedPrice?: string;
}

export function VideoPreviewModal({
  isOpen,
  onClose,
  lessonTitle,
  courseTitle = "Course Preview",
}: VideoPreviewModalProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden bg-[#061D42] border border-[#C08C52]/30 rounded-3xl shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#061D42]/90">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C08C52] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#C08C52]">
              Video Lecture Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview with Blur & Notice */}
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Blurred Background Art */}
          <Image
            src="/assets/img/course/christian-foundational-beliefs.webp"
            alt={courseTitle}
            fill
            className="object-cover blur-md scale-105 opacity-30"
          />

          {/* Overlay Message */}
          <div className="relative z-10 max-w-md p-6 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#C08C52]/20 border border-[#C08C52]/40 text-[#C08C52] flex items-center justify-center shadow-lg">
              <Clock className="w-8 h-8 text-[#C08C52]" />
            </div>

            <div className="space-y-1">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#C08C52] bg-[#C08C52]/10 px-3 py-0.5 rounded-full border border-[#C08C52]/30">
                In Production & Recording
              </span>
              <h3 className="text-xl font-black text-white font-heading">
                Course Videos Coming Soon
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Video lectures for <strong className="text-white">“{lessonTitle}”</strong> are currently being recorded and edited by our faculty in Lahore. They will be available immediately upon official release.
            </p>

            {/* Notification form inside preview */}
            {subscribed ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You will be notified as soon as video lectures go live!</span>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="flex items-center gap-2 max-w-sm mx-auto pt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for launch alerts"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-hidden focus:border-[#C08C52]"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#C08C52] hover:bg-[#A8753E] text-[#061D42] font-extrabold text-xs shrink-0 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 mr-1" />
                  Notify Me
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-[#051633] border-t border-white/10 text-xs">
          <div className="text-slate-400 line-clamp-1">
            Course: <span className="text-white font-semibold">{courseTitle}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-white/20 text-slate-200 hover:bg-white/10 hover:text-white text-xs cursor-pointer"
          >
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
