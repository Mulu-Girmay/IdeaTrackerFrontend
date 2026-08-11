import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authService } from "../../../Config/services/auth.service";
import { userService } from "../../../Config/services/user.service";
import { getErrorMessage } from "../../../Config/utils/getErrorMessage";
import type { AuthResponse } from "../../../Config/services/auth.service";
import type { ProfileResponse } from "../../../Config/services/user.service";
import type {
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
} from "../../../types/auth.types";
import {
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
} from "./slice";

function* handleLogin(action: PayloadAction<LoginCredentials>) {
  try {
    const response: AuthResponse = yield call(
      authService.login,
      action.payload,
    );
    console.log("Login Response:", response);

    if (response.success && response.data?.user) {
      yield put(loginSuccess(response.data.user));
    } else {
      yield put(loginFailure(response.message || "Login failed"));
    }
  } catch (error: any) {
    console.error("Login Error:", error);
    yield put(
      loginFailure(
        getErrorMessage(error, "We couldn't log you in. Please try again."),
      ),
    );
  }
}

function* handleRegister(action: PayloadAction<RegisterData>) {
  try {
    const response: AuthResponse = yield call(
      authService.register,
      action.payload,
    );

    if (response.success && response.data?.user) {
      yield put(registerSuccess(response.data.user));
    } else {
      console.log("Register Failed:", response.message);
      yield put(registerFailure(response.message || "Registration failed"));
    }
  } catch (error: any) {
    yield put(
      registerFailure(
        getErrorMessage(
          error,
          "We couldn't create your account. Please try again.",
        ),
      ),
    );
  }
}

function* handleLogout() {
  try {
    yield call(authService.logout);
    yield put(logoutSuccess());
  } catch (error: any) {
    yield put(
      logoutFailure(
        getErrorMessage(error, "We couldn't log you out. Please try again."),
      ),
    );
  }
}

function* handleUpdateProfile(action: PayloadAction<UpdateProfileData>) {
  try {
    const response: ProfileResponse = yield call(
      userService.updateProfile,
      action.payload,
    );
    if (response.success && response.data?.user) {
      yield put(updateProfileSuccess(response.data.user));
    } else {
      yield put(
        updateProfileFailure(response.message || "Profile update failed"),
      );
    }
  } catch (error: any) {
    yield put(
      updateProfileFailure(
        getErrorMessage(
          error,
          "We couldn't update your profile. Please try again.",
        ),
      ),
    );
  }
}

function* handleChangePassword(action: PayloadAction<ChangePasswordData>) {
  try {
    const response: ProfileResponse = yield call(
      userService.changePassword,
      action.payload,
    );
    if (response.success) {
      yield put(changePasswordSuccess());
    } else {
      yield put(
        changePasswordFailure(response.message || "Password change failed"),
      );
    }
  } catch (error: any) {
    yield put(
      changePasswordFailure(
        getErrorMessage(
          error,
          "We couldn't change your password. Please try again.",
        ),
      ),
    );
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
  yield takeLatest(logoutRequest.type, handleLogout);
  yield takeLatest(updateProfileRequest.type, handleUpdateProfile);
  yield takeLatest(changePasswordRequest.type, handleChangePassword);
}
