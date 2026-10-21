"use client";

import React, { useState } from "react";
import { InstructorBalanceInfo, PayoutRequestItem } from "@/server/services/payout.service";
import { WithdrawalModal } from "@/components/instructor/WithdrawalModal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Landmark,
  Send,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface InstructorPayoutsClientProps {
  initialBalance: InstructorBalanceInfo;
  initialPayouts: PayoutRequestItem[];
}

export function InstructorPayoutsClient({
  initialBalance,
  initialPayouts,
}: InstructorPayoutsClientProps) {
  const [balance, setBalance] = useState<InstructorBalanceInfo>(initialBalance);
  const [payouts, setPayouts] = useState<PayoutRequestItem[]>(initialPayouts);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const reloadData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/v1/instructor/payouts");
      const data = await res.json();
      if (data.success) {
        setBalance(data.data.balance);
        setPayouts(data.data.payouts);
      }
    } catch {
      // Ignore
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAEBED]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0E101A]">Earnings & Payouts</h1>
          <p className="text-sm text-[#55585B] mt-1">
            Manage your payout methods, view withdrawal eligibility, and inspect settlement history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={reloadData}
            disabled={refreshing}
            className="gap-1.5 text-xs font-bold border-[#EAEBED] text-[#0E101A] hover:bg-[#FAF9F6] rounded-xl"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            disabled={!balance.canWithdraw}
            className="bg-[#FF5B35] hover:bg-[#3b50df] text-white gap-2 font-bold px-4 py-2.5 rounded-xl shadow-xs"
          >
            <DollarSign className="w-4 h-4" /> Request Payout
          </Button>
        </div>
      </div>

      {/* 3 Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="border border-[#FF5B35]/30 bg-[#FAF9F6] rounded-[20px] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-[#FF5B35] uppercase tracking-wider">
              Available For Withdrawal
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FF5B35] text-white flex items-center justify-center shadow-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#0E101A]">
              ${(balance.availableMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between text-xs text-[#55585B] mt-3 pt-3 border-t border-[#EAEBED]">
              <span>Threshold: $50.00 min</span>
              <span className={`font-bold ${balance.canWithdraw ? "text-[#09BD3C]" : "text-[#D97706]"}`}>
                {balance.canWithdraw ? "Eligible to withdraw" : "Below $50 threshold"}
              </span>
            </div>
          </div>
        </div>

        {/* Pending In Transit */}
        <div className="border border-[#EAEBED] bg-white rounded-[20px] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-[#55585B] uppercase tracking-wider">
              Pending Processing
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FFF6DF] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#0E101A]">
              ${(balance.pendingMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-[#55585B] mt-3 pt-3 border-t border-[#EAEBED]">
              Payouts submitted and currently undergoing clearing
            </p>
          </div>
        </div>

        {/* Lifetime Paid */}
        <div className="border border-[#EAEBED] bg-white rounded-[20px] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-[#55585B] uppercase tracking-wider">
              Lifetime Paid Out
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#09BD3C]/10 text-[#09BD3C] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#0E101A]">
              ${(balance.lifetimePaidMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-[#55585B] mt-3 pt-3 border-t border-[#EAEBED]">
              Total distributions transferred to your external accounts
            </p>
          </div>
        </div>
      </div>

      {/* Payout Channels Banner */}
      <div className="bg-white border border-[#EAEBED] rounded-[20px] p-6 shadow-xs">
        <h3 className="text-base font-bold text-[#0E101A] mb-4">Supported Payout Rails</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF5B35]/10 text-[#FF5B35]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#0E101A]">Stripe Connect</div>
              <p className="text-xs text-[#55585B] mt-0.5">
                Automated bank transfers in 40+ countries. 1-2 business days.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#09BD3C]/10 text-[#09BD3C]">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#0E101A]">PayPal Instant</div>
              <p className="text-xs text-[#55585B] mt-0.5">
                Immediate payout delivery directly to your verified PayPal email.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFC221]/15 text-[#D97706]">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#0E101A]">Direct Bank Wire</div>
              <p className="text-xs text-[#55585B] mt-0.5">
                Domestic ACH and SWIFT international bank wire transfers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0E101A]">Payout History & Settlements</h2>
            <p className="text-xs text-[#55585B]">
              Complete historical record of all withdrawal requests
            </p>
          </div>
          <span className="text-xs text-[#55585B] font-bold">
            {payouts.length} {payouts.length === 1 ? "record" : "records"}
          </span>
        </div>

        <div className="bg-white border border-[#EAEBED] rounded-[20px] overflow-hidden shadow-xs">
          {payouts.length === 0 ? (
            <div className="p-12 text-center text-[#55585B] text-sm">
              No payout requests recorded yet. Once your available balance exceeds $50.00, you can request a withdrawal.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF9F6] text-xs font-bold text-[#55585B] border-b border-[#EAEBED] uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Request ID</th>
                    <th className="py-4 px-5">Amount</th>
                    <th className="py-4 px-5">Method</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Requested On</th>
                    <th className="py-4 px-5">Settlement Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-[#EAEBED]">
                  {payouts.map((p) => {
                    const isPaid = p.status === "PAID";
                    const isPending = p.status === "PENDING" || p.status === "PROCESSING";
                    const isRejected = p.status === "REJECTED";

                    return (
                      <tr key={p.id} className="hover:bg-[#FAF9F6]/80 transition">
                        <td className="py-4 px-5 font-mono text-xs font-bold text-[#0E101A]">
                          {p.id}
                        </td>
                        <td className="py-4 px-5 font-black text-sm text-[#0E101A]">
                          ${(p.amountMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-5 text-xs font-bold text-[#55585B]">
                          {p.payoutMethod.replace("_", " ")}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                              isPaid
                                ? "bg-[#09BD3C]/10 text-[#09BD3C]"
                                : isPending
                                ? "bg-[#FFF6DF] text-[#D97706] border border-[#FFC221]/30"
                                : "bg-[#FF7162]/10 text-[#FF7162]"
                            }`}
                          >
                            {isPaid && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {isPending && <Clock className="w-3.5 h-3.5" />}
                            {isRejected && <AlertCircle className="w-3.5 h-3.5" />}
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-xs text-[#55585B]">
                          {new Date(p.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-4 px-5 font-mono text-xs text-[#55585B]">
                          {p.referenceId || "—"}
                          {p.notes && (
                            <div className="text-[11px] text-[#55585B] font-sans mt-0.5 italic">
                              {p.notes}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <WithdrawalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableMinor={balance.availableMinor}
        onSuccess={reloadData}
      />
    </div>
  );
}
