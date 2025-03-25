// Filename: taskController.ts
// business logic of task operations

import { Request, Response } from 'express';
import { Task, FilterOptions } from '../types/TaskTypes.js';
import taskSorter from '../utils/taskSorter.js';

import {
  createTask,
  readTasks,
  readTask,
  toggleCompleted,
  updateTask,
  deleteTask,
} from '../models/taskModel.js';
import { createFilterOptions } from '../utils/createFilterOptions.js';
import { createNewTask } from '../utils/createNewTask.js';

// GET list of tasks which may have filters applied
export const getTasks = async (req: Request, res: Response) => {
  // parse request to get filter options
  const options: FilterOptions = createFilterOptions(req);

  try {
    const tasks: Task[] = await readTasks(options);
    tasks.sort(taskSorter); // always sort rendered tasks

    res.render('index', {
      tasks,
      filter: {
        search: options.search,
        category: options.category,
        priorityOrder: options.priorityOrder,
      },
    });
  } catch {
    return res.render('error', {
      title: 'Internal Database Error',
      description: 'Sorry! Something went wrong! Please try again.',
    });
  }
};

// POST new task
export const addTask = async (req: Request, res: Response) => {
  // extract task fields from request and validate
  const result = createNewTask(req);
  if (!result.ok) {
    return res.render('error', result.error);
  }

  try {
    await createTask(result.newTask!);
    res.redirect('/');
  } catch {
    return res.render('error', {
      title: 'Internal Database Error',
      description: 'Sorry! Something went wrong! Please try again.',
    });
  }
};

// PATCH task's completed status
export const toggleTask = async (req: Request, res: Response) => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID
  if (isNaN(taskID)) {
    return res.render('error', {
      title: 'Error: Non-numerical ID',
      description: 'Task ID should be a number. Task not processed.',
    });
  }

  try {
    const ok = await toggleCompleted(taskID);

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
  } catch {
    return res.render('error', {
      title: 'Internal Database Error',
      description: 'Sorry! Something went wrong! Please try again.',
    });
  }
};

// DELETE task
export const removeTask = async (req: Request, res: Response) => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID
  if (isNaN(taskID)) {
    return res.render('error', {
      title: 'Error: Non-numerical ID',
      description: 'Task ID should be a number. Task not processed.',
    });
  }

  try {
    const ok = await deleteTask(taskID);

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
  } catch {
    return res.render('error', {
      title: 'Internal Database Error',
      description: 'Sorry! Something went wrong! Please try again.',
    });
  }
};

// GET page for updating a task's fields (except completed)
export const updateTaskPage = async (req: Request, res: Response) => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID
  if (isNaN(taskID)) {
    return res.render('error', {
      title: 'Error: Non-numerical ID',
      description: 'Task ID should be a number. Task not processed.',
    });
  }

  try {
    const task = await readTask(taskID);

    res.render('update-task-form', { task });
  } catch {
    return res.render('error', {
      title: 'Internal Database Error',
      description: 'Sorry! Something went wrong! Please try again.',
    });
  }
};

// PUT new task fields
export const changeTask = async (req: Request, res: Response) => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID
  if (isNaN(taskID)) {
    return res.render('error', {
      title: 'Error: Non-numerical ID',
      description: 'Task ID should be a number. Task not processed.',
    });
  }

  // extract task fields from request and validate
  const result = createNewTask(req);
  if (!result.ok) {
    return res.render('error', result.error);
  }

  try {
    const ok = await updateTask(result.newTask!);

    // handle non-existent task
    if (!ok) {
      return res.render('error', {
        title: 'Error: Non-existent Task',
        description: 'Task does not exist in list. Task not processed.',
      });
    }

    res.redirect('/');
  } catch {
    return res.render('error', {
      title: 'Internal Database Error',
      description: 'Sorry! Something went wrong! Please try again.',
    });
  }
};
