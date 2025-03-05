export interface ResponseList<T> {
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  limit: number;
  totalDocs: number;
  search?: string;
  sort?: string;
  data: T[];
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
