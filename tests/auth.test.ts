import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, validatePasswordStrength } from "../src/server/auth/password";
import { SignupSchema, LoginSchema, DeletionRequestSchema, DeletionDecisionSchema } from "../src/server/auth/schema";
import { getEffectivePermissions, hasRole, hasPermission, PERMISSIONS, AuthenticatedUser } from "../src/server/auth/rbac";
import { AuthService } from "../src/server/services/auth.service";

describe("Milestone 2: Password Security & Validation", () => {
  it("should hash and verify passwords correctly", async () => {
    const raw = "SuperSecret123!";
    const hash = await hashPassword(raw);

    assert.notEqual(raw, hash);
    assert.equal(await verifyPassword(raw, hash), true);
    assert.equal(await verifyPassword("WrongPassword123!", hash), false);
  });

  it("should enforce strong password rules", () => {
    assert.equal(validatePasswordStrength("short").isValid, false);
    assert.equal(validatePasswordStrength("alllowercase1!").isValid, false);
    assert.equal(validatePasswordStrength("ALLUPPERCASE1!").isValid, false);
    assert.equal(validatePasswordStrength("NoNumberHere!").isValid, false);
    assert.equal(validatePasswordStrength("ValidPassword123!").isValid, true);
  });
});

describe("Milestone 2: Zod Validation Schemas", () => {
  it("should validate valid signup input", () => {
    const valid = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "StrongPassword123!",
    };
    const parsed = SignupSchema.parse(valid);
    assert.equal(parsed.email, "jane.doe@example.com");
  });

  it("should reject invalid signup email and weak password", () => {
    assert.throws(() => {
      SignupSchema.parse({
        name: "Jane",
        email: "not-an-email",
        password: "weak",
      });
    });
  });

  it("should validate deletion request schema", () => {
    const validRequest = {
      entityType: "COURSE",
      entityId: "course-cuid-123",
      reason: "This course contains copyrighted material and must be taken down.",
    };
    const parsed = DeletionRequestSchema.parse(validRequest);
    assert.equal(parsed.entityType, "COURSE");

    assert.throws(() => {
      DeletionRequestSchema.parse({
        entityType: "INVALID",
        entityId: "123",
        reason: "short",
      });
    });
  });

  it("should validate deletion decision schema", () => {
    const validDecision = {
      decision: "APPROVED",
      decisionReason: "Copyright claim verified by legal department.",
    };
    const parsed = DeletionDecisionSchema.parse(validDecision);
    assert.equal(parsed.decision, "APPROVED");

    assert.throws(() => {
      DeletionDecisionSchema.parse({
        decision: "MAYBE",
        decisionReason: "ok",
      });
    });
  });
});

describe("Milestone 2: Centralized RBAC & Permissions", () => {
  const superAdminUser: AuthenticatedUser = {
    id: "usr-superadmin",
    email: "superadmin@vti.edu",
    name: "Super Admin",
    passwordHash: "hash",
    avatarUrl: null,
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const adminUser: AuthenticatedUser = {
    id: "usr-admin",
    email: "admin@vti.edu",
    name: "Admin",
    passwordHash: "hash",
    avatarUrl: null,
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const studentUser: AuthenticatedUser = {
    id: "usr-student",
    email: "student@vti.edu",
    name: "Student",
    passwordHash: "hash",
    avatarUrl: null,
    role: "STUDENT",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  it("should grant Super Admin all permissions implicitly", () => {
    assert.equal(hasRole(superAdminUser, "SUPER_ADMIN"), true);
    assert.equal(hasRole(superAdminUser, "ADMIN"), false);

    assert.equal(hasPermission(superAdminUser, PERMISSIONS.COURSES_PUBLISH), true);
    assert.equal(hasPermission(superAdminUser, PERMISSIONS.DELETIONS_APPROVE), true);
    assert.equal(hasPermission(superAdminUser, "any.future.permission"), true);
  });

  it("should enforce Admin permissions and restrict deletion approvals", () => {
    assert.equal(hasRole(adminUser, "ADMIN"), true);
    assert.equal(hasPermission(adminUser, PERMISSIONS.COURSES_VIEW), true);
    assert.equal(hasPermission(adminUser, PERMISSIONS.DELETIONS_REQUEST), true);

    // CRITICAL SPECIFICATION CHECK: Admins CANNOT approve deletions!
    assert.equal(hasPermission(adminUser, PERMISSIONS.DELETIONS_APPROVE), false);
  });

  it("should restrict Students from administrative permissions", () => {
    assert.equal(hasRole(studentUser, "STUDENT"), true);
    assert.equal(hasPermission(studentUser, PERMISSIONS.COURSES_CREATE), false);
    assert.equal(hasPermission(studentUser, PERMISSIONS.DELETIONS_REQUEST), false);
    assert.equal(hasPermission(studentUser, PERMISSIONS.STUDENTS_SUSPEND), false);
  });
});

describe("Milestone 2 Extension: Email Existence Detection & Frictionless Checkout Auth", () => {
  it("should detect existing accounts in the platform", async () => {
    const existing = await AuthService.checkEmailExists("student@vti.edu");
    assert.equal(existing.exists, true);
    assert.equal(existing.name, "Alex Vance");
  });

  it("should return false for unregistered emails", async () => {
    const nonExisting = await AuthService.checkEmailExists("random_student_9921@example.com");
    assert.equal(nonExisting.exists, false);
  });
});
