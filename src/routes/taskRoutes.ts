// Filename: taskRoutes.ts
// routes relating to tasks and processing tasks

import express from 'express';

import {
  getTasks,
  addTask,
  toggleTask,
  removeTask,
  updateTaskPage,
  changeTask,
} from '../controllers/taskController.js';

const taskRoutes = express.Router();

// TASK OPERATION ROUTES

taskRoutes.get('/', getTasks); // HTTP GET
taskRoutes.post('/tasks', addTask); // HTTP POST
taskRoutes.patch('/tasks/:id', toggleTask); // HTTP PATCH
taskRoutes.delete('/tasks/:id', removeTask); // HTTP DELETE

taskRoutes.get('/update/tasks/:id', updateTaskPage); // auxiliary page for HTTP PUT
taskRoutes.put('/tasks/:id', changeTask); // HTTP PUT

export default taskRoutes;
