// Filename: infoController.ts
// supplmentary pages to the application

import { Request, Response } from 'express';

export const getUsage = (_req: Request, res: Response) => {
  res.render('usage');
};

export const getAbout = (_req: Request, res: Response) => {
  res.render('about');
};
