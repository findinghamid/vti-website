import { test, describe } from "node:test";
import assert from "node:assert";
import { PricingService } from "../src/server/services/pricing.service";
import { CouponService } from "../src/server/services/coupon.service";
import { CartService } from "../src/server/services/cart.service";
import { WishlistService } from "../src/server/services/wishlist.service";
import { ValidationError, NotFoundError } from "../src/server/api/errors";

describe("Milestone 7: Pricing Engine & Minor Units Calculations", () => {
  test("should format monetary values correctly with integer minor units", () => {
    assert.strictEqual(PricingService.formatPrice(0), "Free");
    assert.strictEqual(PricingService.formatPrice(0, "USD", false), "$0.00");
    assert.strictEqual(PricingService.formatPrice(1999), "$19.99");
    assert.strictEqual(PricingService.formatPrice(4999), "$49.99");
    assert.strictEqual(PricingService.formatPrice(5000, "EUR"), "€50.00");
    assert.strictEqual(PricingService.formatPrice(2500, "GBP"), "£25.00");
  });

  test("should accurately calculate discount percentage", () => {
    // 4999 selling price, 2000 promo discount -> original is 6999 -> 2000 / 6999 = 28.57% -> 29%
    assert.strictEqual(PricingService.calculateDiscountPercent(4999, 2000), 29);
    assert.strictEqual(PricingService.calculateDiscountPercent(4999, 0), null);
    assert.strictEqual(PricingService.calculateDiscountPercent(4999, null), null);
    assert.strictEqual(PricingService.calculateDiscountPercent(0, 1000), null);
  });

  test("should calculate complete price breakdown without coupons", () => {
    const items = [
      { priceAmount: 4999, discountAmount: 2000 }, // original: 6999, promo: 2000
      { priceAmount: 5999, discountAmount: null },  // original: 5999, promo: 0
    ];

    const breakdown = PricingService.calculateBreakdown(items);

    assert.strictEqual(breakdown.subtotalMinor, 12998); // 6999 + 5999
    assert.strictEqual(breakdown.promotionalDiscountMinor, 2000);
    assert.strictEqual(breakdown.discountedSubtotalMinor, 10998); // 12998 - 2000
    assert.strictEqual(breakdown.couponDiscountMinor, 0);
    assert.strictEqual(breakdown.taxMinor, 0);
    assert.strictEqual(breakdown.totalMinor, 10998);
    assert.strictEqual(breakdown.formattedTotal, "$109.98");
  });

  test("should calculate percentage coupon discount properly", () => {
    const items = [
      { priceAmount: 10000, discountAmount: null }, // $100.00
    ];

    const coupon = {
      code: "WELCOME20",
      discountType: "PERCENT" as const,
      discountValue: 20, // 20%
    };

    const breakdown = PricingService.calculateBreakdown(items, coupon);

    assert.strictEqual(breakdown.discountedSubtotalMinor, 10000);
    assert.strictEqual(breakdown.couponDiscountMinor, 2000); // 20% of 10000 = 2000
    assert.strictEqual(breakdown.totalMinor, 8000); // $80.00
    assert.strictEqual(breakdown.formattedTotal, "$80.00");
    assert.strictEqual(breakdown.appliedCoupon?.code, "WELCOME20");
    assert.strictEqual(breakdown.appliedCoupon?.savingsMinor, 2000);
  });

  test("should enforce minimum spend requirement on coupons", () => {
    const items = [
      { priceAmount: 4999, discountAmount: null }, // $49.99
    ];

    // VTI50 requires $100.00 (10000 minor units) minimum spend
    const coupon = {
      code: "VTI50",
      discountType: "FIXED" as const,
      discountValue: 5000,
      minSpendMinor: 10000,
    };

    const breakdown = PricingService.calculateBreakdown(items, coupon);

    // Coupon does NOT apply because 4999 < 10000
    assert.strictEqual(breakdown.couponDiscountMinor, 0);
    assert.strictEqual(breakdown.totalMinor, 4999);
    assert.strictEqual(breakdown.appliedCoupon, null);
  });

  test("should cap fixed coupons so total never goes below zero", () => {
    const items = [
      { priceAmount: 3000, discountAmount: null }, // $30.00
    ];

    const coupon = {
      code: "MEGA50",
      discountType: "FIXED" as const,
      discountValue: 5000, // $50 off
      minSpendMinor: 0,
    };

    const breakdown = PricingService.calculateBreakdown(items, coupon);

    assert.strictEqual(breakdown.couponDiscountMinor, 3000); // Capped at subtotal
    assert.strictEqual(breakdown.totalMinor, 0);
    assert.strictEqual(breakdown.formattedTotal, "Free");
  });
});

describe("Milestone 7: Coupon Validation Service", () => {
  test("should validate active coupon WELCOME20 successfully", async () => {
    const result = await CouponService.validateCoupon("WELCOME20", 5000);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.code, "WELCOME20");
    assert.strictEqual(result.discountType, "PERCENT");
    assert.strictEqual(result.discountMinor, 1000); // 20% of 5000 = 1000
    assert.strictEqual(result.formattedDiscount, "$10.00");
  });

  test("should reject coupon when minimum spend is not met", async () => {
    // VTI50 requires 10000 min spend, passing 5000
    await assert.rejects(
      async () => {
        await CouponService.validateCoupon("VTI50", 5000);
      },
      (err: unknown) => {
        assert.ok(err instanceof ValidationError);
        assert.match((err as Error).message, /requires a minimum order/i);
        return true;
      }
    );
  });

  test("should approve coupon VTI50 when minimum spend is satisfied", async () => {
    const result = await CouponService.validateCoupon("VTI50", 12000);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.discountMinor, 5000);
    assert.strictEqual(result.formattedDiscount, "$50.00");
  });

  test("should reject expired coupon", async () => {
    await assert.rejects(
      async () => {
        await CouponService.validateCoupon("EXPIRED99", 10000);
      },
      (err: unknown) => {
        assert.ok(err instanceof ValidationError);
        assert.match((err as Error).message, /expired/i);
        return true;
      }
    );
  });

  test("should reject inactive coupon", async () => {
    await assert.rejects(
      async () => {
        await CouponService.validateCoupon("INACTIVE50", 10000);
      },
      (err: unknown) => {
        assert.ok(err instanceof ValidationError);
        assert.match((err as Error).message, /inactive/i);
        return true;
      }
    );
  });

  test("should reject non-existent coupon code", async () => {
    await assert.rejects(
      async () => {
        await CouponService.validateCoupon("DOESNOTEXIST999", 5000);
      },
      (err: unknown) => {
        assert.ok(err instanceof NotFoundError);
        return true;
      }
    );
  });
});

describe("Milestone 7: Cart Operations & Integrity", () => {
  const testUserId = "test-user-commerce-session-1";

  test("should add course to cart and compute valid breakdown", async () => {
    const cart = await CartService.addToCart(testUserId, "course-fallback-1");
    assert.strictEqual(cart.userId, testUserId);
    assert.ok(cart.itemCount >= 1);
    assert.ok(cart.items.some((i) => i.courseId === "course-fallback-1"));
    assert.ok(cart.breakdown.totalMinor > 0);
  });

  test("should prevent duplicate courses from being added to cart", async () => {
    // Add same course again
    const cart = await CartService.addToCart(testUserId, "course-fallback-1");
    const matchingItems = cart.items.filter((i) => i.courseId === "course-fallback-1");
    assert.strictEqual(matchingItems.length, 1, "Should not duplicate items in cart");
  });

  test("should block addition to cart if user is already enrolled", async () => {
    await assert.rejects(
      async () => {
        await CartService.addToCart("demo-student-enrolled", "course-fallback-3");
      },
      (err: unknown) => {
        assert.ok(err instanceof ValidationError);
        assert.match((err as Error).message, /already enrolled/i);
        return true;
      }
    );
  });

  test("should remove course from cart", async () => {
    const cart = await CartService.removeFromCart(testUserId, "course-fallback-1");
    const exists = cart.items.some((i) => i.courseId === "course-fallback-1");
    assert.strictEqual(exists, false, "Item should be removed from cart");
  });

  test("should clear cart completely", async () => {
    await CartService.addToCart(testUserId, "course-fallback-1");
    await CartService.addToCart(testUserId, "course-fallback-2");
    const cart = await CartService.clearCart(testUserId);
    assert.strictEqual(cart.items.length, 0);
    assert.strictEqual(cart.itemCount, 0);
  });
});

describe("Milestone 7: Wishlist Operations", () => {
  const testWishlistUser = "test-user-wishlist-session-1";

  test("should toggle course into wishlist", async () => {
    const res = await WishlistService.toggleWishlist(testWishlistUser, "course-fallback-2");
    assert.strictEqual(res.inWishlist, true);
    assert.strictEqual(res.course.courseId, "course-fallback-2");

    const inList = await WishlistService.isInWishlist(testWishlistUser, "course-fallback-2");
    assert.strictEqual(inList, true);
  });

  test("should block adding to wishlist if user is already enrolled", async () => {
    await assert.rejects(
      async () => {
        await WishlistService.toggleWishlist("demo-student-enrolled", "course-fallback-3");
      },
      (err: unknown) => {
        assert.ok(err instanceof ValidationError);
        assert.match((err as Error).message, /already enrolled/i);
        return true;
      }
    );
  });

  test("should move course from wishlist directly to cart", async () => {
    const moveRes = await WishlistService.moveToCart(testWishlistUser, "course-fallback-2");
    assert.strictEqual(moveRes.success, true);
    assert.ok(moveRes.cart.items.some((i) => i.courseId === "course-fallback-2"));

    const inWishlistNow = await WishlistService.isInWishlist(testWishlistUser, "course-fallback-2");
    assert.strictEqual(inWishlistNow, false, "Should be removed from wishlist after moving to cart");
  });
});
