// Filename: createNewTask.ts
// function that takes an Express request and returns a result object with a new task
// validation is done here

import { Request } from 'express';
import { NewTask } from '../lib/TaskTypes.js';

import {
  CustomError,
  DescriptionLengthError,
  MissingTitleError,
  TitleLengthError,
} from '../lib/CustomErrors.js';

interface Result {
  newTask?: NewTask;
  ok: boolean;
  error?: CustomError;
}

const createNewTask = (req: Request): Result => {
  const result: Result = { ok: false };
  let { taskTitle, taskDescription, taskPriority } = req.body;

  // handle missing title
  if (!taskTitle) {
    result.error = MissingTitleError;
    return result;
  }

  // handle title length constraint
  if (taskTitle.length < 3 || taskTitle.length > 100) {
    result.error = TitleLengthError;
    return result;
  }

  // handle descriptions that are too long
  if (taskDescription && taskDescription.length > 500) {
    result.error = DescriptionLengthError;
    return result;
  }

  // null adjust in case of undefined or empty string so that null is entered to database
  if (!taskDescription) {
    taskDescription = null;
  }

  // no errors at this point, so change ok to true and assign new task
  result.ok = true;
  result.newTask = {
    title: taskTitle,
    description: taskDescription,
    priority: taskPriority,
  };

  return result;
};

export default createNewTask;
