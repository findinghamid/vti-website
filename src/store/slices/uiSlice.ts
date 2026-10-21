import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isSidebarOpen: boolean;
  isCartDrawerOpen: boolean;
  activePlayerTab: "curriculum" | "notes" | "qa" | "resources";
}

const initialState: UiState = {
  isSidebarOpen: false,
  isCartDrawerOpen: false,
  activePlayerTab: "curriculum",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartDrawerOpen = action.payload;
    },
    setActivePlayerTab: (state, action: PayloadAction<UiState["activePlayerTab"]>) => {
      state.activePlayerTab = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleCartDrawer,
  setCartDrawerOpen,
  setActivePlayerTab,
} = uiSlice.actions;

export default uiSlice.reducer;
