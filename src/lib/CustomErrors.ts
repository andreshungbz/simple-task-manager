// Filename: CustomErrors.ts
// custom error class for use in rendering the error page
// and exported custom errors

import { config } from '../config/app.config.js';

// CLASS

export class CustomError extends Error {
  httpErrorCode: number;
  appErrorCode: string;
  category: string;

  constructor(
    message: string,
    httpCode: number,
    appCode: string,
    category: string
  ) {
    super(message);
    this.httpErrorCode = httpCode;
    this.appErrorCode = appCode;
    this.category = category;
    this.name = 'CustomError';
  }
}

// INSTANCES

export const UnknownError = new CustomError(
  'Something went wrong!',
  500,
  `${config.abbreviation}-X`,
  'Unknown'
);

export const NonexistentPage404Error = new CustomError(
  'Requested page does not exist.',
  404,
  `${config.abbreviation}-404`,
  'Page'
);

export const NonexistentTaskError = new CustomError(
  'Task with the specified ID does not exist in the database.',
  400,
  `${config.abbreviation}-NO-TASK`,
  'Database'
);

export const NonNumberIDParamError = new CustomError(
  'Task ID in the URL should be a number.',
  400,
  `${config.abbreviation}-NO-NUMBER-ID`,
  'Validation'
);

export const MissingTitleError = new CustomError(
  `Task title missing. It is required.`,
  400,
  `${config.abbreviation}-TITLE-REQUIRED`,
  'Validation'
);

export const TitleLengthError = new CustomError(
  `Task title must be between 3 - 100 characters.`,
  400,
  `${config.abbreviation}-TITLE-LENGTH`,
  'Validation'
);

export const DescriptionLengthError = new CustomError(
  `Task description exceeds 500 characters.`,
  400,
  `${config.abbreviation}-DESC-LENGTH`,
  'Validation'
);
