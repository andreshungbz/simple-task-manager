// Filename: taskRoutes.js
// routes relating to tasks and processing tasks

import express from 'express';
import data from '../data.js';
import taskSorter from '../utils/taskSorter.js';

const taskRoutes = express.Router();

// store tasks in memory in an array; remove exampleData and set ID to 0 for empty initial list
const tasks = [...data];
let id = data.length + 1;

// GENERAL ROUTES

// main page
taskRoutes.get('/', (req, res) => {
  // create a copy of the tasks; this is fine since the reference to same object is copied
  let renderedTasks = [...tasks];

  // get query parameters to use if necessary
  const search = req.query.search || '';
  const category = req.query.category || 'all';
  const priority = req.query.priority || '';

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

  // pass a filter object so filter input forms can pre-populate with last selection
  res.render('index', {
    tasks: renderedTasks,
    filter: {
      search,
      category,
      priority,
    },
  });
});

// usage
taskRoutes.get('/usage', (req, res) => {
  res.render('usage');
});

// about
taskRoutes.get('/about', (req, res) => {
  res.render('about');
});

// TASK OPERATION ROUTES

// add task
taskRoutes.post('/add-task', (req, res) => {
  const { taskTitle, taskDescription, taskPriority } = req.body;

  // handle missing fields
  if (!taskTitle || !taskDescription) {
    return res.render('error', {
      title: 'Error: Missing Field',
      description:
        "The content of the task's title and/or description was missing. Task not added.",
    });
  }

  tasks.unshift({
    id: id++,
    title: taskTitle,
    description: taskDescription,
    completed: false,
    priority: taskPriority,
  });

  // don't redirect to previous URL in case task properties don't match applied filters
  res.redirect('/');
});

// toggle task completion
taskRoutes.post('/toggle-task/:id', (req, res) => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID
  if (isNaN(taskID)) {
    return res.render('error', {
      title: 'Error: Non-numerical ID',
      description: 'Task ID should be a number. Task not processed.',
    });
  }

  const task = tasks.find((t) => t.id === taskID);

  // handle non-existent task
  if (!task) {
    return res.render('error', {
      title: 'Error: Non-existent Task',
      description: 'Task does not exist in list. Task not processed.',
    });
  }

  task.completed = !task.completed;
  tasks.sort(taskSorter);

  // redirect to previous URL
  const referer = req.get('Referer');
  res.redirect(referer || '/');
});

// delete task
taskRoutes.post('/delete-task/:id', (req, res) => {
  const taskID = Number(req.params.id);

  // handle non-numerical ID
  if (isNaN(taskID)) {
    return res.render('error', {
      title: 'Error: Non-numerical ID',
      description: 'Task ID should be a number. Task not processed.',
    });
  }

  const taskIndex = tasks.findIndex((t) => t.id === taskID);

  // handle non-existent task
  if (taskIndex === -1) {
    return res.render('error', {
      title: 'Error: Non-existent Task',
      description: 'Task does not exist in list. Task not processed.',
    });
  }

  tasks.splice(taskIndex, 1);

  // redirect to previous URL
  const referer = req.get('Referer');
  res.redirect(referer || '/');
});

export default taskRoutes;
