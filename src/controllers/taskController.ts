// Filename: taskController.ts
// business logic of task operations

import { Request, Response } from 'express';
import { Task, FilterOptions } from '../types/TaskTypes.js';

import taskSorter from '../utils/taskSorter.js';
import { createFilterOptions } from '../utils/createFilterOptions.js';
import { createNewTask } from '../utils/createNewTask.js';
import { extractValidID } from '../utils/extractValidID.js';

import {
  createTask,
  readTasks,
  readTask,
  toggleCompleted,
  updateTask,
  deleteTask,
} from '../models/taskModel.js';
import { renderErrorPage } from '../utils/renderErrorPage.js';
import { CustomError } from '../types/CustomError.js';

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
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};

// POST new task
export const addTask = async (req: Request, res: Response) => {
  // extract task fields from request and validate
  const result = createNewTask(req);
  if (!result.ok) {
    renderErrorPage(res, result.error!);
    return;
  }

  try {
    await createTask(result.newTask!);
    res.redirect('/');
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};

// PATCH task's completed status
export const toggleTask = async (req: Request, res: Response) => {
  // extract and validate id from request
  const id = extractValidID(req);
  if (!id) {
    renderErrorPage(
      res,
      new CustomError('Task ID should be a number.', 'Validation', '-5')
    );
    return;
  }

  try {
    const ok = await toggleCompleted(id);

    // handle non-existent task
    if (!ok) {
      renderErrorPage(
        res,
        new CustomError('Task does not exist in database.', 'Database', '-6')
      );
      return;
    }

    // redirect to previous URL
    const referer = req.get('Referer');
    res.redirect(referer || '/');
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};

// DELETE task
export const removeTask = async (req: Request, res: Response) => {
  // extract and validate id from request
  const id = extractValidID(req);
  if (!id) {
    renderErrorPage(
      res,
      new CustomError('Task ID should be a number.', 'Validation', '-5')
    );
    return;
  }

  try {
    const ok = await deleteTask(id);

    // handle non-existent task
    if (!ok) {
      renderErrorPage(
        res,
        new CustomError('Task does not exist in database.', 'Database', '-6')
      );
      return;
    }

    // redirect to previous URL
    const referer = req.get('Referer');
    res.redirect(referer || '/');
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};

// GET page for updating a task's fields (except completed)
export const updateTaskPage = async (req: Request, res: Response) => {
  // extract and validate id from request
  const id = extractValidID(req);
  if (!id) {
    renderErrorPage(
      res,
      new CustomError('Task ID should be a number.', 'Validation', '-5')
    );
    return;
  }

  try {
    const task = await readTask(id);
    res.render('update-task-form', { task });
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};

// PUT new task fields
export const changeTask = async (req: Request, res: Response) => {
  // extract and validate id from request
  const id = extractValidID(req);
  if (!id) {
    renderErrorPage(
      res,
      new CustomError('Task ID should be a number.', 'Validation', '-5')
    );
    return;
  }

  // extract task fields from request and validate
  const result = createNewTask(req);
  if (!result.ok) {
    return res.render('error', result.error);
  }

  result.newTask!.id = id;
  try {
    const ok = await updateTask(result.newTask!);

    // handle non-existent task
    if (!ok) {
      renderErrorPage(res, result.error!);
      return;
    }

    res.redirect('/');
  } catch (error) {
    if (error instanceof CustomError) renderErrorPage(res, error);
  }
};
