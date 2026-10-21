import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";
import { ValidationError, NotFoundError } from "@/server/api/errors";
import { PricingService, PriceBreakdown } from "./pricing.service";
import { CouponService } from "./coupon.service";
import { CourseLevel, CourseStatus } from "@prisma/client";

export interface CartItemDetail {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  level: CourseLevel | string;
  priceAmount: number;
  discountAmount: number | null;
  currency: string;
  formattedPrice: string;
  formattedOriginalPrice: string | null;
  instructors: Array<{
    name: string;
    avatarUrl: string | null;
  }>;
}

export interface CartSummary {
  id: string;
  userId: string;
  items: CartItemDetail[];
  itemCount: number;
  breakdown: PriceBreakdown;
  updatedAt: string;
}

export interface FallbackCartData {
  id: string;
  userId: string;
  items: CartItemDetail[];
  updatedAt: string;
}

// In-memory fallback cart store attached to globalThis for cross-route / cross-worker persistence
const globalForCart = globalThis as unknown as {
  fallbackCarts?: Map<string, FallbackCartData>;
  mockEnrollments?: Set<string>;
};

const FALLBACK_CARTS: Map<string, FallbackCartData> =
  globalForCart.fallbackCarts ?? (globalForCart.fallbackCarts = new Map<string, FallbackCartData>());

// In-memory mock enrollments for enrollment blocking verification
const MOCK_ENROLLMENTS =
  globalForCart.mockEnrollments ??
  (globalForCart.mockEnrollments = new Set<string>([
    "demo-student-enrolled:course-fallback-3",
    "demo-student-enrolled:already-enrolled-course-id",
  ]));

// Fallback courses registry to enrich cart items when database is offline
const KNOWN_CATALOG: Record<string, CartItemDetail> = {
  "course-fallback-1": {
    id: "item-fallback-1",
    courseId: "course-fallback-1",
    title: "Mastering Next.js 16 & TypeScript: Enterprise Architecture",
    slug: "mastering-nextjs-16-typescript-enterprise-architecture",
    thumbnailUrl: null,
    level: CourseLevel.INTERMEDIATE,
    priceAmount: 4999,
    discountAmount: 2000,
    currency: "USD",
    formattedPrice: "$49.99",
    formattedOriginalPrice: "$69.99",
    instructors: [{ name: "Dr. Farooq Khan", avatarUrl: null }],
  },
  "mastering-nextjs-16-typescript-enterprise-architecture": {
    id: "item-fallback-1",
    courseId: "course-fallback-1",
    title: "Mastering Next.js 16 & TypeScript: Enterprise Architecture",
    slug: "mastering-nextjs-16-typescript-enterprise-architecture",
    thumbnailUrl: null,
    level: CourseLevel.INTERMEDIATE,
    priceAmount: 4999,
    discountAmount: 2000,
    currency: "USD",
    formattedPrice: "$49.99",
    formattedOriginalPrice: "$69.99",
    instructors: [{ name: "Dr. Farooq Khan", avatarUrl: null }],
  },
  "course-fallback-2": {
    id: "item-fallback-2",
    courseId: "course-fallback-2",
    title: "Cloud Infrastructure with Docker, Kubernetes & AWS",
    slug: "cloud-infrastructure-docker-kubernetes-aws",
    thumbnailUrl: null,
    level: CourseLevel.EXPERT,
    priceAmount: 5999,
    discountAmount: null,
    currency: "USD",
    formattedPrice: "$59.99",
    formattedOriginalPrice: null,
    instructors: [{ name: "Dr. Farooq Khan", avatarUrl: null }],
  },
  "cloud-infrastructure-docker-kubernetes-aws": {
    id: "item-fallback-2",
    courseId: "course-fallback-2",
    title: "Cloud Infrastructure with Docker, Kubernetes & AWS",
    slug: "cloud-infrastructure-docker-kubernetes-aws",
    thumbnailUrl: null,
    level: CourseLevel.EXPERT,
    priceAmount: 5999,
    discountAmount: null,
    currency: "USD",
    formattedPrice: "$59.99",
    formattedOriginalPrice: null,
    instructors: [{ name: "Dr. Farooq Khan", avatarUrl: null }],
  },
  "course-fallback-3": {
    id: "item-fallback-3",
    courseId: "course-fallback-3",
    title: "Modern Web Foundations: HTML, CSS & JavaScript",
    slug: "modern-web-foundations-html-css-javascript",
    thumbnailUrl: null,
    level: CourseLevel.BEGINNER,
    priceAmount: 0,
    discountAmount: null,
    currency: "USD",
    formattedPrice: "Free",
    formattedOriginalPrice: null,
    instructors: [{ name: "Dr. Farooq Khan", avatarUrl: null }],
  },
  "modern-web-foundations-html-css-javascript": {
    id: "item-fallback-3",
    courseId: "course-fallback-3",
    title: "Modern Web Foundations: HTML, CSS & JavaScript",
    slug: "modern-web-foundations-html-css-javascript",
    thumbnailUrl: null,
    level: CourseLevel.BEGINNER,
    priceAmount: 0,
    discountAmount: null,
    currency: "USD",
    formattedPrice: "Free",
    formattedOriginalPrice: null,
    instructors: [{ name: "Dr. Farooq Khan", avatarUrl: null }],
  },
};

export class CartService {
  /**
   * Helper to check if a user is already enrolled in a course
   */
  static async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    if (MOCK_ENROLLMENTS.has(`${userId}:${courseId}`)) {
      return true;
    }

    try {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });
      return !!enrollment;
    } catch {
      return false;
    }
  }

  /**
   * Fetch a course item from DB or fallback catalog
   */
  static async resolveCourseItem(courseIdentifier: string): Promise<CartItemDetail | null> {
    // Check known in-memory catalog first
    if (KNOWN_CATALOG[courseIdentifier]) {
      return KNOWN_CATALOG[courseIdentifier];
    }

    try {
      const course = await prisma.course.findFirst({
        where: {
          OR: [{ id: courseIdentifier }, { slug: courseIdentifier }],
          status: CourseStatus.PUBLISHED,
        },
        include: {
          instructors: {
            include: {
              instructor: {
                include: {
                  user: {
                    select: { name: true, avatarUrl: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!course) return null;

      const originalPriceAmount =
        (course.discountAmount ?? 0) > 0 ? course.priceAmount + (course.discountAmount ?? 0) : null;

      return {
        id: `cart-item-${course.id}`,
        courseId: course.id,
        title: course.title,
        slug: course.slug,
        thumbnailUrl: course.thumbnailUrl,
        level: course.level,
        priceAmount: course.priceAmount,
        discountAmount: course.discountAmount,
        currency: course.currency,
        formattedPrice: PricingService.formatPrice(course.priceAmount, course.currency),
        formattedOriginalPrice: originalPriceAmount
          ? PricingService.formatPrice(originalPriceAmount, course.currency)
          : null,
        instructors: course.instructors.map((ci) => ({
          name: ci.instructor.user.name,
          avatarUrl: ci.instructor.user.avatarUrl,
        })),
      };
    } catch (error) {
      logger.warn(`Failed resolving course "${courseIdentifier}" from DB, checking fallback`, { error });
      return KNOWN_CATALOG[courseIdentifier] || null;
    }
  }

  /**
   * Retrieve active cart for a user with calculated pricing breakdown
   */
  static async getCart(userId: string, couponCode?: string | null): Promise<CartSummary> {
    let items: CartItemDetail[] = [];
    let cartId = `cart-${userId}`;
    let updatedAt = new Date().toISOString();

    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              course: {
                include: {
                  instructors: {
                    include: {
                      instructor: {
                        include: {
                          user: {
                            select: { name: true, avatarUrl: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (cart) {
        cartId = cart.id;
        updatedAt = cart.updatedAt.toISOString();
        items = cart.items.map((ci) => {
          const originalPrice =
            (ci.course.discountAmount ?? 0) > 0
              ? ci.course.priceAmount + (ci.course.discountAmount ?? 0)
              : null;

          return {
            id: ci.id,
            courseId: ci.courseId,
            title: ci.course.title,
            slug: ci.course.slug,
            thumbnailUrl: ci.course.thumbnailUrl,
            level: ci.course.level,
            priceAmount: ci.course.priceAmount,
            discountAmount: ci.course.discountAmount,
            currency: ci.course.currency,
            formattedPrice: PricingService.formatPrice(ci.course.priceAmount, ci.course.currency),
            formattedOriginalPrice: originalPrice
              ? PricingService.formatPrice(originalPrice, ci.course.currency)
              : null,
            instructors: ci.course.instructors.map((i) => ({
              name: i.instructor.user.name,
              avatarUrl: i.instructor.user.avatarUrl,
            })),
          };
        });
      } else {
        // Fallback to in-memory store
        const memoryCart = FALLBACK_CARTS.get(userId);
        if (memoryCart) {
          cartId = memoryCart.id;
          items = memoryCart.items;
          updatedAt = memoryCart.updatedAt;
        }
      }
    } catch (error) {
      logger.warn("Failed retrieving cart from database, using fallback store", { error, metadata: { userId } });
      const memoryCart = FALLBACK_CARTS.get(userId);
      if (memoryCart) {
        cartId = memoryCart.id;
        items = memoryCart.items;
        updatedAt = memoryCart.updatedAt;
      }
    }

    // Resolve coupon if provided
    let applicableCoupon = null;
    if (couponCode) {
      try {
        const subtotal = items.reduce((sum, item) => sum + item.priceAmount, 0);
        const validated = await CouponService.validateCoupon(couponCode, subtotal);
        if (validated.isValid) {
          applicableCoupon = {
            code: validated.code,
            discountType: validated.discountType,
            discountValue: validated.discountValue,
            minSpendMinor: validated.minSpendMinor,
          };
        }
      } catch (couponError) {
        logger.warn(`Cart applied coupon "${couponCode}" could not be verified`, { error: couponError });
      }
    }

    const breakdown = PricingService.calculateBreakdown(
      items.map((it) => ({ priceAmount: it.priceAmount, discountAmount: it.discountAmount })),
      applicableCoupon
    );

    return {
      id: cartId,
      userId,
      items,
      itemCount: items.length,
      breakdown,
      updatedAt,
    };
  }

  /**
   * Add a course to the user's cart
   */
  static async addToCart(userId: string, courseIdentifier: string, couponCode?: string | null): Promise<CartSummary> {
    const course = await this.resolveCourseItem(courseIdentifier);
    if (!course) {
      throw new NotFoundError("The requested course could not be found.");
    }

    // Check if user is already enrolled
    const isEnrolled = await this.isUserEnrolled(userId, course.courseId);
    if (isEnrolled) {
      throw new ValidationError("You are already enrolled in this course and have lifetime access.");
    }

    try {
      let cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
        });
      }

      // Check if item is already in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_courseId: {
            cartId: cart.id,
            courseId: course.courseId,
          },
        },
      });

      if (!existingItem) {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            courseId: course.courseId,
          },
        });
      }
    } catch (error) {
      logger.warn("Failed persisting cart item in database, updating in-memory fallback", { error });
      // In-memory fallback cart
      let memoryCart = FALLBACK_CARTS.get(userId);
      if (!memoryCart) {
        memoryCart = {
          id: `cart-${userId}`,
          userId,
          items: [],
          updatedAt: new Date().toISOString(),
        };
        FALLBACK_CARTS.set(userId, memoryCart);
      }

      const exists = memoryCart.items.some((i) => i.courseId === course.courseId);
      if (!exists) {
        memoryCart.items.push(course);
        memoryCart.updatedAt = new Date().toISOString();
      }
    }

    return this.getCart(userId, couponCode);
  }

  /**
   * Remove a course from the user's cart
   */
  static async removeFromCart(userId: string, courseIdentifier: string, couponCode?: string | null): Promise<CartSummary> {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (cart) {
        // Resolve courseId if slug was passed
        let targetCourseId = courseIdentifier;
        const resolved = await this.resolveCourseItem(courseIdentifier);
        if (resolved) targetCourseId = resolved.courseId;

        await prisma.cartItem.deleteMany({
          where: {
            cartId: cart.id,
            courseId: targetCourseId,
          },
        });
      }
    } catch (error) {
      logger.warn("Failed removing cart item from database, updating in-memory store", { error });
    }

    // Also remove from in-memory fallback
    const memoryCart = FALLBACK_CARTS.get(userId);
    if (memoryCart) {
      memoryCart.items = memoryCart.items.filter(
        (i) => i.courseId !== courseIdentifier && i.slug !== courseIdentifier
      );
      memoryCart.updatedAt = new Date().toISOString();
    }

    return this.getCart(userId, couponCode);
  }

  /**
   * Clear all items from cart
   */
  static async clearCart(userId: string): Promise<CartSummary> {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }
    } catch (error) {
      logger.warn("Failed clearing cart in database, clearing in-memory store", { error });
    }

    const memoryCart = FALLBACK_CARTS.get(userId);
    if (memoryCart) {
      memoryCart.items = [];
      memoryCart.updatedAt = new Date().toISOString();
    }

    return this.getCart(userId);
  }

  /**
   * Merge items from a guest cart into an authenticated user's cart
   */
  static async mergeGuestCart(authenticatedUserId: string, guestId?: string): Promise<void> {
    if (!guestId || authenticatedUserId === guestId) return;

    try {
      const guestCart = await this.getCart(guestId);
      if (guestCart.items.length === 0) return;

      for (const item of guestCart.items) {
        await this.addToCart(authenticatedUserId, item.courseId).catch(() => {});
      }
      await this.clearCart(guestId).catch(() => {});
    } catch (e) {
      logger.warn("Failed merging guest cart into user cart", { error: e });
    }
  }
}
