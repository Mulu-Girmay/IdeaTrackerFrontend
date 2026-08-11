import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const adminDashboardSliceName = "adminDashboard";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalIdeas: number;
  publishedIdeas: number;
  draftIdeas: number;
  archivedIdeas: number;
  adminCount: number;
  userCount: number;
  recentActivity: Array<{
    id: string;
    type: "user" | "idea";
    action: "created" | "updated" | "deleted" | "activated" | "deactivated";
    user: {
      id: string;
      name: string;
      email: string;
    };
    timestamp: string;
    details?: string;
  }>;
  userGrowthData: Array<{
    date: string;
    count: number;
  }>;
  ideaGrowthData: Array<{
    date: string;
    count: number;
  }>;
}

export interface AdminDashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  lastUpdated: string | null;
}

const initialState: AdminDashboardState = {
  stats: null,
  isLoading: false,
  error: null,
  success: null,
  lastUpdated: null,
};

const adminDashboardSlice = createSlice({
  name: adminDashboardSliceName,
  initialState,
  reducers: {
    getDashboardStatsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    getDashboardStatsSuccess: (
      state,
      action: PayloadAction<DashboardStats>,
    ) => {
      state.isLoading = false;
      state.stats = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    getDashboardStatsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    refreshDashboardRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    refreshDashboardSuccess: (state, action: PayloadAction<DashboardStats>) => {
      state.isLoading = false;
      state.stats = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
      state.success = "Dashboard refreshed successfully";
    },
    refreshDashboardFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    resetAdminDashboardState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = null;
    },

    clearDashboardError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getDashboardStatsRequest,
  getDashboardStatsSuccess,
  getDashboardStatsFailure,
  refreshDashboardRequest,
  refreshDashboardSuccess,
  refreshDashboardFailure,
  resetAdminDashboardState,
  clearDashboardError,
} = adminDashboardSlice.actions;

export const adminDashboardReducer = adminDashboardSlice.reducer;
export default adminDashboardReducer;
