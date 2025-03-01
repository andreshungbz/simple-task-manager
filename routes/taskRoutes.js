// Filename: taskRoutes.js
// routes relating to tasks and processing tasks

import express from 'express';
import exampleData from '../public/example-data.js';

const taskRoutes = express.Router();
const tasks = [];
let id = 1;

// general routes

taskRoutes.get('/', (req, res) => {
  res.render('index', { tasks: tasks });
});

taskRoutes.get('/usage', (req, res) => {
  res.render('usage');
});

taskRoutes.get('/about', (req, res) => {
  res.render('about');
});

// task operations

taskRoutes.post('/add-task', (req, res) => {
  const { taskTitle, taskDescription } = req.body;

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
  });

  res.redirect('/');
});

export default taskRoutes;
