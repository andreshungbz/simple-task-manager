// Filename: taskRoutes.js
// routes relating to tasks and processing tasks

import express from 'express';

const taskRoutes = express.Router();

taskRoutes.get('/', (req, res) => {
  res.render('index');
});

export default taskRoutes;
