// Filename: taskModel.ts
// database implementation of task operations

import { query } from '../config/database.js';
import { createPGTaskSELECT } from '../utils/createPGTaskSELECT.js';

import { FilterOptions } from '../types/FilterOptions.js';
import { Priority } from '../types/Priority.js';
import { Task } from '../types/Task.js';

// READ

export const readTasks = async (options: FilterOptions): Promise<Task[]> => {
  const queryObject = createPGTaskSELECT(options);
  try {
    return (await query(queryObject.query, queryObject.values)).rows;
  } catch (error) {
    console.error('[taskModel/readTasks] Error fetching tasks:', error);
    throw error;
  }
};

export const readTask = async (id: number): Promise<Task> => {
  try {
    const result = await query('SELECT * FROM tasks WHERE id=$1', [id]);

    if (Boolean(result.rowCount)) {
      return result.rows[0];
    }

    throw new Error('ID does not exist in database');
  } catch (error) {
    console.error(
      '[taskModel/readTask] Error retrieving specific task:',
      error
    );
    throw error;
  }
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

export const toggleCompleted = async (id: number): Promise<boolean> => {
  try {
    const result = await query(
      'UPDATE tasks SET completed = NOT completed WHERE id = $1',
      [id]
    );
    return Boolean(result.rowCount);
  } catch (error) {
    console.error(
      '[taskModel/toggleCompleted] Error toggling task status:',
      error
    );
    throw error;
  }
};

export const updateTask = async (
  id: number,
  title: string,
  description: string | null = null,
  priority: Priority
): Promise<boolean> => {
  try {
    const result = await query(
      'UPDATE tasks SET title = $1, description = $2, priority = $3 WHERE id = $4',
      [title, description, priority, id]
    );
    return Boolean(result.rowCount);
  } catch (error) {
    console.error('[taskModel/updateTask] Error updating task:', error);
    throw error;
  }
};

// DELETE

export const deleteTask = async (id: number): Promise<boolean> => {
  try {
    const result = await query('DELETE FROM tasks WHERE id = $1', [id]);
    return Boolean(result.rowCount);
  } catch (error) {
    console.error('[taskModel/deleteTask] Error deleting task:', error);
    throw error;
  }
};
