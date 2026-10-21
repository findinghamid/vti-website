import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemDetail, CartSummary } from "@/server/services/cart.service";
import { PriceBreakdown } from "@/server/services/pricing.service";

interface CartState {
  items: CartItemDetail[];
  itemCount: number;
  breakdown: PriceBreakdown | null;
  appliedCouponCode: string | null;
  isDrawerOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialBreakdown: PriceBreakdown = {
  subtotalMinor: 0,
  promotionalDiscountMinor: 0,
  discountedSubtotalMinor: 0,
  couponDiscountMinor: 0,
  taxMinor: 0,
  totalMinor: 0,
  currency: "USD",
  formattedSubtotal: "$0.00",
  formattedPromotionalDiscount: "$0.00",
  formattedDiscountedSubtotal: "$0.00",
  formattedCouponDiscount: "$0.00",
  formattedTax: "$0.00",
  formattedTotal: "Free",
  appliedCoupon: null,
};

const initialState: CartState = {
  items: [],
  itemCount: 0,
  breakdown: initialBreakdown,
  appliedCouponCode: null,
  isDrawerOpen: false,
  isLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartData: (state, action: PayloadAction<CartSummary>) => {
      state.items = action.payload.items;
      state.itemCount = action.payload.itemCount;
      state.breakdown = action.payload.breakdown;
      state.appliedCouponCode = action.payload.breakdown.appliedCoupon?.code || null;
      state.error = null;
    },
    setAppliedCouponCode: (state, action: PayloadAction<string | null>) => {
      state.appliedCouponCode = action.payload;
    },
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCartData,
  setAppliedCouponCode,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  setCartLoading,
  setCartError,
} = cartSlice.actions;

export default cartSlice.reducer;
