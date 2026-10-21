"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  BookOpen,
  GraduationCap,
  Shield,
  User,
  Heart,
  CreditCard,
  Layers,
  Sparkles,
  LogOut,
  Search,
  Phone,
  Mail,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSidebarOpen } from "@/store/slices/uiSlice";
import { VtiButton, VtiLogo } from "@/components/ui/vti";
import { LanguageSelector } from "@/components/common/LanguageSelector";

interface MobileNavProps {
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function MobileNav({ currentUser }: MobileNavProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isSidebarOpen);
  const [user, setUser] = useState(currentUser ?? null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;

    if (!currentUser && typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("vti_cached_user");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.name) {
            setUser(parsed);
          }
        }
      } catch {}
    }

    fetch("/api/v1/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (isMounted && resData?.data?.user) {
          setUser(resData.data.user);
        }
      })
      .catch(() => {});

    const handleUserUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setUser(customEvent.detail);
      }
    };
    window.addEventListener("vti_user_updated", handleUserUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("vti_user_updated", handleUserUpdated);
    };
  }, [currentUser]);

  if (!isOpen) return null;

  const close = () => dispatch(setSidebarOpen(false));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      close();
      router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      try {
        localStorage.removeItem("vti_cached_user");
      } catch {}
      setUser(null);
      close();
      window.dispatchEvent(new CustomEvent("vti_user_updated", { detail: null }));
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={close} />

      {/* Offcanvas Drawer */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white dark:bg-[#111827] border-r border-[#EAEBED] dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#EAEBED] dark:border-slate-800">
            <div onClick={close}>
              <VtiLogo size="sm" href="/" />
            </div>
            <button
              onClick={close}
              className="p-1.5 rounded-xl text-[#57595F] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="my-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-[#EAEBED] dark:border-slate-800 bg-[#F8F8FA] dark:bg-slate-900 text-xs font-medium text-[#061D42] dark:text-white placeholder:text-[#57595F] focus:outline-none focus:border-[#061D42]"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#061D42] text-white flex items-center justify-center"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Mobile Language Selector */}
          <div className="mb-5 pb-4 border-b border-[#EAEBED] dark:border-slate-800">
            <LanguageSelector variant="mobile" />
          </div>

          {/* User Status / Auth Actions */}
          {user ? (
            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] dark:bg-slate-900 border border-[#EAEBED] dark:border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#061D42] text-white flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-[#061D42] dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-[#57595F] dark:text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#C08C52]/15 text-[#C08C52] border border-[#C08C52]/20">
                {user.role}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 mb-5 pb-5 border-b border-[#EAEBED] dark:border-slate-800">
              <VtiButton href="/login" variant="border" size="sm" onClick={close}>
                Log in
              </VtiButton>
              <VtiButton href="/signup" variant="primary" size="sm" onClick={close} showArrow>
                Sign up
              </VtiButton>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={close}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#061D42] dark:text-white hover:bg-[#C08C52]/10 hover:text-[#C08C52] transition"
            >
              <BookOpen className="w-4 h-4 text-[#C08C52]" />
              <span>Home</span>
            </Link>

            <Link
              href="/go-gospel"
              onClick={close}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#061D42] dark:text-white hover:bg-[#C08C52]/10 hover:text-[#C08C52] transition"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#C08C52]" />
                <span>Go Gospel (Worship Ministry)</span>
              </div>
              <span className="text-[9px] font-black uppercase text-[#C08C52] bg-[#C08C52]/15 px-2 py-0.5 rounded">
                Music
              </span>
            </Link>

            <div className="pt-2 pb-1 text-[10px] font-extrabold text-[#57595F] dark:text-slate-400 uppercase tracking-wider px-3">
              About VTI
            </div>

            <Link
              href="/about"
              onClick={close}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#061D42] dark:text-white hover:bg-[#C08C52]/10 hover:text-[#C08C52] transition pl-6"
            >
              <span>About VTI</span>
            </Link>

            <Link
              href="/about#mission-vision"
              onClick={close}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#061D42] dark:text-white hover:bg-[#C08C52]/10 hover:text-[#C08C52] transition pl-6"
            >
              <span>Mission & Vision</span>
            </Link>

            <Link
              href="/statement-of-faith"
              onClick={close}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#061D42] dark:text-white hover:bg-[#C08C52]/10 hover:text-[#C08C52] transition pl-6"
            >
              <Shield className="w-4 h-4 text-[#C08C52]" />
              <span>Statement of Faith</span>
            </Link>

            <div className="pt-2 pb-1 text-[10px] font-extrabold text-[#57595F] dark:text-slate-400 uppercase tracking-wider px-3">
              Academic Programs
            </div>

            <Link
              href="/instructors"
              onClick={close}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#061D42] dark:text-white hover:bg-[#C08C52]/10 hover:text-[#C08C52] transition"
            >
              <GraduationCap className="w-4 h-4 text-[#C08C52]" />
              <span>Instructors Directory</span>
            </Link>

            <Link
              href="/courses"
              onClick={close}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#061D42] dark:text-white hover:bg-[#C08C52]/10 hover:text-[#C08C52] transition"
            >
              <Layers className="w-4 h-4 text-[#C08C52]" />
              <span>Course Catalogue</span>
            </Link>

            <Link
              href="/courses/coming-soon"
              onClick={close}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#061D42] dark:text-white hover:bg-[#C08C52]/10 hover:text-[#C08C52] transition"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#C08C52]" />
                <span>Courses Coming Soon</span>
              </div>
              <span className="text-[9px] font-black uppercase text-[#09BD3C] bg-[#09BD3C]/10 px-2 py-0.5 rounded">
                Roadmap
              </span>
            </Link>

            <Link
              href="/team"
              onClick={close}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#061D42] dark:text-white hover:bg-[#C08C52]/10 hover:text-[#C08C52] transition"
            >
              <GraduationCap className="w-4 h-4 text-[#061D42]" />
              <span>Leadership & Team</span>
            </Link>

            <Link
              href="/faq"
              onClick={close}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#061D42] dark:text-white hover:bg-[#C08C52]/10 hover:text-[#C08C52] transition"
            >
              <BookOpen className="w-4 h-4 text-[#57595F]" />
              <span>Frequently Asked Questions</span>
            </Link>

            <Link
              href="/contact"
              onClick={close}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#061D42] dark:text-white hover:bg-[#C08C52]/10 hover:text-[#C08C52] transition"
            >
              <Phone className="w-4 h-4 text-[#C08C52]" />
              <span>Contact VTI</span>
            </Link>

            {user && (
              <>
                <div className="pt-3 pb-1 text-[10px] font-extrabold text-[#57595F] dark:text-slate-400 uppercase tracking-wider px-3">
                  Account Portals
                </div>

                <Link
                  href="/student/learning"
                  onClick={close}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#161821] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <User className="w-4 h-4 text-[#0F9F55]" />
                  <span>My Enrolled Courses</span>
                </Link>

                <Link
                  href="/student/wishlist"
                  onClick={close}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#161821] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Saved Wishlist</span>
                </Link>

                <Link
                  href="/student/subscription"
                  onClick={close}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#161821] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <span>Subscription Status</span>
                </Link>

                {(user.role === "INSTRUCTOR" || user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                  <Link
                    href="/instructor/dashboard"
                    onClick={close}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#161821] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <GraduationCap className="w-4 h-4 text-violet-500" />
                    <span>Instructor Studio</span>
                  </Link>
                )}

                {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                  <Link
                    href="/admin"
                    onClick={close}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#161821] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span>Admin Operations</span>
                  </Link>
                )}

                <div className="pt-3 border-t border-[#EAEBED] dark:border-slate-800 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#FF4D4F] hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>

        {/* Contact info bottom bar */}
        <div className="p-6 border-t border-[#EAEBED] dark:border-slate-800 bg-[#F8F8FA] dark:bg-slate-900 text-xs text-[#57595F] dark:text-slate-400 space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#C08C52]" />
            <span>+1 (800) 555-0199</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#C08C52]" />
            <span>support@vti-edu.org</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            © {new Date().getFullYear()} Virtual Theological Institute (VTI). All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
