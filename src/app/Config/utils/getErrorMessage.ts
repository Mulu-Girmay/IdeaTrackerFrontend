import type { AxiosError } from "axios";

interface ValidationDetail {
  field?: string;
  message: string;
}

interface ApiErrorBody {
  success?: false;
  message?: string;
  code?: string;
  details?: ValidationDetail[] | null;
}

export const getErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<ApiErrorBody>;
  const data = axiosError?.response?.data;

  if (data?.details && Array.isArray(data.details) && data.details.length > 0) {
    return data.details
      .map((d) => d.message)
      .filter(Boolean)
      .join(" ");
  }

  if (data?.message) {
    return data.message;
  }

  if (axiosError?.message === "Network Error") {
    return "Can't reach the server. Check your connection and try again.";
  }

  if (axiosError?.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  return (error as Error)?.message || fallback;
};

export default getErrorMessage;
