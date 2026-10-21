"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  DollarSign,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Search,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DepositRecord {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  depositAmount: number;
  progressPct: number;
  status: "REFUNDED" | "HELD_IN_ESCROW" | "REFUND_QUEUED";
  gateway: "Stripe" | "PayPal" | "Endowed Scholarship";
  transactionId: string;
  enrolledAt: string;
  refundedAt?: string;
}

const INITIAL_FINANCIAL_RECORDS: DepositRecord[] = [
  {
    id: "tx-001",
    studentName: "Jonathan Edwards Jr.",
    studentEmail: "j.edwards@reformedstudies.org",
    courseTitle: "Foundations of Systematic Theology",
    depositAmount: 49,
    progressPct: 100,
    status: "REFUNDED",
    gateway: "Stripe",
    transactionId: "ch_3N8s9fVTI001",
    enrolledAt: "2026-06-15",
    refundedAt: "2026-08-20",
  },
  {
    id: "tx-002",
    studentName: "Alex Morgan",
    studentEmail: "alex.morgan@example.com",
    courseTitle: "Foundations of Systematic Theology",
    depositAmount: 49,
    progressPct: 100,
    status: "REFUND_QUEUED",
    gateway: "Stripe",
    transactionId: "ch_3N8s9fVTI002",
    enrolledAt: "2026-08-10",
  },
  {
    id: "tx-003",
    studentName: "Hannah C. Rutherford",
    studentEmail: "hannah.rutherford@fellowship.edu",
    courseTitle: "Introduction to Biblical Greek & Exegesis",
    depositAmount: 49,
    progressPct: 92,
    status: "HELD_IN_ESCROW",
    gateway: "Stripe",
    transactionId: "ch_3N8s9fVTI003",
    enrolledAt: "2026-07-01",
  },
  {
    id: "tx-004",
    studentName: "Samuel B. Kuyper",
    studentEmail: "s.kuyper@theologymail.net",
    courseTitle: "Church History: Early Church Fathers to Reformation",
    depositAmount: 49,
    progressPct: 85,
    status: "HELD_IN_ESCROW",
    gateway: "PayPal",
    transactionId: "pp_9K3b2cVTI004",
    enrolledAt: "2026-07-18",
  },
  {
    id: "tx-005",
    studentName: "Grace M. Athanasius",
    studentEmail: "grace.athanasius@biblicalheritage.org",
    courseTitle: "Christian Apologetics & Cultural Ethics",
    depositAmount: 0,
    progressPct: 64,
    status: "REFUNDED",
    gateway: "Endowed Scholarship",
    transactionId: "endow_schol_005",
    enrolledAt: "2026-08-01",
    refundedAt: "2026-08-01",
  },
  {
    id: "tx-006",
    studentName: "David L. Owen",
    studentEmail: "david.owen@puritanstudies.com",
    courseTitle: "Pastoral Ministry & Expository Preaching",
    depositAmount: 49,
    progressPct: 45,
    status: "HELD_IN_ESCROW",
    gateway: "Stripe",
    transactionId: "ch_3N8s9fVTI006",
    enrolledAt: "2026-08-20",
  },
];

export default function AdminFinancesPage() {
  const [records, setRecords] = useState<DepositRecord[]>(INITIAL_FINANCIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const totalHeldInEscrow = records
    .filter((r) => r.status === "HELD_IN_ESCROW" || r.status === "REFUND_QUEUED")
    .reduce((sum, r) => sum + r.depositAmount, 0);

  const totalRefunded = records
    .filter((r) => r.status === "REFUNDED" && r.depositAmount > 0)
    .reduce((sum, r) => sum + r.depositAmount, 0);

  const totalDepositsReceived = records.reduce((sum, r) => sum + r.depositAmount, 0);

  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleProcessRefund = (id: string, name: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "REFUNDED",
              refundedAt: new Date().toISOString().slice(0, 10),
            }
          : r
      )
    );
    setSuccessMsg(`100% completion refund successfully released for "${name}".`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleExportCSV = () => {
    const headers = [
      "Transaction ID",
      "Student Name",
      "Email",
      "Course Title",
      "Deposit ($)",
      "Progress (%)",
      "Refund Status",
      "Gateway",
      "Enrollment Date",
      "Refund Release Date",
    ];

    const rows = filteredRecords.map((r) => [
      r.transactionId,
      `"${r.studentName}"`,
      `"${r.studentEmail}"`,
      `"${r.courseTitle}"`,
      r.depositAmount,
      r.progressPct,
      r.status,
      r.gateway,
      r.enrolledAt,
      r.refundedAt || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `VTI_Financial_Refunds_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEBED]">
        <div>
          <h2 className="text-2xl font-black text-[#161821] tracking-tight flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-[#FF5B35]" />
            <span>Financial & 100% Deposit Refund Tracker</span>
          </h2>
          <p className="text-xs text-[#55585B] mt-1">
            Real-time audit of student commitment deposits, automated completion refunds, and ministry escrow balances.
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          className="bg-[#161821] hover:bg-black text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial Report (CSV)</span>
        </Button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EAEBED] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-[#8A8C90] uppercase">Total Deposits Received</p>
          <p className="text-2xl font-black text-[#161821]">${totalDepositsReceived}</p>
          <p className="text-[10px] text-[#55585B]">Accountability escrow intake</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EAEBED] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-[#8A8C90] uppercase">100% Refunds Released</p>
          <p className="text-2xl font-black text-[#09BD3C]">${totalRefunded}</p>
          <p className="text-[10px] text-[#09BD3C] font-semibold">Credited to graduates</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EAEBED] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-[#8A8C90] uppercase">Held in Active Escrow</p>
          <p className="text-2xl font-black text-[#FF5B35]">${totalHeldInEscrow}</p>
          <p className="text-[10px] text-[#55585B]">Pending course completions</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EAEBED] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-[#8A8C90] uppercase">Endowed Free Scholars</p>
          <p className="text-2xl font-black text-[#FFC221]">
            {records.filter((r) => r.depositAmount === 0).length}
          </p>
          <p className="text-[10px] text-[#8C6200]">100% Scholarship seats</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-[#EAEBED] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8A8C90] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, course, or transaction ID..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-[#55585B] whitespace-nowrap">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35] bg-white"
          >
            <option value="all">All Transactions</option>
            <option value="REFUNDED">100% Refund Released</option>
            <option value="REFUND_QUEUED">Queued for Release</option>
            <option value="HELD_IN_ESCROW">Held in Escrow</option>
          </select>
        </div>
      </div>

      {/* Transactions & Refund Processing Table */}
      <div className="bg-white rounded-2xl border border-[#EAEBED] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAEBED] bg-[#FAF9F6] text-[#55585B] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3.5 px-5">Student / Transaction</th>
                <th className="py-3.5 px-5">Enrolled Course</th>
                <th className="py-3.5 px-5 text-center">Deposit Amount</th>
                <th className="py-3.5 px-5 text-center">Coursework Progress</th>
                <th className="py-3.5 px-5 text-center">Refund Status</th>
                <th className="py-3.5 px-5">Gateway</th>
                <th className="py-3.5 px-5 text-right">Refund Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEBED]">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-[#F8F9FA] transition">
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-bold text-[#161821]">{r.studentName}</p>
                      <p className="text-[10px] text-[#8A8C90]">{r.studentEmail}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">{r.transactionId}</p>
                    </div>
                  </td>

                  <td className="py-4 px-5 max-w-[200px]">
                    <p className="font-semibold text-[#161821] truncate">{r.courseTitle}</p>
                    <p className="text-[10px] text-[#8A8C90]">Enrolled {r.enrolledAt}</p>
                  </td>

                  <td className="py-4 px-5 text-center font-black text-sm text-[#161821]">
                    {r.depositAmount > 0 ? `$${r.depositAmount}` : "Free ($0)"}
                  </td>

                  <td className="py-4 px-5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px] ${
                        r.progressPct === 100
                          ? "bg-[#E8F8EE] text-[#09BD3C]"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {r.progressPct === 100 && <CheckCircle2 className="w-3 h-3" />}
                      {r.progressPct}% Complete
                    </span>
                  </td>

                  <td className="py-4 px-5 text-center">
                    {r.status === "REFUNDED" ? (
                      <span className="inline-flex items-center gap-1 font-bold text-[#09BD3C] bg-[#E8F8EE] px-2.5 py-0.5 rounded-full text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        100% Refunded
                      </span>
                    ) : r.status === "REFUND_QUEUED" ? (
                      <span className="inline-flex items-center gap-1 font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full text-[11px]">
                        <Clock className="w-3 h-3" />
                        Ready to Release
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-[#B87A00] bg-[#FFF6DF] px-2.5 py-0.5 rounded-full text-[11px]">
                        <Clock className="w-3 h-3" />
                        Held in Escrow
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-5 text-[#55585B] text-[11px]">
                    {r.gateway}
                  </td>

                  <td className="py-4 px-5 text-right">
                    {r.status === "REFUND_QUEUED" ? (
                      <Button
                        size="sm"
                        onClick={() => handleProcessRefund(r.id, r.studentName)}
                        className="h-8 text-xs font-bold bg-[#09BD3C] hover:bg-[#079b31] text-white rounded-xl gap-1 shadow-xs"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Release Refund</span>
                      </Button>
                    ) : r.status === "REFUNDED" ? (
                      <span className="text-[11px] text-[#09BD3C] font-semibold">
                        Released ({r.refundedAt})
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProcessRefund(r.id, r.studentName)}
                        className="h-8 text-xs font-semibold border-[#EAEBED] hover:bg-slate-100 rounded-xl text-slate-600"
                        title="Early release or manual refund"
                      >
                        Manual Release
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
