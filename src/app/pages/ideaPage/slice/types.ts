import type { Idea } from "../../../types/idea.types";

export interface IdeaSliceState {
  ideas: Idea[];
  selectedIdea: Idea | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export interface GetIdeasPayload {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
}

export interface CreateIdeaPayload {
  title: string;
  description?: string;
  status?: string;
  category?: string;
}

export interface UpdateIdeaPayload {
  id: string;
  data: {
    title?: string;
    description?: string;
    status?: string;
    category?: string;
  };
}
