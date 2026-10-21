"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Play,
  ShieldCheck,
  Video,
  FileText,
  Download,
  Infinity as InfinityIcon,
  Smartphone,
  Award,
  Share2,
  Heart,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Clock,
  Bell,
  CheckCircle2,
} from "lucide-react";

interface StickyEnrollCardProps {
  courseId?: string;
  slug?: string;
  courseTitle: string;
  thumbnailUrl: string | null;
  formattedPrice: string;
  formattedOriginalPrice: string | null;
  discountPercent: number | null;
  isFree: boolean;
  formattedDuration: string;
  totalArticles: number;
  totalResources: number;
  progressPercent?: number;
  isComingSoon?: boolean;
  onPreviewClick: () => void;
}

export function StickyEnrollCard({
  courseId,
  slug,
  courseTitle,
  thumbnailUrl,
  formattedDuration,
  progressPercent = 80,
  isComingSoon = true,
  onPreviewClick,
}: StickyEnrollCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const targetIdentifier = slug || courseId || "";
  const previewThumbnail = thumbnailUrl || "/assets/img/course/course-thumb-1.jpg";

  // Check enrollment on mount
  useEffect(() => {
    if (!targetIdentifier) return;
    fetch(`/api/v1/learning/courses/${targetIdentifier}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.isEnrolled) {
          setIsEnrolled(true);
        }
      })
      .catch(() => {});
  }, [targetIdentifier]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleWishlist = async () => {
    if (!targetIdentifier) return;
    try {
      const res = await fetch("/api/v1/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseId || targetIdentifier }),
      });
      const data = await res.json();
      if (data.success) {
        setInWishlist(data.data.inWishlist);
      }
    } catch {
      // ignore
    }
  };

  const handleEnrollFree = async () => {
    if (!targetIdentifier) return;
    setIsEnrolling(true);
    try {
      const res = await fetch("/api/v1/learning/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: courseId || targetIdentifier,
          slug: slug || targetIdentifier,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.redirectUrl) {
        router.push(data.data.redirectUrl);
      } else {
        router.push(`/learn/${slug || targetIdentifier}`);
      }
    } catch {
      router.push(`/learn/${slug || targetIdentifier}`);
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <aside className="w-full bg-white dark:bg-[#161821] rounded-3xl shadow-xl border border-[#EAEBED] dark:border-slate-800 overflow-hidden lg:sticky lg:top-24">
      {/* Video Preview Header with Blur effect & Coming Soon Overlay */}
      <div
        onClick={onPreviewClick}
        className="relative group aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
      >
        <Image
          src={previewThumbnail}
          alt={courseTitle}
          fill
          sizes="(max-width: 1024px) 100vw, 400px"
          className="object-cover blur-sm scale-105 group-hover:blur-xs transition duration-500"
        />

        <div className="absolute inset-0 bg-[#061D42]/65 backdrop-blur-xs transition duration-300" />

        {/* Floating Coming Soon & Production Badge */}
        <div className="relative z-10 flex flex-col items-center gap-2 text-white p-4 text-center">
          <div className="w-14 h-14 rounded-full bg-[#C08C52] text-[#061D42] flex items-center justify-center shadow-2xl group-hover:scale-110 transition duration-300">
            <Clock className="w-7 h-7 text-[#061D42]" />
          </div>
          <span className="text-xs font-black tracking-widest uppercase bg-[#061D42]/90 border border-[#C08C52]/50 text-[#C08C52] px-3.5 py-1 rounded-full shadow-lg">
            Course Videos Coming Soon
          </span>
          <p className="text-[11px] text-slate-200 font-medium max-w-[240px] leading-tight">
            Click to view studio recording & production notice
          </p>
        </div>
      </div>

      {/* Card Content & Enrollment Actions */}
      <div className="p-7">
        {/* Pricing Block: 100% Free Tuition */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#061D42] dark:text-white font-heading">
                FREE
              </span>
              <span className="text-xs font-extrabold text-[#09BD3C] bg-[#09BD3C]/10 px-2.5 py-0.5 rounded-full">
                100% Free Tuition
              </span>
            </div>
            <span className="text-[11px] text-[#57595F] dark:text-slate-400 font-medium mt-0.5">
              Fully Endowed Theological Education
            </span>
          </div>

          {/* Share & Wishlist Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleWishlist}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition duration-200 cursor-pointer ${
                inWishlist
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "border-[#EAEBED] dark:border-slate-800 text-[#57595F] hover:text-[#061D42]"
              }`}
              title="Save Course"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-600" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl border border-[#EAEBED] dark:border-slate-800 flex items-center justify-center text-[#57595F] hover:text-[#061D42] transition duration-200 cursor-pointer"
              title="Share Course"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copied && (
          <div className="mb-3 p-2 text-center text-xs font-semibold text-[#061D42] bg-[#061D42]/10 rounded-xl">
            Course link copied to clipboard!
          </div>
        )}

        {/* Development Status & Progress Bar */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-[#EAEBED] dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#061D42] dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C08C52] animate-pulse" />
              Status: In Development
            </span>
            <span className="font-extrabold text-[#C08C52]">{progressPercent}% Prepared</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#061D42] to-[#C08C52] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-[#57595F] dark:text-slate-400">
            Urdu translation and HD studio video lectures currently in recording.
          </p>
        </div>

        {/* Launch Notification Form */}
        <div className="space-y-3 mt-4">
          {subscribed ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Notification Registered!
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                We will email you the moment this course opens for free enrollment.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (notifyEmail) setSubscribed(true);
              }}
              className="space-y-2"
            >
              <label className="block text-xs font-bold text-[#161821] dark:text-white">
                Get Notified Upon Launch
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-[#EAEBED] dark:border-slate-800 text-[#161821] dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#061D42]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#061D42] hover:bg-[#0A2B5E] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition"
                >
                  <Bell className="w-3.5 h-3.5 text-[#C08C52]" />
                  <span>Notify</span>
                </button>
              </div>
            </form>
          )}

          {/* Join WhatsApp Study Group Button */}
          <a
            href="https://chat.whatsapp.com/invite/vti-theology-cohort"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs transition-all duration-200 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Join VTI Student WhatsApp Cohort</span>
          </a>
        </div>

        {/* Endowed Banner */}
        <div className="mt-5 pt-4 border-t border-[#EAEBED] dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-[#57595F] dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#09BD3C]" />
          <span>No Credit Card or Hidden Fees Required Ever</span>
        </div>

        {/* Course Value Props Checklist */}
        <div className="mt-6 space-y-3.5 text-xs text-[#57595F] dark:text-slate-300">
          <p className="font-extrabold text-[#061D42] dark:text-white text-sm font-heading">
            This theological course includes:
          </p>
          <div className="flex items-center gap-3">
            <Video className="w-4 h-4 text-[#C08C52] shrink-0" />
            <span>{formattedDuration || "10h"} on-demand lectures</span>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
            <span className="font-bold text-[#161821] dark:text-white">Active Course WhatsApp Study Group</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-[#C08C52] shrink-0" />
            <span>Printable Scripture reading guides & outlines</span>
          </div>
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-[#C08C52] shrink-0" />
            <span>Downloadable syllabi & exegesis notes</span>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-4 h-4 text-[#C08C52] shrink-0" />
            <span>Verifiable Certificate of Biblical Studies</span>
          </div>
          <div className="flex items-center gap-3">
            <InfinityIcon className="w-4 h-4 text-[#C08C52] shrink-0" />
            <span>Full lifetime access to course archives</span>
          </div>
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-[#C08C52] shrink-0" />
            <span>Access on mobile, tablet, and desktop</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
