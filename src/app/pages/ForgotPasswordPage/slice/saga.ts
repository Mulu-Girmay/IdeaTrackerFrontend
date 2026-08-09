// src/store/auth/saga/forgotPassword.saga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import { authService } from "../../../Config/services/auth.service";
import {
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
} from "../../../pages/ForgotPasswordPage/slice";

function* handleForgotPassword(action: { type: string; payload: string }) {
  try {
    const response: { success: boolean; message: string } = yield call(
      authService.forgotPassword,
      action.payload,
    );

    if (response.success) {
      yield put(
        forgotPasswordSuccess(
          response.message || "Password reset link sent to your email",
        ),
      );
    } else {
      yield put(
        forgotPasswordFailure(response.message || "Failed to send reset link"),
      );
    }
  } catch (error: any) {
    yield put(
      forgotPasswordFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to send reset link",
      ),
    );
  }
}

export function* forgotPasswordSaga() {
  yield takeLatest(forgotPasswordRequest.type, handleForgotPassword);
}
