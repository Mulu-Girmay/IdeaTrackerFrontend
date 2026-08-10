import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authService } from "../../../Config/services/auth.service";
import type { AuthResponse } from "../../../Config/services/auth.service";
import type { LoginCredentials, RegisterData } from "../../../types/auth.types";
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
} from "./slice";

function* handleLogin(action: PayloadAction<LoginCredentials>) {
  try {
    const response: AuthResponse = yield call(authService.login, action.payload);
    if (response.success && response.data?.user) {
      yield put(loginSuccess(response.data.user));
    } else {
      yield put(loginFailure(response.message || "Login failed"));
    }
  } catch (error: any) {
    yield put(loginFailure(error.response?.data?.message || error.message || "Login failed"));
  }
}

function* handleRegister(action: PayloadAction<RegisterData>) {
  try {
    const response: AuthResponse = yield call(authService.register, action.payload);
    if (response.success && response.data?.user) {
      yield put(registerSuccess(response.data.user));
    } else {
      yield put(registerFailure(response.message || "Registration failed"));
    }
  } catch (error: any) {
    yield put(registerFailure(error.response?.data?.message || error.message || "Registration failed"));
  }
}

function* handleLogout() {
  try {
    yield call(authService.logout);
    yield put(logoutSuccess());
  } catch (error: any) {
    yield put(logoutFailure(error.message || "Logout failed"));
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
  yield takeLatest(logoutRequest.type, handleLogout);
}
