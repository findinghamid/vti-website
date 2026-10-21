import test, { describe, beforeEach } from "node:test";
import assert from "node:assert";
import { RateLimiter } from "../src/server/security/rate-limiter";
import { SecuritySanitizer } from "../src/server/security/sanitize";
import { GET as healthRoute } from "../src/app/api/v1/health/route";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";
import { NextRequest } from "next/server";

describe("Milestone 15: Security Hardening, Observability & Production Readiness", () => {
  beforeEach(() => {
    RateLimiter.reset();
  });

  describe("Sliding Window Rate Limiter", () => {
    test("should permit requests within rate limit thresholds", () => {
      const key = "ip_192_168_1_1:login";
      const limit = 5;
      const windowSec = 60;

      for (let i = 1; i <= limit; i++) {
        const result = RateLimiter.check(key, limit, windowSec);
        assert.strictEqual(result.allowed, true, `Request ${i} should be allowed`);
        assert.strictEqual(result.limit, limit);
        assert.strictEqual(result.remaining, limit - i);
      }
    });

    test("should reject excess requests and return retry reset seconds", () => {
      const key = "ip_10_0_0_99:checkout";
      const limit = 3;
      const windowSec = 10;

      // Consume full quota
      for (let i = 0; i < limit; i++) {
        const res = RateLimiter.check(key, limit, windowSec);
        assert.strictEqual(res.allowed, true);
      }

      // Next request must be throttled
      const throttled = RateLimiter.check(key, limit, windowSec);
      assert.strictEqual(throttled.allowed, false);
      assert.strictEqual(throttled.remaining, 0);
      assert.ok(throttled.resetSec > 0, "resetSec must be greater than 0");
    });

    test("should isolate rate limits across different keys", () => {
      const keyA = "user_alpha:api";
      const keyB = "user_beta:api";

      // Exhaust keyA
      for (let i = 0; i < 2; i++) {
        RateLimiter.check(keyA, 2, 60);
      }
      const resA = RateLimiter.check(keyA, 2, 60);
      assert.strictEqual(resA.allowed, false);

      // keyB should still have full quota
      const resB = RateLimiter.check(keyB, 2, 60);
      assert.strictEqual(resB.allowed, true);
      assert.strictEqual(resB.remaining, 1);
    });

    test("should cleanly reset rate limiter state", () => {
      const key = "ip_test_reset:action";
      RateLimiter.check(key, 1, 60);
      const blocked = RateLimiter.check(key, 1, 60);
      assert.strictEqual(blocked.allowed, false);

      RateLimiter.reset();

      const fresh = RateLimiter.check(key, 1, 60);
      assert.strictEqual(fresh.allowed, true);
    });
  });

  describe("Security Sanitization & XSS / Injection Defense", () => {
    test("should escape malicious HTML entities to neutralize XSS vectors", () => {
      const malicious = '<script>alert("pwned")</script>&<img src="x" onerror="evil()" />';
      const escaped = SecuritySanitizer.escapeHtml(malicious);

      assert.ok(!escaped.includes("<script>"));
      assert.ok(escaped.includes("&lt;script&gt;"));
      assert.ok(escaped.includes("&amp;"));
      assert.ok(escaped.includes("&quot;"));
      assert.ok(escaped.includes("&#x2F;"));
    });

    test("should strip dangerous script tags and inline event handlers", () => {
      const vector = 'Hello <script>runMaliciousCode();</script><b onclick="attack()">Click me</b>';
      const stripped = SecuritySanitizer.stripDangerousHtml(vector);

      assert.ok(!stripped.includes("<script>"));
      assert.ok(!stripped.includes("onclick="));
      assert.ok(stripped.includes("Hello"));
      assert.ok(stripped.includes("Click me"));
    });

    test("should normalize and trim user email addresses", () => {
      assert.strictEqual(SecuritySanitizer.normalizeEmail("  USER.NAME@Example.COM  "), "user.name@example.com");
      assert.strictEqual(SecuritySanitizer.normalizeEmail(""), "");
    });

    test("should detect SQL injection signatures in untrusted inputs", () => {
      assert.strictEqual(SecuritySanitizer.hasSqlInjectionSignature("admin' OR 1=1 --"), true);
      assert.strictEqual(SecuritySanitizer.hasSqlInjectionSignature("1; DROP TABLE users;"), true);
      assert.strictEqual(SecuritySanitizer.hasSqlInjectionSignature("UNION SELECT * FROM accounts"), true);
      assert.strictEqual(SecuritySanitizer.hasSqlInjectionSignature("John Doe NextJS Mastery"), false);
      assert.strictEqual(SecuritySanitizer.hasSqlInjectionSignature("cloud-native-devops"), false);
    });
  });

  describe("Observability & Enterprise Health Telemetry", () => {
    test("should produce comprehensive health check telemetry with 100% roadmap completion", async () => {
      const req = new NextRequest("http://localhost:3000/api/v1/health");
      const res = await healthRoute(req);
      const json = await res.json();

      assert.strictEqual(res.status, 200);
      assert.strictEqual(json.data.status, "healthy");
      assert.strictEqual(json.data.service, "VTI Marketplace LMS Engine");
      assert.strictEqual(json.data.version, "1.0.0");
      assert.ok(typeof json.data.uptimeSeconds === "number");
      assert.ok(json.data.database);
      assert.ok(json.data.memory.rssMb > 0);

      // Verify all 8 core subsystems report operational
      const subs = json.data.subsystems;
      assert.strictEqual(subs.identityAndRbac, "operational");
      assert.strictEqual(subs.catalogAndTaxonomy, "operational");
      assert.strictEqual(subs.commerceAndPayments, "operational");
      assert.strictEqual(subs.videoPlayerAndCodingSandbox, "operational");
      assert.strictEqual(subs.credentialsAndBadges, "operational");
      assert.strictEqual(subs.instructorRevenueAndPayouts, "operational");
      assert.strictEqual(subs.bundlesAndSubscriptions, "operational");
      assert.strictEqual(subs.securityAndRateLimiting, "operational");

      // Verify master milestone roadmap status
      const roadmap = json.data.roadmapProgress;
      assert.strictEqual(roadmap.totalMilestones, 15);
      assert.strictEqual(roadmap.completedMilestones, 15);
      assert.strictEqual(roadmap.progressPercent, 100);
      assert.strictEqual(roadmap.status, "PRODUCTION_READY");
    });
  });

  describe("Search Engine Optimization (SEO), Sitemap & Robots", () => {
    test("should generate valid XML sitemap containing static, bundle, and course URLs", async () => {
      const map = await sitemap();
      assert.ok(Array.isArray(map));
      assert.ok(map.length >= 10, "Sitemap should cover marketplace landing, courses, and bundles");

      const urls = map.map((entry) => entry.url);
      assert.ok(urls.some((u) => u.endsWith("/courses")));
      assert.ok(urls.some((u) => u.endsWith("/bundles")));
      assert.ok(urls.some((u) => u.endsWith("/pricing")));
      assert.ok(urls.some((u) => u.includes("/bundles/cloud-native-architect-mastery")));
    });

    test("should generate standard robots.txt permitting indexing and guarding protected paths", () => {
      const config = robots();
      assert.ok(config.sitemap);
      assert.ok(config.rules);

      const rule = Array.isArray(config.rules) ? config.rules[0] : config.rules;
      assert.strictEqual(rule.userAgent, "*");
      assert.ok(Array.isArray(rule.disallow));
      assert.ok(rule.disallow.includes("/admin/*"));
      assert.ok(rule.disallow.includes("/student/*"));
      assert.ok(rule.disallow.includes("/instructor/*"));
      assert.ok(rule.disallow.includes("/api/*"));
    });
  });
});
