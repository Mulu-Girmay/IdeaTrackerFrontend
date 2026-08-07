export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: Pagination;
  };
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  details?: any;
}
