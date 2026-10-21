"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  BookOpen,
  Users,
  ShieldCheck,
  Mail,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FACULTY_MEMBERS, FacultyMember } from "@/server/services/faculty.service";

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>(FACULTY_MEMBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [credentials, setCredentials] = useState("");
  const [department, setDepartment] = useState("Systematic Theology");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const departments = Array.from(new Set(faculty.map((f) => f.department)));

  const filteredFaculty = faculty.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = departmentFilter === "all" || f.department === departmentFilter;
    return matchSearch && matchDept;
  });

  const handleOpenAdd = () => {
    setName("");
    setTitle("");
    setCredentials("");
    setDepartment("Systematic Theology");
    setEmail("");
    setBio("");
    setEditingFaculty(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (f: FacultyMember) => {
    setEditingFaculty(f);
    setName(f.name);
    setTitle(f.title);
    setCredentials(f.credentials);
    setDepartment(f.department);
    setEmail(f.email);
    setBio(f.bio);
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingFaculty) {
      setFaculty((prev) =>
        prev.map((item) =>
          item.id === editingFaculty.id
            ? { ...item, name, title, credentials, department, email, bio }
            : item
        )
      );
      setSuccessMsg(`Faculty profile for "${name}" updated successfully.`);
    } else {
      const newSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const newMember: FacultyMember = {
        id: `faculty-${Date.now()}`,
        slug: newSlug,
        name,
        title,
        credentials,
        department,
        avatarUrl: "/assets/img/teacher/teacher-1.png",
        email,
        bio,
        teachingPhilosophy: "Dedicated to the proclamation and rigorous study of Scripture.",
        education: [{ degree: "Doctor of Theology", institution: "Theological Seminary", year: "2015" }],
        expertise: [department, "Biblical Studies"],
        publications: [],
        coursesTaught: [],
        socialLinks: {},
      };
      setFaculty((prev) => [newMember, ...prev]);
      setSuccessMsg(`New faculty profile "${name}" added to VTI.`);
    }

    setIsAddModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDelete = (id: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove "${memberName}" from faculty records?`)) {
      setFaculty((prev) => prev.filter((f) => f.id !== id));
      setSuccessMsg(`Faculty member "${memberName}" removed.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEBED]">
        <div>
          <h2 className="text-2xl font-black text-[#161821] tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#FF5B35]" />
            <span>Faculty & Instructor Management</span>
          </h2>
          <p className="text-xs text-[#55585B] mt-1">
            Admin-controlled directory of professors, theological scholars, academic credentials, and assigned courses.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Faculty Member</span>
        </Button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#EAEBED] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8A8C90] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, title, or email..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-[#55585B] whitespace-nowrap">Department:</label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35] bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFaculty.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#FF5B35]/40 transition group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-[#FF5B35]/30 bg-slate-100">
                    <Image
                      src={member.avatarUrl}
                      alt={member.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#161821] group-hover:text-[#FF5B35] transition leading-snug">
                      {member.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-[#FF5B35] bg-[#FF5B35]/10 px-2 py-0.5 rounded">
                      {member.credentials}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/faculty/${member.slug}`}
                  target="_blank"
                  className="p-1.5 rounded-lg border border-[#EAEBED] text-[#55585B] hover:text-[#FF5B35] hover:bg-[#F3F4F8] transition"
                  title="View Public Profile"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#161821]">{member.title}</p>
                <p className="text-[11px] text-[#55585B]">{member.department}</p>
                <p className="text-[11px] text-[#8A8C90] flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3 text-[#FF5B35]" />
                  <span>{member.email}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-[#EAEBED] flex items-center justify-between text-[11px] text-[#55585B]">
                <span className="flex items-center gap-1 font-semibold text-[#161821]">
                  <BookOpen className="w-3.5 h-3.5 text-[#FF5B35]" />
                  {member.coursesTaught.length} Courses Taught
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#09BD3C]" />
                  {member.coursesTaught.reduce((acc, c) => acc + c.students, 0).toLocaleString()} Scholars
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAEBED] flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(member)}
                className="h-8 text-xs font-bold border-[#EAEBED] hover:bg-[#F3F4F8] rounded-xl flex-1 gap-1 text-[#161821]"
              >
                <Edit className="w-3 h-3 text-[#8A8C90]" />
                <span>Edit Profile</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(member.id, member.name)}
                className="h-8 px-2.5 text-xs border-[#EAEBED] hover:bg-rose-50 hover:text-rose-600 rounded-xl text-[#8A8C90]"
                title="Remove Faculty Member"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Faculty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEBED]">
              <h3 className="font-black text-lg text-[#161821]">
                {editingFaculty ? "Edit Faculty Profile" : "Add New Theological Faculty"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#161821]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#161821] mb-1">Full Name & Honorific</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Andrew Hastings"
                  className="w-full h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#161821] mb-1">Credentials</label>
                  <input
                    type="text"
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                    placeholder="e.g. Th.D., M.Div."
                    className="w-full h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#161821] mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35] bg-white"
                  >
                    <option value="Systematic Theology">Systematic Theology</option>
                    <option value="Biblical Hermeneutics">Biblical Hermeneutics</option>
                    <option value="Biblical Languages">Biblical Languages</option>
                    <option value="Church History">Church History</option>
                    <option value="Apologetics & Ethics">Apologetics & Ethics</option>
                    <option value="Pastoral Ministry">Pastoral Ministry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#161821] mb-1">Academic Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chair of Systematic & Historical Theology"
                  className="w-full h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#161821] mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="faculty@vti-edu.org"
                  className="w-full h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#161821] mb-1">Biography & Teaching Philosophy</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Theological background and scholarly focus..."
                  className="w-full p-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
                />
              </div>

              <div className="pt-3 border-t border-[#EAEBED] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs font-bold border-[#EAEBED] rounded-xl h-10 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-xs font-bold bg-[#FF5B35] hover:bg-[#E04824] text-white rounded-xl h-10 px-5 shadow-xs"
                >
                  {editingFaculty ? "Save Changes" : "Create Faculty Profile"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
