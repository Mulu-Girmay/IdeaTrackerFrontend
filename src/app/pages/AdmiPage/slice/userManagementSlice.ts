import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../../types/auth.types";
import type { UpdateUserData } from "../../../types/user.types";

export const userManagementSliceName = "userManagement";

export interface UserManagementState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  success: string | null;
  totalUsers: number;
  currentPage: number;
  totalPages: number;
}

const initialState: UserManagementState = {
  users: [],
  isLoading: false,
  error: null,
  success: null,
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
};

const userManagementSlice = createSlice({
  name: userManagementSliceName,
  initialState,
  reducers: {
    // Fetch All Users
    fetchUsersRequest: (
      state,
      _action: PayloadAction<{
        page?: number;
        limit?: number;
        search?: string;
      }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess: (
      state,
      action: PayloadAction<{
        users: User[];
        total: number;
        page: number;
        totalPages: number;
      }>,
    ) => {
      state.isLoading = false;
      state.users = action.payload.users;
      state.totalUsers = action.payload.total;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.error = null;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create User
    createUserRequest: (
      state,
      _action: PayloadAction<{
        name: string;
        email: string;
        password: string;
        role: "user" | "admin";
      }>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    createUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.users = [action.payload, ...state.users];
      state.success = "User created successfully";
    },
    createUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateUserRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateUserData }>,
    ) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      const index = state.users.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      state.success = "User updated successfully";
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteUserRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    deleteUserSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.users = state.users.filter((u) => u._id !== action.payload);
      state.success = "User deleted successfully";
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    toggleUserStatusRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    toggleUserStatusSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      const index = state.users.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      state.success = `User ${action.payload.isActive ? "activated" : "deactivated"} successfully`;
    },
    toggleUserStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearUserManagementMessages: (state) => {
      state.error = null;
      state.success = null;
    },

    resetUserManagementState: () => initialState,
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
  toggleUserStatusRequest,
  toggleUserStatusSuccess,
  toggleUserStatusFailure,
  clearUserManagementMessages,
  resetUserManagementState,
} = userManagementSlice.actions;

export const userManagementReducer = userManagementSlice.reducer;
export default userManagementReducer;
