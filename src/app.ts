// Filename: app.js
// the Express.js server instance

import express from 'express';
import path from 'path';

import logger from './middleware/logger.js';
import missingRoute from './middleware/missingRoute.js';

import taskRoutes from './routes/taskRoutes.js';
import infoRoutes from './routes/infoRoutes.js';

import { config } from './config/app.config.js';
import { getLocalIPAddress } from './utils/getLocalIPAddress.js';

const app = express();

// EJS templating
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// static folder
app.use(express.static(path.join(process.cwd(), 'public')));

// middleware to parse HTML form data
app.use(express.urlencoded({ extended: true }));
// log HTTP request details
app.use(logger);

// routes
app.use('/', taskRoutes);
app.use('/', infoRoutes);

// handle non-existent routes
app.use(missingRoute);

// start server
app.listen(config.port, () => {
  console.log(
    `[${config.abbreviation}] ${
      config.name
    } running at http://${getLocalIPAddress()}:${config.port}`
  );
});
