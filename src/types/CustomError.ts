// Filename: CustomError.ts
// custom error class for use in rendering the error page

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
