// Filename: taskController.ts
// business logic of task operations

import { Request, Response } from 'express';
import { NewTask, Task, FilterOptions } from '../types/TaskTypes.js';
import taskSorter from '../utils/taskSorter.js';

import {
  createTask,
  readTasks,
  readTask,
  toggleCompleted,
  updateTask,
  deleteTask,
} from '../models/taskModel.js';

// GET list of tasks which may have filters applied
export const getTasks = async (req: Request, res: Response) => {
  const search = req.query.search ? String(req.query.search) : null;
  const category = req.query.category ? String(req.query.category) : 'all';
  const priorityOrder = req.query.priorityOrder
    ? String(req.query.priorityOrder)
    : null;

  const options: FilterOptions = { search, category, priorityOrder };
  try {
    const tasks: Task[] = await readTasks(options);
    tasks.sort(taskSorter); // always sort

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

// POST new task
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

  const newTask: NewTask = {
    title: taskTitle,
    description: taskDescription,
    priority: taskPriority,
  };

  try {
    await createTask(newTask);
    // don't redirect to previous URL in case task properties don't match applied filters
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

  const newTask: NewTask = {
    id: taskID,
    title: taskTitle,
    description: taskDescription,
    priority: taskPriority,
  };

  try {
    const ok = await updateTask(newTask);

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
