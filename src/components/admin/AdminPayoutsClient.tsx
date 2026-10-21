"use client";

import React, { useState } from "react";
import { PayoutRequestItem } from "@/server/services/payout.service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  RefreshCw,
  Search,
  ExternalLink,
  DollarSign,
} from "lucide-react";

interface AdminPayoutsClientProps {
  initialPayouts: PayoutRequestItem[];
}

export function AdminPayoutsClient({ initialPayouts }: AdminPayoutsClientProps) {
  const [payouts, setPayouts] = useState<PayoutRequestItem[]>(initialPayouts);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequestItem | null>(null);
  const [decision, setDecision] = useState<"APPROVE" | "REJECT" | null>(null);
  const [referenceId, setReferenceId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const reloadData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/v1/admin/payouts");
      const data = await res.json();
      if (data.success && data.data?.payouts) {
        setPayouts(data.data.payouts);
      }
    } catch {
      // Ignore
    } finally {
      setRefreshing(false);
    }
  };

  const filteredPayouts = payouts.filter((p) => {
    if (statusFilter === "ALL") return true;
    return p.status === statusFilter;
  });

  const handleDecision = async () => {
    if (!selectedPayout || !decision) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/admin/payouts/${selectedPayout.id}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          referenceId: referenceId.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to process payout decision.");
      }

      setSuccessMsg(
        decision === "APPROVE"
          ? "✅ Payout marked as PAID and funds transferred."
          : "⚠️ Payout rejected. Funds restored to instructor balance."
      );

      // Update local state
      setPayouts((prev) =>
        prev.map((p) =>
          p.id === selectedPayout.id
            ? {
                ...p,
                status: decision === "APPROVE" ? "PAID" : "REJECTED",
                referenceId: referenceId.trim() || p.referenceId,
                notes: notes.trim() || p.notes,
              }
            : p
        )
      );

      setTimeout(() => {
        setSelectedPayout(null);
        setDecision(null);
        setReferenceId("");
        setNotes("");
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const pendingTotalMinor = payouts
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amountMinor, 0);

  const paidTotalMinor = payouts
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amountMinor, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAEBED]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0E101A]">
              Instructor Payout Management
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FF5B35]/10 text-[#FF5B35] border border-[#FF5B35]/20">
              Financial Operations
            </span>
          </div>
          <p className="text-sm text-[#55585B] mt-1">
            Authorize withdrawals, record gateway transfer IDs, and reconcile instructor disbursements.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={reloadData}
          disabled={refreshing}
          className="gap-1.5 text-xs font-bold border-[#EAEBED] text-[#0E101A] hover:bg-[#FAF9F6] rounded-xl"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* KPI summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="border border-[#FFC221]/30 bg-[#FFFDF5] rounded-[20px] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">
              Pending Authorization
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FFF6DF] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#0E101A]">
              ${(pendingTotalMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-[#55585B] mt-1.5">
              {payouts.filter((p) => p.status === "PENDING").length} withdrawal requests awaiting transfer
            </p>
          </div>
        </div>

        <div className="border border-[#EAEBED] bg-white rounded-[20px] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-[#55585B] uppercase tracking-wider">
              Total Disbursed
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#09BD3C]/10 text-[#09BD3C] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#0E101A]">
              ${(paidTotalMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-[#55585B] mt-1.5">
              {payouts.filter((p) => p.status === "PAID").length} completed settlements
            </p>
          </div>
        </div>

        <div className="border border-[#EAEBED] bg-white rounded-[20px] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-[#55585B] uppercase tracking-wider">
              All Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FF5B35]/10 text-[#FF5B35] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#0E101A]">{payouts.length}</div>
            <p className="text-xs text-[#55585B] mt-1.5">Historical requests count</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAEBED] pb-2">
        {["ALL", "PENDING", "PAID", "REJECTED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statusFilter === tab
                ? "bg-[#FF5B35] text-white shadow-xs"
                : "text-[#55585B] hover:text-[#0E101A] hover:bg-[#FAF9F6]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EAEBED] rounded-[20px] overflow-hidden shadow-xs">
        {filteredPayouts.length === 0 ? (
          <div className="p-12 text-center text-[#55585B] text-sm">
            No payouts found matching filter &quot;{statusFilter}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] text-xs font-bold text-[#55585B] border-b border-[#EAEBED] uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-5">Instructor</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5">Rail & Destination</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Requested</th>
                  <th className="py-4 px-5">Reference</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-[#EAEBED]">
                {filteredPayouts.map((p) => {
                  const isPending = p.status === "PENDING" || p.status === "PROCESSING";
                  const isPaid = p.status === "PAID";
                  const isRejected = p.status === "REJECTED";

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF9F6]/80 transition">
                      <td className="py-4 px-5">
                        <div className="font-bold text-[#0E101A]">
                          {p.instructor?.name || "Dr. Farooq Khan"}
                        </div>
                        <div className="text-xs text-[#55585B]">
                          {p.instructor?.email || "instructor@vti.edu"}
                        </div>
                      </td>

                      <td className="py-4 px-5 font-black text-sm text-[#0E101A]">
                        ${(p.amountMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-4 px-5">
                        <div className="text-xs font-bold text-[#0E101A]">
                          {p.payoutMethod.replace("_", " ")}
                        </div>
                        <div className="text-[11px] text-[#55585B] truncate max-w-xs">
                          {p.destinationSnapshot?.destinationAccount ||
                            p.destinationSnapshot?.stripeAccountId ||
                            "instructor@vti.edu"}
                        </div>
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
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-5 font-mono text-xs text-[#55585B]">
                        {p.referenceId || "—"}
                      </td>

                      <td className="py-4 px-5 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPayout(p);
                                setDecision("REJECT");
                              }}
                              className="text-xs font-bold text-[#FF7162] border-[#FF7162]/40 hover:bg-[#FF7162]/10 h-8 rounded-xl"
                            >
                              Reject
                            </Button>

                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedPayout(p);
                                setDecision("APPROVE");
                                setReferenceId(`tr_${Date.now().toString(36)}`);
                              }}
                              className="bg-[#09BD3C] hover:bg-[#08a835] text-white font-bold text-xs h-8 gap-1 rounded-xl shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-[#55585B] italic">Processed</span>
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

      {/* Decision Modal */}
      {selectedPayout && decision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#EAEBED] w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#EAEBED] bg-[#FAF9F6]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    decision === "APPROVE"
                      ? "bg-[#09BD3C]/10 text-[#09BD3C]"
                      : "bg-[#FF7162]/10 text-[#FF7162]"
                  }`}
                >
                  {decision === "APPROVE" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0E101A]">
                    {decision === "APPROVE" ? "Authorize Payout Transfer" : "Reject Payout Request"}
                  </h2>
                  <p className="text-xs text-[#55585B]">
                    ${(selectedPayout.amountMinor / 100).toFixed(2)} USD • {selectedPayout.instructor?.name || "Dr. Farooq Khan"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPayout(null);
                  setDecision(null);
                }}
                className="text-[#55585B] hover:text-[#0E101A] p-1.5 rounded-lg hover:bg-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs">
                  {successMsg}
                </div>
              )}

              {decision === "APPROVE" ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0E101A]">
                      Provider Transfer Reference ID
                    </label>
                    <input
                      type="text"
                      value={referenceId}
                      onChange={(e) => setReferenceId(e.target.value)}
                      placeholder="e.g. tr_stripe_1M2b3c4d5e"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:bg-white transition"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0E101A]">Settlement Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Automated Stripe Connect transfer batch"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] text-xs focus:outline-none focus:ring-2 focus:ring-[#09BD3C] focus:bg-white transition"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0E101A]">Rejection Reason</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Bank account details could not be verified by recipient rail."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] text-xs focus:outline-none focus:ring-2 focus:ring-[#FF7162] focus:bg-white transition"
                    required
                  />
                  <p className="text-[11px] text-[#55585B]">
                    Funds will be immediately credited back to the instructor&apos;s available balance.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAEBED]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPayout(null);
                    setDecision(null);
                  }}
                  disabled={loading}
                  className="rounded-xl border-[#EAEBED] text-[#55585B] hover:text-[#0E101A] text-xs font-bold"
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  onClick={handleDecision}
                  disabled={loading || !!successMsg}
                  className={
                    decision === "APPROVE"
                      ? "bg-[#09BD3C] hover:bg-[#08a835] text-white font-bold text-xs rounded-xl shadow-xs"
                      : "bg-[#FF7162] hover:bg-[#e05344] text-white font-bold text-xs rounded-xl shadow-xs"
                  }
                >
                  {loading
                    ? "Submitting..."
                    : decision === "APPROVE"
                    ? "Confirm Transfer & Mark Paid"
                    : "Confirm Rejection"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
