import type { AuthState } from "../../app/types/auth.types";
import type { IdeaState } from "../../app/types/idea.types";
import type { UserStats as UserState } from "../../app/types/user.types";

export interface RootState {
  auth: AuthState;
  ideas: IdeaState;
  users: UserState;
  forgotPassword: {
    isLoading: boolean;
    error: string | null;
    success: string | null;
  };
  resetPassword: {
    isLoading: boolean;
    error: string | null;
    success: string | null;
  };
}
