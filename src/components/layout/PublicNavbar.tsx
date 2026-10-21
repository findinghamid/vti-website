"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  LogOut,
  LayoutDashboard,
  Shield,
  GraduationCap,
  BookOpen,
  CreditCard,
  ChevronDown,
  LayoutGrid,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { useAppDispatch } from "@/store";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { useCart } from "@/hooks/useCart";
import { VtiButton, VtiLogo } from "@/components/ui/vti";
import { LanguageSelector } from "@/components/common/LanguageSelector";

interface PublicNavbarProps {
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN" | "INSTRUCTOR" | "STUDENT";
  } | null;
}

export function PublicNavbar({ currentUser }: PublicNavbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { itemCount, toggleDrawer } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [user, setUser] = useState(currentUser ?? null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const aboutMenuRef = useRef<HTMLDivElement>(null);
  const coursesMenuRef = useRef<HTMLDivElement>(null);

  // Sync prop changes
  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser);
      if (currentUser) {
        try {
          localStorage.setItem("vti_cached_user", JSON.stringify(currentUser));
        } catch {}
      }
    }
  }, [currentUser]);

  // Client-side hydration for fresh logins / cookie sync / profile updates
  useEffect(() => {
    let isMounted = true;

    // Hydrate from localStorage on client mount if SSR passed null
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
        if (isMounted) {
          if (resData?.data?.user) {
            setUser(resData.data.user);
            try {
              localStorage.setItem("vti_cached_user", JSON.stringify(resData.data.user));
            } catch {}
          } else if (resData?.success === false && !currentUser) {
            setUser(null);
            try {
              localStorage.removeItem("vti_cached_user");
            } catch {}
          }
        }
      })
      .catch(() => {});

    // Listen for profile updates dispatched from settings
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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(e.target as Node)) {
        setAboutDropdownOpen(false);
      }
      if (coursesMenuRef.current && !coursesMenuRef.current.contains(e.target as Node)) {
        setCoursesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
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
      setUserDropdownOpen(false);
      window.dispatchEvent(new CustomEvent("vti_user_updated", { detail: null }));
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") return "/admin";
    if (user.role === "INSTRUCTOR") return "/instructor/dashboard";
    return "/student/learning";
  };

  const getDashboardLabel = () => {
    if (!user) return "Dashboard";
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") return "Admin Governance";
    if (user.role === "INSTRUCTOR") return "Instructor Studio";
    return "My Learning";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* 1. Top Bar */}
      <div className="hidden lg:block border-b border-[#EAEBED] bg-[#FAF9F6] text-xs text-[#57595F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#C08C52]" />
              <span>100% Free Tuition • <strong className="text-[#061D42]">Endowed Theological Education</strong> for the Global Church</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#09BD3C]/10 text-[#09BD3C] font-bold text-[11px]">
              Open Enrollment • Self-Paced
            </div>
            <a
              href="mailto:admissions@vti-edu.org"
              className="flex items-center gap-1.5 hover:text-[#061D42] transition font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-[#C08C52]" /> admissions@vti-edu.org
            </a>
            <span className="w-px h-3.5 bg-[#EAEBED]" />
            <LanguageSelector variant="topbar" />
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="border-b border-[#EAEBED] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle, Brand & Categories */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden p-2 rounded-xl text-[#57595F] hover:bg-slate-100 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Institutional Brand Logo from Official Seal */}
            <VtiLogo size="md" priority />

            {/* Category Dropdown */}
            <div className="relative hidden xl:block ml-2" ref={categoryMenuRef}>
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#EAEBED] hover:border-[#C08C52] text-xs font-bold text-[#061D42] hover:text-[#C08C52] transition cursor-pointer bg-[#F8F8FA]"
              >
                <LayoutGrid className="w-4 h-4 text-[#C08C52]" />
                <span>Faculties</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl border border-[#EAEBED] bg-white shadow-xl z-50 p-2 animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#57595F] px-3 py-1.5">
                    Authentic Theological Faculties
                  </div>
                  <Link
                    href="/courses?category=christian-foundation"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#061D42] hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                  >
                    <div>
                      <span className="block">Christian Foundation</span>
                      <span className="text-[10px] font-bold text-[#C08C52] font-urdu">مسیحی بنیاد</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#061D42] bg-[#FAF9F6] border border-[#EAEBED] px-2 py-0.5 rounded">
                      3 Courses
                    </span>
                  </Link>
                  <Link
                    href="/courses?category=bible-understanding-and-interpretation"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#061D42] hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                  >
                    <div>
                      <span className="block">Bible Understanding & Interpretation</span>
                      <span className="text-[10px] font-bold text-[#C08C52] font-urdu">بائبل کو سمجھنا اور تشریح</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#061D42] bg-[#FAF9F6] border border-[#EAEBED] px-2 py-0.5 rounded">
                      1 Course
                    </span>
                  </Link>
                  <Link
                    href="/courses?category=spiritual-growth-and-christian-living"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#061D42] hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                  >
                    <div>
                      <span className="block">Spiritual Growth & Christian Living</span>
                      <span className="text-[10px] font-bold text-[#C08C52] font-urdu">روحانی ترقی اور مسیحی زندگی</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#061D42] bg-[#FAF9F6] border border-[#EAEBED] px-2 py-0.5 rounded">
                      2 Courses
                    </span>
                  </Link>
                  <Link
                    href="/courses?category=christian-apologetics"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#061D42] hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                  >
                    <div>
                      <span className="block">Christian Apologetics</span>
                      <span className="text-[10px] font-bold text-[#C08C52] font-urdu">مسیحی دفاعیات</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#061D42] bg-[#FAF9F6] border border-[#EAEBED] px-2 py-0.5 rounded">
                      1 Course
                    </span>
                  </Link>
                  <div className="border-t border-[#EAEBED] my-1 pt-1">
                    <Link
                      href="/courses/coming-soon"
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="block text-center text-xs font-bold text-[#061D42] hover:text-[#C08C52] py-1.5 transition"
                    >
                      COURSES ARE COMING SOON →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Search input bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-2 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search theology, biblical Greek, doctrines, church history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-4 pr-11 rounded-2xl border border-[#EAEBED] bg-[#F8F8FA] text-xs font-medium text-[#061D42] placeholder:text-[#57595F] focus:outline-none focus:border-[#061D42] focus:bg-white transition duration-200"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#061D42] hover:bg-[#0A2B5E] text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Right: Navigation Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden xl:flex items-center gap-4 mr-2 text-xs font-bold text-[#061D42]">
              <Link href="/" className="hover:text-[#C08C52] transition">
                Home
              </Link>
              <Link
                href="/go-gospel"
                className="hover:text-[#C08C52] transition flex items-center gap-1"
              >
                <span>Go Gospel</span>
                <span className="text-[9px] font-black uppercase tracking-wider text-[#C08C52] bg-[#C08C52]/15 px-1.5 py-0.5 rounded">
                  Music
                </span>
              </Link>

              {/* About Us Dropdown */}
              <div className="relative" ref={aboutMenuRef}>
                <button
                  onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                  className="flex items-center gap-1 hover:text-[#C08C52] transition cursor-pointer"
                >
                  <span>About Us</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      aboutDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {aboutDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-[#EAEBED] bg-white shadow-xl z-50 p-2 animate-in fade-in zoom-in-95">
                    <Link
                      href="/about"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-[#061D42] hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                    >
                      About VTI
                    </Link>
                    <Link
                      href="/about#mission-vision"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-[#061D42] hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                    >
                      Mission & Vision
                    </Link>
                    <Link
                      href="/statement-of-faith"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-[#061D42] hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                    >
                      Statement of Faith
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/instructors" className="hover:text-[#C08C52] transition">
                Instructors
              </Link>

              {/* Courses Dropdown */}
              <div className="relative" ref={coursesMenuRef}>
                <button
                  onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                  className="flex items-center gap-1 hover:text-[#C08C52] transition cursor-pointer"
                >
                  <span>Courses</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      coursesDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {coursesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-60 rounded-2xl border border-[#EAEBED] bg-white shadow-xl z-50 p-2 animate-in fade-in zoom-in-95">
                    <Link
                      href="/courses"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-[#061D42] hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                    >
                      Course Catalogue
                    </Link>
                    <Link
                      href="/courses/coming-soon"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#061D42] hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                    >
                      <span>Courses Coming Soon</span>
                      <span className="text-[9px] font-black text-[#C08C52] bg-[#C08C52]/15 px-1.5 py-0.5 rounded">
                        Roadmap
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/team" className="hover:text-[#C08C52] transition">
                Team
              </Link>
              <Link href="/faq" className="hover:text-[#C08C52] transition">
                FAQ
              </Link>
              <Link href="/contact" className="hover:text-[#C08C52] transition">
                Contact
              </Link>
            </nav>

            {/* Wishlist Link */}
            <Link
              href="/student/wishlist"
              className="p-2.5 rounded-xl border border-[#EAEBED] text-[#57595F] hover:text-[#061D42] hover:border-[#061D42] transition relative bg-white"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
            </Link>

            {/* Mini Cart Button with Live Counter Badge */}
            <button
              onClick={toggleDrawer}
              className="relative p-2.5 rounded-xl border border-[#EAEBED] text-[#57595F] hover:text-[#061D42] hover:border-[#061D42] transition cursor-pointer bg-white"
              title="Shopping Cart"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-[#E93238] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Authentication Section */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-[#EAEBED] hover:border-[#061D42] bg-[#F8F8FA] focus:outline-none cursor-pointer transition"
                  aria-label="User account menu"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#061D42] text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-[#061D42] max-w-[100px] truncate leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold text-[#C08C52] capitalize leading-none mt-0.5">
                      {user.role.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#57595F] ml-0.5" />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#EAEBED] bg-white shadow-2xl z-50 p-2.5 animate-in fade-in zoom-in-95">
                    {/* User Card Header */}
                    <div className="p-3 border-b border-[#EAEBED] mb-2 bg-[#F8F8FA] rounded-xl">
                      <p className="font-extrabold text-sm text-[#061D42] truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-[#57595F] truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#C08C52]/15 text-[#C08C52] border border-[#C08C52]/20">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* Primary Role Portal Button */}
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl bg-[#061D42] text-white hover:bg-[#0A2B5E] transition mb-2 shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{getDashboardLabel()}</span>
                      </div>
                      <span className="text-[10px] opacity-80">Open →</span>
                    </Link>

                    {/* Secondary Navigation Links */}
                    <div className="space-y-0.5 text-xs font-semibold text-[#061D42]">
                      <Link
                        href="/student/learning"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                      >
                        <BookOpen className="w-4 h-4 text-[#C08C52]" />
                        <span>Enrolled Courses</span>
                      </Link>

                      <Link
                        href="/student/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                      >
                        <Heart className="w-4 h-4 text-[#C08C52]" />
                        <span>Wishlist</span>
                      </Link>

                      <Link
                        href="/student/subscription"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                      >
                        <CreditCard className="w-4 h-4 text-[#C08C52]" />
                        <span>Subscription Pass</span>
                      </Link>

                      <Link
                        href="/student/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                      >
                        <BookOpen className="w-4 h-4 text-[#09BD3C]" />
                        <span>Purchase Invoices</span>
                      </Link>

                      {user.role === "INSTRUCTOR" && (
                        <Link
                          href="/instructor/courses"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                        >
                          <GraduationCap className="w-4 h-4 text-violet-500" />
                          <span>Course Authoring</span>
                        </Link>
                      )}

                      {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#C08C52]/10 hover:text-[#061D42] transition"
                        >
                          <Shield className="w-4 h-4 text-[#C08C52]" />
                          <span>Admin Governance</span>
                        </Link>
                      )}
                    </div>

                    {/* Sign Out Action */}
                    <div className="border-t border-[#EAEBED] mt-2 pt-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg text-[#E93238] hover:bg-red-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-2.5">
                <VtiButton href="/login" variant="ghost" size="sm">
                  Log in
                </VtiButton>
                <VtiButton href="/signup" variant="primary" size="sm" showArrow>
                  Sign up
                </VtiButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
