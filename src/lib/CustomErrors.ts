// Filename: CustomErrors.ts
// custom error class for use in rendering the error page
// and exported custom errors

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
  'STM-X',
  'Unknown'
);

export const NonexistentPage404Error = new CustomError(
  'Requested page does not exist.',
  404,
  'STM-404',
  'Page'
);

export const NonexistentTaskError = new CustomError(
  'Task with the specified ID does not exist in the database.',
  400,
  'STM-NO-TASK',
  'Database'
);

export const NonNumberIDParamError = new CustomError(
  'Task ID in the URL should be a number.',
  400,
  'STM-NO-NUMBER-ID',
  'Validation'
);

export const MissingTitleError = new CustomError(
  `Task title missing. It is required.`,
  400,
  'STM-TITLE-REQUIRED',
  'Validation'
);

export const TitleLengthError = new CustomError(
  `Task title must be between 3 - 100 characters.`,
  400,
  'STM-TITLE-LENGTH',
  'Validation'
);

export const DescriptionLengthError = new CustomError(
  `Task description exceeds 500 characters.`,
  400,
  'STM-DESC-LENGTH',
  'Validation'
);
