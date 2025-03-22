// Filename: infoRoutes.ts
// routes to informational pages

import express from 'express';

import { getUsage, getAbout } from '../controllers/infoController.js';

const infoRoutes = express.Router();

infoRoutes.get('/usage', getUsage);
infoRoutes.get('/about', getAbout);

export default infoRoutes;
