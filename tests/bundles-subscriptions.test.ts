import test, { describe } from "node:test";
import assert from "node:assert";
import { BundleService } from "../src/server/services/bundle.service";
import { SubscriptionService } from "../src/server/services/subscription.service";
import { LearningService } from "../src/server/services/learning.service";
import { EnrollmentService } from "../src/server/services/enrollment.service";

describe("Milestone 14: Course Bundles Architecture & Purchase Flow", () => {
  const testStudentId = `usr_bundle_student_${Date.now()}`;

  test("should retrieve all active curated course bundles with savings math", async () => {
    const bundles = await BundleService.getAllBundles();

    assert.ok(Array.isArray(bundles));
    assert.ok(bundles.length > 0);

    const first = bundles[0];
    assert.ok(first.id);
    assert.ok(first.title);
    assert.ok(first.slug);
    assert.ok(first.coursesCount >= 2, "A bundle must contain at least 2 courses");
    assert.ok(first.bundlePriceMinor < first.totalStandalonePriceMinor, "Bundle price must be discounted");
    assert.strictEqual(
      first.savingsMinor,
      first.totalStandalonePriceMinor - first.bundlePriceMinor
    );
    assert.ok(first.savingsPercent > 0);
  });

  test("should fetch bundle by slug with member course details", async () => {
    const bundle = await BundleService.getBundleBySlug("cloud-native-architect-mastery");

    assert.ok(bundle);
    assert.strictEqual(bundle.slug, "cloud-native-architect-mastery");
    assert.ok(bundle.courses.length >= 2);

    const member = bundle.courses[0];
    assert.ok(member.id);
    assert.ok(member.title);
    assert.ok(member.priceAmount > 0);
    assert.ok(member.instructorName);
  });

  test("should reject creating a bundle with fewer than 2 courses", async () => {
    await assert.rejects(
      async () => {
        await BundleService.createBundle("usr_admin_01", {
          title: "Invalid Bundle",
          slug: "invalid-bundle",
          priceAmount: 4900,
          courseIds: ["single-course-id"],
        });
      },
      {
        message: /A bundle must contain at least 2 courses/,
      }
    );
  });

  test("should purchase bundle and atomically enroll student in ALL member courses", async () => {
    const bundle = await BundleService.getBundleBySlug("cloud-native-architect-mastery");
    assert.ok(bundle);

    const result = await BundleService.purchaseBundle(
      testStudentId,
      bundle.slug,
      "STRIPE"
    );

    assert.ok(result);
    assert.ok(result.orderId);
    assert.strictEqual(result.bundleTitle, bundle.title);
    assert.strictEqual(result.totalPaidMinor, bundle.bundlePriceMinor);
    assert.strictEqual(result.enrolledCourseIds.length, bundle.courses.length);

    // Verify student is now enrolled in each member course
    for (const memberCourse of bundle.courses) {
      const isEnrolled = await EnrollmentService.isEnrolled(testStudentId, memberCourse.id);
      assert.strictEqual(isEnrolled, true, `Student should be enrolled in ${memberCourse.title}`);
    }
  });
});

describe("Milestone 14: Subscriptions & Recurring Access Engine", () => {
  const testSubUserId = `usr_sub_user_${Date.now()}`;

  test("should retrieve active subscription plans with billing intervals and features", async () => {
    const plans = await SubscriptionService.getSubscriptionPlans();

    assert.ok(Array.isArray(plans));
    assert.ok(plans.length >= 2);

    const monthlyPlan = plans.find((p) => p.interval === "MONTHLY");
    assert.ok(monthlyPlan);
    assert.ok(monthlyPlan.priceAmount > 0);
    assert.ok(monthlyPlan.features.length >= 3);

    const annualPlan = plans.find((p) => p.interval === "ANNUAL");
    assert.ok(annualPlan);
    assert.ok(annualPlan.priceAmount > monthlyPlan.priceAmount);
  });

  test("should verify user has no entitlement before subscribing", async () => {
    const hasEntitlement = await SubscriptionService.hasActiveCatalogEntitlement(testSubUserId);
    assert.strictEqual(hasEntitlement, false);

    const activeSub = await SubscriptionService.getUserActiveSubscription(testSubUserId);
    assert.strictEqual(activeSub, null);
  });

  test("should successfully subscribe student to Personal Pro plan", async () => {
    const sub = await SubscriptionService.subscribeToPlan(testSubUserId, "pro-monthly");

    assert.ok(sub);
    assert.strictEqual(sub.userId, testSubUserId);
    assert.strictEqual(sub.planSlug, "pro-monthly");
    assert.strictEqual(sub.status, "ACTIVE");
    assert.strictEqual(sub.cancelAtPeriodEnd, false);
    assert.ok(sub.daysRemaining > 0);
    assert.strictEqual(sub.hasAccess, true);

    // Now has active catalog entitlement
    const hasEntitlement = await SubscriptionService.hasActiveCatalogEntitlement(testSubUserId);
    assert.strictEqual(hasEntitlement, true);
  });

  test("should schedule subscription cancellation at end of billing period", async () => {
    const canceled = await SubscriptionService.cancelSubscription(testSubUserId);

    assert.ok(canceled);
    assert.strictEqual(canceled.cancelAtPeriodEnd, true);
    assert.ok(canceled.canceledAt);
    // Student retains access until the end of the billing period
    assert.strictEqual(canceled.hasAccess, true);

    const hasEntitlement = await SubscriptionService.hasActiveCatalogEntitlement(testSubUserId);
    assert.strictEqual(hasEntitlement, true, "Must retain entitlement until billing period ends");
  });

  test("should allow student to reactivate subscription before billing period ends", async () => {
    const reactivated = await SubscriptionService.reactivateSubscription(testSubUserId);

    assert.ok(reactivated);
    assert.strictEqual(reactivated.cancelAtPeriodEnd, false);
    assert.strictEqual(reactivated.canceledAt, null);
    assert.strictEqual(reactivated.hasAccess, true);
  });

  test("should transparently grant course player access via subscription entitlement", async () => {
    // Student testSubUserId has never bought "course-demo-cloud" individually,
    // but because they have an active subscription, learning service player context resolves access!
    const context = await LearningService.getCoursePlayerContext(
      testSubUserId,
      "mastering-nextjs-16-typescript-enterprise-architecture"
    );

    assert.ok(context);
    assert.strictEqual(context.isEnrolled, true);
    assert.ok(context.sections.length >= 0);
  });
});
