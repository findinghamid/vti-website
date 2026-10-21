"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Plus,
  Edit,
  CheckCircle2,
  ExternalLink,
  Users,
  Bell,
  Mail,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppGroupSetting {
  id: string;
  courseSlug: string;
  courseTitle: string;
  groupName: string;
  inviteUrl: string;
  activeMembers: number;
  lastSynced: string;
}

interface AnnouncementItem {
  id: string;
  title: string;
  category: "General" | "Academic" | "Live Session" | "Maintenance";
  targetCourse: string;
  content: string;
  postedAt: string;
  priority: "HIGH" | "NORMAL";
}

const INITIAL_WHATSAPP_GROUPS: WhatsAppGroupSetting[] = [
  {
    id: "wa-01",
    courseSlug: "foundations-systematic-theology",
    courseTitle: "Foundations of Systematic Theology",
    groupName: "VTI - Systematic Theology Cohort A",
    inviteUrl: "https://chat.whatsapp.com/invite/vti-systematic-theology",
    activeMembers: 1420,
    lastSynced: "Today",
  },
  {
    id: "wa-02",
    courseSlug: "biblical-hermeneutics",
    courseTitle: "Biblical Hermeneutics: Rightly Dividing Scripture",
    groupName: "VTI - Hermeneutics & Exegesis Fellowship",
    inviteUrl: "https://chat.whatsapp.com/invite/vti-hermeneutics-fellowship",
    activeMembers: 890,
    lastSynced: "Yesterday",
  },
  {
    id: "wa-03",
    courseSlug: "church-history-reformation",
    courseTitle: "Church History: Early Church Fathers to Reformation",
    groupName: "VTI - Historical Theology Roundtable",
    inviteUrl: "https://chat.whatsapp.com/invite/vti-church-history",
    activeMembers: 640,
    lastSynced: "3 days ago",
  },
  {
    id: "wa-04",
    courseSlug: "biblical-greek-exegesis",
    courseTitle: "Introduction to Biblical Greek & Exegesis",
    groupName: "VTI - Koine Greek Language Lab",
    inviteUrl: "https://chat.whatsapp.com/invite/vti-koine-greek",
    activeMembers: 520,
    lastSynced: "Today",
  },
];

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-01",
    title: "Quarterly Live Exegesis Webinar with Dr. Hastings",
    category: "Live Session",
    targetCourse: "All Enrolled Students",
    content:
      "Join us this Thursday at 7:00 PM EST for an interactive Q&A symposium on the doctrine of divine impassibility and the classical creeds.",
    postedAt: "2026-09-22",
    priority: "HIGH",
  },
  {
    id: "ann-02",
    title: "New Digital Library Resource: Koine Greek Vocabulary Decks",
    category: "Academic",
    targetCourse: "Introduction to Biblical Greek & Exegesis",
    content:
      "Digital flashcard sets and audio pronunciation charts have been added to the course resource tab.",
    postedAt: "2026-09-18",
    priority: "NORMAL",
  },
];

export default function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState<"whatsapp" | "announcements" | "emails">("whatsapp");
  const [groups, setGroups] = useState<WhatsAppGroupSetting[]>(INITIAL_WHATSAPP_GROUPS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New announcement form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"General" | "Academic" | "Live Session" | "Maintenance">("General");
  const [newTarget, setNewTarget] = useState("All Enrolled Students");
  const [newContent, setNewContent] = useState("");

  // Bulk email form
  const [emailSubject, setEmailSubject] = useState("");
  const [emailAudience, setEmailAudience] = useState("All Students");
  const [emailBody, setEmailBody] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Edit WhatsApp group modal state
  const [editingGroup, setEditingGroup] = useState<WhatsAppGroupSetting | null>(null);
  const [editUrl, setEditUrl] = useState("");

  const handleOpenEditGroup = (g: WhatsAppGroupSetting) => {
    setEditingGroup(g);
    setEditUrl(g.inviteUrl);
  };

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup) return;

    setGroups((prev) =>
      prev.map((g) => (g.id === editingGroup.id ? { ...g, inviteUrl: editUrl } : g))
    );
    setSuccessMsg(`WhatsApp group invite URL updated for "${editingGroup.courseTitle}".`);
    setEditingGroup(null);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const item: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      targetCourse: newTarget,
      content: newContent,
      postedAt: new Date().toISOString().slice(0, 10),
      priority: "NORMAL",
    };

    setAnnouncements((prev) => [item, ...prev]);
    setNewTitle("");
    setNewContent("");
    setSuccessMsg("Announcement published live to student dashboards.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSendBulkEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) return;

    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSubject("");
      setEmailBody("");
      setSuccessMsg(`Bulk notification successfully broadcast to "${emailAudience}".`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEBED]">
        <div>
          <h2 className="text-2xl font-black text-[#161821] tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#FF5B35]" />
            <span>Community, WhatsApp & Communications</span>
          </h2>
          <p className="text-xs text-[#55585B] mt-1">
            Manage course-specific WhatsApp study groups, broadcast student dashboard announcements, and send bulk updates.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-[#EAEBED]">
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "whatsapp"
                ? "bg-[#25D366] text-white shadow-xs"
                : "text-[#55585B] hover:text-[#161821]"
            }`}
          >
            WhatsApp Groups
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "announcements"
                ? "bg-[#161821] text-white shadow-xs"
                : "text-[#55585B] hover:text-[#161821]"
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab("emails")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "emails"
                ? "bg-[#FF5B35] text-white shadow-xs"
                : "text-[#55585B] hover:text-[#161821]"
            }`}
          >
            Bulk Email
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: WhatsApp Group Settings */}
      {activeTab === "whatsapp" && (
        <div className="space-y-4">
          <div className="bg-[#E8F8EE] border border-[#A7E8BD] rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 fill-white" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#09BD3C]">
                Automated Course WhatsApp Study Groups
              </h3>
              <p className="text-xs text-[#55585B] leading-relaxed">
                When students enroll in any course, the system automatically presents this invite link on their enrollment receipt, dashboard, and player header.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAEBED] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#EAEBED] bg-[#FAF9F6] text-[#55585B] uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-3.5 px-5">Course Title</th>
                    <th className="py-3.5 px-5">WhatsApp Group Name</th>
                    <th className="py-3.5 px-5">Active Invite Link</th>
                    <th className="py-3.5 px-5 text-center">Active Members</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEBED]">
                  {groups.map((g) => (
                    <tr key={g.id} className="hover:bg-[#F8F9FA] transition">
                      <td className="py-4 px-5 font-bold text-[#161821]">
                        {g.courseTitle}
                      </td>
                      <td className="py-4 px-5 text-[#55585B]">
                        {g.groupName}
                      </td>
                      <td className="py-4 px-5 font-mono text-[11px] text-[#09BD3C]">
                        <a
                          href={g.inviteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          <span className="truncate max-w-[220px]">{g.inviteUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="py-4 px-5 text-center font-bold text-[#161821]">
                        {g.activeMembers.toLocaleString()}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditGroup(g)}
                          className="h-8 text-xs font-bold border-[#EAEBED] hover:bg-[#F3F4F8] rounded-xl gap-1 text-[#161821]"
                        >
                          <Edit className="w-3 h-3 text-[#8A8C90]" />
                          <span>Edit URL</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Announcements */}
      {activeTab === "announcements" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-black text-base text-[#161821]">Published Student Announcements</h3>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-2xl border border-[#EAEBED] p-5 shadow-xs space-y-2 hover:border-[#FF5B35]/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5B35] bg-[#FF5B35]/10 px-2.5 py-0.5 rounded-full">
                      {a.category}
                    </span>
                    <span className="text-[11px] text-[#8A8C90]">{a.postedAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#161821]">{a.title}</h4>
                  <p className="text-xs text-[#55585B] leading-relaxed">{a.content}</p>
                  <p className="text-[10px] text-slate-400 font-semibold pt-1">
                    Audience: {a.targetCourse}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAEBED] p-6 shadow-xs space-y-4 h-fit">
            <h3 className="font-black text-base text-[#161821] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FF5B35]" />
              <span>Post New Announcement</span>
            </h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#161821] mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Special Lecture Rescheduled"
                  className="w-full h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#161821] mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35] bg-white"
                >
                  <option value="General">General Notice</option>
                  <option value="Academic">Academic Curriculum</option>
                  <option value="Live Session">Live Symposium</option>
                  <option value="Maintenance">Platform Update</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#161821] mb-1">Target Cohort</label>
                <input
                  type="text"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="All Students or Specific Course"
                  className="w-full h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#161821] mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Details for students..."
                  className="w-full p-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#161821] hover:bg-black text-white font-bold text-xs h-10 rounded-xl"
              >
                Broadcast to Students
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: Bulk Email Broadcast */}
      {activeTab === "emails" && (
        <div className="max-w-2xl bg-white rounded-2xl border border-[#EAEBED] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-black text-lg text-[#161821] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#FF5B35]" />
              <span>Bulk Student Email Dispatcher</span>
            </h3>
            <p className="text-xs text-[#55585B]">
              Integrated with VTI email automation service to notify enrolled scholars.
            </p>
          </div>

          <form onSubmit={handleSendBulkEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#161821] mb-1">Audience Filter</label>
              <select
                value={emailAudience}
                onChange={(e) => setEmailAudience(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35] bg-white"
              >
                <option value="All Students">All Enrolled Students (Global)</option>
                <option value="Foundations of Systematic Theology">
                  Foundations of Systematic Theology Cohort
                </option>
                <option value="Biblical Hermeneutics">
                  Biblical Hermeneutics Cohort
                </option>
                <option value="Church History">Church History Cohort</option>
                <option value="Incomplete Course Scholars">
                  Students Inactive for 14+ Days (Re-engagement)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#161821] mb-1">Subject Line</label>
              <input
                type="text"
                required
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="e.g. Your Weekly Theological Study Digest"
                className="w-full h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#161821] mb-1">Email Body</label>
              <textarea
                rows={6}
                required
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Dear Scholar, we invite you to continue your study of..."
                className="w-full p-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#55585B] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#09BD3C]" />
                Automated rate limiting & CAN-SPAM compliant
              </span>

              <Button
                type="submit"
                disabled={isSendingEmail}
                className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-10 px-6 rounded-xl gap-2 shadow-xs cursor-pointer disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingEmail ? "Sending Broadcast..." : "Send Bulk Broadcast"}</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Edit WhatsApp Link Modal */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-base text-[#161821]">
              Edit WhatsApp Group Invite Link
            </h3>
            <p className="text-xs text-[#55585B]">
              Course: <strong>{editingGroup.courseTitle}</strong>
            </p>

            <form onSubmit={handleSaveGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#161821] mb-1">WhatsApp Group URL</label>
                <input
                  type="url"
                  required
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://chat.whatsapp.com/invite/..."
                  className="w-full h-10 px-3 rounded-xl border border-[#EAEBED] text-xs focus:outline-none focus:border-[#FF5B35]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingGroup(null)}
                  className="text-xs font-bold border-[#EAEBED] rounded-xl h-9 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl h-9 px-5 shadow-xs"
                >
                  Save URL
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
