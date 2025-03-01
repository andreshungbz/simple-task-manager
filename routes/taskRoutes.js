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
  res.render('index', { tasks: tasks });
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

  res.redirect('/');
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

  res.redirect('/');
});

export default taskRoutes;
