// Filename: taskRoutes.js
// routes relating to tasks and processing tasks

import express from 'express';
import exampleData from '../public/example-data.js';

const taskRoutes = express.Router();

taskRoutes.get('/', (req, res) => {
  res.render('index', { tasks: exampleData });
});

taskRoutes.get('/usage', (req, res) => {
  res.render('usage');
});

taskRoutes.get('/about', (req, res) => {
  res.render('about');
});

export default taskRoutes;
