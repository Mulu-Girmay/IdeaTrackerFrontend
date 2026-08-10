import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const forgotPasswordSliceName = "forgotPassword";

interface ForgotPasswordState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ForgotPasswordState = {
  isLoading: false,
  error: null,
  success: null,
};

const forgotPasswordSlice = createSlice({
  name: forgotPasswordSliceName,
  initialState,
  reducers: {
    forgotPasswordRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    forgotPasswordSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.success = action.payload;
      state.error = null;
    },
    forgotPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },
    resetForgotPasswordState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetForgotPasswordState,
} = forgotPasswordSlice.actions;

export const forgotPasswordReducer = forgotPasswordSlice.reducer;
export default forgotPasswordReducer;
