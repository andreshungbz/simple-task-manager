// Filename: missingRoute.ts
// middleware to handle any non-existing routes; returns a 404 message

import { Request, Response } from 'express';
import { NonexistentPage404Error } from '../lib/CustomErrors.js';

import renderErrorPage from '../utils/renderErrorPage.js';

const missingRoute = (_req: Request, res: Response) => {
  renderErrorPage(res, NonexistentPage404Error);
};

export default missingRoute;
