// Filename: reqUtils.ts
// functions that parse Express request parameter or body values
// and return appropriate objects or throw appropriate errors

import { Request } from 'express';
import { FilterOptions, NewTask } from '../lib/TaskTypes.js';

import {
  DescriptionLengthError,
  MissingTitleError,
  TitleLengthError,
  NonNumberIDParamError,
  CustomError,
} from '../lib/CustomErrors.js';

// function that takes an Express request and parses the format options
export const createFilterOptions = (req: Request): FilterOptions => {
  return {
    search: req.query.search ? String(req.query.search) : null,
    category: req.query.category ? String(req.query.category) : 'all',
    priorityOrder: req.query.priorityOrder
      ? String(req.query.priorityOrder)
      : null,
  };
};

// function that takes an Express request and returns a result object with a new task
export const createNewTask = (req: Request): NewTask => {
  let { taskTitle, taskDescription, taskPriority } = req.body;

  // handle missing title
  if (!taskTitle) {
    throw new CustomError(
      MissingTitleError.message,
      MissingTitleError.httpErrorCode,
      MissingTitleError.appErrorCode,
      MissingTitleError.category,
      taskTitle,
      taskDescription,
      taskPriority
    );
  }

  // handle title length constraint
  if (taskTitle.length < 3 || taskTitle.length > 100) {
    throw new CustomError(
      TitleLengthError.message,
      TitleLengthError.httpErrorCode,
      TitleLengthError.appErrorCode,
      TitleLengthError.category,
      taskTitle,
      taskDescription,
      taskPriority
    );
  }

  // handle descriptions that are too long
  if (taskDescription && taskDescription.length > 500) {
    throw new CustomError(
      DescriptionLengthError.message,
      DescriptionLengthError.httpErrorCode,
      DescriptionLengthError.appErrorCode,
      DescriptionLengthError.category,
      taskTitle,
      taskDescription,
      taskPriority
    );
  }

  // null adjust in case of undefined or empty string so that null is entered to database
  if (!taskDescription) {
    taskDescription = null;
  }

  // no errors at this point, so change ok to true and assign new task
  return {
    title: taskTitle,
    description: taskDescription,
    priority: taskPriority,
  };
};

// function that takes an Express request and returns a valid ID or null
// valid IDs are numbers that are positive and not 0
export const extractValidID = (req: Request): number => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID and 0/negative values
  if (isNaN(taskID) || taskID < 1) {
    throw NonNumberIDParamError;
  }

  return taskID;
};

// function that gets page number from Express request query
export const extractPageNumber = (req: Request): number => {
  const page = req.query.page ? Number(req.query.page) : 1;
  if (isNaN(page) || page < 1) return 1;
  return page;
};

// function that reads Express request query and returns the URL string
export const extractQueryString = (req: Request): string => {
  const queryString = Object.entries(req.query)
    .filter(([key]) => key !== 'page') // Exclude the "page" parameter
    .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
    .join('&');

  return queryString ? `${queryString}&` : '';
};
