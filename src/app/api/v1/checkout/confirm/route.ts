import { NextRequest } from "next/server";
import { OrderService } from "@/server/services/order.service";
import { PaymentService, PaymentProviderType } from "@/server/services/payment.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError, NotFoundError } from "@/server/api/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, providerRefId, paymentProvider = "MOCK", paymentDetails } = body;

    if (!orderId) {
      throw new ValidationError("orderId is required to confirm checkout.");
    }

    const order = await OrderService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundError("Order");
    }

    // Process payment capture
    const paymentResult = await PaymentService.processPayment(
      order.id,
      providerRefId || `ref_${Date.now()}`,
      order.totalMinor,
      order.currency,
      paymentProvider as PaymentProviderType,
      paymentDetails
    );

    if (!paymentResult.success) {
      await OrderService.failOrder(order.id, paymentResult.failureReason);
      throw new ValidationError(paymentResult.failureReason || "Payment processing failed.");
    }

    // Fulfill order atomically and provision enrollments
    const fulfilledOrder = await OrderService.fulfillOrder(
      order.id,
      paymentResult.providerRefId,
      paymentProvider as PaymentProviderType,
      paymentResult.rawPayload
    );

    return apiSuccess({
      success: true,
      order: fulfilledOrder,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
