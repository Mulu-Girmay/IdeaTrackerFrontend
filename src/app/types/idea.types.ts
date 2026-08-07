export const IdeaStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type IdeaStatus = (typeof IdeaStatus)[keyof typeof IdeaStatus];

export const IdeaCategory = {
  TECHNOLOGY: "technology",
  BUSINESS: "business",
  DESIGN: "design",
  MARKETING: "marketing",
  OTHER: "other",
} as const;

export type IdeaCategory = (typeof IdeaCategory)[keyof typeof IdeaCategory];

export interface Idea {
  _id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  category: IdeaCategory;
  owner:
    | {
        _id: string;
        name: string;
        email: string;
      }
    | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIdeaData {
  title: string;
  description?: string;
  status?: IdeaStatus;
  category?: IdeaCategory;
}

export interface UpdateIdeaData {
  title?: string;
  description?: string;
  status?: IdeaStatus;
  category?: IdeaCategory;
}

export interface IdeaState {
  ideas: Idea[];
  currentIdea: Idea | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}
