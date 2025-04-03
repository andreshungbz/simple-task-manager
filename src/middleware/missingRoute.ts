// Filename: missingRoute.ts
// middleware to handle any non-existing routes; returns a 404 message

import { Request, Response } from 'express';
import { NonexistentPage404Error } from '../lib/CustomErrors.js';

import { config } from '../config/app.config.js';

const missingRoute = (_req: Request, res: Response) => {
  res.setHeader(
    `X-${config.abbreviation}-Error`,
    NonexistentPage404Error.appErrorCode
  );
  res.status(NonexistentPage404Error.httpErrorCode);
  res.render('error', {
    code: NonexistentPage404Error.appErrorCode,
    category: NonexistentPage404Error.category,
    message: NonexistentPage404Error.message,
  });
};

export default missingRoute;
