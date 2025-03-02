// Filename: taskRoutes.js
// routes relating to tasks and processing tasks

import express from 'express';
import exampleData from '../public/example-data.js';
import taskSorter from '../utils/taskSorter.js';

const taskRoutes = express.Router();
const tasks = [...exampleData];
let id = exampleData.length + 1;

// general routes

taskRoutes.get('/', (req, res) => {
  let renderedTasks = [...tasks];
  const search = req.query.search || '';
  const category = req.query.category || 'all';
  const priority = req.query.priority || '';

  if (search) {
    renderedTasks = renderedTasks.filter((t) => {
      const text = search.toLowerCase();
      const title = t.title.toLowerCase();
      const description = t.description.toLowerCase();

      return title.includes(text) || description.includes(text);
    });
  }

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

    renderedTasks.sort(taskSorter);
  }

  res.render('index', {
    tasks: renderedTasks,
    filter: {
      search,
      category,
      priority,
    },
  });
});

taskRoutes.get('/usage', (req, res) => {
  res.render('usage');
});

taskRoutes.get('/about', (req, res) => {
  res.render('about');
});

// task operations

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

  const referer = req.get('Referer');
  res.redirect(referer || '/');
});

export default taskRoutes;
