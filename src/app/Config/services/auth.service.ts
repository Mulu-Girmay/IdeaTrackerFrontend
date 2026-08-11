import api from "../apiRoutes";

import type {
  LoginCredentials,
  RegisterData,
  User,
} from "../../types/auth.types";

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}
import type { UserStats, UpdateUserData } from "../../types/user.types";

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/users/register", data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/users/login", credentials);
    return response.data;
  },

  refreshToken: async (): Promise<{ success: boolean; token: string }> => {
    const response = await api.post<{ success: boolean; token: string }>(
      "/users/refresh-token",
    );
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/users/logout",
    );
    return response.data;
  },

  forgotPassword: async (
    email: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/users/forgot-password",
      { email },
    );
    return response.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/users/reset-password",
      { token, newPassword },
    );
    return response.data;
  },

  getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
    const response = await api.get<{ success: boolean; data: User }>(
      "/users/me",
    );
    return response.data;
  },

  updateProfile: async (data: {
    name?: string;
    email?: string;
  }): Promise<{ success: boolean; data: User }> => {
    const response = await api.put<{ success: boolean; data: User }>(
      "/users/updateMe",
      data,
    );
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/users/change-password",
      data,
    );
    return response.data;
  },
  allUsers: async (data?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    success: boolean;
    data: {
      users: User[];
      pagination: {
        page: number;
        totalPages: number;
        total: number;
        limit: number;
      };
    };
  }> => {
    const response = await api.get<{
      success: boolean;
      data: {
        users: User[];
        pagination: {
          page: number;
          totalPages: number;
          total: number;
          limit: number;
        };
      };
    }>("/users/allUsers", { params: data });
    return response.data;
  },

  userStats: async (): Promise<{
    success: boolean;
    data: UserStats;
  }> => {
    const response = await api.get<{
      success: boolean;
      data: UserStats;
    }>("/users/userStats");
    return response.data;
  },

  getUserById: async (
    id: string,
  ): Promise<{ success: boolean; data: User }> => {
    const response = await api.get<{ success: boolean; data: User }>(
      `/users/viewUser/${id}`,
    );
    return response.data;
  },

  editUser: async (
    id: string,
    data: UpdateUserData,
  ): Promise<{ success: boolean; data: User }> => {
    const response = await api.put<{ success: boolean; data: User }>(
      `/users/editUser/${id}`,
      data,
    );
    return response.data;
  },

  deleteUser: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/users/deleteUser/${id}`,
    );
    return response.data;
  },

  activateUser: async (
    id: string,
  ): Promise<{ success: boolean; data: User }> => {
    const response = await api.post<{ success: boolean; data: User }>(
      `/users/activateUser/${id}/activate`,
    );
    return response.data;
  },
};
