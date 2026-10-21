import crypto from "crypto";
import { logger } from "@/server/api/logger";
import { BadRequestError, ValidationError } from "@/server/api/errors";

export type PaymentProviderType = "MOCK" | "STRIPE" | "PAYPAL";

export interface PaymentIntentResult {
  providerRefId: string;
  clientSecret: string;
  provider: PaymentProviderType;
  amountMinor: number;
  currency: string;
  status: "REQUIRES_PAYMENT_METHOD" | "SUCCEEDED";
}

export interface PaymentExecutionResult {
  success: boolean;
  status: "SUCCEEDED" | "FAILED";
  providerRefId: string;
  amountMinor: number;
  currency: string;
  failureReason?: string;
  rawPayload: Record<string, unknown>;
}

export class PaymentService {
  /**
   * Initialize a payment intent across supported providers
   */
  static async createPaymentIntent(
    orderId: string,
    amountMinor: number,
    currency = "USD",
    provider: PaymentProviderType = "MOCK"
  ): Promise<PaymentIntentResult> {
    const normalizedCurrency = currency.toUpperCase();

    if (amountMinor < 0) {
      throw new ValidationError("Payment amount cannot be negative.");
    }

    // 100% Free orders (due to 100% coupon or free items)
    if (amountMinor === 0) {
      const freeRefId = `free_pi_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      return {
        providerRefId: freeRefId,
        clientSecret: `free_sec_${crypto.randomBytes(16).toString("hex")}`,
        provider: "MOCK",
        amountMinor: 0,
        currency: normalizedCurrency,
        status: "SUCCEEDED",
      };
    }

    if (provider === "STRIPE") {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (stripeSecretKey) {
        try {
          // Stripe dynamic fetch or API invocation
          const res = await fetch("https://api.stripe.com/v1/payment_intents", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${stripeSecretKey}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              amount: amountMinor.toString(),
              currency: normalizedCurrency.toLowerCase(),
              "metadata[orderId]": orderId,
              automatic_payment_methods: JSON.stringify({ enabled: true }),
            }),
          });
          const stripeIntent = await res.json();
          if (stripeIntent.id && stripeIntent.client_secret) {
            return {
              providerRefId: stripeIntent.id,
              clientSecret: stripeIntent.client_secret,
              provider: "STRIPE",
              amountMinor,
              currency: normalizedCurrency,
              status: "REQUIRES_PAYMENT_METHOD",
            };
          }
        } catch (error) {
          logger.warn("Failed creating real Stripe PaymentIntent, falling back to simulated intent", { error });
        }
      }
    }

    // Default / MOCK simulator
    const providerRefId = `mock_pi_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
    const clientSecret = `mock_sec_${crypto.randomBytes(16).toString("hex")}`;

    return {
      providerRefId,
      clientSecret,
      provider: provider === "STRIPE" ? "MOCK" : provider,
      amountMinor,
      currency: normalizedCurrency,
      status: "REQUIRES_PAYMENT_METHOD",
    };
  }

  /**
   * Execute or confirm payment capture
   */
  static async processPayment(
    orderId: string,
    providerRefId: string,
    amountMinor: number,
    currency = "USD",
    provider: PaymentProviderType = "MOCK",
    paymentDetails?: {
      cardNumber?: string;
      cardHolder?: string;
      expMonth?: string;
      expYear?: string;
      cvc?: string;
    }
  ): Promise<PaymentExecutionResult> {
    const normalizedCurrency = currency.toUpperCase();

    // 0 amount free orders succeed instantly
    if (amountMinor === 0) {
      return {
        success: true,
        status: "SUCCEEDED",
        providerRefId,
        amountMinor: 0,
        currency: normalizedCurrency,
        rawPayload: {
          provider: "FREE_ORDER",
          orderId,
          timestamp: new Date().toISOString(),
        },
      };
    }

    const rawCardNumber = (paymentDetails?.cardNumber || "").replace(/\s+/g, "");

    // Test payment decline triggers
    if (rawCardNumber.endsWith("0002") || rawCardNumber.includes("decline")) {
      return {
        success: false,
        status: "FAILED",
        providerRefId,
        amountMinor,
        currency: normalizedCurrency,
        failureReason: "Card was declined by issuing bank (insufficient authorization).",
        rawPayload: {
          provider,
          orderId,
          declineCode: "card_declined",
          timestamp: new Date().toISOString(),
        },
      };
    }

    if (rawCardNumber.endsWith("0003") || rawCardNumber.includes("funds")) {
      return {
        success: false,
        status: "FAILED",
        providerRefId,
        amountMinor,
        currency: normalizedCurrency,
        failureReason: "Insufficient funds on payment method.",
        rawPayload: {
          provider,
          orderId,
          declineCode: "insufficient_funds",
          timestamp: new Date().toISOString(),
        },
      };
    }

    // Successful payment simulation
    return {
      success: true,
      status: "SUCCEEDED",
      providerRefId,
      amountMinor,
      currency: normalizedCurrency,
      rawPayload: {
        provider,
        orderId,
        transactionId: `txn_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
        last4: rawCardNumber.slice(-4) || "4242",
        brand: "Visa",
        capturedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Verify Stripe Webhook Signature
   */
  static verifyStripeSignature(payload: string, headerSignature: string, webhookSecret: string): boolean {
    try {
      const parts = headerSignature.split(",");
      const timestamp = parts.find((p) => p.startsWith("t="))?.replace("t=", "");
      const sig = parts.find((p) => p.startsWith("v1="))?.replace("v1=", "");

      if (!timestamp || !sig) return false;

      const signedPayload = `${timestamp}.${payload}`;
      const expectedSig = crypto
        .createHmac("sha256", webhookSecret)
        .update(signedPayload, "utf8")
        .digest("hex");

      return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
    } catch {
      return false;
    }
  }
}
