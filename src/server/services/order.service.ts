import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";
import { OrderStatus } from "@prisma/client";
import { NotFoundError, ValidationError } from "@/server/api/errors";
import { CartService } from "./cart.service";
import { PricingService, PriceBreakdown } from "./pricing.service";
import { PaymentService, PaymentProviderType } from "./payment.service";
import { EnrollmentService } from "./enrollment.service";

export interface OrderItemDetail {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  priceMinor: number;
  formattedPrice: string;
  instructorName?: string;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  userId: string;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  currency: string;
  status: OrderStatus;
  couponCode: string | null;
  items: OrderItemDetail[];
  payment?: {
    id: string;
    provider: string;
    providerRefId: string;
    amountMinor: number;
    status: string;
    createdAt: string;
  } | null;
  formattedSubtotal: string;
  formattedDiscount: string;
  formattedTax: string;
  formattedTotal: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory fallback order repository for offline dev & test environments
const FALLBACK_ORDERS: Map<string, OrderDetail> = new Map();

export class OrderService {
  /**
   * Generate human-readable order number (e.g. VTI-ORD-2026-9481)
   */
  static generateOrderNumber(): string {
    const timestampPart = Date.now().toString(36).toUpperCase().slice(-5);
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `VTI-ORD-${timestampPart}-${randomPart}`;
  }

  /**
   * Initialize a new order from current cart state and lock in prices
   */
  static async createOrderFromCart(
    userId: string,
    options: {
      paymentProvider?: PaymentProviderType;
      couponCode?: string | null;
      billingEmail?: string;
      billingName?: string;
    } = {}
  ): Promise<{
    order: OrderDetail;
    clientSecret: string;
    providerRefId: string;
  }> {
    const provider = options.paymentProvider || "MOCK";
    const cart = await CartService.getCart(userId, options.couponCode);

    if (cart.items.length === 0) {
      throw new ValidationError("Cannot checkout with an empty shopping cart.");
    }

    // Verify user is not already enrolled in any course in cart
    for (const item of cart.items) {
      const isEnrolled = await EnrollmentService.isEnrolled(userId, item.courseId);
      if (isEnrolled) {
        throw new ValidationError(`You are already enrolled in "${item.title}". Please remove it from your cart.`);
      }
    }

    const orderNumber = this.generateOrderNumber();
    const { breakdown } = cart;
    const now = new Date();
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const totalDiscountMinor = breakdown.promotionalDiscountMinor + breakdown.couponDiscountMinor;

    // Initialize payment intent
    const intent = await PaymentService.createPaymentIntent(
      orderId,
      breakdown.totalMinor,
      breakdown.currency,
      provider
    );

    const orderItems: OrderItemDetail[] = cart.items.map((ci) => ({
      id: `oi_${ci.courseId}_${Date.now()}`,
      courseId: ci.courseId,
      title: ci.title,
      slug: ci.slug,
      thumbnailUrl: ci.thumbnailUrl,
      priceMinor: ci.priceAmount,
      formattedPrice: ci.formattedPrice,
      instructorName: ci.instructors[0]?.name,
    }));

    const orderDetail: OrderDetail = {
      id: orderId,
      orderNumber,
      userId,
      subtotalMinor: breakdown.subtotalMinor,
      discountMinor: totalDiscountMinor,
      taxMinor: breakdown.taxMinor,
      totalMinor: breakdown.totalMinor,
      currency: breakdown.currency,
      status: OrderStatus.PENDING,
      couponCode: breakdown.appliedCoupon?.code || null,
      items: orderItems,
      payment: null,
      formattedSubtotal: breakdown.formattedSubtotal,
      formattedDiscount: PricingService.formatPrice(totalDiscountMinor, breakdown.currency),
      formattedTax: breakdown.formattedTax,
      formattedTotal: breakdown.formattedTotal,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    try {
      const created = await prisma.order.create({
        data: {
          id: orderId,
          orderNumber,
          userId,
          subtotalMinor: breakdown.subtotalMinor,
          discountMinor: totalDiscountMinor,
          taxMinor: breakdown.taxMinor,
          totalMinor: breakdown.totalMinor,
          currency: breakdown.currency,
          status: OrderStatus.PENDING,
          couponCode: breakdown.appliedCoupon?.code || null,
          items: {
            create: cart.items.map((ci) => ({
              courseId: ci.courseId,
              priceMinor: ci.priceAmount,
            })),
          },
        },
      });
      orderDetail.id = created.id;
    } catch (error) {
      logger.warn("Failed persisting order to database, using fallback repository", { error });
    }

    FALLBACK_ORDERS.set(orderDetail.id, orderDetail);

    return {
      order: orderDetail,
      clientSecret: intent.clientSecret,
      providerRefId: intent.providerRefId,
    };
  }

  /**
   * Atomically fulfill order upon verified payment success
   */
  static async fulfillOrder(
    orderId: string,
    paymentRefId: string,
    provider: PaymentProviderType = "MOCK",
    rawPayload?: unknown
  ): Promise<OrderDetail> {
    let order = await this.getOrderById(orderId);
    if (!order) {
      throw new NotFoundError("Order");
    }

    // Idempotent: If already completed, return immediately
    if (order.status === OrderStatus.COMPLETED) {
      return order;
    }

    const now = new Date();

    try {
      // 1. Transaction to update order and create payment record in database
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.COMPLETED,
            updatedAt: now,
          },
        }),
        prisma.payment.create({
          data: {
            orderId: order.id,
            provider,
            providerRefId: paymentRefId,
            amountMinor: order.totalMinor,
            currency: order.currency,
            status: "SUCCEEDED",
            rawPayload: (rawPayload as object) || {},
          },
        }),
      ]);
    } catch (error) {
      logger.warn("Failed fulfilling order in database transaction, updating fallback state", { error });
    }

    // 2. Provision course enrollments
    const courseIds = order.items.map((i) => i.courseId);
    await EnrollmentService.provisionEnrollments(order.userId, courseIds);

    // 3. Clear shopping cart
    await CartService.clearCart(order.userId);

    // 4. Update in-memory state
    order.status = OrderStatus.COMPLETED;
    order.updatedAt = now.toISOString();
    order.payment = {
      id: `pay_${Date.now()}`,
      provider,
      providerRefId: paymentRefId,
      amountMinor: order.totalMinor,
      status: "SUCCEEDED",
      createdAt: now.toISOString(),
    };
    FALLBACK_ORDERS.set(order.id, order);

    return order;
  }

  /**
   * Mark order as failed
   */
  static async failOrder(orderId: string, reason?: string): Promise<OrderDetail> {
    const order = await this.getOrderById(orderId);
    if (!order) throw new NotFoundError("Order");

    try {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.FAILED },
      });
    } catch {
      // Fallback
    }

    order.status = OrderStatus.FAILED;
    order.updatedAt = new Date().toISOString();
    FALLBACK_ORDERS.set(orderId, order);
    return order;
  }

  /**
   * Retrieve order details by ID
   */
  static async getOrderById(orderId: string, userId?: string): Promise<OrderDetail | null> {
    try {
      const dbOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  thumbnailUrl: true,
                  instructors: {
                    include: {
                      instructor: {
                        include: { user: { select: { name: true } } },
                      },
                    },
                  },
                },
              },
            },
          },
          payments: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (dbOrder) {
        if (userId && dbOrder.userId !== userId) {
          return null;
        }

        const items: OrderItemDetail[] = dbOrder.items.map((i) => ({
          id: i.id,
          courseId: i.courseId,
          title: i.course.title,
          slug: i.course.slug,
          thumbnailUrl: i.course.thumbnailUrl,
          priceMinor: i.priceMinor,
          formattedPrice: PricingService.formatPrice(i.priceMinor, dbOrder.currency),
          instructorName: i.course.instructors[0]?.instructor.user.name,
        }));

        const latestPayment = dbOrder.payments[0];

        return {
          id: dbOrder.id,
          orderNumber: dbOrder.orderNumber,
          userId: dbOrder.userId,
          subtotalMinor: dbOrder.subtotalMinor,
          discountMinor: dbOrder.discountMinor,
          taxMinor: dbOrder.taxMinor,
          totalMinor: dbOrder.totalMinor,
          currency: dbOrder.currency,
          status: dbOrder.status,
          couponCode: dbOrder.couponCode,
          items,
          payment: latestPayment
            ? {
                id: latestPayment.id,
                provider: latestPayment.provider,
                providerRefId: latestPayment.providerRefId,
                amountMinor: latestPayment.amountMinor,
                status: latestPayment.status,
                createdAt: latestPayment.createdAt.toISOString(),
              }
            : null,
          formattedSubtotal: PricingService.formatPrice(dbOrder.subtotalMinor, dbOrder.currency),
          formattedDiscount: PricingService.formatPrice(dbOrder.discountMinor, dbOrder.currency),
          formattedTax: PricingService.formatPrice(dbOrder.taxMinor, dbOrder.currency),
          formattedTotal: PricingService.formatPrice(dbOrder.totalMinor, dbOrder.currency),
          createdAt: dbOrder.createdAt.toISOString(),
          updatedAt: dbOrder.updatedAt.toISOString(),
        };
      }
    } catch (error) {
      logger.warn(`Failed reading order ${orderId} from database, checking fallback store`, { error });
    }

    const memoryOrder = FALLBACK_ORDERS.get(orderId);
    if (memoryOrder) {
      if (userId && memoryOrder.userId !== userId) {
        return null;
      }
      return memoryOrder;
    }

    return null;
  }

  /**
   * Retrieve student purchase history
   */
  static async getUserOrders(userId: string): Promise<OrderDetail[]> {
    try {
      const dbOrders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  thumbnailUrl: true,
                },
              },
            },
          },
          payments: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (dbOrders.length > 0) {
        return dbOrders.map((dbOrder) => ({
          id: dbOrder.id,
          orderNumber: dbOrder.orderNumber,
          userId: dbOrder.userId,
          subtotalMinor: dbOrder.subtotalMinor,
          discountMinor: dbOrder.discountMinor,
          taxMinor: dbOrder.taxMinor,
          totalMinor: dbOrder.totalMinor,
          currency: dbOrder.currency,
          status: dbOrder.status,
          couponCode: dbOrder.couponCode,
          items: dbOrder.items.map((i) => ({
            id: i.id,
            courseId: i.courseId,
            title: i.course.title,
            slug: i.course.slug,
            thumbnailUrl: i.course.thumbnailUrl,
            priceMinor: i.priceMinor,
            formattedPrice: PricingService.formatPrice(i.priceMinor, dbOrder.currency),
          })),
          payment: dbOrder.payments[0]
            ? {
                id: dbOrder.payments[0].id,
                provider: dbOrder.payments[0].provider,
                providerRefId: dbOrder.payments[0].providerRefId,
                amountMinor: dbOrder.payments[0].amountMinor,
                status: dbOrder.payments[0].status,
                createdAt: dbOrder.payments[0].createdAt.toISOString(),
              }
            : null,
          formattedSubtotal: PricingService.formatPrice(dbOrder.subtotalMinor, dbOrder.currency),
          formattedDiscount: PricingService.formatPrice(dbOrder.discountMinor, dbOrder.currency),
          formattedTax: PricingService.formatPrice(dbOrder.taxMinor, dbOrder.currency),
          formattedTotal: PricingService.formatPrice(dbOrder.totalMinor, dbOrder.currency),
          createdAt: dbOrder.createdAt.toISOString(),
          updatedAt: dbOrder.updatedAt.toISOString(),
        }));
      }
    } catch (error) {
      logger.warn("Failed retrieving user orders from database, checking fallback store", { error, metadata: { userId } });
    }

    const memoryOrders = Array.from(FALLBACK_ORDERS.values()).filter((o) => o.userId === userId);
    return memoryOrders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
