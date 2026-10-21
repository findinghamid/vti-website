import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";

export interface CreateAuditLogParams {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  ipAddress?: string | null;
  requestId?: string | null;
  metadata?: Record<string, unknown> | null;
}

export class AuditService {
  /**
   * Record an immutable audit log entry
   */
  static async record(params: CreateAuditLogParams) {
    try {
      const log = await prisma.auditLog.create({
        data: {
          userId: params.userId ?? null,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId ?? null,
          ipAddress: params.ipAddress ?? null,
          requestId: params.requestId ?? null,
          metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
        },
      });

      logger.info(`[AUDIT] ${params.action} on ${params.entity}:${params.entityId ?? "N/A"}`, {
        action: params.action,
        userId: params.userId ?? undefined,
        entity: params.entity,
        entityId: params.entityId ?? undefined,
        requestId: params.requestId ?? undefined,
      });

      return log;
    } catch (error) {
      // Never let an audit logging failure crash the primary business operation, but log error loudly
      logger.error("Failed to write audit log entry", {
        action: params.action,
        error,
      });
      return null;
    }
  }

  /**
   * Query audit logs with pagination and filters
   */
  static async listLogs(filters: {
    action?: string;
    entity?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const skip = (page - 1) * limit;

    const where = {
      ...(filters.action ? { action: filters.action } : {}),
      ...(filters.entity ? { entity: filters.entity } : {}),
      ...(filters.userId ? { userId: filters.userId } : {}),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
