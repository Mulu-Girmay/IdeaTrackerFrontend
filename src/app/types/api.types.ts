// src/types/api.types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    pagination: {
      page: number;
      totalPages: number;
      total: number;
      limit: number;
    };
  } & {
    [key: string]: T[] | any;
  };
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  details?: any;
}
