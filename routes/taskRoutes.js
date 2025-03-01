// Filename: taskRoutes.js
// routes relating to tasks and processing tasks

import express from 'express';
import exampleData from '../public/example-data.js';

const taskRoutes = express.Router();

taskRoutes.get('/', (req, res) => {
  res.render('index', { tasks: exampleData });
});

export default taskRoutes;
