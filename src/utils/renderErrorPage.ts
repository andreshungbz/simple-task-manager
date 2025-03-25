// Filename: renderErrorPage.ts
// function that takes an Express response and custom error and calls render on error view
// ensure the calling function calls return if necessary

import { Response } from 'express';
import { CustomError } from '../types/CustomError.js';

export const renderErrorPage = (res: Response, error: CustomError) => {
  res.render('error', {
    title: `${error.category} Error ${error.code}`,
    description: error.message,
  });
};

export const renderInvalidID = (res: Response) => {
  renderErrorPage(
    res,
    new CustomError('Task ID should be a number.', 'Validation', '-5')
  );
};

export const renderNonExistentTask = (res: Response) => {
  renderErrorPage(
    res,
    new CustomError('Task does not exist in database.', 'Database', '-6')
  );
};
