import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const ideaManagementSliceName = "ideaManagement";

export interface Idea {
  _id: string;
  title: string;
  description: string;
  status: "draft" | "published" | "archived";
  owner: string | {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IdeaManagementState {
  ideas: Idea[];
  isLoading: boolean;
  error: string | null;
  success: string | null;
  totalIdeas: number;
  currentPage: number;
  totalPages: number;
}

const initialState: IdeaManagementState = {
  ideas: [],
  isLoading: false,
  error: null,
  success: null,
  totalIdeas: 0,
  currentPage: 1,
  totalPages: 1,
};

const ideaManagementSlice = createSlice({
  name: ideaManagementSliceName,
  initialState,
  reducers: {
    // Fetch All Ideas
    fetchIdeasRequest: (
      state,
      _action: PayloadAction<{
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
      }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchIdeasSuccess: (
      state,
      action: PayloadAction<{
        ideas: Idea[];
        total: number;
        page: number;
        totalPages: number;
      }>,
    ) => {
      state.isLoading = false;
      state.ideas = action.payload.ideas;
      state.totalIdeas = action.payload.total;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.error = null;
    },
    fetchIdeasFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update Idea Status
    updateIdeaStatusRequest: (
      state,
      _action: PayloadAction<{ id: string; status: "draft" | "published" | "archived" }>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    updateIdeaStatusSuccess: (state, action: PayloadAction<Idea>) => {
      state.isLoading = false;
      const index = state.ideas.findIndex((i) => i._id === action.payload._id);
      if (index !== -1) {
        state.ideas[index] = action.payload;
      }
      state.success = `Idea status updated to ${action.payload.status}`;
    },
    updateIdeaStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete Idea
    deleteIdeaRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    deleteIdeaSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.ideas = state.ideas.filter((i) => i._id !== action.payload);
      state.success = "Idea deleted successfully";
    },
    deleteIdeaFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear Messages
    clearIdeaManagementMessages: (state) => {
      state.error = null;
      state.success = null;
    },

    // Reset State
    resetIdeaManagementState: () => initialState,
  },
});

export const {
  fetchIdeasRequest,
  fetchIdeasSuccess,
  fetchIdeasFailure,
  updateIdeaStatusRequest,
  updateIdeaStatusSuccess,
  updateIdeaStatusFailure,
  deleteIdeaRequest,
  deleteIdeaSuccess,
  deleteIdeaFailure,
  clearIdeaManagementMessages,
  resetIdeaManagementState,
} = ideaManagementSlice.actions;

export const ideaManagementReducer = ideaManagementSlice.reducer;
export default ideaManagementReducer;
