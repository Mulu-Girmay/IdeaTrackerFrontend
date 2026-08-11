import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../../store/types/RootState";
import { ideaManagementSliceName } from "./ideaManagementSlice";

const selectIdeaManagementDomain = (state: RootState) => {
  return (
    (state as any)[ideaManagementSliceName] || {
      ideas: [],
      isLoading: false,
      error: null,
      success: null,
      totalIdeas: 0,
      currentPage: 1,
      totalPages: 1,
    }
  );
};

export const selectAllIdeas = createSelector(
  [selectIdeaManagementDomain],
  (state) => state.ideas,
);

export const selectIdeaManagementLoading = createSelector(
  [selectIdeaManagementDomain],
  (state) => state.isLoading,
);

export const selectIdeaManagementError = createSelector(
  [selectIdeaManagementDomain],
  (state) => state.error,
);

export const selectIdeaManagementSuccess = createSelector(
  [selectIdeaManagementDomain],
  (state) => state.success,
);

export const selectTotalIdeasCount = createSelector(
  [selectIdeaManagementDomain],
  (state) => state.totalIdeas,
);

export const selectIdeaCurrentPage = createSelector(
  [selectIdeaManagementDomain],
  (state) => state.currentPage,
);

export const selectIdeaTotalPages = createSelector(
  [selectIdeaManagementDomain],
  (state) => state.totalPages,
);
