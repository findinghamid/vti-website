"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { VtiButton, VtiLogo } from "@/components/ui/vti";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAEBED] shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C08C52]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Logo & Back Link */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#57595F] hover:text-[#061D42] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Log In
          </Link>
          <Link href="/">
            <VtiLogo theme="light" size="sm" showText={false} />
          </Link>
        </div>

        {/* Icon & Title */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#061D42]/10 text-[#061D42] flex items-center justify-center font-bold mx-auto">
            <Mail className="w-6 h-6 text-[#061D42]" />
          </div>
          <h1 className="text-2xl font-black text-[#061D42]">Reset Your Password</h1>
          <p className="text-xs text-[#57595F] leading-relaxed max-w-xs mx-auto">
            Enter the email address associated with your student account and we will send password recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-[#09BD3C]/10 text-[#09BD3C] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#161821]">Recovery Email Sent</h3>
            <p className="text-xs text-[#57595F] leading-relaxed">
              If an account exists for <strong className="text-[#161821]">{email}</strong>, you will receive password reset instructions shortly.
            </p>
            <div className="pt-4">
              <Link href="/login" className="block w-full">
                <VtiButton variant="primary" size="md" className="w-full">
                  Return to Login
                </VtiButton>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1.5">
                Student Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 rounded-xl bg-[#F8F8FA] border border-[#EAEBED] text-xs font-semibold text-[#161821] placeholder:text-[#57595F] focus:outline-none focus:border-[#061D42] focus:bg-white transition"
                />
                <Mail className="w-4 h-4 text-[#57595F] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <VtiButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-[#061D42] hover:bg-[#0A2B5E]"
              disabled={loading}
            >
              {loading ? "Sending Instructions..." : "Send Reset Instructions"}
            </VtiButton>

            <div className="pt-4 text-center border-t border-[#EAEBED]">
              <p className="text-xs text-[#57595F]">
                Remember your password?{" "}
                <Link href="/login" className="font-bold text-[#C08C52] hover:text-[#061D42] transition">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
