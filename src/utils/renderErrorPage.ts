// Filename: renderErrorPage.ts
// function that takes an Express response and custom error and calls render on error view
// ensure the calling function calls return if necessary

import { Response } from 'express';
import { CustomError } from '../lib/CustomErrors.js';

export const renderErrorPage = (res: Response, error: CustomError) => {
  res.render('error', {
    title: `${error.category} Error ${error.code}`,
    description: error.message,
  });
};
