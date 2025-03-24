// Filename: taskRoutes.js
// routes relating to tasks and processing tasks

import express from 'express';

import {
  getTasks,
  addTask,
  toggleTask,
  removeTask,
} from '../controllers/taskController.js';

const taskRoutes = express.Router();

// TASK OPERATION ROUTES

taskRoutes.get('/', getTasks); // HTTP GET
taskRoutes.post('/tasks', addTask); // HTTP POST
taskRoutes.patch('/tasks/:id', toggleTask); // HTTP PATCH
taskRoutes.delete('/tasks/:id', removeTask); // HTTP DELETE

export default taskRoutes;
