import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../../store/types/RootState";
import { adminDashboardSliceName } from "./slice";

const selectAdminDashboardDomain = (state: RootState) => {
  return (
    (state as any)[adminDashboardSliceName] || {
      stats: null,
      isLoading: false,
      error: null,
      success: null,
      lastUpdated: null,
    }
  );
};

export const selectDashboardStats = createSelector(
  [selectAdminDashboardDomain],
  (state) => state.stats,
);

export const selectDashboardLoading = createSelector(
  [selectAdminDashboardDomain],
  (state) => state.isLoading,
);

export const selectDashboardError = createSelector(
  [selectAdminDashboardDomain],
  (state) => state.error,
);

export const selectDashboardSuccess = createSelector(
  [selectAdminDashboardDomain],
  (state) => state.success,
);

export const selectDashboardLastUpdated = createSelector(
  [selectAdminDashboardDomain],
  (state) => state.lastUpdated,
);

// Derived selectors
export const selectTotalUsers = createSelector(
  [selectDashboardStats],
  (stats) => stats?.totalUsers || 0,
);

export const selectActiveUsers = createSelector(
  [selectDashboardStats],
  (stats) => stats?.activeUsers || 0,
);

export const selectInactiveUsers = createSelector(
  [selectDashboardStats],
  (stats) => stats?.inactiveUsers || 0,
);

export const selectTotalIdeas = createSelector(
  [selectDashboardStats],
  (stats) => stats?.totalIdeas || 0,
);

export const selectPublishedIdeas = createSelector(
  [selectDashboardStats],
  (stats) => stats?.publishedIdeas || 0,
);

export const selectRecentActivity = createSelector(
  [selectDashboardStats],
  (stats) => stats?.recentActivity || [],
);

export const selectUserGrowthData = createSelector(
  [selectDashboardStats],
  (stats) => stats?.userGrowthData || [],
);

export const selectIdeaGrowthData = createSelector(
  [selectDashboardStats],
  (stats) => stats?.ideaGrowthData || [],
);
