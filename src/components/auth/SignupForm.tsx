"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X, Eye, EyeOff, AlertCircle, Sparkles, ShieldCheck, ArrowRight, UserCheck, LogOut } from "lucide-react";
import { VtiButton, VtiLogo } from "@/components/ui/vti";

export function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingUser, setExistingUser] = useState<{ name: string; role: string; email: string } | null>(null);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("vti_cached_user");
      if (cached) {
        const u = JSON.parse(cached);
        if (u?.email) {
          setExistingUser(u);
          const dest =
            u.role === "SUPER_ADMIN" || u.role === "ADMIN"
              ? "/admin"
              : u.role === "INSTRUCTOR"
              ? "/instructor/dashboard"
              : "/student/learning";
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
            u.role === "SUPER_ADMIN" || u.role === "ADMIN"
              ? "/admin"
              : u.role === "INSTRUCTOR"
              ? "/instructor/dashboard"
              : "/student/learning";
          router.replace(dest);
        }
      })
      .catch(() => {});
  }, [router]);

  // Dynamic password criteria validation
  const passwordRules = useMemo(() => {
    return [
      { id: "length", label: "At least 8 characters", met: password.length >= 8 },
      { id: "upper", label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
      { id: "lower", label: "One lowercase letter (a-z)", met: /[a-z]/.test(password) },
      { id: "number", label: "One number (0-9)", met: /[0-9]/.test(password) },
    ];
  }, [password]);

  const isPasswordValid = passwordRules.every((r) => r.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Full Name must be at least 2 characters long.");
      return;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isPasswordValid) {
      const unmet = passwordRules.filter((r) => !r.met).map((r) => r.label);
      setError(`Password requirements not met: ${unmet.join(", ")}`);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        const detailedMsg =
          data.error?.details && Array.isArray(data.error.details)
            ? data.error.details.map((d: { message: string }) => d.message).join(". ")
            : data.error?.message ?? "Registration failed";
        setError(detailedMsg);
        return;
      }

      if (data.data?.user) {
        try {
          localStorage.setItem("vti_cached_user", JSON.stringify(data.data.user));
        } catch {}
        window.dispatchEvent(new CustomEvent("vti_user_updated", { detail: data.data.user }));
      }

      router.push("/student/learning");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
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
              Seminary-Grade Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight text-white">
              Enroll In 100% Free <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C08C52] to-[#E5B574]">
                Theological Studies.
              </span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join thousands of pastors, church planters, and believers mastering systematic theology, biblical Greek, and church history.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10 mt-8 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C08C52]" />
            <span>100% Free Tuition • No Credit Card Required</span>
          </div>
        </div>
      </div>

      {/* Right Column: Sign Up Form (7 cols) */}
      <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
        {existingUser ? (
          <div className="space-y-6 text-center py-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-[#061D42]/10 text-[#061D42] border border-[#061D42]/20 flex items-center justify-center mx-auto">
              <UserCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-[#061D42] tracking-tight">
                You Already Have An Active Account
              </h1>
              <p className="text-xs text-[#55585B]">
                Signed in as <strong>{existingUser.name}</strong> ({existingUser.role.toLowerCase()}).
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
                onClick={handleLogout}
                className="w-full h-11 rounded-2xl border border-[#EAEBED] hover:bg-[#FFF2F2] text-[#E93238] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out & Create Another Account</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#061D42] tracking-tight">
                Create Your Scholar Account
              </h1>
              <p className="text-xs sm:text-sm text-[#57595F] mt-1.5">
                Already registered?{" "}
                <Link href="/login" className="text-[#C08C52] hover:text-[#061D42] font-bold transition">
                  Sign in here
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-2xl bg-[#E93238]/10 border border-[#E93238]/30 text-[#E93238] text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Edwards"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-[#F8F8FA] border border-[#EAEBED] text-sm text-[#161821] placeholder:text-[#57595F]/70 focus:outline-none focus:border-[#061D42] transition duration-200"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jonathan@theology.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-[#F8F8FA] border border-[#EAEBED] text-sm text-[#161821] placeholder:text-[#57595F]/70 focus:outline-none focus:border-[#061D42] transition duration-200"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-4 pr-11 rounded-2xl bg-[#F8F8FA] border border-[#EAEBED] text-sm text-[#161821] placeholder:text-[#57595F]/70 focus:outline-none focus:border-[#061D42] transition duration-200"
                    autoComplete="new-password"
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

                {/* Password strength checks */}
                <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                  {passwordRules.map((rule) => (
                    <div
                      key={rule.id}
                      className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors duration-200 ${
                        rule.met ? "text-[#061D42]" : "text-[#8A8C90]"
                      }`}
                    >
                      {rule.met ? (
                        <Check className="w-3 h-3 stroke-[3] text-[#C08C52]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />
                      )}
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-2xl bg-[#061D42] hover:bg-[#0A2B5E] text-white font-extrabold text-sm transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#061D42]/25 disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Creating Scholar Account...</span>
                  ) : (
                    <>
                      <span>Start Learning for Free</span>
                      <ArrowRight className="w-4 h-4 text-[#C08C52]" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-[#8A8C90] text-center leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-[#061D42] font-bold hover:underline">
                  Academic Honor Code
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#061D42] font-bold hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
