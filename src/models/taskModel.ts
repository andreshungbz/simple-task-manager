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
    console.error('[taskModel/readTasks] Error fetching tasks:', error);
    throw error;
  }

  console.log(search, category, priority);

  return renderedTasks;
};

// INSERT

export const insertTask = async (
  title: string,
  description: string | null = null,
  priority: Priority
) => {
  try {
    const result = await query(
      'INSERT INTO tasks (title, description, priority) VALUES ($1, $2, $3) RETURNING *',
      [title, description, priority]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[taskModel/insertTask] Error inserting task:', error);
    throw error;
  }
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
