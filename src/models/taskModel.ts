// Filename: taskModel.ts
// database implementation of task operations
// functions are ordered by CRUD

import { query } from '../config/database.js';
import { createPGTaskSELECT } from '../utils/createPGTaskSELECT.js';

import { Task, NewTask, FilterOptions } from '../lib/TaskTypes.js';
import { CustomError } from '../lib/CustomErrors.js';
import { NonexistentTaskError, UnknownError } from '../lib/CustomErrors.js';

import pkg from 'pg';
const { DatabaseError } = pkg;

// CREATE single task
export const createTask = async (newTask: NewTask) => {
  try {
    return (
      await query(
        'INSERT INTO tasks (title, description, priority) VALUES ($1, $2, $3) RETURNING *',
        [newTask.title, newTask.description, newTask.priority]
      )
    ).rows[0];
  } catch (error) {
    console.error('[taskModel/createTask]', error);

    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 'Database', error.code || 'unknown');
    } else {
      throw UnknownError;
    }
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

    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 'Database', error.code || 'unknown');
    } else {
      throw error;
    }
  }
};

// READ single task
export const readTask = async (id: number): Promise<Task> => {
  try {
    const result = await query('SELECT * FROM tasks WHERE id=$1', [id]);

    // if an id that does not exist in the database is queried, query technically succeeds but returns 0 rows
    // throw a new error in that case
    if (!Boolean(result.rowCount)) {
      throw NonexistentTaskError;
    }

    return result.rows[0];
  } catch (error) {
    console.error('[taskModel/readTask]', error);

    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 'Database', error.code || 'unknown');
    } else {
      throw error;
    }
  }
};

// UPDATE (toggle) single task completion status
export const toggleCompleted = async (id: number) => {
  try {
    const result = await query(
      'UPDATE tasks SET completed = NOT completed WHERE id = $1',
      [id]
    );

    // falsy rowCount indicates that id does not exist in the database
    if (!Boolean(result.rowCount)) {
      throw NonexistentTaskError;
    }
  } catch (error) {
    console.error('[taskModel/toggleCompleted]', error);

    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 'Database', error.code || 'unknown');
    } else {
      throw error;
    }
  }
};

// UPDATE single task's fields
export const updateTask = async (newTask: NewTask) => {
  try {
    const result = await query(
      'UPDATE tasks SET title = $1, description = $2, priority = $3 WHERE id = $4',
      [newTask.title, newTask.description, newTask.priority, newTask.id!]
    );

    // falsy rowCount indicates that id does not exist in the database
    if (!Boolean(result.rowCount)) {
      throw NonexistentTaskError;
    }
  } catch (error) {
    console.error('[taskModel/updateTask]', error);

    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 'Database', error.code || 'unknown');
    } else {
      throw error;
    }
  }
};

// DELETE single task
export const deleteTask = async (id: number) => {
  try {
    const result = await query('DELETE FROM tasks WHERE id = $1', [id]);

    // falsy rowCount indicates that id does not exist in the database
    if (!Boolean(result.rowCount)) {
      throw NonexistentTaskError;
    }
  } catch (error) {
    console.error('[taskModel/deleteTask]', error);

    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 'Database', error.code || 'unknown');
    } else {
      throw error;
    }
  }
};
