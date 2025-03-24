// Filename: taskModel.ts
// database implementation of task operations
// functions are ordered by CRUD

import { query } from '../config/database.js';
import { createPGTaskSELECT } from '../utils/createPGTaskSELECT.js';

import { FilterOptions } from '../types/FilterOptions.js';
import { Priority } from '../types/Priority.js';
import { Task } from '../types/Task.js';

// CREATE single task
export const createTask = async (
  title: string,
  description: string | null = null,
  priority: Priority
) => {
  try {
    return (
      await query(
        'INSERT INTO tasks (title, description, priority) VALUES ($1, $2, $3) RETURNING *',
        [title, description, priority]
      )
    ).rows[0];
  } catch (error) {
    console.error('[taskModel/createTask]', error);
    throw error;
  }
};

// READ multiple tasks
export const readTasks = async (options: FilterOptions): Promise<Task[]> => {
  // create the appropriate query string and values array based on the filter options
  const queryObject = createPGTaskSELECT(options);

  try {
    return (await query(queryObject.query, queryObject.values)).rows;
  } catch (error) {
    console.error('[taskModel/readTasks]', error);
    throw error;
  }
};

// READ single task
export const readTask = async (id: number): Promise<Task> => {
  try {
    const result = await query('SELECT * FROM tasks WHERE id=$1', [id]);

    // if an id that does not exist in the database is queried, query technically succeeds but returns 0 rows
    // throw a new error in that case
    if (!Boolean(result.rowCount)) {
      console.error('[taskModel/readTask] id does not exist in database');
      throw new Error('ID does not exist in database');
    }

    return result.rows[0];
  } catch (error) {
    console.error('[taskModel/readTask]', error);
    throw error;
  }
};

// UPDATE (toggle) single task completion status
export const toggleCompleted = async (id: number): Promise<boolean> => {
  try {
    // falsy rowCount indicates that id does not exist in the database
    return Boolean(
      (
        await query(
          'UPDATE tasks SET completed = NOT completed WHERE id = $1',
          [id]
        )
      ).rowCount
    );
  } catch (error) {
    console.error('[taskModel/toggleCompleted]', error);
    throw error;
  }
};

// UPDATE single task's fields
export const updateTask = async (
  id: number,
  title: string,
  description: string | null = null,
  priority: Priority
): Promise<boolean> => {
  try {
    // falsy rowCount indicates that id does not exist in the database
    return Boolean(
      (
        await query(
          'UPDATE tasks SET title = $1, description = $2, priority = $3 WHERE id = $4',
          [title, description, priority, id]
        )
      ).rowCount
    );
  } catch (error) {
    console.error('[taskModel/updateTask]', error);
    throw error;
  }
};

// DELETE single task
export const deleteTask = async (id: number): Promise<boolean> => {
  try {
    // falsy rowCount indicates that id does not exist in the database
    return Boolean(
      (await query('DELETE FROM tasks WHERE id = $1', [id])).rowCount
    );
  } catch (error) {
    console.error('[taskModel/deleteTask]', error);
    throw error;
  }
};
