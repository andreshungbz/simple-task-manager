// Filename: app.js
// the Express.js server instance

import express from 'express';
import path from 'path';
import methodOverride from 'method-override';

import logger from './middleware/logger.js';
import missingRoute from './middleware/missingRoute.js';

import taskRoutes from './routes/taskRoutes.js';
import infoRoutes from './routes/infoRoutes.js';

import { config } from './config/app.config.js';

const app = express();

// EJS templating
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// static folder
app.use(express.static(path.join(process.cwd(), 'public')));

// middleware

// HTML forms do not support other HTTP methods other than GET and POST,
// so the Express method-override middleware is used to override the method for the PUT/PATCH/DELETE routes
// https://github.com/expressjs/method-override
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true })); // required to parse HTML form data
app.use(logger); // log time and route of every request

// routes
app.use('/', taskRoutes);
app.use('/', infoRoutes);

// handle non-existent routes
app.use(missingRoute);

// start server
app.listen(config.port, () => {
  console.log(
    `[${config.abbreviation}] ${config.name} running at ${config.baseUrl}`
  );
});
