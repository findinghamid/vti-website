import React from "react";
import { AdminOperationsService } from "@/server/services/admin-operations.service";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";

export const metadata = {
  title: "User Governance | Admin Operations",
  description: "Search, inspect, and manage active/suspended statuses for students, instructors, and admins.",
};

export default async function AdminUsersPage() {
  const { users, total } = await AdminOperationsService.getUsersList({});

  return <AdminUsersClient initialUsers={users} initialTotal={total} />;
}
