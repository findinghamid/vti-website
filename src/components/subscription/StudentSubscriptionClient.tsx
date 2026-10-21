"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserSubscriptionDetails } from "@/server/services/subscription.service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

interface StudentSubscriptionClientProps {
  initialSubscription: UserSubscriptionDetails | null;
}

export function StudentSubscriptionClient({
  initialSubscription,
}: StudentSubscriptionClientProps) {
  const [subscription, setSubscription] = useState<UserSubscriptionDetails | null>(
    initialSubscription
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCancel = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/student/subscription/cancel", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to cancel subscription.");
      }
      setSubscription(data.data.subscription);
      setSuccessMsg("Cancellation scheduled. You retain full access until the end of your billing cycle.");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/student/subscription/reactivate", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to reactivate subscription.");
      }
      setSubscription(data.data.subscription);
      setSuccessMsg("Subscription reactivated successfully! Automatic renewal restored.");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAEBED]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#161821] tracking-tight">
            My Learning Subscription
          </h1>
          <p className="text-xs sm:text-sm text-[#55585B] mt-1">
            Manage your all-access membership plan, billing renewal, and catalog entitlement.
          </p>
        </div>

        <Link href="/pricing">
          <Button
            variant="outline"
            className="font-bold text-xs gap-1.5 border-[#EAEBED] hover:bg-[#F3F4F8] text-[#161821] rounded-xl h-10 px-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFC221]" /> Explore All Plans
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#FFF2F2] border border-[#FF4A55]/30 text-[#FF4A55] text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#E8F8EE] border border-[#09BD3C]/30 text-[#09BD3C] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Subscription Card or Empty State */}
      {!subscription || !subscription.hasAccess ? (
        <div className="bg-white border border-[#EAEBED] p-10 text-center space-y-4 max-w-xl mx-auto rounded-3xl shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#FF5B35]/10 text-[#FF5B35] flex items-center justify-center mx-auto">
            <Zap className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-[#161821]">No Active Learning Subscription</h2>
          <p className="text-xs text-[#55585B] max-w-md mx-auto leading-relaxed">
            You are currently on pay-per-course access. Upgrade to an All-Access pass to unlock our full catalog of 30+ enterprise courses, coding sandboxes, and verified completion certificates.
          </p>
          <div className="pt-2">
            <Link href="/pricing">
              <Button className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs gap-2 px-6 h-10 rounded-xl shadow-xs">
                View Subscription Plans <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Subscription Card (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#EAEBED] rounded-2xl overflow-hidden shadow-xs">
              <div className="p-6 border-b border-[#EAEBED] flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-black text-[#161821]">
                      {subscription.planName}
                    </h3>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#E8F8EE] text-[#09BD3C] border border-[#09BD3C]/20">
                      ACTIVE PASS
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#55585B] mt-1">
                    ${(subscription.priceAmount / 100).toFixed(2)} USD / {subscription.interval.toLowerCase()}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#FF5B35] text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Entitlement Highlight */}
                <div className="p-4 rounded-xl bg-[#E8F8EE] border border-[#09BD3C]/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#09BD3C] font-bold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Catalog-wide learning entitlement active across all courses</span>
                  </div>
                  <Link href="/courses">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 font-bold text-[#09BD3C] hover:bg-white"
                    >
                      Browse <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>

                {/* Period Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-[#EAEBED] bg-[#FAF9F6]">
                    <div className="text-[#8A8C90] font-bold text-[10px] uppercase tracking-wider">
                      Current Period End
                    </div>
                    <div className="text-sm font-black text-[#161821] mt-1">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#EAEBED] bg-[#FAF9F6]">
                    <div className="text-[#8A8C90] font-bold text-[10px] uppercase tracking-wider">
                      Days Remaining
                    </div>
                    <div className="text-sm font-black text-[#161821] mt-1">
                      {subscription.daysRemaining} days
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#EAEBED] bg-[#FAF9F6]">
                    <div className="text-[#8A8C90] font-bold text-[10px] uppercase tracking-wider">
                      Auto-Renewal
                    </div>
                    <div className="text-sm font-black mt-1">
                      {subscription.cancelAtPeriodEnd ? (
                        <span className="text-[#FF7162]">Cancels at end</span>
                      ) : (
                        <span className="text-[#09BD3C]">Renews automatically</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#EAEBED] flex items-center justify-between gap-4">
                  {subscription.cancelAtPeriodEnd ? (
                    <Button
                      onClick={handleReactivate}
                      disabled={loading}
                      size="sm"
                      className="bg-[#09BD3C] hover:bg-[#08a534] text-white font-bold text-xs gap-1.5 rounded-xl h-10 px-4"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reactivate Auto-Renewal
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCancel}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold text-[#FF4A55] border-[#FF4A55]/30 hover:bg-[#FFF2F2] rounded-xl h-10 px-4 cursor-pointer"
                    >
                      Cancel Subscription
                    </Button>
                  )}

                  <Link href="/courses">
                    <Button
                      size="sm"
                      className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs gap-1.5 rounded-xl h-10 px-5 shadow-xs"
                    >
                      Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Side Inclusions Box (1 col) */}
          <div className="space-y-4">
            <div className="bg-white border border-[#EAEBED] p-6 space-y-4 rounded-2xl shadow-xs">
              <h3 className="font-black text-sm text-[#161821]">Pass Inclusions</h3>
              <ul className="space-y-3 text-xs text-[#55585B]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0" />
                  <span>Full access to all 30+ marketplace tracks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0" />
                  <span>Verifiable completion certificates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0" />
                  <span>Isolated Node.js code runner sandboxes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#09BD3C] shrink-0" />
                  <span>Direct instructor Q&A access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
