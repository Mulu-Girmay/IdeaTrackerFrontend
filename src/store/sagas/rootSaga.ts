import { all } from "redux-saga/effects";
import { authSaga } from "../../app/pages/authPage/slice/saga";

export default function* rootSaga() {
  yield all([
    authSaga(),
  ]);
}
