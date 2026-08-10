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
  createdAt: Date | string;
  updatedAt: Date | string;
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

export interface IdeasResponse {
  success: boolean;
  data: {
    ideas: Idea[];
    pagination: {
      page: number;
      totalPages: number;
      total: number;
      limit: number;
    };
  };
}

export interface IdeaResponse {
  success: boolean;
  message: string;
  data: Idea;
}

export type IdeaStatusValues = (typeof IdeaStatus)[keyof typeof IdeaStatus];
export type IdeaCategoryValues =
  (typeof IdeaCategory)[keyof typeof IdeaCategory];

export const IdeaStatusList = Object.values(IdeaStatus);
export const IdeaCategoryList = Object.values(IdeaCategory);
