import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";
import { ValidationError, NotFoundError } from "@/server/api/errors";
import { CartService, CartItemDetail } from "./cart.service";

export interface WishlistItemDetail {
  id: string;
  courseId: string;
  addedAt: string;
  course: CartItemDetail;
}

// In-memory fallback wishlist store for offline dev & test environments
const FALLBACK_WISHLISTS: Map<string, WishlistItemDetail[]> = new Map();

export class WishlistService {
  /**
   * Retrieve all items in the user's wishlist
   */
  static async getWishlist(userId: string): Promise<WishlistItemDetail[]> {
    try {
      const items = await prisma.wishlistItem.findMany({
        where: { userId },
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
        orderBy: { createdAt: "desc" },
      });

      if (items.length > 0) {
        return items.map((wi) => {
          const originalPrice =
            (wi.course.discountAmount ?? 0) > 0
              ? wi.course.priceAmount + (wi.course.discountAmount ?? 0)
              : null;

          return {
            id: wi.id,
            courseId: wi.courseId,
            addedAt: wi.createdAt.toISOString(),
            course: {
              id: wi.id,
              courseId: wi.courseId,
              title: wi.course.title,
              slug: wi.course.slug,
              thumbnailUrl: wi.course.thumbnailUrl,
              level: wi.course.level,
              priceAmount: wi.course.priceAmount,
              discountAmount: wi.course.discountAmount,
              currency: wi.course.currency,
              formattedPrice: `$${(wi.course.priceAmount / 100).toFixed(2)}`,
              formattedOriginalPrice: originalPrice
                ? `$${(originalPrice / 100).toFixed(2)}`
                : null,
              instructors: wi.course.instructors.map((ci) => ({
                name: ci.instructor.user.name,
                avatarUrl: ci.instructor.user.avatarUrl,
              })),
            },
          };
        });
      }
    } catch (error) {
      logger.warn("Failed retrieving wishlist from database, using fallback store", { error, metadata: { userId } });
    }

    return FALLBACK_WISHLISTS.get(userId) || [];
  }

  /**
   * Check if a specific course is in the user's wishlist
   */
  static async isInWishlist(userId: string, courseIdentifier: string): Promise<boolean> {
    const course = await CartService.resolveCourseItem(courseIdentifier);
    if (!course) return false;

    try {
      const item = await prisma.wishlistItem.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.courseId,
          },
        },
      });
      if (item) return true;
    } catch {
      // Fallback
    }

    const items = FALLBACK_WISHLISTS.get(userId) || [];
    return items.some((i) => i.courseId === course.courseId);
  }

  /**
   * Toggle course presence in user's wishlist
   */
  static async toggleWishlist(
    userId: string,
    courseIdentifier: string
  ): Promise<{ inWishlist: boolean; course: CartItemDetail; message: string }> {
    const course = await CartService.resolveCourseItem(courseIdentifier);
    if (!course) {
      throw new NotFoundError("The requested course could not be found.");
    }

    // Check if user is already enrolled
    const isEnrolled = await CartService.isUserEnrolled(userId, course.courseId);
    if (isEnrolled) {
      throw new ValidationError("You are already enrolled in this course.");
    }

    let currentlyInWishlist = false;

    try {
      const existing = await prisma.wishlistItem.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.courseId,
          },
        },
      });

      if (existing) {
        await prisma.wishlistItem.delete({
          where: { id: existing.id },
        });
        currentlyInWishlist = false;
      } else {
        await prisma.wishlistItem.create({
          data: {
            userId,
            courseId: course.courseId,
          },
        });
        currentlyInWishlist = true;
      }
    } catch (error) {
      logger.warn("Failed toggling wishlist in database, updating in-memory store", { error });
      let items = FALLBACK_WISHLISTS.get(userId) || [];
      const idx = items.findIndex((i) => i.courseId === course.courseId);

      if (idx >= 0) {
        items.splice(idx, 1);
        currentlyInWishlist = false;
      } else {
        items.unshift({
          id: `wishlist-item-${Date.now()}`,
          courseId: course.courseId,
          addedAt: new Date().toISOString(),
          course,
        });
        currentlyInWishlist = true;
      }
      FALLBACK_WISHLISTS.set(userId, items);
    }

    return {
      inWishlist: currentlyInWishlist,
      course,
      message: currentlyInWishlist ? "Course added to wishlist" : "Course removed from wishlist",
    };
  }

  /**
   * Remove course from wishlist
   */
  static async removeFromWishlist(userId: string, courseIdentifier: string): Promise<void> {
    const course = await CartService.resolveCourseItem(courseIdentifier);
    const targetId = course ? course.courseId : courseIdentifier;

    try {
      await prisma.wishlistItem.deleteMany({
        where: {
          userId,
          courseId: targetId,
        },
      });
    } catch (error) {
      logger.warn("Failed removing wishlist item from database, updating in-memory store", { error });
    }

    let items = FALLBACK_WISHLISTS.get(userId) || [];
    items = items.filter((i) => i.courseId !== targetId);
    FALLBACK_WISHLISTS.set(userId, items);
  }

  /**
   * Move course from wishlist directly into cart
   */
  static async moveToCart(userId: string, courseIdentifier: string) {
    const course = await CartService.resolveCourseItem(courseIdentifier);
    if (!course) {
      throw new NotFoundError("The requested course could not be found.");
    }

    // 1. Add to cart
    const updatedCart = await CartService.addToCart(userId, course.courseId);

    // 2. Remove from wishlist
    await this.removeFromWishlist(userId, course.courseId);

    return {
      success: true,
      cart: updatedCart,
      message: `"${course.title}" moved to your cart!`,
    };
  }
}
