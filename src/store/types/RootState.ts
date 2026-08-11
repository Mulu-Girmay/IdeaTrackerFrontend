import type { ForgotPasswordState } from "../../app/pages/ForgotPasswordPage/slice/types";
import type { ResetPasswordState } from "../../app/pages/ResetPage/slice/types";
import type { AuthState } from "../../app/types/auth.types";

export interface RootState {
  auth: AuthState;
  [key: string]: any;
  forgotPassword: ForgotPasswordState;
  resetPassword: ResetPasswordState;
}
