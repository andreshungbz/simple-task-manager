// Filename: Tasks.ts
// Task interface

import { Priority } from './Priority.js';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  created_at: Date;
}
