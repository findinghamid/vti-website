import React from "react";
import { PayoutService } from "@/server/services/payout.service";
import { AdminPayoutsClient } from "@/components/admin/AdminPayoutsClient";

export const metadata = {
  title: "Instructor Payout Approvals | Admin Governance",
  description: "Review instructor withdrawal requests, authorize settlements, and record bank transfer references.",
};

export default async function AdminPayoutsPage() {
  const payouts = await PayoutService.getAllPayouts();

  return <AdminPayoutsClient initialPayouts={payouts} />;
}
