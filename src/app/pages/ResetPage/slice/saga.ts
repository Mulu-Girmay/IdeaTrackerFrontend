import { call, put, takeLatest } from "redux-saga/effects";
import { authService } from "../../../Config/services/auth.service";
import { getErrorMessage } from "../../../Config/utils/getErrorMessage";
import {
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
} from "./index";

function* handleResetPassword(action: {
  type: string;
  payload: { token: string; newPassword: string };
}) {
  try {
    const response: { success: boolean; message: string } = yield call(
      authService.resetPassword,
      action.payload.token,
      action.payload.newPassword,
    );

    if (response.success) {
      yield put(
        resetPasswordSuccess(response.message || "Password reset successful"),
      );
    } else {
      yield put(
        resetPasswordFailure(response.message || "Failed to reset password"),
      );
    }
  } catch (error: any) {
    yield put(
      resetPasswordFailure(
        getErrorMessage(
          error,
          "We couldn't reset your password. The link may have expired — request a new one.",
        ),
      ),
    );
  }
}

export function* resetPasswordSaga() {
  yield takeLatest(resetPasswordRequest.type, handleResetPassword);
}
