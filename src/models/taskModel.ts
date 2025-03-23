// Filename: taskModel.ts
// database implementation of task operations

import { query } from '../config/database.js';
import { QueryArrayResult } from 'pg';

import { FilterOptions } from '../types/FilterOptions.js';
import { Priority } from '../types/Priority.js';
import { Task } from '../types/Task.js';
import taskSorter from '../utils/taskSorter.js';

// USE EMPTY INITIAL LIST
const tasks: Task[] = [];
let id = 1;

// READ

export const readTasks = async ({
  search,
  category,
  priority,
}: FilterOptions): Promise<QueryArrayResult> => {
  let renderedTasks;

  try {
    renderedTasks = await query('SELECT * FROM tasks');
  } catch (error) {
    console.error('[taskModel] Error fetching tasks:', error);
    throw error;
  }

  console.log(search, category, priority);

  return renderedTasks;
};

// INSERT

export const insertTask = (
  title: string,
  description: string = '',
  priority: Priority
) => {
  tasks.unshift({
    id: id++,
    title: title,
    description: description,
    completed: false,
    priority: priority,
  });
};

// UPDATE

export const updateTaskStatus = (id: number): boolean => {
  const task = tasks.find((t) => t.id === id);

  // handle non-existent task
  if (!task) {
    return false;
  }

  task.completed = !task.completed;
  tasks.sort(taskSorter);

  return true;
};

// REMOVE (DELETE)

export const removeTask = (id: number): boolean => {
  const taskIndex = tasks.findIndex((t) => t.id === id);

  // handle non-existent task
  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);

  return true;
};
