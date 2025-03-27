// Filename: PaginationType.ts
// pagination fields

import { Task } from './TaskTypes.js';

export interface Pagination {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPageLink: string;
  previousPageLink: string;
}
