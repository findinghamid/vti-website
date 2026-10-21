import { prisma } from "@/lib/prisma";
import { DeletionStatus } from "@prisma/client";
import { NotFoundError, ConflictError, ValidationError } from "@/server/api/errors";
import { DeletionRequestInput, DeletionDecisionInput } from "@/server/auth/schema";
import { AuditService } from "./audit.service";

export class DeletionService {
  /**
   * Admin submits a request to delete an important entity
   */
  static async createRequest(requesterId: string, input: DeletionRequestInput, ipAddress?: string | null) {
    // 1. Verify entity exists
    if (input.entityType === "COURSE") {
      const course = await prisma.course.findUnique({ where: { id: input.entityId } });
      if (!course) throw new NotFoundError("Course");
    } else if (input.entityType === "INSTRUCTOR" || input.entityType === "STUDENT") {
      const user = await prisma.user.findUnique({ where: { id: input.entityId } });
      if (!user) throw new NotFoundError("User");
      if (input.entityType === "INSTRUCTOR" && user.role !== "INSTRUCTOR") {
        throw new ValidationError("Target user is not an instructor");
      }
      if (input.entityType === "STUDENT" && user.role !== "STUDENT") {
        throw new ValidationError("Target user is not a student");
      }
    }

    // 2. Check if a pending deletion request already exists for this entity
    const existing = await prisma.deletionRequest.findFirst({
      where: {
        entityType: input.entityType,
        entityId: input.entityId,
        status: "PENDING",
      },
    });

    if (existing) {
      throw new ConflictError("A deletion request for this entity is already pending Super Admin review.");
    }

    // 3. Create the deletion request record
    const request = await prisma.deletionRequest.create({
      data: {
        entityType: input.entityType,
        entityId: input.entityId,
        reason: input.reason,
        requesterId,
        status: "PENDING",
      },
      include: {
        requester: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    // 4. Record audit log
    await AuditService.record({
      userId: requesterId,
      action: "DELETION_REQUESTED",
      entity: input.entityType,
      entityId: input.entityId,
      ipAddress,
      metadata: { requestId: request.id, reason: input.reason },
    });

    return request;
  }

  /**
   * List deletion requests with optional status filtering
   */
  static async listRequests(filters: {
    status?: DeletionStatus;
    entityType?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(50, Math.max(1, filters.limit ?? 20));
    const skip = (page - 1) * limit;

    const where = {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.entityType ? { entityType: filters.entityType } : {}),
    };

    const [requests, total] = await Promise.all([
      prisma.deletionRequest.findMany({
        where,
        orderBy: { requestedAt: "desc" },
        skip,
        take: limit,
        include: {
          requester: {
            select: { id: true, name: true, email: true, role: true },
          },
          reviewer: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),
      prisma.deletionRequest.count({ where }),
    ]);

    return {
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Super Admin reviews and decides on a deletion request
   */
  static async decideRequest(
    reviewerId: string,
    requestId: string,
    input: DeletionDecisionInput,
    ipAddress?: string | null
  ) {
    const existing = await prisma.deletionRequest.findUnique({
      where: { id: requestId },
    });

    if (!existing) {
      throw new NotFoundError("Deletion request");
    }

    if (existing.status !== "PENDING") {
      throw new ConflictError(`This deletion request has already been decided (${existing.status}).`);
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update the deletion request decision
      const decisionRecord = await tx.deletionRequest.update({
        where: { id: requestId },
        data: {
          status: input.decision,
          decisionReason: input.decisionReason,
          reviewerId,
          decidedAt: new Date(),
        },
        include: {
          requester: { select: { id: true, name: true, email: true } },
          reviewer: { select: { id: true, name: true, email: true } },
        },
      });

      // 2. If approved, execute entity removal according to historical data compliance rules
      if (input.decision === "APPROVED") {
        if (existing.entityType === "COURSE") {
          // Courses are archived to preserve student learning records and invoices
          await tx.course.update({
            where: { id: existing.entityId },
            data: { status: "ARCHIVED" },
          });
        } else if (existing.entityType === "STUDENT" || existing.entityType === "INSTRUCTOR") {
          // Users are soft-deleted and archived, sessions revoked immediately
          await tx.user.update({
            where: { id: existing.entityId },
            data: {
              status: "ARCHIVED",
              deletedAt: new Date(),
            },
          });
          // Revoke all active sessions
          await tx.session.deleteMany({
            where: { userId: existing.entityId },
          });
        }
      }

      return decisionRecord;
    });

    // 3. Record immutable audit log
    await AuditService.record({
      userId: reviewerId,
      action: input.decision === "APPROVED" ? "DELETION_APPROVED" : "DELETION_REJECTED",
      entity: existing.entityType,
      entityId: existing.entityId,
      ipAddress,
      metadata: {
        requestId: updated.id,
        decision: input.decision,
        decisionReason: input.decisionReason,
      },
    });

    return updated;
  }
}
