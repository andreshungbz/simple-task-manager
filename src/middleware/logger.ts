// Filename: logger.ts
// middleware to log the time, method and URL of every HTTP request

import { Request, Response, NextFunction } from 'express';
import { config } from '../config/app.config.js';

const logger = (req: Request, _res: Response, next: NextFunction) => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
  // https://www.localeplanet.com/icu/en-BZ/index.html
  const now = new Date().toLocaleString('en-BZ', { hour12: true });

  console.log(`[${config.abbreviation}] [${now}] ${req.method} ${req.url}`);
  next();
};

export default logger;
