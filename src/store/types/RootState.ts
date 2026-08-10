import type { ForgotPasswordState } from "../../app/pages/ForgotPasswordPage/slice/types";
import type { ResetPasswordState } from "../../app/pages/ResetPage/slice/types";
import type { AuthState } from "../../app/types/auth.types";
import type { IdeaState } from "../../app/types/idea.types";
import type { UserStats as UserState } from "../../app/types/user.types";

export interface RootState {
  auth: AuthState;
  ideas: IdeaState;
  users: UserState;
  forgotPassword: ForgotPasswordState;
  resetPassword: ResetPasswordState;
}
