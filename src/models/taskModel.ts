// Filename: taskModel.ts
// database implementation of task operations

import { query } from '../config/database.js';
import { QueryArrayResult } from 'pg';

import { FilterOptions } from '../types/FilterOptions.js';
import { Priority } from '../types/Priority.js';

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

export const updateTaskStatus = async (id: number): Promise<boolean> => {
  try {
    const result = await query(
      'UPDATE tasks SET completed = NOT completed WHERE id = $1',
      [id]
    );
    return Boolean(result.rowCount);
  } catch (error) {
    console.error(
      '[taskModel/updateTaskStatus] Error toggling task status:',
      error
    );
    throw error;
  }
};

// REMOVE (DELETE)

export const removeTask = async (id: number): Promise<boolean> => {
  try {
    const result = await query('DELETE FROM tasks WHERE id = $1', [id]);
    return Boolean(result.rowCount);
  } catch (error) {
    console.error('[taskModel/removeTask] Error deleting task:', error);
    throw error;
  }
};
