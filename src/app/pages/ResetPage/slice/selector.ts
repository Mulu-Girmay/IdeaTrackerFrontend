// src/pages/ResetPasswordPage/slice/selector.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../../store/types/RootState";
import { resetPasswordSliceName } from "./slice";

const selectResetPasswordDomain = (state: RootState) =>
  state[resetPasswordSliceName] || {
    isLoading: false,
    error: null,
    success: null,
  };

export const selectResetPasswordLoading = createSelector(
  [selectResetPasswordDomain],
  (state) => state.isLoading,
);

export const selectResetPasswordError = createSelector(
  [selectResetPasswordDomain],
  (state) => state.error,
);

export const selectResetPasswordSuccess = createSelector(
  [selectResetPasswordDomain],
  (state) => state.success,
);
