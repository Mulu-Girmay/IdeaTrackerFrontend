import { all } from "redux-saga/effects";
import { authSaga } from "../../app/pages/authPage/slice/saga";
import { forgotPasswordSaga } from "../../app/pages/ForgotPasswordPage/slice/saga";
import { resetPasswordSaga } from "../../app/pages/ResetPage/slice/saga";

export default function* rootSaga() {
  yield all([authSaga(), forgotPasswordSaga(), resetPasswordSaga()]);
}
