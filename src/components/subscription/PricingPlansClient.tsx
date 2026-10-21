"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SubscriptionPlanItem,
  UserSubscriptionDetails,
} from "@/server/services/subscription.service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Zap,
  Building,
  ArrowRight,
  RotateCcw,
  GraduationCap,
  Award,
  BookOpen,
  Heart,
} from "lucide-react";

interface PricingPlansClientProps {
  plans: SubscriptionPlanItem[];
  currentSubscription: UserSubscriptionDetails | null;
}

export function PricingPlansClient({
  plans,
  currentSubscription,
}: PricingPlansClientProps) {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");
  const [subscribingSlug, setSubscribingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubscribe = async (planSlug: string) => {
    setSubscribingSlug(planSlug);
    setError(null);

    try {
      const res = await fetch("/api/v1/subscriptions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to start subscription.");
      }

      setSuccessMsg(`🎉 You are now subscribed to ${data.data.subscription.planName}!`);
      setTimeout(() => {
        router.push("/student/subscription");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubscribingSlug(null);
    }
  };

  const displayPlans = plans.filter((p) => {
    if (p.slug.includes("enterprise")) return true;
    return p.interval === billingCycle;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 font-sans">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#061D42]/10 text-[#061D42] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#C08C52]" /> Academic Stewardship & Tuition
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#061D42] tracking-tight">
          Accessible Biblical Education. <span className="text-[#C08C52]">Zero Financial Barrier.</span>
        </h1>
        <p className="text-base text-[#57595F] leading-relaxed">
          Virtual Theological Institute operates on an endowed scholarship and commitment-refund stewardship model.
          Every called believer can study Holy Scripture without burdensome tuition debt.
        </p>
      </div>

      {/* 2. Commitment Deposit with 100% Completion Refund Guarantee Spotlight */}
      <div className="rounded-3xl border-2 border-[#061D42] bg-gradient-to-br from-[#FAF9F6] via-white to-[#F0F4FA] p-8 sm:p-12 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#061D42] text-[#C08C52] text-xs font-black uppercase tracking-wider shadow-sm">
            <RotateCcw className="w-3.5 h-3.5 text-[#C08C52]" />
            <span>Our Unique Guarantee</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#061D42] tracking-tight">
            Commitment Deposit with <span className="text-[#C08C52]">100% Course Completion Refund</span>
          </h2>

          <p className="text-sm sm:text-base text-[#55585B] leading-relaxed">
            Students pay a modest upfront commitment deposit to enroll in guided coursework. 
            <strong> When you successfully complete 100% of all lectures, readings, and module quizzes, 
            your entire deposit is automatically refunded back to your original payment method.</strong>
          </p>

          {/* 3 Steps Visual Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white border border-[#EAEBED] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#061D42]/10 text-[#061D42] font-black text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-[#161821] text-sm">Enroll with Deposit</h4>
              <p className="text-xs text-[#55585B] leading-relaxed">
                Pay a small refundable commitment deposit ($49) or apply for the 100% free endowed track.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAEBED] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#C08C52]/15 text-[#C08C52] font-black text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-[#161821] text-sm">Graduate the Course</h4>
              <p className="text-xs text-[#55585B] leading-relaxed">
                Complete all theological lectures, exegesis reading guides, and pass module assessments.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#09BD3C]/30 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#09BD3C]/10 text-[#09BD3C] font-black text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-[#161821] text-sm">100% Automatic Refund</h4>
              <p className="text-xs text-[#55585B] leading-relaxed">
                Your deposit is automatically credited back, and your official verified Certificate is issued!
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link href="/courses">
              <Button className="bg-[#061D42] hover:bg-[#0A2B5E] text-white font-bold text-xs h-11 px-6 rounded-xl shadow-md cursor-pointer gap-2">
                <BookOpen className="w-4 h-4 text-[#C08C52]" />
                <span>Explore Refund-Eligible Courses</span>
              </Button>
            </Link>
            <span className="text-xs font-semibold text-[#55585B] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#09BD3C]" />
              Secured by Stripe & Automated Escrow Release
            </span>
          </div>
        </div>
      </div>

      {/* 3. Three Educational Tracks Comparison */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-[#161821] tracking-tight">
            Choose Your Learning Pathway
          </h3>
          <p className="text-xs sm:text-sm text-[#55585B]">
            Transparent options for individual scholars, church cohorts, and ministry partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 100% Free Endowed Track */}
          <div className="rounded-3xl border border-[#EAEBED] bg-white p-7 shadow-xs flex flex-col justify-between space-y-6 hover:border-[#09BD3C] transition">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8EE] text-[#09BD3C] text-xs font-extrabold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" /> Endowed Scholarship
              </div>
              <div>
                <h4 className="text-2xl font-black text-[#161821]">100% Free Track</h4>
                <p className="text-xs text-[#55585B] mt-1">
                  Fully underwritten by global ministry endowments for students unable to place a deposit.
                </p>
              </div>

              <div className="pt-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-[#161821]">$0</span>
                <span className="text-xs text-[#55585B] font-semibold">/ forever</span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-[#EAEBED] text-xs text-[#55585B]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span>Full access to all course lectures and outlines</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span>Interactive quizzes and progress tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span>Course WhatsApp Study Group access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span>Verifiable Certificate of Biblical Studies</span>
                </li>
              </ul>
            </div>

            <Link href="/courses">
              <Button className="w-full bg-[#161821] hover:bg-black text-white font-bold text-xs h-11 rounded-xl">
                Browse Free Catalog
              </Button>
            </Link>
          </div>

          {/* Card 2: Commitment Deposit (Featured) */}
          <div className="rounded-3xl border-2 border-[#061D42] bg-white p-7 shadow-md flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#061D42] text-[#C08C52] text-[11px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-sm">
              Recommended Track
            </div>

            <div className="space-y-4 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#061D42]/10 text-[#061D42] text-xs font-extrabold uppercase tracking-wider">
                <RotateCcw className="w-3.5 h-3.5 text-[#C08C52]" /> 100% Refundable
              </div>
              <div>
                <h4 className="text-2xl font-black text-[#161821]">Commitment Track</h4>
                <p className="text-xs text-[#55585B] mt-1">
                  Guaranteed accountability deposit: pay upfront, study diligently, get 100% refunded upon finishing.
                </p>
              </div>

              <div className="pt-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-[#061D42]">$49</span>
                <span className="text-xs text-[#09BD3C] font-bold">100% refunded at completion</span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-[#EAEBED] text-xs text-[#55585B]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span className="font-bold text-[#161821]">Full deposit refunded automatically upon graduation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span>Dedicated faculty grading and mentor feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span>Priority WhatsApp study group participation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span>Digital and printable official certificate with verification hash</span>
                </li>
              </ul>
            </div>

            <Link href="/courses">
              <Button className="w-full bg-[#061D42] hover:bg-[#0A2B5E] text-white font-bold text-xs h-11 rounded-xl shadow-md shadow-[#061D42]/20">
                Enroll with 100% Refund Guarantee
              </Button>
            </Link>
          </div>

          {/* Card 3: Sustaining Ministry Patron */}
          <div className="rounded-3xl border border-[#EAEBED] bg-white p-7 shadow-xs flex flex-col justify-between space-y-6 hover:border-[#FFC221] transition">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF6DF] text-[#8C6200] text-xs font-extrabold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-[#FFC221] text-[#FFC221]" /> Ministry Patron
              </div>
              <div>
                <h4 className="text-2xl font-black text-[#161821]">Institute Patron</h4>
                <p className="text-xs text-[#55585B] mt-1">
                  Support theological education worldwide while accessing advanced symposiums and digital library archives.
                </p>
              </div>

              <div className="pt-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-[#161821]">$19</span>
                <span className="text-xs text-[#55585B] font-semibold">/ month or $149/yr</span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-[#EAEBED] text-xs text-[#55585B]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span>Sponsors 3 full scholarships for students in developing nations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span>Unlimited access to full course catalog & upcoming releases</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span>Full access to Digital Theological Library & rare manuscripts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0 mt-0.5" />
                  <span>Quarterly live Q&A webinars with senior theological faculty</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => handleSubscribe("patron-monthly")}
              disabled={subscribingSlug !== null}
              className="w-full bg-[#161821] hover:bg-black text-white font-bold text-xs h-11 rounded-xl"
            >
              Become a Patron Scholar
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Common Questions / FAQs about Refund */}
      <div className="rounded-3xl border border-[#EAEBED] bg-white p-8 space-y-6">
        <h3 className="text-xl font-black text-[#161821] tracking-tight">
          Frequently Asked Questions About Tuition & Refunds
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#55585B]">
          <div className="space-y-1.5">
            <h4 className="font-bold text-[#161821] text-sm">How does the 100% refund work?</h4>
            <p className="leading-relaxed">
              When you enroll with a commitment deposit, the funds are held securely in automated escrow.
              As soon as our LMS registers that you have finished 100% of course lessons and quizzes, our payment processor immediately issues a 100% refund to your card or account.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-[#161821] text-sm">Why do you require an upfront commitment deposit?</h4>
            <p className="leading-relaxed">
              Online courses often suffer from low completion rates. The modest deposit creates positive accountability, ensuring students remain engaged and complete their studies. Because you get 100% back upon graduation, disciplined study remains entirely free.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-[#161821] text-sm">What if I cannot afford any deposit upfront?</h4>
            <p className="leading-relaxed">
              No student is turned away. You can select the 100% Free Endowed Track directly on any course page. All core video lectures, syllabi, reading guides, and certificates are available without charge.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-[#161821] text-sm">How do I join the WhatsApp study group?</h4>
            <p className="leading-relaxed">
              Immediately upon enrolling, a "Join WhatsApp Study Group" button appears on your course dashboard and in your confirmation email, connecting you directly to instructors and fellow scholars.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
