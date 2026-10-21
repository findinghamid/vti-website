"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  UserCheck,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Filter,
  Eye,
  Mail,
  Flame,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  enrolledCourses: string[];
  progressPct: number;
  quizzesPassed: number;
  quizAveragePct: number;
  certificatesEarned: number;
  studyStreakDays: number;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
  enrolledAt: string;
  lastActive: string;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: "stu-001",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    avatarUrl: "/assets/img/testimonial/testi-author-4.png",
    enrolledCourses: [
      "Foundations of Systematic Theology",
      "Biblical Hermeneutics: Rightly Dividing Scripture",
      "Church History: Early Church Fathers to Reformation",
    ],
    progressPct: 78,
    quizzesPassed: 21,
    quizAveragePct: 96.4,
    certificatesEarned: 1,
    studyStreakDays: 9,
    status: "ACTIVE",
    enrolledAt: "2026-08-10",
    lastActive: "Today",
  },
  {
    id: "stu-002",
    name: "Jonathan Edwards Jr.",
    email: "j.edwards@reformedstudies.org",
    avatarUrl: "/assets/img/testimonial/testi-author-1.png",
    enrolledCourses: [
      "Foundations of Systematic Theology",
      "Pastoral Ministry & Expository Preaching",
      "Christian Apologetics & Cultural Ethics",
      "Introduction to Biblical Greek & Exegesis",
      "Church History: Early Church Fathers to Reformation",
      "Covenant Theology & Redemptive History",
    ],
    progressPct: 100,
    quizzesPassed: 38,
    quizAveragePct: 99.2,
    certificatesEarned: 4,
    studyStreakDays: 24,
    status: "COMPLETED",
    enrolledAt: "2026-06-15",
    lastActive: "Today",
  },
  {
    id: "stu-003",
    name: "Hannah C. Rutherford",
    email: "hannah.rutherford@fellowship.edu",
    avatarUrl: "/assets/img/testimonial/testi-author-2.png",
    enrolledCourses: [
      "Introduction to Biblical Greek & Exegesis",
      "Foundations of Systematic Theology",
      "Biblical Hermeneutics: Rightly Dividing Scripture",
    ],
    progressPct: 92,
    quizzesPassed: 32,
    quizAveragePct: 98.5,
    certificatesEarned: 2,
    studyStreakDays: 18,
    status: "ACTIVE",
    enrolledAt: "2026-07-01",
    lastActive: "Yesterday",
  },
  {
    id: "stu-004",
    name: "Samuel B. Kuyper",
    email: "s.kuyper@theologymail.net",
    avatarUrl: "/assets/img/testimonial/testi-author-3.png",
    enrolledCourses: [
      "Church History: Early Church Fathers to Reformation",
      "Christian Apologetics & Cultural Ethics",
    ],
    progressPct: 85,
    quizzesPassed: 28,
    quizAveragePct: 97.8,
    certificatesEarned: 2,
    studyStreakDays: 14,
    status: "ACTIVE",
    enrolledAt: "2026-07-18",
    lastActive: "2 days ago",
  },
  {
    id: "stu-005",
    name: "Grace M. Athanasius",
    email: "grace.athanasius@biblicalheritage.org",
    avatarUrl: "/assets/img/course/course-5-teacher-1.png",
    enrolledCourses: [
      "Foundations of Systematic Theology",
      "Christian Apologetics & Cultural Ethics",
    ],
    progressPct: 64,
    quizzesPassed: 19,
    quizAveragePct: 95.7,
    certificatesEarned: 1,
    studyStreakDays: 7,
    status: "ACTIVE",
    enrolledAt: "2026-08-01",
    lastActive: "Yesterday",
  },
  {
    id: "stu-006",
    name: "David L. Owen",
    email: "david.owen@puritanstudies.com",
    avatarUrl: "/assets/img/teacher/teacher-1.png",
    enrolledCourses: ["Pastoral Ministry & Expository Preaching"],
    progressPct: 45,
    quizzesPassed: 16,
    quizAveragePct: 94.2,
    certificatesEarned: 0,
    studyStreakDays: 5,
    status: "ACTIVE",
    enrolledAt: "2026-08-20",
    lastActive: "3 days ago",
  },
];

export default function AdminStudentsPage() {
  const [students] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.enrolledCourses.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Client-side CSV Export Generator
  const handleExportCSV = () => {
    const headers = [
      "Student ID",
      "Name",
      "Email",
      "Enrolled Courses",
      "Overall Progress (%)",
      "Quizzes Passed",
      "Quiz Average (%)",
      "Certificates Earned",
      "Study Streak (Days)",
      "Status",
      "Enrollment Date",
      "Last Active",
    ];

    const rows = filteredStudents.map((s) => [
      s.id,
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.enrolledCourses.join("; ")}"`,
      s.progressPct,
      s.quizzesPassed,
      s.quizAveragePct,
      s.certificatesEarned,
      s.studyStreakDays,
      s.status,
      s.enrolledAt,
      s.lastActive,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VTI_Students_Export_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <UserCheck className="w-6 h-6 text-[#FF5B35]" />
            <span>Student Database & Progress</span>
          </h2>
          <p className="text-xs text-[#55585B] mt-1">
            Track individual student progress, quiz performance, active courses, and export full reports to CSV.
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          className="bg-[#161821] hover:bg-black text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Student Data (CSV)</span>
        </Button>
      </div>

      {/* Quick Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EAEBED] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-[#8A8C90] uppercase">Total Active Scholars</p>
          <p className="text-2xl font-black text-[#161821]">{students.length.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EAEBED] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-[#8A8C90] uppercase">Average Progress</p>
          <p className="text-2xl font-black text-[#09BD3C]">
            {Math.round(students.reduce((a, b) => a + b.progressPct, 0) / students.length)}%
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EAEBED] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-[#8A8C90] uppercase">Quizzes Passed</p>
          <p className="text-2xl font-black text-[#FF5B35]">
            {students.reduce((a, b) => a + b.quizzesPassed, 0)}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EAEBED] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-[#8A8C90] uppercase">Certificates Issued</p>
          <p className="text-2xl font-black text-[#FFC221]">
            {students.reduce((a, b) => a + b.certificatesEarned, 0)}
          </p>
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
            placeholder="Search student, email, or course..."
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
            <option value="all">All Scholars</option>
            <option value="ACTIVE">Active in Study</option>
            <option value="COMPLETED">Coursework Completed</option>
          </select>
        </div>
      </div>

      {/* Student Database Table */}
      <div className="bg-white rounded-2xl border border-[#EAEBED] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAEBED] bg-[#FAF9F6] text-[#55585B] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3.5 px-5">Student Scholar</th>
                <th className="py-3.5 px-5">Enrolled Coursework</th>
                <th className="py-3.5 px-5 text-center">Curriculum Progress</th>
                <th className="py-3.5 px-5 text-center">Quiz Mastery</th>
                <th className="py-3.5 px-5 text-center">Credentials</th>
                <th className="py-3.5 px-5">Last Active</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEBED]">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-[#F8F9FA] transition">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#EAEBED]">
                        <Image
                          src={s.avatarUrl}
                          alt={s.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#161821]">{s.name}</p>
                        <p className="text-[10px] text-[#8A8C90]">{s.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5 max-w-[220px]">
                    <p className="font-semibold text-[#161821] truncate">
                      {s.enrolledCourses[0]}
                    </p>
                    {s.enrolledCourses.length > 1 && (
                      <p className="text-[10px] text-[#8A8C90]">
                        +{s.enrolledCourses.length - 1} additional courses
                      </p>
                    )}
                  </td>

                  <td className="py-4 px-5 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#09BD3C] rounded-full"
                          style={{ width: `${s.progressPct}%` }}
                        />
                      </div>
                      <span className="font-bold text-[#161821]">{s.progressPct}%</span>
                    </div>
                  </td>

                  <td className="py-4 px-5 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-[#09BD3C] bg-[#E8F8EE] px-2 py-0.5 rounded-full text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {s.quizAveragePct}% ({s.quizzesPassed} quizzes)
                    </span>
                  </td>

                  <td className="py-4 px-5 text-center">
                    {s.certificatesEarned > 0 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-[#8C6200] bg-[#FFF6DF] px-2 py-0.5 rounded-full text-[11px]">
                        <Award className="w-3 h-3 text-[#FFC221]" />
                        {s.certificatesEarned} Issued
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>

                  <td className="py-4 px-5 text-[#55585B] text-[11px]">
                    {s.lastActive}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStudent(s)}
                      className="h-8 text-xs font-bold border-[#EAEBED] hover:bg-[#F3F4F8] rounded-xl gap-1 text-[#161821]"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#8A8C90]" />
                      <span>Inspect</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Student Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEBED]">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#EAEBED]">
                  <Image
                    src={selectedStudent.avatarUrl}
                    alt={selectedStudent.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#161821]">{selectedStudent.name}</h3>
                  <p className="text-xs text-[#55585B]">{selectedStudent.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#161821]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#55585B]">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAEBED]">
                <div>
                  <span className="font-bold text-[#161821] block">Overall Progress</span>
                  <span className="text-lg font-black text-[#09BD3C]">{selectedStudent.progressPct}%</span>
                </div>
                <div>
                  <span className="font-bold text-[#161821] block">Average Quiz Score</span>
                  <span className="text-lg font-black text-[#FF5B35]">{selectedStudent.quizAveragePct}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#161821] mb-2">Enrolled Course Curricula</h4>
                <ul className="space-y-2">
                  {selectedStudent.enrolledCourses.map((c, i) => (
                    <li key={i} className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#EAEBED] flex items-center justify-between">
                      <span className="font-semibold text-[#161821]">{c}</span>
                      <CheckCircle2 className="w-4 h-4 text-[#09BD3C]" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EAEBED] flex justify-end">
              <Button
                onClick={() => setSelectedStudent(null)}
                className="text-xs font-bold bg-[#161821] text-white rounded-xl h-10 px-5"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
