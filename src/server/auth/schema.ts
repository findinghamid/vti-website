import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long").max(100),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const DeletionRequestSchema = z.object({
  entityType: z.enum(["COURSE", "INSTRUCTOR", "STUDENT"], {
    message: "entityType must be COURSE, INSTRUCTOR, or STUDENT",
  }),
  entityId: z.string().min(1, "entityId is required"),
  reason: z.string().trim().min(10, "Reason must be at least 10 characters long explaining why deletion is necessary"),
});

export type DeletionRequestInput = z.infer<typeof DeletionRequestSchema>;

export const DeletionDecisionSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"], {
    message: "decision must be APPROVED or REJECTED",
  }),
  decisionReason: z.string().trim().min(5, "Decision reason must be at least 5 characters long"),
});

export type DeletionDecisionInput = z.infer<typeof DeletionDecisionSchema>;
