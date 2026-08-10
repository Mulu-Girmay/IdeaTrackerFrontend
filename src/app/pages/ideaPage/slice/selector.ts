// src/pages/DashboardPage/slice/idea.selector.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../../store/types/RootState";
import { ideaSliceName } from "./slice";

const selectIdeaDomain = (state: RootState) =>
  state[ideaSliceName] || {
    ideas: [],
    selectedIdea: null,
    isLoading: false,
    error: null,
    success: null,
    pagination: {
      page: 1,
      totalPages: 0,
      total: 0,
      limit: 10,
    },
  };

export const selectIdeas = createSelector(
  [selectIdeaDomain],
  (state) => state.ideas,
);

export const selectSelectedIdea = createSelector(
  [selectIdeaDomain],
  (state) => state.selectedIdea,
);

export const selectIdeaLoading = createSelector(
  [selectIdeaDomain],
  (state) => state.isLoading,
);

export const selectIdeaError = createSelector(
  [selectIdeaDomain],
  (state) => state.error,
);

export const selectIdeaSuccess = createSelector(
  [selectIdeaDomain],
  (state) => state.success,
);

export const selectIdeaPagination = createSelector(
  [selectIdeaDomain],
  (state) => state.pagination,
);
