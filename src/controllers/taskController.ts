// Filename: taskController.ts
// business logic of task operations

import { Request, Response } from 'express';

import { Task } from '../types/Task.js';
import taskSorter from '../utils/taskSorter.js';

// USE EMPTY INITIAL LIST
const tasks: Task[] = [];
let id = 1;

// GET

export const getTasks = (req: Request, res: Response) => {
  // create a copy of the tasks; this is fine since the reference to same object is copied
  let renderedTasks = [...tasks];

  // get query parameters to use if necessary
  const search = req.query.search ? String(req.query.search) : '';
  const category = req.query.category ? String(req.query.category) : 'all';
  const priority = req.query.priority ? String(req.query.priority) : '';

  // filter by search query
  if (search) {
    renderedTasks = renderedTasks.filter((t) => {
      const text = search.toLowerCase();
      const title = t.title.toLowerCase();
      const description = t.description.toLowerCase();

      return title.includes(text) || description.includes(text);
    });
  }

  // fitler by category (completed status)
  if (category) {
    renderedTasks = renderedTasks.filter((t) => {
      switch (category) {
        case 'completed':
          return t.completed;
        case 'incomplete':
          return !t.completed;
        default:
          return true;
      }
    });
  }

  // sort by priority
  if (priority) {
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    renderedTasks.sort((t1, t2) => {
      switch (priority) {
        case 'highToLow':
          return priorityOrder[t1.priority] - priorityOrder[t2.priority];
        case 'lowToHigh':
          return priorityOrder[t2.priority] - priorityOrder[t1.priority];
        default:
          return 0;
      }
    });

    // resort so completed tasks are always at the end
    renderedTasks.sort(taskSorter);
  }

  // pass a filter object so filter input forms can pre-populate with last selection
  res.render('index', {
    tasks: renderedTasks,
    filter: {
      search,
      category,
      priority,
    },
  });
};

// POST

export const postTask = (req: Request, res: Response) => {
  const { taskTitle, taskDescription, taskPriority } = req.body;

  // handle missing fields
  if (!taskTitle || !taskDescription) {
    return res.render('error', {
      title: 'Error: Missing Field',
      description:
        "The content of the task's title and/or description was missing. Task not added.",
    });
  }

  tasks.unshift({
    id: id++,
    title: taskTitle,
    description: taskDescription,
    completed: false,
    priority: taskPriority,
  });

  // don't redirect to previous URL in case task properties don't match applied filters
  res.redirect('/');
};

// PATCH

export const patchTask = (req: Request, res: Response) => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID
  if (isNaN(taskID)) {
    return res.render('error', {
      title: 'Error: Non-numerical ID',
      description: 'Task ID should be a number. Task not processed.',
    });
  }

  const task = tasks.find((t) => t.id === taskID);

  // handle non-existent task
  if (!task) {
    return res.render('error', {
      title: 'Error: Non-existent Task',
      description: 'Task does not exist in list. Task not processed.',
    });
  }

  task.completed = !task.completed;
  tasks.sort(taskSorter);

  // redirect to previous URL
  const referer = req.get('Referer');
  res.redirect(referer || '/');
};

// DELETE

export const deleteTask = (req: Request, res: Response) => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID
  if (isNaN(taskID)) {
    return res.render('error', {
      title: 'Error: Non-numerical ID',
      description: 'Task ID should be a number. Task not processed.',
    });
  }

  const taskIndex = tasks.findIndex((t) => t.id === taskID);

  // handle non-existent task
  if (taskIndex === -1) {
    return res.render('error', {
      title: 'Error: Non-existent Task',
      description: 'Task does not exist in list. Task not processed.',
    });
  }

  tasks.splice(taskIndex, 1);

  // redirect to previous URL
  const referer = req.get('Referer');
  res.redirect(referer || '/');
};
