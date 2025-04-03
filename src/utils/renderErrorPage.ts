// Filename: renderErrorPage.ts
// function that takes an Express response and custom error and calls render on error view
// ensure the calling function calls return if necessary

import { Response } from 'express';
import { CustomError } from '../lib/CustomErrors.js';

import { readTasks } from '../models/taskModel.js';
import { earliestFirstSorter, incompleteFirstSorter } from './taskSorters.js';
import constructPagination from './constructPagination.js';

import { config } from '../config/app.config.js';

const renderErrorPage = async (res: Response, error: CustomError) => {
  const tasks = await readTasks({
    search: null,
    category: null,
    priorityOrder: null,
  });

  earliestFirstSorter(tasks, null);
  tasks.sort(incompleteFirstSorter);

  const pagination = constructPagination(tasks, 1, config.tasksPerPage, '');
  pagination.previousPageLink = `/${pagination.previousPageLink}`;
  pagination.nextPageLink = `/${pagination.nextPageLink}`;

  // set extra items
  res.setHeader(`X-${config.abbreviation}-Error`, error.appErrorCode);
  res.status(error.httpErrorCode);

  // render tasks list
  res.render('index', {
    tasks: pagination.tasks,
    filter: {
      search: null,
      category: null,
      priorityOrder: null,
    },
    pagination: pagination,
    error,
  });
};

export default renderErrorPage;
