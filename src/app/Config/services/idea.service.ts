// src/services/idea.service.ts
import api from "../apiRoutes";
import type {
  Idea,
  IdeaStatus,
  IdeaCategory,
} from "../../types/idea.types";
import type { PaginatedResponse } from "../../types/api.types";
import type { CreateIdeaData, UpdateIdeaData } from "../../types/idea.types";

export const ideaService = {
  createIdea: async (
    data: CreateIdeaData,
  ): Promise<{ success: boolean; message: string; data: Idea }> => {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: Idea;
    }>("/ideas/create", data);
    return response.data;
  },

  getMyIdeas: async (
    page: number = 1,
    limit: number = 10,
    filters?: { status?: IdeaStatus; category?: IdeaCategory },
  ): Promise<PaginatedResponse<Idea>> => {
    const params = { page, limit, ...filters };
    const response = await api.get<PaginatedResponse<Idea>>("/ideas/myIdea", {
      params,
    });
    return response.data;
  },

  getAllIdeas: async (
    page: number = 1,
    limit: number = 10,
    filters?: { status?: IdeaStatus; category?: IdeaCategory; search?: string },
  ): Promise<PaginatedResponse<Idea>> => {
    const params = { page, limit, ...filters };
    const response = await api.get<PaginatedResponse<Idea>>("/ideas/allIdeas", {
      params,
    });
    return response.data;
  },

  getIdeaById: async (
    id: string,
  ): Promise<{ success: boolean; data: Idea }> => {
    const response = await api.get<{ success: boolean; data: Idea }>(
      `/ideas/viewIdea/${id}`,
    );
    return response.data;
  },

  updateIdea: async (
    id: string,
    data: UpdateIdeaData,
  ): Promise<{ success: boolean; message: string; data: Idea }> => {
    const response = await api.put<{
      success: boolean;
      message: string;
      data: Idea;
    }>(`/ideas/updateIdea/${id}`, data);
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
