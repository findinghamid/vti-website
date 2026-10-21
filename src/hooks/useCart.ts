"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setCartData,
  setAppliedCouponCode,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  setCartLoading,
  setCartError,
} from "@/store/slices/cartSlice";

function getGuestCartId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("vti_guest_cart_id");
  if (!id) {
    id = `guest_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`;
    try {
      localStorage.setItem("vti_guest_cart_id", id);
    } catch {}
  }
  if (typeof document !== "undefined" && !document.cookie.includes("vti_guest_cart_id")) {
    document.cookie = `vti_guest_cart_id=${id}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }
  return id;
}

let hasInitialFetched = false;

export function useCart() {
  const dispatch = useAppDispatch();
  const { items, itemCount, breakdown, appliedCouponCode, isDrawerOpen, isLoading, error } =
    useAppSelector((state) => state.cart);

  // Hydrate from localStorage on client mount if Redux is empty
  useEffect(() => {
    try {
      const cached = localStorage.getItem("vti_cart_cache");
      if (cached && items.length === 0) {
        const parsed = JSON.parse(cached);
        if (parsed?.items?.length) {
          dispatch(setCartData(parsed));
        }
      }
    } catch {}
  }, [dispatch, items.length]);

  const fetchCart = useCallback(
    async (couponCode?: string | null) => {
      dispatch(setCartLoading(true));
      try {
        const activeCoupon = couponCode !== undefined ? couponCode : appliedCouponCode;
        const url = activeCoupon
          ? `/api/v1/cart?coupon=${encodeURIComponent(activeCoupon)}`
          : "/api/v1/cart";
        const guestId = getGuestCartId();
        const res = await fetch(url, {
          headers: guestId ? { "x-guest-cart-id": guestId } : {},
        });
        const data = await res.json();
        if (data.success && data.data) {
          // If server returns empty while we currently hold items, do not wipe out
          if (data.data.items.length === 0 && items.length > 0) {
            return;
          }
          dispatch(setCartData(data.data));
          try {
            localStorage.setItem("vti_cart_cache", JSON.stringify(data.data));
          } catch {}
        }
      } catch (err: unknown) {
        dispatch(setCartError(err instanceof Error ? err.message : "Failed loading cart"));
      } finally {
        dispatch(setCartLoading(false));
      }
    },
    [dispatch, appliedCouponCode, items.length]
  );

  // Initial cart load only once on app startup
  useEffect(() => {
    if (!hasInitialFetched) {
      hasInitialFetched = true;
      fetchCart();
    }
  }, [fetchCart]);

  const addToCart = useCallback(
    async (courseId: string, openAfterAdd = true) => {
      dispatch(setCartLoading(true));
      try {
        const guestId = getGuestCartId();
        const res = await fetch("/api/v1/cart/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(guestId ? { "x-guest-cart-id": guestId } : {}),
          },
          body: JSON.stringify({ courseId, couponCode: appliedCouponCode }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          const msg = data.error?.message || "Failed to add course to cart";
          dispatch(setCartError(msg));
          return { success: false, message: msg };
        }

        dispatch(setCartData(data.data));
        try {
          localStorage.setItem("vti_cart_cache", JSON.stringify(data.data));
        } catch {}

        if (openAfterAdd) {
          dispatch(openCartDrawer());
        }
        return { success: true, message: "Added to cart" };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Network error";
        dispatch(setCartError(msg));
        return { success: false, message: msg };
      } finally {
        dispatch(setCartLoading(false));
      }
    },
    [dispatch, appliedCouponCode]
  );

  const removeFromCart = useCallback(
    async (courseId: string) => {
      dispatch(setCartLoading(true));
      try {
        const guestId = getGuestCartId();
        const url = appliedCouponCode
          ? `/api/v1/cart/items/${courseId}?coupon=${encodeURIComponent(appliedCouponCode)}`
          : `/api/v1/cart/items/${courseId}`;
        const res = await fetch(url, {
          method: "DELETE",
          headers: guestId ? { "x-guest-cart-id": guestId } : {},
        });
        const data = await res.json();
        if (data.success && data.data) {
          dispatch(setCartData(data.data));
          try {
            localStorage.setItem("vti_cart_cache", JSON.stringify(data.data));
          } catch {}
        }
      } catch (err: unknown) {
        dispatch(setCartError(err instanceof Error ? err.message : "Failed to remove item"));
      } finally {
        dispatch(setCartLoading(false));
      }
    },
    [dispatch, appliedCouponCode]
  );

  const clearCart = useCallback(async () => {
    dispatch(setCartLoading(true));
    try {
      const guestId = getGuestCartId();
      const res = await fetch("/api/v1/cart", {
        method: "DELETE",
        headers: guestId ? { "x-guest-cart-id": guestId } : {},
      });
      const data = await res.json();
      if (data.success && data.data) {
        dispatch(setCartData(data.data));
        try {
          localStorage.removeItem("vti_cart_cache");
        } catch {}
      }
    } catch (err: unknown) {
      dispatch(setCartError(err instanceof Error ? err.message : "Failed to clear cart"));
    } finally {
      dispatch(setCartLoading(false));
    }
  }, [dispatch]);

  const applyCoupon = useCallback(
    async (code: string) => {
      if (!code.trim()) return { success: false, message: "Enter a coupon code" };
      dispatch(setCartLoading(true));
      try {
        const subtotal = breakdown?.discountedSubtotalMinor ?? 0;
        const res = await fetch("/api/v1/coupons/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: code.trim(), subtotalMinor: subtotal }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          const msg = data.error?.message || "Invalid coupon code";
          return { success: false, message: msg };
        }

        dispatch(setAppliedCouponCode(data.data.code));
        await fetchCart(data.data.code);
        return { success: true, message: data.data.message };
      } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : "Error validating coupon" };
      } finally {
        dispatch(setCartLoading(false));
      }
    },
    [dispatch, breakdown?.discountedSubtotalMinor, fetchCart]
  );

  const removeCoupon = useCallback(async () => {
    dispatch(setAppliedCouponCode(null));
    await fetchCart(null);
  }, [dispatch, fetchCart]);

  return {
    items,
    itemCount,
    breakdown,
    appliedCouponCode,
    isDrawerOpen,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    openDrawer: () => dispatch(openCartDrawer()),
    closeDrawer: () => dispatch(closeCartDrawer()),
    toggleDrawer: () => dispatch(toggleCartDrawer()),
    refreshCart: fetchCart,
  };
}
