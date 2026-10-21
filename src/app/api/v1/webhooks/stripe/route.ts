import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/server/services/payment.service";
import { OrderService } from "@/server/services/order.service";
import { logger } from "@/server/api/logger";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const rawBody = await request.text();

  if (webhookSecret && signature) {
    const isValid = PaymentService.verifyStripeSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      logger.warn("Invalid Stripe webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  try {
    const event = JSON.parse(rawBody);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        await OrderService.fulfillOrder(orderId, paymentIntent.id, "STRIPE", paymentIntent);
        logger.info(`Stripe webhook successfully fulfilled order ${orderId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Error processing Stripe webhook", { error });
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
