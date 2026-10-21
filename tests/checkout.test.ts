import { test, describe } from "node:test";
import assert from "node:assert";
import { OrderService } from "../src/server/services/order.service";
import { PaymentService } from "../src/server/services/payment.service";
import { EnrollmentService } from "../src/server/services/enrollment.service";
import { CartService } from "../src/server/services/cart.service";
import { ValidationError, NotFoundError } from "../src/server/api/errors";
import { OrderStatus } from "@prisma/client";

describe("Milestone 8: Order Service & Price Locking", () => {
  const testUserId = "checkout-test-user-1";

  test("should generate valid order numbers matching platform convention", () => {
    const num1 = OrderService.generateOrderNumber();
    const num2 = OrderService.generateOrderNumber();

    assert.ok(num1.startsWith("VTI-ORD-"));
    assert.ok(num2.startsWith("VTI-ORD-"));
    assert.notStrictEqual(num1, num2);
    assert.match(num1, /^VTI-ORD-[A-Z0-9]+-\d{4}$/);
  });

  test("should block order creation if user cart is empty", async () => {
    const emptyUserId = "empty-cart-user-xyz";
    await CartService.clearCart(emptyUserId);

    await assert.rejects(
      async () => {
        await OrderService.createOrderFromCart(emptyUserId);
      },
      (err: unknown) => {
        assert.ok(err instanceof ValidationError);
        assert.match((err as Error).message, /empty shopping cart/i);
        return true;
      }
    );
  });

  test("should initialize pending order from cart with locked minor unit pricing", async () => {
    // 1. Add course to cart
    await CartService.addToCart(testUserId, "course-fallback-1", "WELCOME20");

    // 2. Initialize order
    const result = await OrderService.createOrderFromCart(testUserId, {
      paymentProvider: "MOCK",
      couponCode: "WELCOME20",
      billingName: "Jane Tester",
      billingEmail: "jane@example.com",
    });

    assert.ok(result.order);
    assert.strictEqual(result.order.status, OrderStatus.PENDING);
    assert.strictEqual(result.order.userId, testUserId);
    assert.ok(result.order.items.length >= 1);
    assert.ok(result.order.totalMinor > 0);
    assert.ok(result.providerRefId.startsWith("mock_pi_"));
    assert.ok(result.clientSecret.startsWith("mock_sec_"));
  });

  test("should fulfill order atomically, provision enrollment, and clear cart", async () => {
    // 1. Setup cart and create order
    const userId = "checkout-fulfill-user-2";
    await CartService.addToCart(userId, "course-fallback-2");
    const { order, providerRefId } = await OrderService.createOrderFromCart(userId);

    // Verify not enrolled yet
    const initiallyEnrolled = await EnrollmentService.isEnrolled(userId, "course-fallback-2");
    assert.strictEqual(initiallyEnrolled, false);

    // 2. Fulfill order
    const fulfilled = await OrderService.fulfillOrder(order.id, providerRefId, "MOCK");

    assert.strictEqual(fulfilled.status, OrderStatus.COMPLETED);
    assert.ok(fulfilled.payment);
    assert.strictEqual(fulfilled.payment.status, "SUCCEEDED");

    // 3. Verify enrollment was provisioned
    const nowEnrolled = await EnrollmentService.isEnrolled(userId, "course-fallback-2");
    assert.strictEqual(nowEnrolled, true, "User must be enrolled after order fulfillment");

    // 4. Verify cart was cleared
    const cart = await CartService.getCart(userId);
    assert.strictEqual(cart.itemCount, 0, "Cart must be emptied after order fulfillment");
  });

  test("should enforce idempotency on order fulfillment", async () => {
    const userId = "idempotent-user-3";
    await CartService.addToCart(userId, "course-fallback-1");
    const { order, providerRefId } = await OrderService.createOrderFromCart(userId);

    // First fulfillment
    const fulfilledFirst = await OrderService.fulfillOrder(order.id, providerRefId, "MOCK");
    assert.strictEqual(fulfilledFirst.status, OrderStatus.COMPLETED);

    // Second fulfillment attempt on same order
    const fulfilledSecond = await OrderService.fulfillOrder(order.id, providerRefId, "MOCK");
    assert.strictEqual(fulfilledSecond.status, OrderStatus.COMPLETED);
    assert.strictEqual(fulfilledSecond.id, fulfilledFirst.id);
  });
});

describe("Milestone 8: Payment Simulator & Verification", () => {
  test("should create payment intent for 0 amount orders as instantly succeeded", async () => {
    const intent = await PaymentService.createPaymentIntent("free-order-id", 0, "USD", "MOCK");
    assert.strictEqual(intent.status, "SUCCEEDED");
    assert.strictEqual(intent.amountMinor, 0);
  });

  test("should successfully process payment with valid card", async () => {
    const result = await PaymentService.processPayment(
      "test-order-1",
      "mock-pi-1",
      4999,
      "USD",
      "MOCK",
      { cardNumber: "4242 4242 4242 4242", expMonth: "12", expYear: "28", cvc: "123" }
    );

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.status, "SUCCEEDED");
    assert.strictEqual(result.amountMinor, 4999);
  });

  test("should fail payment simulation with declined card number", async () => {
    const result = await PaymentService.processPayment(
      "test-order-2",
      "mock-pi-2",
      4999,
      "USD",
      "MOCK",
      { cardNumber: "4000 0000 0000 0002", expMonth: "12", expYear: "28", cvc: "123" }
    );

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.status, "FAILED");
    assert.match(result.failureReason || "", /declined/i);
  });

  test("should fail payment simulation with insufficient funds card", async () => {
    const result = await PaymentService.processPayment(
      "test-order-3",
      "mock-pi-3",
      4999,
      "USD",
      "MOCK",
      { cardNumber: "4000 0000 0000 0003", expMonth: "12", expYear: "28", cvc: "123" }
    );

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.status, "FAILED");
    assert.match(result.failureReason || "", /insufficient funds/i);
  });
});

describe("Milestone 8: Enrollment Service & Student Portal History", () => {
  const studentId = "student-learning-portal-user-1";

  test("should provision and retrieve user enrollments", async () => {
    const enrolled = await EnrollmentService.provisionEnrollments(studentId, [
      "course-fallback-1",
      "course-fallback-2",
    ]);

    assert.strictEqual(enrolled.length, 2);
    assert.ok(await EnrollmentService.isEnrolled(studentId, "course-fallback-1"));
    assert.ok(await EnrollmentService.isEnrolled(studentId, "course-fallback-2"));

    const list = await EnrollmentService.getUserEnrollments(studentId);
    assert.ok(list.length >= 2);
  });

  test("should retrieve user purchase history orders", async () => {
    const historyUserId = "history-user-4";
    await CartService.addToCart(historyUserId, "course-fallback-1");
    const { order, providerRefId } = await OrderService.createOrderFromCart(historyUserId);
    await OrderService.fulfillOrder(order.id, providerRefId, "MOCK");

    const orders = await OrderService.getUserOrders(historyUserId);
    assert.ok(orders.length >= 1);
    assert.strictEqual(orders[0].userId, historyUserId);
    assert.strictEqual(orders[0].status, OrderStatus.COMPLETED);
  });
});
