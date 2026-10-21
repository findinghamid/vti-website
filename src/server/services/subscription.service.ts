import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";
import { BillingInterval, SubscriptionStatus } from "@prisma/client";
import { NotFoundError, BadRequestError } from "@/server/api/errors";

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface SubscriptionPlanItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceAmount: number; // in cents
  currency: string;
  interval: BillingInterval;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface UserSubscriptionDetails {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  planSlug: string;
  status: SubscriptionStatus;
  interval: BillingInterval;
  priceAmount: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  daysRemaining: number;
  hasAccess: boolean;
}

// In-memory fallback stores
const memoryPlans = new Map<string, SubscriptionPlanItem>();
const memoryUserSubscriptions = new Map<string, UserSubscriptionDetails>();

const SEED_PLANS: SubscriptionPlanItem[] = [
  {
    id: "plan_pro_monthly",
    name: "Personal Pro (Monthly)",
    slug: "pro-monthly",
    description: "Unlimited access to all courses, sandboxed coding exercises, and completion certificates.",
    priceAmount: 2900, // $29.00 / mo
    currency: "USD",
    interval: "MONTHLY",
    features: [
      "Full catalog access to 30+ premium courses",
      "Interactive Node VM sandboxed coding runners",
      "Verifiable digitally signed credentials & badges",
      "Downloadable exercise files & offline resources",
      "Direct instructor Q&A response badge",
    ],
    isPopular: false,
    isActive: true,
  },
  {
    id: "plan_pro_annual",
    name: "Personal Pro (Annual)",
    slug: "pro-annual",
    description: "Best value: Save 28% with annual billing. Complete mastery track with unlimited access.",
    priceAmount: 24900, // $249.00 / yr (~$20.75 / mo)
    currency: "USD",
    interval: "ANNUAL",
    features: [
      "All Personal Pro Monthly benefits included",
      "Save $99 compared to monthly payments",
      "Priority 1-on-1 code reviews on capstone projects",
      "Verified LinkedIn digital credential integration",
      "Exclusive early access to newly published tracks",
    ],
    isPopular: true,
    isActive: true,
  },
  {
    id: "plan_enterprise_team",
    name: "Enterprise All-Access",
    slug: "enterprise-all-access",
    description: "For engineering teams and scaling startups needing multi-seat compliance and learning analytics.",
    priceAmount: 9900, // $99.00 / mo
    currency: "USD",
    interval: "MONTHLY",
    features: [
      "Everything in Personal Pro",
      "Up to 5 team seats with centralized billing",
      "Admin learner progress & completion reports",
      "Custom learning pathway curation",
      "Dedicated account manager & SLA support",
    ],
    isPopular: false,
    isActive: true,
  },
];

for (const plan of SEED_PLANS) {
  memoryPlans.set(plan.id, plan);
  memoryPlans.set(plan.slug, plan);
}

export class SubscriptionService {
  /**
   * Get all active subscription plans
   */
  static async getSubscriptionPlans(): Promise<SubscriptionPlanItem[]> {
    try {
      const dbPlans = await prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { priceAmount: "asc" },
      });

      if (dbPlans && dbPlans.length > 0) {
        return dbPlans.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          priceAmount: p.priceAmount,
          currency: p.currency,
          interval: p.interval,
          features: p.features,
          isPopular: p.slug.includes("annual"),
          isActive: p.isActive,
        }));
      }
    } catch {
      // Offline fallback
    }

    return Array.from(new Set(Array.from(memoryPlans.values())));
  }

  /**
   * Get specific subscription plan by slug or ID
   */
  static async getPlanBySlug(slugOrId: string): Promise<SubscriptionPlanItem | null> {
    try {
      const p = await prisma.subscriptionPlan.findFirst({
        where: {
          OR: [{ slug: slugOrId }, { id: slugOrId }],
          isActive: true,
        },
      });

      if (p) {
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          priceAmount: p.priceAmount,
          currency: p.currency,
          interval: p.interval,
          features: p.features,
          isPopular: p.slug.includes("annual"),
          isActive: p.isActive,
        };
      }
    } catch {
      // Offline fallback
    }

    return memoryPlans.get(slugOrId) || null;
  }

  /**
   * Check if a user currently has active, valid catalog-wide entitlement
   */
  static async hasActiveCatalogEntitlement(userId: string): Promise<boolean> {
    const sub = await this.getUserActiveSubscription(userId);
    return !!sub && sub.hasAccess;
  }

  /**
   * Retrieve active subscription details for a student
   */
  static async getUserActiveSubscription(
    userId: string
  ): Promise<UserSubscriptionDetails | null> {
    try {
      const sub = await prisma.subscription.findFirst({
        where: {
          userId,
          status: { in: ["ACTIVE", "PAST_DUE"] },
        },
        include: {
          plan: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (sub) {
        const now = new Date();
        const periodEnd = new Date(sub.currentPeriodEnd);
        const hasAccess = sub.status === "ACTIVE" && periodEnd > now;
        const diffMs = periodEnd.getTime() - now.getTime();
        const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

        return {
          id: sub.id,
          userId: sub.userId,
          planId: sub.planId,
          planName: sub.plan.name,
          planSlug: sub.plan.slug,
          status: sub.status,
          interval: sub.plan.interval,
          priceAmount: sub.plan.priceAmount,
          currentPeriodStart: sub.currentPeriodStart.toISOString(),
          currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
          canceledAt: sub.canceledAt?.toISOString() || null,
          daysRemaining,
          hasAccess,
        };
      }
    } catch {
      // Memory fallback
    }

    const memSub = memoryUserSubscriptions.get(userId);
    if (memSub) {
      const now = new Date();
      const periodEnd = new Date(memSub.currentPeriodEnd);
      memSub.hasAccess = memSub.status === "ACTIVE" && periodEnd > now;
      const diffMs = periodEnd.getTime() - now.getTime();
      memSub.daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      return memSub;
    }

    return null;
  }

  /**
   * Subscribe user to a recurring subscription plan
   */
  static async subscribeToPlan(
    userId: string,
    planSlug: string,
    paymentProvider = "STRIPE"
  ): Promise<UserSubscriptionDetails> {
    const plan = await this.getPlanBySlug(planSlug);
    if (!plan) {
      throw new NotFoundError(`Subscription plan "${planSlug}" not found.`);
    }

    const now = new Date();
    const periodEnd = new Date(now);
    if (plan.interval === "ANNUAL") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setDate(periodEnd.getDate() + 30);
    }

    const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const providerRefId = `sub_stripe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const details: UserSubscriptionDetails = {
      id: subId,
      userId,
      planId: plan.id,
      planName: plan.name,
      planSlug: plan.slug,
      status: "ACTIVE",
      interval: plan.interval,
      priceAmount: plan.priceAmount,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      canceledAt: null,
      daysRemaining: plan.interval === "ANNUAL" ? 365 : 30,
      hasAccess: true,
    };

    try {
      // Upsert in database
      const created = await prisma.subscription.create({
        data: {
          id: subId,
          userId,
          planId: plan.id,
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
          providerRefId,
        },
      });

      // Emits audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: "SUBSCRIPTION_CREATED",
          entity: "Subscription",
          entityId: created.id,
          metadata: { planSlug: plan.slug, priceAmount: plan.priceAmount, interval: plan.interval },
        },
      });

      memoryUserSubscriptions.set(userId, details);
      return details;
    } catch (err) {
      logger.warn("Database offline, persisting subscription in memory fallback", { error: err });
      memoryUserSubscriptions.set(userId, details);
      return details;
    }
  }

  /**
   * Cancel subscription (scheduled at end of current billing period)
   */
  static async cancelSubscription(userId: string): Promise<UserSubscriptionDetails> {
    const existing = await this.getUserActiveSubscription(userId);
    if (!existing) {
      throw new NotFoundError("No active subscription found to cancel.");
    }

    const now = new Date();
    try {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          cancelAtPeriodEnd: true,
          canceledAt: now,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId,
          action: "SUBSCRIPTION_CANCELED",
          entity: "Subscription",
          entityId: existing.id,
          metadata: { planSlug: existing.planSlug, accessUntil: existing.currentPeriodEnd },
        },
      });
    } catch {
      // Memory fallback
    }

    existing.cancelAtPeriodEnd = true;
    existing.canceledAt = now.toISOString();
    memoryUserSubscriptions.set(userId, existing);
    return existing;
  }

  /**
   * Reactivate a subscription that was scheduled to cancel
   */
  static async reactivateSubscription(userId: string): Promise<UserSubscriptionDetails> {
    const existing = await this.getUserActiveSubscription(userId);
    if (!existing) {
      throw new NotFoundError("No active subscription found to reactivate.");
    }

    try {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          cancelAtPeriodEnd: false,
          canceledAt: null,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId,
          action: "SUBSCRIPTION_REACTIVATED",
          entity: "Subscription",
          entityId: existing.id,
        },
      });
    } catch {
      // Memory fallback
    }

    existing.cancelAtPeriodEnd = false;
    existing.canceledAt = null;
    memoryUserSubscriptions.set(userId, existing);
    return existing;
  }
}
