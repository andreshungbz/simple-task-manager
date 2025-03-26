// Filename: TaskTypes.ts
// interfaces for task types and options

import { Priority } from './PriorityEnum.js';

// used for tasks retrieved from the database
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  created_at: Date;
}

// used for new tasks being created or task fields being updated (except completion)
export interface NewTask {
  id?: number;
  title: string;
  description: string | null;
  priority: Priority;
}

// type for task filter option values
export interface FilterOptions {
  search: string | null;
  category: string | null;
  priorityOrder: string | null;
}
