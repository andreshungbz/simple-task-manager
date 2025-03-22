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

taskRoutes.get('/', getTasks); // HTTP GET
taskRoutes.post('/add-task', postTask); // HTTP POST
taskRoutes.post('/toggle-task/:id', patchTask); // HTTP PATCH
taskRoutes.post('/delete-task/:id', deleteTask); // HTTP DELETE

export default taskRoutes;
