import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Standardized success response builder for Next.js Route Handlers
 */
export function apiSuccess<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
  return NextResponse.json(payload, { status });
}

/**
 * Standardized error response builder for Next.js Route Handlers
 */
export function apiError(code: string, message: string, status = 400, details?: unknown) {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
  return NextResponse.json(payload, { status });
}
