import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminState, AdminStats } from "./types";

const initialState: AdminState = {
  stats: {
    totalUsers: 0,
    totalIdeas: 0,
    pendingIdeas: 0,
    approvedIdeas: 0,
    rejectedIdeas: 0,
  },
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    fetchAdminStatsRequest(state) {
      state.loading = true;
      state.error = null;
    },

    fetchAdminStatsSuccess(state, action: PayloadAction<AdminStats>) {
      state.loading = false;
      state.stats = action.payload;
    },

    fetchAdminStatsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAdminStatsRequest,
  fetchAdminStatsSuccess,
  fetchAdminStatsFailure,
} = adminSlice.actions;

export default adminSlice.reducer;
