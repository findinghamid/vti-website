import React from "react";
import { SubscriptionService } from "@/server/services/subscription.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { StudentSubscriptionClient } from "@/components/subscription/StudentSubscriptionClient";

export const metadata = {
  title: "My Subscription | Student Dashboard",
  description: "Manage your all-access learning subscription, billing status, and plan entitlement.",
};

export default async function StudentSubscriptionPage() {
  const { userId } = await getCartUserId();
  const subscription = await SubscriptionService.getUserActiveSubscription(userId);

  return <StudentSubscriptionClient initialSubscription={subscription} />;
}
