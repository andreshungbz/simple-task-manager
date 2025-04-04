// Filename: taskModel.ts
// database implementation of task operations
// functions are ordered by CRUD

import pkg from 'pg';
import { query } from '../config/database.js';

import { Task, NewTask, FilterOptions } from '../lib/TaskTypes.js';
import constructPGTaskSELECT from '../utils/constructPGTaskSELECT.js';

import {
  CustomError,
  NonexistentTaskError,
  UnknownError,
} from '../lib/CustomErrors.js';

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
    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 500, String(error.code), 'Database');
    } else {
      throw UnknownError;
    }
  }
};

// READ multiple tasks
export const readTasks = async (options: FilterOptions): Promise<Task[]> => {
  const queryObject = constructPGTaskSELECT(options); // create the appropriate query string and values array based on the filter options
  try {
    return (await query(queryObject.query, queryObject.values)).rows;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 500, String(error.code), 'Database');
    } else {
      throw error;
    }
  }
};

// READ single task
export const readTask = async (id: number): Promise<Task> => {
  try {
    const result = await query('SELECT * FROM tasks WHERE id=$1', [id]);
    if (!Boolean(result.rowCount)) throw NonexistentTaskError; // query doesn't error when id is non-existent, so check count
    return result.rows[0];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 500, String(error.code), 'Database');
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
    if (!Boolean(result.rowCount)) throw NonexistentTaskError; // query doesn't error when id is non-existent, so check count
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 500, String(error.code), 'Database');
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
    if (!Boolean(result.rowCount)) throw NonexistentTaskError; // query doesn't error when id is non-existent, so check count
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 500, String(error.code), 'Database');
    } else {
      throw error;
    }
  }
};

// DELETE single task
export const deleteTask = async (id: number) => {
  try {
    const result = await query('DELETE FROM tasks WHERE id = $1', [id]);
    if (!Boolean(result.rowCount)) throw NonexistentTaskError; // query doesn't error when id is non-existent, so check count
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw new CustomError(error.message, 500, String(error.code), 'Database');
    } else {
      throw error;
    }
  }
};
