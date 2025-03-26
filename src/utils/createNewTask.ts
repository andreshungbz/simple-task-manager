// Filename: createNewTask.ts
// function that takes an Express request and returns a result object with a new task
// validation is done here

import { Request } from 'express';
import { NewTask } from '../lib/TaskTypes.js';

import {
  DescriptionLengthError,
  MissingTitleError,
  TitleLengthError,
} from '../lib/CustomErrors.js';

const createNewTask = (req: Request): NewTask => {
  let { taskTitle, taskDescription, taskPriority } = req.body;

  // handle missing title
  if (!taskTitle) {
    throw MissingTitleError;
  }

  // handle title length constraint
  if (taskTitle.length < 3 || taskTitle.length > 100) {
    throw TitleLengthError;
  }

  // handle descriptions that are too long
  if (taskDescription && taskDescription.length > 500) {
    throw DescriptionLengthError;
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

export default createNewTask;
