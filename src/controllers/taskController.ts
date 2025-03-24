// Filename: taskController.ts
// business logic of task operations

import { Request, Response } from 'express';

import {
  insertTask,
  readTasks,
  deleteTask,
  toggleCompleted,
  readTask,
  updateTask,
} from '../models/taskModel.js';

import { Task } from '../types/Task.js';
import { FilterOptions } from '../types/FilterOptions.js';
import taskSorter from '../utils/taskSorter.js';

// GET

export const getTasks = async (req: Request, res: Response) => {
  // get query parameters to use if necessary
  const search = req.query.search ? String(req.query.search) : null;
  const category = req.query.category ? String(req.query.category) : 'all';
  const priorityOrder = req.query.priorityOrder
    ? String(req.query.priorityOrder)
    : null;

  const options: FilterOptions = { search, category, priorityOrder };

  try {
    const tasks: Task[] = (await readTasks(options)).rows;
    tasks.sort(taskSorter);

    res.render('index', {
      tasks,
      filter: {
        search,
        category,
        priorityOrder: priorityOrder,
      },
    });
  } catch {
    return res.render('error', {
      title: 'Internal Database Error',
      description: 'Sorry! Something went wrong! Please try again.',
    });
  }
};

// POST

export const addTask = async (req: Request, res: Response) => {
  let { taskTitle, taskDescription, taskPriority } = req.body;

  // handle missing title
  if (!taskTitle) {
    return res.render('error', {
      title: 'Error: Missing Title Field',
      description:
        "The content of the task's title was missing. Task not added.",
    });
  }

  // handle title length constraint
  if (taskTitle.length < 3 || taskTitle.length > 100) {
    return res.render('error', {
      title: 'Error: Title Length Error',
      description:
        'The title must be between 3 - 100 characters. Task not added',
    });
  }

  // handle descriptions that are too long
  if (taskDescription && taskDescription.length > 500) {
    return res.render('error', {
      title: 'Error: Description Too Long',
      description: 'The description exceeds 500 characters. Task not added.',
    });
  }

  // null adjust in case of undefined or empty string so that null is entered to database
  if (!taskDescription) {
    taskDescription = null;
  }

  try {
    await insertTask(taskTitle, taskDescription, taskPriority);
    // don't redirect to previous URL in case task properties don't match applied filters
    res.redirect('/');
  } catch {
    return res.render('error', {
      title: 'Internal Database Error',
      description: 'Sorry! Something went wrong! Please try again.',
    });
  }
};

// PATCH

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

// DELETE

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

// PUT

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

export const changeTask = async (req: Request, res: Response) => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID
  if (isNaN(taskID)) {
    return res.render('error', {
      title: 'Error: Non-numerical ID',
      description: 'Task ID should be a number. Task not processed.',
    });
  }

  let { taskTitle, taskDescription, taskPriority } = req.body;

  // handle missing title
  if (!taskTitle) {
    return res.render('error', {
      title: 'Error: Missing Title Field',
      description:
        "The content of the task's title was missing. Task not added.",
    });
  }

  // handle title length constraint
  if (taskTitle.length < 3 || taskTitle.length > 100) {
    return res.render('error', {
      title: 'Error: Title Length Error',
      description:
        'The title must be between 3 - 100 characters. Task not added',
    });
  }

  // handle descriptions that are too long
  if (taskDescription && taskDescription.length > 500) {
    return res.render('error', {
      title: 'Error: Description Too Long',
      description: 'The description exceeds 500 characters. Task not added.',
    });
  }

  // null adjust in case of undefined or empty string so that null is entered to database
  if (!taskDescription) {
    taskDescription = null;
  }

  try {
    const ok = await updateTask(
      taskID,
      taskTitle,
      taskDescription,
      taskPriority
    );

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
