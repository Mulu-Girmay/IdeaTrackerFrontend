// src/Config/services/user.service.ts
import api from "../apiRoutes";
import type { User } from "../../types/auth.types";

export interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
}

export const userService = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>("/users/profile");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>("/users/profile", data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>(
      "/users/change-password",
      data
    );
    return response.data;
  },
};
