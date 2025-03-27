// Filename: constructPagination.ts
// calculates pagination and returns object with details

import { Pagination } from '../lib/PaginationType.js';
import { Task } from '../lib/TaskTypes.js';

const constructPagination = (
  tasks: Task[],
  page: number,
  limit: number,
  query: string
): Pagination => {
  const totalPages = Math.ceil(tasks.length / limit); // total number of pages
  const startIndex = (page - 1) * limit; // index of the first task on the current page
  const endIndex = startIndex + limit; // index of the last task on the current page
  const paginatedTasks = tasks.slice(startIndex, endIndex); // get tasks for the current page

  return {
    tasks: paginatedTasks,
    currentPage: page,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    nextPageLink: `?${query}page=${page + 1}`,
    previousPageLink: `?${query}page=${page - 1}`,
  };
};

export default constructPagination;
