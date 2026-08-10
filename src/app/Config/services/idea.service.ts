// src/Config/services/idea.service.ts
import api from "../apiRoutes";
import type {
  CreateIdeaData,
  UpdateIdeaData,
  IdeasResponse,
  IdeaResponse,
} from "../../types/idea.types";

export const ideaService = {
  createIdea: async (data: CreateIdeaData): Promise<IdeaResponse> => {
    const response = await api.post<IdeaResponse>("/ideas/create", data);
    return response.data;
  },

  getMyIdeas: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }): Promise<IdeasResponse> => {
    const response = await api.get<IdeasResponse>("/ideas/myIdea", { params });
    return response.data;
  },

  getAllIdeas: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }): Promise<IdeasResponse> => {
    const response = await api.get<IdeasResponse>("/ideas/allIdeas", {
      params,
    });
    return response.data;
  },

  getIdeaById: async (id: string): Promise<IdeaResponse> => {
    const response = await api.get<IdeaResponse>(`/ideas/viewIdea/${id}`);
    return response.data;
  },

  updateIdea: async (
    id: string,
    data: UpdateIdeaData,
  ): Promise<IdeaResponse> => {
    const response = await api.put<IdeaResponse>(
      `/ideas/updateIdea/${id}`,
      data,
    );
    return response.data;
  },

  deleteIdea: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/ideas/deleteIdea/${id}`,
    );
    return response.data;
  },
};
