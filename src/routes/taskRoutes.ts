// Filename: taskRoutes.js
// routes relating to tasks and processing tasks

import express from 'express';

import {
  getTasks,
  postTask,
  patchTask,
  deleteTask,
} from '../controllers/taskController.js';

const taskRoutes = express.Router();

// TASK OPERATION ROUTES
taskRoutes.get('/', getTasks);
taskRoutes.post('/add-task', postTask);
taskRoutes.post('/toggle-task/:id', patchTask);
taskRoutes.post('/delete-task/:id', deleteTask);

export default taskRoutes;
