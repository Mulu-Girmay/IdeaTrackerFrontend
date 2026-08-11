import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../../store/types/RootState";
import { userManagementSliceName } from "./userManagementSlice";

const selectUserManagementDomain = (state: RootState) => {
  return (
    (state as any)[userManagementSliceName] || {
      users: [],
      isLoading: false,
      error: null,
      success: null,
      totalUsers: 0,
      currentPage: 1,
      totalPages: 1,
    }
  );
};

export const selectAllUsers = createSelector(
  [selectUserManagementDomain],
  (state) => state.users,
);

export const selectUserManagementLoading = createSelector(
  [selectUserManagementDomain],
  (state) => state.isLoading,
);

export const selectUserManagementError = createSelector(
  [selectUserManagementDomain],
  (state) => state.error,
);

export const selectUserManagementSuccess = createSelector(
  [selectUserManagementDomain],
  (state) => state.success,
);

export const selectTotalUsersCount = createSelector(
  [selectUserManagementDomain],
  (state) => state.totalUsers,
);

export const selectCurrentPage = createSelector(
  [selectUserManagementDomain],
  (state) => state.currentPage,
);

export const selectTotalPages = createSelector(
  [selectUserManagementDomain],
  (state) => state.totalPages,
);
