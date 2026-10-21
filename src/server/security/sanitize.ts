/**
 * Input sanitization & security helpers
 */

export class SecuritySanitizer {
  /**
   * Escape HTML entities to prevent Cross-Site Scripting (XSS)
   */
  static escapeHtml(str: string): string {
    if (!str || typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  /**
   * Strip potential dangerous script tags and event handlers
   */
  static stripDangerousHtml(input: string): string {
    if (!input || typeof input !== "string") return "";
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/javascript\s*:/gi, "");
  }

  /**
   * Clean and normalize email inputs
   */
  static normalizeEmail(email: string): string {
    if (!email || typeof email !== "string") return "";
    return email.trim().toLowerCase();
  }

  /**
   * Check for potential SQL injection signatures in untrusted query strings
   */
  static hasSqlInjectionSignature(input: string): boolean {
    if (!input || typeof input !== "string") return false;
    const signatures = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/i,
      /(--|\bOR\b\s+\d+=\d+|\bAND\b\s+\d+=\d+)/i,
      /;\s*SHUTDOWN/i,
    ];
    return signatures.some((regex) => regex.test(input));
  }
}
