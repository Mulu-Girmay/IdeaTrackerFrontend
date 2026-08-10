import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../../store/types/RootState";
import { authSliceName } from "./slice";

export const selectAuthDomain = (state: RootState) =>
  state[authSliceName] || {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

export const selectUser = createSelector(
  [selectAuthDomain],
  (auth) => auth.user,
);

export const selectIsAuthenticated = createSelector(
  [selectAuthDomain],
  (auth) => auth.isAuthenticated,
);

export const selectIsLoading = createSelector(
  [selectAuthDomain],
  (auth) => auth.isLoading,
);

export const selectAuthLoading = selectIsLoading; // Alias for backwards compatibility

export const selectError = createSelector(
  [selectAuthDomain],
  (auth) => auth.error,
);

export const selectAuthError = selectError; // Alias for backwards compatibility

export const selectSuccess = createSelector(
  [selectAuthDomain],
  (auth) => auth.success,
);
