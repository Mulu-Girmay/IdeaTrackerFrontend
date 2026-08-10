import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthPageState } from "./types";
import type { 
  LoginCredentials, 
  RegisterData, 
  User, 
  UpdateProfileData, 
  ChangePasswordData 
} from "../../../types/auth.types";

export const authSliceName = "auth";

const initialState: AuthPageState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: authSliceName,
  initialState,
  reducers: {
    loginRequest: (state, _action: PayloadAction<LoginCredentials>) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    registerRequest: (state, _action: PayloadAction<RegisterData>) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logoutRequest: (state) => {
      state.isLoading = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateProfileRequest: (state, _action: PayloadAction<UpdateProfileData>) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    updateProfileSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
      state.success = "Profile updated successfully";
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },
    changePasswordRequest: (state, _action: PayloadAction<ChangePasswordData>) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    changePasswordSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = "Password changed successfully";
    },
    changePasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },
    clearAuthMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  clearAuthMessages,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
export default authReducer;
