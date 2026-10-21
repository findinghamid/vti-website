"use client";

import React, { useState } from "react";
import { PlatformUserItem } from "@/server/services/admin-operations.service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Ban,
  ShieldCheck,
  RefreshCw,
  X,
  Mail,
  UserCheck,
} from "lucide-react";
import { UserRole, UserStatus } from "@prisma/client";

interface AdminUsersClientProps {
  initialUsers: PlatformUserItem[];
  initialTotal: number;
}

export function AdminUsersClient({ initialUsers, initialTotal }: AdminUsersClientProps) {
  const [users, setUsers] = useState<PlatformUserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<PlatformUserItem | null>(null);
  const [actionStatus, setActionStatus] = useState<"ACTIVE" | "SUSPENDED" | null>(null);
  const [reason, setReason] = useState<string>("");
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (roleFilter !== "ALL") params.set("role", roleFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/v1/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data?.users) {
        setUsers(data.data.users);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!selectedUser || !actionStatus) return;
    setModalLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/admin/users/${selectedUser.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: actionStatus,
          reason: reason.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update account status.");
      }

      setSuccessMsg(
        actionStatus === "SUSPENDED"
          ? `User "${selectedUser.email}" has been suspended.`
          : `User "${selectedUser.email}" has been reactivated.`
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, status: actionStatus } : u))
      );

      setTimeout(() => {
        setSelectedUser(null);
        setActionStatus(null);
        setReason("");
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setModalLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name?.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      if (!matchName && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAEBED]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0E101A]">User Management</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FF5B35]/10 text-[#FF5B35] border border-[#FF5B35]/20">
              Governance Directory
            </span>
          </div>
          <p className="text-sm text-[#55585B] mt-1">
            Search, inspect personas, and toggle active/suspended statuses across students, instructors, and admins.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={loading}
          className="gap-1.5 text-xs font-bold border-[#EAEBED] text-[#0E101A] hover:bg-[#FAF9F6] rounded-xl"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white border border-[#EAEBED] rounded-[20px] p-4 shadow-xs flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#55585B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
            placeholder="Search by student or instructor name, email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5B35] focus:bg-white transition"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-[#55585B] shrink-0">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5B35] focus:bg-white transition"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-[#55585B] shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5B35] focus:bg-white transition"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#EAEBED] rounded-[20px] overflow-hidden shadow-xs">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-[#55585B] text-sm">
            No users found matching your search or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] text-xs font-bold text-[#55585B] border-b border-[#EAEBED] uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-5">User</th>
                  <th className="py-4 px-5">Role</th>
                  <th className="py-4 px-5">Account Status</th>
                  <th className="py-4 px-5">Registered</th>
                  <th className="py-4 px-5">Activity</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-[#EAEBED]">
                {filteredUsers.map((u) => {
                  const isActive = u.status === "ACTIVE";

                  return (
                    <tr key={u.id} className="hover:bg-[#FAF9F6]/80 transition">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#FF5B35]/10 text-[#FF5B35] font-black text-xs flex items-center justify-center shrink-0">
                            {u.name ? u.name.charAt(0) : u.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#0E101A]">{u.name || "User"}</div>
                            <div className="text-xs text-[#55585B]">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            u.role === "SUPER_ADMIN"
                              ? "bg-[#FF7162]/10 text-[#FF7162]"
                              : u.role === "ADMIN"
                              ? "bg-[#FFF6DF] text-[#D97706] border border-[#FFC221]/30"
                              : u.role === "INSTRUCTOR"
                              ? "bg-[#FF5B35]/10 text-[#FF5B35] border border-[#FF5B35]/20"
                              : "bg-[#09BD3C]/10 text-[#09BD3C]"
                          }`}
                        >
                          {u.role.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isActive
                              ? "bg-[#09BD3C]/10 text-[#09BD3C]"
                              : "bg-[#FF7162]/10 text-[#FF7162]"
                          }`}
                        >
                          {isActive ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                          {u.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-xs text-[#55585B]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-5 text-xs text-[#55585B]">
                        {u.role === "INSTRUCTOR"
                          ? `${u.coursesCount || 3} courses authored`
                          : `${u.enrollmentsCount || 1} enrollments`}
                      </td>

                      <td className="py-4 px-5 text-right">
                        {u.role !== "SUPER_ADMIN" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(u);
                              setActionStatus(isActive ? "SUSPENDED" : "ACTIVE");
                            }}
                            className={`text-xs font-bold h-7 px-3 rounded-lg ${
                              isActive
                                ? "text-[#FF7162] border-[#FF7162]/40 hover:bg-[#FF7162]/10"
                                : "text-[#09BD3C] border-[#09BD3C]/40 hover:bg-[#09BD3C]/10"
                            }`}
                          >
                            {isActive ? "Suspend" : "Activate"}
                          </Button>
                        ) : (
                          <span className="text-[11px] text-[#55585B] italic">Protected</span>
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

      {/* Confirmation Modal */}
      {selectedUser && actionStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#EAEBED] w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#EAEBED] bg-[#FAF9F6]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    actionStatus === "SUSPENDED"
                      ? "bg-[#FF7162]/10 text-[#FF7162]"
                      : "bg-[#09BD3C]/10 text-[#09BD3C]"
                  }`}
                >
                  {actionStatus === "SUSPENDED" ? <Ban className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0E101A]">
                    {actionStatus === "SUSPENDED" ? "Suspend User Account" : "Reactivate User Account"}
                  </h2>
                  <p className="text-xs text-[#55585B]">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setActionStatus(null);
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

              <p className="text-xs text-[#55585B]">
                {actionStatus === "SUSPENDED"
                  ? "Suspending this user will immediately revoke login sessions and block cart checkouts or course access."
                  : "Reactivating this user will restore full platform access and learning capabilities."}
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0E101A]">Audit Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    actionStatus === "SUSPENDED"
                      ? "e.g. Terms of service violation, chargeback fraud investigation"
                      : "e.g. Identity re-verified by support"
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEBED] bg-[#FAF9F6] text-[#0E101A] text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5B35] focus:bg-white transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAEBED]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(null);
                    setActionStatus(null);
                  }}
                  disabled={modalLoading}
                  className="rounded-xl border-[#EAEBED] text-[#55585B] hover:text-[#0E101A] text-xs font-bold"
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  onClick={handleStatusToggle}
                  disabled={modalLoading || !!successMsg}
                  className={
                    actionStatus === "SUSPENDED"
                      ? "bg-[#FF7162] hover:bg-[#e05344] text-white font-bold text-xs rounded-xl shadow-xs"
                      : "bg-[#09BD3C] hover:bg-[#08a835] text-white font-bold text-xs rounded-xl shadow-xs"
                  }
                >
                  {modalLoading
                    ? "Updating..."
                    : actionStatus === "SUSPENDED"
                    ? "Confirm Suspension"
                    : "Confirm Reactivation"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
