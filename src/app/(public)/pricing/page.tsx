import React from "react";
import { SubscriptionService } from "@/server/services/subscription.service";
import { getCartUserId } from "@/server/auth/cart-session";
import { PricingPlansClient } from "@/components/subscription/PricingPlansClient";

export const metadata = {
  title: "All-Access Learning Pass Pricing | VTI Marketplace LMS",
  description: "Unlimited access to all courses, sandboxed coding challenges, and completion certificates with flexible monthly and annual plans.",
};

export default async function PricingPage() {
  const { userId } = await getCartUserId();

  const [plans, currentSubscription] = await Promise.all([
    SubscriptionService.getSubscriptionPlans(),
    SubscriptionService.getUserActiveSubscription(userId),
  ]);

  return (
    <PricingPlansClient
      plans={plans}
      currentSubscription={currentSubscription}
    />
  );
}
