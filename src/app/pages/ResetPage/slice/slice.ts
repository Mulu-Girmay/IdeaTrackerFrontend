// src/pages/ResetPasswordPage/slice/index.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const resetPasswordSliceName = "resetPassword";

interface ResetPasswordState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ResetPasswordState = {
  isLoading: false,
  error: null,
  success: null,
};

const resetPasswordSlice = createSlice({
  name: resetPasswordSliceName,
  initialState,
  reducers: {
    resetPasswordRequest: (state, _action: PayloadAction<{ token: string; newPassword: string }>) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    resetPasswordSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.success = action.payload;
      state.error = null;
    },
    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },
    resetResetPasswordState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  resetResetPasswordState,
} = resetPasswordSlice.actions;

export const resetPasswordReducer = resetPasswordSlice.reducer;
export default resetPasswordReducer;