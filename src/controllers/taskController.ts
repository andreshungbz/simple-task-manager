// Filename: taskController.ts
// business logic of task operations

import { Request, Response } from 'express';

import {
  insertTask,
  readTasks,
  removeTask,
  updateTaskStatus,
} from '../models/taskModel.js';

import { Task } from '../types/Task.js';
import taskSorter from '../utils/taskSorter.js';

// GET

export const getTasks = async (req: Request, res: Response) => {
  // get query parameters to use if necessary
  const search = req.query.search ? String(req.query.search) : '';
  const category = req.query.category ? String(req.query.category) : 'all';
  const priority = req.query.priority ? String(req.query.priority) : '';

  const tasks: Task[] = (await readTasks({ search, category, priority })).rows;

  tasks.sort(taskSorter);

  // pass a filter object so filter input forms can pre-populate with last selection
  res.render('index', {
    tasks: tasks,
    filter: {
      search,
      category,
      priority,
    },
  });
};

// POST

export const postTask = async (req: Request, res: Response) => {
  const { taskTitle, taskDescription, taskPriority } = req.body;

  // handle missing fields
  if (!taskTitle || !taskDescription) {
    return res.render('error', {
      title: 'Error: Missing Field',
      description:
        "The content of the task's title and/or description was missing. Task not added.",
    });
  }

  await insertTask(taskTitle, taskDescription, taskPriority);

  // don't redirect to previous URL in case task properties don't match applied filters
  res.redirect('/');
};

// PATCH

export const patchTask = async (req: Request, res: Response) => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID
  if (isNaN(taskID)) {
    return res.render('error', {
      title: 'Error: Non-numerical ID',
      description: 'Task ID should be a number. Task not processed.',
    });
  }

  const ok = await updateTaskStatus(taskID);

  // handle non-existent task
  if (!ok) {
    return res.render('error', {
      title: 'Error: Non-existent Task',
      description: 'Task does not exist in list. Task not processed.',
    });
  }

  // redirect to previous URL
  const referer = req.get('Referer');
  res.redirect(referer || '/');
};

// DELETE

export const deleteTask = async (req: Request, res: Response) => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID
  if (isNaN(taskID)) {
    return res.render('error', {
      title: 'Error: Non-numerical ID',
      description: 'Task ID should be a number. Task not processed.',
    });
  }

  const ok = await removeTask(taskID);

  // handle non-existent task
  if (!ok) {
    return res.render('error', {
      title: 'Error: Non-existent Task',
      description: 'Task does not exist in list. Task not processed.',
    });
  }

  // redirect to previous URL
  const referer = req.get('Referer');
  res.redirect(referer || '/');
};
