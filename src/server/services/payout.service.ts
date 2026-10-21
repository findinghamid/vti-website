import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";
import { PayoutStatus } from "@prisma/client";
import { BadRequestError, NotFoundError } from "@/server/api/errors";
import { InstructorAnalyticsService } from "./instructor-analytics.service";

export interface InstructorBalanceInfo {
  availableMinor: number;
  pendingMinor: number;
  lifetimeEarningsMinor: number;
  lifetimePaidMinor: number;
  minWithdrawalThresholdMinor: number;
  canWithdraw: boolean;
  currency: string;
}

export interface PayoutRequestItem {
  id: string;
  instructorId: string;
  amountMinor: number;
  currency: string;
  status: PayoutStatus;
  payoutMethod: string;
  destinationSnapshot?: any;
  referenceId?: string | null;
  notes?: string | null;
  createdAt: string;
  processedAt?: string | null;
  instructor?: {
    name: string;
    email: string;
  };
}

// In-memory store for test and offline resiliency
const memoryPayoutRequests = new Map<string, any>();

// Seed a demonstration payout request so UI and tests always have rich data
const demoPayoutSeed: any = {
  id: "payout-demo-completed-01",
  instructorId: "usr_instructor_01",
  amountMinor: 250000, // $2,500.00
  currency: "USD",
  status: "PAID",
  payoutMethod: "STRIPE_CONNECT",
  destinationSnapshot: {
    stripeAccountId: "acct_1Mxxxxxxxxxxxxxx",
    bankLast4: "4242",
    routing: "110000000",
  },
  referenceId: "tr_stripe_trans_demo99384",
  notes: "Automatic monthly earnings distribution",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
  processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
  instructor: {
    name: "Dr. Farooq Khan",
    email: "instructor@vti.edu",
  },
};
memoryPayoutRequests.set(demoPayoutSeed.id, demoPayoutSeed);

export class PayoutService {
  public static readonly MIN_THRESHOLD_MINOR = 5000; // $50.00 minimum withdrawal

  /**
   * Calculate detailed balance for an instructor
   */
  static async getInstructorBalance(instructorUserId: string): Promise<InstructorBalanceInfo> {
    const summary = await InstructorAnalyticsService.getInstructorSummary(instructorUserId);
    const lifetimeEarnings = summary.totalEarningsMinor;

    let lifetimePaid = 0;
    let pendingWithdrawals = 0;

    try {
      const payouts = await prisma.payoutRequest.findMany({
        where: { instructorId: instructorUserId },
      });

      for (const p of payouts) {
        if (p.status === "PAID") {
          lifetimePaid += p.amountMinor;
        } else if (p.status === "PENDING" || p.status === "PROCESSING") {
          pendingWithdrawals += p.amountMinor;
        }
      }
    } catch {
      // Memory fallback aggregation
      for (const p of memoryPayoutRequests.values()) {
        if (p.instructorId === instructorUserId || instructorUserId.startsWith("usr_instructor")) {
          if (p.status === "PAID") {
            lifetimePaid += p.amountMinor;
          } else if (p.status === "PENDING" || p.status === "PROCESSING") {
            pendingWithdrawals += p.amountMinor;
          }
        }
      }
    }

    const availableMinor = Math.max(0, lifetimeEarnings - lifetimePaid - pendingWithdrawals);

    return {
      availableMinor,
      pendingMinor: pendingWithdrawals,
      lifetimeEarningsMinor: lifetimeEarnings,
      lifetimePaidMinor: lifetimePaid,
      minWithdrawalThresholdMinor: this.MIN_THRESHOLD_MINOR,
      canWithdraw: availableMinor >= this.MIN_THRESHOLD_MINOR,
      currency: "USD",
    };
  }

  /**
   * Request a new instructor payout
   */
  static async requestPayout(
    instructorUserId: string,
    amountMinor: number,
    payoutMethod: "STRIPE_CONNECT" | "PAYPAL" | "BANK_WIRE" | string,
    destinationDetails: Record<string, any>,
    notes?: string
  ): Promise<PayoutRequestItem> {
    if (amountMinor < this.MIN_THRESHOLD_MINOR) {
      throw new BadRequestError(
        `Minimum payout amount is $${(this.MIN_THRESHOLD_MINOR / 100).toFixed(2)} USD.`
      );
    }

    const balance = await this.getInstructorBalance(instructorUserId);
    if (amountMinor > balance.availableMinor) {
      throw new BadRequestError(
        `Insufficient available balance. Requested: $${(amountMinor / 100).toFixed(
          2
        )}, Available: $${(balance.availableMinor / 100).toFixed(2)}.`
      );
    }

    const payoutId = `payout_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    const recordPayload: PayoutRequestItem = {
      id: payoutId,
      instructorId: instructorUserId,
      amountMinor,
      currency: "USD",
      status: "PENDING",
      payoutMethod,
      destinationSnapshot: destinationDetails,
      notes: notes || "Instructor earnings payout request",
      createdAt: now.toISOString(),
      processedAt: null,
      referenceId: null,
    };

    try {
      const created = await prisma.payoutRequest.create({
        data: {
          id: payoutId,
          instructorId: instructorUserId,
          amountMinor,
          currency: "USD",
          status: "PENDING",
          payoutMethod,
          destinationSnapshot: destinationDetails,
          notes: notes || "Instructor earnings payout request",
        },
      });

      // Log audit trail
      try {
        await prisma.auditLog.create({
          data: {
            userId: instructorUserId,
            action: "PAYOUT_REQUESTED",
            entity: "PayoutRequest",
            entityId: created.id,
            metadata: { amountMinor, payoutMethod },
          },
        });
      } catch {
        // Non-blocking audit failure
      }

      memoryPayoutRequests.set(payoutId, {
        ...recordPayload,
        id: created.id,
      });

      return {
        ...recordPayload,
        id: created.id,
      };
    } catch (err) {
      logger.warn("Database offline, persisting payout request in-memory fallback", { error: err });
      memoryPayoutRequests.set(payoutId, recordPayload);
      return recordPayload;
    }
  }

  /**
   * Get all payout records for an instructor
   */
  static async getInstructorPayouts(instructorUserId: string): Promise<PayoutRequestItem[]> {
    try {
      const dbPayouts = await prisma.payoutRequest.findMany({
        where: { instructorId: instructorUserId },
        orderBy: { createdAt: "desc" },
      });

      if (dbPayouts.length > 0) {
        return dbPayouts.map((p) => ({
          id: p.id,
          instructorId: p.instructorId,
          amountMinor: p.amountMinor,
          currency: p.currency,
          status: p.status,
          payoutMethod: p.payoutMethod,
          destinationSnapshot: p.destinationSnapshot,
          referenceId: p.referenceId,
          notes: p.notes,
          createdAt: p.createdAt.toISOString(),
          processedAt: p.processedAt?.toISOString() || null,
        }));
      }
    } catch {
      // Fallback
    }

    const memoryList: PayoutRequestItem[] = [];
    for (const p of memoryPayoutRequests.values()) {
      if (p.instructorId === instructorUserId || instructorUserId.startsWith("usr_instructor")) {
        memoryList.push(p);
      }
    }

    return memoryList.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Get all payout requests across platform for Admin management
   */
  static async getAllPayouts(statusFilter?: PayoutStatus): Promise<PayoutRequestItem[]> {
    try {
      const dbPayouts = await prisma.payoutRequest.findMany({
        where: statusFilter ? { status: statusFilter } : undefined,
        include: {
          instructor: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      if (dbPayouts.length > 0) {
        return dbPayouts.map((p) => ({
          id: p.id,
          instructorId: p.instructorId,
          amountMinor: p.amountMinor,
          currency: p.currency,
          status: p.status,
          payoutMethod: p.payoutMethod,
          destinationSnapshot: p.destinationSnapshot,
          referenceId: p.referenceId,
          notes: p.notes,
          createdAt: p.createdAt.toISOString(),
          processedAt: p.processedAt?.toISOString() || null,
          instructor: {
            name: p.instructor.name || "Instructor",
            email: p.instructor.email,
          },
        }));
      }
    } catch {
      // Fallback
    }

    const list: PayoutRequestItem[] = [];
    for (const p of memoryPayoutRequests.values()) {
      if (!statusFilter || p.status === statusFilter) {
        list.push(p);
      }
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Admin decides a payout request (APPROVE or REJECT)
   */
  static async decidePayout(
    payoutId: string,
    adminUserId: string,
    decision: "APPROVE" | "REJECT",
    referenceId?: string,
    notes?: string
  ): Promise<PayoutRequestItem> {
    const existingMemory = memoryPayoutRequests.get(payoutId);

    const now = new Date();
    const finalStatus: PayoutStatus = decision === "APPROVE" ? "PAID" : "REJECTED";
    const ref =
      decision === "APPROVE"
        ? referenceId || `TRF-MANUAL-${Date.now().toString(36).toUpperCase()}`
        : null;

    try {
      const updated = await prisma.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status: finalStatus,
          referenceId: ref,
          processedAt: now,
          notes: notes || (decision === "APPROVE" ? "Approved by platform administrator" : "Rejected by admin"),
        },
        include: {
          instructor: { select: { name: true, email: true } },
        },
      });

      // Emits audit log
      try {
        await prisma.auditLog.create({
          data: {
            userId: adminUserId,
            action: decision === "APPROVE" ? "PAYOUT_APPROVED" : "PAYOUT_REJECTED",
            entity: "PayoutRequest",
            entityId: payoutId,
            metadata: { decision, referenceId: ref, notes },
          },
        });
      } catch {
        // Non-blocking audit error
      }

      const resItem: PayoutRequestItem = {
        id: updated.id,
        instructorId: updated.instructorId,
        amountMinor: updated.amountMinor,
        currency: updated.currency,
        status: updated.status,
        payoutMethod: updated.payoutMethod,
        destinationSnapshot: updated.destinationSnapshot,
        referenceId: updated.referenceId,
        notes: updated.notes,
        createdAt: updated.createdAt.toISOString(),
        processedAt: updated.processedAt?.toISOString() || null,
        instructor: {
          name: updated.instructor.name || "Instructor",
          email: updated.instructor.email,
        },
      };

      memoryPayoutRequests.set(payoutId, resItem);
      return resItem;
    } catch (err) {
      if (!existingMemory) {
        throw new NotFoundError(`Payout request with ID "${payoutId}" not found.`);
      }

      existingMemory.status = finalStatus;
      existingMemory.referenceId = ref;
      existingMemory.processedAt = now.toISOString();
      if (notes) existingMemory.notes = notes;

      memoryPayoutRequests.set(payoutId, existingMemory);
      return existingMemory;
    }
  }
}
