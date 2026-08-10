import type { User } from "../../../types/auth.types";

export interface AuthPageState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}
