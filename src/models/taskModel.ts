// Filename: taskModel.ts
// database implementation of task operations

import { query } from '../config/database.js';
import { QueryResult } from 'pg';

import { FilterOptions } from '../types/FilterOptions.js';
import { Priority } from '../types/Priority.js';
import { Task } from '../types/Task.js';

// READ

export const readTasks = async ({
  search,
  category,
  priorityOrder,
}: FilterOptions): Promise<QueryResult<any>> => {
  let queryString = 'SELECT * FROM tasks';
  const conditions: string[] = [];
  const values: (string | null)[] = [];

  // apply search filter
  if (search) {
    conditions.push('(title ILIKE $1 OR description ILIKE $1)');
    values.push(`%${search.toLocaleLowerCase()}%`);
  }

  // apply category filter
  if (category === 'completed') {
    conditions.push('completed = true');
  } else if (category === 'incomplete') {
    conditions.push('completed = false');
  }

  // add conditions
  if (conditions.length > 0) {
    queryString += ` WHERE ${conditions.join(' AND ')}`;
  }

  // apply sort
  if (priorityOrder === 'high') {
    queryString += ` ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END ASC`;
  } else if (priorityOrder === 'low') {
    queryString += ` ORDER BY CASE priority WHEN 'low' THEN 1 WHEN 'medium' THEN 2 WHEN 'high' THEN 3 END ASC`;
  }

  try {
    const result = await query(queryString, values);
    return result;
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
