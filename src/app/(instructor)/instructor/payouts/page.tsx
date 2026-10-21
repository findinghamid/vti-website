import React from "react";
import { getCartUserId } from "@/server/auth/cart-session";
import { PayoutService } from "@/server/services/payout.service";
import { InstructorPayoutsClient } from "@/components/instructor/InstructorPayoutsClient";

export const metadata = {
  title: "Earnings & Payouts | Instructor Studio",
  description: "View available balances, request withdrawals, and inspect historical settlements.",
};

export default async function InstructorPayoutsPage() {
  const { userId } = await getCartUserId();

  const [balance, payouts] = await Promise.all([
    PayoutService.getInstructorBalance(userId),
    PayoutService.getInstructorPayouts(userId),
  ]);

  return <InstructorPayoutsClient initialBalance={balance} initialPayouts={payouts} />;
}
