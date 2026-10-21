interface RateLimitEntry {
  timestamps: number[];
}

// In-memory sliding window rate limiter store
const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSec: number;
}

export class RateLimiter {
  /**
   * Check rate limit for a client key (IP + action)
   * @param key Client identifier (e.g. IP + endpoint)
   * @param limit Maximum allowed requests within window
   * @param windowSec Window duration in seconds
   */
  static check(key: string, limit: number, windowSec: number): RateLimitResult {
    const now = Date.now();
    const windowMs = windowSec * 1000;
    const cutoff = now - windowMs;

    let entry = rateLimitStore.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      rateLimitStore.set(key, entry);
    }

    // Filter out timestamps outside the active sliding window
    entry.timestamps = entry.timestamps.filter((ts) => ts > cutoff);

    if (entry.timestamps.length >= limit) {
      const oldestInWindow = entry.timestamps[0];
      const resetSec = Math.max(1, Math.ceil((oldestInWindow + windowMs - now) / 1000));
      return {
        allowed: false,
        limit,
        remaining: 0,
        resetSec,
      };
    }

    entry.timestamps.push(now);
    const resetSec = windowSec;
    const remaining = limit - entry.timestamps.length;

    return {
      allowed: true,
      limit,
      remaining,
      resetSec,
    };
  }

  /**
   * Reset limiter for tests
   */
  static reset(): void {
    rateLimitStore.clear();
  }
}
