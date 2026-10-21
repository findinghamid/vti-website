export interface PriceItem {
  priceAmount: number; // Current selling price in integer minor units (cents)
  discountAmount?: number | null; // Promotional discount off original price, if any
}

export interface CouponApplicable {
  code: string;
  discountType: "PERCENT" | "FIXED" | string;
  discountValue: number; // e.g. 20 for 20%, or 2500 for $25.00
  minSpendMinor?: number | null;
}

export interface PriceBreakdown {
  subtotalMinor: number; // Original gross list price
  promotionalDiscountMinor: number; // Savings from course sales / promos
  discountedSubtotalMinor: number; // Subtotal after promos, before coupons
  couponDiscountMinor: number; // Additional savings from applied coupon
  taxMinor: number; // Estimated sales tax
  totalMinor: number; // Final payable amount (cannot be negative)
  currency: string;
  formattedSubtotal: string;
  formattedPromotionalDiscount: string;
  formattedDiscountedSubtotal: string;
  formattedCouponDiscount: string;
  formattedTax: string;
  formattedTotal: string;
  appliedCoupon: {
    code: string;
    discountType: string;
    discountValue: number;
    savingsMinor: number;
    formattedSavings: string;
  } | null;
}

export class PricingService {
  /**
   * Format integer minor units (e.g. 4999 cents) into human-readable currency strings ($49.99).
   */
  static formatPrice(amountMinor: number, currency = "USD", allowFreeString = true): string {
    if (allowFreeString && amountMinor === 0) {
      return "Free";
    }

    const safeAmount = Math.max(0, amountMinor || 0);
    const majorUnits = (safeAmount / 100).toFixed(2);

    switch (currency.toUpperCase()) {
      case "USD":
        return `$${majorUnits}`;
      case "EUR":
        return `€${majorUnits}`;
      case "GBP":
        return `£${majorUnits}`;
      default:
        return `${currency.toUpperCase()} ${majorUnits}`;
    }
  }

  /**
   * Computes promotional percentage discount from selling price and discount difference.
   */
  static calculateDiscountPercent(priceAmount: number, discountAmount?: number | null): number | null {
    if (!discountAmount || discountAmount <= 0 || priceAmount <= 0) return null;
    const originalPrice = priceAmount + discountAmount;
    if (originalPrice <= 0) return null;
    return Math.round((discountAmount / originalPrice) * 100);
  }

  /**
   * Authoritative calculation of full cart price breakdown.
   * Server-authoritative: client-side calculations are strictly rejected.
   */
  static calculateBreakdown(
    items: PriceItem[],
    coupon?: CouponApplicable | null,
    taxPercent = 0,
    currency = "USD"
  ): PriceBreakdown {
    let subtotalMinor = 0;
    let promotionalDiscountMinor = 0;
    let discountedSubtotalMinor = 0;

    for (const item of items) {
      const sellingPrice = Math.max(0, item.priceAmount || 0);
      const promoSavings = Math.max(0, item.discountAmount || 0);
      const originalPrice = sellingPrice + promoSavings;

      subtotalMinor += originalPrice;
      promotionalDiscountMinor += promoSavings;
      discountedSubtotalMinor += sellingPrice;
    }

    let couponDiscountMinor = 0;
    let appliedCouponMeta: PriceBreakdown["appliedCoupon"] = null;

    if (coupon && discountedSubtotalMinor > 0) {
      const meetsMinSpend =
        !coupon.minSpendMinor || discountedSubtotalMinor >= coupon.minSpendMinor;

      if (meetsMinSpend) {
        if (coupon.discountType.toUpperCase() === "PERCENT") {
          const rawDiscount = Math.round((discountedSubtotalMinor * coupon.discountValue) / 100);
          couponDiscountMinor = Math.min(rawDiscount, discountedSubtotalMinor);
        } else if (coupon.discountType.toUpperCase() === "FIXED") {
          couponDiscountMinor = Math.min(coupon.discountValue, discountedSubtotalMinor);
        }

        if (couponDiscountMinor > 0) {
          appliedCouponMeta = {
            code: coupon.code.toUpperCase(),
            discountType: coupon.discountType.toUpperCase(),
            discountValue: coupon.discountValue,
            savingsMinor: couponDiscountMinor,
            formattedSavings: this.formatPrice(couponDiscountMinor, currency, false),
          };
        }
      }
    }

    const netTaxableMinor = Math.max(0, discountedSubtotalMinor - couponDiscountMinor);
    const taxMinor = taxPercent > 0 ? Math.round((netTaxableMinor * taxPercent) / 100) : 0;
    const totalMinor = Math.max(0, netTaxableMinor + taxMinor);

    return {
      subtotalMinor,
      promotionalDiscountMinor,
      discountedSubtotalMinor,
      couponDiscountMinor,
      taxMinor,
      totalMinor,
      currency,
      formattedSubtotal: this.formatPrice(subtotalMinor, currency, false),
      formattedPromotionalDiscount: this.formatPrice(promotionalDiscountMinor, currency, false),
      formattedDiscountedSubtotal: this.formatPrice(discountedSubtotalMinor, currency, false),
      formattedCouponDiscount: this.formatPrice(couponDiscountMinor, currency, false),
      formattedTax: this.formatPrice(taxMinor, currency, false),
      formattedTotal: this.formatPrice(totalMinor, currency, true),
      appliedCoupon: appliedCouponMeta,
    };
  }
}
