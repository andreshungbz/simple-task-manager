// Filename: taskModel.ts
// database implementation of task operations

import { FilterOptions } from '../types/FilterOptions.js';
import { Priority } from '../types/Priority.js';
import { Task } from '../types/Task.js';
import taskSorter from '../utils/taskSorter.js';

// USE EMPTY INITIAL LIST
const tasks: Task[] = [];
let id = 1;

// READ

export const readTasks = ({
  search,
  category,
  priority,
}: FilterOptions): Task[] => {
  // create a copy of the tasks; this is fine since the reference to same object is copied
  let renderedTasks = [...tasks];

  // filter by search query
  if (search) {
    renderedTasks = renderedTasks.filter((t) => {
      const text = search.toLowerCase();
      const title = t.title.toLowerCase();
      const description = t.description.toLowerCase();

      return title.includes(text) || description.includes(text);
    });
  }

  // fitler by category (completed status)
  if (category) {
    renderedTasks = renderedTasks.filter((t) => {
      switch (category) {
        case 'completed':
          return t.completed;
        case 'incomplete':
          return !t.completed;
        default:
          return true;
      }
    });
  }

  // sort by priority
  if (priority) {
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    renderedTasks.sort((t1, t2) => {
      switch (priority) {
        case 'highToLow':
          return priorityOrder[t1.priority] - priorityOrder[t2.priority];
        case 'lowToHigh':
          return priorityOrder[t2.priority] - priorityOrder[t1.priority];
        default:
          return 0;
      }
    });

    // resort so completed tasks are always at the end
    renderedTasks.sort(taskSorter);
  }

  return renderedTasks;
};

// INSERT

export const insertTask = (
  title: string,
  description: string = '',
  priority: Priority
) => {
  tasks.unshift({
    id: id++,
    title: title,
    description: description,
    completed: false,
    priority: priority,
  });
};

// UPDATE

export const updateTaskStatus = (id: number): boolean => {
  const task = tasks.find((t) => t.id === id);

  // handle non-existent task
  if (!task) {
    return false;
  }

  task.completed = !task.completed;
  tasks.sort(taskSorter);

  return true;
};

// REMOVE (DELETE)

export const removeTask = (id: number): boolean => {
  const taskIndex = tasks.findIndex((t) => t.id === id);

  // handle non-existent task
  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);

  return true;
};
