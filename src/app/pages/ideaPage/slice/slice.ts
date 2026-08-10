import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Idea,
  CreateIdeaData,
  UpdateIdeaData,
} from "../../../types/idea.types";

export const ideaSliceName = "ideas";

interface IdeaState {
  ideas: Idea[];
  selectedIdea: Idea | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

const initialState: IdeaState = {
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

const ideaSlice = createSlice({
  name: ideaSliceName,
  initialState,
  reducers: {
    createIdeaRequest: (state, _action: PayloadAction<CreateIdeaData>) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    createIdeaSuccess: (state, action: PayloadAction<Idea>) => {
      state.isLoading = false;
      state.ideas = [action.payload, ...state.ideas];
      state.success = "Idea created successfully";
      state.error = null;
    },
    createIdeaFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },

    // Get My Ideas
    getMyIdeasRequest: (
      state,
      _action: PayloadAction<{
        page?: number;
        limit?: number;
        status?: string;
        category?: string;
      }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    getMyIdeasSuccess: (
      state,
      action: PayloadAction<{ ideas: Idea[]; pagination: any }>,
    ) => {
      state.isLoading = false;
      state.ideas = action.payload.ideas;
      state.pagination = action.payload.pagination;
      state.error = null;
    },
    getMyIdeasFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get All Ideas (Admin)
    getAllIdeasRequest: (
      state,
      _action: PayloadAction<{
        page?: number;
        limit?: number;
        status?: string;
        category?: string;
        search?: string;
      }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    getAllIdeasSuccess: (
      state,
      action: PayloadAction<{ ideas: Idea[]; pagination: any }>,
    ) => {
      state.isLoading = false;
      state.ideas = action.payload.ideas;
      state.pagination = action.payload.pagination;
      state.error = null;
    },
    getAllIdeasFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get Idea By ID
    getIdeaByIdRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    getIdeaByIdSuccess: (state, action: PayloadAction<Idea>) => {
      state.isLoading = false;
      state.selectedIdea = action.payload;
      state.error = null;
    },
    getIdeaByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update Idea
    updateIdeaRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateIdeaData }>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    updateIdeaSuccess: (state, action: PayloadAction<Idea>) => {
      state.isLoading = false;
      state.ideas = state.ideas.map((idea) =>
        idea._id === action.payload._id ? action.payload : idea,
      );
      state.selectedIdea = action.payload;
      state.success = "Idea updated successfully";
      state.error = null;
    },
    updateIdeaFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },

    // Delete Idea
    deleteIdeaRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    deleteIdeaSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.ideas = state.ideas.filter((idea) => idea._id !== action.payload);
      state.success = "Idea deleted successfully";
      state.error = null;
    },
    deleteIdeaFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },

    // Reset State
    resetIdeaState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = null;
    },

    clearSelectedIdea: (state) => {
      state.selectedIdea = null;
    },
  },
});

export const {
  createIdeaRequest,
  createIdeaSuccess,
  createIdeaFailure,
  getMyIdeasRequest,
  getMyIdeasSuccess,
  getMyIdeasFailure,
  getAllIdeasRequest,
  getAllIdeasSuccess,
  getAllIdeasFailure,
  getIdeaByIdRequest,
  getIdeaByIdSuccess,
  getIdeaByIdFailure,
  updateIdeaRequest,
  updateIdeaSuccess,
  updateIdeaFailure,
  deleteIdeaRequest,
  deleteIdeaSuccess,
  deleteIdeaFailure,
  resetIdeaState,
  clearSelectedIdea,
} = ideaSlice.actions;

export const ideaReducer = ideaSlice.reducer;
export default ideaReducer;
