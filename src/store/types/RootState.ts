// src/store/types/RootState.ts
import { AuthState } from "../../types/auth.types";
import { IdeaState } from "../../types/idea.types";
import { UserState } from "../../types/user.types";

export interface RootState {
  auth: AuthState;
  ideas: IdeaState;
  users: UserState;
  // Add other state slices as needed
}
