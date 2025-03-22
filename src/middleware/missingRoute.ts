// Filename: missingRoute.ts
// middleware to handle any non-existing routes; returns a 404 message

import { Request, Response } from 'express';

const missingRoute = (_req: Request, res: Response) => {
  res.render('error', { title: 'Error 404', description: 'Page Not Found' });
};

export default missingRoute;
