// Filename: CustomErrors.ts
// custom error class for use in rendering the error page
// and exported custom errors

// CLASS

export class CustomError extends Error {
  category: string;
  code: string;

  constructor(message: string, category: string, code: string) {
    super(message);
    this.category = category;
    this.code = code;
    this.name = 'CustomError';
  }
}

// INSTANCES

export const UnknownError = new CustomError('unknown', 'Unknown', '-1');

export const NonexistentTaskError = new CustomError(
  'Task with specified ID does not exist in database.',
  'Database',
  '-6'
);

export const NonNumberIDParamError = new CustomError(
  'Task ID should be a number.',
  'Validation',
  '-5'
);

export const MissingTitleError = new CustomError(
  `The content of the task's title was missing.`,
  'Validation',
  '-2'
);

export const TitleLengthError = new CustomError(
  `The title must be between 3 - 100 characters.`,
  'Validation',
  '-3'
);

export const DescriptionLengthError = new CustomError(
  `The description exceeds 500 characters.`,
  'Validation',
  '-4'
);
