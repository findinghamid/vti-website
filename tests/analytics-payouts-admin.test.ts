import test, { describe } from "node:test";
import assert from "node:assert";
import { InstructorAnalyticsService } from "../src/server/services/instructor-analytics.service";
import { PayoutService } from "../src/server/services/payout.service";
import { AdminOperationsService } from "../src/server/services/admin-operations.service";

describe("Milestone 13: Instructor Analytics & Revenue Engine", () => {
  const testInstructorId = "usr_instructor_01";

  test("should compute comprehensive instructor KPI summary", async () => {
    const summary = await InstructorAnalyticsService.getInstructorSummary(testInstructorId);

    assert.ok(summary);
    assert.strictEqual(typeof summary.totalEarningsMinor, "number");
    assert.ok(summary.totalEarningsMinor >= 0);
    assert.strictEqual(typeof summary.last30DaysEarningsMinor, "number");
    assert.strictEqual(typeof summary.totalStudents, "number");
    assert.ok(summary.totalStudents >= 0);
    assert.strictEqual(typeof summary.averageRating, "number");
    assert.ok(summary.averageRating >= 1.0 && summary.averageRating <= 5.0);
    assert.strictEqual(typeof summary.averageCompletionRatePct, "number");
    assert.ok(summary.averageCompletionRatePct >= 0 && summary.averageCompletionRatePct <= 100);
    assert.strictEqual(summary.currency, "USD");
  });

  test("should return granular course performance metrics", async () => {
    const courses = await InstructorAnalyticsService.getCoursePerformance(testInstructorId);

    assert.ok(Array.isArray(courses));
    assert.ok(courses.length > 0);

    const first = courses[0];
    assert.ok(first.courseId);
    assert.ok(first.title);
    assert.ok(first.slug);
    assert.strictEqual(typeof first.enrolledStudents, "number");
    assert.strictEqual(typeof first.revenueMinor, "number");
    assert.strictEqual(typeof first.averageRating, "number");
    assert.strictEqual(typeof first.completionRatePct, "number");
  });

  test("should generate 30-day chronological revenue time series", async () => {
    const series = await InstructorAnalyticsService.getRevenueTimeSeries(testInstructorId, 30);

    assert.ok(Array.isArray(series));
    assert.strictEqual(series.length, 30);

    const pt = series[0];
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(pt.date), "Date must match YYYY-MM-DD");
    assert.strictEqual(typeof pt.revenueMinor, "number");
    assert.ok(pt.revenueMinor >= 0);
    assert.strictEqual(typeof pt.ordersCount, "number");
  });

  test("should retrieve recent student enrollments feed", async () => {
    const enrollments = await InstructorAnalyticsService.getRecentEnrollments(testInstructorId, 5);

    assert.ok(Array.isArray(enrollments));
    assert.ok(enrollments.length > 0);

    const first = enrollments[0];
    assert.ok(first.studentName);
    assert.ok(first.courseTitle);
    assert.ok(first.enrolledAt);
    assert.strictEqual(typeof first.amountMinor, "number");
  });
});

describe("Milestone 13: Instructor Payouts & Balance Engine", () => {
  const testInstructorId = "usr_instructor_01";

  test("should calculate instructor available and pending balances", async () => {
    const balance = await PayoutService.getInstructorBalance(testInstructorId);

    assert.ok(balance);
    assert.strictEqual(typeof balance.availableMinor, "number");
    assert.strictEqual(typeof balance.pendingMinor, "number");
    assert.strictEqual(typeof balance.lifetimeEarningsMinor, "number");
    assert.strictEqual(balance.minWithdrawalThresholdMinor, 5000); // $50.00
    assert.strictEqual(typeof balance.canWithdraw, "boolean");
  });

  test("should reject payout request below $50.00 threshold", async () => {
    await assert.rejects(
      async () => {
        await PayoutService.requestPayout(
          testInstructorId,
          2500, // $25.00
          "STRIPE_CONNECT",
          { stripeAccountId: "acct_test_123" }
        );
      },
      {
        message: /Minimum payout amount is \$50\.00 USD\./,
      }
    );
  });

  test("should reject payout request exceeding available balance", async () => {
    const balance = await PayoutService.getInstructorBalance(testInstructorId);
    const excessiveAmount = balance.availableMinor + 99999999;

    await assert.rejects(
      async () => {
        await PayoutService.requestPayout(
          testInstructorId,
          excessiveAmount,
          "STRIPE_CONNECT",
          { stripeAccountId: "acct_test_123" }
        );
      },
      {
        message: /Insufficient available balance/,
      }
    );
  });

  test("should successfully create a valid payout request", async () => {
    const payout = await PayoutService.requestPayout(
      testInstructorId,
      5000, // $50.00
      "PAYPAL",
      { destinationAccount: "instructor@vti.edu" },
      "Unit test payout request"
    );

    assert.ok(payout);
    assert.ok(payout.id);
    assert.strictEqual(payout.amountMinor, 5000);
    assert.strictEqual(payout.status, "PENDING");
    assert.strictEqual(payout.payoutMethod, "PAYPAL");
  });

  test("should allow admin to approve and mark payout as PAID with reference ID", async () => {
    // Create new request
    const payout = await PayoutService.requestPayout(
      testInstructorId,
      6500, // $65.00
      "STRIPE_CONNECT",
      { stripeAccountId: "acct_test_approve" }
    );

    const approved = await PayoutService.decidePayout(
      payout.id,
      "usr_admin_01",
      "APPROVE",
      "tr_stripe_test_ref_9921",
      "Approved by admin test"
    );

    assert.ok(approved);
    assert.strictEqual(approved.id, payout.id);
    assert.strictEqual(approved.status, "PAID");
    assert.strictEqual(approved.referenceId, "tr_stripe_test_ref_9921");
    assert.ok(approved.processedAt);
  });

  test("should allow admin to reject payout and record notes", async () => {
    // Create new request
    const payout = await PayoutService.requestPayout(
      testInstructorId,
      7500, // $75.00
      "BANK_WIRE",
      { routing: "123456789" }
    );

    const rejected = await PayoutService.decidePayout(
      payout.id,
      "usr_admin_01",
      "REJECT",
      undefined,
      "Incorrect routing code provided."
    );

    assert.ok(rejected);
    assert.strictEqual(rejected.id, payout.id);
    assert.strictEqual(rejected.status, "REJECTED");
    assert.ok(rejected.notes?.includes("Incorrect routing code"));
  });
});

describe("Milestone 13: Admin Operations & Content Moderation", () => {
  test("should aggregate platform overview KPIs", async () => {
    const overview = await AdminOperationsService.getPlatformOverview();

    assert.ok(overview);
    assert.strictEqual(typeof overview.grossMerchandiseValueMinor, "number");
    assert.strictEqual(typeof overview.platformNetRevenueMinor, "number");
    assert.strictEqual(typeof overview.totalUsers, "number");
    assert.ok(overview.totalUsers > 0);
    assert.strictEqual(typeof overview.publishedCourses, "number");
    assert.strictEqual(typeof overview.pendingReviewCoursesCount, "number");
  });

  test("should retrieve course moderation queue", async () => {
    const queue = await AdminOperationsService.getModerationQueue();

    assert.ok(Array.isArray(queue));
    // Contains demo submission
    assert.ok(queue.length >= 0);
  });

  test("should approve course and transition status to PUBLISHED", async () => {
    const result = await AdminOperationsService.moderateCourse(
      "course_submission_demo_01",
      "usr_admin_01",
      "APPROVE"
    );

    assert.ok(result);
    assert.strictEqual(result.status, "PUBLISHED");
    assert.ok(result.message.includes("approved"));
  });

  test("should request changes and transition course to DRAFT with feedback", async () => {
    const result = await AdminOperationsService.moderateCourse(
      "course_test_revision",
      "usr_admin_01",
      "REQUEST_CHANGES",
      "Please re-record lesson 3 audio."
    );

    assert.ok(result);
    assert.strictEqual(result.status, "DRAFT");
    assert.ok(result.message.includes("Changes requested"));
  });

  test("should search and paginate platform users", async () => {
    const result = await AdminOperationsService.getUsersList({ limit: 10 });

    assert.ok(result);
    assert.ok(Array.isArray(result.users));
    assert.ok(result.users.length > 0);
    assert.strictEqual(typeof result.total, "number");

    const first = result.users[0];
    assert.ok(first.id);
    assert.ok(first.email);
    assert.ok(first.role);
    assert.ok(first.status);
  });

  test("should toggle user account status between ACTIVE and SUSPENDED", async () => {
    const suspended = await AdminOperationsService.setUserStatus(
      "usr_student_01",
      "usr_admin_01",
      "SUSPENDED",
      "Suspected chargeback abuse"
    );

    assert.ok(suspended);
    assert.strictEqual(suspended.status, "SUSPENDED");

    const reactivated = await AdminOperationsService.setUserStatus(
      "usr_student_01",
      "usr_admin_01",
      "ACTIVE",
      "Appeal reviewed and accepted"
    );

    assert.ok(reactivated);
    assert.strictEqual(reactivated.status, "ACTIVE");
  });
});
