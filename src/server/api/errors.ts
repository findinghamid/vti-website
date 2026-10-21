import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR", details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required", code = "UNAUTHORIZED") {
    super(message, 401, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action", code = "FORBIDDEN") {
    super(message, 403, code);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource", code = "NOT_FOUND") {
    super(`${resource} not found`, 404, code);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict detected", code = "CONFLICT") {
    super(message, 409, code);
  }
}

/**
 * Standard error response formatter for Next.js Route Handlers
 */
export function handleApiError(error: unknown) {
  console.error("[API_ERROR]", error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const formatted = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    const message = formatted.map((f) => f.message).join(". ") || "Request payload validation failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message,
          details: formatted,
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected internal server error occurred",
      },
    },
    { status: 500 }
  );
}
