// Interface untuk response pagination
export interface PaginationResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
} 