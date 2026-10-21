import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash a plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare plain text password against stored hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validate password complexity:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 */
export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number." };
  }
  return { isValid: true };
}
