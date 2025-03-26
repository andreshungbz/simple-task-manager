// Filename: createFilterOptions.ts
// function that takes an Express request and parses the format options

import { Request } from 'express';
import { FilterOptions } from '../lib/TaskTypes.js';

export const createFilterOptions = (req: Request): FilterOptions => {
  return {
    search: req.query.search ? String(req.query.search) : null,
    category: req.query.category ? String(req.query.category) : 'all',
    priorityOrder: req.query.priorityOrder
      ? String(req.query.priorityOrder)
      : null,
  };
};
