export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  users: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: "user" | "admin";
  isActive?: boolean;
}
