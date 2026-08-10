// src/pages/ForgotPasswordPage/slice/selector.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../../store/types/RootState";
import { forgotPasswordSliceName } from "./slice";

const selectForgotPasswordDomain = (state: RootState) =>
  state[forgotPasswordSliceName] || {
    isLoading: false,
    error: null,
    success: null,
  };

export const selectForgotPasswordLoading = createSelector(
  [selectForgotPasswordDomain],
  (state) => state.isLoading,
);

export const selectForgotPasswordError = createSelector(
  [selectForgotPasswordDomain],
  (state) => state.error,
);

export const selectForgotPasswordSuccess = createSelector(
  [selectForgotPasswordDomain],
  (state) => state.success,
);
