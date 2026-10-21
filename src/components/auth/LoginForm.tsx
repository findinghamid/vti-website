"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Sparkles, ArrowRight, ShieldCheck, UserCheck, LogOut } from "lucide-react";
import { VtiButton, VtiLogo } from "@/components/ui/vti";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") ?? "/";
  const switchAccount = searchParams.get("switch") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingUser, setExistingUser] = useState<{ name: string; role: string; email: string } | null>(null);

  // Check if user is already signed in on client mount
  useEffect(() => {
    if (switchAccount) return;

    try {
      const cached = localStorage.getItem("vti_cached_user");
      if (cached) {
        const u = JSON.parse(cached);
        if (u?.email) {
          setExistingUser(u);
          const dest =
            redirectParam !== "/"
              ? redirectParam
              : u.role === "SUPER_ADMIN" || u.role === "ADMIN"
              ? "/admin"
              : u.role === "INSTRUCTOR"
              ? "/instructor/dashboard"
              : "/student/learning";
          // Redirect immediately if already signed in
          router.replace(dest);
          return;
        }
      }
    } catch {}

    fetch("/api/v1/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData?.data?.user) {
          const u = resData.data.user;
          setExistingUser(u);
          const dest =
            redirectParam !== "/"
              ? redirectParam
              : u.role === "SUPER_ADMIN" || u.role === "ADMIN"
              ? "/admin"
              : u.role === "INSTRUCTOR"
              ? "/instructor/dashboard"
              : "/student/learning";
          router.replace(dest);
        }
      })
      .catch(() => {});
  }, [redirectParam, router, switchAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        const detailedMsg =
          data.error?.details && Array.isArray(data.error.details)
            ? data.error.details.map((d: { message: string }) => d.message).join(". ")
            : data.error?.message ?? "Login failed";
        setError(detailedMsg);
        return;
      }

      if (data.data?.user) {
        try {
          localStorage.setItem("vti_cached_user", JSON.stringify(data.data.user));
        } catch {}
        window.dispatchEvent(new CustomEvent("vti_user_updated", { detail: data.data.user }));
      }

      const role = data.data?.user?.role;
      const destination =
        redirectParam !== "/"
          ? redirectParam
          : role === "SUPER_ADMIN" || role === "ADMIN"
          ? "/admin"
          : role === "INSTRUCTOR"
          ? "/instructor/dashboard"
          : "/student/learning";

      router.push(destination);
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAndSwitch = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      try {
        localStorage.removeItem("vti_cached_user");
      } catch {}
      window.dispatchEvent(new CustomEvent("vti_user_updated", { detail: null }));
      setExistingUser(null);
      router.refresh();
    } catch {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-[#EAEBED] bg-white shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* Left Column: Institutional Welcome Banner (5 cols) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-[#061D42] via-[#0A2B5E] to-[#041530] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C08C52]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#02AEED]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <Link href="/" className="inline-block">
            <VtiLogo theme="dark" size="md" />
          </Link>

          <div className="pt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#C08C52] text-[11px] font-bold uppercase tracking-wider mb-4 border border-[#C08C52]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C08C52]" />
              Theological Formation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight text-white">
              Deep Biblical Truth. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C08C52] to-[#E5B574]">
                Free For All.
              </span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Log in to resume your lectures, study Scripture in original languages, and earn verifiable theological credentials.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10 mt-8 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C08C52]" />
            <span>Encrypted Authentication & Doctrinal Integrity</span>
          </div>
        </div>
      </div>

      {/* Right Column: Sign In Form (7 cols) */}
      <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
        {existingUser ? (
          /* Already Signed In Alert & Fast Navigation */
          <div className="space-y-6 text-center py-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-[#061D42]/10 text-[#061D42] border border-[#061D42]/20 flex items-center justify-center mx-auto">
              <UserCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-[#061D42] tracking-tight">
                You Are Already Signed In
              </h1>
              <p className="text-xs text-[#55585B]">
                Currently authenticated as <strong>{existingUser.name}</strong> ({existingUser.role.toLowerCase()}).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F8FA] border border-[#EAEBED] text-left text-xs space-y-1">
              <p className="font-bold text-[#061D42]">{existingUser.name}</p>
              <p className="text-[#55585B]">{existingUser.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#061D42] text-[#C08C52]">
                {existingUser.role}
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  const dest =
                    existingUser.role === "SUPER_ADMIN" || existingUser.role === "ADMIN"
                      ? "/admin"
                      : existingUser.role === "INSTRUCTOR"
                      ? "/instructor/dashboard"
                      : "/student/learning";
                  router.push(dest);
                }}
                className="w-full h-12 rounded-2xl bg-[#061D42] hover:bg-[#0A2B5E] text-white font-extrabold text-xs transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#061D42]/20 cursor-pointer"
              >
                <span>Go to Your Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#C08C52]" />
              </button>

              <button
                type="button"
                onClick={handleLogoutAndSwitch}
                className="w-full h-11 rounded-2xl border border-[#EAEBED] hover:bg-[#FFF2F2] text-[#E93238] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out & Switch Account</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#061D42] tracking-tight">
                Sign In to Your Account
              </h1>
              <p className="text-xs sm:text-sm text-[#57595F] mt-1.5">
                Don&apos;t have an account yet?{" "}
                <Link href="/signup" className="text-[#C08C52] hover:text-[#061D42] font-bold transition">
                  Create an Account Now
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-2xl bg-[#E93238]/10 border border-[#E93238]/30 text-[#E93238] text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-[#F8F8FA] border border-[#EAEBED] text-sm text-[#161821] placeholder:text-[#57595F]/70 focus:outline-none focus:border-[#061D42] transition duration-200"
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#57595F]">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-[#C08C52] hover:text-[#061D42] transition">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-4 pr-11 rounded-2xl bg-[#F8F8FA] border border-[#EAEBED] text-sm text-[#161821] placeholder:text-[#57595F]/70 focus:outline-none focus:border-[#061D42] transition duration-200"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 rounded-2xl bg-[#061D42] hover:bg-[#0A2B5E] text-white font-extrabold text-sm transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#061D42]/25 disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Signing in to Portal...</span>
                  ) : (
                    <>
                      <span>Sign In to Learning Hub</span>
                      <ArrowRight className="w-4 h-4 text-[#C08C52]" />
                    </>
                  )}
                </button>
              </div>

              {/* Quick Demo Role Autofill */}
              <div className="pt-3 border-t border-[#EAEBED] space-y-2">
                <p className="text-[11px] font-bold text-[#8A8C90] uppercase tracking-wider text-center">
                  Quick Role Sign-In Credentials
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("admin@vti.edu");
                      setPassword("Admin123!");
                    }}
                    className="p-2.5 rounded-xl border border-[#EAEBED] hover:border-[#C08C52] bg-[#FAF9F6] text-left transition cursor-pointer"
                  >
                    <span className="font-bold text-[#061D42] block flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C08C52]" /> Admin Staff
                    </span>
                    <span className="text-[10px] text-[#55585B] block truncate">admin@vti.edu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail("student@vti.edu");
                      setPassword("Student123!");
                    }}
                    className="p-2.5 rounded-xl border border-[#EAEBED] hover:border-[#061D42] bg-[#FAF9F6] text-left transition cursor-pointer"
                  >
                    <span className="font-bold text-[#061D42] block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#02AEED]" /> Student Scholar
                    </span>
                    <span className="text-[10px] text-[#55585B] block truncate">student@vti.edu</span>
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
