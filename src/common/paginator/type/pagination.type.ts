export interface PaginationResponse<T> {
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  limit: number;
  totalDocs: number;
  search?: string;
  data: T[];
}
