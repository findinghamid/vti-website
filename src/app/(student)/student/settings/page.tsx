"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Save,
  Camera,
  Upload,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PRESET_AVATARS = [
  { label: "Theology Scholar", url: "/assets/img/dashboard/profile/dashboard-profile-2.jpg" },
  { label: "Seminary Student", url: "/assets/img/dashboard/profile/dashboard-profile.jpg" },
  { label: "Exegetical Scholar", url: "/assets/img/teacher/teacher-1.png" },
  { label: "Biblical Languages", url: "/assets/img/teacher/teacher-2.png" },
  { label: "Church Historian", url: "/assets/img/teacher/teacher-3.png" },
  { label: "Pastoral Mentor", url: "/assets/img/teacher/teacher-4.png" },
];

export default function StudentSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/assets/img/dashboard/profile/dashboard-profile-2.jpg");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & loading
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Live password validation
  const passwordCriteria = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirmPassword,
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/v1/student/settings");
      const data = await res.json();
      if (data.success && data.data?.user) {
        setName(data.data.user.name || "");
        setEmail(data.data.user.email || "");
        setPhone(data.data.user.phone || "");
        setBio(data.data.user.bio || "");
        if (data.data.user.avatarUrl) {
          setAvatarUrl(data.data.user.avatarUrl);
        }
      }
    } catch (e) {
      console.error("Failed loading student profile", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setStatusMessage({ type: "error", text: "Image file size must be under 2MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result;
      if (typeof result === "string") {
        setAvatarUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/v1/student/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatarUrl, phone, bio }),
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({
          type: "success",
          text: data.data?.message || "Profile details saved successfully!",
        });
        if (data.data?.user) {
          try {
            localStorage.setItem("vti_cached_user", JSON.stringify(data.data.user));
          } catch {}
          window.dispatchEvent(new CustomEvent("vti_user_updated", { detail: data.data.user }));
        }
        router.refresh();
      } else {
        throw new Error(data.error?.message || "Failed saving profile details.");
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An error occurred while updating profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (
      !passwordCriteria.length ||
      !passwordCriteria.uppercase ||
      !passwordCriteria.lowercase ||
      !passwordCriteria.number
    ) {
      setStatusMessage({
        type: "error",
        text: "New password does not meet the required security standards.",
      });
      return;
    }

    if (!passwordCriteria.match) {
      setStatusMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/v1/student/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({
          type: "success",
          text: "Password updated successfully! Please use your new password next time you sign in.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        throw new Error(data.error?.message || "Failed to update password.");
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An error occurred while changing password.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="pb-6 border-b border-[#EAEBED]">
        <h1 className="text-2xl sm:text-3xl font-black text-[#161821] tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#55585B] mt-1">
          Manage your personal student details, contact information, and security credentials.
        </p>
      </div>

      {/* Tabs matching VTI tpd-setting-tab */}
      <div className="flex items-center gap-2 border-b border-[#EAEBED] pb-3 text-xs font-bold">
        <button
          onClick={() => {
            setActiveTab("profile");
            setStatusMessage(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#FF5B35] text-white shadow-xs font-bold"
              : "bg-white border border-[#EAEBED] text-[#55585B] hover:text-[#161821] hover:border-[#FF5B35]"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Information</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("password");
            setStatusMessage(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "password"
              ? "bg-[#FF5B35] text-white shadow-xs font-bold"
              : "bg-white border border-[#EAEBED] text-[#55585B] hover:text-[#161821] hover:border-[#FF5B35]"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-[#E8F8EE] border border-[#09BD3C]/30 text-[#09BD3C]"
              : "bg-[#FFF2F2] border border-[#FF4A55]/30 text-[#FF4A55]"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tab 1: Profile Information */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
            {/* Profile Picture / Avatar Management */}
            <div className="space-y-4 pb-6 border-b border-[#EAEBED]">
              <label className="text-xs font-bold text-[#161821] flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#FF5B35]" />
                <span>Profile Photo</span>
              </label>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Live Preview */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-[#FF5B35]/15 shadow-md bg-white shrink-0 border border-[#EAEBED]">
                  <Image
                    src={avatarUrl || "/assets/img/dashboard/profile/dashboard-profile-2.jpg"}
                    alt={name || "User Avatar"}
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized={avatarUrl.startsWith("data:")}
                  />
                </div>

                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF5B35] hover:bg-[#E04824] transition cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Picture</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setAvatarUrl("/assets/img/dashboard/profile/dashboard-profile-2.jpg")}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#55585B] border border-[#EAEBED] hover:bg-[#F3F4F8] transition cursor-pointer"
                    >
                      Reset Default
                    </button>
                  </div>

                  {/* Preset Quick Select */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-[#8A8C90] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FFC221]" /> Or choose from preset avatars:
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {PRESET_AVATARS.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setAvatarUrl(preset.url)}
                          className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                            avatarUrl === preset.url
                              ? "border-[#FF5B35] ring-2 ring-[#FF5B35]/30 scale-105"
                              : "border-[#EAEBED] opacity-70 hover:opacity-100 hover:border-slate-400"
                          }`}
                          title={preset.label}
                        >
                          <Image
                            src={preset.url}
                            alt={preset.label}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                          {avatarUrl === preset.url && (
                            <div className="absolute inset-0 bg-[#FF5B35]/30 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white stroke-[3]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#161821] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FF5B35]" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full h-11 px-4 text-xs font-medium text-[#161821] bg-[#F8F9FA] border border-[#EAEBED] rounded-xl focus:border-[#FF5B35] focus:bg-white focus:outline-none transition"
              />
            </div>

            {/* Email (Read-only for safety) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#161821] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FF5B35]" />
                <span>Email Address</span>
                <span className="text-[10px] text-[#8A8C90] font-normal">(Primary account ID)</span>
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full h-11 px-4 text-xs font-medium text-[#8A8C90] bg-[#F3F4F8] border border-[#EAEBED] rounded-xl cursor-not-allowed"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#161821] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#FF5B35]" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-11 px-4 text-xs font-medium text-[#161821] bg-[#F8F9FA] border border-[#EAEBED] rounded-xl focus:border-[#FF5B35] focus:bg-white focus:outline-none transition"
              />
            </div>

            {/* Headline / Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#161821] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FF5B35]" />
                <span>Student Headline / Bio</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Software Engineering Student, AI Enthusiast..."
                rows={4}
                className="w-full p-4 text-xs font-medium text-[#161821] bg-[#F8F9FA] border border-[#EAEBED] rounded-xl focus:border-[#FF5B35] focus:bg-white focus:outline-none transition resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-11 px-6 rounded-xl shadow-xs gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Profile Details"}</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === "password" && (
        <div className="bg-white rounded-2xl border border-[#EAEBED] p-6 sm:p-8 shadow-xs">
          <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#161821] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#FF5B35]" />
                <span>Current Password</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  className="w-full h-11 pl-4 pr-10 text-xs font-medium text-[#161821] bg-[#F8F9FA] border border-[#EAEBED] rounded-xl focus:border-[#FF5B35] focus:bg-white focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8C90] hover:text-[#161821] cursor-pointer"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#161821] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF5B35]" />
                <span>New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a secure new password"
                  required
                  className="w-full h-11 pl-4 pr-10 text-xs font-medium text-[#161821] bg-[#F8F9FA] border border-[#EAEBED] rounded-xl focus:border-[#FF5B35] focus:bg-white focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8C90] hover:text-[#161821] cursor-pointer"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Checklist */}
              {newPassword.length > 0 && (
                <div className="p-3 bg-[#FAF9F6] border border-[#EAEBED] rounded-xl space-y-1 text-[11px] mt-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        passwordCriteria.length ? "text-[#09BD3C]" : "text-[#8A8C90]"
                      }
                    >
                      ●
                    </span>
                    <span>At least 8 characters long</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        passwordCriteria.uppercase ? "text-[#09BD3C]" : "text-[#8A8C90]"
                      }
                    >
                      ●
                    </span>
                    <span>Contains at least one uppercase letter (A-Z)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        passwordCriteria.lowercase ? "text-[#09BD3C]" : "text-[#8A8C90]"
                      }
                    >
                      ●
                    </span>
                    <span>Contains at least one lowercase letter (a-z)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        passwordCriteria.number ? "text-[#09BD3C]" : "text-[#8A8C90]"
                      }
                    >
                      ●
                    </span>
                    <span>Contains at least one number (0-9)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#161821]">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
                className="w-full h-11 px-4 text-xs font-medium text-[#161821] bg-[#F8F9FA] border border-[#EAEBED] rounded-xl focus:border-[#FF5B35] focus:bg-white focus:outline-none transition"
              />
              {confirmPassword.length > 0 && !passwordCriteria.match && (
                <p className="text-[11px] text-[#FF4A55] font-semibold">
                  Passwords do not match.
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#FF5B35] hover:bg-[#E04824] text-white font-bold text-xs h-11 px-6 rounded-xl shadow-xs gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{isSaving ? "Updating..." : "Update Password"}</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
