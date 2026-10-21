import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BuilderStep = "learners" | "basics" | "curriculum" | "pricing" | "review";
export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

interface CourseBuilderState {
  activeStep: BuilderStep;
  autosaveStatus: AutosaveStatus;
  isDirty: boolean;
  lastSavedAt: string | null;
}

const initialState: CourseBuilderState = {
  activeStep: "learners",
  autosaveStatus: "idle",
  isDirty: false,
  lastSavedAt: null,
};

export const courseBuilderSlice = createSlice({
  name: "courseBuilder",
  initialState,
  reducers: {
    setActiveStep: (state, action: PayloadAction<BuilderStep>) => {
      state.activeStep = action.payload;
    },
    setAutosaveStatus: (state, action: PayloadAction<AutosaveStatus>) => {
      state.autosaveStatus = action.payload;
      if (action.payload === "saved") {
        state.isDirty = false;
        state.lastSavedAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
    },
    markDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
      if (action.payload && state.autosaveStatus === "saved") {
        state.autosaveStatus = "idle";
      }
    },
    resetBuilderState: (state) => {
      state.activeStep = "learners";
      state.autosaveStatus = "idle";
      state.isDirty = false;
      state.lastSavedAt = null;
    },
  },
});

export const {
  setActiveStep,
  setAutosaveStatus,
  markDirty,
  resetBuilderState,
} = courseBuilderSlice.actions;

export default courseBuilderSlice.reducer;
