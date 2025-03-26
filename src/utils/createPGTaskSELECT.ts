// Filename: createPGTaskSELECT.ts
// function that takes search, category, and priority order parameters
// and returns and object with the SQL query string and values for PG

import { FilterOptions } from '../lib/TaskTypes.js';

const createPGTaskSELECT = (
  options: FilterOptions
): { query: string; values: (string | null)[] } => {
  // initial variables
  let query = 'SELECT * FROM tasks';
  const conditions: string[] = [];
  const values: (string | null)[] = [];

  // apply search filter
  if (options.search) {
    conditions.push('(title ILIKE $1 OR description ILIKE $1)');
    values.push(`%${options.search.toLocaleLowerCase()}%`);
  }

  // apply category filter
  if (options.category === 'completed') {
    conditions.push('completed = true');
  } else if (options.category === 'incomplete') {
    conditions.push('completed = false');
  }

  // add WHERE conditions
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  // apply ORDER sort
  if (options.priorityOrder === 'high') {
    query += ` ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END ASC`;
  } else if (options.priorityOrder === 'low') {
    query += ` ORDER BY CASE priority WHEN 'low' THEN 1 WHEN 'medium' THEN 2 WHEN 'high' THEN 3 END ASC`;
  }

  return { query, values };
};

export default createPGTaskSELECT;
