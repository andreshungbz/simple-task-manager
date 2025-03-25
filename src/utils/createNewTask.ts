// Filename: createNewTask.ts
// function that takes an Express request and returns a result object with a new task
// validation is done here

import { Request } from 'express';
import { NewTask } from '../types/TaskTypes.js';
import { CustomError } from '../types/CustomError.js';

interface Result {
  newTask?: NewTask;
  ok: boolean;
  error?: CustomError;
}

export const createNewTask = (req: Request): Result => {
  const result: Result = { ok: false };
  let { taskTitle, taskDescription, taskPriority } = req.body;

  // handle missing title
  if (!taskTitle) {
    result.error = new CustomError(
      `The content of the task's title was missing.`,
      'Validation',
      '-2'
    );

    return result;
  }

  // handle title length constraint
  if (taskTitle.length < 3 || taskTitle.length > 100) {
    result.error = new CustomError(
      `The title must be between 3 - 100 characters.`,
      'Validation',
      '-3'
    );

    return result;
  }

  // handle descriptions that are too long
  if (taskDescription && taskDescription.length > 500) {
    result.error = new CustomError(
      `The description exceeds 500 characters.`,
      'Validation',
      '-4'
    );

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
