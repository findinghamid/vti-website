export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  message: string;
  action?: string;
  requestId?: string;
  userId?: string;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  error?: unknown;
}

class StructuredLogger {
  private isDbOfflineError(err: unknown): boolean {
    if (!err) return false;
    const msg = (err instanceof Error ? err.message : String(err)) || "";
    const name = err instanceof Error ? err.name : "";
    return (
      name === "PrismaClientInitializationError" ||
      msg.includes("Can't reach database server") ||
      msg.includes("Connection refused") ||
      msg.includes("localhost:5432")
    );
  }

  private formatLog(level: LogLevel, payload: LogPayload) {
    let errorOutput: unknown = undefined;
    if (payload.error) {
      if (this.isDbOfflineError(payload.error)) {
        errorOutput = {
          name: "DatabaseOffline",
          message: "PostgreSQL server offline at localhost:5432 (fallback store active)",
        };
      } else if (payload.error instanceof Error) {
        errorOutput = {
          name: payload.error.name,
          message: payload.error.message,
          stack: process.env.NODE_ENV === "development" ? payload.error.stack : undefined,
        };
      } else {
        errorOutput = payload.error;
      }
    }

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message: payload.message,
      action: payload.action,
      requestId: payload.requestId,
      userId: payload.userId,
      entity: payload.entity,
      entityId: payload.entityId,
      metadata: payload.metadata,
      ...(errorOutput ? { error: errorOutput } : {}),
    };

    const serialized = JSON.stringify(entry);
    if (level === "error") {
      console.error(serialized);
    } else if (level === "warn") {
      console.warn(serialized);
    } else {
      console.log(serialized);
    }
  }

  info(message: string, options: Omit<LogPayload, "message"> = {}) {
    this.formatLog("info", { message, ...options });
  }

  warn(message: string, options: Omit<LogPayload, "message"> = {}) {
    this.formatLog("warn", { message, ...options });
  }

  error(message: string, options: Omit<LogPayload, "message"> = {}) {
    this.formatLog("error", { message, ...options });
  }

  debug(message: string, options: Omit<LogPayload, "message"> = {}) {
    if (process.env.NODE_ENV === "development") {
      this.formatLog("debug", { message, ...options });
    }
  }
}

export const logger = new StructuredLogger();
export default logger;
