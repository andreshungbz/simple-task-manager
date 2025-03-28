// Filename: renderErrorPage.ts
// function that takes an Express response and custom error and calls render on error view
// ensure the calling function calls return if necessary

import { Response } from 'express';
import { CustomError } from '../lib/CustomErrors.js';

import { config } from '../config/app.config.js';

const renderErrorPage = (res: Response, error: CustomError) => {
  res.setHeader(`X-${config.abbreviation}-Error`, error.appErrorCode);
  res.status(error.httpErrorCode);
  res.render('error', {
    code: error.appErrorCode,
    category: error.category,
    message: error.message,
  });
};

export default renderErrorPage;
