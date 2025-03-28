// Filename: taskSortesr.ts
// sorter functions for task arrays

import { Task } from '../lib/TaskTypes.js';

// newer tasks are ordered first
export const earliestFirstSorter = (
  tasks: Task[],
  priorityOrder: string | null
) => {
  tasks.sort((t1: Task, t2: Task) => {
    return t2.created_at.getTime() - t1.created_at.getTime();
  });

  if (priorityOrder) {
    prioritySorter(tasks, priorityOrder);
  }
};

// incomplete tasks are ordered first
export const incompleteFirstSorter = (t1: Task, t2: Task) => {
  if (t1.completed && !t2.completed) {
    return 1;
  } else if (!t1.completed && t2.completed) {
    return -1;
  } else {
    return 0;
  }
};

// helper function for resorting by priority
function prioritySorter(tasks: Task[], priorityOrder: string | null) {
  tasks.sort((t1: Task, t2: Task) => {
    const priorityRank = { high: 1, medium: 2, low: 3 };

    if (priorityOrder === 'high') {
      return priorityRank[t1.priority] - priorityRank[t2.priority];
    } else if (priorityOrder === 'low') {
      return priorityRank[t2.priority] - priorityRank[t1.priority];
    } else {
      return 0;
    }
  });
}
