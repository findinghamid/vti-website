"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle2, AlertCircle, X, CreditCard, Landmark, Send } from "lucide-react";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMinor: number;
  onSuccess: () => void;
}

export function WithdrawalModal({
  isOpen,
  onClose,
  availableMinor,
  onSuccess,
}: WithdrawalModalProps) {
  const [amountStr, setAmountStr] = useState<string>(
    availableMinor >= 5000 ? (availableMinor / 100).toFixed(2) : "50.00"
  );
  const [method, setMethod] = useState<"STRIPE_CONNECT" | "PAYPAL" | "BANK_WIRE">("STRIPE_CONNECT");
  const [destination, setDestination] = useState<string>("instructor@vti.edu");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const minWithdrawalDollars = 50.0;
  const availableDollars = availableMinor / 100;
  const parsedAmount = parseFloat(amountStr) || 0;
  const isValidAmount = parsedAmount >= minWithdrawalDollars && parsedAmount <= availableDollars;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount) return;

    setLoading(true);
    setError(null);

    try {
      const amountMinor = Math.round(parsedAmount * 100);
      const res = await fetch("/api/v1/instructor/payouts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountMinor,
          payoutMethod: method,
          destinationDetails: {
            destinationAccount: destination,
            method,
          },
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to submit payout request.");
      }

      setSuccessMsg("Payout request submitted successfully! Funds will be reviewed shortly.");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#EAEBED] w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EAEBED] bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5B35]/10 text-[#FF5B35] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0E101A]">Request Earnings Payout</h2>
              <p className="text-xs text-[#55585B]">
                Withdraw cleared instructor earnings to your account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#55585B] hover:text-[#0E101A] p-1.5 rounded-lg hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Balance info card */}
          <div className="bg-[#FAF9F6] border border-[#FF5B35]/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#FF5B35]">
                Available for Withdrawal
              </div>
              <div className="text-2xl font-black text-[#0E101A]">
                ${availableDollars.toFixed(2)} USD
              </div>
            </div>
            <div className="text-right text-[11px] font-semibold text-[#55585B]">
              Min. threshold: $50.00
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0E101A]">Withdrawal Amount ($ USD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55585B] font-bold text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="50"
                max={availableDollars}
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5B35] focus:bg-white transition"
                placeholder="50.00"
                required
              />
            </div>
            {parsedAmount > availableDollars && (
              <p className="text-[11px] text-[#FF7162] font-semibold">
                Amount exceeds your available balance (${availableDollars.toFixed(2)}).
              </p>
            )}
            {parsedAmount < minWithdrawalDollars && (
              <p className="text-[11px] text-[#D97706] font-semibold">
                Minimum withdrawal amount is $50.00 USD.
              </p>
            )}
          </div>

          {/* Method selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0E101A]">Payout Method</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod("STRIPE_CONNECT")}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition ${
                  method === "STRIPE_CONNECT"
                    ? "border-[#FF5B35] bg-[#FF5B35]/10 text-[#FF5B35] font-bold shadow-xs"
                    : "border-[#EAEBED] hover:bg-[#FAF9F6] text-[#55585B]"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-xs">Stripe Connect</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("PAYPAL")}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition ${
                  method === "PAYPAL"
                    ? "border-[#FF5B35] bg-[#FF5B35]/10 text-[#FF5B35] font-bold shadow-xs"
                    : "border-[#EAEBED] hover:bg-[#FAF9F6] text-[#55585B]"
                }`}
              >
                <Send className="w-4 h-4" />
                <span className="text-xs">PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("BANK_WIRE")}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition ${
                  method === "BANK_WIRE"
                    ? "border-[#FF5B35] bg-[#FF5B35]/10 text-[#FF5B35] font-bold shadow-xs"
                    : "border-[#EAEBED] hover:bg-[#FAF9F6] text-[#55585B]"
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span className="text-xs">Bank Wire</span>
              </button>
            </div>
          </div>

          {/* Destination Details */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0E101A]">
              {method === "STRIPE_CONNECT" && "Connected Stripe Account Email / ID"}
              {method === "PAYPAL" && "PayPal Recipient Email Address"}
              {method === "BANK_WIRE" && "IBAN / Account Number & Bank Code"}
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B35] focus:bg-white transition"
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#55585B]">Notes / Reference (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Q3 earnings transfer"
              className="w-full px-3.5 py-2 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5B35] focus:bg-white transition"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAEBED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border-[#EAEBED] text-[#55585B] hover:text-[#0E101A] text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!isValidAmount || loading || !!successMsg}
              className="bg-[#FF5B35] hover:bg-[#3b50df] text-white gap-2 font-bold px-5 rounded-xl shadow-xs"
            >
              {loading ? "Processing..." : `Submit Payout ($${parsedAmount.toFixed(2)})`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
