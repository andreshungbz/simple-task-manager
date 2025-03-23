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
taskRoutes.post('/add-task', addTask); // HTTP POST
taskRoutes.post('/toggle-task/:id', toggleTask); // HTTP PATCH
taskRoutes.post('/delete-task/:id', removeTask); // HTTP DELETE

export default taskRoutes;
