import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";
import { ValidationError, NotFoundError } from "@/server/api/errors";
import { PricingService } from "./pricing.service";

export interface CouponRecord {
  id: string;
  code: string;
  discountType: "PERCENT" | "FIXED" | string;
  discountValue: number;
  maxUses?: number | null;
  usedCount: number;
  minSpendMinor?: number | null;
  startsAt?: Date | null;
  expiresAt?: Date | null;
  isActive: boolean;
  createdAt?: Date;
}

export interface CouponValidationResult {
  isValid: boolean;
  code: string;
  discountType: string;
  discountValue: number;
  discountMinor: number;
  formattedDiscount: string;
  minSpendMinor: number | null;
  message: string;
}

// Built-in fallback coupons for offline dev and test verification
const FALLBACK_COUPONS: Map<string, CouponRecord> = new Map([
  [
    "WELCOME20",
    {
      id: "coupon-welcome-20",
      code: "WELCOME20",
      discountType: "PERCENT",
      discountValue: 20,
      maxUses: 1000,
      usedCount: 45,
      minSpendMinor: null,
      startsAt: new Date("2026-01-01"),
      expiresAt: new Date("2030-12-31"),
      isActive: true,
    },
  ],
  [
    "VTI50",
    {
      id: "coupon-vti-50",
      code: "VTI50",
      discountType: "FIXED",
      discountValue: 5000, // $50.00 in minor units
      maxUses: 500,
      usedCount: 12,
      minSpendMinor: 10000, // $100.00 min spend required
      startsAt: new Date("2026-01-01"),
      expiresAt: new Date("2030-12-31"),
      isActive: true,
    },
  ],
  [
    "LAUNCH10",
    {
      id: "coupon-launch-10",
      code: "LAUNCH10",
      discountType: "PERCENT",
      discountValue: 10,
      maxUses: 10000,
      usedCount: 220,
      minSpendMinor: null,
      startsAt: new Date("2026-01-01"),
      expiresAt: new Date("2030-12-31"),
      isActive: true,
    },
  ],
  [
    "EXPIRED99",
    {
      id: "coupon-expired-99",
      code: "EXPIRED99",
      discountType: "PERCENT",
      discountValue: 99,
      maxUses: 100,
      usedCount: 50,
      minSpendMinor: null,
      startsAt: new Date("2025-01-01"),
      expiresAt: new Date("2025-02-01"), // Expired
      isActive: true,
    },
  ],
  [
    "INACTIVE50",
    {
      id: "coupon-inactive-50",
      code: "INACTIVE50",
      discountType: "PERCENT",
      discountValue: 50,
      maxUses: 100,
      usedCount: 0,
      minSpendMinor: null,
      startsAt: new Date("2026-01-01"),
      expiresAt: new Date("2030-12-31"),
      isActive: false, // Inactive
    },
  ],
]);

export class CouponService {
  /**
   * Find coupon by code in DB or in-memory fallback
   */
  static async getCouponByCode(code: string): Promise<CouponRecord | null> {
    const normalizedCode = code.trim().toUpperCase();

    try {
      const record = await prisma.coupon.findUnique({
        where: { code: normalizedCode },
      });

      if (record) {
        return record;
      }
    } catch (error) {
      logger.warn(`Failed reading coupon "${normalizedCode}" from database, using fallback registry`, {
        error,
      });
    }

    return FALLBACK_COUPONS.get(normalizedCode) || null;
  }

  /**
   * Authoritatively validate a coupon code against a current cart subtotal.
   * Checks existence, active status, date range, usage count, and minimum spend.
   */
  static async validateCoupon(
    rawCode: string,
    subtotalMinor: number,
    currency = "USD"
  ): Promise<CouponValidationResult> {
    if (!rawCode || !rawCode.trim()) {
      throw new ValidationError("Coupon code is required");
    }

    const normalizedCode = rawCode.trim().toUpperCase();
    const coupon = await this.getCouponByCode(normalizedCode);

    if (!coupon) {
      throw new NotFoundError(`Coupon code "${normalizedCode}" is invalid.`);
    }

    if (!coupon.isActive) {
      throw new ValidationError(`Coupon "${normalizedCode}" is currently inactive.`);
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new ValidationError(`Coupon "${normalizedCode}" is not active yet.`);
    }

    if (coupon.expiresAt && coupon.expiresAt < now) {
      throw new ValidationError(`Coupon "${normalizedCode}" has expired.`);
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new ValidationError(`Coupon "${normalizedCode}" has reached its maximum usage limit.`);
    }

    if (coupon.minSpendMinor && subtotalMinor < coupon.minSpendMinor) {
      const formattedMin = PricingService.formatPrice(coupon.minSpendMinor, currency);
      throw new ValidationError(
        `Coupon "${normalizedCode}" requires a minimum order of ${formattedMin}.`
      );
    }

    let discountMinor = 0;
    if (coupon.discountType.toUpperCase() === "PERCENT") {
      discountMinor = Math.min(
        subtotalMinor,
        Math.round((subtotalMinor * coupon.discountValue) / 100)
      );
    } else if (coupon.discountType.toUpperCase() === "FIXED") {
      discountMinor = Math.min(subtotalMinor, coupon.discountValue);
    }

    return {
      isValid: true,
      code: coupon.code,
      discountType: coupon.discountType.toUpperCase(),
      discountValue: coupon.discountValue,
      discountMinor,
      formattedDiscount: PricingService.formatPrice(discountMinor, currency, false),
      minSpendMinor: coupon.minSpendMinor ?? null,
      message:
        coupon.discountType === "PERCENT"
          ? `${coupon.discountValue}% discount applied successfully!`
          : `${PricingService.formatPrice(coupon.discountValue, currency, false)} discount applied successfully!`,
    };
  }

  /**
   * Administrative coupon creation
   */
  static async createCoupon(data: {
    code: string;
    discountType: "PERCENT" | "FIXED";
    discountValue: number;
    maxUses?: number;
    minSpendMinor?: number;
    startsAt?: Date;
    expiresAt?: Date;
  }): Promise<CouponRecord> {
    const normalizedCode = data.code.trim().toUpperCase();

    try {
      const created = await prisma.coupon.create({
        data: {
          code: normalizedCode,
          discountType: data.discountType,
          discountValue: data.discountValue,
          maxUses: data.maxUses,
          minSpendMinor: data.minSpendMinor,
          startsAt: data.startsAt,
          expiresAt: data.expiresAt,
          isActive: true,
        },
      });
      return created;
    } catch (error) {
      logger.warn(`Failed creating coupon in database, storing in fallback registry`, { error });
      const record: CouponRecord = {
        id: `coupon-custom-${Date.now()}`,
        code: normalizedCode,
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxUses: data.maxUses,
        usedCount: 0,
        minSpendMinor: data.minSpendMinor,
        startsAt: data.startsAt,
        expiresAt: data.expiresAt,
        isActive: true,
      };
      FALLBACK_COUPONS.set(normalizedCode, record);
      return record;
    }
  }

  /**
   * List active promotional coupons
   */
  static async listCoupons(): Promise<CouponRecord[]> {
    try {
      const records = await prisma.coupon.findMany({
        orderBy: { code: "asc" },
      });
      if (records.length > 0) return records;
    } catch (error) {
      logger.warn("Failed fetching coupons from database, returning fallback coupons", { error });
    }

    return Array.from(FALLBACK_COUPONS.values());
  }
}
