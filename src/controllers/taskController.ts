// Filename: taskController.ts
// business logic of task operations

import { Request, Response } from 'express';
import { Task, FilterOptions } from '../lib/TaskTypes.js';
import { CustomError } from '../lib/CustomErrors.js';

import taskSorter from '../utils/taskSorter.js';
import renderErrorPage from '../utils/renderErrorPage.js';

import {
  createFilterOptions,
  createNewTask,
  extractValidID,
} from '../utils/reqUtils.js';

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
  const options: FilterOptions = createFilterOptions(req); // create filter options
  try {
    const tasks: Task[] = await readTasks(options); // get array of Tasks
    tasks.sort(taskSorter); // sort the result

    res.render('index', {
      tasks,
      filter: {
        search: options.search,
        category: options.category,
        priorityOrder: options.priorityOrder,
      },
    });
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};

// POST new task
export const addTask = async (req: Request, res: Response) => {
  try {
    const newTask = createNewTask(req); // validate form fields and create new task; throws error on fail
    await createTask(newTask); // write task to database
    res.redirect('/');
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};

// PATCH task's completed status
export const toggleTask = async (req: Request, res: Response) => {
  try {
    const id = extractValidID(req); // validate and extract id from request; throws error on fail
    await toggleCompleted(id); // toggle task's completed status
    const referer = req.get('Referer'); // redirect to previous URL
    res.redirect(referer || '/');
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};

// DELETE task
export const removeTask = async (req: Request, res: Response) => {
  try {
    const id = extractValidID(req); // validate and extract id from request; throws error on fail
    await deleteTask(id); // delete task from database
    const referer = req.get('Referer'); // redirect to previous URL
    res.redirect(referer || '/');
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};

// GET page for updating a task's fields (except completed)
export const updateTaskPage = async (req: Request, res: Response) => {
  try {
    const id = extractValidID(req); // validate and extract id from request; throws error on fail
    const task = await readTask(id); // get single task's details to render its fields
    res.render('update-task-form', { task });
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};

// PUT new task fields
export const changeTask = async (req: Request, res: Response) => {
  try {
    const id = extractValidID(req); // validate and extract id from request; throws error on fail
    const newTask = createNewTask(req); // validate form fields and create new task; throws error on fail
    newTask.id = id; // pass id to newTask since it's needed to update
    await updateTask(newTask);
    res.redirect('/');
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};
