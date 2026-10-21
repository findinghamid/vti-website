import { User, UserRole, Permission, UserPermission } from "@prisma/client";
import { UnauthorizedError, ForbiddenError } from "@/server/api/errors";
import { getSessionFromCookies } from "./session";

export type AuthenticatedUser = User & {
  permissions?: (UserPermission & { permission: Permission })[];
};

/**
 * Standard permissions catalogue across the platform
 */
export const PERMISSIONS = {
  // Course Permissions
  COURSES_VIEW: "courses.view",
  COURSES_CREATE: "courses.create",
  COURSES_EDIT: "courses.edit",
  COURSES_PUBLISH: "courses.publish",
  COURSES_UNPUBLISH: "courses.unpublish",
  COURSES_MODERATE: "courses.moderate",
  COURSES_DELETE_REQUEST: "courses.delete_request",

  // Student Management
  STUDENTS_VIEW: "students.view",
  STUDENTS_EDIT: "students.edit",
  STUDENTS_ENROLL: "students.enroll",
  STUDENTS_SUSPEND: "students.suspend",

  // Instructor Management
  INSTRUCTORS_VIEW: "instructors.view",
  INSTRUCTORS_CREATE: "instructors.create",
  INSTRUCTORS_EDIT: "instructors.edit",
  INSTRUCTORS_ASSIGN: "instructors.assign",

  // Commerce & Finance
  ORDERS_VIEW: "orders.view",
  PAYMENTS_VIEW: "payments.view",
  REFUNDS_MANAGE: "refunds.manage",
  COUPONS_MANAGE: "coupons.manage",

  // Operations & Support
  REVIEWS_MODERATE: "reviews.moderate",
  SUPPORT_MANAGE: "support.manage",
  ANNOUNCEMENTS_MANAGE: "announcements.manage",
  REPORTS_VIEW: "reports.view",
  AUDIT_VIEW: "audit.view",
  SETTINGS_MANAGE: "settings.manage",
  DELETIONS_REQUEST: "deletions.request",
  DELETIONS_APPROVE: "deletions.approve",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Default base permissions assigned to specific roles
 */
const ROLE_DEFAULT_PERMISSIONS: Record<UserRole, PermissionCode[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS), // Super Admin implicitly has all permissions
  ADMIN: [
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.COURSES_CREATE,
    PERMISSIONS.COURSES_EDIT,
    PERMISSIONS.COURSES_MODERATE,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STUDENTS_EDIT,
    PERMISSIONS.INSTRUCTORS_VIEW,
    PERMISSIONS.INSTRUCTORS_CREATE,
    PERMISSIONS.INSTRUCTORS_ASSIGN,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.REVIEWS_MODERATE,
    PERMISSIONS.SUPPORT_MANAGE,
    PERMISSIONS.ANNOUNCEMENTS_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.DELETIONS_REQUEST, // Admins can request deletions, but CANNOT approve them
  ],
  INSTRUCTOR: [
    PERMISSIONS.COURSES_VIEW,
    PERMISSIONS.COURSES_CREATE,
    PERMISSIONS.COURSES_EDIT,
  ],
  STUDENT: [],
};

/**
 * Compute the complete list of effective permissions for a user
 */
export function getEffectivePermissions(user: AuthenticatedUser): string[] {
  if (user.role === "SUPER_ADMIN") {
    return Object.values(PERMISSIONS);
  }

  const roleBase = ROLE_DEFAULT_PERMISSIONS[user.role] ?? [];
  const granular = (user.permissions ?? []).map((p) => p.permission.code);

  return Array.from(new Set([...roleBase, ...granular]));
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: AuthenticatedUser, ...roles: UserRole[]): boolean {
  return roles.includes(user.role);
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: AuthenticatedUser, permission: PermissionCode | string): boolean {
  if (user.role === "SUPER_ADMIN") return true;
  const permissions = getEffectivePermissions(user);
  return permissions.includes(permission);
}

/**
 * Require active authentication session from cookie or throw UnauthorizedError (401)
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const session = await getSessionFromCookies();
  if (!session || !session.user) {
    throw new UnauthorizedError("You must be logged in to access this resource.");
  }
  return session.user as AuthenticatedUser;
}

/**
 * Require specific role or throw ForbiddenError (403)
 */
export async function requireRole(...roles: UserRole[]): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!hasRole(user, ...roles)) {
    throw new ForbiddenError(`Access restricted to: ${roles.join(", ")}`);
  }
  return user;
}

/**
 * Require specific permission or throw ForbiddenError (403)
 */
export async function requirePermission(permission: PermissionCode | string): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!hasPermission(user, permission)) {
    throw new ForbiddenError(`Missing required permission: ${permission}`);
  }
  return user;
}
